import { ImageResponse } from "next/og";
import { getSeedChallenge } from "@/data/crowd";

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
  const code = searchParams.get("code") ?? "";
  const seed = code ? getSeedChallenge(code) : null;
  const motion =
    searchParams.get("motion") ||
    seed?.challenge.motion ||
    "Live challenge on Today's Debate";

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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink }}>
            TODAY&apos;S DEBATE
          </div>
          <div style={{ fontSize: 18, letterSpacing: "2px", color: COLORS.con }}>
            CHALLENGE
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
            WATCH THE CROWD
          </div>
          <div
            style={{
              fontSize: motion.length > 90 ? 36 : 46,
              fontWeight: 700,
              lineHeight: 1.15,
              color: COLORS.ink,
            }}
          >
            {motion}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, color: COLORS.muted }}>
            Two corners. Crowd decides.
          </div>
          <div style={{ fontSize: 20, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
