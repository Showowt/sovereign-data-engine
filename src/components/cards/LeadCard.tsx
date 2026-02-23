"use client";

import { useState } from "react";
import type { Lead } from "@/lib/types";
import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";
import { formatCurrency } from "@/lib/data/leads";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Score-based color
  const scoreColor =
    lead.score >= 90
      ? C.green
      : lead.score >= 80
        ? C.gold
        : lead.score >= 70
          ? C.orange
          : C.textMuted;

  // Tier-based color
  const tierColor = lead.tier === "SOVEREIGN" ? C.gold : C.cyan;

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${isExpanded ? `${scoreColor}40` : C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={isExpanded}
        aria-label={`${lead.name} - Score ${lead.score}`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* Left side - Name and details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontFamily: fonts.heading,
                  color: C.white,
                  fontWeight: 500,
                }}
              >
                {lead.name}
              </span>
              <Tag color={tierColor}>{lead.tier}</Tag>
              <Tag color={C.textMuted}>{lead.type}</Tag>
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: fonts.body,
                color: C.textMuted,
              }}
            >
              {lead.address}
            </div>
          </div>

          {/* Right side - Score */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontSize: 32,
                fontFamily: fonts.heading,
                fontWeight: 300,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {lead.score}
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: fonts.mono,
                color: C.textMuted,
                letterSpacing: 1.5,
                marginTop: 2,
              }}
            >
              SCORE
            </div>
          </div>
        </div>

        {/* Quick metrics row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              background: C.surface,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: fonts.mono,
                color: C.textDim,
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              VALUE
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: fonts.heading,
                color: C.gold,
              }}
            >
              {formatCurrency(lead.value)}
            </div>
          </div>
          <div
            style={{
              padding: "6px 10px",
              background: C.surface,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: fonts.mono,
                color: C.textDim,
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              EQUITY
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: fonts.heading,
                color: C.green,
              }}
            >
              {formatCurrency(lead.equity)} ({lead.equityPct}%)
            </div>
          </div>
          <div
            style={{
              padding: "6px 10px",
              background: C.surface,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: fonts.mono,
                color: C.textDim,
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              ANNUITY PROB
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: fonts.heading,
                color: lead.annuityProbability >= 70 ? C.orange : C.textMuted,
              }}
            >
              {lead.annuityProbability}%
            </div>
          </div>
          <div
            style={{
              padding: "6px 10px",
              background: C.surface,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: fonts.mono,
                color: C.textDim,
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              COUNTY
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: fonts.heading,
                color: C.cyan,
              }}
            >
              {lead.county}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {/* Signals */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 9,
                fontFamily: fonts.mono,
                color: C.gold,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              ACTIVE SIGNALS ({lead.signals.length})
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {lead.signals.map((signal, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.body,
                    color: C.text,
                    paddingLeft: 12,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: C.gold,
                    }}
                  >
                    ◆
                  </span>
                  {signal}
                </div>
              ))}
            </div>
          </div>

          {/* Timing and Recommendation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                background: C.surface,
                borderRadius: 4,
                borderLeft: `3px solid ${C.red}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.red,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                }}
              >
                TIMING
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: fonts.body,
                  color: C.text,
                  lineHeight: 1.5,
                }}
              >
                {lead.timing}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                background: C.surface,
                borderRadius: 4,
                borderLeft: `3px solid ${C.green}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: C.green,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                }}
              >
                RECOMMENDED ACTION
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: fonts.body,
                  color: C.text,
                  lineHeight: 1.5,
                }}
              >
                {lead.recommended}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                flex: 1,
                minWidth: 140,
                padding: "10px 16px",
                borderRadius: 4,
                background: C.gold,
                color: C.bg,
                border: "none",
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 1.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              GENERATE OUTREACH
            </button>
            <button
              style={{
                flex: 1,
                minWidth: 120,
                padding: "10px 16px",
                borderRadius: 4,
                background: "transparent",
                color: C.gold,
                border: `1px solid ${C.border}`,
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 1.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.border)
              }
            >
              EXPORT DNA
            </button>
            <button
              style={{
                flex: 1,
                minWidth: 120,
                padding: "10px 16px",
                borderRadius: 4,
                background: "transparent",
                color: C.cyan,
                border: `1px solid ${C.border}`,
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 1.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.cyan)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.border)
              }
            >
              ASSIGN TEAM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
