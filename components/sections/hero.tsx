"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { CarFront, Clock3, MapPinned, MessageCircleMore } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { useSplashDone } from "../splash-screen";
import { useLiteMotion } from "../ui/use-lite-motion";
import { BookNowButton, CallButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { easeOut } from "../ui/reveal";
import { type BookingOptions, QuickBooking } from "./quick-booking";

type HeroSettings = Pick<SiteSettings, "companyName" | "heroBadge" | "heroTitle" | "heroRotatingWords" | "heroSubtitle" | "heroImage" | "availability">;

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (words.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="relative block h-[1.15em] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: easeOut }}
          className="text-gradient absolute inset-x-0 top-0 block whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const trust = [
  { icon: Clock3, label: "24/7 pickups" },
  { icon: MapPinned, label: "All 7 emirates" },
  { icon: CarFront, label: "Sedan to 50-seat bus" },
];

export function Hero({ settings, booking }: { settings: HeroSettings; booking: BookingOptions }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const words = settings.heroTitle.split(" ");
  const splashDone = useSplashDone();
  const lite = useLiteMotion(); // no scroll-linked parallax on phones

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* background photo with parallax */}
      <motion.div style={lite ? { y: 0, scale: 1.08 } : { y: imageY, scale: imageScale }} className="absolute inset-0 -z-20">
        <CmsImage
          image={settings.heroImage}
          alt="Dubai skyline with the Burj Khalifa above a busy highway interchange"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_62%]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950/95 via-ink-950/65 to-ink-950/10" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-transparent to-ink-950/50" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]" />

      {/* glowing blobs */}
      <div
        aria-hidden
        className="anim-blob-a absolute top-24 -left-32 -z-10 size-[28rem] rounded-full bg-gold-500/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="anim-blob-b absolute -right-24 bottom-0 -z-10 size-[26rem] rounded-full bg-sunset-500/20 blur-[120px]"
      />

      {/* Re-mounts when the splash screen finishes so the entrance animations play in view */}
      <div key={splashDone ? "ready" : "intro"} className="container-x relative grid min-h-[100svh] items-center gap-12 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-36">
        <motion.div style={lite ? { y: 0 } : { y: contentY }}>
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-1.5 pr-4 pl-2 text-sm font-medium text-white/90 backdrop-blur-md"
          >
            <span className="relative flex size-5 items-center justify-center rounded-full bg-whatsapp/20">
              <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40" />
              <span className="size-2 rounded-full bg-whatsapp" />
            </span>
            {settings.heroBadge}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.2rem,9vw,2.75rem)] leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-[3.6rem] xl:text-[4.1rem]">
            {/* Brand name inside the H1: helps the site rank for a search of the company name itself */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: easeOut }}
              className="mb-3 block font-display text-base font-bold tracking-[0.22em] text-gold-300 uppercase sm:text-lg"
            >
              {settings.companyName}
              <span className="sr-only">: </span>
            </motion.span>
            <span className="block">
              {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: easeOut }}
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              ))}
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="block"
            >
              <RotatingWord words={settings.heroRotatingWords} />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: easeOut }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/75"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: easeOut }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <BookNowButton size="lg" label="Book Now on WhatsApp" />
            <CallButton size="lg" />
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1, delayChildren: 1.05 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {trust.map(({ icon: TrustIcon, label }) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 text-sm font-medium text-white/80"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                  <TrustIcon className="size-4" aria-hidden />
                </span>
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 12, rotateZ: -2 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: easeOut }}
          style={{ transformPerspective: 1200 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-[36px] bg-brand-gradient opacity-30 blur-2xl" />
          <QuickBooking {...booking} />

          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
            className="absolute -top-5 left-6 hidden animate-float items-center gap-2 rounded-full border border-white/15 bg-ink-900/90 py-1.5 pr-4 pl-1.5 shadow-lift backdrop-blur-xl sm:flex"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-whatsapp text-ink-950">
              <MessageCircleMore className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold">
              Instant booking <span className="font-normal text-white/60">· straight to WhatsApp</span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.25em] text-white/50 uppercase lg:flex"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <span className="anim-scroll-dot size-1.5 rounded-full bg-gold-400" />
        </span>
        Scroll
      </motion.a>
    </section>
  );
}
