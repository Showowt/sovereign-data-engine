"use client";

import { useState } from "react";
import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";
import type { Signal } from "@/lib/types";

interface SignalCardSimpleProps {
  signal: Signal;
  accentColor?: string;
  className?: string;
}

const strengthColors: Record<string, string> = {
  "Very High": C.green,
  High: C.green,
  "Medium-High": C.orange,
  Medium: C.orange,
  "Low-Medium": C.textMuted,
  Low: C.textMuted,
};

const costColors: Record<string, string> = {
  Free: C.green,
  "Free (scraping)": C.green,
  "Free-Low": C.green,
  "Free-Medium": C.cyan,
  Low: C.cyan,
  "Low-Medium": C.gold,
  Medium: C.gold,
  "Medium-High": C.purple,
  High: C.purple,
};

export function SignalCardSimple({
  signal,
  accentColor = C.gold,
  className = "",
}: SignalCardSimpleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCostColor = (cost?: string): string => {
    if (!cost) return C.textMuted;
    for (const key of Object.keys(costColors)) {
      if (cost.toLowerCase().includes(key.toLowerCase())) {
        return costColors[key];
      }
    }
    return C.textMuted;
  };

  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 15,
              fontFamily: fonts.heading,
              fontWeight: 400,
              color: C.white,
              lineHeight: 1.3,
            }}
          >
            {signal.name}
          </h4>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {signal.strength && (
              <Tag color={strengthColors[signal.strength] || C.textMuted}>
                {signal.strength}
              </Tag>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: C.textMuted,
              letterSpacing: 0.5,
            }}
          >
            {signal.source}
          </span>
          {signal.cost && (
            <Tag color={getCostColor(signal.cost)}>{signal.cost}</Tag>
          )}
          {signal.legality && (
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.mono,
                color: signal.legality.includes("100%") ? C.green : C.textMuted,
                letterSpacing: 0.3,
              }}
            >
              {signal.legality}
            </span>
          )}
        </div>
      </div>

      {/* Description (always visible) */}
      {signal.description && (
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontFamily: fonts.body,
              color: C.text,
              lineHeight: 1.5,
            }}
          >
            {signal.description}
          </p>
        </div>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          padding: "10px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: fonts.mono,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.textMuted,
          }}
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke={C.textMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            padding: "16px 18px",
            background: C.surface,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Interpretation */}
          {signal.interpretation && signal.interpretation.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: accentColor,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Interpretation
              </span>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {signal.interpretation.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.body,
                      color: C.text,
                      paddingLeft: 14,
                      position: "relative",
                      lineHeight: 1.4,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: accentColor,
                        fontSize: 10,
                      }}
                    >
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to Find */}
          {signal.howToFind && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.cyan,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                How to Find
              </span>
              {Array.isArray(signal.howToFind) ? (
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {signal.howToFind.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.mono,
                        color: C.text,
                        padding: "6px 10px",
                        background: C.card,
                        borderRadius: 4,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontFamily: fonts.mono,
                    color: C.text,
                    padding: "8px 12px",
                    background: C.card,
                    borderRadius: 4,
                  }}
                >
                  {signal.howToFind}
                </p>
              )}
            </div>
          )}

          {/* Match Criteria */}
          {signal.matchCriteria && signal.matchCriteria.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.green,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Match Criteria
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {signal.matchCriteria.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.mono,
                      color: C.green,
                      padding: "6px 10px",
                      background: `${C.greenDim}30`,
                      borderRadius: 4,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formula */}
          {signal.formula && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.purple,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Formula
              </span>
              <code
                style={{
                  display: "block",
                  fontSize: 12,
                  fontFamily: fonts.mono,
                  color: C.purple,
                  padding: "10px 14px",
                  background: `${C.purpleDim}40`,
                  borderRadius: 4,
                }}
              >
                {signal.formula}
              </code>
            </div>
          )}

          {/* Time Window */}
          {signal.timeWindow && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.orange,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Timing Window
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontFamily: fonts.body,
                  color: C.orange,
                  padding: "8px 12px",
                  background: C.card,
                  borderRadius: 4,
                  borderLeft: `3px solid ${C.orange}`,
                }}
              >
                {signal.timeWindow}
              </p>
            </div>
          )}

          {/* Action Plan */}
          {signal.actionPlan && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.gold,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Action Plan
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontFamily: fonts.body,
                  color: C.text,
                  padding: "10px 14px",
                  background: C.card,
                  borderRadius: 4,
                  borderLeft: `3px solid ${C.gold}`,
                }}
              >
                {signal.actionPlan}
              </p>
            </div>
          )}

          {/* Timing Windows (for annuity) */}
          {signal.timingWindows && signal.timingWindows.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.orange,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Timing Windows
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 8,
                }}
              >
                {signal.timingWindows.map((tw, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 12px",
                      background: C.card,
                      borderRadius: 4,
                      border: `1px solid ${tw.status === "NOW" ? C.gold : C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: fonts.mono,
                          color: C.textMuted,
                        }}
                      >
                        Purchased: {tw.purchaseYear}
                      </span>
                      <Tag color={tw.status === "NOW" ? C.gold : C.textMuted}>
                        {tw.status}
                      </Tag>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.body,
                        color: C.text,
                      }}
                    >
                      Free: {tw.freeDate} | {tw.volume}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Targets */}
          {signal.seoTargets && signal.seoTargets.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.purple,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                SEO Targets
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {signal.seoTargets.map((target, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.mono,
                      color: C.purple,
                      padding: "4px 8px",
                      background: `${C.purpleDim}40`,
                      borderRadius: 3,
                    }}
                  >
                    {target}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content Pieces */}
          {signal.contentPieces && signal.contentPieces.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.cyan,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Content Strategy
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {signal.contentPieces.map((piece, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.body,
                      color: C.cyan,
                      padding: "6px 10px",
                      background: `${C.cyanDim}30`,
                      borderRadius: 4,
                    }}
                  >
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Licenses */}
          {signal.keyLicenses && signal.keyLicenses.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.gold,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Key Licenses
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {signal.keyLicenses.map((license, idx) => (
                  <Tag key={idx} color={C.gold}>
                    {license}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Scraper Spec */}
          {signal.scraperSpec && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.gold,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Scraper Specification
              </span>
              <div
                style={{
                  padding: "12px 14px",
                  background: C.card,
                  borderRadius: 4,
                  border: `1px solid ${C.border}`,
                }}
              >
                {signal.scraperSpec.method && (
                  <div style={{ marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      Method:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.mono,
                        color: C.cyan,
                      }}
                    >
                      {signal.scraperSpec.method}
                    </span>
                  </div>
                )}
                {signal.scraperSpec.logic && (
                  <div style={{ marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      Logic:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.body,
                        color: C.text,
                      }}
                    >
                      {signal.scraperSpec.logic}
                    </span>
                  </div>
                )}
                {signal.scraperSpec.trigger && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      Trigger:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.mono,
                        color: C.orange,
                      }}
                    >
                      {signal.scraperSpec.trigger}
                    </span>
                  </div>
                )}
                {signal.scraperSpec.filter && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      Filter:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.mono,
                        color: C.green,
                      }}
                    >
                      {signal.scraperSpec.filter}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
