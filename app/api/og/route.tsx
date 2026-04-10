import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profit = searchParams.get("profit");
  const margin = searchParams.get("margin");
  const verdict = searchParams.get("v");
  const platform = searchParams.get("p") ?? "せどり";

  const hasResult = profit != null;

  const tone =
    verdict === "ok"
      ? { bg: "#ecfdf5", fg: "#047857", label: "OK 仕入れ推奨" }
      : verdict === "warn"
      ? { bg: "#fffbeb", fg: "#b45309", label: "WARN 微妙" }
      : verdict === "ng"
      ? { bg: "#fef2f2", fg: "#dc2626", label: "NG 見送り" }
      : { bg: "#f1f2f5", fg: "#0a0a0a", label: "せどり利益計算ツール" };

  const formattedProfit = hasResult
    ? `¥${Number(profit).toLocaleString("ja-JP")}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#10b981",
              marginRight: 12,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            sedori-calculator
          </div>
        </div>

        {hasResult ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#6b7280",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {`${platform} の判定`}
            </div>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: tone.bg,
                color: tone.fg,
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 30,
                fontWeight: 700,
                marginBottom: 28,
              }}
            >
              {tone.label}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              利益
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 132,
                fontWeight: 700,
                color: tone.fg,
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              {formattedProfit}
            </div>
            {margin && (
              <div
                style={{
                  display: "flex",
                  fontSize: 36,
                  color: "#6b7280",
                  fontWeight: 600,
                  marginTop: 16,
                }}
              >
                {`利益率 ${margin}%`}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 700,
                color: "#0a0a0a",
                lineHeight: 1.05,
                marginBottom: 24,
              }}
            >
              その仕入れ、利益出ますか？
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#6b7280",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              メルカリ・ラクマ・Yahoo!フリマ・Amazon FBA 対応
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#6b7280",
                fontWeight: 500,
                marginTop: 8,
              }}
            >
              仕入れOK / 微妙 / NG を 1 秒で判定
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "flex-end",
            color: "#9ca3af",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          sedori-calculator.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
