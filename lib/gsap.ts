"use client";

/*
 * GSAP setup. Imported ONLY by the lazily loaded motion runtime (components/motion/runtime),
 * so GSAP never weighs on the first-load bundle or startup.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BP } from "./breakpoints";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/* SplitText and MotionPath are code-split again and registered on demand. */
let splitText: Promise<typeof import("gsap/SplitText").SplitText> | null = null;
let motionPath: Promise<typeof import("gsap/MotionPathPlugin").MotionPathPlugin> | null = null;

export function loadSplitText() {
  splitText ??= import("gsap/SplitText").then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return splitText;
}

export function loadMotionPath() {
  motionPath ??= import("gsap/MotionPathPlugin").then(({ MotionPathPlugin }) => {
    gsap.registerPlugin(MotionPathPlugin);
    return MotionPathPlugin;
  });
  return motionPath;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(BP.reduce).matches;
}

export { BP, gsap, ScrollTrigger, useGSAP };
