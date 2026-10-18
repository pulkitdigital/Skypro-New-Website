"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { BP, gsap, loadMotionPath, loadSplitText, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setLenis, whenScrollIdle } from "@/lib/lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Cursor } from "@/components/layout/Cursor";
import { setupHero, setupSection, type Conditions } from "./sections";
import {
  setupAltitude,
  setupBatch,
  setupCounselling,
  setupCourses,
  setupIntro,
  setupLife,
  setupPathway,
  setupRequirements,
  setupRunway,
  setupSeats,
  setupTakeoffBand,
  setupWindow,
  setupWordmark,
  watchClouds,
} from "./features";

const CONDITIONS = { desktop: BP.desktop, tablet: BP.tablet, mobile: BP.mobile };

/**
 * Lenis smooth scroll synced with GSAP's ticker + ScrollTrigger — desktop/fine pointers only
 * (Lenis doesn't smooth touch, so on phones its per-frame loop would only cost battery).
 */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

/**
 * The motion runtime (lazy chunk, loaded after `load` by MotionLayer). Page-wide motion is
 * driven by data attributes in the section markup (docs/TRD.md §7):
 * - each section's animations are created only when it comes within ~60% of a viewport;
 * - everything lives in gsap.matchMedia instances created inside useGSAP — re-created per
 *   breakpoint and reverted on unmount; start states are applied here (JS only), so content
 *   is visible without JS.
 */
export default function MotionRuntime() {
  useSmoothScroll();
  // the aviation cursor: desktop mouse/trackpad only (this runtime never loads with reduced motion)
  const finePointer = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

  useGSAP(() => {
    let alive = true;
    const instances: gsap.MatchMedia[] = [];

    const heroMM = gsap.matchMedia();
    heroMM.add(BP.desktop, setupHero);
    heroMM.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", setupAltitude);
    instances.push(heroMM);
    const stopClouds = watchClouds();

    // SplitText is only used on tablet/desktop — phones never download or evaluate it.
    const split = window.matchMedia("(min-width: 768px)").matches ? loadSplitText().catch(() => null) : Promise.resolve(null);

    // Flybys need MotionPath: the hero intro (tablet/desktop) and the TAKE OFF band.
    const needsPath = (s: HTMLElement) =>
      s.querySelector("[data-flyby-mobile]") || (s.querySelector("[data-flyby]") && window.matchMedia("(min-width: 768px)").matches);

    const setup = async (section: HTMLElement) => {
      const [Split] = await Promise.all([split, needsPath(section) ? loadMotionPath().catch(() => null) : null]);
      if (!alive) return;
      const mm = gsap.matchMedia();
      mm.add(CONDITIONS, (context) => {
        const c = context.conditions as Conditions;
        const cleanups = [setupSection(section, c, Split)];
        const id = section.id;
        if (id === "about") cleanups.push(setupIntro(section, c, Split));
        if (id === "courses") cleanups.push(setupCourses(section, c));
        if (id === "batches") cleanups.push(setupBatch(section, c));
        if (id === "why-choose") cleanups.push(setupWindow(section, c));
        if (id === "requirements") cleanups.push(setupRequirements(section));
        if (id === "pathway") cleanups.push(setupPathway(section, c));
        if (id === "testimonials") cleanups.push(setupSeats(section));
        if (id === "life") cleanups.push(setupLife(section, c));
        if (id === "enquiry") cleanups.push(setupRunway(section, c));
        if (id === "counselling") cleanups.push(setupCounselling(section));
        if (section.dataset.takeoffBand !== undefined) cleanups.push(setupTakeoffBand(section));
        if (section.tagName === "FOOTER") cleanups.push(setupWordmark(section));
        return () => cleanups.forEach((fn) => fn?.());
      });
      instances.push(mm);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          void setup(entry.target as HTMLElement);
        }
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
    document.querySelectorAll("main > section:not([data-hero]), body > footer").forEach((s) => observer.observe(s));

    // content-visibility sections switch from placeholder to real height the first time they
    // render; keep ScrollTrigger's positions in sync when that happens. A refresh writes the
    // scroll position (which would cancel a touch fling or a smooth CTA jump), so it waits
    // until the scroll has come to rest.
    const heights = new WeakMap<Element, number>();
    let refreshTimer: number | undefined;
    let waiting = false;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (waiting) return;
        waiting = true;
        whenScrollIdle(() => {
          waiting = false;
          if (alive) ScrollTrigger.refresh();
        }, 0);
      }, 150);
    };
    const resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const h = Math.round(entry.contentRect.height);
        const prev = heights.get(entry.target);
        heights.set(entry.target, h);
        if (prev !== undefined && Math.abs(prev - h) > 1) changed = true;
      }
      if (changed) scheduleRefresh();
    });
    document.querySelectorAll(".cv-auto").forEach((el) => resizeObserver.observe(el));

    return () => {
      alive = false;
      stopClouds();
      observer.disconnect();
      resizeObserver.disconnect();
      window.clearTimeout(refreshTimer);
      instances.forEach((mm) => mm.revert());
    };
  }, []);

  return finePointer ? <Cursor /> : null;
}
