import type { MetadataRoute } from "next";
import { getRoutes, getServices } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/**
 * Generated from Sanity on every revalidation, so new services and transfer routes appear
 * automatically. `lastModified` comes from each document's last edit, which tells Google
 * which pages to re-crawl.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, routes] = await Promise.all([getServices(), getRoutes()]);
  const latest = (dates: (string | undefined)[]) =>
    dates.filter(Boolean).sort().at(-1) ?? new Date().toISOString();

  return [
    { url: siteUrl, lastModified: latest([...services, ...routes].map((d) => d._updatedAt)), changeFrequency: "weekly", priority: 1 },
    ...[
      { path: "/services", priority: 0.9 },
      { path: "/fleet", priority: 0.8 },
      { path: "/about", priority: 0.7 },
      { path: "/contact", priority: 0.7 },
      { path: "/faq", priority: 0.6 },
    ].map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: latest(services.map((d) => d._updatedAt)),
      changeFrequency: "monthly" as const,
      priority,
    })),
    {
      url: `${siteUrl}/transfers`,
      lastModified: latest(routes.map((r) => r._updatedAt)),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: service._updatedAt ?? new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...routes.map((route) => ({
      url: `${siteUrl}/transfers/${route.slug}`,
      lastModified: route._updatedAt ?? new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
