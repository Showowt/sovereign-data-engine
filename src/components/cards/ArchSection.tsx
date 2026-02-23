"use client";

import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";

interface TechItem {
  name: string;
  role: string;
  status?: "ACTIVE" | "PLANNED" | "IN_PROGRESS";
}

interface ComponentItem {
  name: string;
  description: string;
  color?: string;
}

interface ArchSectionProps {
  title: string;
  subtitle?: string;
  tag?: string;
  tagColor?: string;
  techStack?: TechItem[];
  components?: ComponentItem[];
  notes?: string;
  className?: string;
}

const statusColors = {
  ACTIVE: C.green,
  PLANNED: C.textMuted,
  IN_PROGRESS: C.orange,
};

export function ArchSection({
  title,
  subtitle,
  tag,
  tagColor = C.gold,
  techStack,
  components,
  notes,
  className = "",
}: ArchSectionProps) {
  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: subtitle ? 6 : 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontFamily: fonts.serif,
              fontWeight: 400,
              color: C.white,
            }}
          >
            {title}
          </h3>
          {tag && <Tag color={tagColor}>{tag}</Tag>}
        </div>
        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontFamily: fonts.sans,
              color: C.textMuted,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div style={{ marginBottom: components ? 24 : 0 }}>
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontFamily: fonts.mono,
                color: C.textMuted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Tech Stack
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: C.surface,
                    borderRadius: 4,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontFamily: fonts.sans,
                        fontWeight: 500,
                        color: C.white,
                        marginBottom: 2,
                      }}
                    >
                      {tech.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: fonts.mono,
                        color: C.textMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      {tech.role}
                    </span>
                  </div>
                  {tech.status && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: statusColors[tech.status],
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Components */}
        {components && components.length > 0 && (
          <div style={{ marginBottom: notes ? 20 : 0 }}>
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontFamily: fonts.mono,
                color: C.textMuted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Components
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {components.map((comp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px 16px",
                    background: C.surface,
                    borderRadius: 4,
                    borderLeft: `3px solid ${comp.color || C.gold}`,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontFamily: fonts.sans,
                      fontWeight: 500,
                      color: C.white,
                      marginBottom: 4,
                    }}
                  >
                    {comp.name}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontFamily: fonts.sans,
                      color: C.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {comp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div
            style={{
              padding: "14px 16px",
              background: C.surface,
              borderRadius: 4,
              border: `1px dashed ${C.borderActive}`,
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: 9,
                fontFamily: fonts.mono,
                color: C.gold,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Notes
            </span>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontFamily: fonts.sans,
                color: C.textMuted,
                lineHeight: 1.6,
              }}
            >
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
