/**
 * Sovereign Data Engine - Data Module Index
 * Central export for all data definitions
 */

// Signal data
export { SIGNALS, countSignals, countAnnuitySignals } from "./signals";

// Target counties
export {
  TARGET_COUNTIES,
  getCountyByState,
  getTechWealthCounties,
  getHighAnnuityCounties,
  getCountyByName,
  getTotalEstimatedEquity,
} from "./counties";

// Scraper fleet
export { SCRAPER_FLEET, getScraperList, countScraperTargets } from "./scrapers";

// Entity resolution
export { ENTITY_RESOLUTION, ENTITY_EXAMPLES } from "./entity-resolution";

// Competitor analysis
export {
  COMPETITORS,
  SOVEREIGN_ADVANTAGES,
  COMPARISON_TABLE,
} from "./competitors";

// Data sources
export {
  DATA_SOURCES,
  getSourcesByTier,
  countAllSources,
  getFreeSources,
  getLowCostSources,
  getTotalMonthlyCost,
  getDataSourceCategories,
  getSourcesBySignal,
} from "./data-sources";

// Architecture
export {
  ARCHITECTURE,
  ARCHITECTURE_STATS,
  getComponentsByLayer,
  getAllTechnologies,
  getComponentCounts,
} from "./architecture";

// Pricing
export {
  PRICING,
  ADD_ONS,
  VOLUME_DISCOUNTS,
  ROI_ASSUMPTIONS,
  getPricingTiers,
  getPricingByTier,
  calculateAnnualPrice,
  getRecommendedTier,
  formatFeatureComparison,
} from "./pricing";

// Re-export types for convenience
export type {
  Signal,
  SignalCategory,
  SignalsData,
  TargetCounty,
  ScraperFleetItem,
  ScraperFleet,
  ScraperTarget,
  EntityResolution,
  MatchingLayer,
  Competitor,
  BlindSpots,
  DataSourceItem,
  DataSourceTier,
  DataSources,
  ArchComponent,
  ArchSection,
  Architecture,
  PricingTier,
  Pricing,
  TimingWindow,
  ScraperSpec,
} from "../types";
