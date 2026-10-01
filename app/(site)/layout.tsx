import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteProvider } from "@/components/site-provider";
import { SplashProvider } from "@/components/splash-screen";
import { toDigits } from "@/lib/contact";
import { getServices, getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import { splashBootScript } from "@/lib/splash";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: settings.companyName,
    description: settings.seoDescription,
    url: siteUrl,
    telephone: `+${toDigits(settings.phone)}`,
    ...(settings.email ? { email: settings.email } : {}),
    image: `${siteUrl}/opengraph-image`,
    address: { "@type": "PostalAddress", addressLocality: settings.address, addressCountry: "AE" },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title, description: service.shortDescription },
    })),
  };

  return (
    <SiteProvider
      contact={{
        companyName: settings.companyName,
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        whatsappMessage: settings.whatsappMessage,
        availability: settings.availability,
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script dangerouslySetInnerHTML={{ __html: splashBootScript }} />
      <SplashProvider companyName={settings.companyName}>
        <ScrollProgress />
        <Navbar />
        <main className="overflow-x-clip">{children}</main>
        <Footer settings={settings} services={services} />
        <FloatingWhatsApp />
        <MobileActionBar />
      </SplashProvider>
    </SiteProvider>
  );
}
