"use client";

import { useEffect, useState } from "react";

/**
 * Becomes true after the window `load` event plus an idle slot — used to keep
 * non-critical setup (scroll animations, pins, video) out of the startup path.
 */
/** Promise form (no React state → no re-render): resolves after `load` + an idle slot. */
export function afterLoad(timeout = 1200) {
  return new Promise<void>((resolve) => {
    const schedule = () =>
      window.requestIdleCallback ? window.requestIdleCallback(() => resolve(), { timeout }) : window.setTimeout(resolve, 200);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  });
}

export function useAfterLoad(timeout = 1200) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timer: number | undefined;

    const schedule = () => {
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(() => !cancelled && setReady(true), { timeout });
      } else {
        timer = window.setTimeout(() => !cancelled && setReady(true), 200);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [timeout]);

  return ready;
}
