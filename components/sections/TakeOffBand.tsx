import { PlaneFlyby } from "@/components/fx/PlaneFlyby";

const WORD = "TAKE OFF";

/**
 * Decorative band before the footer: a giant outlined "TAKE OFF". Scrubbed with the scroll, the
 * letters fill with amber from left to right, and a plane climbs across the word once, leaving a
 * contrail (motion runtime). Without it the word is simply outlined.
 */
export function TakeOffBand() {
  return (
    <section aria-hidden data-takeoff-band data-cursor-zone="plane" className="relative overflow-hidden bg-navy-deep py-16 md:py-24">
      <div className="relative mx-auto w-max max-w-full px-[var(--gutter)]">
        <p className="outline-type text-[26vw] lg:text-[22vw]">{WORD}</p>
        <p
          data-band-fill
          className="outline-type absolute inset-0 px-[var(--gutter)] text-[26vw] text-amber [-webkit-text-stroke-color:var(--color-amber)] lg:text-[22vw]"
          style={{ clipPath: "inset(0% 100% 0% 0%)" }}
        >
          {WORD}
        </p>
      </div>
      <PlaneFlyby id="takeoff-flyby" path="climb" tone="amber" mobile />
    </section>
  );
}
