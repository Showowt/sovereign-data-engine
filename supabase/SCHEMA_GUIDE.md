# Sovereign Data Engine - Database Schema Guide

## Overview
This database schema powers a real estate and annuity intelligence platform that aggregates property records, court filings, federal wealth signals, and insurance agent networks to identify high-value leads for annuity sales.

## Architecture Philosophy

### Entity Resolution Flow
```
County Scrapers → Raw Records → Entity Resolution → Unified Owner Profiles → Lead Scoring → Sales Pipeline
```

### Data Sources
1. **County Assessor** - Property ownership, valuations, tax records
2. **County Recorder** - Deeds, mortgages, liens, transfers
3. **Court Systems** - Probate, divorce, bankruptcy, evictions
4. **Federal Databases** - SEC Edgar, FEC, FAA, USCG, Census
5. **Insurance Licensing** - Agent networks, appointment companies

## Schema Design Principles

### UUID Primary Keys
All tables use UUID primary keys via `gen_random_uuid()` for:
- Distributed system compatibility
- No collision risk across multiple scrapers
- Better security (non-sequential)

### Audit Timestamps
Every table has:
- `created_at` - Automatic timestamp on insert
- `updated_at` - Automatic via `moddatetime` trigger (where applicable)

### JSONB for Flexible Data
Used for fields that vary by data source:
- `signals` - Market signals (varies by county)
- `name_variations` - Different name spellings for same person
- `wealth_signals` - Federal data structures differ by source
- `outreach_history` - Flexible tracking of contact attempts

### Soft Deletes
Not implemented yet but recommended for:
- `leads` table (status = 'do_not_contact' serves similar purpose)
- Future audit requirements

## Table Reference

### Core Tables

#### `counties`
Target county configurations for scraper prioritization.

**Key Fields:**
- `tech_wealth` - High-net-worth concentration indicator
- `satisfaction_search` - Court satisfaction search capability (critical for probate intelligence)
- `equity_pct` - Median home equity percentage (targeting metric)
- `annuity_density` - Estimated annuity ownership rate

**Usage:**
```sql
-- Get high-priority scraping targets
SELECT * FROM counties
WHERE tech_wealth = true
  AND assessor_online = true
  AND equity_pct > 40
ORDER BY annuity_density DESC;
```

#### `properties`
Raw property records from county assessors.

**Key Fields:**
- `assessed_value` vs `purchase_price` - Equity calculation basis
- `transfer_date` - Recent transfers indicate life events
- `lien_status` - Financial distress signals

**Indexes:**
- `idx_properties_owner_name` - Fast owner lookup
- `idx_properties_assessed_value` - High-value property filtering
- `idx_properties_transfer_date` - Recent activity queries

**Usage:**
```sql
-- Find high-equity properties with recent transfers
SELECT
  owner_name,
  property_address,
  assessed_value,
  assessed_value - COALESCE(purchase_price, 0) AS estimated_equity,
  transfer_date
FROM properties
WHERE assessed_value > 500000
  AND transfer_date > NOW() - INTERVAL '2 years'
ORDER BY assessed_value DESC;
```

#### `owners`
Unified owner profiles created through entity resolution.

**Key Fields:**
- `name_variations` - Array of spelling variations, married names, etc.
- `properties` - Array of property UUIDs owned
- `total_equity` - Sum of equity across all properties
- `behavioral_score` - 0-100 composite score for targeting
- `annuity_probability` - 0-100 likelihood to own annuity

**Entity Resolution Logic:**
```sql
-- Example: Merge two owners (run as service_role)
UPDATE owners
SET name_variations = name_variations || '["John R Smith", "J.R. Smith"]'::jsonb,
    properties = properties || '["uuid-1", "uuid-2"]'::jsonb,
    total_equity = 1250000
WHERE id = 'primary-owner-uuid';

DELETE FROM owners WHERE id = 'duplicate-owner-uuid';
```

**Usage:**
```sql
-- Hot leads: High equity + court activity + wealth signals
SELECT
  o.primary_name,
  o.total_equity,
  o.behavioral_score,
  jsonb_array_length(o.court_records) AS court_events,
  jsonb_array_length(o.life_events) AS life_events
FROM owners o
WHERE o.total_equity > 300000
  AND o.behavioral_score > 70
  AND jsonb_array_length(o.court_records) > 0
ORDER BY o.behavioral_score DESC, o.total_equity DESC
LIMIT 100;
```

#### `recorder_documents`
County recorder filings (deeds, mortgages, liens).

**Document Types:**
- Warranty Deed - Property sale/transfer
- Mortgage - New loan originated
- Release of Mortgage - Loan paid off (cash-out event!)
- Notice of Default - Foreclosure signal
- Tax Lien - Financial distress

