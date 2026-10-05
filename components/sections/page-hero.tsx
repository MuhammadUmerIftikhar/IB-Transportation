"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { ImageAsset } from "@/lib/types";
import { useSplashDone } from "../splash-screen";
import { BookNowButton, CallButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { easeOut } from "../ui/reveal";
import { useLiteMotion } from "../ui/use-lite-motion";

/** Hero for landing pages (transfer routes, route hub): breadcrumb, H1, intro, CTAs and a facts strip. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  facts = [],
  bookLabel = "Book Now on WhatsApp",
  bookMessage,
}: {
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  intro: string;
  image: ImageAsset;
  imageAlt: string;
  facts?: { label: string; value: string }[];
  bookLabel?: string;
  bookMessage?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const splashDone = useSplashDone();
  const lite = useLiteMotion();
  const words = title.split(" ");
  // highlight the destination ("… to Abu Dhabi Transfer"), or the last word if there's no "to"
  const toIndex = words.lastIndexOf("to");
  const highlighted = (i: number) => (toIndex >= 0 ? i > toIndex : i === words.length - 1);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink-950 pt-40 pb-20 text-white sm:pt-48 sm:pb-24">
      <motion.div style={lite ? { y: 0, scale: 1.05 } : { y, scale: 1.05 }} className="absolute inset-0 -z-20">
        <CmsImage image={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/80 to-ink-950/35" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-transparent to-ink-950/40" />
      <div aria-hidden className="anim-blob-b absolute top-20 -left-20 -z-10 size-96 rounded-full bg-gold-500/20 blur-[100px]" />

      <div key={splashDone ? "ready" : "intro"} className="container-x">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-4" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gold-300" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 inline-flex rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5 font-display text-xs font-semibold tracking-[0.18em] text-gold-300 uppercase"
          >
            {eyebrow}
          </motion.p>
        )}

        <h1 className="mt-5 max-w-4xl font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={`inline-block ${highlighted(i) ? "text-gradient" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: easeOut }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: easeOut }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <BookNowButton size="lg" label={bookLabel} message={bookMessage} />
          <CallButton size="lg" />
        </motion.div>

        {facts.length > 0 && (
          <motion.dl
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08, delayChildren: 0.8 }}
            className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {facts.map((fact) => (
              <motion.div
                key={fact.label}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="mobile-solid rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-md"
              >
                <dt className="text-xs text-white/55">{fact.label}</dt>
                <dd className="mt-0.5 font-display text-lg font-bold">{fact.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        )}
      </div>
    </section>
  );
}
