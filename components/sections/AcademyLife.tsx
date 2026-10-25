import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowsOut } from "@phosphor-icons/react/dist/ssr/ArrowsOut";
import { Pause } from "@phosphor-icons/react/dist/ssr/Pause";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { deferredSection } from "@/lib/sectionSizes";
import { headings } from "@/data/sections";
import { lifeGallery } from "@/data/media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LifeGallery } from "./LifeGallery";

export function AcademyLife() {
  const cv = deferredSection("life");
  const h = headings.life;
  return (
    <section
      id="life"
      className={`tone-dark relative overflow-hidden bg-navy-deep py-20 text-white md:py-28 ${cv.className}`}
      style={cv.style}
    >
      <div className="container-x">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SectionHeading title={h.title} tone="dark" className="max-w-xl" />
          <p className="flex items-center gap-2 text-[14px] text-white/65">
            <ArrowsOut weight="light" aria-hidden className="size-4 text-amber" />
            <span className="hint-tap">Tap a photo to view it larger</span>
            <span className="hint-hover">Click a photo to view it larger</span>
          </p>
        </div>
      </div>
      <LifeGallery
        images={lifeGallery}
        title={h.title}
        icons={{
          prev: <ArrowLeft weight="light" aria-hidden className="size-5" />,
          next: <ArrowRight weight="light" aria-hidden className="size-5" />,
          close: <X weight="light" aria-hidden className="size-5" />,
          pause: <Pause weight="light" aria-hidden className="size-5" />,
          play: <Play weight="light" aria-hidden className="size-5" />,
        }}
      />
    </section>
  );
}
