/**
 * Scraper Execution API
 * POST /api/scrapers/run - Trigger a scraper job
 *
 * Body:
 * {
 *   "county": "palm_beach_fl",  // or "all" for all counties
 *   "options": {
 *     "scrapeProperties": true,
 *     "scrapeDocuments": true,
 *     "scrapeCourt": true,
 *     "maxRecords": 100
 *   }
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createScraper,
  runAllScrapers,
  getAvailableCounties,
  type CountyId,
} from "@/lib/scrapers";

interface RunScraperRequest {
  county: CountyId | "all";
  options?: {
    scrapeProperties?: boolean;
    scrapeDocuments?: boolean;
    scrapeCourt?: boolean;
    documentStartDate?: string;
    documentEndDate?: string;
    minPropertyValue?: number;
    maxRecords?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RunScraperRequest;

    // Validate county
    const validCounties = [...getAvailableCounties(), "all"];
    if (!validCounties.includes(body.county)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid county. Valid options: ${validCounties.join(", ")}`,
          code: "INVALID_COUNTY",
        },
        { status: 400 },
      );
    }

    const options = body.options || {};

    // Run single county or all
    if (body.county === "all") {
      console.log("[Scraper API] Running all county scrapers...");

      const results = await runAllScrapers(options);

      const summary = {
        totalCounties: results.length,
        totalRecords: results.reduce(
          (sum, r) => sum + r.result.recordsProcessed,
          0,
        ),
        byCounty: results.map((r) => ({
          county: r.countyId,
          status: r.result.status,
          recordsProcessed: r.result.recordsProcessed,
          errors: r.result.errors.length,
        })),
      };

      return NextResponse.json({
        success: true,
        message: "All scrapers completed",
        data: summary,
        results,
      });
    } else {
      console.log(`[Scraper API] Running ${body.county} scraper...`);

      const scraper = createScraper(body.county);
      const result = await scraper.run(options);

      return NextResponse.json({
        success: true,
        message: `Scraper ${body.county} completed`,
        data: result,
      });
    }
  } catch (error) {
    console.error("[Scraper API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run scraper",
        code: "SCRAPER_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Return available counties and their status
  const counties = getAvailableCounties();

  return NextResponse.json({
    success: true,
    data: {
      availableCounties: counties,
      totalCounties: counties.length,
      usage: {
        method: "POST",
        body: {
          county:
            "palm_beach_fl | san_mateo_ca | miami_dade_fl | maricopa_az | clark_nv | king_wa | all",
          options: {
            scrapeProperties: "boolean (default: true)",
            scrapeDocuments: "boolean (default: true)",
            scrapeCourt: "boolean (default: false)",
            maxRecords: "number (default: 100)",
          },
        },
      },
    },
  });
}
