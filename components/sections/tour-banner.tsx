"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sunset } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { serviceMessage } from "@/lib/contact";
import { useSite } from "../site-provider";
import { BookNowButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { easeOut } from "../ui/reveal";
import { useLiteMotion } from "../ui/use-lite-motion";

const chips = ["Hotel & home pickup", "Sunset dune drives", "Families & groups", "All 7 emirates"];

export function TourBanner({ exploreHref = "/#services" }: { exploreHref?: string }) {
  const site = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Image box is 140% of the section (-20% top & bottom); ±12% travel keeps it fully covered.
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"]);
  const lite = useLiteMotion(); // no scroll-linked parallax on phones

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink-950 py-28 text-white sm:py-40">
      <motion.div style={lite ? { y: 0 } : { y }} className="absolute -inset-y-[20%] inset-x-0 -z-20">
        <CmsImage image="/images/desert-safari.jpg" alt="4x4 driving over golden sand dunes" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950/90 via-ink-950/55 to-ink-950/10" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950/70 to-transparent" />

      {/* giant drifting word */}
      <motion.p
        aria-hidden
        style={lite ? { x: "-6%" } : { x: textX }}
        className="pointer-events-none absolute bottom-0 left-0 -z-10 font-display text-[22vw] leading-none font-extrabold tracking-tighter whitespace-nowrap text-white/[0.05] uppercase"
      >
        Desert Safari · UAE Tours
      </motion.p>

      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="max-w-2xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-sunset-500/20 px-3.5 py-1.5 font-display text-xs font-semibold tracking-[0.18em] text-sunset-400 uppercase ring-1 ring-sunset-500/40">
            <Sunset className="size-4" aria-hidden /> Desert safari & tours
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Golden dunes, grand mosques &amp; <span className="text-gradient">every emirate</span> in between
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Plan a desert safari, a day trip to Abu Dhabi or a full UAE road trip. We pick you up, drive you there and bring you back
            — you just enjoy the views.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <motion.li
                key={chip}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md"
              >
                {chip}
              </motion.li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <BookNowButton size="lg" label="Plan my safari" message={serviceMessage(site.companyName, "Desert Safari")} />
            <Link
              href={exploreHref}
              className="group inline-flex items-center gap-2 font-display font-semibold text-white/85 transition-colors hover:text-gold-300"
            >
              Explore UAE tours
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
