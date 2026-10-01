"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/contact";
import { useSite } from "../site-provider";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

/** Desktop floating WhatsApp button with a friendly tooltip bubble. */
export function FloatingWhatsApp() {
  const site = useSite();
  const [bubble, setBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setBubble(true), 4500);
    const hide = setTimeout(() => setBubble(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed right-6 bottom-6 z-40 hidden items-end gap-3 md:flex">
      <AnimatePresence>
        {bubble && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative mb-2 max-w-60 rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm text-ink-900 shadow-lift"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full bg-ink-900 text-white"
            >
              <X className="size-3.5" />
            </button>
            <p className="font-display font-semibold">Need a ride? 🚗</p>
            <p className="mt-0.5 text-ink-700/70">Message us on WhatsApp — {site.availability.toLowerCase()}.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl(site.whatsappNumber, site.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 16 }}
        whileHover={{ scale: 1.1, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex size-16 items-center justify-center rounded-full bg-whatsapp text-white shadow-glow-green"
      >
        <span className="absolute inset-0 animate-ping-slow rounded-full bg-whatsapp" />
        <span className="absolute inset-0 animate-ping-slow rounded-full bg-whatsapp [animation-delay:1.1s]" />
        <WhatsAppIcon className="relative size-8" />
      </motion.a>
    </div>
  );
}
