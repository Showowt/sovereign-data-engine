/**
 * Sovereign Data Engine - Core Type Definitions
 * Hernsted Private Capital Intelligence Platform
 */

// =============================================================================
// COUNTY DATA TYPES
// =============================================================================

export interface TargetCounty {
  county: string;
  state: string;
  city: string;
  medianValue: string;
  medianEquity: string;
  equityPct: string;
  assessorUrl: string;
  recorderUrl: string;
  assessorOnline: boolean;
  recorderOnline: boolean;
  bulkDownload: boolean;
  techWealth: boolean;
  satisfactionSearch: boolean;
  signals: string[];
  annuityDensity: string;
  scrapeNotes: string;
}

// =============================================================================
// SIGNAL TYPES
// =============================================================================

export interface ScraperSpec {
  method: string;
  endpoint?: string;
  params?: string;
  output?: string;
  frequency?: string;
  query?: string;
  logic?: string;
  trigger?: string;
  cost?: string;
  fields?: string;
  filter?: string;
  enrichment?: string;
  source?: string;
}

export interface TimingWindow {
  purchaseYear: string;
  surrenderPeriod: string;
  freeDate: string;
  status: string;
  volume: string;
}

export interface Signal {
  name: string;
  source: string;
  cost?: string;
  legality?: string;
  strength?: string;
  description?: string;
  interpretation?: string[];
  howToFind?: string | string[];
  scraperSpec?: ScraperSpec;
  qualificationLogic?: string;
  formula?: string;
  matchCriteria?: string[];
  scoringModel?: string;
  timeWindow?: string;
  actionPlan?: string;
  timingWindows?: TimingWindow[];
  message?: string;
  seoTargets?: string[];
  contentPieces?: string[];
  keyLicenses?: string[];
  partnershipLogic?: string;
  differentiation?: string;
}

export interface SignalCategory {
  name: string;
  icon: string;
  color: string;
  signals: Signal[];
}

export interface SignalsData {
  equity: SignalCategory;
  lifeEvents: SignalCategory;
  wealth: SignalCategory;
  annuity: SignalCategory;
  dark: SignalCategory;
}

// =============================================================================
// SCRAPER TYPES
// =============================================================================

export interface ScraperTarget {
  name: string;
  method?: string;
  frequency?: string;
}

export interface ScraperFleetItem {
  name: string;
  tech: string;
  targets: string[] | ScraperTarget[];
  frequency: string;
  fields?: string[];
  storage: string;
  volumeEstimate?: string;
  documentTypes?: string[];
  keyLogic?: string;
  sources?: ScraperTarget[];
  filter?: string;
  enrichment?: string;
}

export interface ScraperFleet {
  countyAssessor: ScraperFleetItem;
  countyRecorder: ScraperFleetItem;
  courtRecords: ScraperFleetItem;
  obituaryMonitor: ScraperFleetItem;
  secEdgar: ScraperFleetItem;
  linkedInEnrichment: ScraperFleetItem;
}

// =============================================================================
// ENTITY RESOLUTION TYPES
// =============================================================================

export interface MatchingLayer {
  layer: string;
  confidence: string;
  method: string;
}

export interface EntityResolution {
  description: string;
  example: string;
  matchingLayers: MatchingLayer[];
  outputProfile: Record<string, string>;
}

// =============================================================================
// COMPETITOR ANALYSIS TYPES
// =============================================================================

export interface Competitor {
  name: string;
  cost: string;
  does: string[];
  doesNot: string[];
  legalGaps?: string[];
}

export interface BlindSpots {
  propStream: Competitor;
  batchLeads: Competitor;
  dataTree: Competitor;
  blackKnight: Competitor;
  coreLogic: Competitor;
}

// =============================================================================
// DATA SOURCE TYPES
// =============================================================================

export interface DataSourceItem {
  name: string;
  data: string;
  access?: string;
  coverage?: string;
  refresh?: string;
  signal?: string;
}

export interface DataSourceTier {
  name: string;
  cost: string;
  legality: string;
  sources: DataSourceItem[];
}

export interface DataSources {
  free: DataSourceTier;
  lowCost: DataSourceTier;
  premium: DataSourceTier;
  enterprise: DataSourceTier;
}

// =============================================================================
// ARCHITECTURE TYPES
// =============================================================================

export interface ArchComponent {
  name: string;
  desc: string;
}

export interface ArchSection {
  name: string;
  tech: string;
  components: ArchComponent[];
}

export interface Architecture {
  ingestion: ArchSection;
  storage: ArchSection;
  processing: ArchSection;
  intelligence: ArchSection;
  delivery: ArchSection;
}

// =============================================================================
// PRICING TYPES
// =============================================================================

export interface PricingTier {
  name: string;
  price: string;
  records: string;
  skipTrace: string;
  users: number | string;
  features: string[];
}

export interface Pricing {
  starter: PricingTier;
  professional: PricingTier;
  enterprise: PricingTier;
  custom: PricingTier;
}

// =============================================================================
// LEAD TYPES
// =============================================================================

export type LeadTier = "SOVEREIGN" | "OPERATOR" | "DELEGATOR";
export type LeadType = "Individual" | "Trust" | "LLC" | "Corporation";

export interface Lead {
  id: string;
  name: string;
  type: LeadType;
  county: string;
  state: string;
  address: string;
  value: number;
  equity: number;
  equityPct: number;
  signals: string[];
  score: number;
  timing: string;
  annuityProbability: number;
  recommended: string;
  tier: LeadTier;
  createdAt: string;
}
