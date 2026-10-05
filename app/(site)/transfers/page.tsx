import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { PopularRoutes, routeTitle } from "@/components/sections/popular-routes";
import { getRoutes, getSettings } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { openGraphFor, siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [routes, settings] = await Promise.all([getRoutes(), getSettings()]);
  const title = "Airport & Intercity Transfers in the UAE";
  const description = `Private transfers from DXB, DWC, AUH & SHJ airports to Dubai Marina, Downtown, Abu Dhabi and every emirate. ${routes.length} routes, 24/7 — book on WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: "/transfers" },
    openGraph: openGraphFor({ title, description, path: "/transfers", siteName: settings.companyName }),
  };
}

export default async function TransfersPage() {
  const [routes, settings] = await Promise.all([getRoutes(), getSettings()]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular transfer routes",
    itemListElement: routes.map((route, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: routeTitle(route),
      url: `${siteUrl}/transfers/${route.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Transfers", path: "/transfers" }])} />
      <JsonLd data={itemList} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Transfers" }]}
        eyebrow="Private transfers · 24/7"
        title="UAE Airport & City Transfers"
        intro={`Door-to-door rides from every UAE airport to hotels, homes and offices — and between the emirates. Choose your route below or tell us any pickup and drop-off: ${settings.companyName} covers the whole country.`}
        image="/images/hero.jpg"
        imageAlt="Dubai skyline and highways at dusk"
        facts={[
          { label: "Popular routes", value: String(routes.length) },
          { label: "Airports", value: "DXB · DWC · AUH · SHJ" },
          { label: "Availability", value: "24/7" },
          { label: "Group size", value: "1 – 50" },
        ]}
      />
      <PopularRoutes
        routes={routes}
        limit={routes.length}
        showAllLink={false}
        eyebrow="All routes"
        title="Pick your"
        highlight="transfer"
        description="Distances and times are approximate and based on normal traffic. Don't see your route? Message us on WhatsApp — we go anywhere in the UAE."
      />
      <HowItWorks />
      <Cta />
    </>
  );
}
