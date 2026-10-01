import { ImageResponse } from "next/og";
import { DEBATES } from "@/data/debates";

export const runtime = "edge";

const COLORS = {
  bg: "#e9e2d2",
  ink: "#1a1611",
  accent: "#8a2832",
  muted: "#6c6453",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const debate = DEBATES.find((d) => d.id === slug);
  const resolution = debate?.resolution ?? "Today's Debate";
  const category = debate?.category ?? "Daily motion";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.bg,
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.ink }}>
            TODAY&apos;S DEBATE
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "3px",
              color: COLORS.muted,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>
        <div style={{ height: 3, backgroundColor: COLORS.ink, marginTop: 16 }} />
        <div style={{ height: 3 }} />
        <div style={{ height: 1, backgroundColor: COLORS.ink }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "4px",
              color: COLORS.accent,
              marginBottom: 20,
            }}
          >
            THE MOTION
          </div>
          <div
            style={{
              fontSize: resolution.length > 90 ? 42 : 52,
              fontWeight: 700,
              lineHeight: 1.15,
              color: COLORS.ink,
            }}
          >
            {resolution}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 24, color: COLORS.muted }}>
            Both sides. No pile-on.
          </div>
          <div style={{ fontSize: 24, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
