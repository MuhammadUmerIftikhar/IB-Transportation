"use client";

import { useSyncExternalStore } from "react";

/** Phones, tablets and other touch screens. */
const QUERY = "(max-width: 767px), (pointer: coarse)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * True on phones/touch devices, where scroll-linked effects (parallax) are turned off:
 * on mobile they run on the main thread, lag behind the finger and cost a style
 * recalculation every frame. Entrance animations stay on everywhere.
 * Server render assumes desktop; the client corrects it right after hydration.
 */
export function useLiteMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
