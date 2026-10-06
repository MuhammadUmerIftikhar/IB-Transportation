import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { getFaqs, getSettings } from "@/lib/data";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { openGraphFor } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = "Frequently Asked Questions";
  const description = `Answers about booking with ${settings.companyName}: 24/7 availability, areas covered, which vehicle to choose, airport pickups and prices.`;
  return {
    title,
    description,
    alternates: { canonical: "/faq" },
    openGraph: openGraphFor({ title, description, path: "/faq", siteName: settings.companyName }),
  };
}

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        eyebrow="FAQ"
        title={`${settings.companyName} FAQ`}
        intro="Everything you need to know before you book: how booking works, where we drive, which vehicle fits your group and what to send for an airport pickup."
        image="/images/hotel.jpg"
        imageAlt="Hotel lobby in Dubai"
      />
      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}