**Usage:**
```sql
-- Find recent mortgage payoffs (cash liquidation event)
SELECT
  rd.grantee AS property_owner,
  rd.property_address,
  rd.loan_amount,
  rd.recording_date
FROM recorder_documents rd
WHERE rd.document_type ILIKE '%release%'
  AND rd.recording_date > NOW() - INTERVAL '6 months'
  AND rd.loan_amount > 100000
ORDER BY rd.loan_amount DESC;
```

#### `court_filings`
Court records indicating life events.

**Case Types:**
- `probate` - Inheritance event (HIGH VALUE)
- `divorce` - Asset division (MEDIUM VALUE)
- `bankruptcy` - Disqualify lead
- `eviction` - Landlord intelligence

**Usage:**
```sql
-- Probate cases in high-equity counties (inheritance annuity opportunity)
SELECT
  cf.petitioner,
  cf.filing_date,
  c.county_name,
  c.median_equity
FROM court_filings cf
JOIN counties c ON c.id = cf.county_id
WHERE cf.case_type = 'probate'
  AND cf.filing_date > NOW() - INTERVAL '1 year'
  AND c.median_equity > 200000
ORDER BY cf.filing_date DESC;
```

#### `federal_signals`
Wealth indicators from federal databases.

**Source Types:**
- `sec_edgar` - Company insiders, executives
- `fec` - Political donors (wealth indicator)
- `faa` - Aircraft owners (HIGH NET WORTH)
- `uscg` - Boat owners (net worth indicator)
- `census` - Demographic overlays

**Signal Data Examples:**
```json
// SEC Edgar
{
  "company": "Tesla Inc",
  "position": "VP Engineering",
  "shares_owned": 50000,
  "filing_date": "2025-01-15"
}

// FAA
{
  "aircraft_make": "Cessna",
  "aircraft_model": "Citation CJ3",
  "registration": "N123AB",
  "certification_date": "2024-06-01"
}
```

**Usage:**
```sql
-- Cross-reference SEC insiders with property records
SELECT
  fs.person_name,
  fs.signal_data->>'company' AS company,
  fs.signal_data->>'position' AS position,
  o.total_equity
FROM federal_signals fs
LEFT JOIN owners o ON o.id = fs.owner_id
WHERE fs.source = 'sec_edgar'
  AND o.total_equity IS NOT NULL
ORDER BY o.total_equity DESC;
```

#### `insurance_agents`
Insurance agent network for distribution strategy.

**Key Fields:**
- `appointment_companies` - Array of carriers (look for annuity-focused carriers)
- `license_type` - Life insurance license required for annuity sales
- `owner_id` - If agent owns property in our database (potential client too!)

**Usage:**
```sql
-- Find life insurance agents in target counties who also own property
SELECT
  ia.agent_name,
  ia.agency_name,
  ia.city,
  ia.state,
  o.total_equity
FROM insurance_agents ia
JOIN owners o ON o.id = ia.owner_id
WHERE ia.license_type ILIKE '%life%'
  AND ia.license_status = 'Active'
  AND o.total_equity > 250000
ORDER BY o.total_equity DESC;
```

#### `leads`
Qualified lead pipeline with assignment and status tracking.

**Status Flow:**
```
new → qualifying → hot/warm/cold → contacted → nurturing → converted
                                              ↓
                                         disqualified
```

**Priority Score Calculation (example):**
```sql
-- Composite score: equity (40%) + signals (30%) + timing (30%)
UPDATE leads
SET priority_score = LEAST(100,
  (COALESCE(
    (SELECT total_equity FROM owners WHERE id = leads.owner_id) / 10000, 0
  ) * 0.4) +
  (jsonb_array_length(source_signals) * 5 * 0.3) +
  (
    CASE
      WHEN jsonb_array_length(source_signals) > 0 THEN 30
      ELSE 0
    END * 0.3
  )
);
```

**Usage:**
```sql
-- My active leads (for assigned user)
SELECT
  l.id,
  o.primary_name,
  l.status,
  l.priority_score,
  jsonb_array_length(l.source_signals) AS signal_count,
  l.updated_at
FROM leads l
JOIN owners o ON o.id = l.owner_id
WHERE l.assigned_to = auth.uid()
  AND l.status IN ('hot', 'warm', 'contacted', 'nurturing')
ORDER BY l.priority_score DESC, l.updated_at DESC;
```

#### `scraper_runs`
Audit log for all scraper executions.

**Usage:**
```sql
-- Scraper performance monitoring
SELECT
  scraper_name,
  COUNT(*) AS total_runs,
  AVG(records_created) AS avg_records_created,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) AS avg_duration_seconds,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_runs
FROM scraper_runs
WHERE started_at > NOW() - INTERVAL '30 days'
GROUP BY scraper_name
ORDER BY total_runs DESC;
```

