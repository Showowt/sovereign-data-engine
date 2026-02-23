-- =====================================================
-- Sovereign Data Engine - Initial Schema
-- Migration: 001_initial_schema.sql
-- Created: 2026-02-23
-- Description: Real estate and annuity intelligence platform
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE lead_status AS ENUM (
  'new',
  'qualifying',
  'hot',
  'warm',
  'cold',
  'contacted',
  'nurturing',
  'converted',
  'disqualified',
  'do_not_contact'
);

CREATE TYPE scraper_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'partial'
);

CREATE TYPE federal_signal_source AS ENUM (
  'sec_edgar',
  'fec',
  'faa',
  'uscg',
  'census'
);

CREATE TYPE case_type AS ENUM (
  'probate',
  'divorce',
  'bankruptcy',
  'eviction',
  'foreclosure',
  'lien',
  'other'
);

CREATE TYPE property_type AS ENUM (
  'single_family',
  'multi_family',
  'condo',
  'townhouse',
  'commercial',
  'industrial',
  'land',
  'mixed_use',
  'other'
);

-- =====================================================
-- TABLE: counties
-- Target county configurations for scraping
-- =====================================================

CREATE TABLE counties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Geographic identifiers
  county_name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT,

  -- Market metrics
  median_value NUMERIC(12, 2),
  median_equity NUMERIC(12, 2),
  equity_pct NUMERIC(5, 2), -- Percentage (e.g., 45.5 for 45.5%)

  -- Data source URLs
  assessor_url TEXT,
  recorder_url TEXT,
  assessor_online BOOLEAN DEFAULT false,
  recorder_online BOOLEAN DEFAULT false,
  bulk_download BOOLEAN DEFAULT false,

  -- Targeting metrics
  tech_wealth BOOLEAN DEFAULT false, -- High-tech wealth concentration
  satisfaction_search BOOLEAN DEFAULT false, -- Court satisfaction searches available
  signals JSONB DEFAULT '{}', -- Additional market signals
  annuity_density NUMERIC(5, 2), -- Annuity ownership density score

  -- Operational notes
  scrape_notes TEXT,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(county_name, state)
);

-- Indexes for counties
CREATE INDEX idx_counties_state ON counties(state);
CREATE INDEX idx_counties_tech_wealth ON counties(tech_wealth) WHERE tech_wealth = true;
CREATE INDEX idx_counties_equity_pct ON counties(equity_pct DESC NULLS LAST);

-- =====================================================
-- TABLE: properties
-- Property records from county assessors
-- =====================================================

CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identifiers
  parcel_id TEXT NOT NULL,
  county_id UUID NOT NULL REFERENCES counties(id) ON DELETE CASCADE,

  -- Owner information
  owner_name TEXT NOT NULL,

  -- Addresses
  property_address TEXT NOT NULL,
  mailing_address TEXT,

  -- Valuation data
  assessed_value NUMERIC(12, 2),
  land_value NUMERIC(12, 2),
  improvement_value NUMERIC(12, 2),

  -- Property characteristics
  property_type property_type,
  year_built INTEGER,
  sq_footage INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  lot_size NUMERIC(12, 2), -- Square feet or acres

  -- Financial data
  tax_amount NUMERIC(10, 2),
  transfer_date DATE,
  purchase_price NUMERIC(12, 2),
  lien_status TEXT,
  zoning TEXT,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(parcel_id, county_id)
);

-- Indexes for properties
CREATE INDEX idx_properties_county_id ON properties(county_id);
CREATE INDEX idx_properties_owner_name ON properties(owner_name);
CREATE INDEX idx_properties_property_address ON properties(property_address);
CREATE INDEX idx_properties_assessed_value ON properties(assessed_value DESC NULLS LAST);
CREATE INDEX idx_properties_transfer_date ON properties(transfer_date DESC NULLS LAST);
CREATE INDEX idx_properties_property_type ON properties(property_type);

