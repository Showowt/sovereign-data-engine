"use client";

import { C } from "@/lib/colors";

interface GlowBarProps {
  color?: string;
  height?: number;
  glow?: boolean;
  className?: string;
}

export function GlowBar({
  color = C.gold,
  height = 1,
  glow = true,
  className = "",
}: GlowBarProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: glow ? `0 0 20px ${color}40, 0 0 40px ${color}20` : "none",
        opacity: 0.8,
      }}
    />
  );
}
