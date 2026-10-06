import { getFaqs, getRoutes, getServices, getSettings, getVehicles } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;

/**
 * /llms.txt — a plain-text fact sheet for AI assistants (ChatGPT, Claude, Perplexity, Gemini…),
 * following the llmstxt.org convention. Generated from Sanity, so it stays current automatically.
 */
export async function GET() {
  const [settings, services, vehicles, routes, faqs] = await Promise.all([
    getSettings(),
    getServices(),
    getVehicles(),
    getRoutes(),
    getFaqs(),
  ]);

  const lines = [
    `# ${settings.companyName}`,
    "",
    `> ${settings.companyName} is a private transport company based in ${settings.address}, providing airport transfers, hotel pick & drop, family and group tours, office staff transport, UAE tours and desert safari transport across all seven emirates. ${settings.availability}. Bookings are made on WhatsApp.`,
    "",
    "## Key facts",
    `- Phone / WhatsApp: ${settings.phone} (https://wa.me/${settings.whatsappNumber})`,
    `- Availability: ${settings.availability} (24 hours a day, 7 days a week)`,
    "- Coverage: all UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain — and all major airports (DXB, DWC, AUH, SHJ)",
    `- Fleet: ${vehicles.map((v) => `${v.name} (up to ${v.passengers} passengers)`).join(", ")}`,
    `- Website: ${siteUrl}`,
    "",
    "## Key pages",
    `- [About ${settings.companyName}](${siteUrl}/about)`,
    `- [Services](${siteUrl}/services)`,
    `- [Fleet](${siteUrl}/fleet)`,
    `- [Transfer routes](${siteUrl}/transfers)`,
    `- [FAQ](${siteUrl}/faq)`,
    `- [Contact](${siteUrl}/contact)`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${siteUrl}/services/${s.slug}): ${s.shortDescription}`),
    "",
    "## Vehicles",
    ...vehicles.map(
      (v) => `- ${v.name} — up to ${v.passengers} passengers and ${v.luggage} large bags. ${v.models}. ${v.description}`,
    ),
    "",
    "## Popular transfer routes",
    ...routes.map(
      (r) => `- [${r.from} to ${r.to}](${siteUrl}/transfers/${r.slug}): about ${r.distanceKm} km, ${r.duration} in normal traffic.`,
    ),
    "",
    "## Frequently asked questions",
    ...faqs.flatMap((f) => [`### ${f.question}`, f.answer, ""]),
    "## How to book",
    `Send pickup, drop-off, date, time and number of passengers on WhatsApp (${settings.phone}) or use the booking form at ${siteUrl}. Prices depend on distance, vehicle and trip type and are quoted on request.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
