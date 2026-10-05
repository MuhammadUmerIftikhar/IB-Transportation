import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Fleet } from "@/components/sections/fleet";
import { PageHero } from "@/components/sections/page-hero";
import { PopularRoutes, placeName, routeTitle } from "@/components/sections/popular-routes";
import { QuickBooking } from "@/components/sections/quick-booking";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { getFaqs, getRoute, getRoutes, getServices, getSettings, getVehicles } from "@/lib/data";
import { breadcrumbSchema, faqSchema, routeFaqs, serviceSchema } from "@/lib/schema";
import { openGraphFor } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const routes = await getRoutes();
  return routes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [route, settings] = await Promise.all([getRoute(slug), getSettings()]);
  if (!route) return {};
  const title = routeTitle(route);
  const description = `Private ${route.from} to ${route.to} transfer, 24/7 · ~${route.distanceKm} km, ${route.duration} · Sedan to 50-seat bus · Book instantly on WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: `/transfers/${route.slug}` },
    openGraph: openGraphFor({ title, description, path: `/transfers/${route.slug}`, siteName: settings.companyName }),
  };
}

export default async function RoutePage({ params }: Props) {
  const { slug } = await params;
  const [route, routes, services, vehicles, faqs, settings] = await Promise.all([
    getRoute(slug),
    getRoutes(),
    getServices(),
    getVehicles(),
    getFaqs(),
    getSettings(),
  ]);
  if (!route) notFound();

  const title = routeTitle(route);
  const path = `/transfers/${route.slug}`;
  const fromAirport = /airport/i.test(route.from);
  const bookingService = (fromAirport ? services.find((s) => s.icon === "plane") : undefined) ?? services[0];
  const questions = [
    ...routeFaqs(route, vehicles),
    ...faqs.filter((faq) => !/book a ride|available 24\/7/i.test(faq.question)).slice(0, 3),
  ].map((faq, i) => ({ _id: `route-faq-${i}`, question: faq.question, answer: faq.answer }));
  const others = routes.filter((r) => r.slug !== route.slug);
  const maxPassengers = Math.max(...vehicles.map((v) => v.passengers), 1);
  const bookMessage = `Hello ${settings.companyName}! 👋 I'd like to book a transfer from ${route.from} to ${route.to}. Please share availability and price.`;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: title,
          description: route.summary,
          path,
          serviceType: fromAirport ? "Airport transfer" : "Private transfer",
          areaServed: [placeName(route.from), route.to],
          image: typeof route.image === "string" ? route.image : undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Transfers", path: "/transfers" },
          { name: title, path },
        ])}
      />
      <JsonLd data={faqSchema(questions)} />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Transfers", href: "/transfers" }, { label: `${placeName(route.from)} → ${route.to}` }]}
        eyebrow={`${route.from} → ${route.to}`}
        title={title}
        intro={route.summary}
        image={route.image ?? "/images/airport.jpg"}
        imageAlt={`${route.from} to ${route.to}`}
        bookLabel="Book this transfer"
        bookMessage={bookMessage}
        facts={[
          { label: "Distance", value: `~${route.distanceKm} km` },
          { label: "Travel time", value: route.duration },
          { label: "Availability", value: "24/7" },
          { label: "Passengers", value: `1 – ${maxPassengers}` },
        ]}
      />

      <section className="relative bg-sand-50 py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-600 uppercase">About this route</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {route.from} to {route.to} with {settings.companyName}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-700/80">{route.summary}</p>
            <p className="mt-5 text-lg leading-relaxed text-ink-700/80">
              The trip is about <strong className="text-ink-900">{route.distanceKm} km</strong> and usually takes{" "}
              <strong className="text-ink-900">{route.duration}</strong>. Every transfer is private — just you and your group, in an
              air-conditioned vehicle sized for your passengers and luggage, from a sedan for up to{" "}
              {Math.min(...vehicles.map((v) => v.passengers))} people to a bus for up to {maxPassengers}.
            </p>

            {route.highlights.length > 0 && (
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {[...route.highlights, "Available 24/7, every day", "Book in seconds on WhatsApp"].map((highlight) => (
                  <StaggerItem key={highlight}>
                    <div className="flex items-center gap-3 rounded-2xl border border-ink-900/5 bg-white p-4 shadow-soft">
                      <CheckCircle2 className="size-6 shrink-0 text-whatsapp-dark" aria-hidden />
                      <span className="font-medium">{highlight}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </Reveal>

          <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:self-start">
            <QuickBooking
              services={services.map(({ title: t }) => ({ title: t }))}
              vehicles={vehicles.map(({ name, passengers }) => ({ name, passengers }))}
              defaultService={bookingService?.title}
              defaultPickup={route.from}
              defaultDropoff={route.to}
              title={`Book ${placeName(route.from)} → ${route.to}`}
            />
          </Reveal>
        </div>
      </section>

      <Fleet
        vehicles={vehicles}
        eyebrow="Choose your vehicle"
        title={`Vehicles for your trip to`}
        highlight={route.to}
        description="Slide to your group size to see which vehicle fits best — from a sedan for two to a coach for fifty."
      />

      <Faq faqs={questions} />

      <PopularRoutes
        routes={others}
        eyebrow="More transfers"
        title="Other popular"
        highlight="routes"
        description="Private transfers between UAE airports, cities and emirates — all available 24/7."
        className="bg-sand-100"
      />

      <Cta />
    </>
  );
}
