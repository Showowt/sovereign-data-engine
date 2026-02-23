/**
 * Property Search API
 * GET /api/properties - Search properties with filters
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
  estimated_net_worth: number | null;
}

interface Property {
  id: string;
  apn: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  property_type: "residential" | "commercial" | "land" | "multi_family";
  assessed_value: number;
  market_value: number;
  equity_amount: number;
  equity_pct: number;
  mortgage_balance: number | null;
  purchase_date: string | null;
  purchase_price: number | null;
  owner: PropertyOwner;
  signal_count: number;
  created_at: string;
  updated_at: string;
}

interface PropertySearchResponse {
  success: boolean;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  filters_applied: Record<string, string | number | null>;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop_001",
    apn: "123-456-789",
    address: "1847 Summit Drive",
    city: "Bellevue",
    county: "King",
    state: "WA",
    zip: "98004",
    property_type: "residential",
    assessed_value: 2450000,
    market_value: 2850000,
    equity_amount: 2100000,
    equity_pct: 73.7,
    mortgage_balance: 750000,
    purchase_date: "2015-06-12",
    purchase_price: 1650000,
    owner: {
      id: "owner_001",
      name: "Michael Chen",
      type: "individual",
      mailing_address: "1847 Summit Drive, Bellevue, WA 98004",
      estimated_net_worth: 8500000,
    },
    signal_count: 4,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-02-20T14:30:00Z",
  },
  {
    id: "prop_002",
    apn: "234-567-890",
    address: "4521 Lakeview Terrace",
    city: "Kirkland",
    county: "King",
    state: "WA",
    zip: "98033",
    property_type: "residential",
    assessed_value: 1875000,
    market_value: 2100000,
    equity_amount: 2100000,
    equity_pct: 100,
    mortgage_balance: null,
    purchase_date: "2008-03-22",
    purchase_price: 890000,
    owner: {
      id: "owner_002",
      name: "The Patterson Family Trust",
      type: "trust",
      mailing_address: "PO Box 4521, Kirkland, WA 98033",
      estimated_net_worth: 12000000,
    },
    signal_count: 7,
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-02-18T11:45:00Z",
  },
  {
    id: "prop_003",
    apn: "345-678-901",
    address: "892 Marina Boulevard",
    city: "Mercer Island",
    county: "King",
    state: "WA",
    zip: "98040",
    property_type: "residential",
    assessed_value: 4200000,
    market_value: 4750000,
    equity_amount: 3562500,
    equity_pct: 75,
    mortgage_balance: 1187500,
    purchase_date: "2019-11-08",
    purchase_price: 3800000,
    owner: {
      id: "owner_003",
      name: "Evergreen Holdings LLC",
      type: "llc",
      mailing_address: "1200 5th Ave Suite 1500, Seattle, WA 98101",
      estimated_net_worth: null,
    },
    signal_count: 2,
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-02-22T09:00:00Z",
  },
  {
    id: "prop_004",
    apn: "456-789-012",
    address: "3100 Paradise Road",
    city: "Las Vegas",
    county: "Clark",
    state: "NV",
    zip: "89109",
    property_type: "commercial",
    assessed_value: 8500000,
    market_value: 12000000,
    equity_amount: 9600000,
    equity_pct: 80,
    mortgage_balance: 2400000,
    purchase_date: "2012-07-15",
    purchase_price: 5200000,
    owner: {
      id: "owner_004",
      name: "Desert Sun Investments Inc",
      type: "corporation",
      mailing_address: "3100 Paradise Road, Las Vegas, NV 89109",
      estimated_net_worth: 45000000,
    },
    signal_count: 5,
    created_at: "2024-01-05T11:00:00Z",
    updated_at: "2024-02-21T16:20:00Z",
  },
  {
    id: "prop_005",
    apn: "567-890-123",
    address: "7845 Scottsdale Road",
    city: "Scottsdale",
    county: "Maricopa",
    state: "AZ",
    zip: "85253",
    property_type: "residential",
    assessed_value: 3100000,
    market_value: 3500000,
    equity_amount: 3500000,
    equity_pct: 100,
    mortgage_balance: null,
    purchase_date: "2005-02-28",
    purchase_price: 1200000,
    owner: {
      id: "owner_005",
      name: "Robert & Susan Martinez",
      type: "individual",
      mailing_address: "7845 Scottsdale Road, Scottsdale, AZ 85253",
      estimated_net_worth: 15000000,
    },
    signal_count: 9,
    created_at: "2024-01-08T08:45:00Z",
    updated_at: "2024-02-19T13:15:00Z",
  },
];

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<PropertySearchResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const county = searchParams.get("county");
    const minValue = searchParams.get("min_value");
    const maxValue = searchParams.get("max_value");
    const ownerName = searchParams.get("owner_name");
    const propertyType = searchParams.get("property_type");
    const equityPctMin = searchParams.get("equity_pct_min");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100,
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

    // Filter mock data based on query params
    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from("properties")
    //   .select(`
    //     *,
    //     owner:owners(id, name, type, mailing_address, estimated_net_worth),
    //     signals:property_signals(count)
    //   `)
    //   .ilike("county", county ? `%${county}%` : "%")
    //   .gte("market_value", minValue ? parseInt(minValue) : 0)
    //   .lte("market_value", maxValue ? parseInt(maxValue) : 999999999)
    //   .gte("equity_pct", equityPctMin ? parseFloat(equityPctMin) : 0)
    //   .order("market_value", { ascending: false })
    //   .range((page - 1) * limit, page * limit - 1);

    let filteredProperties = [...MOCK_PROPERTIES];

    // Apply filters
    if (county) {
      filteredProperties = filteredProperties.filter((p) =>
        p.county.toLowerCase().includes(county.toLowerCase()),
      );
    }

    if (minValue) {
      const minVal = parseInt(minValue, 10);
      filteredProperties = filteredProperties.filter(
        (p) => p.market_value >= minVal,
      );
    }

    if (maxValue) {
      const maxVal = parseInt(maxValue, 10);
      filteredProperties = filteredProperties.filter(
        (p) => p.market_value <= maxVal,
      );
    }

    if (ownerName) {
      filteredProperties = filteredProperties.filter((p) =>
        p.owner.name.toLowerCase().includes(ownerName.toLowerCase()),
      );
    }

    if (propertyType) {
      filteredProperties = filteredProperties.filter(
        (p) => p.property_type === propertyType,
      );
    }

    if (equityPctMin) {
      const minEquity = parseFloat(equityPctMin);
      filteredProperties = filteredProperties.filter(
        (p) => p.equity_pct >= minEquity,
      );
    }

    // Calculate pagination
    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedProperties,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
      filters_applied: {
        county,
        min_value: minValue ? parseInt(minValue, 10) : null,
        max_value: maxValue ? parseInt(maxValue, 10) : null,
        owner_name: ownerName,
        property_type: propertyType,
        equity_pct_min: equityPctMin ? parseFloat(equityPctMin) : null,
      },
    });
  } catch (error) {
    console.error("Property search error:", error);
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
