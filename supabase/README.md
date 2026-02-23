# Sovereign Data Engine - Supabase Database

## Quick Start

### 1. Initialize Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Run Initial Migration

```bash
# Apply migration to local development database
supabase db reset

# Or push to production
supabase db push
```

### 3. Generate TypeScript Types

```bash
# Generate types for your specific project
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

### 4. Load Seed Data (Development Only)

```bash
# Load sample data for testing
psql $DATABASE_URL -f supabase/seed.sql
```

## File Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql         # Main schema definition
│   └── 001_initial_schema_rollback.sql # Rollback script
├── seed.sql                             # Development seed data
├── SCHEMA_GUIDE.md                      # Comprehensive schema documentation
└── README.md                            # This file

src/lib/
├── database.types.ts                    # TypeScript type definitions
└── supabase-queries.ts                  # Pre-built query functions
```

## Database Tables

### Core Tables

1. **counties** - Target county configurations for scraping
2. **properties** - Property records from county assessors
3. **owners** - Unified owner profiles (entity resolution output)
4. **recorder_documents** - County recorder filings (deeds, mortgages)
5. **court_filings** - Court records (probate, divorce, bankruptcy)
6. **federal_signals** - SEC, FEC, FAA, USCG, Census data
7. **insurance_agents** - Agent network data
8. **leads** - Qualified lead pipeline
9. **scraper_runs** - Audit log for scraper executions
10. **user_searches** - Saved search filters

## Key Features

### Security (RLS)
- Every table has Row Level Security enabled
- Authenticated users: Read-only access to data
- Service role: Full access (for scrapers and batch operations)
- User-scoped: Users can only see their assigned leads and searches

### Performance
- Comprehensive indexes on all foreign keys
- GIN indexes for JSONB columns
- Covering indexes for common query patterns
- Automatic `updated_at` triggers using moddatetime

### Type Safety
- Complete TypeScript types for all tables
- Insert/Update/Row types for each table
- Strongly-typed Database interface for Supabase client

## Common Operations

### Query Examples

```typescript
import { getHotLeads, getRecentProbateCases } from '@/lib/supabase-queries'

// Get high-value leads
const hotLeads = await getHotLeads(300000, 70, 100)

// Get recent probate cases (inheritance opportunities)
const probateCases = await getRecentProbateCases(12, 100)
```

### Direct Supabase Client Usage

```typescript
import { supabase } from '@/lib/supabase-queries'

// Get properties in Santa Clara County
const { data: properties } = await supabase
  .from('properties')
  .select('*, counties(county_name, state)')
  .eq('counties.county_name', 'Santa Clara')
  .eq('counties.state', 'CA')
  .order('assessed_value', { ascending: false })
  .limit(100)
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For scrapers only
```

## Migration Workflow

### Creating a New Migration

```bash
# 1. Create migration file
supabase migration new add_feature_name

# 2. Edit the migration file in supabase/migrations/

# 3. Test locally
supabase db reset

# 4. Verify changes
supabase db diff

# 5. Push to production
supabase db push
```

### Rolling Back a Migration

```bash
# Use the rollback SQL file
psql $DATABASE_URL -f supabase/migrations/001_initial_schema_rollback.sql

# Or via Supabase dashboard:
# Database > Migrations > Find migration > Click "Revert"
```

## Index Optimization

### Current Indexes (Included)

All foreign keys are indexed:
- `idx_properties_county_id`
- `idx_leads_owner_id`
- `idx_court_filings_owner_id`
- etc.

JSONB GIN indexes:
- `idx_owners_name_variations` - Fast JSONB array searches
- `idx_federal_signals_signal_data` - Flexible signal data queries

### Adding Custom Indexes

```sql
-- Full-text search on owner names
CREATE INDEX idx_properties_owner_name_fts ON properties
USING GIN(to_tsvector('english', owner_name));

-- Partial index for hot leads
CREATE INDEX idx_owners_hot_leads ON owners(behavioral_score DESC, total_equity DESC)
WHERE behavioral_score > 70 AND total_equity > 300000;
```

## RLS Policy Examples

### Read-Only for Authenticated Users

```sql
CREATE POLICY "Authenticated users can read properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);
```

### User-Scoped Access

