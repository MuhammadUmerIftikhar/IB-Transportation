import type { PortableTextBlock } from "next-sanity";

/** An image that is either a file in /public (string path) or a Sanity image object. */
export type ImageAsset = string | SanityImage;

export interface SanityImage {
  _type?: "image";
  asset?: { _ref: string; _type?: "reference" };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
  lqip?: string;
}

export const ICON_NAMES = [
  "plane",
  "hotel",
  "family",
  "briefcase",
  "map",
  "users",
  "desert",
  "clock",
  "shield",
  "sparkles",
  "message",
  "car",
  "route",
  "smile",
  "star",
  "wallet",
] as const;
export type IconName = (typeof ICON_NAMES)[number];

export const VEHICLE_TYPES = [
  { title: "Sedan", value: "sedan" },
  { title: "SUV", value: "suv" },
  { title: "7 Seater", value: "seven-seater" },
  { title: "Van", value: "van" },
  { title: "Mini Van", value: "mini-van" },
  { title: "Bus", value: "bus" },
] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number]["value"];

export interface Stat {
  value: string;
  label: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email?: string;
  address: string;
  availability: string;
  heroBadge: string;
  heroTitle: string;
  heroRotatingWords: string[];
  heroSubtitle: string;
  heroImage: ImageAsset;
  stats: Stat[];
  whyChooseUs: Feature[];
  destinations: string[];
  socialLinks: SocialLinks;
  seoTitle: string;
  seoDescription: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  icon: IconName;
  shortDescription: string;
  image: ImageAsset;
  highlights: string[];
  body?: PortableTextBlock[];
  whatsappMessage?: string;
  _updatedAt?: string;
}

export interface Vehicle {
  _id: string;
  name: string;
  slug: string;
  type: VehicleType;
  tagline: string;
  passengers: number;
  luggage: number;
  models: string;
  description: string;
  features: string[];
  image?: ImageAsset;
  /** Which way the vehicle in the photo points; it drives in from behind. */
  facing?: "left" | "right";
}

/** A point-to-point transfer, e.g. "Dubai Airport (DXB) → Abu Dhabi". Each gets its own landing page. */
export interface TransferRoute {
  _id: string;
  slug: string;
  /** e.g. "Dubai Airport (DXB)" */
  from: string;
  /** e.g. "Abu Dhabi" */
  to: string;
  /** Approximate road distance in km */
  distanceKm: number;
  /** e.g. "1 hr 30 min – 1 hr 45 min" */
  duration: string;
  /** Unique intro paragraph for this route */
  summary: string;
  highlights: string[];
  image?: ImageAsset;
  _updatedAt?: string;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  rating: number;
}
