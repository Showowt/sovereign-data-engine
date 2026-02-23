"use client";

import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";

interface CompetitorCardProps {
  name: string;
  type: string;
  whatTheyDo: string[];
  whatTheyDont: string[];
  legalGaps?: string[];
  className?: string;
}

export function CompetitorCard({
  name,
  type,
  whatTheyDo,
  whatTheyDont,
  legalGaps,
  className = "",
}: CompetitorCardProps) {
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
        <Tag color={C.purple}>{type}</Tag>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* What They Do */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6.5 11.5L2.5 7.5"
                stroke={C.green}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontFamily: fonts.mono,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: C.green,
              }}
            >
              What They Do
            </span>
          </div>
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
            {whatTheyDo.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: 13,
                  fontFamily: fonts.sans,
                  color: C.text,
                  paddingLeft: 16,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: C.greenDim,
                  }}
                >
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What They Don't Do */}
        <div style={{ marginBottom: legalGaps ? 20 : 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke={C.red}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontFamily: fonts.mono,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: C.red,
              }}
            >
              What They Don&apos;t Do
            </span>
          </div>
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
            {whatTheyDont.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: 13,
                  fontFamily: fonts.sans,
                  color: C.textMuted,
                  paddingLeft: 16,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: C.red,
                  }}
                >
                  -
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Gaps */}
        {legalGaps && legalGaps.length > 0 && (
          <div
            style={{
              padding: 16,
              background: C.surface,
              borderRadius: 4,
              border: `1px solid ${C.goldDim}30`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1L1 15H15L8 1Z"
                  stroke={C.gold}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6V9M8 11.5V12"
                  stroke={C.gold}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: fonts.mono,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                Legal Gaps / Opportunities
              </span>
            </div>
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
              {legalGaps.map((gap, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.sans,
                    color: C.goldBright,
                    paddingLeft: 16,
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
                    *
                  </span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
