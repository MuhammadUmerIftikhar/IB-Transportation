export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Fleet", href: "/#fleet" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Why us", href: "/#why-us" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];
