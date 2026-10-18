import { cn } from "@/lib/utils";

/**
 * Faint aeronautical-chart texture (static SVG file → no hydration cost). Used in two dark
 * sections only: the hero intro and the pathway.
 */
export function ChartLines({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      aria-hidden
      alt=""
      src="/media/decor/chart-lines.svg"
      width={1440}
      height={900}
      loading="lazy"
      decoding="async"
      className={cn("pointer-events-none absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
