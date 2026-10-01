"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function parse(value: string) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  return match ? { prefix: match[1], target: Number(match[2]), suffix: match[3] } : null;
}

/** Counts up to numeric values (e.g. "50") when scrolled into view; other values (e.g. "24/7") are shown as-is. */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const parsed = parse(value);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const target = parse(value)?.target;
    if (!inView || target === undefined || reduceMotion) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {parsed && !reduceMotion ? `${parsed.prefix}${current}${parsed.suffix}` : value}
    </span>
  );
}
