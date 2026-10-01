import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { VehicleIllustration } from "@/components/vehicle-illustration";
import { whatsappUrl } from "@/lib/contact";
import { getSettings } from "@/lib/data";

export default async function NotFound() {
  const settings = await getSettings();
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-ink-950 px-6 py-20 text-center text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="relative">
        <Link href="/" className="inline-flex" aria-label={`${settings.companyName} — home`}>
          <LogoMark className="size-14" />
        </Link>
        <p className="text-gradient mt-8 font-display text-[7rem] leading-none font-extrabold tracking-tighter sm:text-[10rem]">404</p>
        <div className="group is-driving mx-auto -mt-4 w-64 animate-float">
          <VehicleIllustration type="van" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Looks like this road doesn&apos;t exist</h1>
        <p className="mx-auto mt-3 max-w-md text-white/65">
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="bg-brand-gradient inline-flex h-12 items-center gap-2 rounded-full px-6 font-display font-semibold text-ink-950 shadow-glow-gold"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back to home
          </Link>
          <a
            href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 font-display font-semibold"
          >
            <WhatsAppIcon className="size-5" /> Book on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
