"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Clock3, MapPin, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { navLinks } from "@/lib/site";
import { Logo } from "../logo";
import { useSite } from "../site-provider";
import { BookNowButton } from "../ui/buttons";
import { easeOut } from "../ui/reveal";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

const sectionIds = navLinks.map((link) => link.href.split("#")[1]);

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // The hero ("top") clears the highlight; sections without a nav link keep the last one.
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...sectionIds]) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

export function Navbar() {
  const site = useSite();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(pathname === "/");

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden((wasHidden) => (y > 500 && y > previous + 4 ? true : y < previous - 4 ? false : wasHidden));
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const highlighted = hovered ?? active;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !open ? -130 : 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* top info bar */}
        <motion.div
          animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="hidden overflow-hidden border-b border-white/10 bg-ink-950/40 text-xs text-white/75 backdrop-blur-sm lg:block"
        >
          <div className="container-x flex h-9 items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-75" />
                  <span className="relative size-2 rounded-full bg-whatsapp" />
                </span>
                {site.availability}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-gold-400" aria-hidden /> All over the UAE
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-gold-400" aria-hidden /> Airport · Hotels · Tours · Groups
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a href={telUrl(site.phone)} className="flex items-center gap-1.5 transition-colors hover:text-gold-300">
                <Phone className="size-3.5" aria-hidden /> {site.phone}
              </a>
              <a
                href={whatsappUrl(site.whatsappNumber, site.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-whatsapp"
              >
                <WhatsAppIcon className="size-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* main bar */}
        <div
          className={`transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled || open
              ? "border-b border-white/10 bg-ink-950/80 shadow-lift backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav className="container-x flex h-[72px] items-center justify-between gap-6" aria-label="Main">
            <Logo name={site.companyName} />

            <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
              {navLinks.map((link) => {
                const id = link.href.split("#")[1];
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(id)}
                      className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        highlighted === id ? "text-ink-950" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {highlighted === id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gold-400"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={telUrl(site.phone)}
                aria-label={`Call ${site.phone}`}
                className="hidden size-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:scale-105 hover:border-gold-400 hover:text-gold-300 sm:flex"
              >
                <Phone className="size-[18px]" aria-hidden />
              </a>
              {/* Phones use the hero CTA and the bottom action bar instead */}
              <div className="hidden sm:block">
                <BookNowButton size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-50 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {open ? <X className="size-5" /> : <Menu className="size-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950 px-6 pt-28 pb-10 lg:hidden"
          >
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-gold-500/25 blur-3xl" />
            <ul className="relative flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: easeOut }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between border-b border-white/10 py-4 font-display text-3xl font-semibold text-white"
                  >
                    {link.label}
                    <span className="text-gold-400 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="relative mt-auto flex flex-col gap-3 pt-10"
            >
              <BookNowButton size="lg" magnetic={false} label="Book on WhatsApp" className="w-full" />
              <a
                href={telUrl(site.phone)}
                className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 font-display font-semibold text-white"
              >
                <Phone className="size-[18px]" aria-hidden /> {site.phone}
              </a>
              <p className="text-center text-sm text-white/50">{site.availability} · All over the UAE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
