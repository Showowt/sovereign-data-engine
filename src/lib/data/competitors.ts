/**
 * Sovereign Data Engine - Competitor Analysis
 * Market gap analysis against existing data providers
 */

import type { BlindSpots } from "../types";

export const COMPETITORS: BlindSpots = {
  propStream: {
    name: "PropStream",
    cost: "$99/mo - $399/mo",
    does: [
      "Nationwide property data",
      "Ownership records",
      "Tax records",
      "Basic skip tracing",
      "Comparable sales",
      "Marketing lists",
    ],
    doesNot: [
      "Real-time mortgage satisfaction monitoring",
      "Probate/inheritance detection",
      "Annuity holder identification",
      "Life event correlation",
      "Entity resolution across sources",
      "Wealth signal scoring",
    ],
    legalGaps: [
      "No differentiation on data legality",
      "Skip trace data sourcing unclear",
    ],
  },
  batchLeads: {
    name: "BatchLeads",
    cost: "$59/mo - $299/mo",
    does: [
      "Property data aggregation",
      "Skip tracing",
      "Driving for dollars app",
      "Direct mail integration",
      "Basic filtering",
    ],
    doesNot: [
      "Recorder document monitoring",
      "Court records integration",
      "Obituary correlation",
      "SEC filing analysis",
      "Professional profile enrichment",
      "Annuity-specific signals",
    ],
    legalGaps: [
      "Heavy reliance on third-party data vendors",
      "No transparency on data sourcing",
    ],
  },
  dataTree: {
    name: "DataTree (First American)",
    cost: "Enterprise pricing",
    does: [
      "Comprehensive title data",
      "Lien information",
      "Transaction history",
      "Property reports",
      "API access for integration",
    ],
    doesNot: [
      "Life event detection",
      "Wealth signal modeling",
      "Real-time document monitoring",
      "Cross-source entity resolution",
      "Annuity/insurance correlation",
      "Social/professional enrichment",
    ],
    legalGaps: [
      "Data usage restricted by licensing agreements",
      "Resale and redistribution prohibited",
    ],
  },
  blackKnight: {
    name: "Black Knight (ICE)",
    cost: "Enterprise ($5K+/mo)",
    does: [
      "Mortgage performance data",
      "Property valuations",
      "Transaction data",
      "Default/foreclosure tracking",
      "Lending analytics",
    ],
    doesNot: [
      "Free-and-clear property identification",
      "Non-mortgage wealth signals",
      "Life event timing",
      "Professional profile data",
      "Annuity market focus",
      "Small-scale accessibility",
    ],
    legalGaps: [
      "Enterprise contracts with strict use cases",
      "Not available to smaller operators",
    ],
  },
  coreLogic: {
    name: "CoreLogic",
    cost: "Enterprise ($10K+/mo)",
    does: [
      "Property data nationwide",
      "Flood/hazard risk",
      "Property characteristics",
      "Market trends",
      "Valuation models",
    ],
    doesNot: [
      "Real-time event monitoring",
      "Inheritance/probate signals",
      "Personal wealth indicators",
      "Insurance product correlation",
      "Entity-level enrichment",
      "Actionable prospect scoring",
    ],
    legalGaps: [
      "Highly restricted licensing",
      "Data cannot be repurposed for marketing",
    ],
  },
};

export const SOVEREIGN_ADVANTAGES = [
  {
    advantage: "Real-Time Event Monitoring",
    description:
      "We monitor county recorder offices daily for mortgage satisfactions, trust transfers, and other equity events. Competitors provide static snapshots.",
  },
  {
    advantage: "Multi-Source Entity Resolution",
    description:
      "We link individuals across property records, court filings, SEC data, and professional profiles. Competitors keep data in silos.",
  },
  {
    advantage: "Life Event Intelligence",
    description:
      "We detect inheritance, divorce, retirement, and career changes as they happen. Competitors don't track life events.",
  },
  {
    advantage: "Annuity Market Specialization",
    description:
      "We identify annuity holders and surrender period timing. No competitor focuses on insurance product correlation.",
  },
  {
    advantage: "100% Legal Public Records",
    description:
      "We only scrape publicly available data with clear legal basis. No FCRA-regulated data, no gray area sourcing.",
  },
  {
    advantage: "Affordable Access",
    description:
      "We make enterprise-quality intelligence accessible to independent advisors. No $10K/month minimums.",
  },
];

export const COMPARISON_TABLE = {
  headers: [
    "Capability",
    "Sovereign",
    "PropStream",
    "BatchLeads",
    "Enterprise (BK/CL)",
  ],
  rows: [
    ["Real-time recorder monitoring", "YES", "No", "No", "Partial"],
    ["Mortgage satisfaction alerts", "YES", "No", "No", "No"],
    ["Probate/inheritance signals", "YES", "No", "No", "No"],
    ["Annuity holder identification", "YES", "No", "No", "No"],
    ["Entity resolution engine", "YES", "No", "No", "Limited"],
    ["Professional profile enrichment", "YES", "No", "No", "No"],
    ["Life event detection", "YES", "No", "No", "No"],
    ["Wealth signal scoring", "YES", "Partial", "No", "Partial"],
    ["100% legal sourcing", "YES", "Unclear", "Unclear", "Yes (restricted)"],
    ["Affordable for independents", "YES", "Yes", "Yes", "No"],
  ],
};
