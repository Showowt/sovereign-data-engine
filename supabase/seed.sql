-- =====================================================
-- Sovereign Data Engine - Seed Data
-- File: seed.sql
-- Created: 2026-02-23
-- Description: Sample data for development and testing
-- =====================================================

-- IMPORTANT: This seed data is for DEVELOPMENT ONLY
-- Do NOT run in production

BEGIN;

-- =====================================================
-- SEED: Counties (High-Value Tech Markets)
-- =====================================================

INSERT INTO counties (
  county_name,
  state,
  city,
  median_value,
  median_equity,
  equity_pct,
  assessor_url,
  recorder_url,
  assessor_online,
  recorder_online,
  bulk_download,
  tech_wealth,
  satisfaction_search,
  annuity_density,
  scrape_notes
) VALUES
(
  'Santa Clara',
  'CA',
  'San Jose',
  1200000,
  540000,
  45.0,
  'https://www.sccassessor.org',
  'https://www.sccgov.org/recorder',
  true,
  true,
  true,
  true,
  true,
  68.5,
  'Silicon Valley - High concentration of tech executives and IPO millionaires'
),
(
  'San Mateo',
  'CA',
  'Redwood City',
  1350000,
  675000,
  50.0,
  'https://www.smcacre.org',
  'https://www.smcgov.org/recorder',
  true,
  true,
  false,
  true,
  true,
  72.3,
  'Peninsula tech wealth - Near Meta, Google, Oracle offices'
),
(
  'King',
  'WA',
  'Seattle',
  780000,
  390000,
  50.0,
  'https://www.kingcounty.gov/assessor',
  'https://www.kingcounty.gov/recorder',
  true,
  true,
  true,
  true,
  false,
  55.8,
  'Amazon, Microsoft headquarters - High tech employment'
),
(
  'Travis',
  'TX',
  'Austin',
  520000,
  260000,
  50.0,
  'https://www.traviscad.org',
  'https://www.traviscountytx.gov/recorder',
  true,
  false,
  false,
  true,
  false,
  42.1,
  'Tech boom market - Tesla, Oracle relocations'
),
(
  'Maricopa',
  'AZ',
  'Phoenix',
  425000,
  212500,
  50.0,
  'https://www.maricopa.gov/assessor',
  'https://www.maricopa.gov/recorder',
  true,
  true,
  true,
  false,
  false,
  38.9,
  'Retirement destination - High annuity density among retirees'
)
ON CONFLICT (county_name, state) DO NOTHING;

-- =====================================================
-- SEED: Properties (Sample High-Value Properties)
-- =====================================================

INSERT INTO properties (
  parcel_id,
  county_id,
  owner_name,
  property_address,
  mailing_address,
  assessed_value,
  land_value,
  improvement_value,
  property_type,
  year_built,
  sq_footage,
  bedrooms,
  bathrooms,
  lot_size,
  tax_amount,
  transfer_date,
  purchase_price
) VALUES
(
  '12345-001',
  (SELECT id FROM counties WHERE county_name = 'Santa Clara' AND state = 'CA'),
  'JOHNSON ROBERT T & JENNIFER M',
  '1234 Tech Valley Dr, Palo Alto, CA 94301',
  '1234 Tech Valley Dr, Palo Alto, CA 94301',
  2400000,
  800000,
  1600000,
  'single_family',
  1998,
  3200,
  4,
  3.5,
  8000,
  28800,
  '2020-03-15',
  1200000
),
(
  '12345-002',
  (SELECT id FROM counties WHERE county_name = 'Santa Clara' AND state = 'CA'),
  'CHEN DAVID & SUSAN',
  '5678 Innovation Blvd, Los Altos, CA 94022',
  '5678 Innovation Blvd, Los Altos, CA 94022',
  3200000,
  1000000,
  2200000,
  'single_family',
  2005,
  4500,
  5,
  4.5,
  12000,
  38400,
  '2018-06-22',
  1800000
),
(
  '23456-001',
  (SELECT id FROM counties WHERE county_name = 'San Mateo' AND state = 'CA'),
  'MARTINEZ CARLOS',
  '999 Peninsula Way, Menlo Park, CA 94025',
  '999 Peninsula Way, Menlo Park, CA 94025',
  2800000,
  900000,
  1900000,
  'single_family',
  2001,
  3800,
  4,
  3.5,
  10000,
  33600,
  '2019-11-08',
  1500000
),
(
  '34567-001',
  (SELECT id FROM counties WHERE county_name = 'King' AND state = 'WA'),
  'ANDERSON JAMES R',
  '4321 Lake View Terrace, Bellevue, WA 98004',
  '4321 Lake View Terrace, Bellevue, WA 98004',
  1800000,
  600000,
  1200000,
  'single_family',
  2010,
  3500,
  4,
  3.0,
  9000,
  18000,
  '2021-02-14',
  900000
),
(
  '45678-001',
  (SELECT id FROM counties WHERE county_name = 'Travis' AND state = 'TX'),
  'WILLIAMS SARAH M',
  '7890 Hill Country Rd, Austin, TX 78746',
  '7890 Hill Country Rd, Austin, TX 78746',
  950000,
  350000,
  600000,
  'single_family',
  2015,
  2800,
  3,
  2.5,
  7500,
  9500,
  '2022-08-30',
  525000
)
ON CONFLICT (parcel_id, county_id) DO NOTHING;

