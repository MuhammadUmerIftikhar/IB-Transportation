"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Feature, Stat } from "@/lib/types";
import { CmsImage } from "../ui/cms-image";
import { CountUp } from "../ui/count-up";
import { Icon } from "../ui/icon";
import { easeOut, Stagger, StaggerItem } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";

function RotatingBadge({ text }: { text: string }) {
  return (
    <div className="relative size-32 sm:size-36">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <defs>
          <path id="badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text className="fill-ink-950 font-display text-[9px] font-bold uppercase">
          {/* textLength stretches the text to exactly one lap of the circle (2π × 38 ≈ 238) */}
          <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-ink-950 font-display text-lg font-extrabold text-gold-300">
        24/7
      </span>
    </div>
  );
}

export function WhyUs({ features, stats }: { features: Feature[]; stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="why-us" className="relative overflow-hidden bg-sand-100 py-24 sm:py-32">
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[36rem] rounded-full bg-gold-400/20 blur-3xl" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        {/* collage */}
        <div ref={ref} className="relative mx-auto w-full max-w-lg pb-16 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeOut }}
            className="relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-lift"
          >
            <motion.div style={{ y: bigY }} className="absolute -inset-[8%]">
              <CmsImage image="/images/chauffeur.jpg" alt="Professional driver at the wheel" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-ink-950/50 to-transparent" />
          </motion.div>

          <motion.div
            style={{ y: smallY }}
            className="absolute -right-4 bottom-0 w-[55%] overflow-hidden rounded-[28px] border-[6px] border-sand-100 shadow-lift sm:-right-10"
          >
            <div className="relative aspect-[4/3]">
              <CmsImage image="/images/night-drive.jpg" alt="Car driving through Dubai at night" fill sizes="30vw" className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
            className="bg-brand-gradient absolute -top-6 left-0 rounded-full p-1 shadow-glow-gold sm:-left-10"
          >
            <RotatingBadge text="Available 24/7 • All over the UAE • " />
          </motion.div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Why choose us"
            title="Travel the UAE"
            highlight="the easy way"
            description="Whether it's a quick hotel drop or a week of group tours, we keep things simple, comfortable and reliable."
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.08}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group h-full rounded-3xl border border-ink-900/5 bg-white p-5 shadow-soft transition duration-500 ease-spring hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-900 text-gold-300 transition-all duration-500 ease-spring group-hover:rotate-[-10deg] group-hover:bg-brand-gradient group-hover:text-ink-950">
                    <Icon name={feature.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{feature.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-700/70">{feature.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="container-x relative mt-20">
          <div className="grid grid-cols-2 overflow-hidden rounded-[32px] bg-ink-950 text-white shadow-lift lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: easeOut }}
                className="relative border-white/10 px-6 py-9 text-center not-last:border-r max-lg:nth-2:border-r-0 max-lg:nth-[-n+2]:border-b sm:py-11"
              >
                <p className="text-gradient font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
