import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { PopularRoutes } from "@/components/sections/popular-routes";
import { Reveal } from "@/components/ui/reveal";
import { getRoutes, getServices, getSettings, getVehicles } from "@/lib/data";
import { breadcrumbSchema, ids } from "@/lib/schema";
import { openGraphFor, siteUrl } from "@/lib/site";

export const revalidate = 60;

/** The brand's own page: tells search engines and AI assistants who IB Transportation is. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `About ${settings.companyName} – Dubai Private Transport Company`;
  const description = `${settings.companyName} is a Dubai-based private transport company: 24/7 airport transfers, hotel transfers, tours and group transport across all 7 UAE emirates.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/about" },
    openGraph: openGraphFor({ title, description, path: "/about", siteName: settings.companyName }),
  };
}

export default async function AboutPage() {
  const [settings, services, vehicles, routes] = await Promise.all([getSettings(), getServices(), getVehicles(), getRoutes()]);
  const name = settings.companyName;
  const maxPassengers = Math.max(...vehicles.map((v) => v.passengers), 1);

  const facts: [string, React.ReactNode][] = [
    ["Company name", name],
    ["Based in", settings.address],
    ["What we do", "Private airport transfers, hotel transfers, tours and group transport"],
    ["Areas served", "All seven emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain"],
    ["Airports", "Dubai (DXB), Al Maktoum (DWC), Abu Dhabi (AUH), Sharjah (SHJ)"],
    ["Hours", "Open 24 hours, 7 days a week"],
    ["Fleet", vehicles.map((v) => `${v.name} (up to ${v.passengers})`).join(", ")],
    ["Phone & WhatsApp", settings.phone],
    ["Website", siteUrl.replace("https://", "")],
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${siteUrl}/about#page`,
          url: `${siteUrl}/about`,
          name: `About ${name}`,
          isPartOf: { "@id": ids.website },
          about: { "@id": ids.business },
          mainEntity: { "@id": ids.organization },
        }}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: `About ${name}`, path: "/about" }])} />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
        eyebrow="About us"
        title={`About ${name}`}
        intro={`${name} is a private transport company based in Dubai. We drive people between UAE airports, hotels, homes, offices and attractions — 24 hours a day, in every emirate.`}
        image="/images/night-drive.jpg"
        imageAlt={`${name} vehicle driving through Dubai at night`}
        facts={[
          { label: "Based in", value: "Dubai, UAE" },
          { label: "Coverage", value: "7 emirates" },
          { label: "Availability", value: "24/7" },
          { label: "Group size", value: `1 – ${maxPassengers}` },
        ]}
      />

      <section className="bg-sand-50 py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="grid max-w-[68ch] content-start gap-5 text-lg leading-relaxed text-ink-700/85">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Who we are</h2>
            <p>
              {name} provides private, door-to-door transport across the United Arab Emirates. Travellers book us for airport pick-up and
              drop-off at DXB, DWC, Abu Dhabi and Sharjah airports; families for days out; companies for daily staff transport; and groups
              for tours, events and weddings.
            </p>
            <p>
              Every ride is private and air-conditioned, in a vehicle sized for your group and luggage — from a sedan for up to{" "}
              {Math.min(...vehicles.map((v) => v.passengers))} passengers to a bus for up to {maxPassengers}. We cover all seven emirates and
              run around the clock, so early-morning flights and late-night arrivals are never a problem.
            </p>
            <p>
              Booking is simple: send your pickup, drop-off, date, time and number of passengers on WhatsApp at{" "}
              <strong className="text-ink-900">{settings.phone}</strong>, and we confirm your ride.
            </p>

            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink-900">Our services</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 text-base font-medium text-ink-900 shadow-soft transition hover:-translate-y-0.5"
                  >
                    {service.title}
                    <ArrowRight className="size-4 text-gold-600 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-ink-900/5 sm:p-7">
              <h2 className="font-display text-2xl font-bold tracking-tight">{name} at a glance</h2>
              <dl className="mt-5 divide-y divide-ink-900/10">
                {facts.map(([label, value]) => (
                  <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="text-sm font-semibold text-ink-700/70">{label}</dt>
                    <dd className="text-[15px] text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <PopularRoutes routes={routes} eyebrow="Where we drive" title="Popular" highlight="transfers" className="bg-sand-100" />
      <Cta />
    </>
  );
}
