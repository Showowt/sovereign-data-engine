/**
 * Sovereign Data Engine - Scraper Storage
 * Save scraped data to Supabase
 */

import { getServerSupabase, isSupabaseConfigured } from "../supabase-server";
import type {
  ScrapedProperty,
  ScrapedDocument,
  ScrapedCourtCase,
  CountyScraperConfig,
} from "./types";

interface SaveResult {
  success: boolean;
  created: number;
  updated: number;
  errors: string[];
}

/**
 * Get or create county record
 */
export async function getOrCreateCounty(
  config: CountyScraperConfig,
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.log("[Storage] Supabase not configured - skipping county lookup");
    return null;
  }

  const supabase = getServerSupabase();

  // Try to find existing county
  const { data: existing, error: findError } = await supabase
    .from("counties")
    .select("id")
    .eq("county_name", config.county)
    .eq("state", config.state)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new county
  const { data: created, error: createError } = await supabase
    .from("counties")
    .insert({
      county_name: config.county,
      state: config.state,
      assessor_url: config.assessorUrl,
      recorder_url: config.recorderUrl,
      assessor_online: true,
      recorder_online: true,
    })
    .select("id")
    .single();

  if (createError) {
    console.error("[Storage] Failed to create county:", createError);
    return null;
  }

  return created?.id || null;
}

/**
 * Save scraped properties to Supabase
 */
export async function saveProperties(
  properties: ScrapedProperty[],
  countyId: string,
): Promise<SaveResult> {
  const result: SaveResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
  };

  if (!isSupabaseConfigured()) {
    console.log("[Storage] Supabase not configured - skipping save");
    return result;
  }

  if (properties.length === 0) {
    return result;
  }

  const supabase = getServerSupabase();

  // Transform to database format
  const dbProperties = properties.map((p) => ({
    parcel_id: p.parcelId,
    county_id: countyId,
    owner_name: p.ownerName,
    property_address: `${p.propertyAddress}, ${p.propertyCity}, ${p.state} ${p.propertyZip}`,
    mailing_address: p.ownerMailingAddress,
    assessed_value: p.assessedValue,
    land_value: p.landValue,
    improvement_value: p.improvementValue,
    property_type: mapPropertyType(p.propertyType),
    year_built: p.yearBuilt,
    sq_footage: p.squareFeet,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    transfer_date: p.lastSaleDate,
    purchase_price: p.lastSalePrice,
  }));

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < dbProperties.length; i += batchSize) {
    const batch = dbProperties.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("properties")
      .upsert(batch, {
        onConflict: "parcel_id,county_id",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      result.errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
      result.success = false;
    } else {
      result.created += data?.length || 0;
    }
  }

  console.log(
    `[Storage] Saved ${result.created} properties, ${result.errors.length} errors`,
  );
  return result;
}

/**
 * Save scraped documents to Supabase
 */
export async function saveDocuments(
  documents: ScrapedDocument[],
  countyId: string,
): Promise<SaveResult> {
  const result: SaveResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
  };

  if (!isSupabaseConfigured()) {
    console.log("[Storage] Supabase not configured - skipping save");
    return result;
  }

  if (documents.length === 0) {
    return result;
  }

  const supabase = getServerSupabase();

  // Transform to database format
  const dbDocuments = documents.map((d) => ({
    county_id: countyId,
    document_type: d.documentType,
    recording_date: d.recordingDate,
    document_number: d.instrumentNumber || d.documentId,
    grantor: d.grantorName,
    grantee: d.granteeName,
    loan_amount: d.documentAmount || null,
    lender_name: d.documentType === "mortgage" ? d.grantorName : null,
  }));

  // Upsert in batches
  const batchSize = 100;
  for (let i = 0; i < dbDocuments.length; i += batchSize) {
    const batch = dbDocuments.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("recorder_documents")
      .upsert(batch, {
        onConflict: "county_id,document_number",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      result.errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
      result.success = false;
    } else {
      result.created += data?.length || 0;
    }
  }

  console.log(
    `[Storage] Saved ${result.created} documents, ${result.errors.length} errors`,
  );
  return result;
}

