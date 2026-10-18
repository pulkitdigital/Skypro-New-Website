import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr/AirplaneTilt";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Medal } from "@phosphor-icons/react/dist/ssr/Medal";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { headings } from "@/data/sections";
import { deferredSection } from "@/lib/sectionSizes";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FacultyShowcase } from "./FacultyShowcase";

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
        <FacultyShowcase
          icons={{
            aircraft: <AirplaneTilt weight="light" aria-hidden className="size-[18px]" />,
            medal: <Medal weight="light" aria-hidden className="size-[18px]" />,
            clock: <Clock weight="light" aria-hidden className="size-[18px]" />,
            play: <Play weight="light" aria-hidden />,
            arrow: <ArrowRight weight="light" aria-hidden className="size-4" />,
          }}
        />
      </div>
    </section>
  );
}