-- =====================================================
-- SEED: Owners (Unified Profiles)
-- =====================================================

INSERT INTO owners (
  primary_name,
  name_variations,
  properties,
  total_equity,
  behavioral_score,
  timing_prediction,
  annuity_probability,
  recommended_approach
) VALUES
(
  'Robert T Johnson',
  '["JOHNSON ROBERT T", "Robert Johnson", "R.T. Johnson", "Bob Johnson"]'::jsonb,
  (SELECT jsonb_agg(id) FROM properties WHERE owner_name LIKE '%JOHNSON%'),
  1200000,
  85,
  72.5,
  68.0,
  'Tech executive profile - Likely has stock options and 401k. Pitch tax-deferred annuity for post-retirement income.'
),
(
  'David Chen',
  '["CHEN DAVID", "David Chen", "D. Chen"]'::jsonb,
  (SELECT jsonb_agg(id) FROM properties WHERE owner_name LIKE '%CHEN%'),
  1400000,
  78,
  65.3,
  55.2,
  'High net worth - Recent property appreciation. Focus on wealth preservation and estate planning.'
),
(
  'Carlos Martinez',
  '["MARTINEZ CARLOS", "Carlos Martinez", "C. Martinez"]'::jsonb,
  (SELECT jsonb_agg(id) FROM properties WHERE owner_name LIKE '%MARTINEZ%'),
  1300000,
  72,
  58.7,
  62.8,
  'Peninsula resident - Likely works in tech. Emphasize guaranteed income stream vs volatile stock market.'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED: Recorder Documents (Recent Transactions)
-- =====================================================

INSERT INTO recorder_documents (
  county_id,
  property_id,
  document_type,
  recording_date,
  document_number,
  grantor,
  grantee,
  property_address,
  loan_amount,
  lender_name
) VALUES
(
  (SELECT id FROM counties WHERE county_name = 'Santa Clara' AND state = 'CA'),
  (SELECT id FROM properties WHERE parcel_id = '12345-001'),
  'Release of Mortgage',
  '2024-12-15',
  'DOC-2024-123456',
  'Wells Fargo Bank',
  'JOHNSON ROBERT T & JENNIFER M',
  '1234 Tech Valley Dr, Palo Alto, CA 94301',
  450000,
  'Wells Fargo Bank'
),
(
  (SELECT id FROM counties WHERE county_name = 'San Mateo' AND state = 'CA'),
  (SELECT id FROM properties WHERE parcel_id = '23456-001'),
  'Deed of Trust',
  '2025-01-20',
  'DOC-2025-789012',
  'MARTINEZ CARLOS',
  'Bank of America',
  '999 Peninsula Way, Menlo Park, CA 94025',
  650000,
  'Bank of America'
),
(
  (SELECT id FROM counties WHERE county_name = 'King' AND state = 'WA'),
  (SELECT id FROM properties WHERE parcel_id = '34567-001'),
  'Warranty Deed',
  '2025-02-10',
  'DOC-2025-345678',
  'Seattle Real Estate LLC',
  'ANDERSON JAMES R',
  '4321 Lake View Terrace, Bellevue, WA 98004',
  NULL,
  NULL
)
ON CONFLICT (county_id, document_number) DO NOTHING;

-- =====================================================
-- SEED: Court Filings (Life Events)
-- =====================================================

INSERT INTO court_filings (
  county_id,
  owner_id,
  case_type,
  filing_date,
  petitioner,
  respondent,
  property_addresses,
  status
) VALUES
(
  (SELECT id FROM counties WHERE county_name = 'Santa Clara' AND state = 'CA'),
  NULL,
  'probate',
  '2024-11-05',
  'Estate of Margaret Thompson',
  NULL,
  '["2345 Oak Street, San Jose, CA 95110"]'::jsonb,
  'Open'
),
(
  (SELECT id FROM counties WHERE county_name = 'San Mateo' AND state = 'CA'),
  NULL,
  'divorce',
  '2024-09-12',
  'Sarah Williams',
  'Michael Williams',
  '["8765 Elm Avenue, San Mateo, CA 94402"]'::jsonb,
  'Pending'
),
(
  (SELECT id FROM counties WHERE county_name = 'King' AND state = 'WA'),
  NULL,
  'probate',
  '2025-01-18',
  'Estate of Richard Patterson',
  NULL,
  '["5432 Pine Road, Seattle, WA 98101", "9876 Maple Lane, Bellevue, WA 98004"]'::jsonb,
  'Open'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED: Federal Signals (Wealth Indicators)
-- =====================================================

INSERT INTO federal_signals (
  source,
  person_name,
  address,
  signal_data,
  owner_id
) VALUES
(
  'sec_edgar',
  'Robert T Johnson',
  '1234 Tech Valley Dr, Palo Alto, CA 94301',
  '{
    "company": "TechCorp Inc",
    "ticker": "TECH",
    "position": "VP Engineering",
    "shares_owned": 75000,
    "share_value_estimate": 4500000,
    "filing_date": "2024-10-15",
    "filing_type": "Form 4"
  }'::jsonb,
  (SELECT id FROM owners WHERE primary_name = 'Robert T Johnson')
),
(
  'faa',
  'David Chen',
  '5678 Innovation Blvd, Los Altos, CA 94022',
  '{
    "aircraft_make": "Cirrus",
    "aircraft_model": "SR22T",
    "registration": "N123TC",
    "certification_date": "2023-06-01",
    "estimated_value": 850000
  }'::jsonb,
  (SELECT id FROM owners WHERE primary_name = 'David Chen')
),
(
  'fec',
  'Carlos Martinez',
  '999 Peninsula Way, Menlo Park, CA 94025',
  '{
    "recipient": "Tech Innovation PAC",
    "donation_amount": 25000,
    "donation_date": "2024-03-15",
    "occupation": "Software Executive",
    "employer": "Meta Platforms"
  }'::jsonb,
  (SELECT id FROM owners WHERE primary_name = 'Carlos Martinez')
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED: Insurance Agents (Distribution Network)
-- =====================================================

