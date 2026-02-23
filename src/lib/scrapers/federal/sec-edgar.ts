/**
 * SEC EDGAR Scraper - 100% Legal Public Data
 *
 * Data Available:
 * - Form 4: Insider trading (executives buying/selling stock)
 * - Form 13D: Large shareholder disclosures (5%+ ownership)
 * - Form 13F: Institutional investor holdings
 * - Company filings and executive compensation
 *
 * This data reveals:
 * - High net worth individuals (executives, large shareholders)
 * - Wealth events (stock sales, option exercises)
 * - Geographic data (addresses in filings)
 */

import { httpGet } from "../http-client";

const SEC_BASE_URL = "https://data.sec.gov";
const SEC_SEARCH_URL = "https://efts.sec.gov/LATEST/search-index";
const USER_AGENT = "SovereignDataEngine contact@example.com";

export interface SECInsider {
  cik: string;
  name: string;
  companyName: string;
  companyCik: string;
  formType: string;
  filingDate: string;
  transactionType?: string;
  sharesTraded?: number;
  pricePerShare?: number;
  totalValue?: number;
  state?: string;
  city?: string;
}

export interface SECCompany {
  cik: string;
  name: string;
  ticker?: string;
  stateOfIncorporation: string;
  fiscalYearEnd: string;
  recentFilings: Array<{
    form: string;
    filingDate: string;
    accessionNumber: string;
  }>;
}

/**
 * Get company info and recent filings
 */
export async function getCompanyFilings(
  cik: string,
): Promise<SECCompany | null> {
  try {
    const paddedCik = cik.padStart(10, "0");
    const url = `${SEC_BASE_URL}/submissions/CIK${paddedCik}.json`;

    const data = await httpGet<any>(url, {
      headers: { "User-Agent": USER_AGENT },
      rateLimit: { requestsPerMinute: 10, delayMs: 100 },
    });

    return {
      cik: data.cik,
      name: data.name,
      ticker: data.tickers?.[0],
      stateOfIncorporation: data.stateOfIncorporation,
      fiscalYearEnd: data.fiscalYearEnd,
      recentFilings: data.filings.recent.form
        .slice(0, 20)
        .map((form: string, i: number) => ({
          form,
          filingDate: data.filings.recent.filingDate[i],
          accessionNumber: data.filings.recent.accessionNumber[i],
        })),
    };
  } catch (error) {
    console.error(`[SEC] Error fetching company ${cik}:`, error);
    return null;
  }
}

/**
 * Search recent Form 4 filings (insider transactions)
 */
export async function searchForm4Filings(options?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<SECInsider[]> {
  const insiders: SECInsider[] = [];
  const limit = options?.limit || 100;

  try {
    // SEC Full-text search API
    const searchUrl = `${SEC_SEARCH_URL}?q=form:4&dateRange=custom&startdt=${options?.startDate || "2026-01-01"}&enddt=${options?.endDate || "2026-02-23"}&forms=4`;

    const data = await httpGet<any>(searchUrl, {
      headers: { "User-Agent": USER_AGENT },
      rateLimit: { requestsPerMinute: 10, delayMs: 100 },
    });

    if (data?.hits?.hits) {
      for (const hit of data.hits.hits.slice(0, limit)) {
        const source = hit._source;
        insiders.push({
          cik: source.ciks?.[0] || "",
          name: source.display_names?.[0] || "",
          companyName: source.company || "",
          companyCik: source.ciks?.[1] || "",
          formType: "4",
          filingDate: source.file_date,
          state: source.state_country,
        });
      }
    }
  } catch (error) {
    console.error("[SEC] Error searching Form 4:", error);
  }

  return insiders;
}

/**
 * Get list of major tech company CIKs for targeting
 */
export function getMajorTechCompanies(): Array<{ name: string; cik: string }> {
  return [
    { name: "Apple Inc", cik: "0000320193" },
    { name: "Microsoft Corp", cik: "0000789019" },
    { name: "Amazon.com Inc", cik: "0001018724" },
    { name: "Alphabet Inc (Google)", cik: "0001652044" },
    { name: "Meta Platforms (Facebook)", cik: "0001326801" },
    { name: "Tesla Inc", cik: "0001318605" },
    { name: "NVIDIA Corp", cik: "0001045810" },
    { name: "Oracle Corp", cik: "0001341439" },
    { name: "Salesforce Inc", cik: "0001108524" },
    { name: "Adobe Inc", cik: "0000796343" },
  ];
}

/**
 * Get executives from a company's filings
 */
export async function getCompanyExecutives(cik: string): Promise<string[]> {
  const company = await getCompanyFilings(cik);
  if (!company) return [];

  // Form 4 filings list insider names
  const form4Filings = company.recentFilings.filter((f) => f.form === "4");

  // Would need to parse the actual XML filings to get executive names
  // For now, return the company info
  return [company.name];
}
