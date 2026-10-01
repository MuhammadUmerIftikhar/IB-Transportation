import "server-only";
import { cache } from "react";
import { client } from "@/sanity/lib/client";
import {
  faqsQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
  vehiclesQuery,
} from "@/sanity/lib/queries";
import {
  fallbackFaqs,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
  fallbackVehicles,
} from "./fallback";
import type { Faq, Service, SiteSettings, Testimonial, Vehicle } from "./types";

/** How often (seconds) published Sanity content is picked up without a webhook. */
export const REVALIDATE_SECONDS = 60;

async function sanityFetch<T>(query: string, tags: string[]): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, {}, { next: { revalidate: REVALIDATE_SECONDS, tags } });
  } catch (error) {
    console.error(`[sanity] query failed (${tags.join(", ")}), using default content`, error);
    return null;
  }
}

/** Drop null/empty values so each missing field falls back individually. */
function compact<T extends object>(value: T | null): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0),
    ),
  ) as Partial<T>;
}

function orFallback<T>(items: T[] | null, fallback: T[]): T[] {
  return items && items.length > 0 ? items : fallback;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const data = await sanityFetch<SiteSettings>(settingsQuery, ["siteSettings"]);
  const merged = { ...fallbackSettings, ...compact(data) };
  merged.socialLinks = { ...fallbackSettings.socialLinks, ...compact(data?.socialLinks ?? null) };
  return merged;
});

export const getServices = cache(async (): Promise<Service[]> => {
  const data = await sanityFetch<Service[]>(servicesQuery, ["service"]);
  return orFallback(data, fallbackServices).map((service) => ({
    ...service,
    highlights: service.highlights ?? [],
    image: service.image ?? "/images/hero.jpg",
  }));
});

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
});

export const getVehicles = cache(async (): Promise<Vehicle[]> => {
  const data = await sanityFetch<Vehicle[]>(vehiclesQuery, ["vehicle"]);
  return orFallback(data, fallbackVehicles).map((vehicle) => ({
    ...vehicle,
    features: vehicle.features ?? [],
  }));
});

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const data = await sanityFetch<Faq[]>(faqsQuery, ["faq"]);
  return orFallback(data, fallbackFaqs);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const data = await sanityFetch<Testimonial[]>(testimonialsQuery, ["testimonial"]);
  return orFallback(data, fallbackTestimonials);
});
