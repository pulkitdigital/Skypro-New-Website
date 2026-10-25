import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Medal } from "@phosphor-icons/react/dist/ssr/Medal";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { headings } from "@/data/sections";
import { deferredSection } from "@/lib/sectionSizes";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FacultyCards } from "./FacultyCards";

/** Server wrapper: the icons render here, outside the client bundle. */
export function Faculty() {
  const h = headings.faculty;
  const cv = deferredSection("faculty");
  return (
    <section
      id="faculty"
      aria-labelledby="faculty-title"
      className={`relative bg-white py-20 md:py-28 ${cv.className}`}
      style={cv.style}
    >
      <div className="container-x">
        <SectionHeading id="faculty-title" title={h.title} className="mb-10 max-w-3xl md:mb-14" />
        <FacultyCards
          label={h.title}
          icons={{
            arrow: <ArrowRight weight="light" aria-hidden className="size-4" />,
            prev: <ArrowLeft weight="light" aria-hidden className="size-5" />,
            next: <ArrowRight weight="light" aria-hidden className="size-5" />,
            close: <X weight="light" aria-hidden className="size-5" />,
            play: <Play weight="light" aria-hidden />,
            medal: <Medal weight="light" aria-hidden className="size-[18px]" />,
            clock: <Clock weight="light" aria-hidden className="size-[18px]" />,
          }}
        />
      </div>
    </section>
  );
}
