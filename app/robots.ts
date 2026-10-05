import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Everything public is open to search engines and AI assistants (Googlebot powers AI Overviews;
 * Bingbot feeds Copilot and ChatGPT search; GPTBot, ClaudeBot, PerplexityBot etc. read the site
 * directly). Only the CMS and API are excluded.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
