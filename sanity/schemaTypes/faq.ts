import { CircleHelp } from "lucide-react";
import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: CircleHelp,
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
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
  preview: { select: { title: "question", subtitle: "answer" } },
});
