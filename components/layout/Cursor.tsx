"use client";

import { useEffect, useRef } from "react";
import { AirplaneTilt } from "@phosphor-icons/react/dist/csr/AirplaneTilt";
import { gsap } from "@/lib/gsap";

/*
 * Aviation cursor (desktop: fine pointer, no reduced motion — mounted by the lazy motion
 * runtime). The native cursor stays visible; these are followers on top of it.
 *
 * 1. HUD reticle: a 32px ring with four ticks (auto-contrast via mix-blend-mode: difference)
 *    that trails the pointer (gsap.quickTo), plus a 4px amber dot that follows instantly.
 *    Over a / button / [role=button] / [data-cursor] it grows to 56px, turns amber and the
 *    ticks close in (target lock); mousedown squeezes it to 0.85. Hidden over form fields and
 *    iframes (the native text cursor shows there).
 * 2. Context labels: [data-cursor="play" | "drag" | "view" | "explore"] turn the ring into a
 *    72px amber disc with the label ("drag" only where the element really scrolls sideways).
 * 3. Plane: inside [data-cursor-zone="plane"] the reticle becomes a small amber plane that
 *    turns to face its direction of travel and leaves a short fading contrail.
 *
 * One gsap ticker callback, transform/opacity only, pointer-events: none everywhere. Each
 * layer is its own fixed element (so the ring's blend mode blends with the page), z-index 60:
 * above the content and header, below dialogs (z 70+).
 */

type Mode = "idle" | "hover" | "label" | "hidden" | "plane";

const LABELS = { play: "Play", drag: "Drag", view: "View", explore: "Explore" } as const;
const TARGETS =
  "[data-cursor], a, button, [role=button], input, textarea, select, iframe, [contenteditable=true]";
const FIELDS = /^(INPUT|TEXTAREA|SELECT|IFRAME)$/;
const TRAIL = 12;

/** Ring scale per mode (the drawn ring is 72px: 32 / 56 / 72 px on screen). */
const SCALE: Record<Mode, number> = { idle: 32 / 72, hover: 56 / 72, label: 1, hidden: 0.3, plane: 0.3 };

const css = `
.hud-layer { position: fixed; left: 0; top: 0; z-index: 60; pointer-events: none; will-change: transform; }
.hud-ring { width: 0; height: 0; mix-blend-mode: difference; }
.hud-ring[data-mode="hover"], .hud-ring[data-mode="label"] { mix-blend-mode: normal; }
.hud-ring__svg, .hud-ring__disc, .hud-ring__label {
  position: absolute; left: -36px; top: -36px; width: 72px; height: 72px;
  transition: transform .25s cubic-bezier(.22,1,.36,1), opacity .25s ease, color .25s ease;
}
.hud-ring__svg { color: #fff; transform: scale(calc(var(--s) * var(--press, 1))); }
/* amber lock with a thin navy halo, so it reads on amber buttons too */
.hud-ring[data-mode="hover"] .hud-ring__svg { color: var(--color-amber); filter: drop-shadow(0 0 1px rgb(0 31 63 / .95)) drop-shadow(0 0 1px rgb(0 31 63 / .95)); }
.hud-ring[data-mode="label"] .hud-ring__svg { opacity: 0; }
.hud-ring[data-mode="hidden"] .hud-ring__svg, .hud-ring[data-mode="plane"] .hud-ring__svg { opacity: 0; }
.hud-ring__tick { transition: transform .25s cubic-bezier(.22,1,.36,1); }
.hud-ring[data-mode="hover"] .hud-ring__tick { transform: translate(var(--tx), var(--ty)); }
.hud-ring__disc { border-radius: 9999px; background: var(--color-amber); opacity: 0; transform: scale(.4); box-shadow: 0 0 0 1px rgb(0 31 63 / .3), 0 10px 24px -10px rgb(0 31 63 / .6); }
.hud-ring[data-mode="label"] .hud-ring__disc { opacity: 1; transform: scale(var(--press, 1)); }
.hud-ring__label {
  display: flex; align-items: center; justify-content: center; opacity: 0;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--color-navy);
}
.hud-ring[data-mode="label"] .hud-ring__label { opacity: 1; }
.hud-dot { width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 9999px; background: var(--color-amber); box-shadow: 0 0 0 1.5px rgb(0 31 63 / .75); transition: opacity .2s ease; }
.hud-dot[data-mode="hidden"], .hud-dot[data-mode="plane"], .hud-dot[data-mode="label"] { opacity: 0; }
.hud-plane { width: 22px; height: 22px; margin: -11px 0 0 -11px; color: var(--color-amber); opacity: 0; transition: opacity .2s ease; }
.hud-plane[data-on] { opacity: 1; }
.hud-trail { position: fixed; inset: 0; z-index: 60; pointer-events: none; width: 100vw; height: 100vh; overflow: visible; opacity: 0; transition: opacity .3s ease; }
.hud-trail[data-on] { opacity: 1; }
`;

