import { Route } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { iconOptions } from "./iconOptions";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: Route,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      description: "Page address, e.g. airport-transfer → /services/airport-transfer",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      type: "string",
      options: { list: iconOptions },
      initialValue: "car",
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "Shown on the service card",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "highlights",
      description: "Short bullet points (3–5 work best)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "body",
      title: "Page content",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "whatsappMessage",
      title: "Custom WhatsApp message",
      description: "Optional — pre-filled text when someone taps “Book Now” for this service",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      description: "Lower numbers are shown first",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "shortDescription", media: "image" } },
});
