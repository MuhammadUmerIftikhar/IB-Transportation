"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { serviceMessage } from "@/lib/contact";
import type { Service } from "@/lib/types";
import { useSplashDone } from "../splash-screen";
import { useSite } from "../site-provider";
import { BookNowButton, CallButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { Icon } from "../ui/icon";
import { easeOut } from "../ui/reveal";
import { useLiteMotion } from "../ui/use-lite-motion";

export function ServiceHero({ service }: { service: Pick<Service, "title" | "shortDescription" | "image" | "icon" | "highlights" | "whatsappMessage"> }) {
  const site = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const words = service.title.split(" ");
  const splashDone = useSplashDone();
  const lite = useLiteMotion(); // no scroll-linked parallax on phones

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink-950 pt-40 pb-24 text-white sm:pt-48 sm:pb-32">
      <motion.div style={lite ? { y: 0, scale: 1.05 } : { y, scale }} className="absolute inset-0 -z-20">
        <CmsImage image={service.image} alt={service.title} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-transparent to-ink-950/40" />
      <div aria-hidden className="anim-blob-b absolute top-20 -left-20 -z-10 size-96 rounded-full bg-gold-500/25 blur-[100px]" />

      {/* Re-mounts when the splash screen finishes so the entrance animations play in view */}
      <div key={splashDone ? "ready" : "intro"} className="container-x">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 text-sm text-white/60"
        >
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-4" aria-hidden />
          <Link href="/services" className="hover:text-white">
            Services
          </Link>
          <ChevronRight className="size-4" aria-hidden />
          <span className="text-gold-300">{service.title}</span>
        </motion.nav>

        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
          className="bg-brand-gradient mt-8 flex size-16 items-center justify-center rounded-2xl text-ink-950 shadow-glow-gold"
        >
          <Icon name={service.icon} className="size-8" />
        </motion.span>

        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-7xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={`inline-block ${i === words.length - 1 ? "text-gradient" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: easeOut }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: easeOut }}
          className="mt-6 max-w-2xl text-xl leading-relaxed text-white/75"
        >
          {service.shortDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: easeOut }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <BookNowButton size="lg" label={`Book ${service.title}`} message={service.whatsappMessage || serviceMessage(site.companyName, service.title)} />
          <CallButton size="lg" />
        </motion.div>

        {service.highlights.length > 0 && (
          <motion.ul
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08, delayChildren: 0.85 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {service.highlights.map((highlight) => (
              <motion.li
                key={highlight}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md"
              >
                {highlight}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
