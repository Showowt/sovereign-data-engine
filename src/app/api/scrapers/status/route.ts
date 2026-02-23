/**
 * Scraper Fleet Status API
 * GET /api/scrapers/status - List all scrapers with last run info and status
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type ScraperStatus = "idle" | "running" | "error" | "disabled";

interface ScraperCounty {
  county_id: string;
  county_name: string;
  state: string;
  records_scraped: number;
  last_scraped: string | null;
}

interface ScraperRunLog {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: "success" | "failed" | "running";
  records_processed: number;
  records_new: number;
  records_updated: number;
  errors: number;
  duration_seconds: number | null;
  error_message: string | null;
}

interface Scraper {
  id: string;
  name: string;
  description: string;
  tech: string;
  frequency: string;
  status: ScraperStatus;
  enabled: boolean;
  counties: ScraperCounty[];
  last_run: ScraperRunLog | null;
  recent_runs: ScraperRunLog[];
  stats: {
    total_records: number;
    records_last_24h: number;
    success_rate: number;
    avg_run_duration_seconds: number;
  };
  config: {
    max_concurrent: number;
    rate_limit_per_minute: number;
    retry_attempts: number;
    timeout_seconds: number;
  };
  created_at: string;
  updated_at: string;
}

interface ScraperStatusResponse {
  success: boolean;
  data: Scraper[];
  summary: {
    total_scrapers: number;
    running: number;
    idle: number;
    error: number;
    disabled: number;
    total_records_all_time: number;
    records_last_24h: number;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_SCRAPERS: Scraper[] = [
  {
    id: "scraper_001",
    name: "County Assessor Scraper",
    description:
      "Scrapes property assessment data, ownership records, and tax information from county assessor websites",
    tech: "Puppeteer + Playwright",
    frequency: "Weekly",
    status: "idle",
    enabled: true,
    counties: [
      {
        county_id: "king_wa",
        county_name: "King",
        state: "WA",
        records_scraped: 145230,
        last_scraped: "2024-02-22T06:00:00Z",
      },
      {
        county_id: "clark_nv",
        county_name: "Clark",
        state: "NV",
        records_scraped: 98450,
        last_scraped: "2024-02-21T06:00:00Z",
      },
      {
        county_id: "maricopa_az",
        county_name: "Maricopa",
        state: "AZ",
        records_scraped: 187620,
        last_scraped: "2024-02-20T06:00:00Z",
      },
    ],
    last_run: {
      id: "run_001",
      started_at: "2024-02-22T06:00:00Z",
      completed_at: "2024-02-22T08:45:00Z",
      status: "success",
      records_processed: 12450,
      records_new: 342,
      records_updated: 1205,
      errors: 12,
      duration_seconds: 9900,
      error_message: null,
    },
    recent_runs: [
      {
        id: "run_001",
        started_at: "2024-02-22T06:00:00Z",
        completed_at: "2024-02-22T08:45:00Z",
        status: "success",
        records_processed: 12450,
        records_new: 342,
        records_updated: 1205,
        errors: 12,
        duration_seconds: 9900,
        error_message: null,
      },
      {
        id: "run_002",
        started_at: "2024-02-15T06:00:00Z",
        completed_at: "2024-02-15T08:30:00Z",
        status: "success",
        records_processed: 11890,
        records_new: 298,
        records_updated: 1102,
        errors: 8,
        duration_seconds: 9000,
        error_message: null,
      },
    ],
    stats: {
      total_records: 431300,
      records_last_24h: 342,
      success_rate: 98.5,
      avg_run_duration_seconds: 9450,
    },
    config: {
      max_concurrent: 5,
      rate_limit_per_minute: 30,
      retry_attempts: 3,
      timeout_seconds: 60,
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-02-22T08:45:00Z",
  },
  {
    id: "scraper_002",
    name: "County Recorder Scraper",
    description:
      "Scrapes deed transfers, mortgage recordings, liens, and satisfaction records from county recorder offices",
    tech: "Puppeteer + API Integration",
    frequency: "Daily",
    status: "running",
    enabled: true,
    counties: [
      {
        county_id: "king_wa",
        county_name: "King",
        state: "WA",
        records_scraped: 89450,
        last_scraped: "2024-02-23T02:00:00Z",
      },
      {
        county_id: "clark_nv",
        county_name: "Clark",
        state: "NV",
        records_scraped: 67230,
        last_scraped: "2024-02-23T02:00:00Z",
      },
    ],
    last_run: {
      id: "run_003",
      started_at: "2024-02-23T02:00:00Z",
      completed_at: null,
      status: "running",
      records_processed: 1245,
      records_new: 89,
      records_updated: 156,
      errors: 2,
      duration_seconds: null,
      error_message: null,
    },
    recent_runs: [
      {
        id: "run_003",
        started_at: "2024-02-23T02:00:00Z",
        completed_at: null,
        status: "running",
        records_processed: 1245,
        records_new: 89,
        records_updated: 156,
        errors: 2,
        duration_seconds: null,
        error_message: null,
      },
      {
        id: "run_004",
        started_at: "2024-02-22T02:00:00Z",
        completed_at: "2024-02-22T03:15:00Z",
        status: "success",
        records_processed: 3420,
        records_new: 245,
        records_updated: 412,
        errors: 5,
        duration_seconds: 4500,
        error_message: null,
      },
    ],
    stats: {
      total_records: 156680,
      records_last_24h: 245,
      success_rate: 99.2,
      avg_run_duration_seconds: 4200,
    },
    config: {
      max_concurrent: 3,
      rate_limit_per_minute: 20,
      retry_attempts: 3,
      timeout_seconds: 45,
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-02-23T02:30:00Z",
  },
  {
    id: "scraper_003",
    name: "Court Records Scraper",
    description:
      "Monitors court filings for probate, divorce, bankruptcy, and civil cases involving property owners",
    tech: "Playwright + OCR",
    frequency: "Daily",
    status: "idle",
    enabled: true,
    counties: [
      {
        county_id: "king_wa",
        county_name: "King",
        state: "WA",
        records_scraped: 12340,
        last_scraped: "2024-02-22T04:00:00Z",
      },
      {
        county_id: "clark_nv",
        county_name: "Clark",
        state: "NV",
        records_scraped: 8920,
        last_scraped: "2024-02-22T04:00:00Z",
      },
      {
        county_id: "maricopa_az",
        county_name: "Maricopa",
        state: "AZ",
        records_scraped: 15670,
        last_scraped: "2024-02-22T04:00:00Z",
      },
    ],
    last_run: {
      id: "run_005",
      started_at: "2024-02-22T04:00:00Z",
      completed_at: "2024-02-22T05:30:00Z",
      status: "success",
      records_processed: 892,
      records_new: 45,
      records_updated: 23,
      errors: 3,
      duration_seconds: 5400,
      error_message: null,
    },
    recent_runs: [],
    stats: {
      total_records: 36930,
      records_last_24h: 45,
      success_rate: 97.8,
      avg_run_duration_seconds: 5400,
    },
    config: {
      max_concurrent: 2,
      rate_limit_per_minute: 15,
      retry_attempts: 2,
      timeout_seconds: 90,
    },
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-02-22T05:30:00Z",
  },
  {
    id: "scraper_004",
    name: "Obituary Monitor",
    description:
      "Monitors local obituaries and cross-references with property ownership records",
    tech: "RSS + API + NLP",
    frequency: "Hourly",
    status: "idle",
    enabled: true,
    counties: [],
    last_run: {
      id: "run_006",
      started_at: "2024-02-23T01:00:00Z",
      completed_at: "2024-02-23T01:05:00Z",
      status: "success",
      records_processed: 45,
      records_new: 3,
      records_updated: 0,
      errors: 0,
      duration_seconds: 300,
      error_message: null,
    },
    recent_runs: [],
    stats: {
      total_records: 2340,
      records_last_24h: 28,
      success_rate: 100,
      avg_run_duration_seconds: 300,
    },
    config: {
      max_concurrent: 10,
      rate_limit_per_minute: 60,
      retry_attempts: 2,
      timeout_seconds: 30,
    },
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-02-23T01:05:00Z",
  },
  {
    id: "scraper_005",
    name: "SEC Edgar Scraper",
    description:
      "Monitors SEC filings (Form 4, 13F, etc.) for insider transactions and institutional holdings",
    tech: "API + XML Parser",
    frequency: "Daily",
    status: "error",
    enabled: true,
    counties: [],
    last_run: {
      id: "run_007",
      started_at: "2024-02-22T12:00:00Z",
      completed_at: "2024-02-22T12:15:00Z",
      status: "failed",
      records_processed: 0,
      records_new: 0,
      records_updated: 0,
      errors: 1,
      duration_seconds: 900,
      error_message:
        "SEC API rate limit exceeded. Retry scheduled for 2024-02-23T12:00:00Z",
    },
    recent_runs: [],
    stats: {
      total_records: 8920,
      records_last_24h: 0,
      success_rate: 94.5,
      avg_run_duration_seconds: 1800,
    },
    config: {
      max_concurrent: 1,
      rate_limit_per_minute: 10,
      retry_attempts: 5,
      timeout_seconds: 120,
    },
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-02-22T12:15:00Z",
  },
  {
    id: "scraper_006",
    name: "LinkedIn Enrichment",
    description:
      "Enriches owner profiles with professional information from LinkedIn",
    tech: "Proxied API + Manual Verification",
    frequency: "On-demand",
    status: "disabled",
    enabled: false,
    counties: [],
    last_run: {
      id: "run_008",
      started_at: "2024-02-10T14:00:00Z",
      completed_at: "2024-02-10T14:45:00Z",
      status: "success",
      records_processed: 50,
      records_new: 0,
      records_updated: 42,
      errors: 8,
      duration_seconds: 2700,
      error_message: null,
    },
    recent_runs: [],
    stats: {
      total_records: 1250,
      records_last_24h: 0,
      success_rate: 84.0,
      avg_run_duration_seconds: 2700,
    },
    config: {
      max_concurrent: 1,
      rate_limit_per_minute: 5,
      retry_attempts: 1,
      timeout_seconds: 180,
    },
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-10T14:45:00Z",
  },
];

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ScraperStatusResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Optional filters
    const status = searchParams.get("status") as ScraperStatus | null;
    const enabled = searchParams.get("enabled");

    // TODO: Replace with Supabase query
    // const { data: scrapers, error } = await supabase
    //   .from("scrapers")
    //   .select(`
    //     *,
    //     counties:scraper_counties(*),
    //     runs:scraper_runs(*, order: started_at.desc, limit: 5)
    //   `)
    //   .eq("status", status || undefined)
    //   .eq("enabled", enabled === "true" ? true : enabled === "false" ? false : undefined)
    //   .order("name");

    let filteredScrapers = [...MOCK_SCRAPERS];

    // Apply filters
    if (status) {
      filteredScrapers = filteredScrapers.filter((s) => s.status === status);
    }

    if (enabled !== null) {
      const enabledBool = enabled === "true";
      filteredScrapers = filteredScrapers.filter(
        (s) => s.enabled === enabledBool,
      );
    }

    // Calculate summary
    const summary = {
      total_scrapers: MOCK_SCRAPERS.length,
      running: MOCK_SCRAPERS.filter((s) => s.status === "running").length,
      idle: MOCK_SCRAPERS.filter((s) => s.status === "idle").length,
      error: MOCK_SCRAPERS.filter((s) => s.status === "error").length,
      disabled: MOCK_SCRAPERS.filter((s) => s.status === "disabled").length,
      total_records_all_time: MOCK_SCRAPERS.reduce(
        (sum, s) => sum + s.stats.total_records,
        0,
      ),
      records_last_24h: MOCK_SCRAPERS.reduce(
        (sum, s) => sum + s.stats.records_last_24h,
        0,
      ),
    };

    return NextResponse.json({
      success: true,
      data: filteredScrapers,
      summary,
    });
  } catch (error) {
    console.error("Scraper status error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