/**
 * Save court cases to Supabase
 */
export async function saveCourtCases(
  cases: ScrapedCourtCase[],
  countyId: string,
): Promise<SaveResult> {
  const result: SaveResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
  };

  if (!isSupabaseConfigured()) {
    console.log("[Storage] Supabase not configured - skipping save");
    return result;
  }

  if (cases.length === 0) {
    return result;
  }

  const supabase = getServerSupabase();

  // Transform to database format
  const dbCases = cases.map((c) => ({
    county_id: countyId,
    case_type: mapCaseType(c.caseType),
    filing_date: c.filingDate,
    petitioner: c.partyNames[0] || null,
    respondent: c.partyNames[1] || null,
    property_addresses: c.relatedProperties || [],
    status: c.status,
    disposition: null,
  }));

  const { data, error } = await supabase
    .from("court_filings")
    .insert(dbCases)
    .select("id");

  if (error) {
    result.errors.push(error.message);
    result.success = false;
  } else {
    result.created = data?.length || 0;
  }

  console.log(
    `[Storage] Saved ${result.created} court cases, ${result.errors.length} errors`,
  );
  return result;
}

/**
 * Create scraper run audit record
 */
export async function createScraperRun(
  scraperName: string,
  countyId: string | null,
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("scraper_runs")
    .insert({
      scraper_name: scraperName,
      county_id: countyId,
      started_at: new Date().toISOString(),
      status: "running",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Storage] Failed to create scraper run:", error);
    return null;
  }

  return data?.id || null;
}

/**
 * Complete scraper run audit record
 */
export async function completeScraperRun(
  runId: string,
  stats: {
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    errors: Array<{ message: string }>;
  },
): Promise<void> {
  if (!isSupabaseConfigured() || !runId) {
    return;
  }

  const supabase = getServerSupabase();

  await supabase
    .from("scraper_runs")
    .update({
      completed_at: new Date().toISOString(),
      records_processed: stats.recordsProcessed,
      records_created: stats.recordsCreated,
      records_updated: stats.recordsUpdated,
      errors: stats.errors,
      status: stats.errors.length > 0 ? "partial" : "completed",
    })
    .eq("id", runId);
}

/**
 * Map property type to database enum
 */
function mapPropertyType(
  type: string,
):
  | "single_family"
  | "condo"
  | "multi_family"
  | "commercial"
  | "land"
  | "other" {
  const normalized = type.toUpperCase();

  if (normalized.includes("SINGLE") || normalized.includes("SFR")) {
    return "single_family";
  }
  if (normalized.includes("CONDO") || normalized.includes("CONDOMINIUM")) {
    return "condo";
  }
  if (
    normalized.includes("MULTI") ||
    normalized.includes("DUPLEX") ||
    normalized.includes("TRIPLEX")
  ) {
    return "multi_family";
  }
  if (
    normalized.includes("COMMERCIAL") ||
    normalized.includes("OFFICE") ||
    normalized.includes("RETAIL")
  ) {
    return "commercial";
  }
  if (normalized.includes("LAND") || normalized.includes("VACANT")) {
    return "land";
  }
  return "other";
}

/**
 * Map case type to database enum
 */
function mapCaseType(
  type: string,
): "probate" | "divorce" | "bankruptcy" | "eviction" | "foreclosure" | "other" {
  const normalized = type.toLowerCase();

  if (normalized.includes("probate")) return "probate";
  if (normalized.includes("divorce") || normalized.includes("dissolution"))
    return "divorce";
  if (normalized.includes("bankruptcy")) return "bankruptcy";
  if (normalized.includes("eviction") || normalized.includes("unlawful"))
    return "eviction";
  if (normalized.includes("foreclosure") || normalized.includes("lis pendens"))
    return "foreclosure";
  return "other";
}
