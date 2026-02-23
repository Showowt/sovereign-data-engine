/**
 * Single Property Detail API
 * GET /api/properties/[id] - Get full property details
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PropertyOwner {
  id: string;
  name: string;
  type: "individual" | "trust" | "llc" | "corporation";
  mailing_address: string;
  phone: string | null;
  email: string | null;
  estimated_net_worth: number | null;
  properties_owned: number;
  total_equity: number;
}

interface PropertySignal {
  id: string;
  type: string;
  category: "equity" | "life_event" | "wealth" | "annuity" | "dark";
  strength: "high" | "medium" | "low";
  description: string;
  detected_at: string;
  source: string;
}

interface CourtRecord {
  id: string;
  case_number: string;
  case_type: string;
  filing_date: string;
  status: "open" | "closed" | "dismissed";
  parties: string[];
  description: string;
}

interface MortgageHistory {
  id: string;
  lender: string;
  amount: number;
  date_recorded: string;
  type: "purchase" | "refinance" | "heloc";
  interest_rate: number | null;
  term_years: number | null;
}

interface TaxHistory {
  year: number;
  assessed_value: number;
  tax_amount: number;
  paid: boolean;
}

interface PropertyDetail {
  id: string;
  apn: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  property_type: "residential" | "commercial" | "land" | "multi_family";
  year_built: number | null;
  square_feet: number | null;
  lot_size: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  assessed_value: number;
  market_value: number;
  equity_amount: number;
  equity_pct: number;
  mortgage_balance: number | null;
  purchase_date: string | null;
  purchase_price: number | null;
  zoning: string | null;
  legal_description: string | null;
  owner: PropertyOwner;
  signals: PropertySignal[];
  court_records: CourtRecord[];
  mortgage_history: MortgageHistory[];
  tax_history: TaxHistory[];
  created_at: string;
  updated_at: string;
}

interface PropertyDetailResponse {
  success: boolean;
  data: PropertyDetail;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PROPERTY_DETAIL: PropertyDetail = {
  id: "prop_001",
  apn: "123-456-789",
  address: "1847 Summit Drive",
  city: "Bellevue",
  county: "King",
  state: "WA",
  zip: "98004",
  property_type: "residential",
  year_built: 2008,
  square_feet: 4250,
  lot_size: "0.45 acres",
  bedrooms: 5,
  bathrooms: 4.5,
  assessed_value: 2450000,
  market_value: 2850000,
  equity_amount: 2100000,
  equity_pct: 73.7,
  mortgage_balance: 750000,
  purchase_date: "2015-06-12",
  purchase_price: 1650000,
  zoning: "R-10",
  legal_description: "LOT 15 BLK 3 SUMMIT ESTATES DIV 2",
  owner: {
    id: "owner_001",
    name: "Michael Chen",
    type: "individual",
    mailing_address: "1847 Summit Drive, Bellevue, WA 98004",
    phone: "+1-425-555-0142",
    email: "mchen@techventures.com",
    estimated_net_worth: 8500000,
    properties_owned: 3,
    total_equity: 4200000,
  },
  signals: [
    {
      id: "sig_001",
      type: "HIGH_EQUITY_RATIO",
      category: "equity",
      strength: "high",
      description: "Property has 73.7% equity, well above 60% threshold",
      detected_at: "2024-02-15T10:00:00Z",
      source: "County Assessor",
    },
    {
      id: "sig_002",
      type: "LONG_OWNERSHIP",
      category: "wealth",
      strength: "medium",
      description: "Owner has held property for 9+ years",
      detected_at: "2024-02-15T10:00:00Z",
      source: "County Recorder",
    },
    {
      id: "sig_003",
      type: "MORTGAGE_MATURITY",
      category: "equity",
      strength: "medium",
      description: "Original 15-year mortgage approaching payoff (2030)",
      detected_at: "2024-02-10T08:30:00Z",
      source: "County Recorder",
    },
    {
      id: "sig_004",
      type: "TECH_EXECUTIVE",
      category: "wealth",
      strength: "high",
      description: "Owner identified as VP Engineering at major tech company",
      detected_at: "2024-01-28T14:20:00Z",
      source: "LinkedIn Enrichment",
    },
  ],
  court_records: [
    {
      id: "court_001",
      case_number: "24-2-01234-5",
      case_type: "Civil - Contract",
      filing_date: "2024-01-15",
      status: "open",
      parties: ["Michael Chen", "ABC Contractors LLC"],
      description: "Construction dispute regarding home renovation",
    },
  ],
  mortgage_history: [
    {
      id: "mort_001",
      lender: "Wells Fargo Home Mortgage",
      amount: 1320000,
      date_recorded: "2015-06-12",
      type: "purchase",
      interest_rate: 3.875,
      term_years: 15,
    },
    {
      id: "mort_002",
      lender: "Bank of America",
      amount: 200000,
      date_recorded: "2020-03-22",
      type: "heloc",
      interest_rate: null,
      term_years: null,
    },
  ],
  tax_history: [
    { year: 2024, assessed_value: 2450000, tax_amount: 24500, paid: false },
    { year: 2023, assessed_value: 2320000, tax_amount: 23200, paid: true },
    { year: 2022, assessed_value: 2150000, tax_amount: 21500, paid: true },
    { year: 2021, assessed_value: 1980000, tax_amount: 19800, paid: true },
    { year: 2020, assessed_value: 1850000, tax_amount: 18500, paid: true },
  ],
  created_at: "2024-01-15T08:00:00Z",
  updated_at: "2024-02-20T14:30:00Z",
};

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PropertyDetailResponse | ErrorResponse>> {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Property ID is required",
          code: "MISSING_ID",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from("properties")
    //   .select(`
    //     *,
    //     owner:owners(*),
    //     signals:property_signals(*),
    //     court_records:court_records(*),
    //     mortgage_history:mortgages(*),
    //     tax_history:tax_records(*)
    //   `)
    //   .eq("id", id)
    //   .single();
    //
    // if (error || !data) {
    //   return NextResponse.json(
    //     { success: false, error: "Property not found", code: "NOT_FOUND" },
    //     { status: 404 }
    //   );
    // }

    // Mock: Return sample property if ID matches, otherwise 404
    if (id === "prop_001" || id === "123-456-789") {
      return NextResponse.json({
        success: true,
        data: MOCK_PROPERTY_DETAIL,
      });
    }

    // Return 404 for unknown IDs
    return NextResponse.json(
      {
        success: false,
        error: "Property not found",
        code: "NOT_FOUND",
      },
      { status: 404 },
    );
  } catch (error) {
    console.error("Property detail error:", error);
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
