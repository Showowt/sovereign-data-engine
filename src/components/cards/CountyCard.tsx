"use client";

import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";

interface CountyMetric {
  label: string;
  value: string | number;
}

interface OnlineAccess {
  available: boolean;
  url?: string;
  notes?: string;
}

interface CountySignal {
  name: string;
  strength: "HIGH" | "MEDIUM" | "LOW";
}

interface CountyCardProps {
  name: string;
  state: string;
  metrics?: CountyMetric[];
  onlineAccess?: OnlineAccess;
  signals?: CountySignal[];
  annuityDensity?: "HIGH" | "MEDIUM" | "LOW";
  scrapeNotes?: string;
  className?: string;
}

const densityColors = {
  HIGH: C.green,
  MEDIUM: C.orange,
  LOW: C.textMuted,
};

const strengthColors = {
  HIGH: C.green,
  MEDIUM: C.orange,
  LOW: C.textMuted,
};

export function CountyCard({
  name,
  state,
  metrics,
  onlineAccess,
  signals,
  annuityDensity,
  scrapeNotes,
  className = "",
}: CountyCardProps) {
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
          padding: "18px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontFamily: fonts.serif,
              fontWeight: 400,
              color: C.white,
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: C.textMuted,
              letterSpacing: 1,
            }}
          >
            {state}
          </span>
        </div>
        {annuityDensity && (
          <div style={{ textAlign: "right" }}>
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
              Annuity Density
            </span>
            <Tag color={densityColors[annuityDensity]}>{annuityDensity}</Tag>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Metrics Grid */}
        {metrics && metrics.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 14px",
                  background: C.surface,
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
                  {metric.label}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.serif,
                    color: C.gold,
                  }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Online Access */}
        {onlineAccess && (
          <div
            style={{
              padding: "14px 16px",
              background: onlineAccess.available
                ? C.greenDim + "20"
                : C.surface,
              borderRadius: 4,
              border: `1px solid ${onlineAccess.available ? C.greenDim + "40" : C.border}`,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: onlineAccess.notes ? 8 : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: onlineAccess.available ? C.green : C.textDim,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.sans,
                    color: onlineAccess.available ? C.green : C.textMuted,
                  }}
                >
                  {onlineAccess.available
                    ? "Online Access Available"
                    : "No Online Access"}
                </span>
              </div>
              {onlineAccess.url && (
                <a
                  href={onlineAccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    fontFamily: fonts.mono,
                    color: C.cyan,
                    textDecoration: "none",
                  }}
                >
                  Visit Portal
                </a>
              )}
            </div>
            {onlineAccess.notes && (
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontFamily: fonts.sans,
                  color: C.textMuted,
                  fontStyle: "italic",
                }}
              >
                {onlineAccess.notes}
              </p>
            )}
          </div>
        )}

        {/* Signals */}
        {signals && signals.length > 0 && (
          <div style={{ marginBottom: scrapeNotes ? 20 : 0 }}>
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
              Available Signals
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {signals.map((signal, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    background: C.surface,
                    borderRadius: 4,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: strengthColors[signal.strength],
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.sans,
                      color: C.text,
                    }}
                  >
                    {signal.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scrape Notes */}
        {scrapeNotes && (
          <div
            style={{
              padding: "12px 14px",
              background: C.surface,
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
                fontFamily: fonts.sans,
                color: C.textMuted,
              }}
            >
              {scrapeNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
