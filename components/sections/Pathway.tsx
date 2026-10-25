import { Airplane } from "@phosphor-icons/react/dist/ssr/Airplane";
import { headings } from "@/data/sections";
import { pathwaySteps } from "@/data/pathway";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChartLines } from "@/components/backgrounds/ChartLines";
import { deferredSection } from "@/lib/sectionSizes";

/*
 * Desktop route (viewBox units): six waypoints on a baseline, one per text column, joined by
 * shallow flight arcs; after the last waypoint the route climbs off to the top-right, where the
 * plane sits.
 */
const ROUTE_W = 1200;
const ROUTE_H = 110;
const BASE = 84;
const COL = ROUTE_W / pathwaySteps.length;
const waypoints = pathwaySteps.map((_, i) => ({ x: i * COL + 12, y: BASE }));
const END = { x: ROUTE_W, y: 22 };

function arcs(points: { x: number; y: number }[]) {
  let prev = points[0]!;
  let d = `M ${prev.x} ${prev.y}`;
  for (const p of points.slice(1)) {
    const dx = (p.x - prev.x) / 2;
    d += ` C ${prev.x + dx} ${prev.y - 44}, ${p.x - dx} ${p.y - 44}, ${p.x} ${p.y}`;
    prev = p;
  }
  return d;
}
const ROUTE_D = arcs([...waypoints, END]);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The page's main aviation moment. Once, as it scrolls in, the dashed route draws from left to
 * right, each numbered circle pops in as the line reaches it (its text fades up), and the plane
 * flies the last curve and settles at the end (motion runtime). Phones/tablets: the route runs
 * down the left side. Without the runtime everything is simply shown.
 */
export function Pathway() {
  const h = headings.pathway;
  const cv = deferredSection("pathway");
  return (
    <section
      id="pathway"
      className={`tone-dark relative overflow-hidden bg-navy-deep text-white ${cv.className}`}
      style={cv.style}
    >
      <div className="relative py-20 md:py-28">
        <ChartLines />
        <div className="container-x relative">
          <SectionHeading title={h.title} tone="dark" className="mb-12 max-w-3xl lg:mb-16" />

          {/* Desktop: wavy route, text under each waypoint */}
          <div data-pathway-desktop className="hidden lg:block">
            <div data-route-row className="relative" style={{ height: ROUTE_H }}>
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${ROUTE_W} ${ROUTE_H}`}
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <mask id="pathway-route-mask" maskUnits="userSpaceOnUse" x="-20" y="-40" width={ROUTE_W + 40} height={ROUTE_H + 80}>
                    <path data-route-mask d={ROUTE_D} stroke="white" strokeWidth="24" fill="none" />
                  </mask>
                </defs>
                <path
                  data-route
                  d={ROUTE_D}
                  mask="url(#pathway-route-mask)"
                  stroke="var(--color-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {waypoints.map((p, i) => (
                <span
                  key={i}
                  data-step-marker={i + 1}
                  data-x={p.x}
                  aria-hidden
                  className="absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber font-mono text-[11px] font-bold text-navy"
                  style={{ left: `${(p.x / ROUTE_W) * 100}%`, top: p.y }}
                >
                  {i + 1}
                </span>
              ))}
              <span
                data-route-plane
                aria-hidden
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-amber"
                style={{ left: "98%", top: 26 }}
              >
                <Airplane weight="fill" className="size-7 rotate-90" />
              </span>
            </div>

            <ol className="mt-8 grid grid-cols-6 gap-x-6">
              {pathwaySteps.map((step) => (
                <li key={step.step} data-step={step.step} className="flex flex-col gap-3 pr-2">
                  <p className="label tracking-[0.18em] text-amber">Step {pad(step.step)}</p>
                  <h3 className="font-display text-[22px] leading-[1.05] font-semibold text-white">{step.title}</h3>
                  <p className="text-[15px] leading-relaxed text-white/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Phones / tablets: vertical route down the left side */}
          <ol data-pathway-mobile className="relative flex flex-col gap-10 pb-14 pl-14 lg:hidden">
            <span data-route-v aria-hidden className="dash-y absolute top-3 bottom-12 left-[13.5px]" />
            <span data-route-v-plane aria-hidden className="absolute bottom-0 left-[14px] -translate-x-1/2 text-amber">
              <Airplane weight="fill" className="size-7 rotate-180" />
            </span>
            {pathwaySteps.map((step) => (
              <li key={step.step} data-step={step.step} className="relative flex flex-col gap-2.5">
                <span
                  data-v-marker
                  aria-hidden
                  className="absolute top-0 -left-14 flex size-7 items-center justify-center rounded-full bg-amber font-mono text-[11px] font-bold text-navy"
                >
                  {step.step}
                </span>
                <p className="label tracking-[0.18em] text-amber">Step {pad(step.step)}</p>
                <h3 className="font-display text-[22px] leading-[1.05] font-semibold text-white">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-white/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
