import { ImageResponse } from "next/og";

export const runtime = "edge";

const COLORS = {
  bg: "#e9e2d2",
  surface: "#f4eee0",
  ink: "#1a1611",
  accent: "#8a2832",
  muted: "#6c6453",
  border: "#c9bda3",
};

function stanceWord(value: string | null): string {
  if (value === "pro") return "FOR";
  if (value === "con") return "AGAINST";
  if (value === "undecided") return "UNDECIDED";
  return "—";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("n") ?? "—";
  const from = stanceWord(searchParams.get("from"));
  const to = stanceWord(searchParams.get("to"));
  const points = searchParams.get("pts") ?? "0";
  const streak = searchParams.get("streak");
  const crossed = from !== to && from !== "—" && to !== "—";

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
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: COLORS.ink,
            }}
          >
            TODAY&apos;S DEBATE
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "4px",
              color: COLORS.muted,
            }}
          >
            {`MOTION No. ${number}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: "3px", backgroundColor: COLORS.ink }} />
          <div style={{ height: "3px" }} />
          <div style={{ height: "1px", backgroundColor: COLORS.ink }} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: "8px",
              color: COLORS.accent,
              marginBottom: "8px",
            }}
          >
            THE VERDICT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              fontSize: 88,
              fontWeight: 700,
              color: COLORS.ink,
            }}
          >
            <span>{from}</span>
            <span style={{ color: COLORS.accent }}>{crossed ? "→" : "·"}</span>
            <span>{to}</span>
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: "4px",
              color: COLORS.muted,
              marginTop: "16px",
            }}
          >
            {crossed ? "CROSSED THE FLOOR" : "HELD THE LINE"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: COLORS.accent }}>
                +{points}
              </span>
              <span style={{ fontSize: 22, letterSpacing: "4px", color: COLORS.muted }}>
                POINTS
              </span>
            </div>
            {streak && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 56, fontWeight: 700, color: COLORS.ink }}>
                  {streak}
                </span>
                <span style={{ fontSize: 22, letterSpacing: "4px", color: COLORS.muted }}>
                  DAY STREAK
                </span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 24, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
