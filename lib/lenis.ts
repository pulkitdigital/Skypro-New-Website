"use client";

import type Lenis from "lenis";

/** Module-level handle to the single Lenis instance (null when reduced motion or before mount). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Same value as `scroll-padding-top` on <html> (fixed header + 16px). */
function headerOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  return (parseInt(value, 10) || 68) + 16;
}

/**
 * Smooth-scrolls to an element id without touching the URL hash.
 * Optionally focuses an element once the scroll finishes.
 */
export function scrollToId(id: string, options: { focusId?: string } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  const root = document.documentElement;

  // Deferred (content-visibility) sections between here and the target may still be at
  // their placeholder height; render them for the jump so the destination is exact.
  root.classList.add("cv-render");
  void target.getBoundingClientRect(); // forces layout with real heights

  // The target may be lazy-loaded (enquiry form): retry for up to ~3 s.
  const focus = (attempt = 0) => {
    if (!options.focusId) return;
    const el = document.getElementById(options.focusId);
    if (el) el.focus({ preventScroll: true });
    else if (attempt < 30) window.setTimeout(() => focus(attempt + 1), 100);
  };

  // Correct after landing (a pin spacer appeared, or the native smooth scroll was cut short).
  const settle = (pass = 0) => {
    if (root.classList.contains("cv-render")) {
      // `content-visibility: visible` drops the remembered sizes, so pin each deferred section's
      // real height as its placeholder before it can be skipped again (otherwise the page shifts).
      document.querySelectorAll<HTMLElement>(".cv-auto").forEach((el) => {
        el.style.containIntrinsicBlockSize = `auto ${el.offsetHeight}px`;
      });
      root.classList.remove("cv-render");
    }
    const drift = target.getBoundingClientRect().top - headerOffset();
    if (Math.abs(drift) <= 4 || pass >= 3) return focus();
    if (instance) instance.scrollTo(target, { duration: 0.4, onComplete: () => focus() });
    else {
      window.scrollTo({ top: window.scrollY + drift, behavior: "auto" });
      whenScrollIdle(() => settle(pass + 1), 50);
    }
  };

  if (instance) {
    // Lenis already subtracts the page's scroll-padding-top (header offset) for elements.
    instance.scrollTo(target, { duration: 1.2, onComplete: () => settle() });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  whenScrollIdle(() => settle(), reduce ? 50 : 250);
}

/**
 * Calls `fn` when the scroll has finished: on `scrollend` where supported, otherwise once
 * scrollY has been still for 6 frames (frame-based, so a busy main thread can't fire it
 * early), after at least `minWait` ms and at most 3 s.
 */
export function whenScrollIdle(fn: () => void, minWait: number) {
  const start = performance.now();
  let lastY = window.scrollY;
  let still = 0;
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    window.removeEventListener("scrollend", onEnd);
    fn();
  };
  // a scrollend in the first moments belongs to the scroll this jump interrupted (e.g. a fling)
  const onEnd = () => performance.now() - start > 50 && done();
  if ("onscrollend" in window) window.addEventListener("scrollend", onEnd);
  const tick = () => {
    if (finished) return;
    const y = window.scrollY;
    still = y === lastY ? still + 1 : 0;
    lastY = y;
    const elapsed = performance.now() - start;
    if ((elapsed >= minWait && still >= 6) || elapsed > 3000) return done();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export const ENQUIRY_ID = "enquiry";
export const ENQUIRY_FIRST_FIELD_ID = "enquiry-name";

export function scrollToEnquiry() {
  window.dispatchEvent(new Event("enquiry:load"));
  scrollToId(ENQUIRY_ID, { focusId: ENQUIRY_FIRST_FIELD_ID });
}
