import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { navLinks } from "@/lib/site";
import type { Service, SiteSettings, TransferRoute } from "@/lib/types";
import { Logo } from "../logo";
import { BookNowButton } from "../ui/buttons";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "../ui/social-icons";
import { WhatsAppIcon } from "../ui/whatsapp-icon";
import { FooterWordmark } from "./footer-wordmark";

export function Footer({ settings, services, routes }: { settings: SiteSettings; services: Service[]; routes: TransferRoute[] }) {
  const socials = [
    { href: settings.socialLinks.facebook, label: "Facebook", icon: FacebookIcon },
    { href: settings.socialLinks.instagram, label: "Instagram", icon: InstagramIcon },
    { href: settings.socialLinks.tiktok, label: "TikTok", icon: TikTokIcon },
    { href: settings.socialLinks.youtube, label: "YouTube", icon: YouTubeIcon },
  ].filter((social) => social.href);

  return (
    <footer className="relative overflow-hidden bg-ink-950 pt-20 pb-28 text-white md:pb-10">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.15fr_0.8fr_1.15fr]">
          <div>
            <Logo name={settings.companyName} />
            <p className="mt-5 max-w-xs leading-relaxed text-white/60">{settings.tagline}.</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-3 py-1.5 text-sm text-whatsapp">
              <span className="size-2 animate-pulse rounded-full bg-whatsapp" /> {settings.availability}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(({ href, label, icon: SocialIcon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
                  >
                    <SocialIcon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-gold-400 uppercase">Services</h3>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-gold-400 uppercase">Popular transfers</h3>
            <ul className="mt-5 space-y-3">
              {routes.slice(0, 6).map((route) => (
                <li key={route._id}>
                  <Link href={`/transfers/${route.slug}`} className="text-white/65 transition-colors hover:text-white">
                    {route.from.replace(/s*(.*)/, "")} → {route.to}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/transfers" className="font-medium text-gold-300 transition-colors hover:text-gold-200">
                  All transfer routes →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-gold-400 uppercase">Explore</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-gold-400 uppercase">Contact</h3>
            <ul className="mt-5 space-y-4 text-white/75">
              <li>
                <a href={telUrl(settings.phone)} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                  <Phone className="size-4 text-gold-400" aria-hidden /> {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-whatsapp"
                >
                  <WhatsAppIcon className="size-4 text-whatsapp" /> WhatsApp bookings
                </a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                    <Mail className="size-4 text-gold-400" aria-hidden /> {settings.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Clock3 className="size-4 text-gold-400" aria-hidden /> {settings.availability}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-gold-400" aria-hidden /> {settings.address}
              </li>
            </ul>
            <BookNowButton className="mt-7" size="sm" />
          </div>
        </div>

        <FooterWordmark text={settings.companyName} />

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <p>Airport transfers · Tours · Group transport — all over the UAE</p>
        </div>
      </div>
    </footer>
  );
}
