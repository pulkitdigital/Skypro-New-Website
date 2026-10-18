"use client";

import { useEffect, useState } from "react";

export const HERO_ID = "top";

/**
 * Tracks scroll position relative to the hero.
 * `passed` = the hero is (almost) scrolled out; `direction` = last scroll direction.
 */
export function useHeroScroll(offset = 88) {
  // Only booleans/enums are stored, so React re-renders on changes, not on every scroll frame.
  const [state, setState] = useState({ passed: false, direction: "up" as "up" | "down", deep: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const hero = document.getElementById(HERO_ID);
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const y = window.scrollY;
      const delta = y - lastY;
      setState((prev) => {
        const direction = Math.abs(delta) < 4 ? prev.direction : delta > 0 ? "down" : "up";
        const passed = y > heroBottom - offset;
        const deep = y > 600;
        if (prev.passed === passed && prev.direction === direction && prev.deep === deep) return prev;
        return { passed, direction, deep };
      });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset]);

  return state;
}