```sql
CREATE POLICY "Users can read their assigned leads"
  ON leads FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() OR assigned_to IS NULL);
```

### Service Role Bypass

```sql
CREATE POLICY "Service role can manage all leads"
  ON leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

## Performance Tips

### 1. Use Select Specific Columns

```typescript
// BAD - Fetches all columns
const { data } = await supabase.from('properties').select('*')

// GOOD - Only fetch needed columns
const { data } = await supabase
  .from('properties')
  .select('id, owner_name, assessed_value')
```

### 2. Pagination with Cursor

```typescript
// BAD - OFFSET gets slower with large offsets
const { data } = await supabase.from('owners').select('*').range(1000, 1100)

// GOOD - Cursor-based pagination
const { data } = await supabase
  .from('owners')
  .select('*')
  .gt('id', lastSeenId)
  .order('id')
  .limit(100)
```

### 3. Batch Inserts for Scrapers

```typescript
// BAD - Multiple round trips
for (const property of properties) {
  await supabase.from('properties').insert(property)
}

// GOOD - Single batch insert
await supabase.from('properties').upsert(properties, {
  onConflict: 'parcel_id,county_id'
})
```

## Scraper Integration

### Creating a Scraper Run

```typescript
import { createScraperRun, completeScraperRun } from '@/lib/supabase-queries'

// Start scraper run
const run = await createScraperRun('santa_clara_assessor', countyId)

try {
  // Scrape data...
  const results = await scrapeCounty()

  // Complete run
  await completeScraperRun(
    run.id,
    results.processed,
    results.created,
    results.updated
  )
} catch (error) {
  // Log error
  await completeScraperRun(run.id, 0, 0, 0, [{ error: error.message }])
}
```

## Entity Resolution

Entity resolution combines multiple property records for the same owner into a unified owner profile.

### Example Entity Resolution

```typescript
// 1. Find potential duplicates
const { data: properties } = await supabase
  .from('properties')
  .select('owner_name, id, assessed_value')
  .order('owner_name')

// 2. Group by similar names (fuzzy matching logic)
const ownerGroups = groupBySimilarNames(properties)

// 3. Create unified owner profiles
for (const group of ownerGroups) {
  const totalEquity = group.reduce((sum, p) => sum + p.assessed_value, 0)

  await supabase.from('owners').insert({
    primary_name: group[0].owner_name,
    name_variations: group.map(p => p.owner_name),
    properties: group.map(p => p.id),
    total_equity: totalEquity
  })
}
```

## Lead Scoring

Lead scoring combines multiple signals to prioritize outreach.

### Example Scoring Formula

```sql
-- Update lead priority scores
UPDATE leads
SET priority_score = LEAST(100,
  -- Equity component (40%)
  (COALESCE((SELECT total_equity FROM owners WHERE id = leads.owner_id) / 10000, 0) * 0.4) +

  -- Signal count component (30%)
  (jsonb_array_length(source_signals) * 5 * 0.3) +

  -- Timing component (30%)
  (CASE
    WHEN jsonb_array_length(source_signals) > 0 THEN 30
    ELSE 0
  END * 0.3)
);
```

## Monitoring

### Check Scraper Performance

```sql
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

### Database Size Monitoring

```sql
-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### RLS Blocking Queries

If queries return empty results unexpectedly:

```typescript
// Check if RLS is blocking
const { data, error } = await supabase.from('properties').select('*')

if (error) {
  console.error('RLS Error:', error.message)
  // Solution: Use service_role key for scraper operations
}
```

### Migration Conflicts

If migration fails due to existing data:

```bash
# 1. Backup production data
pg_dump $DATABASE_URL > backup.sql

# 2. Test migration on local copy
supabase db reset

# 3. If successful, apply to production
supabase db push
```

### Performance Issues

If queries are slow:

```sql
-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.5
ORDER BY n_distinct DESC;

-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SCHEMA_GUIDE.md](./SCHEMA_GUIDE.md) - Detailed schema reference
- [database.types.ts](../src/lib/database.types.ts) - TypeScript types
- [supabase-queries.ts](../src/lib/supabase-queries.ts) - Pre-built queries

## Support

For questions or issues:
- Check SCHEMA_GUIDE.md for detailed documentation
- Review supabase-queries.ts for query examples
- Consult Supabase dashboard for real-time monitoring
