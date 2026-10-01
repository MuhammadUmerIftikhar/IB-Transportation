"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Phone } from "lucide-react";
import { useState } from "react";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { useSite } from "../site-provider";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

/** Sticky Call / WhatsApp bar for phones, shown once the visitor scrolls past the hero. */
export function MobileActionBar() {
  const site = useSite();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 420));

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : 120 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mobile-solid flex gap-2 rounded-full border border-white/10 bg-ink-950/90 p-1.5 shadow-lift backdrop-blur-xl">
        <a
          href={telUrl(site.phone)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white/10 font-display text-sm font-semibold text-white"
        >
          <Phone className="size-4" aria-hidden /> Call now
        </a>
        <a
          href={whatsappUrl(site.whatsappNumber, site.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-whatsapp font-display text-sm font-semibold text-ink-950"
        >
          <WhatsAppIcon className="size-5" /> Book on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
