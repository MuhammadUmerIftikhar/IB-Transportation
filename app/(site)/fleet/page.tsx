import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Fleet } from "@/components/sections/fleet";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { getSettings, getVehicles } from "@/lib/data";
import { breadcrumbSchema, ids } from "@/lib/schema";
import { openGraphFor, siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, vehicles] = await Promise.all([getSettings(), getVehicles()]);
  const max = Math.max(...vehicles.map((v) => v.passengers), 1);
  const title = "Fleet: Sedan, SUV, Van & Bus with Driver";
  const description = `The ${settings.companyName} fleet: sedans, SUVs, 7-seaters, vans, mini vans and buses for 1 to ${max} passengers, with driver, 24/7 across the UAE.`;
  return {
    title,
    description,
    alternates: { canonical: "/fleet" },
    openGraph: openGraphFor({ title, description, path: "/fleet", siteName: settings.companyName }),
  };
}

export default async function FleetPage() {
  const [settings, vehicles] = await Promise.all([getSettings(), getVehicles()]);
  const max = Math.max(...vehicles.map((v) => v.passengers), 1);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Fleet", path: "/fleet" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: `${settings.companyName} fleet`,
          url: `${siteUrl}/fleet`,
          itemListElement: vehicles.map((vehicle) => ({
            "@type": "Offer",
            offeredBy: { "@id": ids.business },
            itemOffered: {
              "@type": "Service",
              name: `${vehicle.name} with driver`,
              description: `${vehicle.description} Up to ${vehicle.passengers} passengers and ${vehicle.luggage} large bags. ${vehicle.models}.`,
            },
          })),
        }}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Fleet" }]}
        eyebrow={`${settings.companyName} fleet`}
        title="Vehicles for Every Group Size"
        intro={`Six vehicle types, all air-conditioned and driven by our own drivers — a sedan for two, a ${vehicles.find((v) => v.passengers === max)?.name.toLowerCase() ?? "bus"} for ${max}, and everything in between.`}
        image="/images/city-lights.jpg"
        imageAlt="Dubai streets at night with light trails"
        facts={[
          { label: "Vehicle types", value: String(vehicles.length) },
          { label: "Passengers", value: `1 – ${max}` },
          { label: "Availability", value: "24/7" },
          { label: "Coverage", value: "7 emirates" },
        ]}
      />
      <Fleet vehicles={vehicles} />
      <HowItWorks />
      <Cta />
    </>
  );
}
