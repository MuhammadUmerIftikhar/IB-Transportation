import { defineQuery } from "next-sanity";

const image = /* groq */ `{..., "lqip": asset->metadata.lqip}`;

export const settingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  companyName, tagline, phone, whatsappNumber, whatsappMessage, email, address, availability,
  heroBadge, heroTitle, heroRotatingWords, heroSubtitle, heroImage${image},
  stats[]{value, label},
  whyChooseUs[]{title, description, icon},
  destinations, socialLinks, seoTitle, seoDescription
}`);

export const servicesQuery = defineQuery(`*[_type == "service" && defined(slug.current)] | order(order asc, _createdAt asc){
  _id, title, "slug": slug.current, icon, shortDescription, image${image},
  highlights, body, whatsappMessage
}`);

export const vehiclesQuery = defineQuery(`*[_type == "vehicle"] | order(order asc, passengers asc){
  _id, name, "slug": slug.current, type, tagline, passengers, luggage, models,
  description, features, image${image}
}`);

export const faqsQuery = defineQuery(`*[_type == "faq"] | order(order asc, _createdAt asc){
  _id, question, answer
}`);

export const testimonialsQuery = defineQuery(`*[_type == "testimonial"] | order(order asc, _createdAt desc){
  _id, name, location, quote, rating
}`);
