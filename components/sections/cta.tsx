"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Clock3, MapPinned, Phone } from "lucide-react";
import { useRef } from "react";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { useSite } from "../site-provider";
import { BookNowButton, CallButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { easeOut } from "../ui/reveal";
import { useLiteMotion } from "../ui/use-lite-motion";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

export function Cta() {
  const site = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.25, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.4], [80, 36]);
  const lite = useLiteMotion(); // no scroll-linked effects on phones

  const tiles = [
    { icon: Phone, title: "Call us", value: site.phone, href: telUrl(site.phone) },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      value: "Chat & book instantly",
      href: whatsappUrl(site.whatsappNumber, site.whatsappMessage),
      external: true,
    },
    { icon: Clock3, title: "Opening hours", value: site.availability },
    { icon: MapPinned, title: "Coverage", value: "All over the UAE" },
  ];

  return (
    <section id="contact" className="relative bg-sand-50 px-3 pb-24 sm:px-6 sm:pb-32">
      <motion.div
        ref={ref}
        style={{ borderRadius: lite ? 36 : radius }}
        className="relative isolate mx-auto max-w-7xl overflow-hidden bg-ink-950 px-6 py-20 text-white sm:px-12 sm:py-28"
      >
        <motion.div style={lite ? { scale: 1 } : { scale }} className="absolute inset-0 -z-20">
          <CmsImage image="/images/city-lights.jpg" alt="Dubai streets with light trails at night" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-ink-950/95 via-ink-950/80 to-ink-950/50" />
        <div aria-hidden className="anim-glow absolute -top-32 -right-20 -z-10 size-96 rounded-full bg-gold-500/30 opacity-50 blur-3xl" />

        <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: easeOut }}
          >
            <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold-400 uppercase">Ready when you are</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
              Your ride is just <span className="text-gradient">one message</span> away
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              Tell us where and when — we&apos;ll handle the rest. Airport, hotel, office, tours or a big group: one WhatsApp message gets you
              moving.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <BookNowButton size="lg" label="Book Now on WhatsApp" />
              <CallButton size="lg" />
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {tiles.map((tile, i) => {
              const content = (
                <>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300 transition-all duration-500 ease-spring group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-ink-950">
                    <tile.icon className="size-5" />
                  </span>
                  <span className="mt-4 block text-sm text-white/55">{tile.title}</span>
                  <span className="mt-0.5 block font-display text-lg font-semibold">{tile.value}</span>
                </>
              );
              const className =
                "group block h-full rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md transition duration-500 ease-spring hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/10";
              return (
                <motion.div
                  key={tile.title}
                  initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: easeOut }}
                >
                  {tile.href ? (
                    <a href={tile.href} className={className} {...(tile.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {content}
                    </a>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
