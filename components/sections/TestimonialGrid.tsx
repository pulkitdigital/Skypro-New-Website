"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { headings } from "@/data/sections";
import { testimonialFilters, testimonials } from "@/data/testimonials";
import type { Testimonial, TestimonialCourse } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SnapCarousel } from "@/components/ui/SnapCarousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { track } from "@/lib/analytics";
import { getLenis } from "@/lib/lenis";
import { cn, formatDuration } from "@/lib/utils";

type FilterId = "all" | TestimonialCourse;

export interface TestimonialIcons {
  play: React.ReactNode;
  close: React.ReactNode;
  prev: React.ReactNode;
  next: React.ReactNode;
}

const posterOf = (item: Testimonial) => item.featuredPoster ?? item.poster;

/** Text tabs with one amber underline that slides to the active tab. */
function FilterTabs({ value, onChange }: { value: FilterId; onChange: (id: FilterId) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const place = () => {
      const active = el.querySelector<HTMLElement>("[aria-pressed=true]");
      if (active) setBar({ x: active.offsetLeft, w: active.offsetWidth });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div
      ref={list}
      role="group"
      aria-label="Filter testimonials by course"
      className="no-scrollbar relative -mx-[var(--gutter)] flex gap-7 overflow-x-auto border-b border-hairline px-[var(--gutter)] md:mx-0 md:px-0"
    >
      {testimonialFilters.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f.id)}
            className={cn(
              "min-h-11 shrink-0 cursor-pointer pb-2 text-[16px] font-medium whitespace-nowrap transition-colors",
              active ? "text-navy" : "text-muted hover:text-navy",
            )}
          >
            {f.label}
          </button>
        );
      })}
      <span
        aria-hidden
        className="absolute bottom-[-1px] left-0 h-0.5 w-px origin-left bg-amber transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: bar ? `translateX(${bar.x}px) scaleX(${bar.w})` : "scaleX(0)" }}
      />
    </div>
  );
}

function Seat({ item, onPlay, playIcon }: { item: Testimonial; onPlay: () => void; playIcon: React.ReactNode }) {
  return (
    <>
      <button type="button" data-cursor="play" onClick={onPlay} aria-haspopup="dialog" className="group block w-full cursor-pointer text-left">
        <span className="cabin-window block">
          <span className="cabin-glass block">
            <Image
              src={posterOf(item).src}
              alt=""
              fill
              sizes="(min-width: 768px) 230px, 58vw"
              className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 z-[3] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_10px_24px_-10px_rgb(0_31_63/0.6)] transition-[transform,background-color] duration-300 group-hover:scale-105 group-hover:bg-amber"
            >
              {playIcon}
            </span>
          </span>
        </span>
        <span className="sr-only">
          Play video testimonial: {item.name}, {item.course}
        </span>
      </button>
      <div className="mt-4 flex flex-col gap-1 px-2 text-center">
        <p className="font-display text-[20px] leading-tight font-semibold text-navy">{item.name}</p>
        <p className="text-[14px] leading-snug text-muted">{item.course}</p>
      </div>
    </>
  );
}

/** "Window seats": filter tabs, a row of cabin windows (arrows + drag / swipe), a video modal. */
export function TestimonialGrid({ icons }: { icons: TestimonialIcons }) {
  const h = headings.testimonials;
  const [filter, setFilter] = useState<FilterId>("all");
  const [filtered, setFiltered] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);

  const list = filter === "all" ? testimonials : testimonials.filter((t) => t.course === filter);
  const modalItem = testimonials.find((t) => t.id === modalId) ?? null;

  const play = (item: Testimonial) => {
    track("video_play", { testimonial: item.name });
    setModalId(item.id);
  };

  return (
    <>
      <div className="container-x mb-10 flex flex-col gap-8 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading title={h.title} />
        <FilterTabs
          value={filter}
          onChange={(id) => {
            setFilter(id);
            setFiltered(true);
          }}
        />
      </div>

      <div className="container-x">
        <SnapCarousel
          key={filter}
          label={h.title}
          drag
          prevIcon={icons.prev}
          nextIcon={icons.next}
          trackClassName={cn("swipe-all py-2", filtered && "animate-in duration-300 fade-in-0")}
        >
          {list.map((item) => (
            <li key={item.id} data-seat className="w-[58vw] max-w-[250px] md:w-[230px]">
              <Seat item={item} onPlay={() => play(item)} playIcon={icons.play} />
            </li>
          ))}
        </SnapCarousel>
      </div>

      <Dialog
        open={Boolean(modalItem)}
        onOpenChange={(open) => {
          if (!open) setModalId(null);
          if (open) getLenis()?.stop();
          else getLenis()?.start();
        }}
      >
        <DialogContent
          tone="dark"
          closeIcon={icons.close}
          className="max-md:inset-x-4 max-md:top-1/2 max-md:bottom-auto max-md:w-auto max-md:-translate-y-1/2 max-md:rounded-[6px] md:max-w-[760px]"
        >
          {modalItem ? (
            <div className="grid md:grid-cols-[minmax(0,340px)_1fr]">
              <video
                key={modalItem.id}
                src={modalItem.video.src}
                poster={posterOf(modalItem).src}
                controls
                autoPlay
                playsInline
                className="aspect-[9/16] max-h-[70svh] w-full bg-black object-contain md:max-h-[80svh]"
              />
              <div className="flex flex-col gap-3 p-5 pr-16 md:p-8">
                <DialogTitle className="text-white">{modalItem.name}</DialogTitle>
                <DialogDescription className="text-white/70">{modalItem.course}</DialogDescription>
                <p className="font-mono text-[14px] text-white/60">{formatDuration(modalItem.durationSec)}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
