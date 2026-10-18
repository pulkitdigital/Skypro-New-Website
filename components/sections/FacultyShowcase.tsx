"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { faculty } from "@/data/faculty";
import { labels } from "@/data/sections";
import type { FacultyMember } from "@/data/types";
import { WatchDemoButton } from "@/components/ui/DemoLectures";
import { useDragScroll } from "@/components/ui/SnapCarousel";
import { ChartLines } from "@/components/backgrounds/ChartLines";
import { scrollToId } from "@/lib/lenis";
import { whenNear } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * Layout animations (layoutId) need domMax (~60 kB). It is fetched only once the section comes
 * near the viewport, so it never competes with the page load; until then the elements render
 * statically (nothing can be clicked before they are on screen anyway).
 */
const loadFeatures = () =>
  new Promise<void>((resolve) => {
    const section = document.getElementById("faculty");
    if (section) whenNear(section, "600px").then(resolve);
    else resolve();
  }).then(() => import("motion/react").then((mod) => mod.domMax));

export interface FacultyIcons {
  aircraft: React.ReactNode;
  medal: React.ReactNode;
  clock: React.ReactNode;
  play: React.ReactNode;
  arrow: React.ReactNode;
}

const FEATURED_ID = "faculty-featured";
const CREDENTIAL = /^(CFI|CGI|ATPL)$/;
const SWAP = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;

function Facts({ member, icons }: { member: FacultyMember; icons: FacultyIcons }) {
  const aircraft = member.tags.filter((t) => !CREDENTIAL.test(t));
  const credentials = member.tags.filter((t) => CREDENTIAL.test(t));
  const rows = [
    aircraft.length ? { icon: icons.aircraft, label: "Aircraft flown", text: aircraft.join(" · ") } : null,
    credentials.length ? { icon: icons.medal, label: "Credentials", text: credentials.join(" · ") } : null,
    member.achievement ? { icon: icons.medal, label: "Achievement", text: member.achievement } : null,
    member.experience ? { icon: icons.clock, label: "Experience", text: member.experience } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; text: string }[];
  return (
    <ul className="flex flex-col gap-2.5 border-y border-white/12 py-4">
      {rows.map((row) => (
        <li key={row.label + row.text} className="flex items-start gap-3">
          <span className="mt-px shrink-0 text-amber">{row.icon}</span>
          <span className="font-mono text-[12.5px] leading-snug tracking-[0.04em] text-white/85 uppercase">
            <span className="sr-only">{row.label}: </span>
            {row.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Featured + selector": the featured instructor on the left (big portrait, full bio, facts),
 * small cards for the others on the right. Choosing a card makes it featured: its photo grows
 * into the big photo's place (shared layoutId) while the text cross-fades, and the previous
 * instructor moves back into the list. Phones: the list is a swipe row and a tap scrolls up to
 * the featured panel.
 */
export function FacultyShowcase({ icons }: { icons: FacultyIcons }) {
  const [featuredId, setFeaturedId] = useState(faculty[0]!.id);
  const [swapped, setSwapped] = useState(false);
  const row = useRef<HTMLUListElement>(null);
  useDragScroll(row);
  const featured = faculty.find((f) => f.id === featuredId) ?? faculty[0]!;
  const others = faculty.filter((f) => f.id !== featured.id);

  const select = (id: string) => {
    setFeaturedId(id);
    setSwapped(true);
    if (window.matchMedia("(max-width: 1023.98px)").matches) scrollToId(FEATURED_ID);
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
        {/* Featured */}
        <div
          id={FEATURED_ID}
          aria-live="polite"
          className="tone-dark relative overflow-hidden rounded-[6px] bg-navy-deep text-white lg:min-h-[640px]"
        >
          <ChartLines />
          <div className="relative grid gap-6 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-8 md:p-8">
            <div data-clip-reveal className="self-start">
              <m.div
                layoutId={`faculty-photo-${featured.id}`}
                transition={SWAP}
                className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-navy"
              >
                <m.span layout className="absolute inset-0">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 40vw, 92vw"
                    className="object-cover object-top"
                  />
                </m.span>
              </m.div>
            </div>
            {/* keyed: the text fades in afresh whenever the featured instructor changes */}
            <div key={featured.id} className={cn("flex min-w-0 flex-col gap-4", swapped && "animate-in duration-500 fade-in-0 slide-in-from-bottom-2")}>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-[30px] leading-[1.05] font-bold md:text-[36px]">{featured.name}</h3>
                  <p className="text-white/70">{featured.role}</p>
                </div>
                <Facts member={featured} icons={icons} />
                <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-white/80">
                  {featured.bio.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
                {featured.demoVideoId ? (
                  <WatchDemoButton facultyId={featured.id} appearance="amber" className="mt-1 self-start">
                    {icons.play}
                    {labels.watchDemoLectures}
                  </WatchDemoButton>
                ) : null}
            </div>
          </div>
        </div>

        {/* Selector */}
        <ul ref={row} data-stagger data-cursor="drag" aria-label="Other instructors" className="swipe-lg pb-1 lg:flex lg:flex-col lg:gap-4 lg:pb-0">
          {others.map((member) => (
            <m.li key={member.id} layout transition={SWAP} className="w-[78vw] max-w-[340px] md:w-[44vw] lg:w-auto lg:max-w-none">
              <button
                type="button"
                data-cursor="view"
                aria-controls={FEATURED_ID}
                onClick={() => select(member.id)}
                className="group relative flex w-full cursor-pointer items-center gap-4 rounded-[6px] border border-hairline bg-white p-3 pr-4 text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-[0_18px_34px_-24px_rgb(0_31_63/0.55)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-2 left-0 w-[3px] origin-center scale-y-0 rounded-full bg-amber transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <m.span
                  layoutId={`faculty-photo-${member.id}`}
                  transition={SWAP}
                  className="relative block size-20 shrink-0 overflow-hidden rounded-[4px] bg-navy md:size-24"
                >
                  <m.span layout className="absolute inset-0">
                    <Image src={member.image.src} alt="" fill sizes="96px" className="object-cover object-top" />
                  </m.span>
                </m.span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-display text-[20px] leading-[1.1] font-semibold text-navy">{member.name}</span>
                  <span className="line-clamp-2 text-[14px] leading-snug text-muted">{member.role}</span>
                  <span className={cn("mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-navy")}>
                    View profile
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{icons.arrow}</span>
                  </span>
                </span>
              </button>
            </m.li>
          ))}
        </ul>
      </div>
    </LazyMotion>
  );
}
