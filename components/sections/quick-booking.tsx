"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CalendarDays, Clock3, MapPin, Minus, Navigation, Plus, Sparkles, User } from "lucide-react";
import { useId, useState } from "react";
import { bookingMessage, whatsappUrl } from "@/lib/contact";
import { useSite } from "../site-provider";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

export interface BookingOptions {
  services: { title: string }[];
  vehicles: { name: string; passengers: number }[];
}

function todayInVisitorTimezone() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * Date/time inputs: iOS Safari gives them an intrinsic min-width (they overflow the card)
 * and shows nothing when empty, so reset their appearance, let them shrink, left-align
 * the value and show our own "Select …" hint while empty.
 */
const pickerClass =
  "block min-w-0 max-w-full appearance-none text-left [&::-webkit-date-and-time-value]:min-h-[1.5em] [&::-webkit-date-and-time-value]:text-left";

function openPicker(input: HTMLInputElement) {
  try {
    input.showPicker?.();
  } catch {
    // not allowed here (e.g. already open) — the browser's own behaviour still applies
  }
}

function PickerHint({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <span className="pointer-events-none absolute inset-y-0 left-10 flex items-center text-base text-ink-700/40 peer-focus:hidden sm:text-[15px]">
      {children}
    </span>
  );
}

const fieldClass =
  "peer h-12 w-full rounded-xl border border-ink-900/10 bg-sand-50 pr-3 pl-10 text-base text-ink-900 sm:text-[15px] outline-none transition placeholder:text-ink-700/40 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-400/20";

function Field({
  label,
  icon: FieldIcon,
  children,
  error,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: (id: string) => React.ReactNode;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-700/70 uppercase">
        {label}
      </label>
      <div className={`relative ${error ? "[&_input]:border-sunset-500 [&_input]:ring-4 [&_input]:ring-sunset-500/15" : ""}`}>
        {children(id)}
        <FieldIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-ink-700/40 transition-colors peer-focus:text-gold-600" />
      </div>
    </div>
  );
}

