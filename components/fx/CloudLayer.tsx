import { cn } from "@/lib/utils";

/** One puff: centre x/y and size, in % of the layer; `o` = opacity; `full` = desktop/tablet only. */
type Puff = { x: number; y: number; w: number; h: number; o?: number; full?: boolean };

/*
 * Cloud banks, laid out by hand once (deterministic, no random values in the markup):
 * - rise:  a dense bank along the middle/bottom (hero → intro transition)
 * - drift: loose wisps across the whole layer (behind card rows)
 * - left / right: half-width banks that part sideways (counselling CTA)
 */
const SHAPES: Record<"rise" | "drift" | "left" | "right", Puff[]> = {
  rise: [
    { x: 4, y: 70, w: 34, h: 70 },
    { x: 22, y: 58, w: 30, h: 80, o: 0.9 },
    { x: 40, y: 72, w: 36, h: 66 },
    { x: 58, y: 56, w: 30, h: 84, o: 0.92 },
    { x: 76, y: 70, w: 36, h: 70 },
    { x: 96, y: 60, w: 32, h: 80, o: 0.9 },
    { x: 14, y: 40, w: 22, h: 46, o: 0.55, full: true },
    { x: 50, y: 36, w: 24, h: 44, o: 0.5, full: true },
    { x: 86, y: 40, w: 22, h: 46, o: 0.55, full: true },
    { x: 32, y: 88, w: 40, h: 50, full: true },
    { x: 70, y: 90, w: 44, h: 50, full: true },
  ],
  drift: [
    { x: 8, y: 30, w: 26, h: 34, o: 0.7 },
    { x: 30, y: 62, w: 32, h: 40, o: 0.8 },
    { x: 58, y: 34, w: 28, h: 32, o: 0.6, full: true },
    { x: 80, y: 66, w: 34, h: 42, o: 0.8 },
    { x: 96, y: 28, w: 24, h: 30, o: 0.55, full: true },
    { x: 46, y: 86, w: 40, h: 30, o: 0.7, full: true },
  ],
  left: [
    { x: 10, y: 22, w: 46, h: 44 },
    { x: 26, y: 52, w: 56, h: 52, o: 0.95 },
    { x: 8, y: 80, w: 50, h: 50 },
    { x: 38, y: 86, w: 40, h: 40, o: 0.85, full: true },
    { x: 40, y: 18, w: 36, h: 34, o: 0.8, full: true },
  ],
  right: [
    { x: 90, y: 24, w: 46, h: 44 },
    { x: 74, y: 54, w: 56, h: 52, o: 0.95 },
    { x: 92, y: 82, w: 50, h: 50 },
    { x: 62, y: 84, w: 40, h: 40, o: 0.85, full: true },
    { x: 60, y: 20, w: 36, h: 34, o: 0.8, full: true },
  ],
};

/**
 * Soft cloud bank built from radial-gradient puffs. Decorative. The motion runtime moves the
 * whole layer (transform/opacity only) and toggles `.is-live` so the gentle drift runs only
 * while it is on screen; with reduced motion nothing moves. Phones get the lighter set.
 */
export function CloudLayer({
  shape,
  className,
  dim = 1,
  name,
}: {
  shape: keyof typeof SHAPES;
  className?: string;
  /** Overall opacity multiplier (e.g. lighter clouds over navy). */
  dim?: number;
  /** Hook for the motion runtime (`data-cloud="<name>"`). */
  name?: string;
}) {
  return (
    <div aria-hidden data-cloud={name ?? shape} className={cn("cloud-layer", className)}>
      {SHAPES[shape].map((p, i) => (
        <span
          key={i}
          className={cn("cloud-puff", p.full && "max-md:hidden")}
          style={
            {
              left: `${p.x - p.w / 2}%`,
              top: `${p.y - p.h / 2}%`,
              width: `${p.w}%`,
              height: `${p.h}%`,
              opacity: (p.o ?? 1) * dim,
              "--drift": `${30 + (i % 4) * 7}s`,
              "--delay": `${-i * 4.3}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
