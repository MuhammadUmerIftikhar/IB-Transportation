import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { fallbackSettings } from "@/lib/fallback";

export const alt = "IB Transportation — airport transfers, tours and group transport across the UAE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const hero = await readFile(path.join(process.cwd(), "public/images/night-drive.jpg"));
  const heroSrc = `data:image/jpeg;base64,${hero.toString("base64")}`;
  const logo = await readFile(path.join(process.cwd(), "public/images/ib-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const { companyName, phone } = fallbackSettings;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#050913" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroSrc} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.55 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #050913 0%, rgba(5,9,19,0.85) 45%, rgba(5,9,19,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "72px 80px", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="" width={110} height={88} style={{ objectFit: "contain" }} />
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>{companyName}</div>
          </div>
          <div style={{ marginTop: 56, fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, maxWidth: 820 }}>
            Airport transfers, tours & group rides across the UAE
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 16, fontSize: 28 }}>
            <div style={{ display: "flex", background: "#25d366", color: "#050913", padding: "12px 26px", borderRadius: 999, fontWeight: 700 }}>
              Book on WhatsApp
            </div>
            <div style={{ display: "flex", border: "2px solid rgba(255,255,255,0.3)", padding: "12px 26px", borderRadius: 999 }}>
              {phone} · 24/7
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
