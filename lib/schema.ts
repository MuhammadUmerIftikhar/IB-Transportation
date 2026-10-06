/**
 * schema.org structured data (JSON-LD). This is how Google — including AI Overviews — and
 * other AI search engines understand who the business is, what it offers and where.
 * Every page links back to the same business entity via its @id.
 */
import { toDigits } from "./contact";
import { siteUrl } from "./site";
import type { Faq, Service, SiteSettings, TransferRoute, Vehicle } from "./types";

export const ids = {
  organization: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
  business: `${siteUrl}/#business`,
};

const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

/** Other ways people write the brand; helps Google connect them to this business. */
const alternateNames = (name: string) => [`${name} Dubai`, `${name} UAE`, name.replace(/\s+/g, "")];

const abs = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

/** Site-wide graph: Organization + WebSite + LocalBusiness (with services & fleet). */
export function siteSchema(settings: SiteSettings, services: Service[], vehicles: Vehicle[]) {
  const phone = `+${toDigits(settings.phone)}`;
  const logo = abs("/images/ib-logo.png");
  const sameAs = Object.values(settings.socialLinks).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: settings.companyName,
        alternateName: alternateNames(settings.companyName),
        description: settings.seoDescription,
        url: siteUrl,
        logo,
        telephone: phone,
        ...(settings.email ? { email: settings.email } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phone,
          contactType: "reservations",
          areaServed: "AE",
          availableLanguage: ["English"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: siteUrl,
        name: settings.companyName,
        alternateName: [...alternateNames(settings.companyName), "ib-transportation.com"],
        description: settings.seoDescription,
        publisher: { "@id": ids.organization },
        inLanguage: "en",
      },
      {
        "@type": "LocalBusiness",
        "@id": ids.business,
        name: settings.companyName,
        alternateName: alternateNames(settings.companyName),
        ...(sameAs.length ? { sameAs } : {}),
        description: settings.seoDescription,
        slogan: settings.tagline,
        url: siteUrl,
        telephone: phone,
        ...(settings.email ? { email: settings.email } : {}),
        logo,
        image: [abs("/opengraph-image"), logo],
        parentOrganization: { "@id": ids.organization },
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressRegion: "Dubai", addressCountry: "AE" },
        areaServed: [
          { "@type": "Country", name: "United Arab Emirates" },
          ...emirates.map((name) => ({ "@type": "AdministrativeArea", name })),
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
        knowsAbout: [
          "Airport transfers",
          "Dubai airport transfer",
          "Hotel transfers",
          "Desert safari transport",
          "UAE tours",
          "Group transport",
          "Bus rental",
          "Van rental with driver",
          "Staff transport",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Transport services",
          itemListElement: [
            ...services.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service.title,
                description: service.shortDescription,
                url: abs(`/services/${service.slug}`),
              },
            })),
            ...vehicles.map((vehicle) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `${vehicle.name} with driver`,
                description: `${vehicle.description} Up to ${vehicle.passengers} passengers and ${vehicle.luggage} large bags. ${vehicle.models}.`,
              },
            })),
          ],
        },
      },
    ],
  };
}

export function serviceSchema(input: { name: string; description: string; path: string; serviceType: string; areaServed?: string[]; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(input.path)}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: abs(input.path),
    ...(input.image ? { image: abs(input.image) } : {}),
    provider: { "@id": ids.business },
    areaServed: (input.areaServed ?? ["United Arab Emirates"]).map((name) => ({ "@type": "Place", name })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: abs(input.path),
      availableLanguage: "English",
    },
  };
}

export function faqSchema(faqs: Pick<Faq, "question" | "answer">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

/** Route-specific questions answered with real data — shown on the page and marked up as FAQ. */
export function routeFaqs(route: TransferRoute, vehicles: Vehicle[]) {
  const biggest = [...vehicles].sort((a, b) => b.passengers - a.passengers)[0];
  const smallest = [...vehicles].sort((a, b) => a.passengers - b.passengers)[0];
  return [
    {
      question: `How long does it take from ${route.from} to ${route.to}?`,
      answer: `The drive from ${route.from} to ${route.to} is about ${route.distanceKm} km and usually takes ${route.duration} in normal traffic. Rush hours and weather can add time, so share your flight or pickup time when booking and we'll plan around it.`,
    },
    {
      question: `Is the ${route.from} to ${route.to} transfer available 24/7?`,
      answer: `Yes. We run ${route.from} to ${route.to} transfers around the clock, every day — including early-morning and late-night pickups.`,
    },
    {
      question: `Which vehicle should I book from ${route.from} to ${route.to}?`,
      answer: `It depends on your group and luggage: a ${smallest?.name ?? "sedan"} suits up to ${smallest?.passengers ?? 4} passengers, and for big groups our ${biggest?.name ?? "bus"} carries up to ${biggest?.passengers ?? 50}. Tell us how many people and bags you have and we'll recommend the best fit.`,
    },
    {
      question: `How do I book a transfer from ${route.from} to ${route.to}?`,
      answer: `Use the booking form on this page or tap “Book Now” — WhatsApp opens with your trip details filled in. Send the message and we'll confirm your ride and price.`,
    },
  ];
}
