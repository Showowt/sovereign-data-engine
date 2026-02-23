/**
 * Sovereign Data Engine - Demo Leads Data
 * Sample qualified leads showing what the engine produces
 */

import type { Lead, LeadTier } from "../types";

export const DEMO_LEADS: Lead[] = [
  {
    id: "lead-001",
    name: "James & Patricia Thornton Trust",
    type: "Trust",
    county: "Palm Beach",
    state: "FL",
    address: "2847 S Ocean Blvd, Palm Beach FL",
    value: 4250000,
    equity: 4250000,
    equityPct: 100,
    signals: [
      "Mortgage Satisfaction (filed 01/15/2026)",
      "FAA Aircraft Registry (Cessna Citation)",
      "FEC: $47K donations 2024 cycle",
      "Trust vehicle (estate-planning conscious)",
      "Multi-property: 3 in Palm Beach County",
    ],
    score: 94,
    timing: "IMMEDIATE — satisfaction filed 5 weeks ago",
    annuityProbability: 82,
    recommended: "Hernsted Priority Track — Lexi Smiley",
    tier: "SOVEREIGN",
    createdAt: "2026-02-18",
  },
  {
    id: "lead-002",
    name: "Michael Chen",
    type: "Individual",
    county: "King County",
    state: "WA",
    address: "4421 92nd Ave NE, Bellevue WA",
    value: 2180000,
    equity: 2180000,
    equityPct: 100,
    signals: [
      "Free & Clear (no active liens)",
      "SEC EDGAR: Form 4 filer (Amazon insider)",
      "Professional License: WA State Bar",
      "Ownership tenure: 18 years",
      "Single property, no HELOC",
    ],
    score: 88,
    timing: "WARM — free & clear confirmed, no trigger event",
    annuityProbability: 45,
    recommended: "Data Moat Track — Brady Muse deep qualification",
    tier: "OPERATOR",
    createdAt: "2026-02-15",
  },
  {
    id: "lead-003",
    name: "Rodriguez Family LLC",
    type: "LLC",
    county: "Miami-Dade",
    state: "FL",
    address: "1521 Brickell Ave #PH4, Miami FL",
    value: 1850000,
    equity: 1850000,
    equityPct: 100,
    signals: [
      "Cash purchase (no mortgage recorded)",
      "Multi-property: 5 in Miami-Dade (total $6.2M)",
      "Entity: FL LLC active, registered agent in Coral Gables",
      "FEC: Maria Rodriguez $12K donations",
      "Divorce filing detected (Miami-Dade Family Court)",
    ],
    score: 91,
    timing:
      "URGENT — divorce filing 3 weeks ago, 70%+ sale probability within 18 months",
    annuityProbability: 35,
    recommended: "Immediate Outreach — Stephanie Vasquez (relationship track)",
    tier: "SOVEREIGN",
    createdAt: "2026-02-20",
  },
  {
    id: "lead-004",
    name: "William & Susan Hargrove",
    type: "Individual",
    county: "Maricopa",
    state: "AZ",
    address: "8834 E Pinnacle Peak Rd, Scottsdale AZ",
    value: 920000,
    equity: 828000,
    equityPct: 90,
    signals: [
      "High equity (90% — original loan nearly paid)",
      "Owner age estimated 67 (purchase 1998)",
      "Trust vehicle: Hargrove Family Trust",
      "Maricopa annuity zone (Sun City corridor)",
      "No active HELOC, no second mortgage",
    ],
    score: 79,
    timing:
      "ANNUITY TARGET — high probability holder, surrender period likely expired",
    annuityProbability: 88,
    recommended:
      "Annuity Track — partner through local insurance agent network",
    tier: "OPERATOR",
    createdAt: "2026-02-12",
  },
  {
    id: "lead-005",
    name: "Apex Ventures Holdings LLC",
    type: "LLC",
    county: "Clark County",
    state: "NV",
    address: "2601 Las Vegas Blvd S #4200, Las Vegas NV",
    value: 3400000,
    equity: 3400000,
    equityPct: 100,
    signals: [
      "Cash purchase (NV non-disclosure, no mortgage filed)",
      "Multi-property: 8 in Clark County (total $11.4M portfolio)",
      "NV LLC registered to CA address (transplant equity)",
      "3 eviction filings in 12 months (burned-out landlord signal)",
      "Code violations on 2 properties (unresolved 8+ months)",
    ],
    score: 86,
    timing:
      "CRITICAL — burned-out investor showing exit signals across portfolio",
    annuityProbability: 15,
    recommended: "Portfolio Acquisition Track — Roger Gallo (risk alignment)",
    tier: "SOVEREIGN",
    createdAt: "2026-02-19",
  },
  {
    id: "lead-006",
    name: "Eleanor J. Whitfield Irrevocable Trust",
    type: "Trust",
    county: "San Mateo",
    state: "CA",
    address: "1492 Ralston Ave, Burlingame CA",
    value: 3600000,
    equity: 3420000,
    equityPct: 95,
    signals: [
      "Prop 13 equity gap: assessed $580K, market $3.6M",
      "Probate filing detected (San Mateo Superior Court)",
      "Irrevocable trust = estate disposition likely",
      "Ownership since 1987 (38 years)",
      "No active liens, property in excellent condition",
    ],
    score: 92,
    timing: "ESTATE DISPOSITION — probate filed 6 weeks ago, 6-12 month window",
    annuityProbability: 72,
    recommended:
      "Estate Track — Daniel Warren (nurture) + Brady Muse (diligence)",
    tier: "SOVEREIGN",
    createdAt: "2026-02-16",
  },
];

// Helper functions
export function getLeadsByTier(tier: LeadTier): Lead[] {
  return DEMO_LEADS.filter((lead) => lead.tier === tier);
}

export function getLeadsByCounty(county: string): Lead[] {
  return DEMO_LEADS.filter((lead) => lead.county === county);
}

export function getUrgentLeads(): Lead[] {
  return DEMO_LEADS.filter(
    (lead) =>
      lead.timing.includes("URGENT") ||
      lead.timing.includes("CRITICAL") ||
      lead.timing.includes("IMMEDIATE"),
  );
}

export function getAnnuityTargets(minProbability: number = 70): Lead[] {
  return DEMO_LEADS.filter((lead) => lead.annuityProbability >= minProbability);
}

export function getTotalPipelineEquity(): number {
  return DEMO_LEADS.reduce((sum, lead) => sum + lead.equity, 0);
}

export function getAverageScore(): number {
  return Math.round(
    DEMO_LEADS.reduce((sum, lead) => sum + lead.score, 0) / DEMO_LEADS.length,
  );
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}
