import { JsonLd } from "@/components/json-ld";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteProvider } from "@/components/site-provider";
import { SplashProvider } from "@/components/splash-screen";
import { getRoutes, getServices, getSettings, getVehicles } from "@/lib/data";
import { siteSchema } from "@/lib/schema";
import { splashBootScript } from "@/lib/splash";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, vehicles, routes] = await Promise.all([getSettings(), getServices(), getVehicles(), getRoutes()]);

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
      <JsonLd data={siteSchema(settings, services, vehicles)} />
      <script dangerouslySetInnerHTML={{ __html: splashBootScript }} />
      <SplashProvider companyName={settings.companyName}>
        <ScrollProgress />
        <Navbar />
        <main className="overflow-x-clip">{children}</main>
        <Footer settings={settings} services={services} routes={routes} />
        <FloatingWhatsApp />
        <MobileActionBar />
      </SplashProvider>
    </SiteProvider>
  );
}
