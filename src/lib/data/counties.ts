/**
 * Sovereign Data Engine - Target Counties
 * High-equity, tech-wealth markets with accessible public records
 */

import type { TargetCounty } from "../types";

export const TARGET_COUNTIES: TargetCounty[] = [
  {
    county: "King County",
    state: "WA",
    city: "Seattle / Bellevue",
    medianValue: "$850,000",
    medianEquity: "$425,000",
    equityPct: "50%",
    assessorUrl: "https://blue.kingcounty.com/Assessor/eRealProperty/",
    recorderUrl: "https://recordsearch.kingcounty.gov/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: true,
    satisfactionSearch: true,
    signals: [
      "Microsoft/Amazon RSU vesting",
      "Tech layoff waves",
      "IPO liquidity events",
      "ESPP accumulation",
    ],
    annuityDensity: "High - Boeing retirees + tech wealth",
    scrapeNotes:
      "Excellent bulk data access. Assessor API available. Recorder has full-text search. Satisfaction of mortgage docs indexed by parcel. Priority market.",
  },
  {
    county: "San Mateo County",
    state: "CA",
    city: "Silicon Valley",
    medianValue: "$1,800,000",
    medianEquity: "$1,100,000",
    equityPct: "61%",
    assessorUrl: "https://www.smcacre.org/",
    recorderUrl: "https://records.smcacre.org/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: true,
    satisfactionSearch: true,
    signals: [
      "VC/PE exits",
      "Startup acquisitions",
      "RSU liquidations",
      "IPO lockup expirations",
      "Founder secondaries",
    ],
    annuityDensity: "Very High - Oracle/Meta retirees + tech founders",
    scrapeNotes:
      "Premium data quality. Prop 13 basis reveals true purchase dates. Recorder has excellent API. High-value targets but competitive market. Worth the effort.",
  },
  {
    county: "Miami-Dade County",
    state: "FL",
    city: "Miami / Coral Gables",
    medianValue: "$550,000",
    medianEquity: "$275,000",
    equityPct: "50%",
    assessorUrl: "https://www.miamidade.gov/pa/",
    recorderUrl: "https://onlineservices.miami-dadeclerk.com/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: false,
    satisfactionSearch: true,
    signals: [
      "NY/NJ tax migration",
      "Crypto wealth",
      "LatAm capital flight",
      "Retiree influx",
      "Cash purchases",
    ],
    annuityDensity: "Very High - Retiree destination + wealth migration",
    scrapeNotes:
      "No state income tax = wealth magnet. Heavy cash purchases indicate liquid wealth. Foreign national ownership requires different approach. Strong annuity market.",
  },
  {
    county: "Maricopa County",
    state: "AZ",
    city: "Phoenix / Scottsdale",
    medianValue: "$450,000",
    medianEquity: "$200,000",
    equityPct: "44%",
    assessorUrl: "https://mcassessor.maricopa.gov/",
    recorderUrl: "https://recorder.maricopa.gov/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: false,
    satisfactionSearch: true,
    signals: [
      "California exodus",
      "Retiree migration",
      "Winter residents (snowbirds)",
      "Remote worker relocation",
    ],
    annuityDensity: "High - Major retiree destination",
    scrapeNotes:
      "Massive volume - 4M+ residents. Excellent data access. Lower values but high volume. Good for scale testing. Strong retiree/annuity signals.",
  },
  {
    county: "Clark County",
    state: "NV",
    city: "Las Vegas / Henderson",
    medianValue: "$425,000",
    medianEquity: "$175,000",
    equityPct: "41%",
    assessorUrl: "https://www.clarkcountynv.gov/assessor/",
    recorderUrl: "https://recorder.clarkcountynv.gov/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: false,
    satisfactionSearch: true,
    signals: [
      "California tax refugees",
      "Retiree influx",
      "Casino/entertainment industry",
      "Remote worker relocation",
    ],
    annuityDensity: "High - Retiree destination + no state tax",
    scrapeNotes:
      "No state income tax. Many California refugees with CA equity. Good data access. Gaming industry creates unique wealth patterns. Solid annuity market.",
  },
  {
    county: "Palm Beach County",
    state: "FL",
    city: "West Palm Beach / Boca Raton",
    medianValue: "$550,000",
    medianEquity: "$300,000",
    equityPct: "55%",
    assessorUrl: "https://www.pbcgov.org/papa/",
    recorderUrl: "https://oris.co.palm-beach.fl.us/",
    assessorOnline: true,
    recorderOnline: true,
    bulkDownload: true,
    techWealth: false,
    satisfactionSearch: true,
    signals: [
      "Northeast migration",
      "Hedge fund relocations",
      "Retiree wealth concentration",
      "Estate planning activity",
    ],
    annuityDensity: "Very High - Wealth management capital",
    scrapeNotes:
      "Extremely wealthy retiree population. High concentration of financial advisors = competitive but lucrative. No state income tax. Estate planning signals strong.",
  },
];

// Utility functions
export const getCountyByState = (state: string): TargetCounty[] =>
  TARGET_COUNTIES.filter((c) => c.state === state);

export const getTechWealthCounties = (): TargetCounty[] =>
  TARGET_COUNTIES.filter((c) => c.techWealth);

export const getHighAnnuityCounties = (): TargetCounty[] =>
  TARGET_COUNTIES.filter(
    (c) =>
      c.annuityDensity.toLowerCase().includes("very high") ||
      c.annuityDensity.toLowerCase().includes("high"),
  );

export const getCountyByName = (name: string): TargetCounty | undefined =>
  TARGET_COUNTIES.find((c) =>
    c.county.toLowerCase().includes(name.toLowerCase()),
  );

export const getTotalEstimatedEquity = (): string => {
  const total = TARGET_COUNTIES.reduce((sum, county) => {
    const equity = parseInt(county.medianEquity.replace(/[$,]/g, ""));
    return sum + equity;
  }, 0);
  return `$${(total / 1000000).toFixed(1)}M median combined equity`;
};
