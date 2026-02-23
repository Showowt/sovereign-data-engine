/**
 * Scraper Trigger API
 * POST /api/scrapers/trigger - Manually trigger a scraper run
 *
 * Sovereign Data Engine - Hernsted Private Capital
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface TriggerScraperRequest {
  scraper_name: string;
  county_id?: string;
  priority?: "normal" | "high" | "critical";
  options?: {
    full_resync?: boolean;
    date_range_start?: string;
    date_range_end?: string;
    record_limit?: number;
  };
}

interface ScraperJob {
  job_id: string;
  scraper_name: string;
  county_id: string | null;
  status: "queued" | "starting" | "running";
  priority: "normal" | "high" | "critical";
  queued_at: string;
  estimated_start: string;
  estimated_duration_seconds: number;
  options: Record<string, string | number | boolean>;
}

interface TriggerScraperResponse {
  success: boolean;
  data: ScraperJob;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// =============================================================================
// VALID SCRAPERS
// =============================================================================

const VALID_SCRAPERS: Record<
  string,
  {
    id: string;
    name: string;
    supports_county: boolean;
    avg_duration: number;
    enabled: boolean;
  }
> = {
  county_assessor: {
    id: "scraper_001",
    name: "County Assessor Scraper",
    supports_county: true,
    avg_duration: 9450,
    enabled: true,
  },
  county_recorder: {
    id: "scraper_002",
    name: "County Recorder Scraper",
    supports_county: true,
    avg_duration: 4200,
    enabled: true,
  },
  court_records: {
    id: "scraper_003",
    name: "Court Records Scraper",
    supports_county: true,
    avg_duration: 5400,
    enabled: true,
  },
  obituary_monitor: {
    id: "scraper_004",
    name: "Obituary Monitor",
    supports_county: false,
    avg_duration: 300,
    enabled: true,
  },
  sec_edgar: {
    id: "scraper_005",
    name: "SEC Edgar Scraper",
    supports_county: false,
    avg_duration: 1800,
    enabled: true,
  },
  linkedin_enrichment: {
    id: "scraper_006",
    name: "LinkedIn Enrichment",
    supports_county: false,
    avg_duration: 2700,
    enabled: false,
  },
};

const VALID_COUNTIES = [
  "king_wa",
  "clark_nv",
  "maricopa_az",
  "los_angeles_ca",
  "san_diego_ca",
  "miami_dade_fl",
];

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TriggerScraperResponse | ErrorResponse>> {
  try {
    const body = (await request.json()) as TriggerScraperRequest;

    // Validate scraper_name
    if (
      !body.scraper_name ||
      typeof body.scraper_name !== "string" ||
      body.scraper_name.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "scraper_name is required",
          code: "MISSING_SCRAPER_NAME",
        },
        { status: 400 },
      );
    }

    const scraperKey = body.scraper_name.toLowerCase().replace(/[- ]/g, "_");
    const scraper = VALID_SCRAPERS[scraperKey];

    if (!scraper) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown scraper: ${body.scraper_name}. Valid scrapers: ${Object.keys(VALID_SCRAPERS).join(", ")}`,
          code: "INVALID_SCRAPER",
        },
        { status: 400 },
      );
    }

    // Check if scraper is enabled
    if (!scraper.enabled) {
      return NextResponse.json(
        {
          success: false,
          error: `Scraper '${scraper.name}' is currently disabled`,
          code: "SCRAPER_DISABLED",
        },
        { status: 400 },
      );
    }

    // Validate county_id if provided
    if (body.county_id) {
      if (!scraper.supports_county) {
        return NextResponse.json(
          {
            success: false,
            error: `Scraper '${scraper.name}' does not support county-specific runs`,
            code: "COUNTY_NOT_SUPPORTED",
          },
          { status: 400 },
        );
      }

      if (!VALID_COUNTIES.includes(body.county_id)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unknown county_id: ${body.county_id}. Valid counties: ${VALID_COUNTIES.join(", ")}`,
            code: "INVALID_COUNTY",
          },
          { status: 400 },
        );
      }
    }

    // Validate priority
    const validPriorities = ["normal", "high", "critical"];
    const priority = body.priority || "normal";
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid priority: ${body.priority}. Valid values: ${validPriorities.join(", ")}`,
          code: "INVALID_PRIORITY",
        },
        { status: 400 },
      );
    }

    // Validate options
    if (body.options) {
      if (
        body.options.record_limit !== undefined &&
        (typeof body.options.record_limit !== "number" ||
          body.options.record_limit < 1 ||
          body.options.record_limit > 100000)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "record_limit must be a number between 1 and 100000",
            code: "INVALID_RECORD_LIMIT",
          },
          { status: 400 },
        );
      }

      if (body.options.date_range_start) {
        const startDate = new Date(body.options.date_range_start);
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

      if (body.options.date_range_end) {
        const endDate = new Date(body.options.date_range_end);
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
    }

    // TODO: Replace with actual job queue integration
    // 1. Check if scraper is already running
    // const { data: runningJobs } = await supabase
    //   .from("scraper_jobs")
    //   .select("*")
    //   .eq("scraper_id", scraper.id)
    //   .in("status", ["queued", "starting", "running"])
    //   .eq("county_id", body.county_id || null);
    //
    // if (runningJobs && runningJobs.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Scraper is already running or queued",
    //       code: "SCRAPER_BUSY",
    //     },
    //     { status: 409 }
    //   );
    // }
    //
    // 2. Create job record
    // const { data: job, error } = await supabase
    //   .from("scraper_jobs")
    //   .insert({
    //     scraper_id: scraper.id,
    //     county_id: body.county_id,
    //     status: "queued",
    //     priority: priority,
    //     options: body.options || {},
    //   })
    //   .select()
    //   .single();
    //
    // 3. Trigger the scraper worker
    // await triggerScraperWorker(job.id);

    // Calculate estimated start time based on priority
    const priorityDelays: Record<string, number> = {
      critical: 0,
      high: 60000,
      normal: 300000,
    };
    const estimatedStart = new Date(
      Date.now() + priorityDelays[priority],
    ).toISOString();

    // Mock: Create job
    const mockJob: ScraperJob = {
      job_id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scraper_name: scraper.name,
      county_id: body.county_id || null,
      status: "queued",
      priority: priority as "normal" | "high" | "critical",
      queued_at: new Date().toISOString(),
      estimated_start: estimatedStart,
      estimated_duration_seconds: body.county_id
        ? Math.round(scraper.avg_duration / 3)
        : scraper.avg_duration,
      options:
        (body.options as Record<string, string | number | boolean>) || {},
    };

    const countyInfo = body.county_id ? ` for county ${body.county_id}` : "";
    const message = `Scraper '${scraper.name}' has been queued${countyInfo}. Estimated start: ${new Date(estimatedStart).toLocaleTimeString()}`;

    return NextResponse.json(
      {
        success: true,
        data: mockJob,
        message,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Trigger scraper error:", error);
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