/** Ticks at 0/90/180/270° on the 72px ring; on lock they move 6px towards the centre (in ring units). */
const TICKS = [
  { x1: 36, y1: 2, x2: 36, y2: 10, tx: "0px", ty: "6px" },
  { x1: 70, y1: 36, x2: 62, y2: 36, tx: "-6px", ty: "0px" },
  { x1: 36, y1: 70, x2: 36, y2: 62, tx: "0px", ty: "-6px" },
  { x1: 2, y1: 36, x2: 10, y2: 36, tx: "6px", ty: "0px" },
];

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGSVGElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ringEl = ring.current;
    const dotEl = dot.current;
    const planeEl = plane.current;
    const trailEl = trail.current;
    const labelEl = label.current;
    if (!ringEl || !dotEl || !planeEl || !trailEl || !labelEl) return;
    const svgEl = ringEl.querySelector<SVGSVGElement>(".hud-ring__svg")!;
    const line = trailEl.querySelector("polyline")!;
    const grad = trailEl.querySelector("linearGradient")!;

    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.35, ease: "power3" });
    const pos = { x: -100, y: -100, seen: false };
    const points: { x: number; y: number }[] = [];
    let mode: Mode = "hidden";
    let angle = -45;
    let last = { x: 0, y: 0 };

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      ringEl.dataset.mode = next;
      dotEl.dataset.mode = next;
      svgEl.style.setProperty("--s", String(SCALE[next]));
      const isPlane = next === "plane";
      planeEl.toggleAttribute("data-on", isPlane);
      trailEl.toggleAttribute("data-on", isPlane);
      if (!isPlane) points.length = 0;
    };

    /** What the pointer is over → mode (+ label text). */
    const resolve = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      if (!el || !pos.seen) return setMode("hidden");
      if (el.closest('[data-cursor-zone="plane"]')) return setMode("plane");
      const hit = el.closest<HTMLElement>(TARGETS);
      if (!hit) return setMode("idle");
      if (FIELDS.test(hit.tagName) || hit.isContentEditable) return setMode("hidden");
      const kind = hit.dataset.cursor as keyof typeof LABELS | undefined;
      if (kind && LABELS[kind] && (kind !== "drag" || hit.scrollWidth > hit.clientWidth + 4)) {
        labelEl.textContent = LABELS[kind];
        return setMode("label");
      }
      // a [data-cursor="drag"] row that doesn't scroll at this size: treat what's under it normally
      if (kind === "drag") return setMode(el.closest("a, button, [role=button]") ? "hover" : "idle");
      setMode("hover");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return setMode("hidden");
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!pos.seen) {
        pos.seen = true;
        gsap.set(ringEl, { x: pos.x, y: pos.y });
      }
      gsap.set(dotEl, { x: pos.x, y: pos.y });
      ringX(pos.x);
      ringY(pos.y);
      resolve(e.target);
    };
    const onOver = (e: PointerEvent) => e.pointerType === "mouse" && resolve(e.target);
    const onDown = () => svgEl.style.setProperty("--press", "0.85");
    const onUp = () => svgEl.style.removeProperty("--press");
    const hide = () => {
      pos.seen = false;
      setMode("hidden");
    };
    const onLeave = (e: MouseEvent) => !e.relatedTarget && hide();

    // the single ticker callback: the plane and its contrail
    const tick = () => {
      if (mode !== "plane") return;
      const vx = pos.x - last.x;
      const vy = pos.y - last.y;
      last = { x: pos.x, y: pos.y };
      if (vx * vx + vy * vy > 0.6) {
        const target = (Math.atan2(vy, vx) * 180) / Math.PI + 45; // the icon points north-east
        angle += (((((target - angle) % 360) + 540) % 360) - 180) * 0.2; // shortest turn, smoothed
      }
      gsap.set(planeEl, { x: pos.x, y: pos.y, rotation: angle });
      points.push({ x: pos.x, y: pos.y });
      if (points.length > TRAIL) points.shift();
      line.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "));
      const tail = points[0]!;
      Object.entries({ x1: tail.x, y1: tail.y, x2: pos.x, y2: pos.y }).forEach(([k, v]) =>
        grad.setAttribute(k, String(v)),
      );
    };

    setMode("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", hide);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", hide);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div aria-hidden>
      <style>{css}</style>
      <svg ref={trail} className="hud-trail" fill="none">
        <defs>
          <linearGradient id="hud-trail-gradient" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <polyline
          stroke="url(#hud-trail-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div ref={ring} className="hud-layer hud-ring" data-mode="hidden">
        <svg
          className="hud-ring__svg"
          viewBox="0 0 72 72"
          fill="none"
          style={{ "--s": SCALE.hidden } as React.CSSProperties}
        >
          <circle
            cx="36"
            cy="36"
            r="34"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {TICKS.map((t, i) => (
            <line
              key={i}
              className="hud-ring__tick"
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              style={{ "--tx": t.tx, "--ty": t.ty } as React.CSSProperties}
            />
          ))}
        </svg>
        <span className="hud-ring__disc" />
        <span ref={label} className="hud-ring__label" />
      </div>
      <div ref={dot} className="hud-layer hud-dot" data-mode="hidden" />
      <div ref={plane} className="hud-layer hud-plane">
        <AirplaneTilt weight="fill" className="size-[22px]" />
      </div>
    </div>
  );
}
