import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#faf7f2",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8a2e2e",
            marginBottom: 24,
          }}
        >
          Diario Oficial La Gaceta · Costa Rica
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          Gazette
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#4a4a4a", maxWidth: 900 }}>
          Te avisamos por email si tu empresa, competencia o palabra clave
          aparece en La Gaceta.
        </div>
      </div>
    ),
    { ...size }
  );
}
