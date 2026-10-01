"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { CarFront, CheckCheck, MessageCircleMore, MousePointerClick } from "lucide-react";
import { useRef } from "react";
import { LogoMark } from "../logo";
import { useSite } from "../site-provider";
import { BookNowButton } from "../ui/buttons";
import { easeOut } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose your ride",
    text: "Pick a service and the vehicle that fits your group — or fill in the quick booking form.",
  },
  {
    icon: MessageCircleMore,
    title: "Message us on WhatsApp",
    text: "Tap “Book Now”. WhatsApp opens with your pickup, drop-off, date and time already written.",
  },
  {
    icon: CarFront,
    title: "Sit back & enjoy",
    text: "We confirm your booking and your driver takes it from there — comfortable, safe and on your schedule.",
  },
];

function ChatBubble({ children, mine, delay }: { children: React.ReactNode; mine?: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 22 }}
      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug shadow-sm ${
        mine ? "ml-auto origin-bottom-right rounded-br-md bg-[#d9fdd3] text-ink-900" : "origin-bottom-left rounded-bl-md bg-white text-ink-900"
      }`}
    >
      {children}
    </motion.div>
  );
}

function PhoneMockup() {
  const site = useSite();
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-whatsapp/20 blur-3xl" />
      <motion.div
        initial={{ rotate: 6, y: 40, opacity: 0 }}
        whileInView={{ rotate: -3, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: easeOut }}
        className="rounded-[44px] bg-ink-950 p-3 shadow-lift ring-1 ring-white/10"
      >
        <div className="overflow-hidden rounded-[34px] bg-[#efeae2]">
          <div className="flex items-center gap-3 bg-[#075e54] px-4 pt-7 pb-3 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-ink-950 p-1">
              <LogoMark className="h-auto w-full" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{site.companyName}</span>
              <span className="text-[11px] text-white/70">{site.availability}</span>
            </span>
          </div>
          <div className="flex min-h-[360px] flex-col gap-2.5 p-3">
            <ChatBubble mine delay={0.4}>
              Hello {site.companyName}! 👋 I&apos;d like to book a ride.
              <br />
              <br />
              🚘 Service: Airport Pick &amp; Drop
              <br />
              🚐 Vehicle: 7 Seater
              <br />
              📍 Pickup: DXB Terminal 3
              <br />
              🏁 Drop-off: Dubai Marina
              <br />
              👥 Passengers: 5
              <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-ink-700/50">
                10:42 <CheckCheck className="size-3.5 text-sky-500" />
              </span>
            </ChatBubble>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 1, 1, 0] }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 1.1, duration: 1.4, times: [0, 0.1, 0.85, 1] }}
              className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-3"
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                  className="size-1.5 rounded-full bg-ink-700/40"
                />
              ))}
            </motion.div>
            <ChatBubble delay={2.5}>
              Hi! Thanks for choosing {site.companyName} 🙌 We&apos;re confirming your ride details now.
            </ChatBubble>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="Booked in"
            highlight="three easy steps"
            description="No apps to download and no long forms. Booking with us is as easy as sending a message."
          />

          <ol ref={ref} className="relative mt-12 space-y-10">
            {/* progress line */}
            <div aria-hidden className="absolute top-2 bottom-2 left-7 w-0.5 bg-ink-900/10">
              <motion.div style={{ scaleY: progress }} className="bg-brand-gradient h-full w-full origin-top" />
            </div>
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: easeOut }}
                className="relative flex gap-6"
              >
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-gold-300 shadow-soft">
                  <step.icon className="size-6" aria-hidden />
                  <span className="bg-brand-gradient absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full font-display text-xs font-bold text-ink-950">
                    {i + 1}
                  </span>
                </span>
                <div className="pt-1">
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-1.5 max-w-md leading-relaxed text-ink-700/70">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <BookNowButton size="lg" label="Start booking" />
            <span className="flex items-center gap-2 text-sm text-ink-700/60">
              <WhatsAppIcon className="size-4 text-whatsapp-dark" /> Takes less than a minute
            </span>
          </div>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
