import { MessageSquareQuote } from "lucide-react";
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Customer review",
  type: "document",
  icon: MessageSquareQuote,
  description: "Real reviews from your customers. The reviews section appears once you add one.",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "location", description: "e.g. London, UK", type: "string" }),
    defineField({
      name: "quote",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "order",
      description: "Lower numbers are shown first",
      type: "number",
      initialValue: 10,
    }),
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});
