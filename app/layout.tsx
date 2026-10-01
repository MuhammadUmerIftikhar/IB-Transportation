import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/site";
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
    openGraph: {
      type: "website",
      siteName: settings.companyName,
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: "en_AE",
    },
    twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a1122",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
