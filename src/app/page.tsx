"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { C, fonts } from "@/lib/colors";
import {
  SIGNALS,
  TARGET_COUNTIES,
  SCRAPER_FLEET,
  ENTITY_RESOLUTION,
  ENTITY_EXAMPLES,
  DEMO_LEADS,
  countSignals,
  countAnnuitySignals,
  countScraperTargets,
  getTotalPipelineEquity,
  getAverageScore,
  getUrgentLeads,
  getAnnuityTargets,
  formatCurrency,
} from "@/lib/data";
import { Collapse } from "@/components/ui/Collapse";
import { MetricBox } from "@/components/ui/MetricBox";
import { GlowBar } from "@/components/ui/GlowBar";
import { Tag } from "@/components/ui/Tag";
import { SignalCardSimple } from "@/components/cards/SignalCardSimple";
import { LeadCard } from "@/components/cards/LeadCard";
import type { ScraperTarget, ScraperFleetItem, Signal } from "@/lib/types";

type TabKey =
  | "command"
  | "leads"
  | "signals"
  | "counties"
  | "annuity"
  | "scrapers"
  | "entity";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "command", label: "Command Center", icon: "⚡" },
  { key: "leads", label: "Lead Pipeline", icon: "🎯" },
  { key: "signals", label: "Signal Taxonomy", icon: "📡" },
  { key: "counties", label: "Target Counties", icon: "🗺" },
  { key: "annuity", label: "Annuity Engine", icon: "💰" },
  { key: "scrapers", label: "Scraper Fleet", icon: "⚙" },
  { key: "entity", label: "Entity Resolution", icon: "🔗" },
];

