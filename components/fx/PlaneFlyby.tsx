import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr/AirplaneTilt";
import { cn } from "@/lib/utils";

/**
 * A plane that flies across its (positioned) parent once, along a gentle curve, leaving a
 * contrail that fades. Markup only: the motion runtime sizes the curve to the parent, flies the
 * plane with GSAP MotionPath and draws/fades the trail (transform/opacity + stroke offset).
 * Without the runtime (reduced motion, no JS) nothing is shown.
 *
 * - `across`: left → right with a soft dip (behind a heading)
 * - `climb`:  bottom-left → top-right (take-off)
 */
export function PlaneFlyby({
  id,
  path = "across",
  tone = "white",
  mobile = false,
  className,
}: {
  id: string;
  path?: "across" | "climb";
  tone?: "white" | "amber";
  /** Also fly on phones (the page allows one flyby there). */
  mobile?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-flyby={path}
      data-flyby-mobile={mobile ? "" : undefined}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", tone === "amber" ? "text-amber" : "text-white", className)}
    >
      <svg data-flyby-svg className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id={`${id}-trail`} data-flyby-gradient gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path data-flyby-trail stroke={`url(#${id}-trail)`} strokeWidth="2" strokeLinecap="round" opacity="0" />
      </svg>
      <span data-flyby-plane className="absolute top-0 left-0 opacity-0">
        <AirplaneTilt weight="fill" className="size-8 md:size-10" />
      </span>
    </div>
  );
}
