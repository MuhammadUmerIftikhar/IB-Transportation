import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Fleet } from "@/components/sections/fleet";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Marquee } from "@/components/sections/marquee";
import { PopularRoutes } from "@/components/sections/popular-routes";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { TourBanner } from "@/components/sections/tour-banner";
import { WhyUs } from "@/components/sections/why-us";
import { getFaqs, getRoutes, getServices, getSettings, getTestimonials, getVehicles } from "@/lib/data";
import { faqSchema } from "@/lib/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, services, vehicles, faqs, testimonials, routes] = await Promise.all([
    getSettings(),
    getServices(),
    getVehicles(),
    getFaqs(),
    getTestimonials(),
    getRoutes(),
  ]);

  const tours = services.find((service) => service.icon === "map");

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Hero
        settings={{
          heroBadge: settings.heroBadge,
          heroTitle: settings.heroTitle,
          heroRotatingWords: settings.heroRotatingWords,
          heroSubtitle: settings.heroSubtitle,
          heroImage: settings.heroImage,
          availability: settings.availability,
        }}
        booking={{
          services: services.map(({ title }) => ({ title })),
          vehicles: vehicles.map(({ name, passengers }) => ({ name, passengers })),
        }}
      />
      <Marquee items={settings.destinations} />
      <Services services={services} companyName={settings.companyName} />
      <Fleet vehicles={vehicles} />
      <PopularRoutes routes={routes} />
      <HowItWorks />
      <WhyUs features={settings.whyChooseUs} stats={settings.stats} />
      <TourBanner exploreHref={tours ? `/services/${tours.slug}` : undefined} />
      <Testimonials testimonials={testimonials} />
      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}
