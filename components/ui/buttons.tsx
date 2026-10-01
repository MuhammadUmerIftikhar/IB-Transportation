"use client";

import { Phone } from "lucide-react";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { useSite } from "../site-provider";
import { Magnetic } from "./magnetic";
import { WhatsAppIcon } from "./whatsapp-icon";

type Variant = "gold" | "whatsapp" | "glass" | "dark" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  gold: "bg-brand-gradient text-ink-950 shadow-glow-gold hover:shadow-glow-sunset",
  whatsapp: "bg-whatsapp text-ink-950 shadow-glow-green",
  glass: "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
  dark: "bg-ink-900 text-white shadow-soft hover:bg-ink-800",
  outline: "border border-ink-900/15 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-10 gap-2 px-4 text-sm",
  md: "h-12 gap-2.5 px-6 text-[15px]",
  lg: "h-14 gap-3 px-7 text-base",
};

function classes(variant: Variant, size: Size, className: string) {
  return `group relative inline-flex items-center justify-center overflow-hidden rounded-full font-display font-semibold tracking-tight whitespace-nowrap transition-[background-color,box-shadow,color,border-color] duration-300 active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`;
}

function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-[300%] group-hover:opacity-100"
    />
  );
}

interface ButtonProps {
  label?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  icon?: boolean;
}

/** Opens a WhatsApp chat with the company number, optionally with a pre-filled message. */
export function BookNowButton({
  message,
  label = "Book Now",
  variant = "gold",
  size = "md",
  className = "",
  magnetic = true,
  icon = true,
}: ButtonProps & { message?: string }) {
  const site = useSite();
  const link = (
    <a
      href={whatsappUrl(site.whatsappNumber, message ?? site.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={classes(variant, size, className)}
      aria-label={`${label} on WhatsApp`}
    >
      <Shine />
      {icon && <WhatsAppIcon className={size === "sm" ? "size-4" : "size-5"} />}
      <span className="relative">{label}</span>
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

export function CallButton({
  label,
  variant = "glass",
  size = "md",
  className = "",
  magnetic = true,
  icon = true,
}: ButtonProps) {
  const site = useSite();
  const link = (
    <a href={telUrl(site.phone)} className={classes(variant, size, className)}>
      <Shine />
      {icon && <Phone className={size === "sm" ? "size-4" : "size-[18px]"} aria-hidden />}
      <span className="relative">{label ?? site.phone}</span>
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
