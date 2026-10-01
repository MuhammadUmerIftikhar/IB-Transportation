import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/ib-logo.png";

/** The IB logo mark (optimized copy of public/images/IBLogo.png). Size it with a height class. */
export function LogoMark({ className = "h-11 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src={logo} alt="" aria-hidden sizes="120px" priority={priority} className={`max-w-none ${className}`} />;
}

export function Logo({ dark = false, name = "IB Transportation" }: { dark?: boolean; name?: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${name} — home`}>
      <span className="shrink-0 transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-110">
        <LogoMark priority className="h-11 w-auto drop-shadow-[0_4px_14px_rgba(37,99,235,0.45)] sm:h-12" />
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
