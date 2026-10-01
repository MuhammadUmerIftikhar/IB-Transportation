import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffd770, #f5a800 50%, #ff6a3d)",
          color: "#0a1122",
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -4,
        }}
      >
        IB
      </div>
    ),
    size,
  );
}
