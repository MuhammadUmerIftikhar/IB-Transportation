import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { PopularRoutes } from "@/components/sections/popular-routes";
import { Services } from "@/components/sections/services";
import { getRoutes, getServices, getSettings } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { openGraphFor, siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = "Transport Services in Dubai & the UAE";
  const description = `${settings.companyName} services: 24/7 airport transfers, hotel pick & drop, family & group tours, office staff transport, UAE tours and desert safari rides.`;
  return {
    title,
    description,
    alternates: { canonical: "/services" },
    openGraph: openGraphFor({ title, description, path: "/services", siteName: settings.companyName }),
  };
}

export default async function ServicesPage() {
  const [settings, services, routes] = await Promise.all([getSettings(), getServices(), getRoutes()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${settings.companyName} services`,
          itemListElement: services.map((service, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: service.title,
            url: `${siteUrl}/services/${service.slug}`,
          })),
        }}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow={`${settings.companyName} services`}
        title="Transport Services Across the UAE"
        intro={`From airport pickups at 3 AM to 50-seat buses for company events — every ${settings.companyName} service is private, air-conditioned and bookable 24/7 on WhatsApp.`}
        image="/images/uae-tour.jpg"
        imageAlt="Sheikh Zayed Grand Mosque in Abu Dhabi at sunset"
        facts={[
          { label: "Services", value: String(services.length) },
          { label: "Availability", value: "24/7" },
          { label: "Coverage", value: "7 emirates" },
          { label: "Booking", value: "WhatsApp" },
        ]}
      />
      <Services services={services} companyName={settings.companyName} />
      <PopularRoutes routes={routes} className="bg-sand-100" />
      <HowItWorks />
      <Cta />
    </>
  );
}
