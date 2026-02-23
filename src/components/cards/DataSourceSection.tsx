"use client";

import { useState } from "react";
import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";

interface DataSource {
  name: string;
  type: string;
  access: "FREE" | "PAID" | "API" | "SCRAPE";
  url?: string;
  notes?: string;
}

interface DataSourceSectionProps {
  tier: string;
  tierLabel?: string;
  tierColor?: string;
  description?: string;
  sources: DataSource[];
  defaultOpen?: boolean;
  className?: string;
}

const accessColors = {
  FREE: C.green,
  PAID: C.gold,
  API: C.cyan,
  SCRAPE: C.purple,
};

export function DataSourceSection({
  tier,
  tierLabel,
  tierColor = C.gold,
  description,
  sources,
  defaultOpen = false,
  className = "",
}: DataSourceSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 18,
              fontFamily: fonts.serif,
              fontWeight: 400,
              color: C.white,
            }}
          >
            {tier}
          </span>
          {tierLabel && <Tag color={tierColor}>{tierLabel}</Tag>}
          <span
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: C.textMuted,
            }}
          >
            {sources.length} sources
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke={C.textMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Content */}
      {isOpen && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {description && (
            <p
              style={{
                margin: "16px 0",
                fontSize: 13,
                fontFamily: fonts.sans,
                color: C.textMuted,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          )}

          {/* Source List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 16,
            }}
          >
            {sources.map((source, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: C.surface,
                  borderRadius: 4,
                  border: `1px solid ${C.border}`,
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontFamily: fonts.sans,
                        fontWeight: 500,
                        color: C.white,
                      }}
                    >
                      {source.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      {source.type}
                    </span>
                  </div>
                  {source.notes && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        fontFamily: fonts.sans,
                        color: C.textMuted,
                      }}
                    >
                      {source.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Tag color={accessColors[source.access]}>{source.access}</Tag>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        background: C.card,
                        borderRadius: 4,
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.cyan;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6 4H4C3.44772 4 3 4.44772 3 5V12C3 12.5523 3.44772 13 4 13H11C11.5523 13 12 12.5523 12 12V10M9 3H13V7M13 3L7 9"
                          stroke={C.cyan}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