-- =====================================================
-- TABLE: owners
-- Unified owner profiles (entity resolution output)
-- =====================================================

CREATE TABLE owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identity
  primary_name TEXT NOT NULL,
  name_variations JSONB DEFAULT '[]', -- Array of name variations
  properties JSONB DEFAULT '[]', -- Array of property IDs

  -- Wealth metrics
  total_equity NUMERIC(15, 2),

  -- Intelligence data
  court_records JSONB DEFAULT '[]', -- Array of court case references
  wealth_signals JSONB DEFAULT '{}', -- Federal signals, business ownership, etc.
  life_events JSONB DEFAULT '[]', -- Probate, divorce, retirement, etc.

  -- Scoring and prediction
  behavioral_score INTEGER CHECK (behavioral_score >= 0 AND behavioral_score <= 100),
  timing_prediction NUMERIC(5, 2), -- Probability score 0-100
  annuity_probability NUMERIC(5, 2), -- Likelihood to own annuity 0-100

  -- Outreach
  recommended_approach TEXT,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for owners
CREATE INDEX idx_owners_primary_name ON owners(primary_name);
CREATE INDEX idx_owners_total_equity ON owners(total_equity DESC NULLS LAST);
CREATE INDEX idx_owners_behavioral_score ON owners(behavioral_score DESC NULLS LAST);
CREATE INDEX idx_owners_annuity_probability ON owners(annuity_probability DESC NULLS LAST);
CREATE INDEX idx_owners_name_variations ON owners USING GIN(name_variations);

-- =====================================================
-- TABLE: recorder_documents
-- County recorder filings (deeds, mortgages, liens)
-- =====================================================

CREATE TABLE recorder_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- References
  county_id UUID NOT NULL REFERENCES counties(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  -- Document metadata
  document_type TEXT NOT NULL, -- Deed, Mortgage, Lien, Release, etc.
  recording_date DATE NOT NULL,
  document_number TEXT,

  -- Parties
  grantor TEXT,
  grantee TEXT,

  -- Property reference
  property_address TEXT,

  -- Financial data
  loan_amount NUMERIC(12, 2),
  lender_name TEXT,

  -- Audit timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(county_id, document_number)
);

-- Indexes for recorder_documents
CREATE INDEX idx_recorder_documents_county_id ON recorder_documents(county_id);
CREATE INDEX idx_recorder_documents_property_id ON recorder_documents(property_id);
CREATE INDEX idx_recorder_documents_recording_date ON recorder_documents(recording_date DESC);
CREATE INDEX idx_recorder_documents_document_type ON recorder_documents(document_type);
CREATE INDEX idx_recorder_documents_grantor ON recorder_documents(grantor);
CREATE INDEX idx_recorder_documents_grantee ON recorder_documents(grantee);

-- =====================================================
-- TABLE: court_filings
-- Court records (probate, divorce, bankruptcy, eviction)
-- =====================================================

CREATE TABLE court_filings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- References
  county_id UUID NOT NULL REFERENCES counties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,

  -- Case metadata
  case_type case_type NOT NULL,
  filing_date DATE NOT NULL,

  -- Parties
  petitioner TEXT,
  respondent TEXT,

  -- Property references
  property_addresses JSONB DEFAULT '[]', -- Array of addresses mentioned in filing

  -- Status
  disposition TEXT,
  status TEXT,

  -- Audit timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for court_filings
CREATE INDEX idx_court_filings_county_id ON court_filings(county_id);
CREATE INDEX idx_court_filings_owner_id ON court_filings(owner_id);
CREATE INDEX idx_court_filings_case_type ON court_filings(case_type);
CREATE INDEX idx_court_filings_filing_date ON court_filings(filing_date DESC);
CREATE INDEX idx_court_filings_petitioner ON court_filings(petitioner);
CREATE INDEX idx_court_filings_respondent ON court_filings(respondent);

-- =====================================================
-- TABLE: federal_signals
-- SEC, FEC, FAA, USCG, Census data
-- =====================================================