#### `user_searches`
Saved search filters for quick access.

**Filter Examples:**
```json
{
  "min_equity": 300000,
  "max_equity": 1000000,
  "counties": ["Santa Clara", "San Mateo"],
  "has_probate": true,
  "min_behavioral_score": 70
}
```

## Index Optimization

### Current Indexes (Included in Migration)

#### Properties Table
- `idx_properties_county_id` - JOIN performance
- `idx_properties_owner_name` - Name lookups (consider full-text search upgrade)
- `idx_properties_assessed_value` - High-value filtering
- `idx_properties_transfer_date` - Recent activity queries
- `idx_properties_property_type` - Type-specific analysis

#### Owners Table
- `idx_owners_total_equity` - Critical for lead prioritization
- `idx_owners_behavioral_score` - Lead scoring queries
- `idx_owners_annuity_probability` - Targeting queries
- `idx_owners_name_variations` - GIN index for JSONB searches

#### Leads Table
- `idx_leads_status` - Dashboard filtering
- `idx_leads_priority_score` - Lead queue ordering
- `idx_leads_assigned_to` - User workload queries

### Additional Recommended Indexes

```sql
-- Full-text search on property owner names
CREATE INDEX idx_properties_owner_name_fts ON properties
USING GIN(to_tsvector('english', owner_name));

-- Compound index for hot lead queries
CREATE INDEX idx_owners_hot_leads ON owners(behavioral_score DESC, total_equity DESC)
WHERE behavioral_score > 70 AND total_equity > 300000;

-- Recent activity tracking
CREATE INDEX idx_recorder_documents_recent ON recorder_documents(recording_date DESC)
WHERE recording_date > NOW() - INTERVAL '1 year';

-- Court case type + date filtering
CREATE INDEX idx_court_filings_probate_recent ON court_filings(filing_date DESC)
WHERE case_type = 'probate';
```

## RLS Security Model

### Access Levels

1. **Authenticated Users** - Read-only access to all data tables
2. **Service Role** - Full access (scrapers, entity resolution, batch jobs)
3. **User-owned Data** - Users can manage their own `user_searches` and assigned `leads`

### Why This Model?

- **Scrapers run as service_role** - Bypass RLS for bulk operations
- **Entity resolution as service_role** - Cross-user data merging
- **Sales teams read-only** - Prevents accidental data corruption
- **Lead assignment** - Users only see their assigned leads (prevents poaching)

### Security Considerations

```sql
-- BAD: Trusting client-provided user_id
SELECT * FROM leads WHERE assigned_to = $user_id_from_client;

-- GOOD: Using auth.uid() in RLS policy
-- Policy ensures: assigned_to = auth.uid()
SELECT * FROM leads; -- Automatically filtered by RLS
```

## Performance Tuning

### Query Optimization Tips

1. **Use Covering Indexes**
```sql
-- Instead of selecting all columns
SELECT * FROM properties WHERE county_id = $1;

-- Select only needed columns (can use index-only scan)
SELECT id, owner_name, assessed_value FROM properties WHERE county_id = $1;
```

2. **Batch Inserts for Scrapers**
```sql
-- BAD: Individual inserts (slow)
INSERT INTO properties (parcel_id, county_id, ...) VALUES (...);
INSERT INTO properties (parcel_id, county_id, ...) VALUES (...);

-- GOOD: Batch insert (fast)
INSERT INTO properties (parcel_id, county_id, ...)
VALUES
  (...),
  (...),
  (...)
ON CONFLICT (parcel_id, county_id) DO UPDATE SET updated_at = NOW();
```

3. **Pagination for Large Result Sets**
```sql
-- Use cursor-based pagination, not OFFSET
SELECT * FROM owners
WHERE behavioral_score > 70
  AND id > $last_seen_id
ORDER BY id
LIMIT 100;
```

### Connection Pooling
For scraper fleet:
- Use Supabase connection pooler (port 6543)
- Max 3 connections per scraper instance
- Use prepared statements for repeated queries

## Common Query Patterns

### Lead Generation Query
```sql
-- High-equity owners with recent life events
SELECT
  o.id,
  o.primary_name,
  o.total_equity,
  o.behavioral_score,
  COUNT(DISTINCT cf.id) AS court_events,
  COUNT(DISTINCT fs.id) AS wealth_signals,
  MAX(cf.filing_date) AS most_recent_event
FROM owners o
LEFT JOIN court_filings cf ON cf.owner_id = o.id
  AND cf.filing_date > NOW() - INTERVAL '2 years'
LEFT JOIN federal_signals fs ON fs.owner_id = o.id
WHERE o.total_equity > 300000
  AND o.annuity_probability > 50
GROUP BY o.id, o.primary_name, o.total_equity, o.behavioral_score
HAVING COUNT(DISTINCT cf.id) > 0 OR COUNT(DISTINCT fs.id) > 0
ORDER BY o.behavioral_score DESC, o.total_equity DESC
LIMIT 100;
```

