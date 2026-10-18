"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query hook (false on the server and during hydration). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Resolves true once an element is within `rootMargin` of the viewport (one-shot). */
export function whenNear(element: Element, rootMargin = "800px") {
  return new Promise<void>((resolve) => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          resolve();
        }
      },
      { rootMargin },
    );
    io.observe(element);
  });
}
