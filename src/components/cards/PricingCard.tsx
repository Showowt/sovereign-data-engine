"use client";

import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  highlight?: boolean;
  highlightColor?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function PricingCard({
  tier,
  price,
  period = "/mo",
  description,
  features,
  highlight = false,
  highlightColor = C.gold,
  ctaText = "Get Started",
  onCtaClick,
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${highlight ? highlightColor + "60" : C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = highlight
          ? highlightColor
          : C.borderActive;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlight
          ? highlightColor + "60"
          : C.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Highlight Glow */}
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: highlightColor,
            boxShadow: `0 0 20px ${highlightColor}40`,
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
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
            {tier}
          </h3>
          {highlight && <Tag color={highlightColor}>POPULAR</Tag>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: description ? 12 : 0,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontFamily: fonts.serif,
              fontWeight: 400,
              color: highlight ? highlightColor : C.gold,
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          <span
            style={{
              fontSize: 14,
              fontFamily: fonts.sans,
              color: C.textMuted,
            }}
          >
            {period}
          </span>
        </div>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontFamily: fonts.sans,
              color: C.textMuted,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Features */}
      <div style={{ padding: "20px 24px" }}>
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
          {features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              {feature.included ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ marginTop: 2, flexShrink: 0 }}
                >
                  <path
                    d="M13.5 4.5L6.5 11.5L2.5 7.5"
                    stroke={feature.highlight ? highlightColor : C.green}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ marginTop: 2, flexShrink: 0 }}
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke={C.textDim}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <span
                style={{
                  fontSize: 13,
                  fontFamily: fonts.sans,
                  color: feature.included
                    ? feature.highlight
                      ? C.white
                      : C.text
                    : C.textDim,
                  lineHeight: 1.4,
                }}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      {onCtaClick && (
        <div style={{ padding: "0 24px 24px" }}>
          <button
            onClick={onCtaClick}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: highlight ? highlightColor : "transparent",
              border: `1px solid ${highlight ? highlightColor : C.borderActive}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: fonts.sans,
              fontWeight: 500,
              color: highlight ? C.bg : C.text,
              letterSpacing: 0.5,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!highlight) {
                e.currentTarget.style.background = C.elevated;
                e.currentTarget.style.borderColor = C.gold;
              }
            }}
            onMouseLeave={(e) => {
              if (!highlight) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = C.borderActive;
              }
            }}
          >
            {ctaText}
          </button>
        </div>
      )}
    </div>
  );
}
