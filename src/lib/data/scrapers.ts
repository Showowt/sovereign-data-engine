/**
 * Sovereign Data Engine - Scraper Fleet Specifications
 * 6 specialized scrapers for public records acquisition
 */

import type { ScraperFleet } from "../types";

export const SCRAPER_FLEET: ScraperFleet = {
  countyAssessor: {
    name: "County Assessor Scraper",
    tech: "Playwright + Puppeteer",
    targets: [
      {
        name: "King County, WA",
        method: "API + Web Scrape",
        frequency: "Weekly",
      },
      { name: "San Mateo County, CA", method: "API", frequency: "Weekly" },
      {
        name: "Miami-Dade County, FL",
        method: "Web Scrape",
        frequency: "Weekly",
      },
      {
        name: "Maricopa County, AZ",
        method: "Bulk Download",
        frequency: "Weekly",
      },
      { name: "Clark County, NV", method: "Web Scrape", frequency: "Weekly" },
      { name: "Palm Beach County, FL", method: "API", frequency: "Weekly" },
    ],
    frequency: "Weekly full refresh",
    fields: [
      "Parcel ID / APN",
      "Owner Name(s)",
      "Mailing Address",
      "Site Address",
      "Purchase Date",
      "Purchase Price",
      "Assessed Value",
      "Market Value (AVM)",
      "Property Type",
      "Legal Description",
      "Zoning",
      "Square Footage",
      "Year Built",
      "Homestead Exemption Status",
    ],
    storage: "Supabase PostgreSQL",
    volumeEstimate: "~2M records across 6 counties",
  },
  countyRecorder: {
    name: "County Recorder Scraper",
    tech: "Playwright + Custom PDF Parser",
    targets: [
      {
        name: "King County, WA",
        method: "Web Scrape + OCR",
        frequency: "Daily",
      },
      { name: "San Mateo County, CA", method: "API", frequency: "Daily" },
      {
        name: "Miami-Dade County, FL",
        method: "Web Scrape",
        frequency: "Daily",
      },
      {
        name: "Maricopa County, AZ",
        method: "Web Scrape + OCR",
        frequency: "Daily",
      },
      { name: "Clark County, NV", method: "Web Scrape", frequency: "Daily" },
      { name: "Palm Beach County, FL", method: "API", frequency: "Daily" },
    ],
    frequency: "Daily incremental updates",
    documentTypes: [
      "Deed of Trust / Mortgage",
      "Satisfaction of Mortgage",
      "Reconveyance",
      "Grant Deed",
      "Quitclaim Deed",
      "Trust Transfer Deed",
      "Lis Pendens",
      "Notice of Default",
      "Substitution of Trustee",
      "Assignment of Deed of Trust",
    ],
    fields: [
      "Document Number",
      "Recording Date",
      "Document Type",
      "Grantor Name(s)",
      "Grantee Name(s)",
      "APN / Parcel Reference",
      "Lender Name",
      "Loan Amount",
      "Document Text (OCR)",
    ],
    storage: "Supabase PostgreSQL + S3 (PDFs)",
    volumeEstimate: "~50K new documents/week across 6 counties",
    keyLogic:
      "Monitor for SATISFACTION/RECONVEYANCE documents to identify free-and-clear transitions",
  },
  courtRecords: {
    name: "Court Records Scraper",
    tech: "Playwright + Case Management API Integration",
    targets: [
      {
        name: "King County Superior Court",
        method: "Web Scrape",
        frequency: "Daily",
      },
      {
        name: "San Mateo County Superior Court",
        method: "Web Scrape",
        frequency: "Daily",
      },
      { name: "Miami-Dade Circuit Court", method: "API", frequency: "Daily" },
      {
        name: "Maricopa County Superior Court",
        method: "Web Scrape",
        frequency: "Daily",
      },
      {
        name: "Clark County District Court",
        method: "Web Scrape",
        frequency: "Daily",
      },
      {
        name: "Palm Beach County Circuit Court",
        method: "API",
        frequency: "Daily",
      },
    ],
    frequency: "Daily case status updates",
    fields: [
      "Case Number",
      "Case Type",
      "Filing Date",
      "Party Names",
      "Case Status",
      "Hearing Dates",
      "Disposition",
      "Attorney Names",
    ],
    filter: "Case types: PROBATE, DIVORCE/DISSOLUTION, CIVIL (Asset-related)",
    storage: "Supabase PostgreSQL",
    volumeEstimate: "~5K relevant cases/week across 6 counties",
  },
  obituaryMonitor: {
    name: "Obituary Monitor",
    tech: "Web Scraping + NLP Name Matching",
    sources: [
      { name: "Legacy.com", method: "Web Scrape", frequency: "Daily" },
      {
        name: "Local newspaper obits",
        method: "Web Scrape",
        frequency: "Daily",
      },
      {
        name: "Funeral home websites",
        method: "Web Scrape",
        frequency: "Daily",
      },
    ],
    targets: ["Legacy.com", "Local newspaper obits", "Funeral home websites"],
    frequency: "Daily monitoring",
    fields: [
      "Deceased Name",
      "Date of Death",
      "Age at Death",
      "City/State",
      "Surviving Family Members",
      "Memorial Service Details",
    ],
    enrichment:
      "Cross-reference deceased names against property records to identify heir prospects",
    storage: "Supabase PostgreSQL",
    volumeEstimate: "~500 relevant obituaries/week across target markets",
  },
  secEdgar: {
    name: "SEC EDGAR Scraper",
    tech: "REST API + XML Parser",
    targets: [
      "Form D filings",
      "Form 4 insider transactions",
      "13D/G beneficial ownership",
    ],
    frequency: "Daily",
    fields: [
      "Filer Name",
      "Filing Type",
      "Filing Date",
      "Company Name",
      "Amount Raised/Sold",
      "Investor Names (Form D)",
      "Insider Names (Form 4)",
      "Transaction Details",
    ],
    filter: "Focus on filings from target counties and high-value transactions",
    storage: "Supabase PostgreSQL",
    volumeEstimate: "~200 relevant filings/day",
  },
  linkedInEnrichment: {
    name: "LinkedIn Enrichment",
    tech: "LinkedIn Sales Navigator API + Phantombuster",
    targets: [
      "Executive profile matching",
      "Career change detection",
      "Company leadership roles",
    ],
    frequency: "On-demand + Weekly batch",
    fields: [
      "Full Name",
      "Current Title",
      "Company",
      "Location",
      "Career History",
      "Education",
      "Connections Count",
      "Profile URL",
    ],
    storage: "Supabase PostgreSQL",
    volumeEstimate: "~5K profile enrichments/month",
  },
};

export function getScraperList(): string[] {
  return Object.keys(SCRAPER_FLEET);
}

export function countScraperTargets(): number {
  let total = 0;
  for (const scraper of Object.values(SCRAPER_FLEET)) {
    if (Array.isArray(scraper.targets)) {
      total += scraper.targets.length;
    }
    if (scraper.sources && Array.isArray(scraper.sources)) {
      total += scraper.sources.length;
    }
  }
  return total;
}
