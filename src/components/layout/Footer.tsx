"use client";

import { C, fonts } from "@/lib/colors";
import { GlowBar } from "@/components/ui/GlowBar";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName?: string;
  tagline?: string;
  links?: FooterLink[];
  showGlow?: boolean;
  className?: string;
}

export function Footer({
  companyName = "Hernsted Private Capital",
  tagline = "Sovereign Data Engine",
  links,
  showGlow = true,
  className = "",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={className}>
      {/* Glow Divider */}
      {showGlow && (
        <div style={{ marginBottom: 32 }}>
          <GlowBar color={C.gold} />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "32px 24px 48px",
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "block",
              fontSize: 18,
              fontFamily: fonts.serif,
              color: C.white,
              marginBottom: 4,
            }}
          >
            {companyName}
          </span>
          <span
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: C.gold,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tagline}
          </span>
        </div>

        {/* Links */}
        {links && links.length > 0 && (
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
            }}
          >
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                style={{
                  fontSize: 12,
                  fontFamily: fonts.sans,
                  color: C.textMuted,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.textMuted;
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Copyright */}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontFamily: fonts.mono,
            color: C.textDim,
            letterSpacing: 0.5,
          }}
        >
          {currentYear} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
