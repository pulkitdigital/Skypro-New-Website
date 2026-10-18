"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/media";
import { labels } from "@/data/sections";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { HERO_ID } from "@/components/layout/useHeroPassed";
import { cn } from "@/lib/utils";
import { useAfterLoad } from "@/lib/useAfterLoad";

type Variant = "desktop1080" | "desktop720" | "mobile";

function pickVariant(): Variant {
  if (window.matchMedia("(max-width: 767.98px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1279.98px)").matches) return "desktop720";
  return "desktop1080";
}

export interface HeroIcons {
  enquire: React.ReactNode;
  soundOn: React.ReactNode;
  soundOff: React.ReactNode;
}

/** Full-screen video, no text. Poster (LCP) is a responsive <picture>; only one rendition is fetched. */
export function HeroVideoPlayer({ icons }: { icons: HeroIcons }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // The poster (the video's own opening logo frame) shows first; the video starts on the
  // first scroll/touch/pointer interaction or ~3.5 s after `load`, so its 4–7 MB never
  // competes with critical resources. Data-saver / 2G connections keep the poster only.
  const afterLoad = useAfterLoad(1500);
  useEffect(() => {
    if (!afterLoad) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;

    const events = ["scroll", "pointermove", "pointerdown", "touchstart", "keydown", "wheel"] as const;
    const start = () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
      setVariant(pickVariant());
    };
    const timer = window.setTimeout(start, 3500);
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
    };
  }, [afterLoad]);

  // (Re)load once sources are rendered for the chosen variant.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !variant) return;
    video.muted = true;
    video.load();
    video.play().catch(() => {
      /* autoplay blocked (Low Power Mode / data saver): poster stays */
    });
  }, [variant]);

  // Pause when off-screen (saves CPU/battery), resume when back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio < 0.1) video.pause();
        else if (video.paused && variant) video.play().catch(() => {});
      },
      { threshold: [0, 0.1, 0.5] },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [variant]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    if (!next && video.paused) video.play().catch(() => {});
  };

  const sources = variant ? heroVideo[variant] : [];

  return (
    <section
      id={HERO_ID}
      data-hero
      aria-label="SkyPro Aviation video"
      className="tone-dark relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-navy-deep"
    >
      {/* 24px larger than the hero with rounded corners: corners sit off-screen until the layer scales down. */}
      <div data-hero-media className="absolute -inset-6 overflow-hidden rounded-[6px] will-change-transform">
        <picture>
          <source
            media="(max-width: 767.98px)"
            srcSet={heroVideo.posterMobile.src}
            width={720}
            height={1280}
          />
          <img
            src={heroVideo.poster.src}
            alt={heroVideo.alt}
            width={heroVideo.poster.width}
            height={heroVideo.poster.height}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
        <div
          data-hero-dim
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-navy-deep opacity-0"
        />
        <div aria-hidden className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-48" />
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-end justify-between pb-[max(24px,env(safe-area-inset-bottom))] md:pb-10">
          <div data-hero-control className="hidden items-center gap-3 text-white sm:flex" aria-hidden>
            <span className="relative block h-12 w-px overflow-hidden bg-white/25">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-amber motion-safe:animate-[scroll-cue_2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            <span className="label text-white/80">{labels.scroll}</span>
          </div>

          <div
            data-hero-pill
            className="absolute bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:bottom-10"
          >
            <EnquireButton location="hero" variant="pill" size="lg" className="px-8">
              {icons.enquire}
              {labels.enquire}
            </EnquireButton>
          </div>

          <button
            type="button"
            data-hero-control
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="ml-auto flex size-12 items-center justify-center rounded-full border border-white/25 bg-navy-deep/60 text-white transition-colors hover:border-white md:size-14"
          >
            {muted ? icons.soundOff : icons.soundOn}
          </button>
        </div>
      </div>
    </section>
  );
}
