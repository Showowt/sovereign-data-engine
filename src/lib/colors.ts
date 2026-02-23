/**
 * Sovereign Data Engine - Color Palette & Typography
 * Hernsted Private Capital Brand System
 */

export const C = {
  // Backgrounds (darkest to lightest)
  bg: "#06050A",
  surface: "#0C0B12",
  card: "#11101A",
  elevated: "#161525",

  // Borders
  border: "#1C1B28",
  borderActive: "#2A293A",

  // Gold spectrum (primary brand)
  gold: "#C8A45E",
  goldDim: "#8B7340",
  goldBright: "#E8C96E",

  // Cyan spectrum (accents)
  cyan: "#3ECFCF",
  cyanDim: "#1A6B6B",

  // Status colors
  red: "#E54D4D",
  green: "#4ADE80",
  greenDim: "#1B6B3A",
  purple: "#7C5CFC",
  purpleDim: "#3D2E7E",
  orange: "#F59E0B",

  // Text hierarchy
  text: "#E8E0D0",
  textMuted: "#6B6580",
  textDim: "#3D3755",
  white: "#F0EDE5",
} as const;

export const fonts = {
  serif: "'Instrument Serif', 'Georgia', serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'DM Sans', system-ui, sans-serif",
  // Semantic aliases for component usage
  heading: "'Instrument Serif', 'Georgia', serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const;

// Common style mixins for components
export const mixins = {
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
  },
  cardHover: {
    borderColor: C.borderActive,
    background: C.elevated,
  },
  glowGold: {
    boxShadow: `0 0 20px ${C.gold}20`,
  },
  glowCyan: {
    boxShadow: `0 0 20px ${C.cyan}20`,
  },
} as const;

// Tailwind-compatible class mappings
export const colorClasses = {
  bgPrimary: "bg-[#06050A]",
  bgSurface: "bg-[#0C0B12]",
  bgCard: "bg-[#11101A]",
  bgElevated: "bg-[#161525]",
  borderDefault: "border-[#1C1B28]",
  borderActive: "border-[#2A293A]",
  textGold: "text-[#C8A45E]",
  textCyan: "text-[#3ECFCF]",
  textPrimary: "text-[#E8E0D0]",
  textMuted: "text-[#6B6580]",
} as const;

// Gradient presets
export const gradients = {
  goldShine: "linear-gradient(135deg, #8B7340 0%, #C8A45E 50%, #E8C96E 100%)",
  cyanGlow: "linear-gradient(135deg, #1A6B6B 0%, #3ECFCF 100%)",
  purpleDepth: "linear-gradient(135deg, #3D2E7E 0%, #7C5CFC 100%)",
  darkFade: "linear-gradient(180deg, #0C0B12 0%, #06050A 100%)",
} as const;

export type ColorKey = keyof typeof C;
export type FontKey = keyof typeof fonts;
