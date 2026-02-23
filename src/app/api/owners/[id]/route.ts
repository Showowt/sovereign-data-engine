/**
 * Single Owner Profile API
 * GET /api/owners/[id] - Get full owner profile with all properties and signals
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface OwnerProperty {
  id: string;
  apn: string;
  address: string;
  city: string;
  county: string;
  state: string;
  property_type: "residential" | "commercial" | "land" | "multi_family";
  market_value: number;
  equity_amount: number;
  equity_pct: number;
  purchase_date: string | null;
  signal_count: number;
}

interface OwnerSignal {
  id: string;
  type: string;
  category: "equity" | "life_event" | "wealth" | "annuity" | "dark";
  strength: "high" | "medium" | "low";
  description: string;
  detected_at: string;
  source: string;
  property_id: string | null;
}

interface WealthEstimate {
  total_net_worth: number;
  confidence: number;
  breakdown: {
    real_estate: number;
    securities: number;
    retirement_accounts: number;
    other_assets: number;
    liabilities: number;
  };
  data_sources: string[];
  last_updated: string;
}

interface EntityMatch {
  match_type: "name" | "address" | "phone" | "email" | "ssn_last4";
  confidence: number;
  matched_record: string;
  source: string;
}

interface OwnerProfile {
  id: string;
  name: string;
  type: "individual" | "trust" | "llc" | "corporation";
  mailing_address: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  age: number | null;
  occupation: string | null;
  employer: string | null;
  linkedin_url: string | null;
  confidence_score: number;
  entity_matches: EntityMatch[];
  properties: OwnerProperty[];
  signals: OwnerSignal[];
  wealth_estimate: WealthEstimate;
  summary_stats: {
    total_properties: number;
    total_property_value: number;
    total_equity: number;
    avg_equity_pct: number;
    high_priority_signals: number;
    counties_present: string[];
  };
  created_at: string;
  updated_at: string;
}

interface OwnerProfileResponse {
  success: boolean;
  data: OwnerProfile;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_OWNER_PROFILE: OwnerProfile = {
  id: "owner_001",
  name: "Michael Chen",
  type: "individual",
  mailing_address: "1847 Summit Drive, Bellevue, WA 98004",
  phone: "+1-425-555-0142",
  email: "mchen@techventures.com",
  date_of_birth: "1972-08-15",
  age: 52,
  occupation: "VP Engineering",
  employer: "Microsoft Corporation",
  linkedin_url: "https://linkedin.com/in/michaelchen-tech",
  confidence_score: 0.95,
  entity_matches: [
    {
      match_type: "name",
      confidence: 1.0,
      matched_record: "CHEN, MICHAEL T",
      source: "King County Assessor",
    },
    {
      match_type: "address",
      confidence: 0.98,
      matched_record: "1847 SUMMIT DR BELLEVUE WA 98004",
      source: "King County Recorder",
    },
    {
      match_type: "email",
      confidence: 0.92,
      matched_record: "mchen@techventures.com",
      source: "LinkedIn Enrichment",
    },
  ],
  properties: [
    {
      id: "prop_001",
      apn: "123-456-789",
      address: "1847 Summit Drive",
      city: "Bellevue",
      county: "King",
      state: "WA",
      property_type: "residential",
      market_value: 2850000,
      equity_amount: 2100000,
      equity_pct: 73.7,
      purchase_date: "2015-06-12",
      signal_count: 4,
    },
    {
      id: "prop_006",
      apn: "234-567-001",
      address: "892 Lake Washington Blvd",
      city: "Kirkland",
      county: "King",
      state: "WA",
      property_type: "residential",
      market_value: 1650000,
      equity_amount: 1400000,
      equity_pct: 84.8,
      purchase_date: "2018-03-22",
      signal_count: 2,
    },
    {
      id: "prop_007",
      apn: "345-678-002",
      address: "4500 California Ave SW Unit 302",
      city: "Seattle",
      county: "King",
      state: "WA",
      property_type: "multi_family",
      market_value: 700000,
      equity_amount: 700000,
      equity_pct: 100,
      purchase_date: "2012-09-15",
      signal_count: 2,
    },
  ],
  signals: [
    {
      id: "sig_001",
      type: "HIGH_EQUITY_RATIO",
      category: "equity",
      strength: "high",
      description:
        "Primary residence has 73.7% equity, well above 60% threshold",
      detected_at: "2024-02-15T10:00:00Z",
      source: "County Assessor",
      property_id: "prop_001",
    },
    {
      id: "sig_002",
      type: "LONG_OWNERSHIP",
      category: "wealth",
      strength: "medium",
      description: "Owner has held primary property for 9+ years",
      detected_at: "2024-02-15T10:00:00Z",
      source: "County Recorder",
      property_id: "prop_001",
    },
    {
      id: "sig_003",
      type: "FREE_CLEAR_PROPERTY",
      category: "equity",
      strength: "high",
      description: "Seattle condo is 100% free and clear",
      detected_at: "2024-02-12T09:00:00Z",
      source: "County Recorder",
      property_id: "prop_007",
    },
    {
      id: "sig_004",
      type: "TECH_EXECUTIVE",
      category: "wealth",
      strength: "high",
      description: "Owner identified as VP Engineering at Microsoft",
      detected_at: "2024-01-28T14:20:00Z",
      source: "LinkedIn Enrichment",
      property_id: null,
    },
    {
      id: "sig_005",
      type: "MULTI_PROPERTY_OWNER",
      category: "wealth",
      strength: "medium",
      description: "Owner controls 3 properties across King County",
      detected_at: "2024-02-01T11:00:00Z",
      source: "Entity Resolution",
      property_id: null,
    },
    {
      id: "sig_006",
      type: "AGE_RETIREMENT_WINDOW",
      category: "life_event",
      strength: "high",
      description: "Owner is 52 years old, entering retirement planning window",
      detected_at: "2024-02-10T08:00:00Z",
      source: "Public Records",
      property_id: null,
    },
    {
      id: "sig_007",
      type: "HIGH_INCOME_OCCUPATION",
      category: "wealth",
      strength: "high",
      description: "VP-level tech executive, estimated income $400K+",
      detected_at: "2024-01-28T14:20:00Z",
      source: "LinkedIn Enrichment",
      property_id: null,
    },
    {
      id: "sig_008",
      type: "STOCK_VESTING_LIKELY",
      category: "wealth",
      strength: "medium",
      description:
        "Microsoft executive likely has significant stock compensation",
      detected_at: "2024-01-28T14:20:00Z",
      source: "SEC Edgar Cross-Reference",
      property_id: null,
    },
  ],
  wealth_estimate: {
    total_net_worth: 8500000,
    confidence: 0.78,
    breakdown: {
      real_estate: 4200000,
      securities: 2800000,
      retirement_accounts: 1200000,
      other_assets: 500000,
      liabilities: 200000,
    },
    data_sources: [
      "County Assessor Records",
      "County Recorder Mortgages",
      "LinkedIn Professional Profile",
      "SEC Edgar Cross-Reference",
      "Estimated Savings Models",
    ],
    last_updated: "2024-02-15T10:00:00Z",
  },
  summary_stats: {
    total_properties: 3,
    total_property_value: 5200000,
    total_equity: 4200000,
    avg_equity_pct: 86.2,
    high_priority_signals: 5,
    counties_present: ["King"],
  },
  created_at: "2024-01-10T08:00:00Z",
  updated_at: "2024-02-20T14:30:00Z",
};

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<OwnerProfileResponse | ErrorResponse>> {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Owner ID is required",
          code: "MISSING_ID",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with Supabase query
    // const { data: owner, error: ownerError } = await supabase
    //   .from("owners")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    //
    // if (ownerError || !owner) {
    //   return NextResponse.json(
    //     { success: false, error: "Owner not found", code: "NOT_FOUND" },
    //     { status: 404 }
    //   );
    // }
    //
    // const { data: properties } = await supabase
    //   .from("properties")
    //   .select("*")
    //   .eq("owner_id", id);
    //
    // const { data: signals } = await supabase
    //   .from("owner_signals")
    //   .select("*")
    //   .eq("owner_id", id)
    //   .order("detected_at", { ascending: false });
    //
    // const { data: entityMatches } = await supabase
    //   .from("entity_matches")
    //   .select("*")
    //   .eq("owner_id", id);
    //
    // const { data: wealthEstimate } = await supabase
    //   .from("wealth_estimates")
    //   .select("*")
    //   .eq("owner_id", id)
    //   .single();

    // Mock: Return sample owner if ID matches, otherwise 404
    if (id === "owner_001") {
      return NextResponse.json({
        success: true,
        data: MOCK_OWNER_PROFILE,
      });
    }

    // Return 404 for unknown IDs
    return NextResponse.json(
      {
        success: false,
        error: "Owner not found",
        code: "NOT_FOUND",
      },
      { status: 404 },
    );
  } catch (error) {
    console.error("Owner profile error:", error);
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
