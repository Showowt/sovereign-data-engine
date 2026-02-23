"use client";

import { C, fonts } from "@/lib/colors";

interface MetricBoxProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  className?: string;
}

export function MetricBox({
  label,
  value,
  sub,
  color = C.gold,
  className = "",
}: MetricBoxProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "16px 20px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        minWidth: 140,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontFamily: fonts.mono,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: C.textMuted,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 28,
          fontFamily: fonts.serif,
          fontWeight: 400,
          color,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          style={{
            fontSize: 11,
            fontFamily: fonts.sans,
            color: C.textMuted,
            marginTop: 2,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
