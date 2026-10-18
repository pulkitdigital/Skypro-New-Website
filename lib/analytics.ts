"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_EVENTS: Record<string, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
};

/** No-op unless GA4 / Meta Pixel were loaded (env vars set at build time). */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const pixelEvent = PIXEL_EVENTS[event];
  if (pixelEvent) window.fbq?.("track", pixelEvent);
}
