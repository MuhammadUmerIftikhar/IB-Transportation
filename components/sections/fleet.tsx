"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check, Luggage, Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import { vehicleMessage } from "@/lib/contact";
import type { Vehicle } from "@/lib/types";
import { useSite } from "../site-provider";
import { BookNowButton } from "../ui/buttons";
import { CmsImage } from "../ui/cms-image";
import { easeOut } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";
import { TiltCard } from "../ui/tilt-card";
import { VehicleIllustration } from "../vehicle-illustration";

const presets = [
  { label: "Couple", value: 2 },
  { label: "Family", value: 5 },
  { label: "Team", value: 12 },
  { label: "Big group", value: 30 },
];

function VehicleStage({ vehicle }: { vehicle: Vehicle }) {
  const [driving, setDriving] = useState(false);
  // Illustrations always face right; photos say which way they face.
  const right = !vehicle.image || vehicle.facing !== "left";
  // The in-view trigger sits on the stage: the vehicle itself starts off-stage, clipped by
  // `overflow-hidden`, so an observer on it would never fire.
  return (
    <motion.div
      initial="parked"
      whileInView="drive"
      viewport={{ once: true, margin: "-40px" }}
      className="relative h-44 overflow-hidden rounded-[22px] bg-linear-to-b from-ink-800 to-ink-900 sm:h-48"
    >
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:28px_100%] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute bottom-6 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-gold-400/25 blur-2xl transition-all duration-700 group-hover:w-full group-hover:bg-gold-400/40" />
      <div className="absolute inset-x-6 bottom-[30px] h-px bg-white/10" />

      {/* speed lines, trailing behind the vehicle */}
      <div
        aria-hidden
        className={`absolute top-1/2 flex w-1/4 flex-col gap-3 ${right ? "left-4 items-end" : "right-4 items-start"}`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ transitionDelay: `${i * 70}ms`, width: `${100 - i * 25}%` }}
            className={`h-0.5 scale-x-0 rounded-full transition-transform duration-500 group-hover:scale-x-100 ${
              right ? "origin-right bg-linear-to-r from-transparent to-gold-300/70" : "origin-left bg-linear-to-l from-transparent to-gold-300/70"
            }`}
          />
        ))}
      </div>

      <motion.div
        variants={{
          parked: { x: right ? "-120%" : "120%", opacity: 0, rotate: 0 },
          drive: {
            x: "0%",
            opacity: 1,
            // nose dips as it brakes into place
            rotate: [0, 0, right ? 1.8 : -1.8, 0],
            transition: {
              x: { duration: 1.3, ease: easeOut },
              opacity: { duration: 0.4 },
              rotate: { duration: 1.6, times: [0, 0.62, 0.8, 1], ease: "easeInOut" },
            },
          },
        }}
        style={{ originY: 1 }}
        onAnimationStart={() => setDriving(true)}
        onAnimationComplete={() => setDriving(false)}
        className={`absolute inset-x-4 bottom-2 flex h-full items-end justify-center ${driving ? "is-driving" : ""}`}
      >
        {vehicle.image ? (
          <div
            className={`relative h-[84%] w-full transition-transform duration-700 ease-spring group-hover:-translate-y-1.5 group-hover:scale-[1.05] ${
              right ? "group-hover:translate-x-3" : "group-hover:-translate-x-3"
            }`}
          >
            {/* ground shadow */}
            <div className="absolute inset-x-[12%] bottom-0 h-4 translate-y-1/2 rounded-[50%] bg-black/70 blur-md transition-all duration-700 group-hover:inset-x-[16%] group-hover:opacity-70" />
            <CmsImage
              image={vehicle.image}
              alt={vehicle.name}
              fill
              placeholder="empty"
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="object-contain object-bottom drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]"
            />
          </div>
        ) : (
          <VehicleIllustration type={vehicle.type} title={`${vehicle.name} illustration`} className="w-full max-w-[340px] drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-spring group-hover:translate-x-3" />
        )}
      </motion.div>
    </motion.div>
  );
}

