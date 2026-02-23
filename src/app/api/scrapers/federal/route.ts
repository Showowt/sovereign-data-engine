/**
 * Federal Data Scraper API
 * POST /api/scrapers/federal - Pull data from federal sources
 *
 * Sources (all 100% legal public data):
 * - SEC EDGAR: Insider transactions, corporate filings
 * - Census ACS: County/zip demographics, income, home values
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCompanyFilings,
  searchForm4Filings,
  getMajorTechCompanies,
} from "@/lib/scrapers/federal/sec-edgar";
import {
  getAllTargetCountyDemographics,
  getHighIncomeZipCodes,
  STATE_FIPS,
} from "@/lib/scrapers/federal/census";

interface FederalScraperRequest {
  sources: Array<"sec" | "census" | "all">;
  options?: {
    secCompanies?: string[]; // CIKs to fetch
    censusStates?: string[]; // State FIPS codes
    minIncome?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FederalScraperRequest;
    const sources = body.sources || ["all"];
    const results: Record<string, unknown> = {};

    // SEC EDGAR
    if (sources.includes("sec") || sources.includes("all")) {
      console.log("[Federal] Fetching SEC EDGAR data...");

      const secResults: Record<string, unknown> = {};

      // Get major tech company filings
      const companies = body.options?.secCompanies
        ? body.options.secCompanies.map((cik) => ({ name: "Custom", cik }))
        : getMajorTechCompanies();

      const companyData = [];
      for (const company of companies.slice(0, 5)) {
        // Limit to 5 for speed
        const data = await getCompanyFilings(company.cik);
        if (data) {
          companyData.push(data);
        }
      }
      secResults.companies = companyData;

      // Get recent Form 4 insider transactions
      const insiders = await searchForm4Filings({
        startDate: "2026-01-01",
        endDate: "2026-02-23",
        limit: 50,
      });
      secResults.insiderTransactions = insiders;

      results.sec = secResults;
    }

    // Census ACS
    if (sources.includes("census") || sources.includes("all")) {
      console.log("[Federal] Fetching Census ACS data...");

      const censusResults: Record<string, unknown> = {};

      // Get target county demographics
      const counties = await getAllTargetCountyDemographics();
      censusResults.targetCounties = counties;

      // Get high-income zip codes for Florida (sample)
      const flZipCodes = await getHighIncomeZipCodes(
        STATE_FIPS.FL,
        body.options?.minIncome || 100000,
      );
      censusResults.highIncomeZipCodes = {
        state: "FL",
        count: flZipCodes.length,
        topZips: flZipCodes.slice(0, 20),
      };

      results.census = censusResults;
    }

    return NextResponse.json({
      success: true,
      message: "Federal data scrape completed",
      data: results,
    });
  } catch (error) {
    console.error("[Federal API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape federal data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      availableSources: ["sec", "census", "all"],
      description: {
        sec: "SEC EDGAR - Insider transactions, corporate filings",
        census: "Census ACS - Demographics, income, home values",
      },
      usage: {
        method: "POST",
        body: {
          sources: ["sec", "census"],
          options: {
            secCompanies: "array of CIKs (optional)",
            censusStates: "array of state FIPS codes (optional)",
            minIncome:
              "minimum income threshold for zip codes (default: 100000)",
          },
        },
      },
    },
  });
}
