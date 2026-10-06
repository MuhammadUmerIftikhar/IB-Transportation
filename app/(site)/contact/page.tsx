import { Clock3, MapPin, MapPinned, Phone } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { QuickBooking } from "@/components/sections/quick-booking";
import { Reveal } from "@/components/ui/reveal";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { telUrl, toDigits, whatsappUrl } from "@/lib/contact";
import { getFaqs, getServices, getSettings, getVehicles } from "@/lib/data";
import { breadcrumbSchema, ids } from "@/lib/schema";
import { openGraphFor, siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `Contact ${settings.companyName} – 24/7 Booking on WhatsApp`;
  const description = `Call or WhatsApp ${settings.companyName} on ${settings.phone}, 24 hours a day. Airport transfers, tours and group transport across all UAE emirates.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/contact" },
    openGraph: openGraphFor({ title, description, path: "/contact", siteName: settings.companyName }),
  };
}

export default async function ContactPage() {
  const [settings, services, vehicles, faqs] = await Promise.all([getSettings(), getServices(), getVehicles(), getFaqs()]);
  const phone = `+${toDigits(settings.phone)}`;

  const items = [
    { icon: Phone, label: "Phone", value: settings.phone, href: telUrl(settings.phone) },
    { icon: WhatsAppIcon, label: "WhatsApp", value: settings.phone, href: whatsappUrl(settings.whatsappNumber, settings.whatsappMessage), external: true },
    { icon: Clock3, label: "Hours", value: "Open 24 hours, 7 days a week" },
    { icon: MapPin, label: "Based in", value: settings.address },
    { icon: MapPinned, label: "Areas served", value: "All seven emirates and every UAE airport" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": `${siteUrl}/contact#page`,
          url: `${siteUrl}/contact`,
          name: `Contact ${settings.companyName}`,
          isPartOf: { "@id": ids.website },
          about: { "@id": ids.business },
          mainEntity: {
            "@id": ids.organization,
            contactPoint: { "@type": "ContactPoint", telephone: phone, contactType: "reservations", areaServed: "AE", availableLanguage: ["English"] },
          },
        }}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact us"
        title={`Contact ${settings.companyName}`}
        intro={`Message or call us any time — ${settings.companyName} is available 24 hours a day. The quickest way to book is WhatsApp: send your pickup, drop-off, date, time and number of passengers.`}
        image="/images/hero.jpg"
        imageAlt="Dubai skyline and highways at dusk"
        bookLabel="Message us on WhatsApp"
      />

      <section className="bg-sand-50 py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="grid content-start gap-6">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h2>
            <ul className="grid gap-3">
              {items.map(({ icon: ItemIcon, label, value, href, external }) => {
                const inner = (
                  <>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-gold-300">
                      <ItemIcon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-ink-700/65">{label}</span>
                      <span className="block font-display text-lg font-semibold break-words text-ink-900">{value}</span>
                    </span>
                  </>
                );
                const cls = "flex items-center gap-4 rounded-3xl border border-ink-900/5 bg-white p-4 shadow-soft";
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className={`${cls} transition hover:-translate-y-0.5 hover:shadow-lift`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <QuickBooking
              services={services.map(({ title }) => ({ title }))}
              vehicles={vehicles.map(({ name, passengers }) => ({ name, passengers }))}
              title="Send a booking request"
            />
          </Reveal>
        </div>
      </section>

      <Faq faqs={faqs} />
    </>
  );
}
