/**
 * Single Lead Management API
 * GET /api/leads/[id] - Get lead detail
 * PATCH /api/leads/[id] - Update lead (status, notes, assigned_to)
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
  estimated_net_worth: number | null;
}

interface LeadProperty {
  id: string;
  address: string;
  city: string;
  county: string;
  state: string;
  market_value: number;
  equity_amount: number;
  equity_pct: number;
}

interface LeadSignal {
  id: string;
  type: string;
  category: string;
  strength: string;
  description: string;
  detected_at: string;
}

interface LeadActivity {
  id: string;
  type: "note" | "call" | "email" | "meeting" | "status_change" | "assignment";
  description: string;
  created_by: string;
  created_at: string;
}

interface LeadDetail {
  id: string;
  owner: LeadOwner;
  properties: LeadProperty[];
  signals: LeadSignal[];
  activities: LeadActivity[];
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  score: number;
  total_equity: number;
  notes: string | null;
  last_contact: string | null;
  next_action: string | null;
  next_action_date: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadDetailResponse {
  success: boolean;
  data: LeadDetail;
}

interface UpdateLeadRequest {
  status?: LeadStatus;
  priority?: LeadPriority;
  assigned_to?: string | null;
  notes?: string;
  next_action?: string;
  next_action_date?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_LEAD_DETAIL: LeadDetail = {
  id: "lead_001",
  owner: {
    id: "owner_005",
    name: "Robert & Susan Martinez",
    type: "individual",
    phone: "+1-480-555-0678",
    email: "martinez.family@outlook.com",
    estimated_net_worth: 15000000,
  },
  properties: [
    {
      id: "prop_005",
      address: "7845 Scottsdale Road",
      city: "Scottsdale",
      county: "Maricopa",
      state: "AZ",
      market_value: 3500000,
      equity_amount: 3500000,
      equity_pct: 100,
    },
    {
      id: "prop_011",
      address: "1200 Camelback Road Unit 1501",
      city: "Phoenix",
      county: "Maricopa",
      state: "AZ",
      market_value: 2800000,
      equity_amount: 2800000,
      equity_pct: 100,
    },
    {
      id: "prop_012",
      address: "456 Desert Vista Drive",
      city: "Paradise Valley",
      county: "Maricopa",
      state: "AZ",
      market_value: 2200000,
      equity_amount: 2200000,
      equity_pct: 100,
    },
    {
      id: "prop_013",
      address: "789 Mountain Shadow Lane",
      city: "Scottsdale",
      county: "Maricopa",
      state: "AZ",
      market_value: 1300000,
      equity_amount: 1300000,
      equity_pct: 100,
    },
  ],
  signals: [
    {
      id: "sig_011",
      type: "FREE_CLEAR_PROPERTY",
      category: "equity",
      strength: "high",
      description: "All 4 properties are 100% free and clear",
      detected_at: "2024-02-15T10:00:00Z",
    },
    {
      id: "sig_012",
      type: "ANNUITY_SURRENDER_WINDOW",
      category: "annuity",
      strength: "high",
      description: "Annuity entering surrender-free period March 2024",
      detected_at: "2024-02-05T08:00:00Z",
    },
    {
      id: "sig_013",
      type: "MULTI_PROPERTY_OWNER",
      category: "wealth",
      strength: "high",
      description: "Owner controls 4 properties totaling $9.8M equity",
      detected_at: "2024-02-01T11:00:00Z",
    },
    {
      id: "sig_014",
      type: "AGE_RETIREMENT_WINDOW",
      category: "life_event",
      strength: "high",
      description: "Both owners are 65+, prime retirement planning window",
      detected_at: "2024-01-28T14:20:00Z",
    },
    {
      id: "sig_015",
      type: "LONG_OWNERSHIP",
      category: "wealth",
      strength: "medium",
      description: "Primary property owned 19+ years",
      detected_at: "2024-02-15T10:00:00Z",
    },
  ],
  activities: [
    {
      id: "act_001",
      type: "status_change",
      description: "Lead status changed from 'contacted' to 'qualified'",
      created_by: "Philip",
      created_at: "2024-02-19T10:30:00Z",
    },
    {
      id: "act_002",
      type: "call",
      description:
        "Discovery call completed. Very interested in income-focused strategies. Mentioned annuity coming up for renewal.",
      created_by: "Philip",
      created_at: "2024-02-19T10:00:00Z",
    },
    {
      id: "act_003",
      type: "email",
      description: "Sent personalized equity summary and case study",
      created_by: "Philip",
      created_at: "2024-02-15T14:00:00Z",
    },
    {
      id: "act_004",
      type: "note",
      description:
        "Both Robert (67) and Susan (65) are retired. Looking for stable income. Currently managing own portfolio but open to guidance.",
      created_by: "Philip",
      created_at: "2024-02-12T11:30:00Z",
    },
    {
      id: "act_005",
      type: "status_change",
      description: "Lead status changed from 'new' to 'contacted'",
      created_by: "Philip",
      created_at: "2024-02-10T09:15:00Z",
    },
    {
      id: "act_006",
      type: "assignment",
      description: "Lead assigned to Philip",
      created_by: "System",
      created_at: "2024-02-01T08:00:00Z",
    },
  ],
  status: "qualified",
  priority: "critical",
  assigned_to: "Philip",
  score: 94,
  total_equity: 9800000,
  notes:
    "Multiple properties free and clear. Annuity surrender window opening March 2024. Both owners retired and seeking income-focused strategies.",
  last_contact: "2024-02-19T10:30:00Z",
  next_action: "Send personalized equity report",
  next_action_date: "2024-02-23T09:00:00Z",
  created_at: "2024-02-01T08:00:00Z",
  updated_at: "2024-02-19T10:30:00Z",
};

// Valid status transitions
const VALID_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted", "nurture", "lost"],
  contacted: ["qualified", "nurture", "lost"],
  qualified: ["proposal_sent", "nurture", "lost"],
  proposal_sent: ["negotiating", "nurture", "lost"],
  negotiating: ["won", "lost", "nurture"],
  won: [],
  lost: ["new"], // Allow reactivation
  nurture: ["new", "contacted"],
};

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<LeadDetailResponse | ErrorResponse>> {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required",
          code: "MISSING_ID",
        },
        { status: 400 },
      );
    }

    // TODO: Replace with Supabase query
    // const { data: lead, error: leadError } = await supabase
    //   .from("leads")
    //   .select(`
    //     *,
    //     owner:owners(*),
    //     properties:owner_properties(
    //       property:properties(*)
    //     ),
    //     signals:lead_signals(
    //       signal:signals(*)
    //     ),
    //     activities:lead_activities(*)
    //   `)
    //   .eq("id", id)
    //   .single();
    //
    // if (leadError || !lead) {
    //   return NextResponse.json(
    //     { success: false, error: "Lead not found", code: "NOT_FOUND" },
    //     { status: 404 }
    //   );
    // }

    // Mock: Return sample lead if ID matches, otherwise 404
    if (id === "lead_001") {
      return NextResponse.json({
        success: true,
        data: MOCK_LEAD_DETAIL,
      });
    }

    // Return 404 for unknown IDs
    return NextResponse.json(
      {
        success: false,
        error: "Lead not found",
        code: "NOT_FOUND",
      },
      { status: 404 },
    );
  } catch (error) {
    console.error("Lead detail error:", error);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<LeadDetailResponse | ErrorResponse>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateLeadRequest;

    // Validate ID format
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required",
          code: "MISSING_ID",
        },
        { status: 400 },
      );
    }

    // Validate at least one field is being updated
    const updateFields = [
      "status",
      "priority",
      "assigned_to",
      "notes",
      "next_action",
      "next_action_date",
    ];
    const hasUpdate = updateFields.some(
      (field) => body[field as keyof UpdateLeadRequest] !== undefined,
    );

    if (!hasUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one field must be provided for update",
          code: "NO_UPDATE_FIELDS",
        },
        { status: 400 },
      );
    }

    // Validate status transition if status is being updated
    if (body.status) {
      const currentStatus = MOCK_LEAD_DETAIL.status;
      const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

      if (!allowedTransitions.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status transition from '${currentStatus}' to '${body.status}'`,
            code: "INVALID_STATUS_TRANSITION",
          },
          { status: 400 },
        );
      }
    }

    // TODO: Replace with Supabase update
    // 1. Verify lead exists
    // const { data: existingLead, error: fetchError } = await supabase
    //   .from("leads")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    //
    // if (fetchError || !existingLead) {
    //   return NextResponse.json(
    //     { success: false, error: "Lead not found", code: "NOT_FOUND" },
    //     { status: 404 }
    //   );
    // }
    //
    // 2. Update lead
    // const { data: updatedLead, error: updateError } = await supabase
    //   .from("leads")
    //   .update({
    //     status: body.status || existingLead.status,
    //     priority: body.priority || existingLead.priority,
    //     assigned_to: body.assigned_to !== undefined ? body.assigned_to : existingLead.assigned_to,
    //     notes: body.notes !== undefined ? body.notes : existingLead.notes,
    //     next_action: body.next_action || existingLead.next_action,
    //     next_action_date: body.next_action_date || existingLead.next_action_date,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("id", id)
    //   .select()
    //   .single();
    //
    // 3. Create activity record for status change
    // if (body.status && body.status !== existingLead.status) {
    //   await supabase.from("lead_activities").insert({
    //     lead_id: id,
    //     type: "status_change",
    //     description: `Lead status changed from '${existingLead.status}' to '${body.status}'`,
    //     created_by: "current_user", // Get from auth context
    //   });
    // }

    // Mock: Return updated lead
    if (id !== "lead_001") {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    const updatedLead: LeadDetail = {
      ...MOCK_LEAD_DETAIL,
      status: body.status || MOCK_LEAD_DETAIL.status,
      priority: body.priority || MOCK_LEAD_DETAIL.priority,
      assigned_to:
        body.assigned_to !== undefined
          ? body.assigned_to
          : MOCK_LEAD_DETAIL.assigned_to,
      notes: body.notes !== undefined ? body.notes : MOCK_LEAD_DETAIL.notes,
      next_action: body.next_action || MOCK_LEAD_DETAIL.next_action,
      next_action_date:
        body.next_action_date || MOCK_LEAD_DETAIL.next_action_date,
      updated_at: new Date().toISOString(),
    };

    // Add activity for status change
    if (body.status && body.status !== MOCK_LEAD_DETAIL.status) {
      updatedLead.activities.unshift({
        id: `act_${Date.now()}`,
        type: "status_change",
        description: `Lead status changed from '${MOCK_LEAD_DETAIL.status}' to '${body.status}'`,
        created_by: "System",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update lead error:", error);
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
