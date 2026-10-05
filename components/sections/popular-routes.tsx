import { ArrowRight, Clock3, Route as RouteIcon } from "lucide-react";
import Link from "next/link";
import type { TransferRoute } from "@/lib/types";
import { CmsImage } from "../ui/cms-image";
import { Stagger, StaggerItem } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";

/** "Dubai Airport (DXB)" → "Dubai Airport" */
export const placeName = (place: string) => place.replace(/\s*\(.*\)/, "");

export function routeTitle(route: Pick<TransferRoute, "from" | "to">) {
  return `${placeName(route.from)} to ${route.to} Transfer`;
}

export function RouteCard({ route }: { route: TransferRoute }) {
  return (
    <Link
      href={`/transfers/${route.slug}`}
      className="group relative isolate flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-[24px] bg-ink-900 p-5 text-white shadow-soft transition duration-500 ease-spring hover:-translate-y-1 hover:shadow-lift"
    >
      <CmsImage
        image={route.image ?? "/images/airport.jpg"}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="-z-20 object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-110"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/75 to-ink-950/20" />
      <p className="text-xs font-semibold tracking-[0.16em] text-gold-300 uppercase">{route.from}</p>
      <h3 className="mt-1 font-display text-xl leading-tight font-bold">
        {placeName(route.from)} → {route.to}
      </h3>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
        <span className="flex items-center gap-1.5">
          <RouteIcon className="size-4 text-gold-300" aria-hidden /> ~{route.distanceKm} km
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-4 text-gold-300" aria-hidden /> {route.duration}
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        View transfer <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

export function PopularRoutes({
  routes,
  eyebrow = "Popular transfers",
  title = "Where are you",
  highlight = "heading?",
  description = "Private transfers from every UAE airport to the city, hotels and other emirates — available 24/7.",
  limit = 6,
  showAllLink = true,
  className = "bg-sand-50",
}: {
  routes: TransferRoute[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  limit?: number;
  showAllLink?: boolean;
  className?: string;
}) {
  if (routes.length === 0) return null;
  return (
    <section className={`relative overflow-hidden py-24 sm:py-28 ${className}`}>
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={title} highlight={highlight} description={description} />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {routes.slice(0, limit).map((route) => (
            <StaggerItem key={route._id} className="h-full">
              <RouteCard route={route} />
            </StaggerItem>
          ))}
        </Stagger>
        {showAllLink && routes.length > limit && (
          <div className="mt-10 text-center">
            <Link
              href="/transfers"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-900/15 px-6 font-display font-semibold text-ink-900 transition hover:border-ink-900 hover:bg-ink-900 hover:text-white"
            >
              See all {routes.length} transfer routes <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
