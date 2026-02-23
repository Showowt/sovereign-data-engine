/**
 * Sovereign Data Engine - Entity Resolution System
 * Multi-layer identity matching across data sources
 */

import type { EntityResolution } from "../types";

export const ENTITY_RESOLUTION: EntityResolution = {
  description:
    "The Entity Resolution Engine consolidates records from multiple sources into unified person profiles. A single individual may appear in county assessor records, court filings, obituary mentions, SEC filings, and professional databases - all under slightly different name variations. Our system resolves these into a single canonical entity with confidence scoring.",

  example:
    '"ROBERT J SMITH", "Robert James Smith", "R.J. Smith", "Bob Smith" from 4 different sources all resolve to a single profile with entity_id: ENT-2847291.',

  matchingLayers: [
    {
      layer: "Exact Name + Address Match",
      confidence: "99%",
      method:
        "Full name string match + normalized address match across sources",
    },
    {
      layer: "Name + Partial Address",
      confidence: "95%",
      method:
        "Full name match with same ZIP code or street name, different unit/apt",
    },
    {
      layer: "Fuzzy Name + Exact Address",
      confidence: "92%",
      method:
        "Levenshtein distance < 3 on name, exact address match. Handles typos.",
    },
    {
      layer: "Name Variants + Phone/Email",
      confidence: "90%",
      method:
        "Known nickname mappings (Robert/Bob) + matching phone or email from enrichment",
    },
    {
      layer: "Household Graph",
      confidence: "85%",
      method:
        "Same address with matching surname suggests household membership. Family relationships inferred.",
    },
    {
      layer: "Professional Identity",
      confidence: "88%",
      method:
        "LinkedIn profile match via company + title + location combination",
    },
    {
      layer: "Public Records Chain",
      confidence: "94%",
      method:
        "Sequential deed transfers, court case parties, or probate beneficiaries linking identities",
    },
    {
      layer: "Manual Review Queue",
      confidence: "70-85%",
      method:
        "Ambiguous matches flagged for human review with confidence score and source links",
    },
  ],

  outputProfile: {
    entity_id: "Unique identifier (ENT-XXXXXXX)",
    canonical_name: "Best quality full name from sources",
    name_variants: "Array of all name variations found",
    primary_address: "Current mailing address (most recent source)",
    all_addresses: "Historical address array with date ranges",
    phone_numbers: "Array with source attribution",
    email_addresses: "Array with source attribution",
    age_estimate: "Calculated from voter DOB or other sources",
    properties_owned: "Array of parcel IDs linked to this entity",
    court_cases: "Array of case numbers (probate, divorce, civil)",
    sec_filings: "Array of SEC filing references",
    professional_profile: "LinkedIn/professional data object",
    wealth_signals: "Array of detected wealth indicators",
    life_events: "Array of detected life events with dates",
    annuity_signals: "Array of annuity-related indicators",
    confidence_score: "Overall entity confidence (0-100)",
    last_updated: "Timestamp of most recent data merge",
    source_count: "Number of distinct sources contributing to profile",
  },
};

export const ENTITY_EXAMPLES = [
  {
    scenario: "Mortgage Payoff Detection",
    flow: [
      "County recorder indexes new SATISFACTION OF MORTGAGE document",
      "Grantor name extracted: 'MICHAEL A. JOHNSON AND SARAH M. JOHNSON'",
      "Entity resolver matches to existing profile ENT-1847293 with 98% confidence",
      "Profile updated: properties_owned[0].mortgage_status = 'free_and_clear'",
      "Wealth signal triggered: 'MORTGAGE_SATISFIED' with property value $825,000",
      "Entity enters 'high_equity_prospect' cohort for outreach sequencing",
    ],
  },
  {
    scenario: "Inheritance Wealth Transfer",
    flow: [
      "Obituary monitor detects death notice for 'Richard P. Thompson, age 82'",
      "Entity resolver finds property owner match in King County: ENT-9283742",
      "Probate court scraper detects Letters Testamentary filed by 'Jennifer L. Thompson'",
      "New entity created or matched: ENT-8374621 (daughter)",
      "Household graph links father-daughter relationship",
      "Jennifer flagged with life_events: ['RECENT_INHERITANCE'] signal",
      "Inheritance prospect enters nurture sequence after respectful delay period",
    ],
  },
  {
    scenario: "Executive Career Transition",
    flow: [
      "LinkedIn enrichment detects title change: VP Finance → CFO",
      "Entity ENT-4829173 matched via name + company + location",
      "Profile updated: professional_profile.title = 'Chief Financial Officer'",
      "Wealth signal added: 'EXECUTIVE_PROMOTION'",
      "Cross-reference with county records shows 15-year homeownership",
      "Combined signals trigger: high_equity + executive_career → priority prospect",
    ],
  },
];
