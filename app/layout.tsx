import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { getSettings } from "@/lib/data";
import { openGraphFor, siteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.seoTitle, template: `%s | ${settings.companyName}` },
    description: settings.seoDescription,
    applicationName: settings.companyName,
    keywords: [
      "Dubai airport transfer",
      "airport pick and drop UAE",
      "hotel transfer Dubai",
      "desert safari pickup",
      "bus rental Dubai",
      "van rental Dubai",
      "UAE tours",
      "group transport UAE",
      "office staff transport Dubai",
    ],
    openGraph: openGraphFor({ title: settings.seoTitle, description: settings.seoDescription, path: "/", siteName: settings.companyName }),
    // title/description/image fall back to each page's Open Graph tags
    twitter: { card: "summary_large_image" },
    // Let Google (incl. AI Overviews) show long text snippets and large image previews
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
    // Optional: paste verification codes from Google Search Console / Bing Webmaster Tools into Vercel env vars
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
      ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a1122",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the splash boot script sets data-splash on <html> before React hydrates
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
