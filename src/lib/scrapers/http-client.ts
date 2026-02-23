/**
 * Sovereign Data Engine - HTTP Client
 * Handles web requests with rate limiting and proper headers
 */

export interface HttpClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  rateLimit?: {
    requestsPerMinute: number;
    delayMs: number;
  };
  timeout?: number;
}

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

/**
 * Make HTTP GET request with rate limiting
 */
export async function httpGet<T = unknown>(
  url: string,
  config?: HttpClientConfig,
): Promise<T> {
  const headers = {
    ...DEFAULT_HEADERS,
    ...config?.headers,
  };

  // Apply rate limit delay if configured
  if (config?.rateLimit?.delayMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, config.rateLimit!.delayMs),
    );
  }

  const controller = new AbortController();
  const timeout = config?.timeout || 30000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Make HTTP POST request
 */
export async function httpPost<T = unknown>(
  url: string,
  body: Record<string, unknown> | string,
  config?: HttpClientConfig,
): Promise<T> {
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...config?.headers,
  };

  // Set content type based on body type
  if (typeof body === "string") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else {
    headers["Content-Type"] = "application/json";
  }

  // Apply rate limit delay if configured
  if (config?.rateLimit?.delayMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, config.rateLimit!.delayMs),
    );
  }

  const controller = new AbortController();
  const timeout = config?.timeout || 30000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * ArcGIS REST API Query Helper
 * Most counties use ArcGIS for their GIS data
 */
export interface ArcGISQueryParams {
  where?: string;
  outFields?: string;
  returnGeometry?: boolean;
  f?: "json" | "geojson" | "html";
  resultRecordCount?: number;
  resultOffset?: number;
  orderByFields?: string;
}

export interface ArcGISFeature {
  attributes: Record<string, unknown>;
  geometry?: {
    x: number;
    y: number;
  };
}

export interface ArcGISResponse {
  features: ArcGISFeature[];
  exceededTransferLimit?: boolean;
  fields?: Array<{ name: string; type: string }>;
}

/**
 * Query ArcGIS Feature Service
 */
export async function queryArcGIS(
  serviceUrl: string,
  params: ArcGISQueryParams,
  config?: HttpClientConfig,
): Promise<ArcGISResponse> {
  const queryParams = new URLSearchParams({
    where: params.where || "1=1",
    outFields: params.outFields || "*",
    returnGeometry: String(params.returnGeometry ?? false),
    f: params.f || "json",
    resultRecordCount: String(params.resultRecordCount || 100),
    resultOffset: String(params.resultOffset || 0),
    orderByFields: params.orderByFields || "",
  });

  const url = `${serviceUrl}/query?${queryParams.toString()}`;

  return httpGet<ArcGISResponse>(url, config);
}
