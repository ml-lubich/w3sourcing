import { ImageResponse } from "next/og";
import { loadBrandWordmarkDataUrl } from "./brand-wordmark";

export const alt =
  "W3 Sourcing — executive recruitment in technology, legal, and banking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
  const wordmarkSrc = await loadBrandWordmarkDataUrl();

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
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #4338ca 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 900,
          }}
        >
          <img
            src={wordmarkSrc}
            alt="W3 Sourcing"
            style={{
              width: 520,
              height: 204,
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#c7d2fe",
              lineHeight: 1.35,
            }}
          >
            Executive recruitment across technology, legal & banking
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              fontWeight: 500,
              color: "#94a3b8",
            }}
          >
            US · UK · EU · UAE · Asia
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
