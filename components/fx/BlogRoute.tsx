"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const W = 400;
const H = 120;
const ORIGIN = { x: 44, y: 92 };

/** One or two arcs from the origin; destination points in viewBox units. */
const ARCS = {
  one: [{ d: `M ${ORIGIN.x} ${ORIGIN.y} C 140 18, 262 18, 356 64`, end: { x: 356, y: 64 } }],
  two: [
    { d: `M ${ORIGIN.x} ${ORIGIN.y} C 150 22, 262 12, 356 42`, end: { x: 356, y: 42 } },
    { d: `M ${ORIGIN.x} ${ORIGIN.y} C 160 76, 262 96, 356 96`, end: { x: 356, y: 96 } },
  ],
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hoverDevice = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Route overlay for a blog image (illustration): a dashed amber arc from `from` to each
 * destination. It draws once when it scrolls into view; hovering the card (`.card`) flies a
 * small plane along each arc. Touch devices simply park the plane at the destination.
 */
export function BlogRoute({ from, to, plane }: { from: string; to: string[]; plane: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const planes = useRef<(HTMLSpanElement | null)[]>([]);
  const [drawn, setDrawn] = useState(false);
  const uid = useId().replace(/\W/g, "");
  const arcs = to.length > 1 ? ARCS.two : ARCS.one;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    const card = el?.closest<HTMLElement>(".card");
    if (!el || !card || !drawn) return;

    const place = (t: number) => {
      const { width, height } = el.getBoundingClientRect();
      const sx = width / W;
      const sy = height / H;
      paths.current.forEach((path, i) => {
        const node = planes.current[i];
        if (!path || !node) return;
        const len = path.getTotalLength();
        const p = path.getPointAtLength(len * t);
        const q = path.getPointAtLength(Math.min(len, len * t + 1));
        const angle = (Math.atan2((q.y - p.y) * sy, (q.x - p.x) * sx) * 180) / Math.PI;
        node.style.transform = `translate(${p.x * sx}px, ${p.y * sy}px) translate(-50%, -50%) rotate(${angle + 90}deg)`;
      });
    };
    const show = (on: boolean) => planes.current.forEach((n) => n && (n.style.opacity = on ? "1" : "0"));

    if (reduceMotion() || !hoverDevice()) {
      place(1);
      show(true);
      return;
    }

    let frame = 0;
    const fly = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      show(true);
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / 1400);
        place(1 - (1 - k) ** 3); // ease-out cubic
        if (k < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const land = () => {
      cancelAnimationFrame(frame);
      show(false);
    };
    card.addEventListener("pointerenter", fly);
    card.addEventListener("pointerleave", land);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointerenter", fly);
      card.removeEventListener("pointerleave", land);
    };
  }, [drawn]);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]">
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/55 to-transparent" />
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none">
        <defs>
          {arcs.map((arc, i) => (
            <mask key={i} id={`route-${uid}-${i}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width={W + 20} height={H + 20}>
              <path
                data-route-mask
                d={arc.d}
                stroke="white"
                strokeWidth="12"
                pathLength={1}
                strokeDasharray="1"
                style={{ strokeDashoffset: drawn ? 0 : 1, transition: `stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s` }}
              />
            </mask>
          ))}
        </defs>
        {arcs.map((arc, i) => (
          <path
            key={i}
            ref={(node) => void (paths.current[i] = node)}
            d={arc.d}
            mask={`url(#route-${uid}-${i})`}
            stroke="var(--color-amber)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {/* end points + labels */}
      <span className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber" style={{ left: pct(ORIGIN.x, W), top: pct(ORIGIN.y, H) }} />
      <span className="absolute -translate-x-1/2 text-[12px] leading-none font-medium text-white" style={{ left: pct(ORIGIN.x, W), top: `calc(${pct(ORIGIN.y, H)} + 8px)` }}>
        {from}
      </span>
      {arcs.map((arc, i) => (
        <span key={i}>
          <span
            className={cn("absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-500", drawn ? "opacity-100" : "opacity-0")}
            style={{ left: pct(arc.end.x, W), top: pct(arc.end.y, H), transitionDelay: `${1 + i * 0.15}s` }}
          />
          <span
            className={cn("absolute text-[12px] leading-none font-medium whitespace-nowrap text-white transition-opacity duration-500", drawn ? "opacity-100" : "opacity-0")}
            style={{ right: `calc(${pct(W - arc.end.x, W)} - 6px)`, top: `calc(${pct(arc.end.y, H)} + 8px)`, transitionDelay: `${1 + i * 0.15}s` }}
          >
            {to[i]}
          </span>
        </span>
      ))}
      {arcs.map((_, i) => (
        <span
          key={i}
          ref={(node) => void (planes.current[i] = node)}
          className="absolute top-0 left-0 text-amber opacity-0 transition-opacity duration-300"
        >
          {plane}
        </span>
      ))}
    </div>
  );
}
