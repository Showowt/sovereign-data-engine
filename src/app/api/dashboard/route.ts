/**
 * Dashboard API - Real Data from Federal Scrapers + Supabase
 * GET /api/dashboard - Fetch live data for the dashboard
 *
 * Combines:
 * - Census ACS demographics for target counties
 * - SEC EDGAR insider transactions
 * - Supabase property/scraper statistics
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase-server";
import {
  getAllTargetCountyDemographics,
  getHighIncomeZipCodes,
  calculateWealthScore,
  STATE_FIPS,
  type CountyDemographics,
  type ZipCodeDemographics,
} from "@/lib/scrapers/federal/census";
import {
  searchForm4Filings,
  getMajorTechCompanies,
  getCompanyFilings,
  type SECInsider,
} from "@/lib/scrapers/federal/sec-edgar";

interface DashboardCounty {
  name: string;
  state: string;
  medianIncome: number;
  medianHomeValue: number;
  medianAge: number;
  population: number;
  wealthScore?: number;
  propertyCount?: number;
  lastScraped?: string;
}

interface DashboardData {
  counties: DashboardCounty[];
  secInsiders: SECInsider[];
  highIncomeZips: {
    state: string;
    count: number;
    topZips: ZipCodeDemographics[];
  }[];
  supabaseStats: {
    totalCounties: number;
    totalProperties: number;
    totalDocuments: number;
    recentScraperRuns: Array<{
      id: string;
      county: string;
      status: string;
      recordsProcessed: number;
      completedAt: string | null;
    }>;
  };
  lastUpdated: string;
}

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<{ success: boolean; data?: DashboardData; error?: string }>
> {
  try {
    // Fetch real data in parallel
    const [censusData, secData, zipData] = await Promise.all([
      getAllTargetCountyDemographics().catch(() => [] as CountyDemographics[]),
      searchForm4Filings({ limit: 20 }).catch(() => [] as SECInsider[]),
      getHighIncomeZipCodes(STATE_FIPS.FL, 150000).catch(
        () => [] as ZipCodeDemographics[],
      ),
    ]);

    // Format Census data for dashboard
    const counties: DashboardCounty[] = censusData.map((c) => ({
      name: c.countyName.replace(" County", "").replace(/, \w+$/, ""),
      state: getStateAbbrev(c.stateFips),
      medianIncome: c.medianIncome,
      medianHomeValue: c.medianHomeValue,
      medianAge: c.medianAge,
      population: c.totalPopulation || 0,
    }));

    // Get Supabase stats if configured
    let supabaseStats = {
      totalCounties: 0,
      totalProperties: 0,
      totalDocuments: 0,
      recentScraperRuns: [] as Array<{
        id: string;
        county: string;
        status: string;
        recordsProcessed: number;
        completedAt: string | null;
      }>,
    };

    if (isSupabaseConfigured()) {
      const supabase = getServerSupabase();

      // Fetch counts in parallel
      const [countiesResult, propertiesResult, documentsResult, runsResult] =
        await Promise.all([
          supabase.from("counties").select("*", { count: "exact", head: true }),
          supabase
            .from("properties")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("documents")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("scraper_runs")
            .select(
              "id, county_id, status, records_processed, completed_at, counties(name)",
            )
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

      supabaseStats = {
        totalCounties: countiesResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalDocuments: documentsResult.count || 0,
        recentScraperRuns: (runsResult.data || []).map((run: any) => ({
          id: run.id,
          county: run.counties?.name || "Unknown",
          status: run.status,
          recordsProcessed: run.records_processed || 0,
          completedAt: run.completed_at,
        })),
      };

      // Enhance counties with property counts from Supabase
      const { data: countyData } = await supabase
        .from("counties")
        .select("name, state");

      if (countyData) {
        for (const county of counties) {
          const match = countyData.find(
            (c: any) =>
              c.name.toLowerCase().includes(county.name.toLowerCase()) &&
              c.state === county.state,
          );
          if (match) {
            const { count } = await supabase
              .from("properties")
              .select("*", { count: "exact", head: true })
              .eq("county_id", match.name);
            county.propertyCount = count || 0;
          }
        }
      }
    }

    // Calculate wealth scores for top FL zip codes
    const topZipsWithScores = zipData.slice(0, 10).map((zip) => ({
      ...zip,
      wealthScore: calculateWealthScore(zip),
    }));

    const dashboardData: DashboardData = {
      counties,
      secInsiders: secData,
      highIncomeZips: [
        {
          state: "FL",
          count: zipData.length,
          topZips: topZipsWithScores,
        },
      ],
      supabaseStats,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("[Dashboard API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}

// Helper to convert FIPS to state abbreviation
function getStateAbbrev(fips: string): string {
  const fipsMap: Record<string, string> = {
    "12": "FL",
    "06": "CA",
    "04": "AZ",
    "32": "NV",
    "53": "WA",
  };
  return fipsMap[fips] || fips;
}
