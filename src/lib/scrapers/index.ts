/**
 * Sovereign Data Engine - Scraper Module Index
 * Unified interface for all county scrapers
 */

// Types
export * from "./types";

// Base scraper
export { BaseScraper } from "./base-scraper";

// County scrapers
export {
  PalmBeachScraper,
  createPalmBeachScraper,
} from "./counties/palm-beach";
export { SanMateoScraper, createSanMateoScraper } from "./counties/san-mateo";
export {
  MiamiDadeScraper,
  createMiamiDadeScraper,
} from "./counties/miami-dade";
export { MaricopaScraper, createMaricopaScraper } from "./counties/maricopa";
export { ClarkScraper, createClarkScraper } from "./counties/clark";
export { KingScraper, createKingScraper } from "./counties/king";

// Skip tracing
export {
  skipTraceRecord,
  skipTraceBatch,
  parseOwnerName,
  parseAddress,
} from "./skip-trace";

// Scraper factory
import { createPalmBeachScraper } from "./counties/palm-beach";
import { createSanMateoScraper } from "./counties/san-mateo";
import { createMiamiDadeScraper } from "./counties/miami-dade";
import { createMaricopaScraper } from "./counties/maricopa";
import { createClarkScraper } from "./counties/clark";
import { createKingScraper } from "./counties/king";
import type { BaseScraper } from "./base-scraper";

export type CountyId =
  | "palm_beach_fl"
  | "san_mateo_ca"
  | "miami_dade_fl"
  | "maricopa_az"
  | "clark_nv"
  | "king_wa";

const SCRAPER_REGISTRY: Record<CountyId, () => BaseScraper> = {
  palm_beach_fl: createPalmBeachScraper,
  san_mateo_ca: createSanMateoScraper,
  miami_dade_fl: createMiamiDadeScraper,
  maricopa_az: createMaricopaScraper,
  clark_nv: createClarkScraper,
  king_wa: createKingScraper,
};

/**
 * Create a scraper instance for a specific county
 */
export function createScraper(countyId: CountyId): BaseScraper {
  const factory = SCRAPER_REGISTRY[countyId];
  if (!factory) {
    throw new Error(`Unknown county: ${countyId}`);
  }
  return factory();
}

/**
 * Get list of all available counties
 */
export function getAvailableCounties(): CountyId[] {
  return Object.keys(SCRAPER_REGISTRY) as CountyId[];
}

/**
 * Run scraper for a specific county
 */
export async function runCountyScraper(
  countyId: CountyId,
  options?: {
    scrapeProperties?: boolean;
    scrapeDocuments?: boolean;
    scrapeCourt?: boolean;
    documentStartDate?: string;
    documentEndDate?: string;
    minPropertyValue?: number;
    maxRecords?: number;
  },
) {
  const scraper = createScraper(countyId);
  return scraper.run(options);
}

/**
 * Run all county scrapers
 */
export async function runAllScrapers(options?: {
  scrapeProperties?: boolean;
  scrapeDocuments?: boolean;
  scrapeCourt?: boolean;
  maxRecords?: number;
}) {
  const results = [];

  for (const countyId of getAvailableCounties()) {
    console.log(`\n========== Starting ${countyId} ==========\n`);
    const result = await runCountyScraper(countyId, options);
    results.push({ countyId, result });
    console.log(`\n========== Completed ${countyId} ==========\n`);

    // Pause between counties to avoid overwhelming systems
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  return results;
}
