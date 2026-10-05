/**
 * Public address of the live site — used for canonical URLs, the sitemap, robots.txt,
 * social previews and structured data. Override with NEXT_PUBLIC_SITE_URL if the domain changes.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ib-transportation.com").replace(/\/$/, "");

/**
 * Full Open Graph block for a page. Next.js replaces (doesn't merge) a parent's `openGraph`,
 * so every page that sets its own must include all fields. The image comes from
 * app/opengraph-image.tsx automatically.
 */
export function openGraphFor({ title, description, path, siteName }: { title: string; description: string; path: string; siteName: string }) {
  return {
    type: "website" as const,
    siteName,
    locale: "en_AE",
    title,
    description,
    url: path,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  };
}

export const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Fleet", href: "/#fleet" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Why us", href: "/#why-us" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];
