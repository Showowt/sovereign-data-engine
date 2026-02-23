/**
 * Sovereign Data Engine - Base Scraper Class
 * Abstract base class for all county scrapers
 */

import type {
  CountyScraperConfig,
  ScrapedProperty,
  ScrapedDocument,
  ScrapedCourtCase,
  ScraperJobResult,
  ScraperStatus,
} from "./types";
import {
  getOrCreateCounty,
  saveProperties,
  saveDocuments,
  saveCourtCases,
  createScraperRun,
  completeScraperRun,
} from "./storage";

export abstract class BaseScraper {
  protected config: CountyScraperConfig;
  protected jobId: string;
  protected status: ScraperStatus = "idle";
  protected recordsProcessed = 0;
  protected recordsCreated = 0;
  protected recordsUpdated = 0;
  protected errors: Array<{
    message: string;
    context?: Record<string, unknown>;
    timestamp: string;
  }> = [];
  protected startedAt?: string;
  protected completedAt?: string;

  constructor(config: CountyScraperConfig) {
    this.config = config;
    this.jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Rate limiting - wait between requests
   */
  protected async rateLimit(): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, this.config.rateLimit.delayMs),
    );
  }

  /**
   * Log error and continue
   */
  protected logError(message: string, context?: Record<string, unknown>): void {
    this.errors.push({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
    console.error(`[${this.config.county}] ${message}`, context);
  }

  /**
   * Get job result
   */
  public getResult(): ScraperJobResult {
    return {
      jobId: this.jobId,
      scraperId: `${this.config.county.toLowerCase().replace(/\s+/g, "_")}_${this.config.state.toLowerCase()}`,
      status: this.status,
      startedAt: this.startedAt || new Date().toISOString(),
      completedAt: this.completedAt,
      recordsProcessed: this.recordsProcessed,
      recordsCreated: this.recordsCreated,
      recordsUpdated: this.recordsUpdated,
      errors: this.errors,
    };
  }

  /**
   * Abstract methods to be implemented by county-specific scrapers
   */
  abstract scrapeProperties(options?: {
    minValue?: number;
    maxRecords?: number;
    offset?: number;
  }): Promise<ScrapedProperty[]>;

  abstract scrapeDocuments(options?: {
    startDate?: string;
    endDate?: string;
    documentTypes?: string[];
    maxRecords?: number;
  }): Promise<ScrapedDocument[]>;

  abstract scrapeCourtCases?(options?: {
    caseTypes?: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<ScrapedCourtCase[]>;

  /**
   * Run the full scraper job
   */
  public async run(options?: {
    scrapeProperties?: boolean;
    scrapeDocuments?: boolean;
    scrapeCourt?: boolean;
    documentStartDate?: string;
    documentEndDate?: string;
    minPropertyValue?: number;
    maxRecords?: number;
    saveToSupabase?: boolean;
  }): Promise<ScraperJobResult> {
    this.status = "running";
    this.startedAt = new Date().toISOString();

    // Default to saving to Supabase
    const shouldSave = options?.saveToSupabase !== false;

    try {
      // Get or create county in Supabase
      let countyId: string | null = null;
      let runId: string | null = null;

      if (shouldSave) {
        countyId = await getOrCreateCounty(this.config);
        if (countyId) {
          runId = await createScraperRun(
            `${this.config.county}_${this.config.state}`.toLowerCase(),
            countyId,
          );
          console.log(
            `[${this.config.county}] Supabase county ID: ${countyId}`,
          );
        }
      }

      const results: {
        properties?: ScrapedProperty[];
        documents?: ScrapedDocument[];
        courtCases?: ScrapedCourtCase[];
      } = {};

      // Scrape properties
      if (options?.scrapeProperties !== false) {
        console.log(`[${this.config.county}] Starting property scrape...`);
        results.properties = await this.scrapeProperties({
          minValue: options?.minPropertyValue,
          maxRecords: options?.maxRecords,
        });
        this.recordsProcessed += results.properties.length;
        console.log(
          `[${this.config.county}] Scraped ${results.properties.length} properties`,
        );

        // Save to Supabase
        if (shouldSave && countyId && results.properties.length > 0) {
          const saveResult = await saveProperties(results.properties, countyId);
          this.recordsCreated += saveResult.created;
          if (saveResult.errors.length > 0) {
            saveResult.errors.forEach((e) => this.logError(e));
          }
        }
      }

      // Scrape documents (recorder)
      if (options?.scrapeDocuments !== false) {
        console.log(`[${this.config.county}] Starting document scrape...`);
        results.documents = await this.scrapeDocuments({
          startDate: options?.documentStartDate,
          endDate: options?.documentEndDate,
          maxRecords: options?.maxRecords,
        });
        this.recordsProcessed += results.documents.length;
        console.log(
          `[${this.config.county}] Scraped ${results.documents.length} documents`,
        );

        // Save to Supabase
        if (shouldSave && countyId && results.documents.length > 0) {
          const saveResult = await saveDocuments(results.documents, countyId);
          this.recordsCreated += saveResult.created;
          if (saveResult.errors.length > 0) {
            saveResult.errors.forEach((e) => this.logError(e));
          }
        }
      }

      // Scrape court cases (if available)
      if (options?.scrapeCourt && this.scrapeCourtCases) {
        console.log(`[${this.config.county}] Starting court case scrape...`);
        results.courtCases = await this.scrapeCourtCases({
          startDate: options?.documentStartDate,
          endDate: options?.documentEndDate,
        });
        this.recordsProcessed += results.courtCases.length;
        console.log(
          `[${this.config.county}] Scraped ${results.courtCases.length} court cases`,
        );

        // Save to Supabase
        if (shouldSave && countyId && results.courtCases.length > 0) {
          const saveResult = await saveCourtCases(results.courtCases, countyId);
          this.recordsCreated += saveResult.created;
          if (saveResult.errors.length > 0) {
            saveResult.errors.forEach((e) => this.logError(e));
          }
        }
      }

      this.status = "completed";
      this.completedAt = new Date().toISOString();

      // Complete scraper run audit record
      if (runId) {
        await completeScraperRun(runId, {
          recordsProcessed: this.recordsProcessed,
          recordsCreated: this.recordsCreated,
          recordsUpdated: this.recordsUpdated,
          errors: this.errors,
        });
      }

      return this.getResult();
    } catch (error) {
      this.status = "failed";
      this.completedAt = new Date().toISOString();
      this.logError(error instanceof Error ? error.message : "Unknown error", {
        error,
      });
      return this.getResult();
    }
  }
}
