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
  COMPARISON_TABLE,
  SOVEREIGN_ADVANTAGES,
  countSignals,
  countAnnuitySignals,
  countScraperTargets,
} from "@/lib/data";
import { Collapse } from "@/components/ui/Collapse";
import { MetricBox } from "@/components/ui/MetricBox";
import { GlowBar } from "@/components/ui/GlowBar";
import { Tag } from "@/components/ui/Tag";
import { SignalCardSimple } from "@/components/cards/SignalCardSimple";
import type { ScraperTarget, ScraperFleetItem, Signal } from "@/lib/types";

type TabKey =
  | "overview"
  | "signals"
  | "counties"
  | "annuity"
  | "scrapers"
  | "entity";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "signals", label: "Signals" },
  { key: "counties", label: "Counties" },
  { key: "annuity", label: "Annuity" },
  { key: "scrapers", label: "Scrapers" },
  { key: "entity", label: "Entity" },
];

// Annuity profile information
const ANNUITY_PROFILES = [
  {
    title: "The Surrender Window Prospect",
    description:
      "Annuity owners approaching the end of their surrender period (typically 7-10 years). These individuals can now access their funds penalty-free and are evaluating whether to stay or exchange.",
    signals: ["Surrender Period Ending", "Variable Annuity in Down Market"],
    icon: "clock",
    color: C.gold,
  },
  {
    title: "The Orphaned Policyholder",
    description:
      "Annuity owners whose original selling agent has retired, passed away, or left the business. They receive no ongoing service and may not know their options.",
    signals: ["Orphaned Annuity", "Agent No Longer Active"],
    icon: "user-x",
    color: C.orange,
  },
  {
    title: "The Distribution Decision Maker",
    description:
      "Age 70+ annuity owners who need to make RMD decisions and may not understand their distribution options. Legacy planning becomes a priority.",
    signals: ["Age 70+ with Deferred Annuity", "RMD Considerations"],
    icon: "calendar",
    color: C.cyan,
  },
  {
    title: "The Active Researcher",
    description:
      "Individuals actively searching online for 1035 exchange information, annuity fee comparisons, or surrender calculators. High intent, looking for guidance.",
    signals: ["1035 Exchange Search Intent", "Content Engagement"],
    icon: "search",
    color: C.purple,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSignals = countSignals();
  const annuitySignals = countAnnuitySignals();
  const scraperTargets = countScraperTargets();

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
          {/* Tag Line */}
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

          {/* Title */}
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

          {/* Subtitle */}
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 16,
              fontFamily: fonts.body,
              color: C.textMuted,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            Intelligence platform for high-equity property owners and annuity
            holders. 100% legal public records acquisition with real-time
            monitoring, multi-source entity resolution, and actionable prospect
            scoring.
          </p>

          <div style={{ marginTop: 32 }}>
            <GlowBar />
          </div>
        </header>

        {/* Metrics Row */}
        <section
          style={{
            padding: "32px 24px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16,
            }}
          >
            <MetricBox
              label="Total Signals"
              value={totalSignals}
              color={C.gold}
            />
            <MetricBox label="Target Counties" value={6} color={C.cyan} />
            <MetricBox label="Data Sources" value="26+" color={C.purple} />
            <MetricBox
              label="Annuity Signals"
              value={annuitySignals}
              color={C.orange}
            />
            <MetricBox
              label="Scraper Targets"
              value={scraperTargets}
              color={C.cyan}
            />
            <MetricBox label="Legal Status" value="100%" color={C.green} />
          </div>
        </section>

        {/* Tab Navigation */}
        <nav
          style={{
            padding: "0 24px",
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
                  padding: "14px 20px",
                  background: activeTab === tab.key ? C.surface : "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === tab.key
                      ? `2px solid ${C.gold}`
                      : "2px solid transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: fonts.mono,
                  letterSpacing: 1,
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
                {tab.label}
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
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {/* Problem vs Solution Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 24,
                }}
              >
                {/* The Problem */}
                <div
                  style={{
                    padding: 24,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 20px",
                      fontSize: 20,
                      fontFamily: fonts.heading,
                      color: C.red,
                    }}
                  >
                    The Problem
                  </h2>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {[
                      "PropStream and competitors provide stale, batch-updated data",
                      "No real-time monitoring of mortgage satisfactions or life events",
                      "Zero visibility into annuity surrender windows",
                      "No entity resolution across multiple data sources",
                      "Expensive enterprise pricing excludes independent advisors",
                      "Unclear data sourcing raises legal questions",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: 13,
                          fontFamily: fonts.body,
                          color: C.text,
                          paddingLeft: 18,
                          position: "relative",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: C.red,
                            fontSize: 14,
                          }}
                        >
                          ×
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The Sovereign Difference */}
                <div
                  style={{
                    padding: 24,
                    background: C.card,
                    border: `1px solid ${C.gold}30`,
                    borderRadius: 6,
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 20px",
                      fontSize: 20,
                      fontFamily: fonts.heading,
                      color: C.gold,
                    }}
                  >
                    The Sovereign Difference
                  </h2>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {SOVEREIGN_ADVANTAGES.map((adv, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: 13,
                          fontFamily: fonts.body,
                          color: C.text,
                          paddingLeft: 18,
                          position: "relative",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: C.gold,
                            fontSize: 14,
                          }}
                        >
                          +
                        </span>
                        <strong style={{ color: C.white }}>
                          {adv.advantage}:
                        </strong>{" "}
                        {adv.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comparison Table */}
              <div>
                <h2
                  style={{
                    margin: "0 0 20px",
                    fontSize: 24,
                    fontFamily: fonts.heading,
                    color: C.white,
                  }}
                >
                  Head-to-Head Comparison
                </h2>
                <div
                  style={{
                    overflowX: "auto",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: 700,
                    }}
                  >
                    <thead>
                      <tr>
                        {COMPARISON_TABLE.headers.map((header, idx) => (
                          <th
                            key={idx}
                            style={{
                              padding: "14px 16px",
                              background: C.surface,
                              borderBottom: `1px solid ${C.border}`,
                              textAlign: "left",
                              fontSize: 11,
                              fontFamily: fonts.mono,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                              color: idx === 1 ? C.gold : C.textMuted,
                              fontWeight: 500,
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_TABLE.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              style={{
                                padding: "12px 16px",
                                borderBottom:
                                  rowIdx < COMPARISON_TABLE.rows.length - 1
                                    ? `1px solid ${C.border}`
                                    : "none",
                                fontSize: 13,
                                fontFamily:
                                  cellIdx === 0 ? fonts.body : fonts.mono,
                                color:
                                  cellIdx === 0
                                    ? C.text
                                    : cell === "YES"
                                      ? C.green
                                      : cell === "No"
                                        ? C.red
                                        : C.textMuted,
                                background:
                                  cellIdx === 1 ? `${C.gold}08` : "transparent",
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SIGNALS TAB */}
          {activeTab === "signals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
                  margin: "0 0 16px",
                  fontSize: 14,
                  fontFamily: fonts.body,
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
                    {/* Metrics Row */}
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

                    {/* Access Status */}
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
                          padding: "14px 16px",
                          background: county.assessorOnline
                            ? `${C.greenDim}20`
                            : C.card,
                          borderRadius: 4,
                          border: `1px solid ${county.assessorOnline ? `${C.greenDim}40` : C.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: county.assessorOnline
                                ? C.green
                                : C.red,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              fontFamily: fonts.body,
                              color: county.assessorOnline
                                ? C.green
                                : C.textMuted,
                            }}
                          >
                            Assessor Online
                          </span>
                        </div>
                        <a
                          href={county.assessorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 11,
                            fontFamily: fonts.mono,
                            color: C.cyan,
                            textDecoration: "none",
                            wordBreak: "break-all",
                          }}
                        >
                          {county.assessorUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                      <div
                        style={{
                          padding: "14px 16px",
                          background: county.recorderOnline
                            ? `${C.greenDim}20`
                            : C.card,
                          borderRadius: 4,
                          border: `1px solid ${county.recorderOnline ? `${C.greenDim}40` : C.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: county.recorderOnline
                                ? C.green
                                : C.red,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              fontFamily: fonts.body,
                              color: county.recorderOnline
                                ? C.green
                                : C.textMuted,
                            }}
                          >
                            Recorder Online
                          </span>
                        </div>
                        <a
                          href={county.recorderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 11,
                            fontFamily: fonts.mono,
                            color: C.cyan,
                            textDecoration: "none",
                            wordBreak: "break-all",
                          }}
                        >
                          {county.recorderUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>

                    {/* Feature Tags */}
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

                    {/* Signals */}
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
                        Market Signals
                      </span>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {county.signals.map((signal, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: 11,
                              fontFamily: fonts.body,
                              color: C.text,
                              padding: "6px 10px",
                              background: C.card,
                              borderRadius: 4,
                              border: `1px solid ${C.border}`,
                            }}
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Annuity Density */}
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

                    {/* Scrape Notes */}
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
              {/* Intro */}
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

              {/* Profile Cards */}
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

              {/* Annuity Signals */}
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
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 14,
                  fontFamily: fonts.body,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Six specialized scrapers continuously acquire public records
                data from county offices, courts, SEC filings, and professional
                databases.
              </p>

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
                      {/* Tech Stack */}
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

                      {/* Targets */}
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
                            const method =
                              typeof target === "object"
                                ? (target as ScraperTarget).method
                                : null;
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
                                {method && (
                                  <span
                                    style={{
                                      display: "block",
                                      fontSize: 10,
                                      fontFamily: fonts.mono,
                                      color: C.cyan,
                                      marginTop: 4,
                                    }}
                                  >
                                    {method}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Fields */}
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

                      {/* Document Types */}
                      {s.documentTypes && s.documentTypes.length > 0 && (
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
                            Document Types
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {s.documentTypes.map((docType, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: 11,
                                  fontFamily: fonts.mono,
                                  color: C.cyan,
                                  padding: "4px 8px",
                                  background: `${C.cyanDim}30`,
                                  borderRadius: 3,
                                }}
                              >
                                {docType}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Storage & Volume */}
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

                      {/* Key Logic / Filter / Enrichment */}
                      {(s.keyLogic || s.filter || s.enrichment) && (
                        <div
                          style={{
                            padding: "14px 16px",
                            background: C.card,
                            borderRadius: 4,
                            borderLeft: `3px solid ${C.gold}`,
                          }}
                        >
                          {s.keyLogic && (
                            <div
                              style={{
                                marginBottom: s.filter || s.enrichment ? 12 : 0,
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
                                  marginBottom: 4,
                                }}
                              >
                                Key Logic
                              </span>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  fontFamily: fonts.body,
                                  color: C.text,
                                }}
                              >
                                {s.keyLogic}
                              </p>
                            </div>
                          )}
                          {s.filter && (
                            <div
                              style={{ marginBottom: s.enrichment ? 12 : 0 }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 9,
                                  fontFamily: fonts.mono,
                                  color: C.cyan,
                                  letterSpacing: 1,
                                  textTransform: "uppercase",
                                  marginBottom: 4,
                                }}
                              >
                                Filter
                              </span>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  fontFamily: fonts.body,
                                  color: C.text,
                                }}
                              >
                                {s.filter}
                              </p>
                            </div>
                          )}
                          {s.enrichment && (
                            <div>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 9,
                                  fontFamily: fonts.mono,
                                  color: C.purple,
                                  letterSpacing: 1,
                                  textTransform: "uppercase",
                                  marginBottom: 4,
                                }}
                              >
                                Enrichment
                              </span>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  fontFamily: fonts.body,
                                  color: C.text,
                                }}
                              >
                                {s.enrichment}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Collapse>
                );
              })}
            </div>
          )}

          {/* ENTITY TAB */}
          {activeTab === "entity" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Description */}
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

              {/* Example */}
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

              {/* Matching Layers */}
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

              {/* Output Profile Schema */}
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

              {/* Example Scenarios */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
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
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: C.textDim,
            }}
          >
            100% Legal Public Records Only
          </div>
        </footer>
      </div>
    </>
  );
}
