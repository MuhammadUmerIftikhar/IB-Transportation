import Link from "next/link";
import { useId } from "react";

export function LogoMark({ className = "size-10" }: { className?: string }) {
  const gradientId = `ib-logo-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd770" />
          <stop offset="0.5" stopColor="#f5a800" />
          <stop offset="1" stopColor="#ff6a3d" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      {/* road swoosh */}
      <path d="M6 38c10-2 16-8 22-16s10-12 16-13" stroke="#0a1122" strokeOpacity="0.18" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M6 38c10-2 16-8 22-16s10-12 16-13" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
      {/* I */}
      <rect x="11" y="13" width="6" height="22" rx="1.6" fill="#0a1122" />
      {/* B */}
      <path
        d="M21 13h9.2c4.3 0 7 2.2 7 5.6 0 2.1-1.1 3.6-2.9 4.4 2.4.7 3.9 2.5 3.9 5 0 4-3.1 7-7.7 7H21V13Zm6 4.6v4.2h2.6c1.5 0 2.3-.8 2.3-2.1s-.8-2.1-2.3-2.1H27Zm0 8.5v4.4h3.1c1.6 0 2.5-.8 2.5-2.2s-.9-2.2-2.5-2.2H27Z"
        fill="#0a1122"
      />
    </svg>
  );
}

export function Logo({ dark = false, name = "IB Transportation" }: { dark?: boolean; name?: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${name} — home`}>
      <span className="transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110">
        <LogoMark />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-extrabold tracking-tight ${dark ? "text-ink-900" : "text-white"}`}>
          {first}
        </span>
        <span
          className={`font-display text-[10px] font-semibold tracking-[0.32em] uppercase ${
            dark ? "text-ink-700/70" : "text-white/60"
          }`}
        >
          {rest.join(" ") || "Transportation"}
        </span>
      </span>
    </Link>
  );
}
