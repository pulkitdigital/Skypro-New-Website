"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Lightweight YouTube facade: only a thumbnail until clicked, then a
 * youtube-nocookie iframe. Nothing navigates away from the page.
 */
export function YouTubeFacade({ id, title, playIcon }: { id: string; title: string; playIcon: React.ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[6px] bg-navy-deep">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group absolute inset-0 h-full w-full"
          onClick={() => {
            setActive(true);
            track("demo_open", { video: id });
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute top-1/2 left-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber text-navy transition-transform duration-300 group-hover:scale-105">
            {playIcon}
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