### County Prioritization Query
```sql
-- Best counties to scrape next
SELECT
  c.county_name,
  c.state,
  c.median_equity,
  c.annuity_density,
  COALESCE(sr.last_scrape, '1970-01-01'::date) AS last_scrape,
  COUNT(p.id) AS properties_in_db
FROM counties c
LEFT JOIN LATERAL (
  SELECT MAX(completed_at)::date AS last_scrape
  FROM scraper_runs
  WHERE county_id = c.id AND status = 'completed'
) sr ON true
LEFT JOIN properties p ON p.county_id = c.id
WHERE c.tech_wealth = true
  AND c.assessor_online = true
GROUP BY c.id, c.county_name, c.state, c.median_equity, c.annuity_density, sr.last_scrape
ORDER BY sr.last_scrape ASC, c.annuity_density DESC
LIMIT 10;
```

### Agent Network Analysis
```sql
-- Top agents to recruit as distribution partners
SELECT
  ia.agent_name,
  ia.agency_name,
  ia.city,
  ia.state,
  jsonb_array_length(ia.appointment_companies) AS carrier_count,
  COUNT(DISTINCT p.id) AS local_properties,
  AVG(p.assessed_value) AS avg_property_value
FROM insurance_agents ia
JOIN properties p ON p.county_id IN (
  SELECT id FROM counties WHERE city = ia.city AND state = ia.state
)
WHERE ia.license_type ILIKE '%life%'
  AND ia.license_status = 'Active'
GROUP BY ia.id, ia.agent_name, ia.agency_name, ia.city, ia.state, ia.appointment_companies
HAVING COUNT(DISTINCT p.id) > 100
ORDER BY avg_property_value DESC, carrier_count DESC
LIMIT 50;
```

## Migration Workflow

### Initial Setup
```bash
# 1. Initialize Supabase project
supabase init

# 2. Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# 3. Run migration
supabase db push

# 4. Verify schema
supabase db diff
```

### Schema Changes
```bash
# 1. Create new migration
supabase migration new add_feature_name

# 2. Edit migration file in supabase/migrations/

# 3. Test locally
supabase db reset  # Resets local DB and runs all migrations

# 4. Push to production
supabase db push
```

### Type Generation
```bash
# Generate TypeScript types after schema changes
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

## Rollback Procedure

```bash
# If migration fails, rollback using the rollback file
psql $DATABASE_URL -f supabase/migrations/001_initial_schema_rollback.sql
```

Or via Supabase dashboard:
1. Go to Database > Migrations
2. Find failed migration
3. Click "Revert"

## Next Steps

### Recommended Enhancements

1. **Materialized Views** for expensive aggregations
```sql
CREATE MATERIALIZED VIEW owner_summary AS
SELECT
  o.id,
  o.primary_name,
  o.total_equity,
  COUNT(DISTINCT p.id) AS property_count,
  COUNT(DISTINCT cf.id) AS court_event_count,
  COUNT(DISTINCT fs.id) AS wealth_signal_count
FROM owners o
LEFT JOIN properties p ON p.id::text = ANY(
  SELECT jsonb_array_elements_text(o.properties)
)
LEFT JOIN court_filings cf ON cf.owner_id = o.id
LEFT JOIN federal_signals fs ON fs.owner_id = o.id
GROUP BY o.id, o.primary_name, o.total_equity;

CREATE INDEX idx_owner_summary_equity ON owner_summary(total_equity DESC);
REFRESH MATERIALIZED VIEW CONCURRENTLY owner_summary;
```

2. **Partitioning** for `scraper_runs` (grows quickly)
```sql
CREATE TABLE scraper_runs_2026_02 PARTITION OF scraper_runs
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

3. **Full-Text Search** for owner name matching
```sql
ALTER TABLE owners ADD COLUMN name_search tsvector;
CREATE INDEX idx_owners_name_search ON owners USING GIN(name_search);

CREATE TRIGGER owners_name_search_update
BEFORE INSERT OR UPDATE ON owners
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(name_search, 'pg_catalog.english', primary_name);
```

4. **Audit Log Table** for lead updates
```sql
CREATE TABLE lead_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  old_status lead_status,
  new_status lead_status,
  old_notes TEXT,
  new_notes TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Support

For schema questions or migration issues:
- MachineMind Development Team
- Supabase Docs: https://supabase.com/docs/guides/database
- PostgreSQL Docs: https://www.postgresql.org/docs/
