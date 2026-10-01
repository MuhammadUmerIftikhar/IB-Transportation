"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Oversized company name that rises into view at the bottom of the page. */
export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="mt-16 overflow-hidden select-none" aria-hidden>
      <motion.p
        style={{ y, opacity }}
        className="text-center font-display text-[min(8.4vw,6.6rem)] leading-[0.9] font-extrabold tracking-tighter whitespace-nowrap text-transparent uppercase"
      >
        <span className="bg-linear-to-b from-white/25 to-white/0 bg-clip-text">{text}</span>
      </motion.p>
    </div>
  );
}
