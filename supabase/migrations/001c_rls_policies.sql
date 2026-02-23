-- =====================================================
-- Sovereign Data Engine - Part C: RLS Policies & Comments
-- Migration: 001c_rls_policies.sql
-- Created: 2026-02-23
-- Description: Enable RLS, create all policies, and add documentation
-- =====================================================
-- Run this third in the Supabase dashboard
-- Prerequisites: 001a_extensions_and_types.sql and 001b_tables_and_indexes.sql must be run first

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

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
-- All three parts (001a, 001b, 001c) are now active
-- =====================================================
