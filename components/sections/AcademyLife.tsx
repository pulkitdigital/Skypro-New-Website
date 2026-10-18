import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowsOut } from "@phosphor-icons/react/dist/ssr/ArrowsOut";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { deferredSection } from "@/lib/sectionSizes";
import { headings } from "@/data/sections";
import { lifeGallery } from "@/data/media";
import type { MediaImage } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LifeGallery } from "./LifeGallery";

/** Unequal column widths (fr) → an asymmetric mosaic. */
const WIDTHS = [1.3, 0.85, 1.1, 0.9];

/**
 * Greedy balance: each photo goes to the column whose stack is currently shortest, where a
 * photo adds height ∝ column width × aspect ratio. Columns then end at nearly the same height;
 * photos stretch slightly (object-cover) to close the gap.
 */
function balance(images: MediaImage[]) {
  const cols: MediaImage[][] = WIDTHS.map(() => []);
  const heights = WIDTHS.map(() => 0);
  for (const image of images) {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest]!.push(image);
    heights[shortest]! += (WIDTHS[shortest]! * image.height) / image.width;
  }
  return cols;
}

const columns = balance(lifeGallery);

export function AcademyLife() {
  const cv = deferredSection("life");
  const h = headings.life;
  return (
    <section
      id="life"
      className={`tone-dark relative overflow-hidden bg-navy-deep pt-20 pb-1.5 text-white md:pt-28 ${cv.className}`}
      style={cv.style}
    >
      <div className="container-x relative mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
        <SectionHeading title={h.title} tone="dark" className="max-w-xl" />
        <p className="flex items-center gap-2 text-[14px] text-white/65">
          <ArrowsOut weight="light" aria-hidden className="size-4 text-amber" />
          <span className="hint-tap">Tap a photo to view it larger</span>
          <span className="hint-hover">Click a photo to view it larger</span>
        </p>
      </div>
      <LifeGallery
        columns={columns}
        widths={WIDTHS}
        images={lifeGallery}
        title={h.title}
        icons={{
          open: <ArrowsOut weight="light" aria-hidden className="size-5" />,
          prev: <ArrowLeft weight="light" aria-hidden className="size-5" />,
          next: <ArrowRight weight="light" aria-hidden className="size-5" />,
          close: <X weight="light" aria-hidden className="size-5" />,
        }}
      />
    </section>
  );
}