export function QuickBooking({
  services,
  vehicles,
  defaultService,
  title = "Book your ride",
  subtitle = "Fill in your trip — we'll open WhatsApp with everything ready to send.",
  className = "",
}: BookingOptions & { defaultService?: string; title?: string; subtitle?: string; className?: string }) {
  const site = useSite();
  const controls = useAnimationControls();
  const formId = useId();
  const [service, setService] = useState(defaultService ?? services[0]?.title ?? "");
  const [vehicle, setVehicle] = useState("");
  const [vehicleTouched, setVehicleTouched] = useState(false);
  const [passengers, setPassengers] = useState(2);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ pickup?: boolean; dropoff?: boolean }>({});

  const sorted = [...vehicles].sort((a, b) => a.passengers - b.passengers);
  const suggested = sorted.find((v) => v.passengers >= passengers)?.name ?? sorted.at(-1)?.name ?? "";
  const selectedVehicle = vehicleTouched ? vehicle : suggested;
  const maxPassengers = sorted.at(-1)?.passengers ?? 50;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = { pickup: !pickup.trim(), dropoff: !dropoff.trim() };
    setErrors(nextErrors);
    if (nextErrors.pickup || nextErrors.dropoff) {
      controls.start({ x: [0, -12, 10, -8, 6, -3, 0], transition: { duration: 0.5 } });
      return;
    }
    const message = bookingMessage(site.companyName, {
      name: name.trim() || undefined,
      service,
      vehicle: selectedVehicle,
      pickup: pickup.trim(),
      dropoff: dropoff.trim(),
      date: date || undefined,
      time: time || undefined,
      passengers,
    });
    window.open(whatsappUrl(site.whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <motion.form
      animate={controls}
      onSubmit={submit}
      noValidate
      className={`relative rounded-[28px] bg-white p-5 text-ink-900 shadow-lift ring-1 ring-ink-900/5 sm:p-7 ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-ink-700/65">{subtitle}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-whatsapp/15 text-whatsapp-dark">
          <WhatsAppIcon className="size-6" />
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Service" icon={Sparkles}>
          {(id) => (
            <select id={id} value={service} onChange={(e) => setService(e.target.value)} className={`${fieldClass} appearance-none`}>
              {services.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
            </select>
          )}
        </Field>

        <div>
          <span className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-700/70 uppercase">Passengers</span>
          <div className="flex h-12 items-center justify-between rounded-xl border border-ink-900/10 bg-sand-50 px-1.5">
            <button
              type="button"
              aria-label="Fewer passengers"
              onClick={() => setPassengers((p) => Math.max(1, p - 1))}
              className="flex size-9 items-center justify-center rounded-lg bg-white text-ink-900 shadow-sm transition hover:bg-gold-400 active:scale-90"
            >
              <Minus className="size-4" />
            </button>
            <span className="relative flex h-full w-16 items-center justify-center overflow-hidden font-display text-lg font-bold" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={passengers}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {passengers}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              aria-label="More passengers"
              onClick={() => setPassengers((p) => Math.min(maxPassengers, p + 1))}
              className="flex size-9 items-center justify-center rounded-lg bg-white text-ink-900 shadow-sm transition hover:bg-gold-400 active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold tracking-wide text-ink-700/70 uppercase">
            Vehicle
            {!vehicleTouched && (
              <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-[10px] tracking-wider text-gold-600 normal-case">
                Suggested for {passengers} {passengers === 1 ? "passenger" : "passengers"}
              </span>
            )}
          </span>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Vehicle">
            {sorted.map((v) => {
              const selected = selectedVehicle === v.name;
              const tooSmall = v.passengers < passengers;
              return (
                <button
                  key={v.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setVehicle(v.name);
                    setVehicleTouched(true);
                  }}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    selected ? "text-ink-950" : tooSmall ? "text-ink-700/35 line-through decoration-ink-700/30" : "text-ink-700 hover:bg-sand-100"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId={`vehicle-pill-${formId}`}
                      className="bg-brand-gradient absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative">{v.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Pickup location" icon={MapPin} error={errors.pickup}>
          {(id) => (
            <input
              id={id}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                if (errors.pickup) setErrors((err) => ({ ...err, pickup: false }));
              }}
              placeholder="e.g. DXB Terminal 3"
              autoComplete="off"
              aria-invalid={errors.pickup || undefined}
              className={fieldClass}
            />
          )}
        </Field>
        <Field label="Drop-off location" icon={Navigation} error={errors.dropoff}>
          {(id) => (
            <input
              id={id}
              value={dropoff}
              onChange={(e) => {
                setDropoff(e.target.value);
                if (errors.dropoff) setErrors((err) => ({ ...err, dropoff: false }));
              }}
              placeholder="e.g. Dubai Marina hotel"
              autoComplete="off"
              aria-invalid={errors.dropoff || undefined}
              className={fieldClass}
            />
          )}
        </Field>
        <Field label="Date" icon={CalendarDays}>
          {(id) => (
            <>
              <input
                id={id}
                type="date"
                value={date}
                onFocus={(e) => {
                  // Block past dates. Set on focus (not render) so server and client HTML match.
                  e.currentTarget.min = todayInVisitorTimezone();
                }}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => openPicker(e.currentTarget)}
                className={`${fieldClass} ${pickerClass} ${date ? "" : "text-transparent focus:text-ink-900"}`}
              />
              <PickerHint show={!date}>Select date</PickerHint>
            </>
          )}
        </Field>
        <Field label="Time" icon={Clock3}>
          {(id) => (
            <>
              <input
                id={id}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                onClick={(e) => openPicker(e.currentTarget)}
                className={`${fieldClass} ${pickerClass} ${time ? "" : "text-transparent focus:text-ink-900"}`}
              />
              <PickerHint show={!time}>Select time</PickerHint>
            </>
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Your name (optional)" icon={User}>
            {(id) => (
              <input id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="So our team knows who to greet" autoComplete="name" className={fieldClass} />
            )}
          </Field>
        </div>
      </div>

      <AnimatePresence>
        {(errors.pickup || errors.dropoff) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm font-medium text-sunset-600"
            role="alert"
          >
            Please add your pickup and drop-off locations.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        className="group relative mt-5 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-whatsapp font-display text-base font-bold text-ink-950 shadow-glow-green"
      >
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]" />
        <WhatsAppIcon className="size-6" />
        Book Now on WhatsApp
      </motion.button>
      <p className="mt-3 text-center text-xs text-ink-700/55">
        Opens WhatsApp with your trip details · {site.availability}
      </p>
    </motion.form>
  );
}
