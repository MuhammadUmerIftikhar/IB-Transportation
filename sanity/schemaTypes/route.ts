import { MapPinned } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const route = defineType({
  name: "route",
  title: "Transfer route",
  type: "document",
  icon: MapPinned,
  description:
    "Each route gets its own page at /transfers/<slug> (e.g. “Dubai Airport to Abu Dhabi Transfer”), is added to the sitemap and announced to search engines automatically.",
  fields: [
    defineField({
      name: "from",
      description: "e.g. Dubai Airport (DXB)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to",
      description: "e.g. Abu Dhabi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      description: "Page address — generate from the title, e.g. dubai-airport-to-abu-dhabi",
      type: "slug",
      options: {
        source: (doc) => `${(doc.from as string) ?? ""} to ${(doc.to as string) ?? ""}`.replace(/\([^)]*\)/g, ""),
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "distanceKm",
      title: "Distance (km, approx.)",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "duration",
      title: "Travel time",
      description: "In normal traffic, e.g. 1 hr 30 min – 1 hr 45 min",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      description:
        "2–3 sentences unique to this route (what's there, which road, who it suits). Unique text is what lets the page rank — don't copy between routes.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(120).max(600),
    }),
    defineField({
      name: "highlights",
      description: "Short route-specific points (3 work best)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "order",
      description: "Lower numbers are shown first",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { from: "from", to: "to", km: "distanceKm", media: "image" },
    prepare: ({ from, to, km, media }) => ({ title: `${from} → ${to}`, subtitle: km ? `~${km} km` : undefined, media }),
  },
});
