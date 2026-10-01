import { CarFront } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { VEHICLE_TYPES } from "../../lib/types";

export const vehicle = defineType({
  name: "vehicle",
  title: "Vehicle",
  type: "document",
  icon: CarFront,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      description: "Picks the illustration shown when no photo is uploaded",
      type: "string",
      options: { list: [...VEHICLE_TYPES], layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      description: "e.g. Families & small groups",
      type: "string",
    }),
    defineField({
      name: "passengers",
      title: "Max passengers",
      type: "number",
      validation: (rule) => rule.required().min(1).integer(),
    }),
    defineField({
      name: "luggage",
      title: "Large bags",
      type: "number",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "models",
      description: "e.g. Toyota Camry, Hyundai Sonata or similar",
      type: "string",
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "features",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "image",
      title: "Photo",
      description:
        "Optional. A side view on a plain or transparent background looks best. Leave empty to use the built-in illustration.",
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
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", passengers: "passengers", models: "models", media: "image" },
    prepare: ({ title, passengers, models, media }) => ({
      title,
      subtitle: [passengers && `Up to ${passengers} passengers`, models].filter(Boolean).join(" · "),
      media,
    }),
  },
});
