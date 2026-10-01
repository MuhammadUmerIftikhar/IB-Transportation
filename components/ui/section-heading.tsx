"use client";

import { motion } from "framer-motion";
import { easeOut } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  const words = title.split(" ");
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-display text-xs font-semibold tracking-[0.18em] uppercase ${
          dark ? "border-gold-400/30 bg-gold-400/10 text-gold-300" : "border-gold-500/30 bg-gold-400/15 text-gold-600"
        }`}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {eyebrow}
      </motion.p>

      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.06 }}
        className={`mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl ${
          dark ? "text-white" : "text-ink-900"
        }`}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.7, ease: easeOut } } }}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
        {highlight && (
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="text-gradient inline-block"
              variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.7, ease: easeOut } } }}
            >
              {highlight}
            </motion.span>
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeOut }}
          className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? "text-white/65" : "text-ink-700/75"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
