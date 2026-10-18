import { deferredSection } from "@/lib/sectionSizes";
import { headings, whyChooseIntro } from "@/data/sections";
import { whyChoosePoints } from "@/data/whyChoose";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WindowView } from "@/components/fx/WindowView";

/** "Window view": a sticky aircraft window beside the six points; the point in the middle of the screen is brightest. */
export function WhyChoose() {
  const cv = deferredSection("why-choose");
  const h = headings.whyChoose;
  return (
    <section id="why-choose" className={`tone-dark relative bg-navy py-20 text-white md:py-28 ${cv.className}`} style={cv.style}>
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[110px]">
            <WindowView className="mx-auto w-full lg:max-w-[420px]" />
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:col-span-7 lg:pt-2">
          <SectionHeading title={h.title} tone="dark">
            <div className="flex flex-col gap-4 text-white/75">
              {whyChooseIntro.map((p) => (
                <p key={p.slice(0, 24)} className="lead">
                  {p}
                </p>
              ))}
            </div>
          </SectionHeading>

          <ol data-points className="border-t border-white/15">
            {whyChoosePoints.map((point, i) => (
              <li
                key={point.id}
                data-point
                className="grid grid-cols-[3.75rem_1fr] gap-x-4 border-b border-white/15 py-8 md:grid-cols-[6rem_1fr] md:gap-x-6 md:py-10"
              >
                <span aria-hidden className="font-mono text-[36px] leading-none font-bold text-amber md:text-[52px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2.5 md:pt-1">
                  <h3 className="font-display text-[24px] leading-[1.1] font-semibold text-white md:text-[26px]">{point.title}</h3>
                  <p className="text-white/70">{point.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
