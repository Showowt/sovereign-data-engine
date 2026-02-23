/**
 * Sovereign Data Engine - Data Sources Taxonomy
 * Tiered data acquisition by cost and legality
 */

import type { DataSources } from "../types";

export const DATA_SOURCES: DataSources = {
  free: {
    name: "Free Public Records",
    cost: "Free (scraping infrastructure only)",
    legality: "100% Legal - Public Records",
    sources: [
      {
        name: "County Assessor Records",
        data: "Property ownership, values, purchase dates, legal descriptions",
        access: "Direct website scraping or bulk download",
        coverage: "All 6 target counties",
        refresh: "Weekly",
      },
      {
        name: "County Recorder Documents",
        data: "Deeds, mortgages, satisfactions, liens, trust transfers",
        access: "Document search + PDF download",
        coverage: "All 6 target counties",
        refresh: "Daily",
      },
      {
        name: "Court Records (Probate/Family)",
        data: "Case filings, parties, status, dispositions",
        access: "Online court portal scraping",
        coverage: "All 6 target counties",
        refresh: "Daily",
      },
      {
        name: "SEC EDGAR Filings",
        data: "Form D (accredited investors), Form 4 (insider trades), 13D/G",
        access: "REST API",
        coverage: "Nationwide",
        refresh: "Daily",
      },
      {
        name: "FEC Donor Records",
        data: "Political donations $200+",
        access: "FEC.gov bulk download",
        coverage: "Nationwide",
        refresh: "Quarterly",
      },
      {
        name: "IRS 990 Filings",
        data: "Nonprofit donors, foundation grants",
        access: "ProPublica API + IRS bulk download",
        coverage: "Nationwide",
        refresh: "Annual",
      },
      {
        name: "State Professional Licenses",
        data: "Doctors, lawyers, CPAs, engineers - names, addresses, status",
        access: "State board websites",
        coverage: "All 6 target states",
        refresh: "Monthly",
      },
      {
        name: "FAA Aircraft Registry",
        data: "Aircraft owners, addresses, aircraft details",
        access: "FAA bulk download",
        coverage: "Nationwide",
        refresh: "Monthly",
      },
      {
        name: "USCG Vessel Documentation",
        data: "Boat/yacht owners, vessel details",
        access: "USCG database",
        coverage: "Documented vessels nationwide",
        refresh: "Monthly",
      },
      {
        name: "FCC Amateur Radio Licenses",
        data: "Ham radio operators - names, addresses, call signs",
        access: "FCC ULS database",
        coverage: "Nationwide",
        refresh: "Monthly",
      },
      {
        name: "USPTO Patents & Trademarks",
        data: "Inventors, applicants, patent/TM details",
        access: "USPTO bulk data + API",
        coverage: "Nationwide",
        refresh: "Monthly",
      },
    ],
  },

  lowCost: {
    name: "Low-Cost Data Sources",
    cost: "$50 - $500/month",
    legality: "100% Legal - Public or Licensed Data",
    sources: [
      {
        name: "State Voter Files",
        data: "Name, DOB (exact age), address history, registration date, party",
        access: "State election office purchase or vendors (L2, TargetSmart)",
        coverage: "State-by-state pricing varies",
        refresh: "Monthly",
        signal: "Critical for age targeting (retirement window 59-70)",
      },
      {
        name: "Obituary Aggregators",
        data: "Death notices, survivor names, locations",
        access: "Legacy.com scraping, local newspaper RSS",
        coverage: "Target markets",
        refresh: "Daily",
        signal: "Inheritance detection, estate prospect identification",
      },
      {
        name: "Property Valuation APIs",
        data: "Automated Valuation Models (AVM), Zestimates",
        access: "Zillow API, ATTOM, Redfin data",
        coverage: "Nationwide residential",
        refresh: "On-demand",
        signal: "Equity calculations, LTV modeling",
      },
      {
        name: "Phone/Email Append Services",
        data: "Contact information for known individuals",
        access: "Skip trace vendors (Batch Skip, TLO)",
        coverage: "75-85% hit rate typical",
        refresh: "On-demand",
        signal: "Contact enrichment for outreach",
      },
    ],
  },

  premium: {
    name: "Premium Data Sources",
    cost: "$500 - $2,000/month",
    legality: "100% Legal - Commercial Licensed Data",
    sources: [
      {
        name: "LinkedIn Sales Navigator",
        data: "Professional profiles, career history, company affiliations",
        access: "Sales Navigator subscription + API/scraping tools",
        coverage: "Professional population",
        refresh: "Weekly batch + on-demand",
        signal:
          "Executive identification, career transitions, retirement detection",
      },
      {
        name: "ATTOM Property Data",
        data: "Comprehensive property characteristics, transactions, valuations",
        access: "API subscription",
        coverage: "Nationwide",
        refresh: "Daily",
        signal: "Deep property intel, mortgage positions",
      },
      {
        name: "Crunchbase / PitchBook Lite",
        data: "Startup funding, exits, founder data",
        access: "Subscription + API",
        coverage: "Tech/startup ecosystem",
        refresh: "Daily",
        signal: "Business exit detection, founder liquidity events",
      },
      {
        name: "Insurance License Databases",
        data: "Agent appointments, status changes, terminations",
        access: "NIPR + state department scraping",
        coverage: "Nationwide",
        refresh: "Monthly",
        signal: "Orphaned policy detection, agent change opportunities",
      },
    ],
  },

  enterprise: {
    name: "Enterprise Data Sources",
    cost: "$2,000+/month or per-record pricing",
    legality: "100% Legal - Enterprise Licensed Data",
    sources: [
      {
        name: "LexisNexis / Accurint",
        data: "Comprehensive personal data, assets, relationships",
        access: "Enterprise subscription with use case restrictions",
        coverage: "Nationwide",
        refresh: "Real-time",
        signal: "Note: FCRA-regulated - restricted use cases only",
      },
      {
        name: "TransUnion TLOxp",
        data: "Skip tracing, identity verification, asset search",
        access: "Enterprise subscription",
        coverage: "Nationwide",
        refresh: "Real-time",
        signal: "Note: FCRA-regulated - restricted use cases only",
      },
      {
        name: "First American DataTree",
        data: "Title data, liens, encumbrances, chain of title",
        access: "Enterprise API",
        coverage: "Nationwide",
        refresh: "Daily",
        signal: "Professional-grade title intel, deed research",
      },
      {
        name: "Black Knight / ICE Mortgage",
        data: "Mortgage performance, origination data, default tracking",
        access: "Enterprise subscription",
        coverage: "70%+ of US mortgage market",
        refresh: "Monthly",
        signal: "Note: Restricted licensing - lender use cases primarily",
      },
    ],
  },
};

// Utility functions
export const getSourcesByTier = (tier: keyof DataSources) =>
  DATA_SOURCES[tier].sources;

export const countAllSources = (): number => {
  return Object.values(DATA_SOURCES).reduce(
    (total, tier) => total + tier.sources.length,
    0,
  );
};

export const getFreeSources = () => DATA_SOURCES.free.sources;

export const getLowCostSources = () => DATA_SOURCES.lowCost.sources;

export const getTotalMonthlyCost = (): string => {
  return "Estimated $1,500 - $3,500/month for comprehensive coverage";
};

export const getDataSourceCategories = () => Object.keys(DATA_SOURCES);

export const getSourcesBySignal = (signalKeyword: string) => {
  const results: Array<{
    tier: string;
    source: (typeof DATA_SOURCES.free.sources)[0];
  }> = [];

  Object.entries(DATA_SOURCES).forEach(([tierKey, tier]) => {
    tier.sources.forEach((source: (typeof DATA_SOURCES.free.sources)[0]) => {
      if (source.signal?.toLowerCase().includes(signalKeyword.toLowerCase())) {
        results.push({ tier: tierKey, source });
      }
    });
  });

  return results;
};
