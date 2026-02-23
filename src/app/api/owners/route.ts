/**
 * Owner/Entity Search API
 * GET /api/owners - Search unified owner profiles
 * POST /api/owners - Trigger entity resolution for a name/address
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface OwnerProperty {
  id: string;
  address: string;
  county: string;
  state: string;
  market_value: number;
  equity_amount: number;
  equity_pct: number;
}

interface Owner {
  id: string;
  name: string;
  type: "individual" | "trust" | "llc" | "corporation";
  mailing_address: string;
  phone: string | null;
  email: string | null;
  estimated_net_worth: number | null;
  confidence_score: number;
  properties_count: number;
  total_property_value: number;
  total_equity: number;
  signals_count: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

interface OwnerSearchResponse {
  success: boolean;
  data: Owner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

interface EntityResolutionRequest {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface EntityResolutionResponse {
  success: boolean;
  data: {
    resolution_id: string;
    status: "queued" | "processing" | "completed" | "failed";
    estimated_completion: string;
    matches_found: number;
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

const MOCK_OWNERS: Owner[] = [
  {
    id: "owner_001",
    name: "Michael Chen",
    type: "individual",
    mailing_address: "1847 Summit Drive, Bellevue, WA 98004",
    phone: "+1-425-555-0142",
    email: "mchen@techventures.com",
    estimated_net_worth: 8500000,
    confidence_score: 0.95,
    properties_count: 3,
    total_property_value: 5200000,
    total_equity: 4200000,
    signals_count: 8,
    last_activity: "2024-02-20T14:30:00Z",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-02-20T14:30:00Z",
  },
  {
    id: "owner_002",
    name: "The Patterson Family Trust",
    type: "trust",
    mailing_address: "PO Box 4521, Kirkland, WA 98033",
    phone: "+1-425-555-0287",
    email: null,
    estimated_net_worth: 12000000,
    confidence_score: 0.88,
    properties_count: 5,
    total_property_value: 8750000,
    total_equity: 8750000,
    signals_count: 12,
    last_activity: "2024-02-18T11:45:00Z",
    created_at: "2024-01-08T09:30:00Z",
    updated_at: "2024-02-18T11:45:00Z",
  },
  {
    id: "owner_003",
    name: "Evergreen Holdings LLC",
    type: "llc",
    mailing_address: "1200 5th Ave Suite 1500, Seattle, WA 98101",
    phone: "+1-206-555-0199",
    email: "info@evergreenholdings.com",
    estimated_net_worth: null,
    confidence_score: 0.72,
    properties_count: 12,
    total_property_value: 28500000,
    total_equity: 19200000,
    signals_count: 6,
    last_activity: "2024-02-22T09:00:00Z",
    created_at: "2024-01-05T10:15:00Z",
    updated_at: "2024-02-22T09:00:00Z",
  },
  {
    id: "owner_004",
    name: "Desert Sun Investments Inc",
    type: "corporation",
    mailing_address: "3100 Paradise Road, Las Vegas, NV 89109",
    phone: "+1-702-555-0345",
    email: "investments@desertsun.com",
    estimated_net_worth: 45000000,
    confidence_score: 0.91,
    properties_count: 8,
    total_property_value: 42000000,
    total_equity: 35000000,
    signals_count: 15,
    last_activity: "2024-02-21T16:20:00Z",
    created_at: "2024-01-02T11:00:00Z",
    updated_at: "2024-02-21T16:20:00Z",
  },
  {
    id: "owner_005",
    name: "Robert & Susan Martinez",
    type: "individual",
    mailing_address: "7845 Scottsdale Road, Scottsdale, AZ 85253",
    phone: "+1-480-555-0678",
    email: "martinez.family@outlook.com",
    estimated_net_worth: 15000000,
    confidence_score: 0.97,
    properties_count: 4,
    total_property_value: 9800000,
    total_equity: 9800000,
    signals_count: 14,
    last_activity: "2024-02-19T13:15:00Z",
    created_at: "2024-01-03T08:45:00Z",
    updated_at: "2024-02-19T13:15:00Z",
  },
];

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<OwnerSearchResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const name = searchParams.get("name");
    const type = searchParams.get("type");
    const minNetWorth = searchParams.get("min_net_worth");
    const minProperties = searchParams.get("min_properties");
    const minEquity = searchParams.get("min_equity");
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

    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from("owners")
    //   .select(`
    //     *,
    //     properties:owner_properties(count),
    //     signals:owner_signals(count)
    //   `)
    //   .ilike("name", name ? `%${name}%` : "%")
    //   .eq("type", type || undefined)
    //   .gte("estimated_net_worth", minNetWorth ? parseInt(minNetWorth) : 0)
    //   .gte("properties_count", minProperties ? parseInt(minProperties) : 0)
    //   .order("total_equity", { ascending: false })
    //   .range((page - 1) * limit, page * limit - 1);

    let filteredOwners = [...MOCK_OWNERS];

    // Apply filters
    if (name) {
      filteredOwners = filteredOwners.filter((o) =>
        o.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (type) {
      filteredOwners = filteredOwners.filter((o) => o.type === type);
    }

    if (minNetWorth) {
      const minNW = parseInt(minNetWorth, 10);
      filteredOwners = filteredOwners.filter(
        (o) => o.estimated_net_worth !== null && o.estimated_net_worth >= minNW,
      );
    }

    if (minProperties) {
      const minProps = parseInt(minProperties, 10);
      filteredOwners = filteredOwners.filter(
        (o) => o.properties_count >= minProps,
      );
    }

    if (minEquity) {
      const minEq = parseInt(minEquity, 10);
      filteredOwners = filteredOwners.filter((o) => o.total_equity >= minEq);
    }

    // Calculate pagination
    const total = filteredOwners.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOwners = filteredOwners.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedOwners,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Owner search error:", error);
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

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EntityResolutionResponse | ErrorResponse>> {
  try {
    const body = (await request.json()) as EntityResolutionRequest;

    // Validate required fields
    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required for entity resolution",
          code: "MISSING_NAME",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with actual entity resolution service
    // 1. Queue the resolution job
    // const { data: job, error } = await supabase
    //   .from("entity_resolution_jobs")
    //   .insert({
    //     input_name: body.name,
    //     input_address: body.address,
    //     input_phone: body.phone,
    //     input_email: body.email,
    //     status: "queued",
    //   })
    //   .select()
    //   .single();
    //
    // 2. Trigger the resolution worker
    // await triggerEntityResolutionWorker(job.id);

    // Mock response - simulate job creation
    const mockResolutionId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          resolution_id: mockResolutionId,
          status: "queued",
          estimated_completion: new Date(
            Date.now() + 5 * 60 * 1000,
          ).toISOString(),
          matches_found: 0,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Entity resolution error:", error);
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
