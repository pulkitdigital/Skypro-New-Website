import type { CSSProperties } from "react";

/**
 * Below-the-fold sections use `content-visibility: auto`, so the browser skips their
 * layout/paint until they approach the viewport (first paint on phones went from ~1.6 s
 * to ~0.4 s in Lighthouse). These measured heights (px: phone / tablet / desktop) are the
 * placeholders until a section has rendered once (`auto` then remembers the real size),
 * keeping scroll positions and in-page jumps accurate. Re-measure if a section changes a lot:
 * see scripts/qa/section-heights.mjs.
 */
const SIZES = {
  courses: [5091, 6568, 4720],
  batches: [818, 704, 449],
  "why-choose": [2147, 2091, 1625],
  faculty: [764, 828, 797],
  requirements: [2449, 1703, 1148],
  pathway: [1433, 1165, 817],
  testimonials: [858, 944, 878],
  life: [553, 640, 730],
  enquiry: [2274, 1716, 1275],
  faq: [1265, 1198, 927],
  blogs: [1705, 1516, 1019],
  counselling: [940, 761, 782],
  footer: [1561, 1364, 786],
} as const;

export type DeferredSection = keyof typeof SIZES;

export function deferredSection(id: DeferredSection): { className: string; style: CSSProperties } {
  const [m, t, d] = SIZES[id];
  return {
    className: "cv-auto",
    style: { "--cis-m": `${m}px`, "--cis-t": `${t}px`, "--cis-d": `${d}px` } as CSSProperties,
  };
}
