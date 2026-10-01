import { Sparkle } from "lucide-react";

/** Infinite scrolling strip of destinations. Pure CSS animation, pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <section aria-label="Destinations we cover" className="relative z-10 -mt-px overflow-hidden bg-brand-gradient py-4 text-ink-950 shadow-glow-gold">
      <div className="group flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 font-display text-lg font-bold tracking-tight whitespace-nowrap uppercase sm:text-xl" aria-hidden={i >= items.length || undefined}>
            {item}
            <Sparkle className="size-4 fill-current" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  );
}
