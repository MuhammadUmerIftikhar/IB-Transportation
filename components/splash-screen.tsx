"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";
import { LogoMark } from "./logo";

const SplashContext = createContext(true);

/** True once the splash screen starts leaving (always true where there is no splash). */
export function useSplashDone() {
  return useContext(SplashContext);
}

const RADIUS = 92; // circumference 578.05 — matches .splash-ring in globals.css

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function pageLoaded() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Full-screen intro: logo inside a ring showing real loading progress (0 → 100%), then the
 * screen slides up. The percentage is driven by lib/splash.ts, which is inlined in the HTML
 * and tracks the page's actual resources from the first paint; the splash only leaves once
 * the browser reports the page fully loaded and the ring shows 100%.
 */
export function SplashProvider({ companyName, children }: { companyName: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  // "done" flips as the exit starts while the screen still covers the page, so the hero
  // re-mounts out of sight and animates in as the curtain lifts.
  const leave = () => {
    setDone(true);
    setVisible(false);
  };

  useEffect(() => {
    let cancelled = false;
    (window.__ibSplashReady ?? pageLoaded())
      .then(() => wait(250)) // let "100%" register
      .then(() => {
        if (cancelled) return;
        setDone(true);
        setVisible(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const letters = companyName.toUpperCase().split("");

  return (
    <SplashContext.Provider value={done}>
      {/* Without JavaScript the splash could never leave, so hide it entirely. */}
      <noscript>
        <style>{`#splash{display:none!important}`}</style>
      </noscript>

      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            id="splash"
            // lib/splash.ts updates this element's progress variables and data-slow/data-stuck
            // before React hydrates, so its attributes legitimately differ from the server HTML.
            suppressHydrationWarning
            role="status"
            aria-live="polite"
            aria-label={`Loading ${companyName}`}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
            className="splash fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink-950 text-white will-change-transform"
          >
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]" />
            <div aria-hidden className="pointer-events-none absolute size-[30rem] rounded-full bg-blue-600/20 blur-[100px]" />
            <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-[22rem] -translate-x-1/3 rounded-full bg-gold-500/10 blur-[90px]" />
            {/* curved gold edge that trails the curtain as it lifts */}
            <div aria-hidden className="bg-brand-gradient absolute inset-x-0 bottom-0 h-1" />

            <motion.div
              exit={{ opacity: 0, y: -24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="relative flex flex-col items-center"
            >
              <div className="splash-pop relative size-52 sm:size-60">
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
                  <circle
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    stroke="url(#splash-ring)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * RADIUS}
                    className="splash-ring"
                  />
                </svg>

                {/* glowing dot riding the tip of the ring */}
                <div aria-hidden className="splash-orbit absolute inset-0">
                  <span className="absolute top-[4%] left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_18px_6px_rgba(255,197,61,0.7)]" />
                </div>

                <div className="splash-float absolute inset-0 flex items-center justify-center">
                  <LogoMark priority className="h-24 w-auto drop-shadow-[0_8px_28px_rgba(37,99,235,0.6)] sm:h-28" />
                </div>
              </div>

              <p className="mt-7 font-display text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
                <span className="splash-count" />
                <span className="text-gradient">%</span>
              </p>

              <p className="mt-4 flex font-display text-lg font-bold tracking-[0.35em] sm:text-2xl" aria-hidden>
                {letters.map((letter, i) => (
                  <span
                    key={i}
                    style={{ animationDelay: `${250 + i * 40}ms` }}
                    className={`splash-letter ${i < 2 ? "text-gold-300" : ""}`}
                  >
                    {letter === " " ? " " : letter}
                  </span>
                ))}
              </p>
              <p className="splash-fade mt-3 text-xs tracking-[0.3em] text-white/45 uppercase sm:text-sm">
                Airport · Hotels · Tours · Groups
              </p>

              {/* shown by lib/splash.ts when loading stalls */}
              <p className="splash-slow mt-7 items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-sm text-gold-200">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold-400" />
                  <span className="relative size-2 rounded-full bg-gold-400" />
                </span>
                Slow connection — still loading…
              </p>
              <button
                type="button"
                onClick={leave}
                className="splash-continue mt-4 items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-gold-400 hover:text-white"
              >
                Continue to site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </SplashContext.Provider>
  );
}
