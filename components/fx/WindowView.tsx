import { cn } from "@/lib/utils";

/** Cloud clusters inside the window: [left %, top %, width %, opacity]; three depths. */
const CLUSTERS: { depth: 1 | 2 | 3; puffs: [number, number, number, number][] }[] = [
  {
    depth: 1,
    puffs: [
      [-6, 30, 40, 0.45],
      [44, 26, 36, 0.4],
      [22, 40, 30, 0.35],
      [70, 38, 34, 0.4],
    ],
  },
  {
    depth: 2,
    puffs: [
      [-14, 52, 58, 0.75],
      [34, 56, 54, 0.7],
      [72, 50, 46, 0.65],
      [10, 64, 44, 0.7],
    ],
  },
  {
    depth: 3,
    puffs: [
      [-24, 72, 74, 1],
      [26, 78, 78, 1],
      [64, 72, 70, 0.95],
      [-6, 88, 80, 1],
      [46, 92, 84, 1],
    ],
  },
];

/**
 * An aircraft window (thick ivory frame, inner shadow, half-drawn shade) looking out at a high
 * sky — navy fading to mist with a faint amber horizon — over three depths of cloud. The motion
 * runtime moves the depths at different speeds as the section scrolls (`[data-window-depth]`),
 * so it feels like looking out of a flying plane. Tall on desktop; a wide banner below lg.
 */
export function WindowView({ className }: { className?: string }) {
  return (
    <div aria-hidden data-window className={cn("window-frame", className)}>
      <div className="window-glass aspect-[16/9] lg:aspect-[3/4]">
        <div
          data-window-depth="0"
          className="absolute -inset-[10%]"
          style={{
            background:
              "radial-gradient(70% 22% at 50% 58%, rgb(244 178 33 / 0.28), transparent 70%), linear-gradient(180deg, var(--color-navy-deep) 0%, var(--color-navy) 22%, color-mix(in srgb, var(--color-navy) 45%, var(--color-mist)) 48%, var(--color-mist) 74%)",
          }}
        />
        {CLUSTERS.map(({ depth, puffs }) => (
          <div key={depth} data-window-depth={depth} className="absolute -inset-x-[12%] -inset-y-[14%]">
            {puffs.map(([left, top, width, opacity], i) => (
              <span
                key={i}
                className={cn("cloud-puff", depth === 1 && i > 1 && "max-md:hidden")}
                style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${width * 0.4}%`, opacity }}
              />
            ))}
          </div>
        ))}
        {/* window shade, pulled down a little */}
        <div className="absolute inset-x-0 top-0 z-[4] h-[12%] bg-ivory shadow-[0_6px_14px_-6px_rgb(0_31_63/0.35)]">
          <span className="absolute bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-navy/15" />
        </div>
      </div>
    </div>
  );
}
