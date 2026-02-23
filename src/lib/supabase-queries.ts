/**
 * Sovereign Data Engine - Supabase Query Examples
 * Type-safe query patterns for common operations
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Lead, LeadStatus } from "./database.types";

// Initialize Supabase client (use environment variables)
// Note: When connecting to a real project, regenerate types with:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Using untyped client for query examples - real implementation should use generated types
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// =====================================================
// COUNTY QUERIES
// =====================================================

/**
 * Get high-priority counties for scraping
 * Sorted by annuity density and last scrape date
 */
export async function getTopCountiesForScraping(limit = 10) {
  const { data, error } = await supabase
    .from("counties")
    .select("*")
    .eq("tech_wealth", true)
    .eq("assessor_online", true)
    .gte("equity_pct", 40)
    .order("annuity_density", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get county by name and state
 */
export async function getCountyByNameAndState(
  countyName: string,
  state: string,
) {
  const { data, error } = await supabase
    .from("counties")
    .select("*")
    .eq("county_name", countyName)
    .eq("state", state)
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// PROPERTY QUERIES
// =====================================================

/**
 * Get high-value properties with recent transfers
 * Indicates potential life events or liquidation
 */
export async function getRecentHighValueTransfers(
  minValue = 500000,
  monthsAgo = 24,
) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);

  const { data, error } = await supabase
    .from("properties")
    .select("*, counties(county_name, state)")
    .gte("assessed_value", minValue)
    .gte("transfer_date", cutoffDate.toISOString().split("T")[0])
    .order("assessed_value", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Search properties by owner name
 */
export async function searchPropertiesByOwner(ownerName: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*, counties(county_name, state, city)")
    .ilike("owner_name", `%${ownerName}%`)
    .order("assessed_value", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get properties in a specific county
 */
export async function getPropertiesByCounty(
  countyId: string,
  limit = 100,
  offset = 0,
) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("county_id", countyId)
    .order("assessed_value", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

// =====================================================
// OWNER QUERIES
// =====================================================

/**
 * Get hot leads - high equity + high behavioral score
 */
export async function getHotLeads(
  minEquity = 300000,
  minScore = 70,
  limit = 100,
) {
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .gte("total_equity", minEquity)
    .gte("behavioral_score", minScore)
    .order("behavioral_score", { ascending: false })
    .order("total_equity", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Search owners by name (fuzzy match)
 */
export async function searchOwnersByName(searchTerm: string) {
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .or(`primary_name.ilike.%${searchTerm}%`)
    .order("total_equity", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

/**
 * Get owner details with related records
 */
export async function getOwnerDetails(ownerId: string) {
  // Get owner
  const { data: owner, error: ownerError } = await supabase
    .from("owners")
    .select("*")
    .eq("id", ownerId)
    .single();

  if (ownerError) throw ownerError;

  // Get related court filings
  const { data: courtFilings } = await supabase
    .from("court_filings")
    .select("*")
    .eq("owner_id", ownerId)
    .order("filing_date", { ascending: false });

  // Get related federal signals
  const { data: federalSignals } = await supabase
    .from("federal_signals")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  // Get lead if exists
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("owner_id", ownerId)
    .single();

  return {
    owner,
    courtFilings: courtFilings || [],
    federalSignals: federalSignals || [],
    lead,
  };
}

// =====================================================
// COURT FILINGS QUERIES
// =====================================================

/**
 * Get recent probate cases (high-value lead source)
 */
export async function getRecentProbateCases(monthsAgo = 12, limit = 100) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);

  const { data, error } = await supabase
    .from("court_filings")
    .select("*, counties(county_name, state, median_equity)")
    .eq("case_type", "probate")
    .gte("filing_date", cutoffDate.toISOString().split("T")[0])
    .order("filing_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get court filings by county
 */
export async function getCourtFilingsByCounty(
  countyId: string,
  caseType?: string,
) {
  let query = supabase
    .from("court_filings")
    .select("*")
    .eq("county_id", countyId);

  if (caseType) {
    query = query.eq("case_type", caseType);
  }

  const { data, error } = await query.order("filing_date", {
    ascending: false,
  });

  if (error) throw error;
  return data;
}

// =====================================================
// FEDERAL SIGNALS QUERIES
// =====================================================

/**
 * Get SEC Edgar filings (corporate insiders)
 */
export async function getSECInsiders(limit = 100) {
  const { data, error } = await supabase
    .from("federal_signals")
    .select("*, owners(primary_name, total_equity)")
    .eq("source", "sec_edgar")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get aircraft owners (high net worth indicator)
 */
export async function getAircraftOwners(limit = 100) {
  const { data, error } = await supabase
    .from("federal_signals")
    .select("*, owners(primary_name, total_equity)")
    .eq("source", "faa")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// =====================================================
// INSURANCE AGENTS QUERIES
// =====================================================

/**
 * Get active life insurance agents in a state
 */
export async function getActiveAgentsByState(state: string, limit = 100) {
  const { data, error } = await supabase
    .from("insurance_agents")
    .select("*")
    .eq("state", state)
    .eq("license_status", "Active")
    .ilike("license_type", "%life%")
    .order("city")
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Search agents by name or agency
 */
export async function searchAgents(searchTerm: string) {
  const { data, error } = await supabase
    .from("insurance_agents")
    .select("*")
    .or(`agent_name.ilike.%${searchTerm}%,agency_name.ilike.%${searchTerm}%`)
    .eq("license_status", "Active")
    .limit(50);

  if (error) throw error;
  return data;
}

// =====================================================
// LEADS QUERIES
// =====================================================

/**
 * Get my assigned leads (uses RLS - auth.uid())
 */
export async function getMyLeads(status?: string) {
  let query = supabase
    .from("leads")
    .select("*, owners(primary_name, total_equity, behavioral_score)");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query
    .order("priority_score", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get leads by status
 */
export async function getLeadsByStatus(status: string, limit = 50) {
  const { data, error } = await supabase
    .from("leads")
    .select("*, owners(primary_name, total_equity)")
    .eq("status", status)
    .order("priority_score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string,
  status: string,
  notes?: string,
) {
  const updatePayload: { status: string; notes?: string } = { status };
  if (notes) {
    updatePayload.notes = notes;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updatePayload)
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add outreach event to lead history
 */
export async function addOutreachEvent(
  leadId: string,
  eventType: string,
  eventData: any,
) {
  // First, get current outreach history
  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("outreach_history")
    .eq("id", leadId)
    .single();

  if (fetchError) throw fetchError;

  // Append new event
  const currentHistory = (lead.outreach_history as any[]) || [];
  const newHistory = [
    ...currentHistory,
    {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...eventData,
    },
  ];

  // Update lead
  const { data, error } = await supabase
    .from("leads")
    .update({ outreach_history: newHistory })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// SCRAPER RUNS QUERIES
// =====================================================

/**
 * Get recent scraper runs with performance metrics
 */
export async function getRecentScraperRuns(limit = 50) {
  const { data, error } = await supabase
    .from("scraper_runs")
    .select("*, counties(county_name, state)")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get scraper performance by name
 */
export async function getScraperPerformance(scraperName: string, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from("scraper_runs")
    .select("*")
    .eq("scraper_name", scraperName)
    .gte("started_at", cutoffDate.toISOString())
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

// =====================================================
// USER SEARCHES QUERIES
// =====================================================

/**
 * Get my saved searches
 */
export async function getMySavedSearches() {
  const { data, error } = await supabase
    .from("user_searches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Save a new search
 */
export async function saveSearch(name: string, filters: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("user_searches")
    .insert({
      user_id: user.id,
      name,
      filters,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete saved search
 */
export async function deleteSavedSearch(searchId: string) {
  const { error } = await supabase
    .from("user_searches")
    .delete()
    .eq("id", searchId);

  if (error) throw error;
}

// =====================================================
// ANALYTICS QUERIES
// =====================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  // Total properties
  const { count: propertyCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  // Total owners
  const { count: ownerCount } = await supabase
    .from("owners")
    .select("*", { count: "exact", head: true });

  // Total leads
  const { count: leadCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  // Hot leads (score > 80)
  const { count: hotLeadCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("priority_score", 80);

  // Total equity (sum)
  const { data: equityData } = await supabase.rpc("sum", {
    table_name: "owners",
    column_name: "total_equity",
  });

  return {
    totalProperties: propertyCount || 0,
    totalOwners: ownerCount || 0,
    totalLeads: leadCount || 0,
    hotLeads: hotLeadCount || 0,
    totalEquity: equityData || 0,
  };
}

// =====================================================
// BATCH OPERATIONS (Service Role Only)
// =====================================================

/**
 * Bulk insert properties (for scrapers)
 * NOTE: This requires service_role key, not anon key
 */
export async function bulkInsertProperties(properties: any[]) {
  const { data, error } = await supabase.from("properties").upsert(properties, {
    onConflict: "parcel_id,county_id",
  });

  if (error) throw error;
  return data;
}

/**
 * Create scraper run record
 */
export async function createScraperRun(scraperName: string, countyId?: string) {
  const { data, error } = await supabase
    .from("scraper_runs")
    .insert({
      scraper_name: scraperName,
      county_id: countyId || null,
      started_at: new Date().toISOString(),
      status: "running",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update scraper run on completion
 */
export async function completeScraperRun(
  runId: string,
  recordsProcessed: number,
  recordsCreated: number,
  recordsUpdated: number,
  errors: any[] = [],
) {
  const { data, error } = await supabase
    .from("scraper_runs")
    .update({
      completed_at: new Date().toISOString(),
      records_processed: recordsProcessed,
      records_created: recordsCreated,
      records_updated: recordsUpdated,
      errors,
      status: errors.length > 0 ? "partial" : "completed",
    })
    .eq("id", runId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
