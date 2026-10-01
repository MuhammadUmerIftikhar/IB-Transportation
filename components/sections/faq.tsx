"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/lib/types";
import { useSite } from "../site-provider";
import { BookNowButton, CallButton } from "../ui/buttons";
import { easeOut, Reveal } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";

function Item({ faq, open, onToggle, index }: { faq: FaqItem; open: boolean; onToggle: () => void; index: number }) {
  const id = useId();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: easeOut }}
      className={`rounded-3xl border transition-colors duration-300 ${
        open ? "border-gold-400/50 bg-white shadow-soft" : "border-ink-900/10 bg-white/60 hover:bg-white"
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg font-semibold"
        >
          {faq.question}
          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              open ? "bg-brand-gradient text-ink-950" : "bg-ink-900 text-white"
            }`}
          >
            <Plus className="size-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 leading-relaxed text-ink-700/75">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const site = useSite();
  const [open, setOpen] = useState<string | null>(faqs[0]?._id ?? null);

  return (
    <section id="faq" className="relative overflow-hidden bg-sand-50 py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions?"
            highlight="We've got answers"
            description="Everything you need to know about booking a ride with us. Can't find your answer? Just ask."
          />
          <Reveal delay={0.2} className="mt-10">
            <div className="relative overflow-hidden rounded-[28px] bg-ink-950 p-7 text-white shadow-lift">
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-gold-500/30 blur-3xl" />
              <p className="relative font-display text-xl font-bold">Still not sure?</p>
              <p className="relative mt-1.5 text-white/65">
                Message or call us — {site.availability.toLowerCase()} and happy to help plan your trip.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <BookNowButton size="sm" label="Ask on WhatsApp" magnetic={false} />
                <CallButton size="sm" label="Call us" magnetic={false} />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Item key={faq._id} faq={faq} index={i} open={open === faq._id} onToggle={() => setOpen(open === faq._id ? null : faq._id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