CREATE TABLE federal_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Source
  source federal_signal_source NOT NULL,

  -- Identity
  person_name TEXT NOT NULL,
  address TEXT,

  -- Signal data (flexible JSONB for each source type)
  signal_data JSONB DEFAULT '{}',

  -- References
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,

  -- Audit timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for federal_signals
CREATE INDEX idx_federal_signals_source ON federal_signals(source);
CREATE INDEX idx_federal_signals_person_name ON federal_signals(person_name);
CREATE INDEX idx_federal_signals_owner_id ON federal_signals(owner_id);
CREATE INDEX idx_federal_signals_signal_data ON federal_signals USING GIN(signal_data);

-- =====================================================
-- TABLE: insurance_agents
-- Agent network data for distribution strategy
-- =====================================================

CREATE TABLE insurance_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Agent identity
  agent_name TEXT NOT NULL,
  license_number TEXT,
  license_type TEXT,

  -- Location
  state TEXT NOT NULL,
  city TEXT,
  zip TEXT,

  -- Agency
  agency_name TEXT,
  appointment_companies JSONB DEFAULT '[]', -- Array of insurance companies

  -- License status
  license_status TEXT,
  license_date DATE,

  -- Property ownership (if agent owns property in our DB)
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(license_number, state)
);

-- Indexes for insurance_agents
CREATE INDEX idx_insurance_agents_state ON insurance_agents(state);
CREATE INDEX idx_insurance_agents_city ON insurance_agents(city);
CREATE INDEX idx_insurance_agents_zip ON insurance_agents(zip);
CREATE INDEX idx_insurance_agents_license_status ON insurance_agents(license_status);
CREATE INDEX idx_insurance_agents_owner_id ON insurance_agents(owner_id);

-- =====================================================
-- TABLE: leads
-- Qualified lead pipeline
-- =====================================================

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- References
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,

  -- Status and priority
  status lead_status DEFAULT 'new' NOT NULL,
  priority_score INTEGER CHECK (priority_score >= 0 AND priority_score <= 100),

  -- Intelligence
  source_signals JSONB DEFAULT '[]', -- Array of signals that qualified this lead
  outreach_history JSONB DEFAULT '[]', -- Array of outreach attempts

  -- Assignment
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Notes
  notes TEXT,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(owner_id)
);

-- Indexes for leads
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority_score ON leads(priority_score DESC NULLS LAST);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- =====================================================
-- TABLE: scraper_runs
-- Audit log for scraper executions
-- =====================================================

CREATE TABLE scraper_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Scraper identification
  scraper_name TEXT NOT NULL,
  county_id UUID REFERENCES counties(id) ON DELETE SET NULL,

  -- Timing
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,

  -- Results
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,

  -- Errors
  errors JSONB DEFAULT '[]',

  -- Status
  status scraper_status DEFAULT 'pending' NOT NULL
);

-- Indexes for scraper_runs
CREATE INDEX idx_scraper_runs_scraper_name ON scraper_runs(scraper_name);
CREATE INDEX idx_scraper_runs_county_id ON scraper_runs(county_id);
CREATE INDEX idx_scraper_runs_started_at ON scraper_runs(started_at DESC);
CREATE INDEX idx_scraper_runs_status ON scraper_runs(status);

-- =====================================================
-- TABLE: user_searches
-- Saved searches for quick filtering
-- =====================================================

CREATE TABLE user_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Owner
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Search definition
  name TEXT NOT NULL,
  filters JSONB NOT NULL,

  -- Audit timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for user_searches
CREATE INDEX idx_user_searches_user_id ON user_searches(user_id);
CREATE INDEX idx_user_searches_created_at ON user_searches(created_at DESC);

-- =====================================================
-- TRIGGERS: updated_at automatic updates
-- =====================================================

