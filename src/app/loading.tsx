import { C, fonts } from "@/lib/colors";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            border: `2px solid ${C.border}`,
            borderTopColor: C.gold,
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: C.textMuted,
            letterSpacing: 2,
          }}
        >
          LOADING...
        </p>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `,
          }}
        />
      </div>
    </div>
  );
}
