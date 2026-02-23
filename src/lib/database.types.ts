/**
 * Sovereign Data Engine - Database Types
 * Auto-generated TypeScript types for Supabase schema
 *
 * To regenerate after schema changes:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =====================================================
// ENUM TYPES
// =====================================================

export type LeadStatus =
  | "new"
  | "qualifying"
  | "hot"
  | "warm"
  | "cold"
  | "contacted"
  | "nurturing"
  | "converted"
  | "disqualified"
  | "do_not_contact";

export type ScraperStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "partial";

export type FederalSignalSource =
  | "sec_edgar"
  | "fec"
  | "faa"
  | "uscg"
  | "census";

export type CaseType =
  | "probate"
  | "divorce"
  | "bankruptcy"
  | "eviction"
  | "foreclosure"
  | "lien"
  | "other";

export type PropertyType =
  | "single_family"
  | "multi_family"
  | "condo"
  | "townhouse"
  | "commercial"
  | "industrial"
  | "land"
  | "mixed_use"
  | "other";

// =====================================================
// TABLE TYPES
// =====================================================

export interface County {
  id: string;
  county_name: string;
  state: string;
  city: string | null;
  median_value: number | null;
  median_equity: number | null;
  equity_pct: number | null;
  assessor_url: string | null;
  recorder_url: string | null;
  assessor_online: boolean;
  recorder_online: boolean;
  bulk_download: boolean;
  tech_wealth: boolean;
  satisfaction_search: boolean;
  signals: Json;
  annuity_density: number | null;
  scrape_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  parcel_id: string;
  county_id: string;
  owner_name: string;
  property_address: string;
  mailing_address: string | null;
  assessed_value: number | null;
  land_value: number | null;
  improvement_value: number | null;
  property_type: PropertyType | null;
  year_built: number | null;
  sq_footage: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  lot_size: number | null;
  tax_amount: number | null;
  transfer_date: string | null;
  purchase_price: number | null;
  lien_status: string | null;
  zoning: string | null;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  primary_name: string;
  name_variations: Json;
  properties: Json;
  total_equity: number | null;
  court_records: Json;
  wealth_signals: Json;
  life_events: Json;
  behavioral_score: number | null;
  timing_prediction: number | null;
  annuity_probability: number | null;
  recommended_approach: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecorderDocument {
  id: string;
  county_id: string;
  property_id: string | null;
  document_type: string;
  recording_date: string;
  document_number: string | null;
  grantor: string | null;
  grantee: string | null;
  property_address: string | null;
  loan_amount: number | null;
  lender_name: string | null;
  created_at: string;
}

export interface CourtFiling {
  id: string;
  county_id: string;
  owner_id: string | null;
  case_type: CaseType;
  filing_date: string;
  petitioner: string | null;
  respondent: string | null;
  property_addresses: Json;
  disposition: string | null;
  status: string | null;
  created_at: string;
}

export interface FederalSignal {
  id: string;
  source: FederalSignalSource;
  person_name: string;
  address: string | null;
  signal_data: Json;
  owner_id: string | null;
  created_at: string;
}

export interface InsuranceAgent {
  id: string;
  agent_name: string;
  license_number: string | null;
  license_type: string | null;
  state: string;
  city: string | null;
  zip: string | null;
  agency_name: string | null;
  appointment_companies: Json;
  license_status: string | null;
  license_date: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  owner_id: string;
  status: LeadStatus;
  priority_score: number | null;
  source_signals: Json;
  outreach_history: Json;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScraperRun {
  id: string;
  scraper_name: string;
  county_id: string | null;
  started_at: string;
  completed_at: string | null;
  records_processed: number;
  records_created: number;
  records_updated: number;
  errors: Json;
  status: ScraperStatus;
}

export interface UserSearch {
  id: string;
  user_id: string;
  name: string;
  filters: Json;
  created_at: string;
}

// =====================================================
// INSERT TYPES (for creating new records)
// =====================================================

export type CountyInsert = Omit<County, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type PropertyInsert = Omit<
  Property,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OwnerInsert = Omit<Owner, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type RecorderDocumentInsert = Omit<
  RecorderDocument,
  "id" | "created_at"
> & {
  id?: string;
  created_at?: string;
};

export type CourtFilingInsert = Omit<CourtFiling, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type FederalSignalInsert = Omit<FederalSignal, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type InsuranceAgentInsert = Omit<
  InsuranceAgent,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type LeadInsert = Omit<Lead, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ScraperRunInsert = Omit<ScraperRun, "id"> & {
  id?: string;
};

export type UserSearchInsert = Omit<UserSearch, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// =====================================================
// UPDATE TYPES (for updating existing records)
// =====================================================

export type CountyUpdate = Partial<
  Omit<County, "id" | "created_at" | "updated_at">
>;
export type PropertyUpdate = Partial<
  Omit<Property, "id" | "created_at" | "updated_at">
>;
export type OwnerUpdate = Partial<
  Omit<Owner, "id" | "created_at" | "updated_at">
>;
export type RecorderDocumentUpdate = Partial<
  Omit<RecorderDocument, "id" | "created_at">
>;
export type CourtFilingUpdate = Partial<Omit<CourtFiling, "id" | "created_at">>;
export type FederalSignalUpdate = Partial<
  Omit<FederalSignal, "id" | "created_at">
>;
export type InsuranceAgentUpdate = Partial<
  Omit<InsuranceAgent, "id" | "created_at" | "updated_at">
>;
export type LeadUpdate = Partial<
  Omit<Lead, "id" | "created_at" | "updated_at">
>;
export type ScraperRunUpdate = Partial<Omit<ScraperRun, "id">>;
export type UserSearchUpdate = Partial<Omit<UserSearch, "id" | "created_at">>;

// =====================================================
// DATABASE INTERFACE
// =====================================================

export interface Database {
  public: {
    Tables: {
      counties: {
        Row: County;
        Insert: CountyInsert;
        Update: CountyUpdate;
      };
      properties: {
        Row: Property;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
      };
      owners: {
        Row: Owner;
        Insert: OwnerInsert;
        Update: OwnerUpdate;
      };
      recorder_documents: {
        Row: RecorderDocument;
        Insert: RecorderDocumentInsert;
        Update: RecorderDocumentUpdate;
      };
      court_filings: {
        Row: CourtFiling;
        Insert: CourtFilingInsert;
        Update: CourtFilingUpdate;
      };
      federal_signals: {
        Row: FederalSignal;
        Insert: FederalSignalInsert;
        Update: FederalSignalUpdate;
      };
      insurance_agents: {
        Row: InsuranceAgent;
        Insert: InsuranceAgentInsert;
        Update: InsuranceAgentUpdate;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
      scraper_runs: {
        Row: ScraperRun;
        Insert: ScraperRunInsert;
        Update: ScraperRunUpdate;
      };
      user_searches: {
        Row: UserSearch;
        Insert: UserSearchInsert;
        Update: UserSearchUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: LeadStatus;
      scraper_status: ScraperStatus;
      federal_signal_source: FederalSignalSource;
      case_type: CaseType;
      property_type: PropertyType;
    };
  };
}
