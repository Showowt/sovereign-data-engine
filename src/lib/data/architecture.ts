/**
 * Sovereign Data Engine - Technical Architecture
 * Five-layer system design specification
 */

import type { Architecture } from "../types";

export const ARCHITECTURE: Architecture = {
  ingestion: {
    name: "Ingestion Layer",
    tech: "Playwright, Puppeteer, Custom Scrapers, REST APIs",
    components: [
      {
        name: "County Assessor Crawler",
        desc: "Scheduled weekly bulk downloads and incremental updates from 6 target counties. Handles pagination, rate limiting, and captcha solving where necessary.",
      },
      {
        name: "County Recorder Monitor",
        desc: "Daily document monitoring for mortgage satisfactions, deed transfers, trust recordings. PDF download and OCR extraction pipeline.",
      },
      {
        name: "Court Records Scraper",
        desc: "Daily monitoring of probate and family court case management systems. Party name extraction and case status tracking.",
      },
      {
        name: "SEC EDGAR Poller",
        desc: "Hourly polling of SEC RSS feeds for Form D, Form 4, and 13D/G filings. XML parsing and structured data extraction.",
      },
      {
        name: "Obituary Aggregator",
        desc: "Daily scraping of Legacy.com and local newspaper obituaries. NLP extraction of deceased name, survivors, and location.",
      },
      {
        name: "Professional License Scraper",
        desc: "Monthly scraping of state licensing board databases for doctors, lawyers, CPAs, engineers. Address and status extraction.",
      },
      {
        name: "LinkedIn Enrichment Pipeline",
        desc: "On-demand and weekly batch enrichment via Sales Navigator API and Phantombuster automation. Profile data extraction.",
      },
      {
        name: "Public Registry Scrapers",
        desc: "Monthly scraping of FAA, USCG, FCC, USPTO databases for wealth indicator cross-referencing.",
      },
    ],
  },

  storage: {
    name: "Storage Layer",
    tech: "Supabase PostgreSQL, S3/R2 Object Storage, Redis Cache",
    components: [
      {
        name: "Property Records Table",
        desc: "Core table with ~2M property records across 6 counties. Indexed on APN, owner name, address. Partitioned by county.",
      },
      {
        name: "Document Records Table",
        desc: "All recorded documents with metadata. PDF files stored in S3/R2 with presigned URL access. ~50K new records/week.",
      },
      {
        name: "Court Cases Table",
        desc: "Probate and family court cases with party linkage. Status tracking and disposition capture. ~5K new cases/week.",
      },
      {
        name: "Entities Table",
        desc: "Unified person profiles from entity resolution. Canonical identity with linked source records. ~500K resolved entities.",
      },
      {
        name: "Signals Table",
        desc: "Detected signals attached to entities. Signal type, confidence, source, timestamp. Real-time signal stream.",
      },
      {
        name: "Enrichment Cache",
        desc: "Redis-backed cache for phone/email lookups, AVM values, professional profiles. TTL-based expiration.",
      },
      {
        name: "Document Storage (S3/R2)",
        desc: "PDF documents, scanned images, OCR text files. Organized by county/year/document_type hierarchy.",
      },
      {
        name: "Vector Embeddings Store",
        desc: "pgvector-powered embeddings for semantic search across documents and entity profiles. Supports similarity queries.",
      },
    ],
  },

  processing: {
    name: "Processing Layer",
    tech: "Node.js Workers, Bull Queue, Temporal Workflows",
    components: [
      {
        name: "Document OCR Pipeline",
        desc: "PDF to text extraction using Tesseract and Google Vision API. Structured field extraction for key document types.",
      },
      {
        name: "Entity Resolution Engine",
        desc: "Multi-pass matching algorithm with confidence scoring. Fuzzy name matching, address normalization, household inference.",
      },
      {
        name: "Signal Detection Engine",
        desc: "Rule-based and ML signal detection from incoming records. Mortgage satisfaction, trust transfer, probate, divorce detection.",
      },
      {
        name: "Equity Calculator",
        desc: "Real-time equity estimation combining assessor values, AVM data, and mortgage position modeling.",
      },
      {
        name: "Age Estimation Module",
        desc: "Multi-source age inference from voter DOB, professional license dates, property ownership duration, LinkedIn career length.",
      },
      {
        name: "Wealth Score Aggregator",
        desc: "Composite wealth scoring from property equity, professional title, vehicle/aircraft/vessel ownership, donation history.",
      },
      {
        name: "Deduplication Worker",
        desc: "Background job to identify and merge duplicate records. Maintains audit trail of merged entities.",
      },
      {
        name: "Data Quality Monitor",
        desc: "Automated quality checks for missing fields, stale data, OCR accuracy. Alerts on data pipeline issues.",
      },
    ],
  },

  intelligence: {
    name: "Intelligence Layer",
    tech: "Claude AI (Anthropic), Custom ML Models, RAG Pipeline",
    components: [
      {
        name: "Prospect Scoring Model",
        desc: "ML model combining equity signals, life events, wealth indicators, and timing factors into unified prospect score (0-100).",
      },
      {
        name: "Annuity Propensity Model",
        desc: "Specialized model for identifying annuity holder likelihood based on age, profession, wealth signals, and behavioral patterns.",
      },
      {
        name: "Timing Optimizer",
        desc: "Predicts optimal outreach timing based on life event recency, surrender period calculations, and response rate modeling.",
      },
      {
        name: "Narrative Generator (Claude)",
        desc: "AI-powered prospect summary generation. Converts structured signals into human-readable prospect intelligence briefings.",
      },
      {
        name: "Objection Predictor",
        desc: "Identifies likely objections based on prospect profile. Generates recommended talking points and responses.",
      },
      {
        name: "RAG Knowledge Base",
        desc: "Retrieval-augmented generation system for answering prospect questions using embedded knowledge of products, regulations, and strategies.",
      },
      {
        name: "Compliance Checker",
        desc: "Automated review of outreach content for regulatory compliance (insurance disclaimers, investment suitability, etc.).",
      },
      {
        name: "A/B Test Engine",
        desc: "Statistical testing framework for messaging variants, timing experiments, and channel optimization.",
      },
    ],
  },

  delivery: {
    name: "Delivery Layer",
    tech: "Next.js App, REST/GraphQL API, Webhooks, CRM Integrations",
    components: [
      {
        name: "Sovereign Dashboard",
        desc: "Next.js web application for prospect exploration, signal review, list building, and campaign management.",
      },
      {
        name: "REST API",
        desc: "Programmatic access to prospect data, signals, and scoring. Authentication via API keys with rate limiting.",
      },
      {
        name: "GraphQL API",
        desc: "Flexible query interface for complex prospect searches and entity relationship exploration.",
      },
      {
        name: "Webhook System",
        desc: "Real-time event delivery for new signals, high-priority prospects, and data updates. Push to external systems.",
      },
      {
        name: "CRM Integrations",
        desc: "Native sync with Salesforce, HubSpot, Wealthbox, Redtail. Bi-directional contact and activity sync.",
      },
      {
        name: "Export Engine",
        desc: "CSV, Excel, and JSON export for prospect lists. Custom field mapping and filter presets.",
      },
      {
        name: "Email Campaign Integration",
        desc: "Integration with SendGrid, Mailchimp, ActiveCampaign for drip campaigns. Merge field population from prospect data.",
      },
      {
        name: "Mobile App (PWA)",
        desc: "Progressive web app for field access to prospect data. Offline capability for property visits.",
      },
    ],
  },
};

// Architecture statistics
export const ARCHITECTURE_STATS = {
  totalComponents: Object.values(ARCHITECTURE).reduce(
    (total, section) => total + section.components.length,
    0,
  ),
  layers: Object.keys(ARCHITECTURE).length,
  primaryTech: [
    "Playwright/Puppeteer",
    "Supabase PostgreSQL",
    "Node.js Workers",
    "Claude AI",
    "Next.js",
  ],
  estimatedBuildTime: "16-20 weeks for full production deployment",
  monthlyInfrastructureCost: "$2,000 - $5,000 depending on scale",
};

// Get components by layer
export const getComponentsByLayer = (layer: keyof Architecture) =>
  ARCHITECTURE[layer].components;

// Get all technologies used
export const getAllTechnologies = (): string[] => {
  const techSet = new Set<string>();
  Object.values(ARCHITECTURE).forEach((section) => {
    section.tech.split(", ").forEach((tech: string) => techSet.add(tech));
  });
  return Array.from(techSet);
};

// Get component count per layer
export const getComponentCounts = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  Object.entries(ARCHITECTURE).forEach(([key, section]) => {
    counts[key] = section.components.length;
  });
  return counts;
};
