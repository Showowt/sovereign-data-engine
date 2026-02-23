-- =====================================================
-- Sovereign Data Engine - Part A: Extensions & Types
-- Migration: 001a_extensions_and_types.sql
-- Created: 2026-02-23
-- Description: Create extensions and ENUM types
-- =====================================================
-- Run this first in the Supabase dashboard

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
-- PART A COMPLETE - Proceed to 001b_tables_and_indexes.sql
-- =====================================================
