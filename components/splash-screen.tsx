"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";
import { LogoMark } from "./logo";
import { easeOut } from "./ui/reveal";

const SplashContext = createContext(true);

/** True once the splash screen has finished (always true where there is no splash). */
export function useSplashDone() {
  return useContext(SplashContext);
}

const SEEN_KEY = "ib-splash-seen";
const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function pageLoaded() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Full-screen intro: logo inside a ring that fills 0 → 100% while the page loads,
 * then the overlay opens with a circular reveal. Repeat visits in the same session
 * get a short version.
 */
export function SplashProvider({ companyName, children }: { companyName: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v)}`);
  const dashOffset = useTransform(progress, (v) => CIRCUMFERENCE * (1 - v / 100));
  const orbit = useTransform(progress, (v) => v * 3.6);

  useEffect(() => {
    let cancelled = false;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage blocked: treat as first visit
    }
    const fast = seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.overflow = "hidden";

    (async () => {
      // Climb to 90% over a minimum time, wait for the real page load, then finish.
      await animate(progress, 90, { duration: fast ? 0.35 : 1.6, ease: [0.4, 0, 0.2, 1] });
      await pageLoaded();
      await animate(progress, 100, { duration: fast ? 0.15 : 0.45, ease: "easeOut" });
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, fast ? 80 : 350));
      if (cancelled) return;
      // Flag "done" as the reveal starts (the overlay still covers everything), so the
      // hero re-mounts before anyone can type into its form and plays in as the circle opens.
      setDone(true);
      setVisible(false);
    })();

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = "";
    };
  }, [progress]);

  const letters = companyName.toUpperCase().split("");

  return (
    <SplashContext.Provider value={done}>
      {/* Without JavaScript the splash could never finish, so hide it entirely. */}
      <noscript>
        <style>{`#splash{display:none!important}`}</style>
      </noscript>

      <AnimatePresence
        onExitComplete={() => {
          document.documentElement.style.overflow = "";
        }}
      >
        {visible && (
          <motion.div
            id="splash"
            role="status"
            aria-live="polite"
            aria-label={`Loading ${companyName}`}
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink-950 text-white"
          >
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]" />
            <motion.div
              aria-hidden
              animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute size-[34rem] rounded-full bg-blue-600/20 blur-[110px]"
            />
            <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-[24rem] -translate-x-1/3 rounded-full bg-gold-500/10 blur-[100px]" />

            <motion.div
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="relative flex flex-col items-center"
            >
              {/* progress ring with the logo inside */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative size-52 sm:size-60"
              >
                <svg viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90" aria-hidden>
                  <defs>
                    <linearGradient id="splash-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#60a5fa" />
                      <stop offset="0.55" stopColor="#ffc53d" />
                      <stop offset="1" stopColor="#ff6a3d" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="6" />
                  <circle cx="100" cy="100" r={RADIUS - 12} fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="1" strokeDasharray="2 6" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    stroke="url(#splash-ring)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    style={{ strokeDashoffset: dashOffset }}
                  />
                </svg>

                {/* glowing dot riding the tip of the ring */}
                <motion.div aria-hidden style={{ rotate: orbit }} className="absolute inset-0">
                  <span className="absolute top-[4%] left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_18px_6px_rgba(255,197,61,0.7)]" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <LogoMark priority className="h-24 w-auto drop-shadow-[0_8px_28px_rgba(37,99,235,0.6)] sm:h-28" />
                </motion.div>
              </motion.div>

              {/* percentage */}
              <p className="mt-7 font-display text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
                <motion.span>{percent}</motion.span>
                <span className="text-gradient">%</span>
              </p>

              {/* company name */}
              <p className="mt-4 flex font-display text-lg font-bold tracking-[0.35em] sm:text-2xl" aria-hidden>
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.25 + i * 0.04, duration: 0.5, ease: easeOut }}
                    className={i < 2 ? "text-gold-300" : ""}
                  >
                    {letter === " " ? " " : letter}
                  </motion.span>
                ))}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-3 text-xs tracking-[0.3em] text-white/45 uppercase sm:text-sm"
              >
                Airport · Hotels · Tours · Groups
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </SplashContext.Provider>
  );
}
