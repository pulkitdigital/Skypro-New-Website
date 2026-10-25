"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { faculty } from "@/data/faculty";
import { labels } from "@/data/sections";
import type { FacultyMember } from "@/data/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SnapCarousel } from "@/components/ui/SnapCarousel";
import { useDemoLectures } from "@/components/ui/DemoLectures";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export interface FacultyIcons {
  arrow: React.ReactNode;
  prev: React.ReactNode;
  next: React.ReactNode;
  close: React.ReactNode;
  play: React.ReactNode;
  medal: React.ReactNode;
  clock: React.ReactNode;
}

const VIEW_PROFILE = "View profile";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
/** Hover / keyboard-focus transitions on the card: quick and eased out. */
const QUICK = "duration-300 ease-out";

function FacultyCard({
  member,
  icons,
  onOpen,
  buttonRef,
}: {
  member: FacultyMember;
  icons: FacultyIcons;
  onOpen: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const active = "group-hover:translate-y-0 group-focus-visible:translate-y-0";
  return (
    <li className="w-[76vw] max-w-[320px] sm:w-[calc((100%-20px)/2.2)] sm:max-w-none md:w-[calc((100%-56px)/2.3)] lg:w-[calc((100%-84px)/3.3)] xl:w-[calc((100%-112px)/4.25)]">
      <button
        ref={buttonRef}
        type="button"
        data-cursor="view"
        aria-haspopup="dialog"
        onClick={onOpen}
        className={cn(
          "group relative isolate block aspect-[5/7] w-full cursor-pointer overflow-hidden rounded-[6px] bg-[#dfe2e6] text-left",
          "shadow-[0_10px_28px_rgb(0_0_0/0.18)] transition-[translate,box-shadow]",
          QUICK,
          "hover:-translate-y-1 hover:shadow-[0_16px_36px_rgb(0_0_0/0.24)] focus-visible:-translate-y-1 focus-visible:shadow-[0_16px_36px_rgb(0_0_0/0.24)]",
        )}
      >
        {/* cut-out (backdrop keyed out, scripts/media/faculty-cutouts.mjs) on a neutral grey: black & white
            with a touch more contrast; hover brings the colour back and zooms in slightly */}
        <Image
          src={member.image.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 640px) 40vw, 76vw"
          className={cn(
            "object-cover object-top contrast-[1.05] grayscale transition-[filter,transform] duration-[400ms] ease-out",
            "group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:scale-[1.04] group-focus-visible:grayscale-0",
          )}
        />
        {/* a light navy tint over the whole picture, a slight blue cast on the B&W (lifted with the colour on hover) */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[rgb(0_51_102/0.10)] transition-opacity duration-[400ms] ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
        />
        {/* default: a navy gradient behind the name and role only (transparent at half height) */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,rgb(0_51_102/0),rgb(0_51_102/0.55)_55%,rgb(0_31_63/0.95))]"
        />
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 transition-opacity",
            QUICK,
            "group-hover:opacity-0 group-focus-visible:opacity-0",
          )}
        >
          <span className="font-display text-[24px] leading-[0.95] font-bold text-white uppercase">
            {member.name}
          </span>
          <span className="truncate text-[14px] leading-snug text-white/75">{member.role}</span>
        </span>

        {/* hover / keyboard focus: a dark brand-blue panel (≤ ~40% of the card, #003366 → #002347) slides up
            with the start of the bio in white; it previews
            what the dialog shows in full, so it is hidden from assistive tech */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 flex translate-y-full flex-col items-start gap-1 bg-[linear-gradient(to_bottom,#003366,#002347)] p-3 transition-transform",
            QUICK,
            active,
          )}
        >
          <span className="font-display text-[18px] leading-[0.95] font-bold text-white uppercase">
            {member.name}
          </span>
          <span className="mt-0.5 line-clamp-3 text-[12.5px] leading-snug text-white/85">
            {member.bio[0]}
          </span>
          <span className="link-arrow mt-0.5 text-[14px] text-white">
            {VIEW_PROFILE}
            <span className="text-amber">{icons.arrow}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

function Highlights({ member, icons }: { member: FacultyMember; icons: FacultyIcons }) {
  const rows = [
    member.achievement ? { icon: icons.medal, label: "Achievement", text: member.achievement } : null,
    member.experience ? { icon: icons.clock, label: "Experience", text: member.experience } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; text: string }[];
  if (!rows.length) return null;
  return (
    <ul className="flex flex-col gap-2.5 border-y border-white/12 py-4">
      {rows.map((row) => (
        <li key={row.label} className="flex items-start gap-3">
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
 * Faculty row: tall portrait cards (black & white photo, a navy gradient behind the white name and
 * role). Hover / focus brings the colour back, zooms the photo slightly, lifts the card and slides
 * up a dark blue panel with the start of the bio. A card opens the full profile in a dialog (full-screen
 * sheet on phones) with previous / next (buttons and ←/→ keys). Desktop: drag or arrows; phones:
 * swipe with snap.
 */
export function FacultyCards({ icons, label }: { icons: FacultyIcons; label: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const demoNext = useRef(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = useRef(0);
  const { openDemo } = useDemoLectures();
  const total = faculty.length;
  const member = index === null ? null : faculty[index];

  useEffect(() => {
    if (index !== null) shown.current = index;
  }, [index]);

  // the profile text scrolls without a visible scrollbar; a fade at the bottom says there is more.
  // A callback ref (state), because the dialog's portal mounts a render after `index` is set.
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [more, setMore] = useState(false);
  const checkMore = useCallback(() => {
    setMore(Boolean(scroller && scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 4));
  }, [scroller]);
  useEffect(() => {
    if (index === null || !scroller) return;
    scroller.scrollTop = 0;
    checkMore();
    const ro = new ResizeObserver(checkMore);
    ro.observe(scroller);
    Array.from(scroller.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  }, [index, scroller, checkMore]);

  const open = (i: number) => {
    setDir(1);
    setIndex(i);
    getLenis()?.stop();
  };
  const close = () => {
    setIndex(null);
    getLenis()?.start();
  };
  const go = (step: 1 | -1) => {
    setDir(step);
    setIndex((i) => (i === null ? i : (i + step + total) % total));
  };
  // the demo dialog replaces this one (no dialog on top of a dialog)
  const watchDemo = (id: string) => {
    demoNext.current = true;
    close();
    openDemo(id);
  };

  const nav =
    "flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white";

  return (
    <>
      {/* compact cursor: a small "View" badge on each card's corner, never over the text */}
      <div data-block data-cursor-compact>
        <SnapCarousel
          label={label}
          trackClassName="swipe-all -mt-5 -mb-9 pt-5 pb-9" // room for the lift and shadow on hover
          prevIcon={icons.prev}
          nextIcon={icons.next}
          drag
        >
          {faculty.map((m, i) => (
            <FacultyCard
              key={m.id}
              member={m}
              icons={icons}
              onOpen={() => open(i)}
              buttonRef={(node) => void (cards.current[i] = node)}
            />
          ))}
        </SnapCarousel>
      </div>

      <Dialog open={member !== null} onOpenChange={(next) => !next && close()}>
        <DialogContent
          tone="dark"
          closeIcon={icons.close}
          // phones: the close button sits on the light photo
          closeClassName="max-md:bg-navy max-md:hover:bg-navy-deep max-md:hover:text-white"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          onCloseAutoFocus={(e) => {
            // no Dialog.Trigger to return to: focus the card of the profile that was showing,
            // unless the demo dialog is opening (focus belongs there)
            e.preventDefault();
            const card = cards.current[shown.current];
            if (!demoNext.current && card) {
              card.focus({ preventScroll: true });
              card.scrollIntoView({ block: "nearest", inline: "nearest" });
            }
            demoNext.current = false;
          }}
          className={cn(
            "overflow-hidden duration-300",
            EASE,
            // phones: full-screen sheet that slides up
            "max-md:top-0 max-md:h-[100svh] max-md:max-h-none max-md:rounded-none max-md:data-[state=closed]:slide-out-to-bottom max-md:data-[state=open]:slide-in-from-bottom",
            // tablet / desktop: photo beside the profile, scales in
            "md:grid md:h-[min(86svh,660px)] md:max-h-none md:w-[calc(100vw-64px)] md:max-w-[1040px] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:data-[state=closed]:zoom-out-95 md:data-[state=open]:zoom-in-95",
          )}
        >
          {member && index !== null ? (
            <>
              <div className="relative hidden overflow-hidden bg-mist md:block">
                <Image
                  key={member.id}
                  src={member.image.src}
                  alt={member.image.alt}
                  fill
                  sizes="440px"
                  className="animate-in object-cover object-top duration-500 fade-in-0"
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative min-h-0 flex-1">
                  <div
                    ref={setScroller}
                    data-lenis-prevent
                    onScroll={checkMore}
                    className="no-scrollbar h-full overflow-y-auto overscroll-contain"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-mist md:hidden">
                      <Image
                        key={member.id}
                        src={member.image.src}
                        alt={member.image.alt}
                        fill
                        sizes="100vw"
                        className="animate-in object-cover object-[50%_20%] duration-500 fade-in-0"
                      />
                    </div>

                    <div
                      key={member.id}
                      className={cn(
                        "flex animate-in flex-col gap-6 p-6 pb-8 duration-500 fade-in-0 md:p-10 md:pr-16",
                        EASE,
                        dir === 1 ? "slide-in-from-right-3" : "slide-in-from-left-3",
                      )}
                    >
                      <div className="flex flex-col gap-3">
                        <ul aria-label="Credentials and aircraft" className="flex flex-wrap gap-2">
                          {member.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-[4px] border border-amber/40 px-2 py-1 font-mono text-[11px] leading-none tracking-[0.1em] text-amber uppercase"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <DialogTitle className="mt-1 text-[34px] leading-[0.95] font-bold text-white uppercase md:text-[42px]">
                          {member.name}
                        </DialogTitle>
                        <DialogDescription className="text-white/70">{member.role}</DialogDescription>
                      </div>

                      <Highlights member={member} icons={icons} />

                      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-white/80">
                        {member.bio.map((p) => (
                          <p key={p.slice(0, 32)}>{p}</p>
                        ))}
                      </div>

                      {member.demoVideoId ? (
                        <button
                          type="button"
                          data-cursor="play"
                          aria-haspopup="dialog"
                          onClick={() => watchDemo(member.id)}
                          className={cn(buttonVariants({ variant: "amber" }), "self-start")}
                        >
                          {icons.play}
                          {labels.watchDemoLectures}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-deep to-navy-deep/0 transition-opacity duration-300",
                      more ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>

                <div className="flex items-center justify-end border-t border-white/10 px-6 py-3.5 pb-[max(14px,env(safe-area-inset-bottom))] md:px-10">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => go(-1)} className={nav}>
                      {icons.prev}
                      <span className="sr-only">Previous instructor</span>
                    </button>
                    <button type="button" onClick={() => go(1)} className={nav}>
                      {icons.next}
                      <span className="sr-only">Next instructor</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
