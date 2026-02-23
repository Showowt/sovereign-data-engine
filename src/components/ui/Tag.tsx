"use client";

import { C, fonts } from "@/lib/colors";

interface TagProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Tag({ children, color = C.gold, className = "" }: TagProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 3,
        background: color + "12",
        color,
        fontSize: 9,
        fontFamily: fonts.mono,
        letterSpacing: 1.5,
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
