/**
 * Dashboard Analytics API
 * GET /api/analytics - Aggregate stats for dashboard
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface CountyStats {
  county_id: string;
  county_name: string;
  state: string;
  total_properties: number;
  total_owners: number;
  avg_equity_pct: number;
  total_equity_value: number;
  signals_count: number;
  leads_count: number;
  last_scraped: string;
  coverage_pct: number;
}

interface LeadsByStatus {
  new: number;
  contacted: number;
  qualified: number;
  proposal_sent: number;
  negotiating: number;
  won: number;
  lost: number;
  nurture: number;
}

interface SignalsByType {
  equity: {
    HIGH_EQUITY_RATIO: number;
    FREE_CLEAR_PROPERTY: number;
    MORTGAGE_SATISFACTION: number;
    MORTGAGE_MATURITY: number;
  };
  life_event: {
    PROBATE_FILING: number;
    DIVORCE_FILING: number;
    BANKRUPTCY_FILING: number;
    AGE_RETIREMENT_WINDOW: number;
  };
  wealth: {
    TECH_EXECUTIVE: number;
    MULTI_PROPERTY_OWNER: number;
    TRUST_OWNERSHIP: number;
    LONG_OWNERSHIP: number;
    HIGH_INCOME_OCCUPATION: number;
  };
  annuity: {
    ANNUITY_SURRENDER_WINDOW: number;
    ANNUITY_RENEWAL_DUE: number;
  };
  dark: {
    OBITUARY_DETECTED: number;
    ESTATE_SALE_LISTING: number;
  };
}

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface AnalyticsData {
  summary: {
    total_properties: number;
    total_owners: number;
    total_signals: number;
    total_leads: number;
    total_equity_tracked: number;
    avg_lead_score: number;
    conversion_rate: number;
    pipeline_value: number;
  };
  leads_by_status: LeadsByStatus;
  signals_by_type: SignalsByType;
  county_coverage: CountyStats[];
  trends: {
    properties_added: TimeSeriesDataPoint[];
    signals_detected: TimeSeriesDataPoint[];
    leads_created: TimeSeriesDataPoint[];
    equity_tracked: TimeSeriesDataPoint[];
  };
  top_opportunities: {
    id: string;
    owner_name: string;
    total_equity: number;
    signal_count: number;
    score: number;
  }[];
  scraper_health: {
    scrapers_active: number;
    scrapers_total: number;
    last_24h_records: number;
    success_rate: number;
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  generated_at: string;
  cache_expires_at: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_ANALYTICS: AnalyticsData = {
  summary: {
    total_properties: 431300,
    total_owners: 287450,
    total_signals: 45230,
    total_leads: 892,
    total_equity_tracked: 28500000000,
    avg_lead_score: 78.5,
    conversion_rate: 12.4,
    pipeline_value: 125000000,
  },
  leads_by_status: {
    new: 124,
    contacted: 215,
    qualified: 189,
    proposal_sent: 87,
    negotiating: 42,
    won: 156,
    lost: 67,
    nurture: 12,
  },
  signals_by_type: {
    equity: {
      HIGH_EQUITY_RATIO: 12450,
      FREE_CLEAR_PROPERTY: 8920,
      MORTGAGE_SATISFACTION: 3420,
      MORTGAGE_MATURITY: 2890,
    },
    life_event: {
      PROBATE_FILING: 1245,
      DIVORCE_FILING: 892,
      BANKRUPTCY_FILING: 234,
      AGE_RETIREMENT_WINDOW: 4560,
    },
    wealth: {
      TECH_EXECUTIVE: 2340,
      MULTI_PROPERTY_OWNER: 5670,
      TRUST_OWNERSHIP: 3450,
      LONG_OWNERSHIP: 8920,
      HIGH_INCOME_OCCUPATION: 1890,
    },
    annuity: {
      ANNUITY_SURRENDER_WINDOW: 1234,
      ANNUITY_RENEWAL_DUE: 567,
    },
    dark: {
      OBITUARY_DETECTED: 456,
      ESTATE_SALE_LISTING: 123,
    },
  },
  county_coverage: [
    {
      county_id: "king_wa",
      county_name: "King",
      state: "WA",
      total_properties: 145230,
      total_owners: 98450,
      avg_equity_pct: 68.5,
      total_equity_value: 12500000000,
      signals_count: 18920,
      leads_count: 342,
      last_scraped: "2024-02-22T08:45:00Z",
      coverage_pct: 94.2,
    },
    {
      county_id: "clark_nv",
      county_name: "Clark",
      state: "NV",
      total_properties: 98450,
      total_owners: 67230,
      avg_equity_pct: 72.3,
      total_equity_value: 8200000000,
      signals_count: 12340,
      leads_count: 278,
      last_scraped: "2024-02-22T03:15:00Z",
      coverage_pct: 89.7,
    },
    {
      county_id: "maricopa_az",
      county_name: "Maricopa",
      state: "AZ",
      total_properties: 187620,
      total_owners: 121770,
      avg_equity_pct: 65.8,
      total_equity_value: 7800000000,
      signals_count: 13970,
      leads_count: 272,
      last_scraped: "2024-02-22T05:30:00Z",
      coverage_pct: 91.5,
    },
  ],
  trends: {
    properties_added: [
      { date: "2024-02-17", value: 342 },
      { date: "2024-02-18", value: 298 },
      { date: "2024-02-19", value: 412 },
      { date: "2024-02-20", value: 387 },
      { date: "2024-02-21", value: 456 },
      { date: "2024-02-22", value: 342 },
      { date: "2024-02-23", value: 189 },
    ],
    signals_detected: [
      { date: "2024-02-17", value: 89 },
      { date: "2024-02-18", value: 123 },
      { date: "2024-02-19", value: 156 },
      { date: "2024-02-20", value: 98 },
      { date: "2024-02-21", value: 187 },
      { date: "2024-02-22", value: 145 },
      { date: "2024-02-23", value: 78 },
    ],
    leads_created: [
      { date: "2024-02-17", value: 12 },
      { date: "2024-02-18", value: 8 },
      { date: "2024-02-19", value: 15 },
      { date: "2024-02-20", value: 11 },
      { date: "2024-02-21", value: 19 },
      { date: "2024-02-22", value: 14 },
      { date: "2024-02-23", value: 6 },
    ],
    equity_tracked: [
      { date: "2024-02-17", value: 145000000 },
      { date: "2024-02-18", value: 128000000 },
      { date: "2024-02-19", value: 167000000 },
      { date: "2024-02-20", value: 152000000 },
      { date: "2024-02-21", value: 189000000 },
      { date: "2024-02-22", value: 134000000 },
      { date: "2024-02-23", value: 78000000 },
    ],
  },
  top_opportunities: [
    {
      id: "owner_004",
      owner_name: "Desert Sun Investments Inc",
      total_equity: 35000000,
      signal_count: 15,
      score: 92,
    },
    {
      id: "owner_003",
      owner_name: "Evergreen Holdings LLC",
      total_equity: 19200000,
      signal_count: 6,
      score: 72,
    },
    {
      id: "owner_005",
      owner_name: "Robert & Susan Martinez",
      total_equity: 9800000,
      signal_count: 14,
      score: 94,
    },
    {
      id: "owner_002",
      owner_name: "The Patterson Family Trust",
      total_equity: 8750000,
      signal_count: 12,
      score: 88,
    },
    {
      id: "owner_001",
      owner_name: "Michael Chen",
      total_equity: 4200000,
      signal_count: 8,
      score: 85,
    },
  ],
  scraper_health: {
    scrapers_active: 4,
    scrapers_total: 6,
    last_24h_records: 660,
    success_rate: 97.8,
  },
};

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AnalyticsResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Optional filters
    const dateRangeStart = searchParams.get("date_range_start");
    const dateRangeEnd = searchParams.get("date_range_end");
    const countyFilter = searchParams.get("county");

    // Validate date range if provided
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date_range_start format. Use ISO 8601 format.",
            code: "INVALID_DATE_FORMAT",
          },
          { status: 400 },
        );
      }
    }

    if (dateRangeEnd) {
      const endDate = new Date(dateRangeEnd);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date_range_end format. Use ISO 8601 format.",
            code: "INVALID_DATE_FORMAT",
          },
          { status: 400 },
        );
      }
    }

    // TODO: Replace with Supabase aggregation queries
    // Summary stats
    // const { data: propertiesCount } = await supabase
    //   .from("properties")
    //   .select("*", { count: "exact", head: true });
    //
    // const { data: ownersCount } = await supabase
    //   .from("owners")
    //   .select("*", { count: "exact", head: true });
    //
    // const { data: signalsCount } = await supabase
    //   .from("signals")
    //   .select("*", { count: "exact", head: true });
    //
    // const { data: leadsCount } = await supabase
    //   .from("leads")
    //   .select("*", { count: "exact", head: true });
    //
    // Leads by status
    // const { data: leadsByStatus } = await supabase
    //   .from("leads")
    //   .select("status")
    //   .then(data => groupBy(data, "status"));
    //
    // Signals by type
    // const { data: signalsByType } = await supabase
    //   .from("signals")
    //   .select("type, category")
    //   .then(data => groupBy(data, ["category", "type"]));
    //
    // County coverage
    // const { data: countyCoverage } = await supabase
    //   .rpc("get_county_stats");
    //
    // Trends (last 7 days)
    // const { data: trends } = await supabase
    //   .rpc("get_daily_trends", { days: 7 });
    //
    // Top opportunities
    // const { data: topOpportunities } = await supabase
    //   .from("owners")
    //   .select("id, name, total_equity, signals:owner_signals(count)")
    //   .order("total_equity", { ascending: false })
    //   .limit(5);

    let analyticsData = { ...MOCK_ANALYTICS };

    // Apply county filter if provided
    if (countyFilter) {
      analyticsData.county_coverage = analyticsData.county_coverage.filter(
        (c) =>
          c.county_id === countyFilter ||
          c.county_name.toLowerCase() === countyFilter.toLowerCase(),
      );
    }

    // Cache for 5 minutes
    const cacheExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      data: analyticsData,
      generated_at: new Date().toISOString(),
      cache_expires_at: cacheExpiresAt,
    });
  } catch (error) {
    console.error("Analytics error:", error);
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
