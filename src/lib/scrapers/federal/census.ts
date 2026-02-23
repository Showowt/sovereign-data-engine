/**
 * US Census Bureau ACS Scraper - 100% Legal Public Data
 *
 * Data Available:
 * - Median household income by county/tract
 * - Median home values
 * - Age demographics
 * - Housing characteristics
 * - Wealth indicators
 *
 * This data enables:
 * - Targeting high-income zip codes
 * - Identifying retiree corridors (high median age + high income)
 * - Property value benchmarking
 */

import { httpGet } from "../http-client";

const CENSUS_BASE_URL = "https://api.census.gov/data";
const ACS_YEAR = "2021"; // Most recent complete ACS 5-year

export interface CountyDemographics {
  countyName: string;
  stateFips: string;
  countyFips: string;
  medianIncome: number;
  medianHomeValue: number;
  medianAge: number;
  totalPopulation?: number;
  homeownershipRate?: number;
}

export interface ZipCodeDemographics {
  zipCode: string;
  medianIncome: number;
  medianHomeValue: number;
  medianAge: number;
  totalHouseholds: number;
}

// State FIPS codes for target markets
export const STATE_FIPS = {
  FL: "12", // Florida
  CA: "06", // California
  AZ: "04", // Arizona
  NV: "32", // Nevada
  WA: "53", // Washington
};

// County FIPS codes for target markets
export const COUNTY_FIPS = {
  PALM_BEACH_FL: { state: "12", county: "099" },
  MIAMI_DADE_FL: { state: "12", county: "086" },
  SAN_MATEO_CA: { state: "06", county: "081" },
  MARICOPA_AZ: { state: "04", county: "013" },
  CLARK_NV: { state: "32", county: "003" },
  KING_WA: { state: "53", county: "033" },
};

/**
 * Get demographics for a specific county
 */
export async function getCountyDemographics(
  stateFips: string,
  countyFips: string,
): Promise<CountyDemographics | null> {
  try {
    // ACS variables:
    // B19013_001E = Median household income
    // B25077_001E = Median home value
    // B01002_001E = Median age
    // B01003_001E = Total population
    // B25003_002E = Owner-occupied housing units

    const url = `${CENSUS_BASE_URL}/${ACS_YEAR}/acs/acs5?get=NAME,B19013_001E,B25077_001E,B01002_001E,B01003_001E&for=county:${countyFips}&in=state:${stateFips}`;

    const data = await httpGet<string[][]>(url, {
      rateLimit: { requestsPerMinute: 50, delayMs: 200 },
    });

    if (data && data.length > 1) {
      const row = data[1];
      return {
        countyName: row[0],
        stateFips: row[5],
        countyFips: row[6],
        medianIncome: parseInt(row[1]) || 0,
        medianHomeValue: parseInt(row[2]) || 0,
        medianAge: parseFloat(row[3]) || 0,
        totalPopulation: parseInt(row[4]) || 0,
      };
    }

    return null;
  } catch (error) {
    console.error(
      `[Census] Error fetching county ${stateFips}-${countyFips}:`,
      error,
    );
    return null;
  }
}

/**
 * Get demographics for all target counties
 */
export async function getAllTargetCountyDemographics(): Promise<
  CountyDemographics[]
> {
  const results: CountyDemographics[] = [];

  for (const [name, fips] of Object.entries(COUNTY_FIPS)) {
    console.log(`[Census] Fetching ${name}...`);
    const data = await getCountyDemographics(fips.state, fips.county);
    if (data) {
      results.push(data);
    }
    // Rate limit
    await new Promise((r) => setTimeout(r, 200));
  }

  return results;
}

/**
 * Get high-income zip codes in a state
 * Returns zip codes with median income above threshold
 */
export async function getHighIncomeZipCodes(
  stateFips: string,
  minIncome: number = 100000,
): Promise<ZipCodeDemographics[]> {
  const zipCodes: ZipCodeDemographics[] = [];

  try {
    // Get all ZCTAs (ZIP Code Tabulation Areas) in state
    const url = `${CENSUS_BASE_URL}/${ACS_YEAR}/acs/acs5?get=NAME,B19013_001E,B25077_001E,B01002_001E,B11001_001E&for=zip%20code%20tabulation%20area:*&in=state:${stateFips}`;

    const data = await httpGet<string[][]>(url, {
      rateLimit: { requestsPerMinute: 10, delayMs: 500 },
      timeout: 60000,
    });

    if (data && data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const income = parseInt(row[1]) || 0;

        if (income >= minIncome) {
          zipCodes.push({
            zipCode: row[5],
            medianIncome: income,
            medianHomeValue: parseInt(row[2]) || 0,
            medianAge: parseFloat(row[3]) || 0,
            totalHouseholds: parseInt(row[4]) || 0,
          });
        }
      }
    }

    // Sort by income descending
    zipCodes.sort((a, b) => b.medianIncome - a.medianIncome);
  } catch (error) {
    console.error(
      `[Census] Error fetching zip codes for state ${stateFips}:`,
      error,
    );
  }

  return zipCodes;
}

/**
 * Identify retiree corridors (high median age + high income)
 */
export async function getRetireeCorridors(
  stateFips: string,
  minAge: number = 50,
  minIncome: number = 75000,
): Promise<ZipCodeDemographics[]> {
  const allZips = await getHighIncomeZipCodes(stateFips, minIncome);

  return allZips.filter((z) => z.medianAge >= minAge);
}

/**
 * Get wealth concentration score for a zip code
 * Higher score = better target for financial services
 */
export function calculateWealthScore(
  demographics: ZipCodeDemographics,
): number {
  let score = 0;

  // Income component (0-40 points)
  if (demographics.medianIncome >= 200000) score += 40;
  else if (demographics.medianIncome >= 150000) score += 30;
  else if (demographics.medianIncome >= 100000) score += 20;
  else if (demographics.medianIncome >= 75000) score += 10;

  // Home value component (0-30 points)
  if (demographics.medianHomeValue >= 1000000) score += 30;
  else if (demographics.medianHomeValue >= 750000) score += 25;
  else if (demographics.medianHomeValue >= 500000) score += 20;
  else if (demographics.medianHomeValue >= 300000) score += 10;

  // Age component for annuity targeting (0-30 points)
  if (demographics.medianAge >= 60) score += 30;
  else if (demographics.medianAge >= 55) score += 25;
  else if (demographics.medianAge >= 50) score += 20;
  else if (demographics.medianAge >= 45) score += 10;

  return score;
}
