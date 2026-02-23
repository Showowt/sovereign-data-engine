-- =====================================================
-- Sovereign Data Engine - Initial Schema Rollback
-- Migration: 001_initial_schema_rollback.sql
-- Created: 2026-02-23
-- Description: Rollback script for initial schema
-- =====================================================

-- Drop tables (reverse order due to foreign key dependencies)
DROP TABLE IF EXISTS user_searches CASCADE;
DROP TABLE IF EXISTS scraper_runs CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS insurance_agents CASCADE;
DROP TABLE IF EXISTS federal_signals CASCADE;
DROP TABLE IF EXISTS court_filings CASCADE;
DROP TABLE IF EXISTS recorder_documents CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS counties CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS case_type CASCADE;
DROP TYPE IF EXISTS federal_signal_source CASCADE;
DROP TYPE IF EXISTS scraper_status CASCADE;
DROP TYPE IF EXISTS lead_status CASCADE;

-- =====================================================
-- ROLLBACK COMPLETE
-- =====================================================
