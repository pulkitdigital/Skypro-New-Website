"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BP } from "@/lib/breakpoints";
import { afterLoad } from "@/lib/useAfterLoad";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** GSAP, ScrollTrigger, Lenis and every scroll animation live in this lazily loaded chunk. */
const MotionRuntime = dynamic(() => import("./runtime/MotionRuntime"), { ssr: false });

/**
 * Loads the motion runtime after `load` + an idle slot, so it is ready before the first
 * scroll (mounting mid-scroll would make ScrollTrigger's first refresh interrupt it).
 * Never loaded for prefers-reduced-motion: content is fully static and visible without it.
 */
export function MotionLayer() {
  const reduced = useMediaQuery(BP.reduce);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    afterLoad().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  if (!ready || reduced) return null;
  return <MotionRuntime />;
}
