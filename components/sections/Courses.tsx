import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr/AirplaneTilt";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { deferredSection } from "@/lib/sectionSizes";
import { courses } from "@/data/courses";
import { coursesIntro, headings, labels } from "@/data/sections";
import type { Course } from "@/data/types";
import { Img } from "@/components/ui/Img";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { WatchDemoButton } from "@/components/ui/DemoLectures";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function CourseCard({ course, index }: { course: Course; index: number }) {
  const navy = index % 2 === 0;
  return (
    <li data-stack-card data-block className="course-stack__item" style={{ "--i": index } as React.CSSProperties}>
      <article
        data-stack-sheet
        data-cursor="explore"
        className={cn(
          "relative grid overflow-hidden rounded-[6px] shadow-[0_30px_60px_-36px_rgb(0_31_63/0.55)] lg:h-[var(--card-h)] lg:grid-cols-2",
          navy ? "tone-dark bg-navy text-white" : "border border-hairline bg-ivory text-navy",
        )}
      >
        {/* darkens as the next card stacks on top */}
        <div data-stack-dim aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-navy-deep opacity-0" />

        {/* route line with a plane that crosses as the card settles */}
        <div data-stack-route aria-hidden className="absolute inset-x-6 top-6 z-20 h-px md:inset-x-10 md:top-8">
          <span className="dash-x absolute inset-0" />
          <span data-stack-plane className="absolute top-0 left-0 -translate-y-1/2 text-amber">
            <AirplaneTilt weight="light" className="size-7 rotate-45" />
          </span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-navy-deep lg:aspect-auto lg:h-full">
          <div data-stack-photo className="absolute inset-0">
            <Img image={course.image} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 p-7 pt-10 md:p-10 lg:p-12 xl:p-14">
          <span
            aria-hidden
            className="outline-type text-[84px] [-webkit-text-stroke:1.5px_var(--color-amber)] md:text-[104px]"
          >
            {pad(index + 1)}
          </span>
          <p className={cn("label", navy ? "text-white/70" : "text-muted")}>{course.subheading}</p>
          <h3 className="font-display text-[32px] leading-[1.02] font-bold md:text-[42px]">{course.title}</h3>
          <p className={cn("max-w-xl", navy ? "text-white/75" : "text-ink/75")}>{course.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <NoNavLink
              aria-label={`${course.readMore.label} about ${course.title}`}
              className={buttonVariants({ variant: navy ? "amber" : "navy", size: "md" })}
            >
              {course.readMore.label}
              <ArrowRight weight="light" aria-hidden />
            </NoNavLink>
            <WatchDemoButton
              className={cn(
                "inline-flex h-12 items-center gap-2.5 rounded-[4px] border px-6 font-display text-[17px] font-semibold tracking-[0.04em] uppercase transition-colors",
                navy ? "border-white/35 text-white hover:border-white" : "border-navy/30 text-navy hover:border-navy",
              )}
              appearance="none"
            >
              <Play weight="light" aria-hidden className="size-5" />
              {labels.watchDemoLectures}
            </WatchDemoButton>
          </div>
        </div>
      </article>
    </li>
  );
}

/**
 * "Stacked boarding cards": on desktop each course card sticks under the heading and the next
 * one slides up over it; the motion runtime scales the previous card to 0.94 and darkens it,
 * flies the plane along each card's route line as it settles, zooms the photo in and updates
 * the "01 / 06" counter. Phones/tablets: plain vertical cards that fade up.
 */
export function Courses() {
  const cv = deferredSection("courses");
  const h = headings.courses;
  return (
    <section
      id="courses"
      aria-labelledby="courses-title"
      className={`relative bg-mist py-20 md:py-28 ${cv.className}`}
      style={cv.style}
    >
      <div className="container-x">
        <div className="course-stack__head mb-10 flex flex-col gap-5 bg-mist md:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-5">
          <div className="flex items-end gap-6">
            <h2 id="courses-title" data-split className="h2 text-navy">
              {h.title}
            </h2>
            <p aria-hidden className="hidden pb-1.5 font-mono text-[14px] tracking-[0.08em] text-navy lg:block">
              <span data-stack-index className="text-navy">
                01
              </span>
              <span className="text-muted"> / {pad(courses.length)}</span>
            </p>
          </div>
          <p className="max-w-xl text-muted lg:pb-1">{coursesIntro}</p>
        </div>

        <ul aria-label={h.title} className="course-stack mx-auto flex max-w-[1200px] flex-col gap-8 lg:gap-[12vh]">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
