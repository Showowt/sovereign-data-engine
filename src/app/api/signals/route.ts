/**
 * Signal Data API
 * GET /api/signals - Get signals for a property or owner
 *
 * Query params:
 * - property_id: Get signals for a specific property
 * - owner_id: Get signals for a specific owner
 * - signal_types[]: Filter by signal types (array)
 * - category: Filter by category (equity, life_event, wealth, annuity, dark)
 * - strength: Filter by strength (high, medium, low)
 * - since: Get signals detected after this ISO date
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type SignalCategory = "equity" | "life_event" | "wealth" | "annuity" | "dark";
type SignalStrength = "high" | "medium" | "low";

interface Signal {
  id: string;
  type: string;
  category: SignalCategory;
  strength: SignalStrength;
  description: string;
  detected_at: string;
  source: string;
  property_id: string | null;
  owner_id: string | null;
  property_address: string | null;
  owner_name: string | null;
  metadata: Record<string, string | number | boolean | null>;
}

interface SignalStats {
  total: number;
  by_category: Record<SignalCategory, number>;
  by_strength: Record<SignalStrength, number>;
  by_type: Record<string, number>;
}

interface SignalSearchResponse {
  success: boolean;
  data: Signal[];
  stats: SignalStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
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

const MOCK_SIGNALS: Signal[] = [
  {
    id: "sig_001",
    type: "HIGH_EQUITY_RATIO",
    category: "equity",
    strength: "high",
    description: "Property has 73.7% equity, well above 60% threshold",
    detected_at: "2024-02-15T10:00:00Z",
    source: "County Assessor",
    property_id: "prop_001",
    owner_id: "owner_001",
    property_address: "1847 Summit Drive, Bellevue, WA 98004",
    owner_name: "Michael Chen",
    metadata: {
      equity_pct: 73.7,
      market_value: 2850000,
      mortgage_balance: 750000,
    },
  },
  {
    id: "sig_002",
    type: "LONG_OWNERSHIP",
    category: "wealth",
    strength: "medium",
    description: "Owner has held property for 9+ years",
    detected_at: "2024-02-15T10:00:00Z",
    source: "County Recorder",
    property_id: "prop_001",
    owner_id: "owner_001",
    property_address: "1847 Summit Drive, Bellevue, WA 98004",
    owner_name: "Michael Chen",
    metadata: {
      ownership_years: 9,
      purchase_date: "2015-06-12",
    },
  },
  {
    id: "sig_003",
    type: "FREE_CLEAR_PROPERTY",
    category: "equity",
    strength: "high",
    description: "Property has no outstanding mortgage - 100% equity",
    detected_at: "2024-02-18T11:45:00Z",
    source: "County Recorder",
    property_id: "prop_002",
    owner_id: "owner_002",
    property_address: "4521 Lakeview Terrace, Kirkland, WA 98033",
    owner_name: "The Patterson Family Trust",
    metadata: {
      equity_pct: 100,
      market_value: 2100000,
      years_owned: 16,
    },
  },
  {
    id: "sig_004",
    type: "TECH_EXECUTIVE",
    category: "wealth",
    strength: "high",
    description: "Owner identified as VP Engineering at major tech company",
    detected_at: "2024-01-28T14:20:00Z",
    source: "LinkedIn Enrichment",
    property_id: null,
    owner_id: "owner_001",
    property_address: null,
    owner_name: "Michael Chen",
    metadata: {
      company: "Microsoft Corporation",
      title: "VP Engineering",
      estimated_income: 450000,
    },
  },
  {
    id: "sig_005",
    type: "TRUST_OWNERSHIP",
    category: "wealth",
    strength: "medium",
    description: "Property held in family trust - indicates estate planning",
    detected_at: "2024-02-10T09:30:00Z",
    source: "County Recorder",
    property_id: "prop_002",
    owner_id: "owner_002",
    property_address: "4521 Lakeview Terrace, Kirkland, WA 98033",
    owner_name: "The Patterson Family Trust",
    metadata: {
      trust_type: "revocable_living",
      formation_year: 2008,
    },
  },
  {
    id: "sig_006",
    type: "ANNUITY_SURRENDER_WINDOW",
    category: "annuity",
    strength: "high",
    description:
      "Annuity entering surrender-free period based on timing analysis",
    detected_at: "2024-02-05T08:00:00Z",
    source: "Annuity Timing Model",
    property_id: null,
    owner_id: "owner_005",
    property_address: null,
    owner_name: "Robert & Susan Martinez",
    metadata: {
      estimated_purchase_year: 2017,
      surrender_period_years: 7,
      free_date: "2024-03-01",
    },
  },
  {
    id: "sig_007",
    type: "PROBATE_FILING",
    category: "life_event",
    strength: "high",
    description: "Probate case filed - potential inherited property",
    detected_at: "2024-02-12T14:00:00Z",
    source: "Court Records",
    property_id: "prop_008",
    owner_id: null,
    property_address: "2345 Oak Street, Seattle, WA 98107",
    owner_name: "Estate of Harold Mitchell",
    metadata: {
      case_number: "24-4-01567-8",
      filing_date: "2024-02-10",
      estimated_value: 1200000,
    },
  },
  {
    id: "sig_008",
    type: "MORTGAGE_SATISFACTION",
    category: "equity",
    strength: "high",
    description: "Mortgage satisfaction recorded - property now free and clear",
    detected_at: "2024-02-20T10:15:00Z",
    source: "County Recorder",
    property_id: "prop_009",
    owner_id: "owner_006",
    property_address: "8901 Sunset Blvd, Las Vegas, NV 89148",
    owner_name: "Jennifer Walsh",
    metadata: {
      original_mortgage: 450000,
      satisfaction_date: "2024-02-18",
      lender: "Chase Home Mortgage",
    },
  },
  {
    id: "sig_009",
    type: "OBITUARY_DETECTED",
    category: "dark",
    strength: "high",
    description: "Property owner obituary detected - inheritance trigger",
    detected_at: "2024-02-19T06:30:00Z",
    source: "Obituary Monitor",
    property_id: "prop_010",
    owner_id: "owner_007",
    property_address: "1234 Pine Ridge Way, Scottsdale, AZ 85255",
    owner_name: "Dorothy Anderson",
    metadata: {
      obituary_source: "Arizona Republic",
      age_at_death: 84,
      property_value: 890000,
    },
  },
  {
    id: "sig_010",
    type: "SEC_INSIDER_FILING",
    category: "wealth",
    strength: "medium",
    description: "SEC Form 4 filing indicates stock sale by company insider",
    detected_at: "2024-02-21T16:00:00Z",
    source: "SEC Edgar",
    property_id: null,
    owner_id: "owner_004",
    property_address: null,
    owner_name: "Desert Sun Investments Inc",
    metadata: {
      filing_type: "Form 4",
      transaction_type: "sale",
      shares_sold: 50000,
      estimated_proceeds: 2500000,
    },
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateStats(signals: Signal[]): SignalStats {
  const stats: SignalStats = {
    total: signals.length,
    by_category: {
      equity: 0,
      life_event: 0,
      wealth: 0,
      annuity: 0,
      dark: 0,
    },
    by_strength: {
      high: 0,
      medium: 0,
      low: 0,
    },
    by_type: {},
  };

  signals.forEach((signal) => {
    stats.by_category[signal.category]++;
    stats.by_strength[signal.strength]++;
    stats.by_type[signal.type] = (stats.by_type[signal.type] || 0) + 1;
  });

  return stats;
}

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SignalSearchResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const propertyId = searchParams.get("property_id");
    const ownerId = searchParams.get("owner_id");
    const signalTypes = searchParams.getAll("signal_types[]");
    const category = searchParams.get("category") as SignalCategory | null;
    const strength = searchParams.get("strength") as SignalStrength | null;
    const since = searchParams.get("since");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50", 10),
      200,
    );

    // Validate pagination
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid pagination parameters",
          code: "INVALID_PAGINATION",
        },
        { status: 400 },
      );
    }

    // Validate at least one filter is provided
    if (!propertyId && !ownerId && signalTypes.length === 0 && !category) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one filter is required: property_id, owner_id, signal_types[], or category",
          code: "MISSING_FILTER",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with Supabase query
    // let query = supabase
    //   .from("signals")
    //   .select(`
    //     *,
    //     property:properties(address),
    //     owner:owners(name)
    //   `);
    //
    // if (propertyId) query = query.eq("property_id", propertyId);
    // if (ownerId) query = query.eq("owner_id", ownerId);
    // if (signalTypes.length > 0) query = query.in("type", signalTypes);
    // if (category) query = query.eq("category", category);
    // if (strength) query = query.eq("strength", strength);
    // if (since) query = query.gte("detected_at", since);
    //
    // const { data, error } = await query
    //   .order("detected_at", { ascending: false })
    //   .range((page - 1) * limit, page * limit - 1);

    let filteredSignals = [...MOCK_SIGNALS];

    // Apply filters
    if (propertyId) {
      filteredSignals = filteredSignals.filter(
        (s) => s.property_id === propertyId,
      );
    }

    if (ownerId) {
      filteredSignals = filteredSignals.filter((s) => s.owner_id === ownerId);
    }

    if (signalTypes.length > 0) {
      filteredSignals = filteredSignals.filter((s) =>
        signalTypes.includes(s.type),
      );
    }

    if (category) {
      filteredSignals = filteredSignals.filter((s) => s.category === category);
    }

    if (strength) {
      filteredSignals = filteredSignals.filter((s) => s.strength === strength);
    }

    if (since) {
      const sinceDate = new Date(since);
      filteredSignals = filteredSignals.filter(
        (s) => new Date(s.detected_at) >= sinceDate,
      );
    }

    // Sort by detected_at descending
    filteredSignals.sort(
      (a, b) =>
        new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime(),
    );

    // Calculate stats before pagination
    const stats = calculateStats(filteredSignals);

    // Calculate pagination
    const total = filteredSignals.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSignals = filteredSignals.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedSignals,
      stats,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Signal search error:", error);
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
