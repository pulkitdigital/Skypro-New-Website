import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { counselling, labels } from "@/data/sections";
import { counsellingBackground } from "@/data/media";
import { site } from "@/data/site";
import { Img } from "@/components/ui/Img";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { CloudLayer } from "@/components/fx/CloudLayer";
import { deferredSection } from "@/lib/sectionSizes";

/**
 * "Break through the clouds": as the band scrolls in, two cloud banks part to the left and
 * right and the photo zooms slightly (scrubbed, motion runtime). The clouds sit under the navy
 * overlay, so the copy is readable at every point of the effect.
 */
export function CounsellingCta() {
  const cv = deferredSection("counselling");
  return (
    <section
      id="counselling"
      aria-labelledby="counselling-title"
      className={`tone-dark relative isolate overflow-hidden bg-navy-deep text-white ${cv.className}`}
      style={cv.style}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-cta-photo className="absolute inset-0">
          <Img image={counsellingBackground} fill sizes="100vw" className="object-cover" />
        </div>
        <CloudLayer shape="left" name="cta-left" className="inset-y-0 -left-[8%] w-[70%]" />
        <CloudLayer shape="right" name="cta-right" className="inset-y-0 -right-[8%] w-[70%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/[0.9] via-navy-deep/[0.78] to-navy-deep/[0.55]" />
      </div>

      <div className="container-x relative py-24 md:py-32">
        <div className="flex max-w-3xl flex-col gap-7">
          <h2 id="counselling-title" data-split className="h2 text-white">
            {counselling.title.split("1-on-1").map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key={i}>
                  <span className="whitespace-nowrap">1-on-1</span>
                  {part}
                </span>
              ),
            )}
          </h2>
          <p className="lead text-white/80">{counselling.paragraph}</p>
          <ul data-block className="flex flex-col gap-3.5">
            {counselling.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-white/90">
                <Check weight="light" aria-hidden className="mt-1 size-[18px] shrink-0 text-amber" />
                {bullet}
              </li>
            ))}
          </ul>
          <p className="pt-2 font-medium text-amber">{counselling.highlight}</p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <EnquireButton location="counselling" size="lg">
              {counselling.cta}
            </EnquireButton>
            <a
              href={`tel:${site.phoneE164}`}
              className="inline-flex h-14 items-center gap-2.5 rounded-[4px] border border-white/30 px-7 font-display text-[18px] font-semibold tracking-[0.04em] text-white uppercase transition-colors hover:border-white hover:bg-white/5"
            >
              <Phone weight="light" aria-hidden className="size-5" />
              {labels.call} {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