INSERT INTO insurance_agents (
  agent_name,
  license_number,
  license_type,
  state,
  city,
  zip,
  agency_name,
  appointment_companies,
  license_status,
  license_date
) VALUES
(
  'Jennifer Parker',
  'CA-LIC-0123456',
  'Life & Health',
  'CA',
  'Palo Alto',
  '94301',
  'Pacific Financial Group',
  '["Nationwide", "Prudential", "Pacific Life", "MassMutual", "New York Life"]'::jsonb,
  'Active',
  '2015-03-12'
),
(
  'Michael Stevens',
  'CA-LIC-0234567',
  'Life Insurance',
  'CA',
  'San Jose',
  '95110',
  'Silicon Valley Insurance Partners',
  '["Allianz", "AIG", "Lincoln Financial", "Transamerica"]'::jsonb,
  'Active',
  '2012-08-22'
),
(
  'Lisa Nguyen',
  'WA-LIC-0345678',
  'Life & Annuities',
  'WA',
  'Seattle',
  '98101',
  'Northwest Financial Solutions',
  '["Athene", "American Equity", "Pacific Life", "Nationwide"]'::jsonb,
  'Active',
  '2018-01-15'
),
(
  'Robert Garcia',
  'TX-LIC-0456789',
  'Life Insurance',
  'TX',
  'Austin',
  '78746',
  'Lone Star Insurance Agency',
  '["Midland National", "American National", "Allianz", "Jackson National"]'::jsonb,
  'Active',
  '2016-05-30'
)
ON CONFLICT (license_number, state) DO NOTHING;

