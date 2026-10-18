/* eslint-disable @next/next/no-img-element */
import { TAKEOFF } from "@/lib/takeoff";

/*
 * Runway takeoff scene (illustration over a photo). The scene has the photo's own aspect (2:3)
 * and covers its panel like object-fit: cover (container query units), so the runway edge
 * lights and the plane line up with the runway in the photo at any panel size.
 *
 * Geometry (scene units, x 0–100 / y 0–150) lives in lib/takeoff.ts, shared with the runtime.
 *
 * The static markup is the FINAL frame (plane airborne, contrail drawn, lights on) — that is
 * what reduced motion and no-JS show. The motion runtime rewinds it and drives it with the
 * scroll (desktop) or plays it once (phones/tablets).
 */
/** Edge lights: from near (frame edge) to far (horizon), closer together with distance. */
const LIGHTS = Array.from({ length: 8 }, (_, i) => {
  const t = 1 - Math.pow(0.72, i + 0.6); // 0 → ~1 with perspective spacing
  return { t, size: 7 - i * 0.65 };
});
const VP = TAKEOFF.vanishing;
const EDGE_Y = TAKEOFF.edgeY;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function RunwayTakeoff({ photo, plane }: { photo: string; plane: string }) {
  return (
    <div aria-hidden data-takeoff-scene className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [container-type:size]">
      <div
        className="absolute top-[58%] left-1/2 aspect-[2/3] -translate-x-1/2 -translate-y-[58%] [container-type:inline-size]"
        style={{ width: "max(100cqw, 66.667cqh)" }}
      >
        <div data-takeoff-photo className="absolute inset-0" style={{ transform: "scale(1.08)" }}>
          <img src={photo} alt="" width={1024} height={1536} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        {/* navy overlay — lightens as the plane climbs */}
        <div data-takeoff-overlay className="absolute inset-0 bg-navy-deep opacity-[0.55]" />
        {/* sunset glow on the horizon */}
        <div
          className="absolute inset-x-0 h-[30%] -translate-y-1/2 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(244_178_33/0.28),transparent)]"
          style={{ top: pct(VP.y, 150) }}
        />

        {/* runway edge lights (both sides), lit near → far */}
        {[0, 100].map((x0) =>
          LIGHTS.map((l, i) => (
            <span
              key={`${x0}-${i}`}
              data-runway-light={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_10px_2px_rgb(244_178_33/0.7)]"
              style={{
                left: pct(x0 + (VP.x - x0) * l.t, 100),
                top: pct(EDGE_Y + (VP.y - EDGE_Y) * l.t, 150),
                width: `${l.size}px`,
                height: `${l.size}px`,
              }}
            />
          )),
        )}

        {/* contrail */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 150" preserveAspectRatio="none" fill="none">
          <path
            data-takeoff-trail
            d={TAKEOFF.climb}
            pathLength={1}
            stroke="white"
            strokeOpacity="0.85"
            strokeWidth="0.45"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="0"
          />
        </svg>

        {/* plane: positioned at the start, transformed to the final (airborne) frame */}
        <div
          data-takeoff-plane
          className="absolute w-[30%]"
          style={{
            left: pct(TAKEOFF.start.x, 100),
            top: pct(TAKEOFF.start.y, 150),
            transform: `translate(-50%, -50%) translate(${TAKEOFF.end.x - TAKEOFF.start.x}cqw, ${TAKEOFF.end.y - TAKEOFF.start.y}cqw) rotate(-12deg) scale(${TAKEOFF.endScale})`,
          }}
        >
          <img src={plane} alt="" width={640} height={295} loading="lazy" decoding="async" className="h-auto w-full drop-shadow-[0_8px_10px_rgb(0_0_0/0.35)]" />
        </div>
      </div>
    </div>
  );
}
