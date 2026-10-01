import { ImageResponse } from "next/og";
import { DEBATES } from "@/data/debates";

export const runtime = "edge";

const COLORS = {
  bg: "#eceef1",
  ink: "#14161a",
  muted: "#5f6773",
  pro: "#0f5c4c",
  con: "#9b341f",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const debate = DEBATES.find((d) => d.id === slug);
  const resolution = debate?.resolution ?? "Today's Debate";
  const category = debate?.category ?? "Main Event";

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
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink }}>
            TODAY&apos;S DEBATE
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "2px",
              color: COLORS.muted,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            height: 3,
            display: "flex",
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
            paddingTop: 32,
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "3px",
              color: COLORS.pro,
              marginBottom: 16,
            }}
          >
            MAIN EVENT
          </div>
          <div
            style={{
              fontSize: resolution.length > 90 ? 38 : 48,
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
          <div style={{ fontSize: 20, color: COLORS.muted }}>
            Challenge someone. Let the crowd decide.
          </div>
          <div style={{ fontSize: 20, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