-- =====================================================
-- SEED: Leads (Qualified Pipeline)
-- =====================================================

INSERT INTO leads (
  owner_id,
  status,
  priority_score,
  source_signals,
  notes
) VALUES
(
  (SELECT id FROM owners WHERE primary_name = 'Robert T Johnson'),
  'hot',
  92,
  '[
    {"type": "mortgage_payoff", "date": "2024-12-15", "amount": 450000},
    {"type": "sec_filing", "position": "VP Engineering", "company": "TechCorp Inc"},
    {"type": "high_equity", "value": 1200000}
  ]'::jsonb,
  'Recent mortgage payoff indicates $450K cash liquidity. SEC filing shows additional $4.5M in company stock. Prime candidate for qualified annuity to defer taxes on stock options.'
),
(
  (SELECT id FROM owners WHERE primary_name = 'David Chen'),
  'warm',
  85,
  '[
    {"type": "aircraft_ownership", "model": "Cirrus SR22T", "value": 850000},
    {"type": "high_equity", "value": 1400000}
  ]'::jsonb,
  'Aircraft owner - significant disposable income. Property equity $1.4M. Good candidate for wealth preservation annuity.'
),
(
  (SELECT id FROM owners WHERE primary_name = 'Carlos Martinez'),
  'qualifying',
  78,
  '[
    {"type": "political_donor", "amount": 25000, "occupation": "Software Executive"},
    {"type": "high_equity", "value": 1300000},
    {"type": "new_mortgage", "date": "2025-01-20", "amount": 650000}
  ]'::jsonb,
  'Meta executive based on FEC filing. Recent cash-out refinance ($650K). May be looking to diversify portfolio away from tech stocks.'
)
ON CONFLICT (owner_id) DO NOTHING;

-- =====================================================
-- SEED: Scraper Runs (Audit History)
-- =====================================================

INSERT INTO scraper_runs (
  scraper_name,
  county_id,
  started_at,
  completed_at,
  records_processed,
  records_created,
  records_updated,
  status
) VALUES
(
  'santa_clara_assessor',
  (SELECT id FROM counties WHERE county_name = 'Santa Clara' AND state = 'CA'),
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days' + INTERVAL '3 hours',
  125000,
  2500,
  800,
  'completed'
),
(
  'san_mateo_assessor',
  (SELECT id FROM counties WHERE county_name = 'San Mateo' AND state = 'CA'),
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day' + INTERVAL '2.5 hours',
  98000,
  1800,
  450,
  'completed'
),
(
  'king_county_assessor',
  (SELECT id FROM counties WHERE county_name = 'King' AND state = 'WA'),
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '8 hours',
  185000,
  3200,
  1100,
  'completed'
),
(
  'travis_probate_scraper',
  (SELECT id FROM counties WHERE county_name = 'Travis' AND state = 'TX'),
  NOW() - INTERVAL '6 hours',
  NULL,
  4500,
  120,
  0,
  'running'
)
ON CONFLICT DO NOTHING;

COMMIT;

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================

-- Verify seed data
DO $$
DECLARE
  county_count INTEGER;
  property_count INTEGER;
  owner_count INTEGER;
  lead_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO county_count FROM counties;
  SELECT COUNT(*) INTO property_count FROM properties;
  SELECT COUNT(*) INTO owner_count FROM owners;
  SELECT COUNT(*) INTO lead_count FROM leads;

  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Seed Data Summary:';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Counties: %', county_count;
  RAISE NOTICE 'Properties: %', property_count;
  RAISE NOTICE 'Owners: %', owner_count;
  RAISE NOTICE 'Leads: %', lead_count;
  RAISE NOTICE '===========================================';
END $$;
