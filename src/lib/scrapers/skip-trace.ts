/**
 * Sovereign Data Engine - Skip Tracing Integration
 *
 * Providers:
 * - BatchSkipTracing API (~$0.15/record)
 * - PropStream API ($99/mo + per-record)
 * - TLO/Accurint (licensed investigators only)
 *
 * Returns: Phone numbers, emails, age, relatives, previous addresses
 */

import type { SkipTraceResult } from "./types";

export interface SkipTraceRequest {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  parcelId?: string;
}

export interface BatchSkipTraceConfig {
  apiKey: string;
  apiUrl: string;
  provider: "batchskiptracing" | "propstream" | "tlo";
}

// Default config - requires API key in env
const DEFAULT_CONFIG: BatchSkipTraceConfig = {
  apiKey: process.env.SKIP_TRACE_API_KEY || "",
  apiUrl:
    process.env.SKIP_TRACE_API_URL || "https://api.batchskiptracing.com/v1",
  provider: "batchskiptracing",
};

/**
 * Skip trace a single record
 */
export async function skipTraceRecord(
  request: SkipTraceRequest,
  config: BatchSkipTraceConfig = DEFAULT_CONFIG,
): Promise<SkipTraceResult> {
  const { firstName, lastName, address, city, state, zip } = request;

  try {
    if (!config.apiKey) {
      // Return mock data when no API key configured
      console.log(
        `[SkipTrace] No API key - returning mock data for ${firstName} ${lastName}`,
      );
      return generateMockSkipTraceResult(request);
    }

    // BatchSkipTracing API call
    const response = await fetch(`${config.apiUrl}/lookup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        address: address,
        city: city,
        state: state,
        zip: zip,
      }),
    });

    if (!response.ok) {
      throw new Error(`Skip trace API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      inputName: `${firstName} ${lastName}`,
      inputAddress: `${address}, ${city}, ${state} ${zip}`,
      phones:
        data.phones?.map(
          (p: { number: string; type: string; score: number }) => ({
            number: p.number,
            type: p.type as "mobile" | "landline" | "voip",
            score: p.score,
          }),
        ) || [],
      emails:
        data.emails?.map((e: { address: string; score: number }) => ({
          address: e.address,
          score: e.score,
        })) || [],
      age: data.age,
      relatives: data.relatives || [],
      previousAddresses: data.previous_addresses || [],
      confidence: data.confidence || 0,
      provider: config.provider,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[SkipTrace] Error for ${firstName} ${lastName}:`, error);
    // Return mock on error for development
    return generateMockSkipTraceResult(request);
  }
}

/**
 * Skip trace multiple records in batch
 */
export async function skipTraceBatch(
  requests: SkipTraceRequest[],
  config: BatchSkipTraceConfig = DEFAULT_CONFIG,
): Promise<SkipTraceResult[]> {
  const results: SkipTraceResult[] = [];

  // Process in batches of 50 to respect rate limits
  const batchSize = 50;
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((req) => skipTraceRecord(req, config)),
    );

    results.push(...batchResults);

    // Rate limit between batches
    if (i + batchSize < requests.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}

/**
 * Generate mock skip trace result for development
 */
function generateMockSkipTraceResult(
  request: SkipTraceRequest,
): SkipTraceResult {
  const { firstName, lastName, address, city, state, zip } = request;

  // Generate realistic-looking mock data
  const areaCode = getAreaCodeForState(state);
  const mockPhone = `${areaCode}${Math.floor(Math.random() * 9000000 + 1000000)}`;

  return {
    inputName: `${firstName} ${lastName}`,
    inputAddress: `${address}, ${city}, ${state} ${zip}`,
    phones: [
      {
        number: mockPhone,
        type: "mobile",
        score: 85 + Math.floor(Math.random() * 15),
      },
      {
        number: `${areaCode}${Math.floor(Math.random() * 9000000 + 1000000)}`,
        type: "landline",
        score: 70 + Math.floor(Math.random() * 20),
      },
    ],
    emails: [
      {
        address: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
        score: 75 + Math.floor(Math.random() * 20),
      },
    ],
    age: 55 + Math.floor(Math.random() * 25), // 55-80 range (target demographic)
    relatives: [`${firstName} ${lastName} Jr`, `Robert ${lastName}`],
    previousAddresses: [`123 Previous St, ${city}, ${state}`],
    confidence: 80 + Math.floor(Math.random() * 18),
    provider: "mock",
    scrapedAt: new Date().toISOString(),
  };
}

/**
 * Get area code for state (simplified)
 */
function getAreaCodeForState(state: string): string {
  const areaCodes: Record<string, string> = {
    FL: "561", // Palm Beach / Miami area
    CA: "650", // San Mateo area
    AZ: "480", // Maricopa (Scottsdale)
    NV: "702", // Clark (Las Vegas)
    WA: "425", // King (Bellevue)
  };
  return areaCodes[state] || "555";
}

/**
 * Parse owner name into first/last
 */
export function parseOwnerName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  // Handle common patterns:
  // "SMITH JOHN & MARY" -> { firstName: "JOHN", lastName: "SMITH" }
  // "SMITH JOHN" -> { firstName: "JOHN", lastName: "SMITH" }
  // "THE SMITH FAMILY TRUST" -> { firstName: "SMITH", lastName: "TRUST" }

  const cleaned = fullName.toUpperCase().trim();

  // Remove common suffixes
  const withoutSuffix = cleaned
    .replace(/\s+(TR|TRUST|LLC|INC|CORP|ESTATE|FAMILY).*$/i, "")
    .replace(/\s+&\s+.+$/, ""); // Remove "& SPOUSE"

  const parts = withoutSuffix.split(/\s+/);

  if (parts.length === 1) {
    return { firstName: "", lastName: parts[0] };
  }

  // Assume "LASTNAME FIRSTNAME" format (common in property records)
  return {
    firstName: parts[1] || "",
    lastName: parts[0] || "",
  };
}

/**
 * Parse address into components
 */
export function parseAddress(fullAddress: string): {
  address: string;
  city: string;
  state: string;
  zip: string;
} {
  // Parse "123 MAIN ST, MIAMI FL 33131"
  const match = fullAddress.match(
    /^(.+),\s*([A-Z\s]+)\s+([A-Z]{2})\s+(\d{5})(-\d{4})?$/i,
  );

  if (match) {
    return {
      address: match[1].trim(),
      city: match[2].trim(),
      state: match[3].toUpperCase(),
      zip: match[4],
    };
  }

  // Fallback - try to extract what we can
  const parts = fullAddress.split(",").map((p) => p.trim());
  return {
    address: parts[0] || fullAddress,
    city: parts[1]?.replace(/\s+[A-Z]{2}\s+\d{5}.*$/, "") || "",
    state: fullAddress.match(/\s([A-Z]{2})\s+\d{5}/)?.[1] || "",
    zip: fullAddress.match(/\d{5}(-\d{4})?/)?.[0] || "",
  };
}
