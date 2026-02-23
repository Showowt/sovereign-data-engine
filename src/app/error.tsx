"use client";

import { useEffect } from "react";
import { C, fonts } from "@/lib/colors";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: C.bg,
      }}
    >
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <div
          style={{
            fontSize: 48,
            marginBottom: 16,
          }}
        >
          ⚠️
        </div>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: 24,
            color: C.white,
            marginBottom: 8,
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: 14,
            color: C.textMuted,
            marginBottom: 8,
          }}
        >
          Algo salió mal
        </p>
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: 12,
            color: C.textDim,
            marginBottom: 24,
            padding: "12px 16px",
            background: C.surface,
            borderRadius: 4,
            border: `1px solid ${C.border}`,
            wordBreak: "break-word",
          }}
        >
          {error.message || "Unknown error"}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            background: C.gold,
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: 1,
            color: C.bg,
            fontWeight: 600,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          TRY AGAIN / INTENTAR DE NUEVO
        </button>
      </div>
    </div>
  );
}