CREATE TRIGGER set_counties_updated_at
  BEFORE UPDATE ON counties
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_owners_updated_at
  BEFORE UPDATE ON owners
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_insurance_agents_updated_at
  BEFORE UPDATE ON insurance_agents
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE recorder_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE federal_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_searches ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COUNTIES POLICIES
-- All authenticated users can read counties
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read counties"
  ON counties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert counties"
  ON counties FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update counties"
  ON counties FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete counties"
  ON counties FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- PROPERTIES POLICIES
-- All authenticated users can read properties
-- Only service role can modify (scrapers run as service_role)
-- =====================================================

CREATE POLICY "Authenticated users can read properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert properties"
  ON properties FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update properties"
  ON properties FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete properties"
  ON properties FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- OWNERS POLICIES
-- All authenticated users can read owners
-- Only service role can modify (entity resolution runs as service_role)
-- =====================================================

CREATE POLICY "Authenticated users can read owners"
  ON owners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert owners"
  ON owners FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update owners"
  ON owners FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete owners"
  ON owners FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- RECORDER_DOCUMENTS POLICIES
-- All authenticated users can read recorder documents
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read recorder documents"
  ON recorder_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert recorder documents"
  ON recorder_documents FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update recorder documents"
  ON recorder_documents FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete recorder documents"
  ON recorder_documents FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- COURT_FILINGS POLICIES
-- All authenticated users can read court filings
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read court filings"
  ON court_filings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert court filings"
  ON court_filings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update court filings"
  ON court_filings FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete court filings"
  ON court_filings FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- FEDERAL_SIGNALS POLICIES
-- All authenticated users can read federal signals
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read federal signals"
  ON federal_signals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert federal signals"
  ON federal_signals FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update federal signals"
  ON federal_signals FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete federal signals"
  ON federal_signals FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- INSURANCE_AGENTS POLICIES
-- All authenticated users can read insurance agents
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read insurance agents"
  ON insurance_agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert insurance agents"
  ON insurance_agents FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update insurance agents"
  ON insurance_agents FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete insurance agents"
  ON insurance_agents FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- LEADS POLICIES
-- Users can only see leads assigned to them or unassigned
-- Service role has full access
-- =====================================================

CREATE POLICY "Users can read their assigned leads"
  ON leads FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() OR assigned_to IS NULL);

CREATE POLICY "Users can update their assigned leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "Service role can manage all leads"
  ON leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- SCRAPER_RUNS POLICIES
-- All authenticated users can read scraper runs
-- Only service role can modify
-- =====================================================

CREATE POLICY "Authenticated users can read scraper runs"
  ON scraper_runs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert scraper runs"
  ON scraper_runs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update scraper runs"
  ON scraper_runs FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete scraper runs"
  ON scraper_runs FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- USER_SEARCHES POLICIES
-- Users can only manage their own saved searches
-- =====================================================

CREATE POLICY "Users can read their own searches"
  ON user_searches FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own searches"
  ON user_searches FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own searches"
  ON user_searches FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own searches"
  ON user_searches FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE counties IS 'Target county configurations for scraping real estate and court data';
COMMENT ON TABLE properties IS 'Property records scraped from county assessor databases';
COMMENT ON TABLE owners IS 'Unified owner profiles created through entity resolution across properties';
COMMENT ON TABLE recorder_documents IS 'County recorder filings including deeds, mortgages, and liens';
COMMENT ON TABLE court_filings IS 'Court records including probate, divorce, bankruptcy, and eviction cases';
COMMENT ON TABLE federal_signals IS 'Wealth signals from SEC, FEC, FAA, USCG, and Census data';
COMMENT ON TABLE insurance_agents IS 'Insurance agent network data for distribution strategy';
COMMENT ON TABLE leads IS 'Qualified lead pipeline with scoring and assignment';
COMMENT ON TABLE scraper_runs IS 'Audit log tracking all scraper execution runs';
COMMENT ON TABLE user_searches IS 'User-defined saved searches with custom filters';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
