/**
 * Sovereign Data Engine - Signal Definitions
 * High-value prospect identification signals across 5 categories
 */

import type { SignalsData } from "../types";
import { C } from "../colors";

export const SIGNALS: SignalsData = {
  equity: {
    name: "Equity Signals",
    icon: "chart",
    color: C.gold,
    signals: [
      {
        name: "Free & Clear Properties",
        source: "County Recorder / Assessor",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "Very High",
        description:
          "Properties with no mortgage liens, indicating full ownership and accessible equity.",
        interpretation: [
          "Owner has significant liquid real estate equity",
          "Likely owned for 15+ years (mortgage paid off)",
          "Strong candidate for equity monetization conversations",
          "May indicate wealth accumulation phase completion",
        ],
        howToFind: [
          "County recorder deed search - no active DOT/mortgage",
          "Cross-reference with assessor rolls for ownership duration",
          "Title company bulk data partnerships",
        ],
      },
      {
        name: "Mortgage Satisfaction Recorded",
        source: "County Recorder",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "Very High",
        description:
          "Recent recording of mortgage satisfaction document indicates payoff event.",
        interpretation: [
          "Owner just freed significant monthly cash flow",
          "May be looking for new investment opportunities",
          "Prime timing for wealth management conversations",
          "Could indicate inheritance, sale of business, or retirement",
        ],
        howToFind:
          "Document type filter: 'SATISFACTION', 'RECONVEYANCE', 'RELEASE OF LIEN'",
        timeWindow: "30-90 days after recording is optimal outreach window",
      },
      {
        name: "Long-Term Ownership (20+ Years)",
        source: "County Assessor",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "High",
        description:
          "Properties held 20+ years have substantial built-up equity from appreciation.",
        interpretation: [
          "Significant unrealized capital gains",
          "Owner in or approaching retirement",
          "Estate planning considerations likely",
          "May have multiple properties",
        ],
        formula:
          "Equity = Current Value - Original Purchase Price (adjusted for improvements)",
      },
      {
        name: "High-Equity Ratio (>80%)",
        source: "County Records + Zillow AVM",
        cost: "Low ($0.02/record)",
        legality: "100% Legal - Public + Modeled Data",
        strength: "High",
        description:
          "Properties where owner equity exceeds 80% of current market value.",
        interpretation: [
          "Low debt, high asset base",
          "Conservative financial profile",
          "Likely wealth preservation mindset",
        ],
        formula: "Equity Ratio = (AVM - Outstanding Mortgage) / AVM",
      },
      {
        name: "Trust Ownership Transfer",
        source: "County Recorder",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "High",
        description:
          "Property transferred from individual to revocable living trust.",
        interpretation: [
          "Active estate planning underway",
          "Owner working with attorney/advisor",
          "Concerned about legacy and wealth transfer",
          "May have $1M+ in assets",
        ],
        howToFind:
          "Deed transfers TO: '*TRUST*', '*LIVING TRUST*', '*FAMILY TRUST*'",
      },
    ],
  },
  lifeEvents: {
    name: "Life Event Signals",
    icon: "calendar",
    color: C.cyan,
    signals: [
      {
        name: "Recent Inheritance",
        source: "Probate Court + Obituary Cross-Reference",
        cost: "Free-Low",
        legality: "100% Legal - Public Records",
        strength: "Very High",
        description:
          "Individuals who recently inherited property or assets from deceased family members.",
        interpretation: [
          "Sudden wealth event requiring decisions",
          "May be overwhelmed by financial complexity",
          "Often inherits annuities they don't understand",
          "Timeline: 3-12 months post-probate is optimal",
        ],
        howToFind: [
          "Probate court filings for Letters Testamentary",
          "Deed transfers from deceased to beneficiary",
          "Cross-reference obituaries with property records",
        ],
        scraperSpec: {
          method: "Obituary monitoring + property deed matching",
          logic:
            "Deceased name on obituary matches property owner name, then track deed transfer to heir",
        },
      },
      {
        name: "Recent Divorce Finalization",
        source: "Court Records",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "High",
        description:
          "Divorce decree finalized, often triggering asset division and liquidity needs.",
        interpretation: [
          "Major asset restructuring underway",
          "May need to liquidate retirement accounts",
          "Looking for fresh financial start",
          "Heightened emotional state - requires sensitivity",
        ],
        howToFind: "Court case type: 'DISSOLUTION', 'DIVORCE', status: 'FINAL'",
        timeWindow: "60-180 days post-finalization",
      },
      {
        name: "Pre-Retirement (Age 59-64)",
        source: "Voter Registration + LinkedIn",
        cost: "Low",
        legality: "100% Legal - Public + Professional Data",
        strength: "High",
        description:
          "Individuals in the pre-retirement window actively planning transition.",
        interpretation: [
          "Making decisions about retirement account distributions",
          "May have multiple 401ks from career moves",
          "Evaluating annuity rollovers",
          "Peak decision-making window",
        ],
        matchCriteria: [
          "Age 59-64 (voter DOB)",
          "20+ years at current company (LinkedIn)",
          "Executive or professional title",
        ],
      },
      {
        name: "Business Sale / Exit Event",
        source: "SEC Filings + Local Business Records",
        cost: "Free-Medium",
        legality: "100% Legal - Public Records",
        strength: "Very High",
        description:
          "Business owner who recently sold company or significant equity stake.",
        interpretation: [
          "Major liquidity event",
          "Needs wealth management strategy",
          "Tax planning urgent",
          "High-value prospect",
        ],
        howToFind: [
          "Secretary of State filings for business dissolution/sale",
          "SEC 13D filings for insider stock sales",
          "Local business journal announcements",
        ],
      },
      {
        name: "Job Title Change to Executive",
        source: "LinkedIn + Professional Databases",
        cost: "Medium",
        legality: "100% Legal - Professional Data",
        strength: "Medium-High",
        description:
          "Recent promotion to C-suite or VP level with likely compensation increase.",
        interpretation: [
          "Increased income and stock compensation",
          "New retirement plan decisions",
          "May be relocating",
          "Career peak considerations",
        ],
        scraperSpec: {
          method: "LinkedIn profile monitoring",
          trigger:
            "Title change contains: CEO, CFO, COO, VP, President, Director",
        },
      },
    ],
  },
  wealth: {
    name: "Wealth Indicators",
    icon: "diamond",
    color: C.purple,
    signals: [
      {
        name: "Luxury Vehicle Registration",
        source: "DMV Records (where accessible)",
        cost: "Medium-High",
        legality: "Varies by state - some restrict access",
        strength: "Medium",
        description:
          "Registration of vehicles valued $75K+ indicates discretionary wealth.",
        interpretation: [
          "Comfortable with luxury purchases",
          "Likely $500K+ liquid assets",
          "Image-conscious consumer",
          "May respond to prestige positioning",
        ],
        howToFind: "DMV data vendors, vehicle registration cross-reference",
        matchCriteria: [
          "Vehicle make: Porsche, Mercedes S/G class, BMW 7/8, Lexus LC, Tesla Model S/X",
          "Or any vehicle MSRP > $75,000",
        ],
      },
      {
        name: "Second Home Ownership",
        source: "County Assessor (multi-county)",
        cost: "Free (scraping)",
        legality: "100% Legal - Public Records",
        strength: "High",
        description:
          "Owner of multiple residential properties, one designated non-homestead.",
        interpretation: [
          "Significant real estate wealth",
          "Higher income to maintain multiple properties",
          "Estate planning complexity",
          "May have rental income",
        ],
        howToFind: "Match owner name across multiple county assessor databases",
      },
      {
        name: "Country Club / Private Club Membership",
        source: "Public directories + Event photos",
        cost: "Low-Medium",
        legality: "100% Legal - Public/Semi-Public Info",
        strength: "Medium-High",
        description: "Membership in exclusive clubs with high initiation fees.",
        interpretation: [
          "Discretionary income for membership ($25K-$250K initiation)",
          "Values networking and exclusivity",
          "Peer group is high-net-worth",
          "May respond to peer referrals",
        ],
        howToFind: [
          "Club tournament results (public)",
          "Social media check-ins",
          "Member directories (semi-public)",
        ],
      },
      {
        name: "Charitable Donations ($10K+)",
        source: "Nonprofit 990s + Donor Walls",
        cost: "Free",
        legality: "100% Legal - Public Records",
        strength: "High",
        description:
          "Named donor on nonprofit filings or recognition materials.",
        interpretation: [
          "Has discretionary wealth to give away",
          "Tax-conscious (itemizing deductions)",
          "Values specific causes",
          "May be interested in charitable giving strategies",
        ],
        howToFind: [
          "IRS 990 Schedule B (donors $5K+)",
          "Nonprofit annual reports",
          "Hospital/university donor walls",
        ],
      },
      {
        name: "Accredited Investor Status",
        source: "SEC Form D Filings",
        cost: "Free",
        legality: "100% Legal - Public Records",
        strength: "Very High",
        description:
          "Individual listed as accredited investor in private placement offerings.",
        interpretation: [
          "$1M+ net worth (excluding primary residence) OR",
          "$200K+ annual income ($300K joint)",
          "Sophisticated investor",
          "Understands complex financial products",
        ],
        howToFind: "SEC EDGAR Form D filings, cross-reference investor names",
      },
    ],
  },
  annuity: {
    name: "Annuity-Specific Signals",
    icon: "shield",
    color: C.orange,
    signals: [
      {
        name: "Annuity Surrender Period Ending",
        source: "State Insurance Filings + Modeling",
        cost: "Medium",
        legality: "100% Legal - Public + Modeled",
        strength: "Very High",
        description:
          "Annuities approaching end of surrender period (typically 7-10 years).",
        interpretation: [
          "Owner can now access funds penalty-free",
          "Re-evaluation window is now",
          "May be dissatisfied with current product",
          "Open to alternatives",
        ],
        timingWindows: [
          {
            purchaseYear: "2017",
            surrenderPeriod: "7 years",
            freeDate: "2024",
            status: "NOW",
            volume: "Peak volume",
          },
          {
            purchaseYear: "2018",
            surrenderPeriod: "7 years",
            freeDate: "2025",
            status: "Soon",
            volume: "High",
          },
          {
            purchaseYear: "2015-2016",
            surrenderPeriod: "10 years",
            freeDate: "2025-2026",
            status: "Soon",
            volume: "Very high",
          },
        ],
        qualificationLogic:
          "Target owners of annuities purchased 6-10 years ago",
      },
      {
        name: "Variable Annuity in Down Market",
        source: "Market conditions + Product modeling",
        cost: "Low",
        legality: "100% Legal",
        strength: "High",
        description:
          "Variable annuity holders who purchased before market correction.",
        interpretation: [
          "Portfolio value likely below high water mark",
          "May be paying high fees on depressed assets",
          "Worried about recovery timeline",
          "Open to guaranteed products",
        ],
        message: "Focus on living benefit guarantees vs. market exposure",
      },
      {
        name: "Age 70+ with Deferred Annuity",
        source: "Age data + Annuity owner modeling",
        cost: "Low-Medium",
        legality: "100% Legal",
        strength: "High",
        description:
          "Older annuity owners who may need to start taking distributions.",
        interpretation: [
          "RMD considerations apply",
          "May not understand distribution options",
          "Health changes may affect planning",
          "Legacy planning becomes priority",
        ],
        actionPlan:
          "Offer income optimization review focusing on tax efficiency and beneficiary structure",
      },
      {
        name: "Orphaned Annuity (Agent No Longer Active)",
        source: "Insurance license databases + CRM gaps",
        cost: "Low",
        legality: "100% Legal - Public + Business Records",
        strength: "Very High",
        description:
          "Annuity owner whose original selling agent is deceased, retired, or left the business.",
        interpretation: [
          "No relationship with current carrier",
          "Likely receiving no service or reviews",
          "May not know their options",
          "High receptivity to outreach",
        ],
        howToFind: [
          "Cross-reference agent license databases (NIPR) with carrier book of business",
          "Identify policies where writing agent license is inactive/lapsed",
        ],
      },
      {
        name: "1035 Exchange Search Intent",
        source: "Search + Content Engagement",
        cost: "Low-Medium",
        legality: "100% Legal - Intent Data",
        strength: "Very High",
        description:
          "Individuals actively searching for annuity exchange/rollover information.",
        interpretation: [
          "Already considering a change",
          "In active research mode",
          "Looking for guidance",
          "High-intent prospect",
        ],
        seoTargets: [
          "1035 exchange rules",
          "annuity surrender calculator",
          "should I exchange my annuity",
          "annuity fee comparison",
          "variable to fixed annuity switch",
        ],
        contentPieces: [
          "1035 Exchange Calculator Tool",
          "Annuity Comparison Guide",
          "Surrender Charge Analysis Tool",
        ],
      },
      {
        name: "Insurance License Holder (Non-Active)",
        source: "State Insurance Department",
        cost: "Free",
        legality: "100% Legal - Public Records",
        strength: "Medium-High",
        description:
          "Former insurance professionals who understand products but may have their own annuities.",
        interpretation: [
          "Understands insurance products",
          "May have purchased products from former employer",
          "Sophisticated buyer",
          "Values insider knowledge",
        ],
        keyLicenses: ["Life Insurance", "Annuity", "Variable Products"],
      },
      {
        name: "CDSC Expiration Timing Map",
        source: "Market Analysis + Product Modeling",
        cost: "Free",
        legality: "100% Legal - Pure Intelligence",
        strength: "Very High",
        description:
          "2016-2021 was massive annuity sales period. Those surrender periods are expiring NOW. Trillions of dollars newly free.",
        timingWindows: [
          {
            purchaseYear: "2016",
            surrenderPeriod: "10 years",
            freeDate: "2026",
            status: "NOW",
            volume: "High",
          },
          {
            purchaseYear: "2017",
            surrenderPeriod: "8 years",
            freeDate: "2025",
            status: "NOW",
            volume: "High",
          },
          {
            purchaseYear: "2018",
            surrenderPeriod: "7 years",
            freeDate: "2025",
            status: "NOW",
            volume: "Very High",
          },
          {
            purchaseYear: "2019",
            surrenderPeriod: "7 years",
            freeDate: "2026",
            status: "NOW",
            volume: "High",
          },
          {
            purchaseYear: "2020",
            surrenderPeriod: "5 years",
            freeDate: "2025",
            status: "NOW",
            volume: "Extreme",
          },
          {
            purchaseYear: "2021",
            surrenderPeriod: "5 years",
            freeDate: "2026",
            status: "NOW",
            volume: "Extreme",
          },
        ],
        message:
          "Your annuity protected you during uncertain times. The surrender period is over. Your capital is free. Should it stay earning 3-4%, or work at 12-20% in a private structure?",
      },
    ],
  },
  dark: {
    name: "Dark Data Signals",
    icon: "eye",
    color: C.red,
    signals: [
      {
        name: "Health Event Proximity",
        source: "Obituary monitoring for family members",
        cost: "Free",
        legality: "100% Legal - Public Info",
        strength: "Medium",
        description:
          "Recent death of spouse or close family member (not prospect themselves).",
        interpretation: [
          "Estate complexity if spouse deceased",
          "May have received life insurance payout",
          "Re-evaluating own planning",
          "Handle with extreme sensitivity",
        ],
        scraperSpec: {
          method: "Obituary name matching against property/voter records",
          filter:
            "Match deceased surname + address to living household members",
        },
      },
      {
        name: "Professional Advisor Change",
        source: "SEC/FINRA disclosures + LinkedIn",
        cost: "Low-Medium",
        legality: "100% Legal - Public + Professional Data",
        strength: "High",
        description:
          "Individual whose financial advisor recently changed firms, retired, or left industry.",
        interpretation: [
          "Relationship disrupted",
          "May not have followed advisor",
          "Open to new relationships",
          "Timing-sensitive",
        ],
        howToFind: [
          "BrokerCheck for advisor terminations",
          "Cross-reference with known client lists",
          "LinkedIn connection changes",
        ],
      },
      {
        name: "Social Media Wealth Signals",
        source: "Public social profiles",
        cost: "Low",
        legality: "100% Legal - Public Posts",
        strength: "Low-Medium",
        description:
          "Public posts indicating wealth events or financial discussions.",
        interpretation: [
          "Vacation homes, luxury travel",
          "Retirement announcements",
          "Business sale celebrations",
          "Inheritance mentions",
        ],
        howToFind:
          "Keyword monitoring on public profiles: 'just retired', 'sold my company', 'new vacation home'",
      },
      {
        name: "Political Donation Patterns",
        source: "FEC Database",
        cost: "Free",
        legality: "100% Legal - Public Records",
        strength: "Medium",
        description:
          "Significant political donors ($2,500+) disclosed in FEC filings.",
        interpretation: [
          "Discretionary income for political causes",
          "Engaged citizen with opinions",
          "May be responsive to policy discussions",
          "Handle partisanship carefully",
        ],
        howToFind: "FEC.gov individual contributor search",
      },
      {
        name: "Professional Association Leadership",
        source: "Association websites + Press releases",
        cost: "Free",
        legality: "100% Legal - Public Info",
        strength: "Medium-High",
        description:
          "Board members or officers of professional/industry associations.",
        interpretation: [
          "Established in their field",
          "Network influencers",
          "Likely senior career stage",
          "Referral potential",
        ],
        partnershipLogic: "Partner with associations for educational seminars",
        differentiation:
          "Position as specialist in their industry's unique needs",
      },
      {
        name: "Building Permits (Major Renovation)",
        source: "Municipal Building Departments",
        cost: "Free",
        legality: "100% Legal - Public Municipal Records",
        strength: "Medium",
        description:
          "Major renovation permits ($50K+) signal owner investment, property improvement, or estate preparation.",
        interpretation: [
          "$50K+ renovation indicates owner investing in asset",
          "ADU permit signals investor-minded owner",
          "Permit cluster in neighborhood indicates appreciation",
          "Demolition permit suggests redevelopment play",
        ],
        howToFind: [
          "Municipal building department online portals",
          "Permit type filter: Residential Remodel, ADU, Addition",
          "Value threshold: $50,000+",
        ],
      },
      {
        name: "UCC Filings / Business Liens",
        source: "Secretary of State",
        cost: "Free",
        legality: "100% Legal - Public Records",
        strength: "Medium-High",
        description:
          "Heavy UCC activity on business indicates leveraged owner. Match debtor name with property owner name for wealth correlation.",
        interpretation: [
          "Multiple UCC filings indicate business owner",
          "Equipment financing suggests active business operations",
          "Cross-reference with property records for portfolio sizing",
          "Lien releases indicate business success or exit",
        ],
        howToFind: [
          "Secretary of State UCC database search",
          "Match debtor name with county assessor owner records",
          "Filter by filing date for recent activity",
        ],
      },
    ],
  },
};

export function countSignals(): number {
  let total = 0;
  for (const category of Object.values(SIGNALS)) {
    total += category.signals.length;
  }
  return total;
}

export function countAnnuitySignals(): number {
  return SIGNALS.annuity.signals.length;
}
