import { windowView } from "@/data/media";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

/**
 * An aircraft window (thick ivory frame, inner shadow, half-drawn shade) looking out at a wing above
 * sunlit clouds. The motion runtime drifts the view as the section scrolls (`[data-window-depth]`;
 * the layer is 20% larger than the glass so its edges never show). Tall on desktop; a wide banner
 * below lg.
 */
export function WindowView({ className }: { className?: string }) {
  return (
    <div aria-hidden data-window className={cn("window-frame", className)}>
      <div className="window-glass aspect-[16/9] lg:aspect-[3/4]">
        <div data-window-depth="0" className="absolute -inset-[10%]">
          <Img image={windowView} fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-[50%_45%]" />
        </div>
        {/* window shade, pulled down a little */}
        <div className="absolute inset-x-0 top-0 z-[4] h-[12%] bg-ivory shadow-[0_6px_14px_-6px_rgb(0_31_63/0.35)]">
          <span className="absolute bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-navy/15" />
        </div>
      </div>
    </div>
  );
}
