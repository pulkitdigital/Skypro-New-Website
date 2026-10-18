import { gsap, ScrollTrigger } from "@/lib/gsap";
import { TAKEOFF } from "@/lib/takeoff";
import type { Conditions, SplitTextClass } from "./sections";

type Cleanup = () => void;
const noop: Cleanup = () => {};
const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });
const $$ = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => Array.from(root.querySelectorAll<T>(selector));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const pad = (n: number) => String(n).padStart(2, "0");

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
/* Clouds — drift only while on screen                                                       */
/* ---------------------------------------------------------------------------------------- */

export function watchClouds(): Cleanup {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)));
  $$(document, "[data-cloud]").forEach((el) => io.observe(el));
  return () => io.disconnect();
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
/* Hero intro — clouds thin out (phones/tablets) · flyby behind the H1 (tablet/desktop)       */
/* ---------------------------------------------------------------------------------------- */

export function setupIntro(section: HTMLElement, c: Conditions, Split: SplitTextClass | null): Cleanup {
  const cleanups: Cleanup[] = [];
  const clouds = section.querySelector<HTMLElement>('[data-cloud="hero-rise"]');
  if (clouds && !c.desktop) {
    // desktop: part of the pinned hero transition (sections.ts)
    const tween = gsap.fromTo(
      clouds,
      { yPercent: 0, opacity: 1 },
      { yPercent: -45, opacity: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 35%", scrub: true } },
    );
    cleanups.push(() => (tween.scrollTrigger?.kill(), tween.kill(), gsap.set(clouds, { clearProps: "all" })));
  }

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
 * up into place, card i-1 scales to 0.94 (from its top edge) and darkens, card i's plane
 * crosses its route line, and the "01 / 06" counter updates. Scroll positions are computed from
 * the (non-sticky) list and each card's natural offset, so they stay right while cards stick.
 */
export function setupCourses(section: HTMLElement, c: Conditions): Cleanup {
  const list = section.querySelector<HTMLElement>(".course-stack");
  const cards = $$(section, "[data-stack-card]");
  const counter = section.querySelector<HTMLElement>("[data-stack-index]");
  if (!list || !cards.length) return noop;
  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
  const triggers: ScrollTrigger[] = [];

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
      if (counter) {
        triggers.push(
          ScrollTrigger.create({
            start: () => arrive(i).end() - 2,
            onEnter: () => void (counter.textContent = pad(i + 1)),
            onLeaveBack: () => void (counter.textContent = pad(Math.max(1, i))),
          }),
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
    triggers.forEach((t) => t.kill());
    gsap.set($$(section, "[data-stack-photo], [data-stack-plane], [data-stack-sheet], [data-stack-dim]"), { clearProps: "transform,opacity" });
    if (counter) counter.textContent = "01";
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
/* Why Choose — window parallax + the point in the middle of the screen is brightest         */
/* ---------------------------------------------------------------------------------------- */

export function setupWindow(section: HTMLElement, c: Conditions): Cleanup {
  const tweens: gsap.core.Tween[] = [];
  const k = c.mobile ? 0.5 : 1;
  const scrub = { trigger: section, start: "top bottom", end: "bottom top", scrub: true };
  const amount: Record<string, [number, number]> = { "0": [0, 4], "1": [8, 2], "2": [16, 3], "3": [28, 5] };
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
/* Requirements — checks draw in · subject tiles flip in · cockpit gauge, bars, flight checks */
/* ---------------------------------------------------------------------------------------- */

export function setupRequirements(section: HTMLElement): Cleanup {
  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
  $$(section, "[data-check]").forEach((item) => {
    const tick = item.querySelector("[data-tick]");
    if (!tick) return;
    tweens.push(
      gsap.fromTo(
        tick,
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.out", delay: 0.1, scrollTrigger: once(item, "top 80%") },
      ),
    );
  });

  const tiles = $$(section, "[data-tile]");
  if (tiles.length) {
    tweens.push(
      gsap.from(tiles, {
        rotationX: -90,
        opacity: 0,
        transformPerspective: 600,
        transformOrigin: "50% 0%",
        duration: 0.6,
        ease: "back.out(1.4)",
        stagger: 0.12,
        clearProps: "transform,opacity",
        scrollTrigger: once(tiles[0]!.parentElement!, "top 85%"),
      }),
    );
  }

  const panel = section.querySelector<HTMLElement>("[data-cockpit]");
  const needle = panel?.querySelector<SVGGElement>("[data-gauge-needle]");
  const arc = panel?.querySelector<SVGPathElement>("[data-gauge-arc]");
  const value = panel?.querySelector<HTMLElement>("[data-gauge-value]");
  const bars = panel ? $$(panel, "[data-hours-bar]") : [];
  const checks = panel ? $$(panel, "[data-flight-check]") : [];
  const origin = panel?.querySelector<SVGSVGElement>("[data-gauge]")?.dataset.gaugeOrigin ?? "150 156";
  const total = Number(value?.textContent ?? 0);
  let restoreNeedle = noop;
  if (panel) {
    const counter = { v: 0 };
    const tl = gsap.timeline({ scrollTrigger: once(panel, "top 75%") });
    if (needle) {
      const attr = needle.getAttribute("transform") ?? "";
      needle.removeAttribute("transform");
      restoreNeedle = () => needle.setAttribute("transform", attr);
      tl.fromTo(needle, { rotation: -90, svgOrigin: origin }, { rotation: 90, svgOrigin: origin, duration: 1.4, ease: "power3.inOut" }, 0);
    }
    if (arc) tl.fromTo(arc, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power3.inOut" }, 0);
    if (value) {
      tl.fromTo(
        counter,
        { v: 0 },
        { v: total, duration: 1.4, ease: "power3.inOut", onUpdate: () => void (value.textContent = String(Math.round(counter.v))) },
        0,
      );
    }
    if (bars.length) tl.fromTo(bars, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.7, ease: "power3.out", stagger: 0.25 }, 0.9);
    if (checks.length) {
      tl.fromTo(
        checks,
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power2.out", stagger: 0.2 },
        1.9,
      );
    }
    tweens.push(tl);
  }

  return () => {
    tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
    gsap.set($$(section, "[data-tick], [data-flight-check]"), { clearProps: "clipPath" });
    if (needle) gsap.set(needle, { clearProps: "all" });
    restoreNeedle();
    if (arc) gsap.set(arc, { clearProps: "strokeDashoffset" });
    if (value) value.textContent = String(total);
    gsap.set(bars, { clearProps: "transform" });
  };
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
/* Testimonials — windows slide in from the right · clouds drift behind the row              */
/* ---------------------------------------------------------------------------------------- */

export function setupSeats(section: HTMLElement): Cleanup {
  const seats = $$(section, "[data-seat]").slice(0, 8);
  const clouds = section.querySelector<HTMLElement>('[data-cloud="seats"]');
  const tweens: gsap.core.Tween[] = [];
  if (seats.length) {
    tweens.push(
      gsap.from(seats, {
        x: 160,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        clearProps: "transform,opacity",
        scrollTrigger: once(seats[0]!.parentElement!, "top 85%"),
      }),
    );
  }
  if (clouds) {
    tweens.push(
      gsap.fromTo(clouds, { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } }),
    );
  }
  return () => tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
}

/* ---------------------------------------------------------------------------------------- */
/* Academy Life — every photo wipes in                                                       */
/* ---------------------------------------------------------------------------------------- */

export function setupLife(section: HTMLElement, c: Conditions): Cleanup {
  const tweens = $$(section, "[data-life-photo]").map((photo) =>
    c.mobile
      ? gsap.from(photo, { opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: once(photo, "top 95%") })
      : gsap.fromTo(
          photo,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out", scrollTrigger: once(photo, "top 92%") },
        ),
  );
  return () => tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
}

/* ---------------------------------------------------------------------------------------- */
/* Enquiry — runway takeoff (scrubbed on desktop, played once below it)                      */
/* ---------------------------------------------------------------------------------------- */

/**
 * One progress value p (0 → 1) drives the scene (components/fx/RunwayTakeoff.tsx):
 *   0–0.35    edge lights come on towards the horizon; the plane rolls forward, scaling up a little
 *   0.35–0.55 rotation: the nose pitches up 12°
 *   0.55–1    lift-off: the plane climbs to the top-right along the contrail path, shrinking; the
 *             contrail draws, the photo zooms 1 → 1.08 and the navy overlay lightens.
 * The markup holds the final frame (reduced motion / no JS); this rewinds and drives it.
 */
export function setupRunway(section: HTMLElement, c: Conditions): Cleanup {
  const panel = section.querySelector<HTMLElement>("[data-runway-panel]");
  const scene = panel?.querySelector<HTMLElement>("[data-takeoff-scene]")?.firstElementChild as HTMLElement | null | undefined;
  const plane = panel?.querySelector<HTMLElement>("[data-takeoff-plane]");
  const trail = panel?.querySelector<SVGPathElement>("[data-takeoff-trail]");
  const photo = panel?.querySelector<HTMLElement>("[data-takeoff-photo]");
  const overlay = panel?.querySelector<HTMLElement>("[data-takeoff-overlay]");
  const lights = panel ? $$(panel, "[data-runway-light]") : [];
  if (!panel || !scene || !plane || !trail) return noop;

  const saved = { plane: plane.style.transform, photo: photo?.style.transform ?? "" };
  const START = TAKEOFF.start;
  const ROLL_END = TAKEOFF.rollEnd;
  const steps = lights.length ? Math.max(...lights.map((l) => Number(l.dataset.runwayLight))) + 1 : 0;
  let length = 0;
  let litCount = -1;

  const render = (p: number) => {
    length ||= trail.getTotalLength();
    const unit = scene.offsetWidth / 100; // scene units → px (x and y share the unit)
    const roll = clamp01(p / 0.35);
    const pitch = clamp01((p - 0.35) / 0.2);
    const climb = clamp01((p - 0.55) / 0.45);

    const lit = Math.round(roll * steps);
    if (lit !== litCount) {
      litCount = lit;
      lights.forEach((l) => (l.style.opacity = Number(l.dataset.runwayLight) < lit ? "1" : "0.15"));
    }

    let x: number = START.x;
    let y = lerp(START.y, ROLL_END, roll * roll); // accelerating roll
    let scale = lerp(1, 1.06, roll);
    let rotation = -12 * pitch;
    if (climb > 0) {
      const pt = trail.getPointAtLength(climb * length);
      x = pt.x;
      y = pt.y;
      scale = lerp(1.06, TAKEOFF.endScale, climb);
      rotation = lerp(-12, -14, climb);
    }
    gsap.set(plane, { xPercent: -50, yPercent: -50, x: (x - START.x) * unit, y: (y - START.y) * unit, scale, rotation });
    trail.style.strokeDashoffset = String(1 - climb);
    if (photo) gsap.set(photo, { scale: 1 + 0.08 * climb });
    if (overlay) overlay.style.opacity = String(lerp(0.78, 0.55, climb));
  };

  const state = { p: 0 };
  render(0);
  const tween = c.desktop
    ? gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => render(state.p),
        // ends as the sticky panel lets go (section bottom ≈ 110% of the viewport)
        scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 110%", scrub: 1, onRefresh: () => render(state.p) },
      })
    : gsap.to(state, { p: 1, duration: 2.5, ease: "power1.inOut", paused: true, onUpdate: () => render(state.p) });
  const st = c.desktop ? null : ScrollTrigger.create({ ...once(panel, "top 70%"), onEnter: () => void tween.play() });

  return () => {
    st?.kill();
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set([plane, photo].filter(Boolean), { clearProps: "transform" });
    plane.style.transform = saved.plane;
    if (photo) photo.style.transform = saved.photo;
    trail.style.strokeDashoffset = "";
    if (overlay) overlay.style.opacity = "";
    lights.forEach((l) => (l.style.opacity = ""));
  };
}

/* ---------------------------------------------------------------------------------------- */
/* Counselling — the clouds part and the photo zooms (take-off feel)                         */
/* ---------------------------------------------------------------------------------------- */

export function setupCounselling(section: HTMLElement): Cleanup {
  const left = section.querySelector('[data-cloud="cta-left"]');
  const right = section.querySelector('[data-cloud="cta-right"]');
  const photo = section.querySelector("[data-cta-photo]");
  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 95%", end: "top 20%", scrub: 0.4 } });
  if (left) tl.fromTo(left, { xPercent: 0, opacity: 1 }, { xPercent: -75, opacity: 0.15, ease: "power1.in" }, 0);
  if (right) tl.fromTo(right, { xPercent: 0, opacity: 1 }, { xPercent: 75, opacity: 0.15, ease: "power1.in" }, 0);
  if (photo) tl.fromTo(photo, { scale: 1 }, { scale: 1.08, ease: "none" }, 0);
  return () => (tl.scrollTrigger?.kill(), tl.kill(), gsap.set([left, right, photo].filter(Boolean), { clearProps: "all" }));
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
    el.textContent = ch === " " ? " " : ch;
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
