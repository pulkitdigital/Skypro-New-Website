import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { deferredSection } from "@/lib/sectionSizes";
import { CloudLayer } from "@/components/fx/CloudLayer";
import { TestimonialGrid } from "./TestimonialGrid";

/** Server wrapper: the icons render here, outside the client bundle. */
export function Testimonials() {
  const cv = deferredSection("testimonials");
  return (
    <section id="testimonials" className={`relative overflow-hidden bg-mist py-20 md:py-28 ${cv.className}`} style={cv.style}>
      {/* soft clouds drifting behind the row of windows */}
      <CloudLayer shape="drift" name="seats" className="-inset-x-[10%] top-[34%] h-[52%]" />
      <div className="relative">
        <TestimonialGrid
          icons={{
            play: <Play weight="light" aria-hidden className="ml-1 size-7" />,
            close: <X weight="light" aria-hidden className="size-5" />,
            prev: <ArrowLeft weight="light" aria-hidden className="size-5" />,
            next: <ArrowRight weight="light" aria-hidden className="size-5" />,
          }}
        />
      </div>
    </section>
  );
}
