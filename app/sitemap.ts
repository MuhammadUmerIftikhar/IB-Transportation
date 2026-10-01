import type { MetadataRoute } from "next";
import { getServices } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
