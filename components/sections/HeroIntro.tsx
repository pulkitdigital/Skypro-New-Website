import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { about, headings, labels } from "@/data/sections";
import { aboutImage } from "@/data/media";
import { stats } from "@/data/stats";
import type { Stat } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { WatchDemoButton } from "@/components/ui/DemoLectures";
import { Img } from "@/components/ui/Img";
import { ChartLines } from "@/components/backgrounds/ChartLines";
import { PlaneFlyby } from "@/components/fx/PlaneFlyby";
import { cn } from "@/lib/utils";

/** "400+" → 400 + "+"; "4 Decades+" → "4" + " Decades+" (text content stays identical). */
function StatValue({ stat }: { stat: Stat }) {
  const unit = "font-sans text-[17px] font-medium text-white/70 md:text-[19px]";
  if (stat.value === null) {
    const [first, ...rest] = stat.display.split(" ");
    return (
      <>
        <span>{first}</span>
        <span className={unit}> {rest.join(" ")}</span>
      </>
    );
  }
  return (
    <>
      <span data-counter={stat.value}>{stat.value}</span>
      {stat.unit ? <span className={stat.unit === "+" ? "text-white/70" : unit}>{stat.unit}</span> : null}
    </>
  );
}

export function HeroIntro() {
  const h = headings.heroIntro;
  return (
    <section
      id="about"
      data-intro
      className="tone-dark relative z-[2] overflow-x-clip bg-navy-deep pt-24 pb-16 text-white md:pt-32 lg:pb-24"
    >
      <ChartLines />
      {/* Flyby behind the H1 (desktop/tablet) */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-[1] h-[320px] md:top-16 md:h-[380px]">
        <PlaneFlyby id="intro-flyby" path="across" />
      </div>

      <div className="container-x relative z-[2]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
          <SectionHeading
            as="h1"
            split="flyby"
            eyebrow={h.eyebrow}
            title={h.title}
            tone="dark"
            className="lg:col-span-8"
          />

          <div className="flex flex-col gap-9 lg:col-span-6 lg:row-start-2">
            <div className="flex max-w-2xl flex-col gap-4 text-white/75">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="lead">
                  {p}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              <EnquireButton location="intro" size="lg">
                {labels.enquireNow}
              </EnquireButton>
              <WatchDemoButton className="text-white">
                {labels.watchDemoLectures}
                <ArrowRight weight="light" aria-hidden className="size-[18px]" />
              </WatchDemoButton>
            </div>
          </div>

          {/* Large photo, running off the right edge on desktop / edge to edge on phones */}
          <div className="bleed-x lg-bleed-right lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
            <div data-clip-reveal className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[560px]">
              <Img image={aboutImage} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>

        {/* Stat strip: one row of numbers separated by hairlines */}
        <dl className="mt-16 grid grid-cols-2 border-t border-white/15 md:grid-cols-4 lg:mt-24">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col-reverse gap-3 pt-7 pb-1 md:pt-9",
                i % 2 === 1 && "border-l border-white/15 pl-5",
                i >= 2 && "mt-7 border-t border-white/15 md:mt-0 md:border-t-0",
                i > 0 && "md:border-l md:pl-7 lg:pl-9",
              )}
            >
              <dt className="text-[15px] text-white/65">{stat.label}</dt>
              <dd className="flex items-baseline gap-1 font-display text-[48px] leading-none font-bold text-white md:text-[60px]">
                <StatValue stat={stat} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
