/**
 * Lead Pipeline API
 * GET /api/leads - List leads with filters
 * POST /api/leads - Create new lead from owner_id
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "negotiating"
  | "won"
  | "lost"
  | "nurture";
type LeadPriority = "critical" | "high" | "medium" | "low";

interface LeadOwner {
  id: string;
  name: string;
  type: "individual" | "trust" | "llc" | "corporation";
  phone: string | null;
  email: string | null;
}

interface LeadProperty {
  id: string;
  address: string;
  market_value: number;
  equity_amount: number;
}

interface Lead {
  id: string;
  owner: LeadOwner;
  primary_property: LeadProperty;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  score: number;
  signals_count: number;
  total_equity: number;
  notes: string | null;
  last_contact: string | null;
  next_action: string | null;
  next_action_date: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadSearchResponse {
  success: boolean;
  data: Lead[];
  stats: {
    total: number;
    by_status: Record<LeadStatus, number>;
    by_priority: Record<LeadPriority, number>;
    total_pipeline_value: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

interface CreateLeadRequest {
  owner_id: string;
  priority?: LeadPriority;
  assigned_to?: string;
  notes?: string;
}

interface CreateLeadResponse {
  success: boolean;
  data: Lead;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_LEADS: Lead[] = [
  {
    id: "lead_001",
    owner: {
      id: "owner_005",
      name: "Robert & Susan Martinez",
      type: "individual",
      phone: "+1-480-555-0678",
      email: "martinez.family@outlook.com",
    },
    primary_property: {
      id: "prop_005",
      address: "7845 Scottsdale Road, Scottsdale, AZ 85253",
      market_value: 3500000,
      equity_amount: 3500000,
    },
    status: "qualified",
    priority: "critical",
    assigned_to: "Philip",
    score: 94,
    signals_count: 14,
    total_equity: 9800000,
    notes:
      "Multiple properties free and clear. Annuity surrender window opening March 2024.",
    last_contact: "2024-02-19T10:30:00Z",
    next_action: "Send personalized equity report",
    next_action_date: "2024-02-23T09:00:00Z",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-19T10:30:00Z",
  },
  {
    id: "lead_002",
    owner: {
      id: "owner_002",
      name: "The Patterson Family Trust",
      type: "trust",
      phone: "+1-425-555-0287",
      email: null,
    },
    primary_property: {
      id: "prop_002",
      address: "4521 Lakeview Terrace, Kirkland, WA 98033",
      market_value: 2100000,
      equity_amount: 2100000,
    },
    status: "new",
    priority: "high",
    assigned_to: null,
    score: 88,
    signals_count: 12,
    total_equity: 8750000,
    notes: null,
    last_contact: null,
    next_action: "Initial outreach call",
    next_action_date: "2024-02-24T10:00:00Z",
    created_at: "2024-02-18T11:45:00Z",
    updated_at: "2024-02-18T11:45:00Z",
  },
  {
    id: "lead_003",
    owner: {
      id: "owner_001",
      name: "Michael Chen",
      type: "individual",
      phone: "+1-425-555-0142",
      email: "mchen@techventures.com",
    },
    primary_property: {
      id: "prop_001",
      address: "1847 Summit Drive, Bellevue, WA 98004",
      market_value: 2850000,
      equity_amount: 2100000,
    },
    status: "contacted",
    priority: "high",
    assigned_to: "Sergio",
    score: 85,
    signals_count: 8,
    total_equity: 4200000,
    notes:
      "Tech executive at Microsoft. High income, potential for additional services.",
    last_contact: "2024-02-20T14:30:00Z",
    next_action: "Schedule discovery call",
    next_action_date: "2024-02-25T14:00:00Z",
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-02-20T14:30:00Z",
  },
  {
    id: "lead_004",
    owner: {
      id: "owner_004",
      name: "Desert Sun Investments Inc",
      type: "corporation",
      phone: "+1-702-555-0345",
      email: "investments@desertsun.com",
    },
    primary_property: {
      id: "prop_004",
      address: "3100 Paradise Road, Las Vegas, NV 89109",
      market_value: 12000000,
      equity_amount: 9600000,
    },
    status: "proposal_sent",
    priority: "critical",
    assigned_to: "Philip",
    score: 92,
    signals_count: 15,
    total_equity: 35000000,
    notes:
      "Large commercial portfolio. SEC filing detected - possible liquidity event.",
    last_contact: "2024-02-21T16:20:00Z",
    next_action: "Follow up on proposal",
    next_action_date: "2024-02-26T11:00:00Z",
    created_at: "2024-02-05T11:00:00Z",
    updated_at: "2024-02-21T16:20:00Z",
  },
  {
    id: "lead_005",
    owner: {
      id: "owner_003",
      name: "Evergreen Holdings LLC",
      type: "llc",
      phone: "+1-206-555-0199",
      email: "info@evergreenholdings.com",
    },
    primary_property: {
      id: "prop_003",
      address: "892 Marina Boulevard, Mercer Island, WA 98040",
      market_value: 4750000,
      equity_amount: 3562500,
    },
    status: "nurture",
    priority: "medium",
    assigned_to: "Sergio",
    score: 72,
    signals_count: 6,
    total_equity: 19200000,
    notes:
      "Not ready now but interested in future conversation. Add to quarterly check-in.",
    last_contact: "2024-02-10T09:00:00Z",
    next_action: "Quarterly check-in",
    next_action_date: "2024-05-10T09:00:00Z",
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-02-22T09:00:00Z",
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateStats(leads: Lead[]) {
  const stats = {
    total: leads.length,
    by_status: {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal_sent: 0,
      negotiating: 0,
      won: 0,
      lost: 0,
      nurture: 0,
    } as Record<LeadStatus, number>,
    by_priority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    } as Record<LeadPriority, number>,
    total_pipeline_value: 0,
  };

  leads.forEach((lead) => {
    stats.by_status[lead.status]++;
    stats.by_priority[lead.priority]++;
    if (lead.status !== "won" && lead.status !== "lost") {
      stats.total_pipeline_value += lead.total_equity;
    }
  });

  return stats;
}

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(
  request: NextRequest,
): Promise<NextResponse<LeadSearchResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const status = searchParams.get("status") as LeadStatus | null;
    const priority = searchParams.get("priority") as LeadPriority | null;
    const assignedTo = searchParams.get("assigned_to");
    const minScore = searchParams.get("min_score");
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
    //   .from("leads")
    //   .select(`
    //     *,
    //     owner:owners(id, name, type, phone, email),
    //     primary_property:properties(id, address, market_value, equity_amount)
    //   `)
    //   .eq("status", status || undefined)
    //   .eq("priority", priority || undefined)
    //   .eq("assigned_to", assignedTo || undefined)
    //   .gte("score", minScore ? parseInt(minScore) : 0)
    //   .order("score", { ascending: false })
    //   .range((page - 1) * limit, page * limit - 1);

    let filteredLeads = [...MOCK_LEADS];

    // Apply filters
    if (status) {
      filteredLeads = filteredLeads.filter((l) => l.status === status);
    }

    if (priority) {
      filteredLeads = filteredLeads.filter((l) => l.priority === priority);
    }

    if (assignedTo) {
      filteredLeads = filteredLeads.filter((l) => l.assigned_to === assignedTo);
    }

    if (minScore) {
      const minScoreVal = parseInt(minScore, 10);
      filteredLeads = filteredLeads.filter((l) => l.score >= minScoreVal);
    }

    // Sort by score descending
    filteredLeads.sort((a, b) => b.score - a.score);

    // Calculate stats before pagination
    const stats = calculateStats(filteredLeads);

    // Calculate pagination
    const total = filteredLeads.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedLeads,
      stats,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Lead search error:", error);
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
): Promise<NextResponse<CreateLeadResponse | ErrorResponse>> {
  try {
    const body = (await request.json()) as CreateLeadRequest;

    // Validate required fields
    if (!body.owner_id || typeof body.owner_id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "owner_id is required",
          code: "MISSING_OWNER_ID",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with Supabase operations
    // 1. Verify owner exists
    // const { data: owner, error: ownerError } = await supabase
    //   .from("owners")
    //   .select("*")
    //   .eq("id", body.owner_id)
    //   .single();
    //
    // if (ownerError || !owner) {
    //   return NextResponse.json(
    //     { success: false, error: "Owner not found", code: "OWNER_NOT_FOUND" },
    //     { status: 404 }
    //   );
    // }
    //
    // 2. Check if lead already exists
    // const { data: existingLead } = await supabase
    //   .from("leads")
    //   .select("id")
    //   .eq("owner_id", body.owner_id)
    //   .single();
    //
    // if (existingLead) {
    //   return NextResponse.json(
    //     { success: false, error: "Lead already exists for this owner", code: "LEAD_EXISTS" },
    //     { status: 409 }
    //   );
    // }
    //
    // 3. Get owner's primary property
    // const { data: properties } = await supabase
    //   .from("properties")
    //   .select("*")
    //   .eq("owner_id", body.owner_id)
    //   .order("market_value", { ascending: false })
    //   .limit(1);
    //
    // 4. Calculate lead score based on signals
    // const { count: signalsCount } = await supabase
    //   .from("signals")
    //   .select("*", { count: "exact" })
    //   .eq("owner_id", body.owner_id);
    //
    // 5. Create the lead
    // const { data: newLead, error: createError } = await supabase
    //   .from("leads")
    //   .insert({
    //     owner_id: body.owner_id,
    //     primary_property_id: properties[0]?.id,
    //     status: "new",
    //     priority: body.priority || "medium",
    //     assigned_to: body.assigned_to,
    //     notes: body.notes,
    //     score: calculateScore(signalsCount, owner, properties[0]),
    //   })
    //   .select()
    //   .single();

    // Mock: Create new lead
    const mockNewLead: Lead = {
      id: `lead_${Date.now()}`,
      owner: {
        id: body.owner_id,
        name: "New Lead Owner",
        type: "individual",
        phone: null,
        email: null,
      },
      primary_property: {
        id: "prop_new",
        address: "123 New Property St",
        market_value: 1500000,
        equity_amount: 1200000,
      },
      status: "new",
      priority: body.priority || "medium",
      assigned_to: body.assigned_to || null,
      score: 75,
      signals_count: 3,
      total_equity: 1200000,
      notes: body.notes || null,
      last_contact: null,
      next_action: "Initial outreach",
      next_action_date: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: mockNewLead,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create lead error:", error);
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
