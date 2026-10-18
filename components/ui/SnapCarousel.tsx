"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Mouse drag-to-scroll for a horizontal scroll container (desktop). Snapping is paused while
 * dragging and restored on release; the click that ends a drag is swallowed. Touch keeps the
 * native swipe.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    let down = false;
    let suppressUntil = 0;
    // the click that ends a drag must not open a video
    const onClick = (e: MouseEvent) => {
      if (performance.now() > suppressUntil) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.dataset.dragging = "";
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
      delete el.dataset.dragging;
      if (moved) suppressUntil = performance.now() + 120;
    };
    el.addEventListener("click", onClick, { capture: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("click", onClick, { capture: true });
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ref, enabled]);
}

/**
 * Horizontal carousel on native scroll-snap (swipe works everywhere for free), plus arrows,
 * optional dots and optional mouse drag. `trackClassName` decides where it is a carousel
 * (e.g. `swipe-lg lg:grid …` keeps a grid on desktop); `controlsClassName` hides the controls
 * there. Children are the slides (<li>).
 */
export function SnapCarousel({
  label,
  children,
  trackClassName,
  controlsClassName,
  prevIcon,
  nextIcon,
  dots = false,
  drag = false,
  tone = "light",
}: {
  label: string;
  children: React.ReactNode;
  trackClassName?: string;
  controlsClassName?: string;
  prevIcon: React.ReactNode;
  nextIcon: React.ReactNode;
  dots?: boolean;
  drag?: boolean;
  tone?: "light" | "dark";
}) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [edges, setEdges] = useState({ prev: false, next: true });

  const slides = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const start = el.scrollLeft + parseFloat(getComputedStyle(el).paddingLeft || "0");
    let best = 0;
    items.forEach((item, i) => {
      if (Math.abs(item.offsetLeft - start) < Math.abs((items[best]?.offsetLeft ?? 0) - start)) best = i;
    });
    setCount(items.length);
    setIndex(best);
    setEdges({ prev: el.scrollLeft > 4, next: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), measure()));
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const mo = new MutationObserver(measure);
    mo.observe(el, { childList: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [measure]);

  useDragScroll(track, drag);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const first = slides()[0];
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    el.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: "smooth" });
  };
  const goTo = (i: number) => {
    const el = track.current;
    const item = slides()[i];
    if (!el || !item) return;
    el.scrollTo({
      left: item.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"),
      behavior: "smooth",
    });
  };

  const arrow = cn(
    "flex size-12 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-35",
    tone === "dark"
      ? "border-white/30 text-white hover:border-white"
      : "border-navy/25 text-navy hover:border-navy hover:bg-white",
  );

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        data-cursor={drag ? "drag" : undefined}
        className={cn(
          drag && "cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none",
          trackClassName,
        )}
      >
        {children}
      </ul>
      <div className={cn("mt-8 flex items-center justify-between gap-6", controlsClassName)}>
        {dots ? (
          <div className="flex items-center">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="flex size-11 cursor-pointer items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-[width,background-color] duration-300",
                    i === index ? "w-6 bg-amber" : cn("w-2", tone === "dark" ? "bg-white/35" : "bg-navy/25"),
                  )}
                />
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={!edges.prev}>
            {prevIcon}
            <span className="sr-only">Previous</span>
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={!edges.next}>
            {nextIcon}
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
