import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/portable-text";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Fleet } from "@/components/sections/fleet";
import { HowItWorks } from "@/components/sections/how-it-works";
import { QuickBooking } from "@/components/sections/quick-booking";
import { ServiceHero } from "@/components/sections/service-hero";
import { ServiceCard } from "@/components/sections/services";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFaqs, getService, getServices, getSettings, getVehicles } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} in Dubai & the UAE`,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.shortDescription },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, services, vehicles, faqs, settings] = await Promise.all([
    getService(slug),
    getServices(),
    getVehicles(),
    getFaqs(),
    getSettings(),
  ]);
  if (!service) notFound();

  const others = services.filter((other) => other.slug !== service.slug).slice(0, 3);

  return (
    <>
      <ServiceHero
        service={{
          title: service.title,
          shortDescription: service.shortDescription,
          image: service.image,
          icon: service.icon,
          highlights: service.highlights,
          whatsappMessage: service.whatsappMessage,
        }}
      />

      <section className="relative bg-sand-50 py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-600 uppercase">About this service</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {service.title} with {settings.companyName}
            </h2>
            <div className="mt-6">
              {service.body && service.body.length > 0 ? (
                <RichText value={service.body} />
              ) : (
                <p className="text-lg leading-relaxed text-ink-700/80">{service.shortDescription}</p>
              )}
            </div>

            {service.highlights.length > 0 && (
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {service.highlights.map((highlight) => (
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
              services={services.map(({ title }) => ({ title }))}
              vehicles={vehicles.map(({ name, passengers }) => ({ name, passengers }))}
              defaultService={service.title}
              title={`Book ${service.title}`}
            />
          </Reveal>
        </div>
      </section>

      <Fleet
        vehicles={vehicles}
        eyebrow="Choose your vehicle"
        title="Pick the perfect ride for"
        highlight={service.title}
        description="From a sedan for two to a coach for fifty. Slide to your group size to see which vehicle fits best."
      />

      <HowItWorks />

      {others.length > 0 && (
        <section className="bg-sand-100 py-24 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="More services" title="You might also" highlight="need" />
            <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
              {others.map((other) => (
                <StaggerItem key={other._id} className="h-full">
                  <ServiceCard service={other} companyName={settings.companyName} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}
