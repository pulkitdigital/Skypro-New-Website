import type { Icon } from "@phosphor-icons/react";
import { GlobeHemisphereEast } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereEast";
import { Headset } from "@phosphor-icons/react/dist/ssr/Headset";
import { Stack } from "@phosphor-icons/react/dist/ssr/Stack";
import { Target } from "@phosphor-icons/react/dist/ssr/Target";
import { highlights } from "@/data/highlights";
import { about } from "@/data/sections";
import { cn } from "@/lib/utils";

const ICONS: Record<string, Icon> = {
  "experienced-instructors": Headset,
  "career-focused": Target,
  "comprehensive-training": Stack,
  "global-opportunities": GlobeHemisphereEast,
};

/** Four columns split by hairlines: icon (an amber line draws under it on hover), title, line. */
export function Highlights() {
  return (
    <section aria-labelledby="highlights-title" className="relative bg-white py-14 md:py-20">
      <h2 id="highlights-title" className="sr-only">
        {about.srHeading}
      </h2>
      <div className="container-x">
        <ul data-stagger className="grid md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => {
            const Icon = ICONS[item.id];
            return (
              <li
                key={item.id}
                className={cn(
                  "group flex flex-col gap-3 border-hairline py-7 lg:py-1",
                  i > 0 && "border-t md:border-t-0",
                  i >= 2 && "md:border-t lg:border-t-0",
                  i % 2 === 1 && "md:border-l md:pl-8",
                  i % 2 === 0 && "md:pr-8",
                  i > 0 && "lg:border-l lg:pl-8",
                  "lg:pr-8 lg:last:pr-0",
                )}
              >
                {Icon ? (
                  <span className="relative mb-1 inline-flex w-fit pb-2.5 text-navy">
                    <Icon weight="light" aria-hidden className="size-8" />
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-amber transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  </span>
                ) : null}
                <h3 className="font-display text-[22px] leading-[1.1] font-semibold text-navy">{item.title}</h3>
                <p className="text-[16px] text-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
