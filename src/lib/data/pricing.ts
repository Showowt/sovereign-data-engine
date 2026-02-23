/**
 * Sovereign Data Engine - Pricing Structure
 * Tiered SaaS pricing for data intelligence platform
 */

import type { Pricing } from "../types";

export const PRICING: Pricing = {
  starter: {
    name: "Starter",
    price: "$299/month",
    records: "5,000 prospect records/month",
    skipTrace: "500 skip traces included",
    users: 1,
    features: [
      "Single county access",
      "Basic equity signals",
      "Mortgage satisfaction alerts",
      "Weekly data refresh",
      "CSV export",
      "Email support",
      "Basic prospect scoring",
      "Property detail views",
    ],
  },

  professional: {
    name: "Professional",
    price: "$799/month",
    records: "25,000 prospect records/month",
    skipTrace: "2,500 skip traces included",
    users: 3,
    features: [
      "3 county access",
      "Full equity signals suite",
      "Life event detection (probate, divorce)",
      "Wealth indicator signals",
      "Daily data refresh",
      "Advanced prospect scoring",
      "Entity resolution profiles",
      "CRM integration (Salesforce, HubSpot)",
      "API access (limited)",
      "Priority email support",
      "Custom list building",
      "Saved searches",
    ],
  },

  enterprise: {
    name: "Enterprise",
    price: "$1,999/month",
    records: "100,000 prospect records/month",
    skipTrace: "10,000 skip traces included",
    users: 10,
    features: [
      "All 6 target counties",
      "Full signal library (including dark intel)",
      "Annuity-specific signals",
      "Real-time document monitoring",
      "Advanced entity resolution",
      "AI prospect narratives (Claude)",
      "Timing optimization engine",
      "Full API access",
      "Webhook integrations",
      "White-label export options",
      "Dedicated account manager",
      "Phone support",
      "Custom signal development",
      "Monthly strategy calls",
      "Early access to new features",
    ],
  },

  custom: {
    name: "Custom / White Label",
    price: "Contact Sales",
    records: "Unlimited",
    skipTrace: "Custom volume",
    users: "Unlimited",
    features: [
      "Multi-state expansion",
      "Custom county additions",
      "Dedicated infrastructure",
      "SLA guarantees (99.9% uptime)",
      "Custom ML model training",
      "White-label dashboard",
      "Embedded analytics",
      "Custom integrations",
      "On-premise deployment option",
      "Compliance documentation",
      "Security audit support",
      "Priority feature development",
      "Quarterly business reviews",
      "Training and onboarding",
    ],
  },
};

// Add-ons available for all tiers
export const ADD_ONS = [
  {
    name: "Additional Skip Traces",
    price: "$0.15/record",
    description: "Phone and email append for contact enrichment",
  },
  {
    name: "Additional Counties",
    price: "$199/county/month",
    description: "Expand coverage beyond plan limit",
  },
  {
    name: "Additional Users",
    price: "$49/user/month",
    description: "Add team members to your account",
  },
  {
    name: "Premium LinkedIn Enrichment",
    price: "$0.25/profile",
    description: "Full professional profile data append",
  },
  {
    name: "Real-Time Webhooks",
    price: "$99/month",
    description: "Push notifications for new signals (Professional tier)",
  },
  {
    name: "Custom Integrations",
    price: "$499 setup + $99/month",
    description: "Integration with your specific CRM or tools",
  },
  {
    name: "Dedicated Data Analyst",
    price: "$1,500/month",
    description: "Monthly custom analysis and report generation",
  },
];

// Volume discounts
export const VOLUME_DISCOUNTS = [
  { commitment: "Annual (pay upfront)", discount: "15% off" },
  { commitment: "2-year agreement", discount: "20% off" },
  { commitment: "3+ year agreement", discount: "25% off + price lock" },
];

// ROI calculator inputs
export const ROI_ASSUMPTIONS = {
  averageDealSize: "$500,000 AUM or $15,000 annuity premium",
  conversionRate: "2-5% of qualified prospects",
  costPerTraditionalLead: "$50-150",
  sovereignCostPerLead: "$0.80-2.00",
  timeSavedPerProspect: "2-4 hours research",
  qualityImprovement: "3-5x higher conversion vs cold lists",
};

// Utility functions
export const getPricingTiers = () => Object.keys(PRICING);

export const getPricingByTier = (tier: keyof Pricing) => PRICING[tier];

export const calculateAnnualPrice = (tier: keyof Pricing): string => {
  const tierData = PRICING[tier];
  if (tier === "custom") return "Contact Sales";

  const monthlyPrice = parseInt(tierData.price.replace(/[$,/month]/g, ""));
  const annualPrice = monthlyPrice * 12 * 0.85; // 15% discount
  return `$${annualPrice.toLocaleString()}/year (saves $${(monthlyPrice * 12 * 0.15).toFixed(0)})`;
};

export const getRecommendedTier = (
  prospectVolume: number,
  counties: number,
  needsAnnuity: boolean,
): keyof Pricing => {
  if (prospectVolume > 50000 || counties > 3 || needsAnnuity) {
    return "enterprise";
  } else if (prospectVolume > 10000 || counties > 1) {
    return "professional";
  }
  return "starter";
};

export const formatFeatureComparison = () => {
  const allFeatures = new Set<string>();
  Object.values(PRICING).forEach((tier) => {
    tier.features.forEach((f: string) => allFeatures.add(f));
  });

  return Array.from(allFeatures).map((feature) => ({
    feature,
    starter: PRICING.starter.features.includes(feature),
    professional: PRICING.professional.features.includes(feature),
    enterprise: PRICING.enterprise.features.includes(feature),
    custom: PRICING.custom.features.includes(feature),
  }));
};
