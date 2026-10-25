"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { MediaImage } from "@/data/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getLenis } from "@/lib/lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

export interface LifeIcons {
  prev: React.ReactNode;
  next: React.ReactNode;
  close: React.ReactNode;
  pause: React.ReactNode;
  play: React.ReactNode;
}

const AUTOPLAY_MS = 4000;
/** After a drag / arrow / key press, autoplay waits this long before it moves on again. */
const HOLD_MS = 8000;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Life at SkyPro" slider (Embla): three slides per view on desktop, two on tablets, one ~85% slide
 * with the next peeking on phones (swipe only). Infinite, drag / swipe, ←/→ keys; the arrows move one
 * slide. Hover zooms a photo slightly and fades its caption in. Autoplay every 4 s (never with
 * reduced motion), held while the pointer or focus is on the slider, after an interaction, while
 * the lightbox is open or the slider is off screen, and stoppable with the pause button. Any slide
 * opens the lightbox on its photo (arrows, ←/→ keys, swipe, counter, Esc).
 */
export function LifeGallery({
  images,
  title,
  icons,
}: {
  images: MediaImage[];
  title: string;
  icons: LifeIcons;
}) {
  const total = images.length;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [viewport, embla] = useEmblaCarousel({ loop: true, align: "start", duration: 32 });
  const [index, setIndex] = useState(0);
  const [snaps, setSnaps] = useState(total);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [box, setBox] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLButtonElement | null)[]>([]);
  const held = useRef(false);
  const holdUntil = useRef(0);
  const shown = useRef(0);
  const touch = useRef<number | null>(null);

  const interact = () => void (holdUntil.current = Date.now() + HOLD_MS);
  const prev = () => (interact(), embla?.scrollPrev(reduced));
  const next = () => (interact(), embla?.scrollNext(reduced));

  // the first slide in view drives the counter and the progress line (one position per slide)
  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setIndex(embla.selectedScrollSnap());
      setSnaps(embla.scrollSnapList().length);
    };
    const onDrag = () => void (holdUntil.current = Date.now() + HOLD_MS);
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect).on("pointerDown", onDrag);
    return () => void embla.off("select", onSelect).off("reInit", onSelect).off("pointerDown", onDrag);
  }, [embla]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // autoplay: the 4 s countdown restarts after every slide change
  const autoplay = Boolean(embla) && playing && !reduced && inView && box === null;
  useEffect(() => {
    if (!embla || !autoplay) return;
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tick, AUTOPLAY_MS);
    };
    const tick = () => {
      if (held.current || document.hidden || Date.now() < holdUntil.current) return schedule();
      embla.scrollNext();
    };
    embla.on("select", schedule);
    schedule();
    return () => {
      window.clearTimeout(timer);
      embla.off("select", schedule);
    };
  }, [embla, autoplay]);

  useEffect(() => {
    if (box !== null) shown.current = box;
  }, [box]);

  const go = useCallback(
    (dir: 1 | -1) => setBox((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  );
  const current = box === null ? null : images[box];
  const arrow =
    "flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white";

  return (
    <>
      <div
        ref={root}
        data-block
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        onMouseEnter={() => (held.current = true)}
        onMouseLeave={() => (held.current = false)}
        onFocus={() => (held.current = true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && (held.current = false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
      >
        <div className="container-x">
          {/* 20px between slides: 10px padding on each side, offset at the ends of the row */}
          <div ref={viewport} className="-mx-2.5 overflow-hidden">
            {/* slides are labelled groups (carousel pattern), not list items */}
            <div className="flex touch-pan-y">
              {images.map((image, i) => (
                <div
                  key={image.src}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] px-2.5 sm:basis-1/2 lg:basis-1/3"
                >
                  <button
                    ref={(node) => void (slides.current[i] = node)}
                    type="button"
                    data-life-photo
                    data-first-in-view={i === index ? "" : undefined}
                    data-cursor="view"
                    aria-haspopup="dialog"
                    onClick={() => setBox(i)}
                    className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-navy text-left"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 85vw"
                      className={cn(
                        "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]",
                        image.height > image.width && "object-[50%_25%]",
                      )}
                    />
                    {/* hover / focus: the caption fades in over a soft dark blue gradient */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 flex h-1/2 items-end bg-gradient-to-t from-navy-deep/85 via-navy-deep/35 to-transparent p-4 text-[14px] leading-snug text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {image.alt}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-x mt-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="font-mono text-[13px] tracking-[0.08em] text-white/60" aria-live="polite">
              <span className="text-white">{pad(index + 1)}</span> / {pad(snaps)}
            </p>
            <span aria-hidden className="relative block h-px w-24 bg-white/20 md:w-40">
              <span
                className="absolute inset-y-0 left-0 bg-amber transition-[width] duration-500"
                style={{ width: `${((index + 1) / snaps) * 100}%` }}
              />
            </span>
          </div>
          <div className="flex gap-2">
            {reduced ? null : (
              <button type="button" onClick={() => setPlaying((p) => !p)} className={arrow}>
                {playing ? icons.pause : icons.play}
                <span className="sr-only">{playing ? "Pause slideshow" : "Play slideshow"}</span>
              </button>
            )}
            <button type="button" onClick={prev} className={cn(arrow, "max-sm:hidden")}>
              {icons.prev}
              <span className="sr-only">Previous photo</span>
            </button>
            <button type="button" onClick={next} className={cn(arrow, "max-sm:hidden")}>
              {icons.next}
              <span className="sr-only">Next photo</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={current != null}
        onOpenChange={(open) => {
          if (!open) setBox(null);
          if (open) getLenis()?.stop();
          else getLenis()?.start();
        }}
      >
        <DialogContent
          tone="dark"
          closeIcon={icons.close}
          className="max-md:inset-x-3 max-md:top-1/2 max-md:bottom-auto max-md:w-auto max-md:-translate-y-1/2 max-md:rounded-[6px] md:max-w-[min(1100px,92vw)]"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          onCloseAutoFocus={(e) => {
            // no Dialog.Trigger to return to: bring the slider to the photo last shown and focus it
            e.preventDefault();
            embla?.scrollTo(shown.current, true);
            slides.current[shown.current]?.focus({ preventScroll: true });
          }}
        >
          {current ? (
            <div className="flex flex-col">
              <div
                className="bg-black relative aspect-[3/2] max-h-[74svh] w-full touch-pan-y"
                onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
                onTouchEnd={(e) => {
                  const start = touch.current;
                  const end = e.changedTouches[0]?.clientX;
                  touch.current = null;
                  if (start === null || end === undefined || Math.abs(end - start) < 40) return;
                  go(end < start ? 1 : -1);
                }}
              >
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="92vw"
                  className="animate-in object-contain duration-300 fade-in-0"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-4 md:px-6">
                <div className="min-w-0">
                  <DialogTitle className="sr-only">{title}</DialogTitle>
                  <DialogDescription className="truncate text-[15px] text-white/80">
                    {current.alt}
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[13px] text-white/60">
                    {(box ?? 0) + 1} / {total}
                  </span>
                  {[
                    { label: "Previous photo", icon: icons.prev, dir: -1 as const },
                    { label: "Next photo", icon: icons.next, dir: 1 as const },
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => go(b.dir)}
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white"
                    >
                      {b.icon}
                      <span className="sr-only">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
