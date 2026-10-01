"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext } from "react";

export interface SiteContact {
  companyName: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  availability: string;
}

const SiteContext = createContext<SiteContact | null>(null);

export function SiteProvider({ contact, children }: { contact: SiteContact; children: React.ReactNode }) {
  return (
    <SiteContext.Provider value={contact}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside <SiteProvider>");
  return context;
}
