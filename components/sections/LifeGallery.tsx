"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MediaImage } from "@/data/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export interface LifeIcons {
  open: React.ReactNode;
  prev: React.ReactNode;
  next: React.ReactNode;
  close: React.ReactNode;
}

/**
 * Edge-to-edge mosaic (columns drift at different speeds and each photo wipes in — motion
 * runtime). Every photo is a button that opens a lightbox: arrows, ←/→ keys, swipe, Esc/close.
 */
export function LifeGallery({
  columns,
  widths,
  images,
  title,
  icons,
}: {
  columns: MediaImage[][];
  widths: number[];
  images: MediaImage[];
  title: string;
  icons: LifeIcons;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const current = index === null ? null : images[index];
  const total = images.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + total) % total));

  return (
    <>
      <div
        className="relative grid grid-cols-[1.15fr_0.85fr] gap-1.5 px-1.5 lg:grid-cols-[var(--life-cols)]"
        style={{ "--life-cols": widths.map((w) => `${w}fr`).join(" ") } as React.CSSProperties}
      >
        {columns.map((column, c) => (
          <div key={c} data-life-column={c} className="flex flex-col gap-1.5 lg:will-change-transform">
            {column.map((image) => (
              <button
                key={image.src}
                type="button"
                data-life-photo
                data-cursor="view"
                aria-haspopup="dialog"
                onClick={() => setIndex(images.indexOf(image))}
                className="group relative grow cursor-zoom-in overflow-hidden bg-navy"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-navy-deep/75 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {icons.open}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <Dialog
        open={current !== null}
        onOpenChange={(open) => {
          if (!open) setIndex(null);
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
        >
          {current ? (
            <div className="flex flex-col">
              <div
                className="relative aspect-[3/2] max-h-[74svh] w-full touch-pan-y bg-black"
                onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
                onTouchEnd={(e) => {
                  const start = touch.current;
                  const end = e.changedTouches[0]?.clientX;
                  touch.current = null;
                  if (start === null || end === undefined || Math.abs(end - start) < 40) return;
                  go(end < start ? 1 : -1);
                }}
              >
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="92vw" className="animate-in object-contain duration-300 fade-in-0" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4 md:px-6">
                <div className="min-w-0">
                  <DialogTitle className="sr-only">{title}</DialogTitle>
                  <DialogDescription className="truncate text-[15px] text-white/80">{current.alt}</DialogDescription>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[13px] text-white/60">
                    {(index ?? 0) + 1} / {total}
                  </span>
                  {[
                    { label: "Previous photo", icon: icons.prev, dir: -1 as const },
                    { label: "Next photo", icon: icons.next, dir: 1 as const },
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => go(b.dir)}
                      className={cn(
                        "flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white",
                      )}
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
