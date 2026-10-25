import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Conditions, SplitTextClass } from "./sections";

type Cleanup = () => void;
const noop: Cleanup = () => {};
const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });
const $$ = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => Array.from(root.querySelectorAll<T>(selector));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ---------------------------------------------------------------------------------------- */
/* PlaneFlyby — a plane flies a curve sized to its box, with a contrail that fades           */
/* ---------------------------------------------------------------------------------------- */

/** Builds the flyby timeline (paused). Needs MotionPath registered. */
export function flybyTimeline(root: HTMLElement, duration = 2.2) {
  const svg = root.querySelector<SVGSVGElement>("[data-flyby-svg]");
  const trail = root.querySelector<SVGPathElement>("[data-flyby-trail]");
  const gradient = root.querySelector<SVGLinearGradientElement>("[data-flyby-gradient]");
  const plane = root.querySelector<HTMLElement>("[data-flyby-plane]");
  if (!svg || !trail || !gradient || !plane || !gsap.plugins.motionPath) return null;

  const { width: w, height: h } = root.getBoundingClientRect();
  const climb = root.dataset.flyby === "climb";
  const s = climb ? { x: -0.06 * w, y: 0.95 * h } : { x: -0.06 * w, y: 0.66 * h };
  const c1 = climb ? { x: 0.34 * w, y: 0.98 * h } : { x: 0.3 * w, y: 0.16 * h };
  const c2 = climb ? { x: 0.6 * w, y: 0.36 * h } : { x: 0.68 * w, y: 0.86 * h };
  const e = climb ? { x: 1.08 * w, y: -0.1 * h } : { x: 1.08 * w, y: 0.34 * h };
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  trail.setAttribute("d", `M ${s.x} ${s.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${e.x} ${e.y}`);
  Object.entries({ x1: s.x, y1: s.y, x2: e.x, y2: e.y }).forEach(([k, v]) => gradient.setAttribute(k, String(v)));
  const length = trail.getTotalLength();

  gsap.set(trail, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
  gsap.set(plane, { xPercent: -50, yPercent: -50, x: s.x, y: s.y, opacity: 0 });
  const ease = "power1.inOut";
  return gsap
    .timeline({ paused: true })
    .set(plane, { opacity: 1 }, 0)
    .to(plane, { motionPath: { path: trail, autoRotate: 45 }, duration, ease }, 0)
    .to(trail, { strokeDashoffset: 0, duration, ease }, 0)
    .to(plane, { opacity: 0, duration: 0.3 }, duration - 0.3)
    .to(trail, { opacity: 0, duration: 1.6, ease: "power1.out" }, duration - 0.4);
}

/* ---------------------------------------------------------------------------------------- */
/* Altitude indicator (≥1280px) — 0 → 35,000 FT with the scroll after the hero               */
/* ---------------------------------------------------------------------------------------- */

export function setupAltitude(): Cleanup {
  const root = document.querySelector<HTMLElement>("[data-altitude]");
  const marker = root?.querySelector<HTMLElement>("[data-altitude-marker]");
  const value = root?.querySelector<HTMLElement>("[data-altitude-value]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!root || !marker || !value) return noop;
  const bar = marker.parentElement!;
  let last = -1;
  const st = ScrollTrigger.create({
    start: () => (hero?.offsetHeight ?? window.innerHeight) * 0.85,
    end: "max",
    invalidateOnRefresh: true,
    onToggle: (self) => (root.style.opacity = self.isActive || self.progress >= 1 ? "1" : "0"),
    onUpdate: (self) => {
      gsap.set(marker, { y: self.progress * bar.offsetHeight });
      const ft = Math.round(self.progress * 350) * 100;
      if (ft !== last) value.textContent = (last = ft).toLocaleString("en-US");
    },
  });
  return () => {
    st.kill();
    root.style.opacity = "";
    gsap.set(marker, { clearProps: "transform" });
    value.textContent = "0";
  };
}

/* ---------------------------------------------------------------------------------------- */
/* Hero intro — flyby behind the H1 (tablet/desktop)                                         */
/* ---------------------------------------------------------------------------------------- */

export function setupIntro(section: HTMLElement, c: Conditions, Split: SplitTextClass | null): Cleanup {
  const cleanups: Cleanup[] = [];
  const heading = section.querySelector<HTMLElement>('[data-split="flyby"]');
  const flyby = section.querySelector<HTMLElement>("[data-flyby]");
  if (heading && (c.desktop || c.tablet)) {
    const split = Split ? new Split(heading, { type: "lines", mask: "lines" }) : null;
    const lines = split ? split.lines : [heading];
    gsap.set(lines, split ? { yPercent: 110 } : { opacity: 0 });
    let tl: gsap.core.Timeline | null = null;
    const st = ScrollTrigger.create({
      ...once(section, "top 45%"),
      onEnter: () => {
        tl = flyby ? flybyTimeline(flyby, 2.4) : null;
        gsap.to(lines, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.4, delay: 0.35 });
        tl?.play();
      },
    });
    cleanups.push(() => {
      st.kill();
      tl?.kill();
      split?.revert();
      gsap.set(heading, { clearProps: "opacity" });
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

/* ---------------------------------------------------------------------------------------- */
/* Courses — stacked boarding cards                                                          */
/* ---------------------------------------------------------------------------------------- */

/**
 * Every photo zooms in slowly as its card enters. Desktop (cards are sticky): as card i slides
 * up into place, card i-1 scales to 0.94 (from its top edge) and darkens, and card i's plane
 * crosses its route line. Scroll positions are computed from the (non-sticky) list and each
 * card's natural offset, so they stay right while cards stick.
 */
export function setupCourses(section: HTMLElement, c: Conditions): Cleanup {
  const list = section.querySelector<HTMLElement>(".course-stack");
  const cards = $$(section, "[data-stack-card]");
  if (!list || !cards.length) return noop;
  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  cards.forEach((card) => {
    const photo = card.querySelector("[data-stack-photo]");
    if (photo) tweens.push(gsap.fromTo(photo, { scale: 1.14 }, { scale: 1, duration: 2.2, ease: "power2.out", scrollTrigger: once(card, "top 85%") }));
  });

  if (c.desktop) {
    const gap = () => parseFloat(getComputedStyle(list).rowGap) || 0;
    const listTop = () => list.getBoundingClientRect().top + window.scrollY;
    const natural = (i: number) => cards.slice(0, i).reduce((sum, el) => sum + el.offsetHeight + gap(), 0);
    const stickyTop = (i: number) => parseFloat(getComputedStyle(cards[i]!).top) || 0;
    const arrive = (i: number) => ({
      start: () => listTop() + natural(i) - window.innerHeight,
      end: () => listTop() + natural(i) - stickyTop(i),
    });

    cards.forEach((card, i) => {
      const route = card.querySelector<HTMLElement>("[data-stack-route]");
      const plane = card.querySelector<HTMLElement>("[data-stack-plane]");
      if (route && plane) {
        tweens.push(
          gsap.fromTo(
            plane,
            { x: 0 },
            { x: () => route.offsetWidth - plane.offsetWidth, ease: "none", scrollTrigger: { ...arrive(i), scrub: 0.6, invalidateOnRefresh: true } },
          ),
        );
      }
      const prev = cards[i - 1];
      if (prev) {
        const sheet = prev.querySelector("[data-stack-sheet]");
        const dim = prev.querySelector("[data-stack-dim]");
        const tl = gsap.timeline({ scrollTrigger: { ...arrive(i), scrub: true, invalidateOnRefresh: true } });
        if (sheet) tl.fromTo(sheet, { scale: 1 }, { scale: 0.94, transformOrigin: "50% 0%", ease: "none" }, 0);
        if (dim) tl.fromTo(dim, { opacity: 0 }, { opacity: 0.35, ease: "none" }, 0);
        tweens.push(tl);
      }
    });
  }

  return () => {
    tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
    gsap.set($$(section, "[data-stack-photo], [data-stack-plane], [data-stack-sheet], [data-stack-dim]"), { clearProps: "transform,opacity" });
  };
}

/* ---------------------------------------------------------------------------------------- */
/* Batches — the boarding pass slides in                                                     */
/* ---------------------------------------------------------------------------------------- */

export function setupBatch(section: HTMLElement, c: Conditions): Cleanup {
  const passes = $$(section, "[data-slide-in]");
  if (!passes.length) return noop;
  const tween = gsap.from(passes, {
    ...(c.mobile ? { y: 30 } : { x: 90 }),
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    clearProps: "transform,opacity",
    scrollTrigger: once(passes[0]!, "top 85%"),
  });
  return () => (tween.scrollTrigger?.kill(), tween.kill());
}

/* ---------------------------------------------------------------------------------------- */
/* Why Choose — window sky drift + the point in the middle of the screen is brightest        */
/* ---------------------------------------------------------------------------------------- */

export function setupWindow(section: HTMLElement, c: Conditions): Cleanup {
  const tweens: gsap.core.Tween[] = [];
  const k = c.mobile ? 0.5 : 1;
  const scrub = { trigger: section, start: "top bottom", end: "bottom top", scrub: true };
  const amount: Record<string, [number, number]> = { "0": [0, 4] };
  $$(section, "[data-window-depth]").forEach((layer) => {
    const [x, y] = amount[layer.dataset.windowDepth ?? "0"] ?? [0, 0];
    tweens.push(
      gsap.fromTo(layer, { xPercent: x * k, yPercent: -y * k }, { xPercent: -x * k, yPercent: y * k, ease: "none", scrollTrigger: scrub }),
    );
  });

  const triggers: ScrollTrigger[] = [];
  if (!c.mobile) {
    section.dataset.pointsArmed = "";
    $$(section, "[data-point]").forEach((point) =>
      triggers.push(ScrollTrigger.create({ trigger: point, start: "top 62%", end: "bottom 38%", toggleClass: "is-active" })),
    );
  }
  return () => {
    tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
    triggers.forEach((t) => t.kill());
    delete section.dataset.pointsArmed;
    $$(section, "[data-point]").forEach((p) => p.classList.remove("is-active"));
    gsap.set($$(section, "[data-window-depth]"), { clearProps: "transform" });
  };
}

/* ---------------------------------------------------------------------------------------- */
/* Requirements — the flying-hours bars fill as card 06 comes into view                      */
/* ---------------------------------------------------------------------------------------- */

/** The cards themselves rise with the shared `[data-stagger]` reveal (sections.ts). */
export function setupRequirements(section: HTMLElement): Cleanup {
  const hours = section.querySelector<HTMLElement>("[data-hours]");
  const bars = hours ? $$(hours, "[data-hours-bar]") : [];
  if (!hours || !bars.length) return noop;
  const tween = gsap.fromTo(
    bars,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: "0% 50%", duration: 1.1, ease: "power3.out", stagger: 0.12, scrollTrigger: once(hours, "top 85%") },
  );
  return () => (tween.scrollTrigger?.kill(), tween.kill(), gsap.set(bars, { clearProps: "transform" }));
}

/* ---------------------------------------------------------------------------------------- */
/* Pathway — the wavy route draws once; circles pop in as it reaches them; the plane lands   */
/* ---------------------------------------------------------------------------------------- */

/** Fraction of the path length at which x is reached (binary search; x grows along the route). */
function fractionAtX(path: SVGPathElement, x: number) {
  const total = path.getTotalLength();
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).x < x) lo = mid;
    else hi = mid;
  }
  return lo / total;
}

export function setupPathway(section: HTMLElement, c: Conditions): Cleanup {
  const cleanups: Cleanup[] = [];

  if (c.desktop) {
    const row = section.querySelector<HTMLElement>("[data-route-row]");
    const mask = section.querySelector<SVGPathElement>("[data-route-mask]");
    const plane = section.querySelector<HTMLElement>("[data-route-plane]");
    const markers = $$(section, "[data-step-marker]");
    const steps = $$(section, "[data-pathway-desktop] [data-step]");
    if (row && mask && plane && markers.length) {
      const W = 1200;
      const PLANE_X = 0.98 * W;
      const PLANE_Y = 26;
      const D = 2.6;
      const length = mask.getTotalLength();
      const at = markers.map((m) => fractionAtX(mask, Number(m.dataset.x)));
      const last = at.at(-1) ?? 0.85;
      const planeAt = fractionAtX(mask, PLANE_X);
      const proxy = { f: last };
      const placePlane = () => {
        const p = mask.getPointAtLength(proxy.f * length);
        const q = mask.getPointAtLength(Math.min(length, proxy.f * length + 2));
        const sx = row.offsetWidth / W;
        const angle = (Math.atan2(q.y - p.y, (q.x - p.x) * sx) * 180) / Math.PI;
        gsap.set(plane, { x: (p.x - PLANE_X) * sx, y: p.y - PLANE_Y, rotation: angle });
      };

      gsap.set(mask, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(markers, { scale: 0 });
      gsap.set(steps, { opacity: 0, y: 24 });
      gsap.set(plane, { opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(mask, { strokeDashoffset: 0, duration: D, ease: "none" }, 0);
      markers.forEach((m, i) => {
        const t = (at[i] ?? 0) * D;
        tl.to(m, { scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t);
        if (steps[i]) tl.to(steps[i]!, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, t + 0.05);
      });
      tl.set(plane, { opacity: 1 }, last * D)
        .call(placePlane, [], last * D)
        .to(proxy, { f: planeAt, duration: (planeAt - last) * D + 0.3, ease: "power1.out", onUpdate: placePlane }, last * D)
        .to(plane, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: "power2.out" });

      const st = ScrollTrigger.create({ ...once(row, "top 78%"), onEnter: () => void tl.play() });
      cleanups.push(() => {
        st.kill();
        tl.kill();
        gsap.set([mask, ...markers, ...steps, plane], { clearProps: "all" });
      });
    }
  } else {
    const list = section.querySelector<HTMLElement>("[data-pathway-mobile]");
    const line = list?.querySelector<HTMLElement>("[data-route-v]");
    const plane = list?.querySelector<HTMLElement>("[data-route-v-plane]");
    const steps = list ? $$(list, "[data-step]") : [];
    if (list && line && plane && steps.length) {
      const reach = (step: HTMLElement) => {
        const marker = step.querySelector<HTMLElement>("[data-v-marker]");
        const y = step.offsetTop + (marker ? marker.offsetTop + marker.offsetHeight / 2 : 0);
        return clamp01((y - line.offsetTop) / line.offsetHeight);
      };
      gsap.set(line, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(plane, { opacity: 0, y: -12 });
      const triggers = steps.map((step, i) => {
        const marker = step.querySelector<HTMLElement>("[data-v-marker]");
        const body = Array.from(step.children).filter((el) => el !== marker);
        if (marker) gsap.set(marker, { scale: 0 });
        gsap.set(body, { opacity: 0, y: 24 });
        return ScrollTrigger.create({
          ...once(step, "top 85%"),
          onEnter: () => {
            const isLast = i === steps.length - 1;
            gsap.to(line, { clipPath: `inset(0% 0% ${isLast ? 0 : (1 - reach(step)) * 100}% 0%)`, duration: 0.6, ease: "power2.out" });
            if (marker) gsap.to(marker, { scale: 1, duration: 0.45, ease: "back.out(2.2)", delay: 0.2 });
            gsap.to(body, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.25 });
            if (isLast) gsap.to(plane, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });
          },
        });
      });
      cleanups.push(() => {
        triggers.forEach((t) => t.kill());
        gsap.set([line, plane, ...$$(list, "[data-step] > *")], { clearProps: "all" });
      });
    }
  }
  return () => cleanups.forEach((fn) => fn());
}

/* ---------------------------------------------------------------------------------------- */
/* Testimonials — windows slide in from the right                                            */
/* ---------------------------------------------------------------------------------------- */

export function setupSeats(section: HTMLElement): Cleanup {
  const seats = $$(section, "[data-seat]").slice(0, 8);
  if (!seats.length) return noop;
  const tween = gsap.from(seats, {
    x: 160,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.07,
    clearProps: "transform,opacity",
    scrollTrigger: once(seats[0]!.parentElement!, "top 85%"),
  });
  return () => (tween.scrollTrigger?.kill(), tween.kill());
}

/* ---------------------------------------------------------------------------------------- */
/* Counselling — the photo zooms slightly                                                    */
/* ---------------------------------------------------------------------------------------- */

export function setupCounselling(section: HTMLElement): Cleanup {
  const photo = section.querySelector("[data-cta-photo]");
  if (!photo) return noop;
  const tween = gsap.fromTo(
    photo,
    { scale: 1 },
    { scale: 1.08, ease: "none", scrollTrigger: { trigger: section, start: "top 95%", end: "top 20%", scrub: 0.4 } },
  );
  return () => (tween.scrollTrigger?.kill(), tween.kill(), gsap.set(photo, { clearProps: "all" }));
}

/* ---------------------------------------------------------------------------------------- */
/* TAKE OFF band — amber fill (scrubbed) + a climbing flyby                                  */
/* ---------------------------------------------------------------------------------------- */

export function setupTakeoffBand(section: HTMLElement): Cleanup {
  const fill = section.querySelector<HTMLElement>("[data-band-fill]");
  const flyby = section.querySelector<HTMLElement>("[data-flyby]");
  const cleanups: Cleanup[] = [];
  if (fill) {
    const tween = gsap.fromTo(
      fill,
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 45%", scrub: 0.4 } },
    );
    cleanups.push(() => (tween.scrollTrigger?.kill(), tween.kill()));
  }
  if (flyby) {
    let tl: gsap.core.Timeline | null = null;
    const st = ScrollTrigger.create({ ...once(section, "top 55%"), onEnter: () => void (tl = flybyTimeline(flyby, 2.4))?.play() });
    cleanups.push(() => (st.kill(), tl?.kill()));
  }
  return () => cleanups.forEach((fn) => fn());
}

/* ---------------------------------------------------------------------------------------- */
/* Footer — the wordmark rises letter by letter                                              */
/* ---------------------------------------------------------------------------------------- */

export function setupWordmark(footer: HTMLElement): Cleanup {
  const mark = footer.querySelector<HTMLElement>("[data-wordmark]");
  if (!mark) return noop;
  const text = mark.textContent ?? "";
  mark.textContent = "";
  const letters = Array.from(text).map((ch) => {
    const el = document.createElement("span");
    el.textContent = ch === " " ? " " : ch;
    el.style.display = "inline-block";
    mark.append(el);
    return el;
  });
  const tween = gsap.from(letters, { yPercent: 105, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.04, scrollTrigger: once(mark, "top 98%") });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    mark.textContent = text;
  };
}
