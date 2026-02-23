"use client";

import { useState } from "react";
import { C, fonts } from "@/lib/colors";
import { Tag } from "./Tag";

interface CollapseProps {
  title: string;
  tag?: string;
  tagColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapse({
  title,
  tag,
  tagColor = C.gold,
  children,
  defaultOpen = false,
  className = "",
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={className}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 13,
              fontFamily: fonts.sans,
              fontWeight: 500,
              color: C.text,
            }}
          >
            {title}
          </span>
          {tag && <Tag color={tagColor}>{tag}</Tag>}
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
      {isOpen && (
        <div
          style={{
            padding: "0 18px 18px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div style={{ paddingTop: 16 }}>{children}</div>
        </div>
      )}
    </div>
  );
}
