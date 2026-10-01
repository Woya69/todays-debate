import { ImageResponse } from "next/og";

export const runtime = "edge";

const COLORS = {
  bg: "#eceef1",
  ink: "#14161a",
  muted: "#5f6773",
  pro: "#0f5c4c",
  con: "#9b341f",
  border: "#c9ced6",
};

function stanceWord(value: string | null): string {
  if (value === "pro") return "FOR";
  if (value === "con") return "AGAINST";
  if (value === "undecided") return "WATCH";
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
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.ink }}>
            TODAY&apos;S DEBATE
          </div>
          <div style={{ fontSize: 20, letterSpacing: "2px", color: COLORS.muted }}>
            {`MAIN EVENT No. ${number}`}
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
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "4px",
              color: COLORS.muted,
              marginBottom: 12,
            }}
          >
            VERDICT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 78,
              fontWeight: 700,
              color: COLORS.ink,
            }}
          >
            <span
              style={{
                color:
                  from === "FOR"
                    ? COLORS.pro
                    : from === "AGAINST"
                      ? COLORS.con
                      : COLORS.ink,
              }}
            >
              {from}
            </span>
            <span style={{ color: COLORS.muted }}>{crossed ? "→" : "·"}</span>
            <span
              style={{
                color:
                  to === "FOR"
                    ? COLORS.pro
                    : to === "AGAINST"
                      ? COLORS.con
                      : COLORS.ink,
              }}
            >
              {to}
            </span>
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "3px",
              color: COLORS.muted,
              marginTop: 14,
            }}
          >
            {crossed ? "CROSSED THE FLOOR" : "HELD THE CORNER"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: COLORS.pro }}>
                +{points}
              </span>
              <span style={{ fontSize: 16, letterSpacing: "2px", color: COLORS.muted }}>
                POINTS
              </span>
            </div>
            {streak && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: COLORS.ink }}>
                  {streak}
                </span>
                <span style={{ fontSize: 16, letterSpacing: "2px", color: COLORS.muted }}>
                  DAY STREAK
                </span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 20, color: COLORS.muted }}>todaysdebate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
