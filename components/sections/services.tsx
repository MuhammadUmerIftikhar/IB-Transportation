import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { serviceMessage } from "@/lib/contact";
import type { Service } from "@/lib/types";
import { BookNowButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { Icon } from "../ui/icon";
import { Stagger, StaggerItem } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";
import { TiltCard } from "../ui/tilt-card";

/** Bento layout pattern, repeated if there are more services. */
const spans = ["md:col-span-2 lg:row-span-2", "", "", "", "", "lg:col-span-2", "lg:col-span-2"];

export function ServiceCard({ service, companyName, large = false }: { service: Service; companyName: string; large?: boolean }) {
  return (
    <TiltCard max={large ? 4 : 7} className="h-full rounded-[28px]">
      <article className={`relative isolate flex h-full ${large ? "min-h-[460px] sm:min-h-[420px]" : "min-h-[300px]"} flex-col justify-end overflow-hidden rounded-[28px] bg-ink-900 p-6 text-white shadow-soft sm:p-7`}>
        <CmsImage
          image={service.image}
          alt={service.title}
          fill
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
          className="-z-20 object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-110"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/5 transition-colors duration-500" />
        <div className="absolute inset-0 -z-10 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/25" />

        <span className="absolute top-6 left-6 flex size-12 items-center justify-center rounded-2xl bg-white/15 text-gold-300 ring-1 ring-white/20 backdrop-blur-md transition-all duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-ink-950">
          <Icon name={service.icon} className="size-6" />
        </span>

        <Link
          href={`/services/${service.slug}`}
          aria-label={`Learn more about ${service.title}`}
          className="absolute top-6 right-6 flex size-11 items-center justify-center rounded-full bg-white text-ink-950 opacity-0 transition-all duration-500 ease-spring group-hover:rotate-45 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </Link>

        <h3 className={`font-display font-bold tracking-tight ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
          <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 after:-z-[5]">
            {service.title}
          </Link>
        </h3>
        <p className={`mt-2 text-white/75 ${large ? "max-w-md text-base" : "text-sm"}`}>{service.shortDescription}</p>

        {large && service.highlights.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.highlights.slice(0, 4).map((highlight) => (
              <li key={highlight} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-5 flex items-center gap-3">
          <BookNowButton
            size="sm"
            magnetic={false}
            message={service.whatsappMessage || serviceMessage(companyName, service.title)}
          />
        </div>
      </article>
    </TiltCard>
  );
}

export function Services({ services, companyName }: { services: Service[]; companyName: string }) {
  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute top-0 right-0 size-[40rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-gold-400/15 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="What we do"
          title="Every ride, covered"
          highlight="across the UAE"
          description="Airport runs at 3 AM, daily office commutes, family days out or a 50-person group tour — pick a service and book it on WhatsApp in seconds."
        />

        <Stagger className="mt-16 grid auto-rows-[minmax(300px,auto)] grid-flow-row-dense gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {services.map((service, i) => (
            <StaggerItem key={service._id} className={spans[i % spans.length]}>
              <ServiceCard service={service} companyName={companyName} large={i % spans.length === 0} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
