"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { labels } from "@/data/sections";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { NavDesktop } from "./NavDesktop";
import { MobileMenu } from "./MobileMenu";
import { useHeroScroll } from "./useHeroPassed";
import type { HeaderIcons } from "./layoutIcons";
import { cn } from "@/lib/utils";

/**
 * Transparent over the hero (with a navy scrim, because the video opens on white frames),
 * solid deep navy after it. Hides on scroll down, shows on scroll up.
 */
export function Header({ icons }: { icons: HeaderIcons }) {
  const { passed, direction, deep } = useHeroScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = passed && direction === "down" && deep && !menuOpen;

  return (
    <header
      data-header
      data-solid={passed || undefined}
      className={cn(
        "tone-dark fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden && "-translate-y-full",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "scrim-top pointer-events-none absolute inset-x-0 top-0 h-40 transition-opacity duration-500",
          passed && "opacity-0",
        )}
      />
      <div
        data-header-bar
        className={cn(
          "relative border-b transition-[background-color,border-color] duration-500",
          passed ? "border-white/10 bg-navy-deep" : "border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "container-x flex items-center justify-between gap-6 transition-[height] duration-500",
            passed ? "h-[68px]" : "h-[68px] lg:h-[88px]",
          )}
        >
          <NoNavLink aria-label={`${site.name} — home`} className="shrink-0">
            <Image
              src={site.logo.white.src}
              alt={site.logo.white.alt}
              width={site.logo.white.width}
              height={site.logo.white.height}
              priority
              className={cn("w-auto transition-[height] duration-500", passed ? "h-10" : "h-10 lg:h-12")}
            />
          </NoNavLink>

          <NavDesktop caret={icons.caret} className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <EnquireButton location="header" size="sm" className="hidden sm:inline-flex">
              {icons.enquire}
              {labels.enquire}
            </EnquireButton>
            <MobileMenu icons={icons} onOpenChange={setMenuOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
