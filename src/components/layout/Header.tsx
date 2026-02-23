"use client";

import { C, fonts } from "@/lib/colors";
import { MetricBox } from "@/components/ui/MetricBox";
import { GlowBar } from "@/components/ui/GlowBar";

interface HeaderMetric {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  tagColor?: string;
  metrics?: HeaderMetric[];
  showGlow?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  tag,
  tagColor = C.gold,
  metrics,
  showGlow = true,
  className = "",
}: HeaderProps) {
  return (
    <header className={className}>
      {/* Title Section */}
      <div
        style={{
          marginBottom: metrics ? 32 : showGlow ? 24 : 0,
        }}
      >
        {tag && (
          <span
            style={{
              display: "inline-block",
              marginBottom: 12,
              padding: "4px 12px",
              background: tagColor + "12",
              color: tagColor,
              fontSize: 10,
              fontFamily: fonts.mono,
              letterSpacing: 2,
              textTransform: "uppercase",
              borderRadius: 3,
            }}
          >
            {tag}
          </span>
        )}
        <h1
          style={{
            margin: 0,
            fontSize: 42,
            fontFamily: fonts.serif,
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.2,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 16,
              fontFamily: fonts.sans,
              color: C.textMuted,
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Metrics Row */}
      {metrics && metrics.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: showGlow ? 32 : 0,
          }}
        >
          {metrics.map((metric, idx) => (
            <MetricBox
              key={idx}
              label={metric.label}
              value={metric.value}
              sub={metric.sub}
              color={metric.color}
            />
          ))}
        </div>
      )}

      {/* Glow Divider */}
      {showGlow && <GlowBar color={C.gold} />}
    </header>
  );
}