// Annuity profile information
const ANNUITY_PROFILES = [
  {
    title: "The Surrender Window Prospect",
    description:
      "Annuity owners approaching the end of their surrender period (typically 7-10 years). These individuals can now access their funds penalty-free and are evaluating whether to stay or exchange.",
    signals: ["Surrender Period Ending", "Variable Annuity in Down Market"],
    color: C.gold,
  },
  {
    title: "The Orphaned Policyholder",
    description:
      "Annuity owners whose original selling agent has retired, passed away, or left the business. They receive no ongoing service and may not know their options.",
    signals: ["Orphaned Annuity", "Agent No Longer Active"],
    color: C.orange,
  },
  {
    title: "The Distribution Decision Maker",
    description:
      "Age 70+ annuity owners who need to make RMD decisions and may not understand their distribution options. Legacy planning becomes a priority.",
    signals: ["Age 70+ with Deferred Annuity", "RMD Considerations"],
    color: C.cyan,
  },
  {
    title: "The Active Researcher",
    description:
      "Individuals actively searching online for 1035 exchange information, annuity fee comparisons, or surrender calculators. High intent, looking for guidance.",
    signals: ["1035 Exchange Search Intent", "Content Engagement"],
    color: C.purple,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("command");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSignals = countSignals();
  const annuitySignals = countAnnuitySignals();
  const scraperTargets = countScraperTargets();
  const totalPipelineEquity = getTotalPipelineEquity();
  const averageScore = getAverageScore();
  const urgentLeads = getUrgentLeads();
  const annuityTargets = getAnnuityTargets(70);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: fonts.body,
          color: C.text,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "32px 24px 0",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.mono,
                letterSpacing: 2,
                color: C.gold,
                textTransform: "uppercase",
              }}
            >
              MachineMind
            </span>
            <span style={{ color: C.textDim }}>×</span>
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.mono,
                letterSpacing: 2,
                color: C.textMuted,
                textTransform: "uppercase",
              }}
            >
              Hernsted Partners
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 56px)",
              fontFamily: fonts.heading,
              fontWeight: 400,
              color: C.white,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            Sovereign Data Engine
            <span style={{ color: C.gold }}> v2.0</span>
          </h1>

          <p
            style={{
              margin: "16px 0 0",
              fontSize: 14,
              fontFamily: fonts.body,
              color: C.textMuted,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            {totalSignals} signals · {TARGET_COUNTIES.length} counties · 26+
            data sources · Entity resolution · Behavioral scoring · Timing
            predictions
          </p>

          <div style={{ marginTop: 24 }}>
            <GlowBar />
          </div>
        </header>

        {/* Tab Navigation */}
        <nav
          style={{
            padding: "16px 24px 0",
            maxWidth: 1400,
            margin: "0 auto",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              paddingBottom: 1,
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 14px",
                  background:
                    activeTab === tab.key ? `${C.gold}14` : "transparent",
                  border:
                    activeTab === tab.key
                      ? `1px solid ${C.gold}28`
                      : "1px solid transparent",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  fontSize: 10,
                  fontFamily: fonts.mono,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: activeTab === tab.key ? C.gold : C.textMuted,
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = C.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = C.textMuted;
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <main
          style={{
            padding: "32px 24px 64px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {/* COMMAND CENTER TAB */}
          {activeTab === "command" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Top Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                <MetricBox
                  label="Properties Indexed"
                  value="5.4M+"
                  color={C.cyan}
                />
                <MetricBox label="Free & Clear" value="1.5M+" color={C.green} />
                <MetricBox
                  label="Pipeline Value"
                  value={formatCurrency(totalPipelineEquity)}
                  color={C.gold}
                />
                <MetricBox
                  label="Avg Lead Score"
                  value={averageScore}
                  color={C.orange}
                />
                <MetricBox
                  label="Signals Active"
                  value={totalSignals}
                  color={C.purple}
                />
              </div>

              {/* County Overview */}
              <div>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: 11,
                    fontFamily: fonts.mono,
                    color: C.textMuted,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Target County Overview
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 12,
                  }}
                >
                  {TARGET_COUNTIES.map((county, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 16,
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        transition: "border-color 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = `${C.gold}40`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = C.border)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.heading,
                              color: C.white,
                            }}
                          >
                            {county.county}, {county.state}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontFamily: fonts.body,
                              color: C.textMuted,
                            }}
                          >
                            {county.city}
                          </div>
                        </div>
                        <Tag
                          color={
                            county.annuityDensity.includes("EXTREME")
                              ? C.red
                              : county.annuityDensity.includes("HIGH")
                                ? C.orange
                                : C.textMuted
                          }
                        >
                          {county.annuityDensity}
                        </Tag>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 8,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 8,
                              fontFamily: fonts.mono,
                              color: C.textDim,
                              letterSpacing: 1,
                            }}
                          >
                            MED VALUE
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.heading,
                              color: C.text,
                            }}
                          >
                            {county.medianValue}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 8,
                              fontFamily: fonts.mono,
                              color: C.textDim,
                              letterSpacing: 1,
                            }}
                          >
                            EQUITY
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.heading,
                              color: C.gold,
                            }}
                          >
                            {county.medianEquity}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 8,
                              fontFamily: fonts.mono,
                              color: C.textDim,
                              letterSpacing: 1,
                            }}
                          >
                            EQ %
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.heading,
                              color: C.green,
                            }}
                          >
                            {county.equityPct}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginTop: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        {county.assessorOnline && (
                          <Tag color={C.green}>✓ Assessor</Tag>
                        )}
                        {county.recorderOnline && (
                          <Tag color={C.green}>✓ Recorder</Tag>
                        )}
                        {county.satisfactionSearch && (
                          <Tag color={C.green}>✓ Sat Search</Tag>
                        )}
                        {county.techWealth && (
                          <Tag color={C.purple}>Tech Wealth</Tag>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Priority Leads */}
              <div>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: 11,
                    fontFamily: fonts.mono,
                    color: C.textMuted,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Highest Priority Leads
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[...DEMO_LEADS]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
              </div>

              {/* Scraper Fleet Status */}
              <div>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: 11,
                    fontFamily: fonts.mono,
                    color: C.textMuted,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Scraper Fleet Status
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  {Object.entries(SCRAPER_FLEET).map(([key, scraper]) => {
                    const s = scraper as ScraperFleetItem;
                    return (
                      <div
                        key={key}
                        style={{
                          padding: 12,
                          background: C.card,
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: fonts.body,
                            color: C.text,
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          {s.name.split(" ").slice(0, 2).join(" ")}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: C.green,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: fonts.mono,
                              color: C.green,
                            }}
                          >
                            OPERATIONAL
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            marginTop: 4,
                          }}
                        >
                          {s.frequency}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LEAD PIPELINE TAB */}
          {activeTab === "leads" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                <MetricBox
                  label="Total Pipeline"
                  value={DEMO_LEADS.length}
                  color={C.gold}
                />
                <MetricBox
                  label="Pipeline Equity"
                  value={formatCurrency(totalPipelineEquity)}
                  color={C.green}
                />
                <MetricBox
                  label="Avg Score"
                  value={averageScore}
                  color={C.orange}
                />
                <MetricBox
                  label="Annuity Targets"
                  value={annuityTargets.length}
                  color={C.orange}
                />
                <MetricBox
                  label="Urgent"
                  value={urgentLeads.length}
                  color={C.red}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[...DEMO_LEADS]
                  .sort((a, b) => b.score - a.score)
                  .map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
              </div>
            </div>
          )}

          {/* SIGNALS TAB */}
          {activeTab === "signals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                <MetricBox
                  label="Total Signals"
                  value={totalSignals}
                  color={C.gold}
                />
                <MetricBox
                  label="Annuity Signals"
                  value={annuitySignals}
                  color={C.orange}
                />
                <MetricBox label="Data Sources" value="26+" color={C.purple} />
                <MetricBox label="Legal Status" value="100%" color={C.green} />
              </div>
              {Object.entries(SIGNALS).map(([key, category]) => (
                <Collapse
                  key={key}
                  title={category.name}
                  tag={`${category.signals.length} signals`}
                  tagColor={category.color}
                  defaultOpen={key === "equity"}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(350px, 1fr))",
                      gap: 16,
                      marginTop: 8,
                    }}
                  >
                    {category.signals.map((signal: Signal, idx: number) => (
                      <SignalCardSimple
                        key={idx}
                        signal={signal}
                        accentColor={category.color}
                      />
                    ))}
                  </div>
                </Collapse>
              ))}
            </div>
          )}

          {/* COUNTIES TAB */}
          {activeTab === "counties" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Six target counties selected for high equity concentrations,
                accessible public records, and favorable demographic profiles
                for wealth management.
              </p>
              {TARGET_COUNTIES.map((county, idx) => (
                <Collapse
                  key={idx}
                  title={`${county.county}, ${county.state}`}
                  tag={county.city}
                  tagColor={county.techWealth ? C.purple : C.gold}
                  defaultOpen={idx === 0}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 14px",
                          background: C.card,
                          borderRadius: 4,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: 9,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Median Value
                        </span>
                        <span
                          style={{
                            fontSize: 18,
                            fontFamily: fonts.heading,
                            color: C.gold,
                          }}
                        >
                          {county.medianValue}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: "12px 14px",
                          background: C.card,
                          borderRadius: 4,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: 9,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Median Equity
                        </span>
                        <span
                          style={{
                            fontSize: 18,
                            fontFamily: fonts.heading,
                            color: C.green,
                          }}
                        >
                          {county.medianEquity}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: "12px 14px",
                          background: C.card,
                          borderRadius: 4,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: 9,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Equity %
                        </span>
                        <span
                          style={{
                            fontSize: 18,
                            fontFamily: fonts.heading,
                            color: C.cyan,
                          }}
                        >
                          {county.equityPct}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {county.bulkDownload && (
                        <Tag color={C.green}>Bulk Download</Tag>
                      )}
                      {county.techWealth && (
                        <Tag color={C.purple}>Tech Wealth</Tag>
                      )}
                      {county.satisfactionSearch && (
                        <Tag color={C.gold}>Satisfaction Search</Tag>
                      )}
                    </div>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: C.card,
                        borderRadius: 4,
                        borderLeft: `3px solid ${C.orange}`,
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: 9,
                          fontFamily: fonts.mono,
                          color: C.orange,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Annuity Density
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontFamily: fonts.body,
                          color: C.text,
                        }}
                      >
                        {county.annuityDensity}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: C.card,
                        borderRadius: 4,
                        borderLeft: `3px solid ${C.gold}`,
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: 9,
                          fontFamily: fonts.mono,
                          color: C.gold,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Scrape Notes
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontFamily: fonts.body,
                          color: C.textMuted,
                        }}
                      >
                        {county.scrapeNotes}
                      </p>
                    </div>
                  </div>
                </Collapse>
              ))}
            </div>
          )}

          {/* ANNUITY TAB */}
          {activeTab === "annuity" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div
                style={{
                  padding: 24,
                  background: `linear-gradient(135deg, ${C.card} 0%, ${C.surface} 100%)`,
                  border: `1px solid ${C.orange}30`,
                  borderRadius: 6,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: 24,
                    fontFamily: fonts.heading,
                    color: C.orange,
                  }}
                >
                  Annuity Market Intelligence
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontFamily: fonts.body,
                    color: C.text,
                    lineHeight: 1.6,
                  }}
                >
                  The annuity market represents a massive opportunity with over
                  $3 trillion in assets. Our signals identify owners approaching
                  key decision points: surrender period endings, RMD
                  considerations, and orphaned policies with no active servicing
                  agent.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: 18,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  Target Profiles
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16,
                  }}
                >
                  {ANNUITY_PROFILES.map((profile, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 20,
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        borderTop: `3px solid ${profile.color}`,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 12px",
                          fontSize: 15,
                          fontFamily: fonts.heading,
                          color: C.white,
                        }}
                      >
                        {profile.title}
                      </h4>
                      <p
                        style={{
                          margin: "0 0 16px",
                          fontSize: 13,
                          fontFamily: fonts.body,
                          color: C.textMuted,
                          lineHeight: 1.5,
                        }}
                      >
                        {profile.description}
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {profile.signals.map((signal, sIdx) => (
                          <Tag key={sIdx} color={profile.color}>
                            {signal}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: 18,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  All Annuity Signals
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: 16,
                  }}
                >
                  {SIGNALS.annuity.signals.map((signal, idx) => (
                    <SignalCardSimple
                      key={idx}
                      signal={signal}
                      accentColor={C.orange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCRAPERS TAB */}
          {activeTab === "scrapers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                <MetricBox
                  label="Total Scrapers"
                  value={Object.keys(SCRAPER_FLEET).length}
                  color={C.purple}
                />
                <MetricBox
                  label="Counties Covered"
                  value={TARGET_COUNTIES.length}
                  color={C.cyan}
                />
                <MetricBox label="Est. Records" value="5.4M+" color={C.green} />
              </div>
              {Object.entries(SCRAPER_FLEET).map(([key, scraper]) => {
                const s = scraper as ScraperFleetItem;
                return (
                  <Collapse
                    key={key}
                    title={s.name}
                    tag={s.frequency}
                    tagColor={C.cyan}
                    defaultOpen={key === "countyAssessor"}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                          }}
                        >
                          Tech:
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: fonts.mono,
                            color: C.purple,
                          }}
                        >
                          {s.tech}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: 10,
                            fontFamily: fonts.mono,
                            color: C.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          Targets (
                          {Array.isArray(s.targets) ? s.targets.length : 0})
                        </span>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {s.targets.map((target, idx) => {
                            const targetStr =
                              typeof target === "string"
                                ? target
                                : (target as ScraperTarget).name;
                            return (
                              <div
                                key={idx}
                                style={{
                                  padding: "8px 12px",
                                  background: C.card,
                                  borderRadius: 4,
                                  border: `1px solid ${C.border}`,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontFamily: fonts.body,
                                    color: C.text,
                                  }}
                                >
                                  {targetStr}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {s.fields && s.fields.length > 0 && (
                        <div>
                          <span
                            style={{
                              display: "block",
                              fontSize: 10,
                              fontFamily: fonts.mono,
                              color: C.textMuted,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                              marginBottom: 10,
                            }}
                          >
                            Fields Captured
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {s.fields.map((field, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: 11,
                                  fontFamily: fonts.mono,
                                  color: C.gold,
                                  padding: "4px 8px",
                                  background: `${C.goldDim}30`,
                                  borderRadius: 3,
                                }}
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            padding: "12px 14px",
                            background: C.card,
                            borderRadius: 4,
                            borderLeft: `3px solid ${C.purple}`,
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              fontSize: 9,
                              fontFamily: fonts.mono,
                              color: C.textMuted,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            Storage
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontFamily: fonts.mono,
                              color: C.purple,
                            }}
                          >
                            {s.storage}
                          </span>
                        </div>
                        {s.volumeEstimate && (
                          <div
                            style={{
                              padding: "12px 14px",
                              background: C.card,
                              borderRadius: 4,
                              borderLeft: `3px solid ${C.green}`,
                            }}
                          >
                            <span
                              style={{
                                display: "block",
                                fontSize: 9,
                                fontFamily: fonts.mono,
                                color: C.textMuted,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                marginBottom: 4,
                              }}
                            >
                              Volume Estimate
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontFamily: fonts.mono,
                                color: C.green,
                              }}
                            >
                              {s.volumeEstimate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Collapse>
                );
              })}
            </div>
          )}

          {/* ENTITY TAB */}
          {activeTab === "entity" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div
                style={{
                  padding: 24,
                  background: `linear-gradient(135deg, ${C.card} 0%, ${C.surface} 100%)`,
                  border: `1px solid ${C.purple}30`,
                  borderRadius: 6,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: 24,
                    fontFamily: fonts.heading,
                    color: C.purple,
                  }}
                >
                  Entity Resolution Engine
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontFamily: fonts.body,
                    color: C.text,
                    lineHeight: 1.6,
                  }}
                >
                  {ENTITY_RESOLUTION.description}
                </p>
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  background: C.card,
                  borderRadius: 6,
                  borderLeft: `3px solid ${C.cyan}`,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: 9,
                    fontFamily: fonts.mono,
                    color: C.cyan,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Example
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontFamily: fonts.mono,
                    color: C.text,
                    lineHeight: 1.5,
                  }}
                >
                  {ENTITY_RESOLUTION.example}
                </p>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: 18,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  Matching Layers
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {ENTITY_RESOLUTION.matchingLayers.map((layer, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "16px 20px",
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: `${C.purple}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontFamily: fonts.mono,
                          color: C.purple,
                          fontWeight: 600,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontFamily: fonts.heading,
                              color: C.white,
                            }}
                          >
                            {layer.layer}
                          </h4>
                          <Tag color={C.green}>{layer.confidence}</Tag>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontFamily: fonts.body,
                            color: C.textMuted,
                          }}
                        >
                          {layer.method}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: 18,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  Output Profile Schema
                </h3>
                <div
                  style={{
                    padding: 20,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: 500,
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            fontSize: 10,
                            fontFamily: fonts.mono,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: C.textMuted,
                            borderBottom: `1px solid ${C.border}`,
                          }}
                        >
                          Field
                        </th>
                        <th
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            fontSize: 10,
                            fontFamily: fonts.mono,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: C.textMuted,
                            borderBottom: `1px solid ${C.border}`,
                          }}
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ENTITY_RESOLUTION.outputProfile).map(
                        ([field, desc], idx) => (
                          <tr key={idx}>
                            <td
                              style={{
                                padding: "10px 12px",
                                fontSize: 12,
                                fontFamily: fonts.mono,
                                color: C.gold,
                                borderBottom: `1px solid ${C.border}`,
                                verticalAlign: "top",
                              }}
                            >
                              {field}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                fontSize: 12,
                                fontFamily: fonts.body,
                                color: C.text,
                                borderBottom: `1px solid ${C.border}`,
                              }}
                            >
                              {desc}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: 18,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  Resolution Scenarios
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {ENTITY_EXAMPLES.map((example, idx) => (
                    <Collapse
                      key={idx}
                      title={example.scenario}
                      tagColor={C.cyan}
                      defaultOpen={idx === 0}
                    >
                      <ol
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {example.flow.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                            }}
                          >
                            <span
                              style={{
                                flexShrink: 0,
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: `${C.cyan}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontFamily: fonts.mono,
                                color: C.cyan,
                              }}
                            >
                              {sIdx + 1}
                            </span>
                            <span
                              style={{
                                fontSize: 13,
                                fontFamily: fonts.body,
                                color: C.text,
                                lineHeight: 1.5,
                                paddingTop: 2,
                              }}
                            >
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </Collapse>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "32px 24px",
            borderTop: `1px solid ${C.border}`,
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.mono,
                letterSpacing: 2,
                color: C.gold,
                textTransform: "uppercase",
              }}
            >
              Sovereign Data Engine
            </span>
            <span style={{ color: C.textDim }}>|</span>
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.mono,
                color: C.textMuted,
              }}
            >
              v2.0
            </span>
          </div>
          <div
            style={{ fontSize: 11, fontFamily: fonts.mono, color: C.textDim }}
          >
            100% Legal Public Records Only
          </div>
        </footer>
      </div>
    </>
  );
}