function VehicleCard({
  vehicle,
  fits,
  bestFit,
  maxPassengers,
  passengers,
}: {
  vehicle: Vehicle;
  fits: boolean;
  bestFit: boolean;
  maxPassengers: number;
  passengers: number;
}) {
  const site = useSite();
  const capacity = Math.max(0.12, Math.sqrt(vehicle.passengers / maxPassengers));

  return (
    <motion.div
      layout
      animate={{ opacity: fits ? 1 : 0.45, scale: fits ? 1 : 0.97, filter: fits ? "grayscale(0)" : "grayscale(0.8)" }}
      transition={{ duration: 0.4 }}
      className="relative h-full"
    >
      {bestFit && (
        <motion.div
          layoutId="best-fit-ring"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-brand-gradient absolute -inset-[2px] rounded-[30px] opacity-90 shadow-glow-gold"
        />
      )}
      <TiltCard max={5} className="h-full rounded-[28px]">
        <article className="relative flex h-full flex-col rounded-[28px] border border-white/10 bg-ink-900 p-3 text-white">
          <VehicleStage vehicle={vehicle} />

          <AnimatePresence>
            {bestFit && (
              <motion.span
                layoutId="best-fit-badge"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="bg-brand-gradient absolute top-6 right-6 z-10 rounded-full px-3 py-1 font-display text-xs font-bold text-ink-950 shadow-glow-gold"
              >
                ★ Best fit
              </motion.span>
            )}
            {!fits && (
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 right-6 z-10 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur"
              >
                Too small for {passengers}
              </motion.span>
            )}
          </AnimatePresence>

          <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">{vehicle.name}</h3>
                <p className="text-sm font-medium text-gold-300">{vehicle.tagline}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/5 px-3.5 py-3 ring-1 ring-white/10">
                <p className="flex items-center gap-1.5 text-xs text-white/55">
                  <Users className="size-3.5" aria-hidden /> Passengers
                </p>
                <p className="mt-0.5 font-display text-xl font-bold">
                  Up to {vehicle.passengers}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 px-3.5 py-3 ring-1 ring-white/10">
                <p className="flex items-center gap-1.5 text-xs text-white/55">
                  <Luggage className="size-3.5" aria-hidden /> Large bags
                </p>
                <p className="mt-0.5 font-display text-xl font-bold">{vehicle.luggage}</p>
              </div>
            </div>

            <div className="mt-3" aria-hidden>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${capacity * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
                  className="bg-brand-gradient h-full rounded-full"
                />
              </div>
            </div>

            {vehicle.models && <p className="mt-4 text-xs font-medium tracking-wide text-white/45 uppercase">{vehicle.models}</p>}
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">{vehicle.description}</p>

            {vehicle.features.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5 text-sm text-white/80">
                    <span className="flex size-4 items-center justify-center rounded-full bg-whatsapp/20 text-whatsapp">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto pt-6">
              <BookNowButton
                magnetic={false}
                label={`Book ${vehicle.name}`}
                className="w-full"
                message={vehicleMessage(site.companyName, vehicle.name, vehicle.passengers)}
              />
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

export function Fleet({
  vehicles,
  eyebrow = "Our fleet",
  title = "The right ride for",
  highlight = "every group size",
  description = "From a sleek sedan for two to a 50-seat coach for the whole team. Tell us how many are travelling and we'll show you the best fit.",
}: {
  vehicles: Vehicle[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
}) {
  const maxPassengers = Math.max(...vehicles.map((v) => v.passengers), 1);
  const [passengers, setPassengers] = useState(1);
  const bestFit = [...vehicles].sort((a, b) => a.passengers - b.passengers).find((v) => v.passengers >= passengers);
  const percent = ((passengers - 1) / Math.max(1, maxPassengers - 1)) * 100;

  return (
    <section id="fleet" className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[56rem] -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading dark eyebrow={eyebrow} title={title} highlight={highlight} description={description} />

        {/* passenger picker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mx-auto mt-12 max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Fewer passengers"
                onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-400 hover:text-ink-950 active:scale-90"
              >
                <Minus className="size-5" />
              </button>
              <div className="w-28 text-center">
                <div className="relative h-11 overflow-hidden font-display text-4xl leading-[44px] font-extrabold text-white">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={passengers}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      className="inline-block"
                    >
                      {passengers}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-xs text-white/50">{passengers === 1 ? "passenger" : "passengers"}</p>
              </div>
              <button
                type="button"
                aria-label="More passengers"
                onClick={() => setPassengers((p) => Math.min(maxPassengers, p + 1))}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-400 hover:text-ink-950 active:scale-90"
              >
                <Plus className="size-5" />
              </button>
            </div>

            <div className="flex-1">
              <label htmlFor="passenger-range" className="sr-only">
                Number of passengers
              </label>
              <input
                id="passenger-range"
                type="range"
                min={1}
                max={maxPassengers}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                style={{ backgroundSize: `${percent}% 100%` }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 bg-[linear-gradient(90deg,var(--color-gold-400),var(--color-sunset-500))] bg-no-repeat [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-gold-400 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-gold-400 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-glow-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPassengers(Math.min(maxPassengers, preset.value))}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      passengers === preset.value ? "bg-gold-400 text-ink-950" : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {preset.label} · {preset.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 border-t border-white/10 pt-4 text-center text-sm text-white/60 sm:text-left" aria-live="polite">
            {bestFit ? (
              <>
                Best fit for <strong className="text-white">{passengers}</strong>:{" "}
                <strong className="text-gold-300">{bestFit.name}</strong> — up to {bestFit.passengers} passengers.
              </>
            ) : (
              <>For groups this size we can combine vehicles — message us on WhatsApp.</>
            )}
          </p>
        </motion.div>

        <LayoutGroup>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, i) => (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.12, ease: easeOut }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  fits={vehicle.passengers >= passengers}
                  bestFit={bestFit?._id === vehicle._id}
                  maxPassengers={maxPassengers}
                  passengers={passengers}
                />
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
