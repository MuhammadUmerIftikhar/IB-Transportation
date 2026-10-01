import { Settings } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { iconOptions } from "./iconOptions";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  groups: [
    { name: "contact", title: "Company & Contact", default: true },
    { name: "hero", title: "Hero" },
    { name: "content", title: "Home content" },
    { name: "seo", title: "SEO & Social" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", type: "string", group: "contact" }),
    defineField({
      name: "phone",
      title: "Phone number (display)",
      description: "Shown on the website and used for call buttons, e.g. +971 55 745 8352",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description:
        "Digits only with country code, no + or spaces — e.g. 971557458352. Every “Book Now” button opens a chat with this number.",
      type: "string",
      group: "contact",
      validation: (rule) =>
        rule.required().regex(/^\d{8,15}$/, { name: "digits only with country code" }),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Default WhatsApp message",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({ name: "address", type: "string", group: "contact" }),
    defineField({
      name: "availability",
      description: "e.g. Available 24/7",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "facebook", type: "url" }),
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),

    defineField({ name: "heroBadge", title: "Badge", type: "string", group: "hero" }),
    defineField({
      name: "heroTitle",
      title: "Headline",
      description: "Shown before the rotating words, e.g. “Your trusted ride for”",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroRotatingWords",
      title: "Rotating words",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heroImage",
      title: "Background image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),

    defineField({
      name: "stats",
      title: "Stats band",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", description: "e.g. 24/7 or 50", type: "string" }),
            defineField({ name: "label", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "whyChooseUs",
      title: "Why choose us",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "icon",
              type: "string",
              options: { list: iconOptions },
              initialValue: "sparkles",
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "destinations",
      title: "Destinations ticker",
      description: "Places shown in the scrolling strip under the hero",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
    }),

    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
