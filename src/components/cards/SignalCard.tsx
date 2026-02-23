"use client";

import { useState } from "react";
import { C, fonts } from "@/lib/colors";
import { Tag } from "@/components/ui/Tag";
import { Collapse } from "@/components/ui/Collapse";

interface TimingWindow {
  window: string;
  action: string;
}

interface ContentPiece {
  type: string;
  title: string;
  hook: string;
}

interface ScraperSpec {
  source: string;
  frequency: string;
  fields: string[];
}

interface QualificationLogic {
  condition: string;
  score: number;
}

interface ScoringModel {
  factor: string;
  weight: number;
  description: string;
}

interface SignalCardProps {
  name: string;
  strength: "HIGH" | "MEDIUM" | "LOW";
  cost: "$" | "$$" | "$$$" | "FREE";
  source: string;
  description?: string;
  interpretation?: string[];
  matchCriteria?: string[];
  howToFind?: string;
  timingWindows?: TimingWindow[];
  seoTargets?: string[];
  contentPieces?: ContentPiece[];
  scraperSpec?: ScraperSpec;
  qualificationLogic?: QualificationLogic[];
  scoringModel?: ScoringModel[];
  className?: string;
}

const strengthColors = {
  HIGH: C.green,
  MEDIUM: C.orange,
  LOW: C.textMuted,
};

const costColors = {
  FREE: C.green,
  $: C.cyan,
  $$: C.gold,
  $$$: C.purple,
};

export function SignalCard({
  name,
  strength,
  cost,
  source,
  description,
  interpretation,
  matchCriteria,
  howToFind,
  timingWindows,
  seoTargets,
  contentPieces,
  scraperSpec,
  qualificationLogic,
  scoringModel,
  className = "",
}: SignalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
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
            {name}
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Tag color={strengthColors[strength]}>{strength}</Tag>
            <Tag color={costColors[cost]}>{cost}</Tag>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontFamily: fonts.mono,
            color: C.textMuted,
            letterSpacing: 0.5,
          }}
        >
          {source}
        </p>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          padding: "12px 20px",
          background: C.surface,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: fonts.mono,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.textMuted,
          }}
        >
          {isExpanded ? "Collapse Details" : "Expand Details"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke={C.textMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 16,
            background: C.surface,
          }}
        >
          {/* Description */}
          {description && (
            <Collapse title="Description" defaultOpen>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontFamily: fonts.sans,
                  color: C.text,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            </Collapse>
          )}

          {/* Interpretation */}
          {interpretation && interpretation.length > 0 && (
            <Collapse
              title="Interpretation"
              tag={`${interpretation.length}`}
              tagColor={C.cyan}
            >
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {interpretation.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 13,
                      fontFamily: fonts.sans,
                      color: C.text,
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: C.gold,
                      }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Collapse>
          )}

          {/* Match Criteria */}
          {matchCriteria && matchCriteria.length > 0 && (
            <Collapse
              title="Match Criteria"
              tag={`${matchCriteria.length}`}
              tagColor={C.green}
            >
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {matchCriteria.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.mono,
                      color: C.text,
                      padding: "6px 10px",
                      background: C.greenDim + "30",
                      borderRadius: 4,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Collapse>
          )}

          {/* How to Find */}
          {howToFind && (
            <Collapse title="How to Find">
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontFamily: fonts.sans,
                  color: C.text,
                  lineHeight: 1.6,
                }}
              >
                {howToFind}
              </p>
            </Collapse>
          )}

          {/* Timing Windows */}
          {timingWindows && timingWindows.length > 0 && (
            <Collapse
              title="Timing Windows"
              tag={`${timingWindows.length}`}
              tagColor={C.orange}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                {timingWindows.map((tw, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      background: C.card,
                      borderRadius: 4,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.mono,
                        color: C.orange,
                        marginBottom: 4,
                        letterSpacing: 0.5,
                      }}
                    >
                      {tw.window}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.sans,
                        color: C.text,
                      }}
                    >
                      {tw.action}
                    </div>
                  </div>
                ))}
              </div>
            </Collapse>
          )}

          {/* SEO Targets */}
          {seoTargets && seoTargets.length > 0 && (
            <Collapse
              title="SEO Targets"
              tag={`${seoTargets.length}`}
              tagColor={C.purple}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {seoTargets.map((target, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.mono,
                      color: C.purple,
                      padding: "4px 8px",
                      background: C.purpleDim + "40",
                      borderRadius: 3,
                    }}
                  >
                    {target}
                  </span>
                ))}
              </div>
            </Collapse>
          )}

          {/* Content Pieces */}
          {contentPieces && contentPieces.length > 0 && (
            <Collapse
              title="Content Pieces"
              tag={`${contentPieces.length}`}
              tagColor={C.cyan}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {contentPieces.map((piece, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      background: C.card,
                      borderRadius: 4,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <Tag color={C.cyan}>{piece.type}</Tag>
                      <span
                        style={{
                          fontSize: 13,
                          fontFamily: fonts.sans,
                          fontWeight: 500,
                          color: C.white,
                        }}
                      >
                        {piece.title}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontFamily: fonts.sans,
                        color: C.textMuted,
                        fontStyle: "italic",
                      }}
                    >
                      &quot;{piece.hook}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </Collapse>
          )}

          {/* Scraper Spec */}
          {scraperSpec && (
            <Collapse title="Scraper Specification" tagColor={C.gold}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.mono,
                      color: C.textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Source
                  </span>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      fontFamily: fonts.sans,
                      color: C.text,
                    }}
                  >
                    {scraperSpec.source}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.mono,
                      color: C.textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Frequency
                  </span>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      fontFamily: fonts.mono,
                      color: C.gold,
                    }}
                  >
                    {scraperSpec.frequency}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.mono,
                      color: C.textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Fields
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    {scraperSpec.fields.map((field, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 11,
                          fontFamily: fonts.mono,
                          color: C.cyan,
                          padding: "3px 8px",
                          background: C.cyanDim + "30",
                          borderRadius: 3,
                        }}
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Collapse>
          )}

          {/* Qualification Logic */}
          {qualificationLogic && qualificationLogic.length > 0 && (
            <Collapse
              title="Qualification Logic"
              tag={`${qualificationLogic.length}`}
              tagColor={C.green}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {qualificationLogic.map((logic, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: C.card,
                      borderRadius: 4,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.sans,
                        color: C.text,
                      }}
                    >
                      {logic.condition}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.mono,
                        fontWeight: 600,
                        color: logic.score >= 0 ? C.green : C.red,
                      }}
                    >
                      {logic.score >= 0 ? "+" : ""}
                      {logic.score}
                    </span>
                  </div>
                ))}
              </div>
            </Collapse>
          )}

          {/* Scoring Model */}
          {scoringModel && scoringModel.length > 0 && (
            <Collapse
              title="Scoring Model"
              tag={`${scoringModel.length}`}
              tagColor={C.gold}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {scoringModel.map((model, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      background: C.card,
                      borderRadius: 4,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontFamily: fonts.sans,
                          fontWeight: 500,
                          color: C.white,
                        }}
                      >
                        {model.factor}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.mono,
                          color: C.gold,
                        }}
                      >
                        Weight: {model.weight}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontFamily: fonts.sans,
                        color: C.textMuted,
                      }}
                    >
                      {model.description}
                    </p>
                  </div>
                ))}
              </div>
            </Collapse>
          )}
        </div>
      )}
    </div>
  );
}
