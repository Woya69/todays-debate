import { ImageResponse } from "next/og";

export const runtime = "edge";

const COLORS = {
  bg: "#0c0f14",
  ink: "#eef2f7",
  muted: "#8b98a8",
  pro: "#2dd4bf",
  con: "#ff5a3c",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const motion = searchParams.get("motion") ?? "Live challenge on Today's Debate";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.bg,
          padding: "56px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.ink }}>
            TODAY&apos;S DEBATE
          </div>
          <div style={{ fontSize: 18, letterSpacing: "3px", color: COLORS.con }}>
            CHALLENGE {code ? `· ${code.slice(0, 6).toUpperCase()}` : ""}
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            height: 4,
            display: "flex",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, backgroundColor: COLORS.pro }} />
          <div style={{ flex: 1, backgroundColor: COLORS.con }} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "4px",
              color: COLORS.pro,
              marginBottom: 18,
            }}
          >
            WATCH THE CROWD
          </div>
          <div
            style={{
              fontSize: motion.length > 90 ? 38 : 48,
              fontWeight: 800,
              lineHeight: 1.12,
              color: COLORS.ink,
              letterSpacing: "-1px",
            }}
          >
            {motion}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, color: COLORS.muted }}>
            Two corners. Crowd decides.
          </div>
          <div style={{ fontSize: 22, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
