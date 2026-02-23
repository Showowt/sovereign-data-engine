"use client";

import { C, fonts } from "@/lib/colors";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
}

export function TabNav({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  className = "",
}: TabNavProps) {
  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case "pills":
        return {
          padding: "10px 18px",
          background: isActive ? C.gold + "20" : "transparent",
          border: `1px solid ${isActive ? C.gold + "40" : C.border}`,
          borderRadius: 20,
          color: isActive ? C.gold : C.textMuted,
        };
      case "underline":
        return {
          padding: "12px 20px",
          background: "transparent",
          border: "none",
          borderBottom: `2px solid ${isActive ? C.gold : "transparent"}`,
          borderRadius: 0,
          color: isActive ? C.white : C.textMuted,
        };
      default:
        return {
          padding: "12px 20px",
          background: isActive ? C.elevated : "transparent",
          border: `1px solid ${isActive ? C.borderActive : "transparent"}`,
          borderRadius: 4,
          color: isActive ? C.white : C.textMuted,
        };
    }
  };

  return (
    <nav
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: variant === "underline" ? 0 : 8,
        padding: variant === "underline" ? 0 : "6px",
        background: variant === "underline" ? "transparent" : C.surface,
        borderRadius: variant === "underline" ? 0 : 6,
        borderBottom:
          variant === "underline" ? `1px solid ${C.border}` : "none",
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const styles = getTabStyles(isActive);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: fonts.sans,
              fontWeight: isActive ? 500 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              ...styles,
            }}
          >
            {tab.icon && (
              <span style={{ display: "flex", alignItems: "center" }}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  padding: "2px 6px",
                  background: isActive ? C.gold + "30" : C.card,
                  borderRadius: 10,
                  fontSize: 10,
                  fontFamily: fonts.mono,
                  color: isActive ? C.gold : C.textMuted,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
