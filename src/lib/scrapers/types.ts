/**
 * Sovereign Data Engine - Scraper Type Definitions
 */

export type ScraperStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed"
  | "rate_limited";

export type DocumentType =
  | "deed"
  | "mortgage"
  | "satisfaction"
  | "lis_pendens"
  | "probate"
  | "divorce"
  | "lien"
  | "release"
  | "assignment"
  | "notice_of_default";

export interface ScrapedProperty {
  parcelId: string;
  county: string;
  state: string;
  ownerName: string;
  ownerMailingAddress?: string;
  propertyAddress: string;
  propertyCity: string;
  propertyZip: string;
  assessedValue: number;
  marketValue?: number;
  landValue?: number;
  improvementValue?: number;
  yearBuilt?: number;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType: string;
  legalDescription?: string;
  taxAmount?: number;
  homesteadExemption?: boolean;
  lastSaleDate?: string;
  lastSalePrice?: number;
  scrapedAt: string;
}

export interface ScrapedDocument {
  documentId: string;
  county: string;
  state: string;
  documentType: DocumentType;
  recordingDate: string;
  bookPage?: string;
  instrumentNumber?: string;
  grantorName: string;
  granteeName?: string;
  propertyAddress?: string;
  parcelId?: string;
  documentAmount?: number;
  lenderName?: string;
  originalLoanDate?: string;
  satisfactionDate?: string;
  caseNumber?: string;
  scrapedAt: string;
}

export interface ScrapedCourtCase {
  caseNumber: string;
  county: string;
  state: string;
  caseType: "probate" | "divorce" | "foreclosure" | "civil";
  filingDate: string;
  partyNames: string[];
  status: string;
  nextHearingDate?: string;
  dispositionDate?: string;
  relatedProperties?: string[];
  scrapedAt: string;
}

export interface SkipTraceResult {
  inputName: string;
  inputAddress: string;
  phones: Array<{
    number: string;
    type: "mobile" | "landline" | "voip";
    score: number;
  }>;
  emails: Array<{
    address: string;
    score: number;
  }>;
  age?: number;
  relatives?: string[];
  previousAddresses?: string[];
  confidence: number;
  provider: string;
  scrapedAt: string;
}

export interface ScraperJobConfig {
  scraperId: string;
  county: string;
  state: string;
  scraperType: "assessor" | "recorder" | "court" | "skip_trace";
  options?: {
    startDate?: string;
    endDate?: string;
    documentTypes?: DocumentType[];
    maxRecords?: number;
    offset?: number;
  };
}

export interface ScraperJobResult {
  jobId: string;
  scraperId: string;
  status: ScraperStatus;
  startedAt: string;
  completedAt?: string;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  errors: Array<{
    message: string;
    context?: Record<string, unknown>;
    timestamp: string;
  }>;
}

export interface CountyScraperConfig {
  county: string;
  state: string;
  assessorUrl: string;
  recorderUrl?: string;
  courtUrl?: string;
  accessMethod: "api" | "scrape" | "bulk_download";
  rateLimit: {
    requestsPerMinute: number;
    delayMs: number;
  };
  selectors?: Record<string, string>;
  apiKey?: string;
}

// County-specific configurations
export const COUNTY_CONFIGS: Record<string, CountyScraperConfig> = {
  palm_beach_fl: {
    county: "Palm Beach",
    state: "FL",
    assessorUrl: "https://www.pbcgov.org/papa/",
    recorderUrl: "https://officialrecords.mypalmbeachclerk.com/",
    courtUrl: "https://appsgp.mypalmbeachclerk.com/eCaseView/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 30,
      delayMs: 2000,
    },
  },
  san_mateo_ca: {
    county: "San Mateo",
    state: "CA",
    assessorUrl: "https://www.smcacre.org/",
    recorderUrl: "https://www.smcacre.org/recorder",
    courtUrl: "https://www.sanmateocourt.org/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 20,
      delayMs: 3000,
    },
  },
  miami_dade_fl: {
    county: "Miami-Dade",
    state: "FL",
    assessorUrl: "https://www.miamidade.gov/pa/",
    recorderUrl: "https://www2.miami-dadeclerk.com/officialrecords/",
    courtUrl: "https://www2.miami-dadeclerk.com/ocs/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 30,
      delayMs: 2000,
    },
  },
  maricopa_az: {
    county: "Maricopa",
    state: "AZ",
    assessorUrl: "https://mcassessor.maricopa.gov/",
    recorderUrl: "https://recorder.maricopa.gov/",
    courtUrl: "https://www.superiorcourt.maricopa.gov/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 25,
      delayMs: 2400,
    },
  },
  clark_nv: {
    county: "Clark",
    state: "NV",
    assessorUrl: "https://www.clarkcountynv.gov/assessor/",
    recorderUrl: "https://www.clarkcountynv.gov/recorder/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 20,
      delayMs: 3000,
    },
  },
  king_wa: {
    county: "King",
    state: "WA",
    assessorUrl: "https://blue.kingcounty.com/Assessor/eRealProperty/",
    recorderUrl: "https://recordsearch.kingcounty.gov/",
    accessMethod: "scrape",
    rateLimit: {
      requestsPerMinute: 30,
      delayMs: 2000,
    },
  },
};
