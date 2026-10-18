"use client";

import { useState } from "react";
import Image from "next/image";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { headerNav } from "@/data/nav";
import { site } from "@/data/site";
import { labels } from "@/data/sections";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { getLenis } from "@/lib/lenis";
import type { HeaderIcons } from "./layoutIcons";

const iconButton =
  "flex size-11 items-center justify-center rounded-[4px] border border-white/25 text-white transition-colors hover:border-white";

export function MobileMenu({ icons, onOpenChange }: { icons: HeaderIcons; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next) getLenis()?.stop();
    else getLenis()?.start();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger className={`${iconButton} lg:hidden`}>
        {icons.menu}
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent aria-describedby="mobile-menu-desc" className="tone-dark">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Image
            src={site.logo.white.src}
            alt={site.logo.white.alt}
            width={151}
            height={56}
            className="h-11 w-auto"
          />
          <SheetClose className={iconButton}>
            {icons.close}
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription id="mobile-menu-desc" className="sr-only">
          Site navigation
        </SheetDescription>

        <nav aria-label="Mobile" className="flex-1 px-6 py-4">
          <AccordionPrimitive.Root type="multiple" className="flex flex-col">
            {headerNav.map((navItem) =>
              navItem.children ? (
                <AccordionPrimitive.Item key={navItem.label} value={navItem.label} className="border-b border-white/10">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-4 font-display text-[26px] leading-none font-semibold text-white">
                      {navItem.label}
                      <span className="text-amber transition-transform duration-300 group-data-[state=open]:rotate-180">
                        {icons.caretLarge}
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <ul className="flex flex-col gap-1 pb-4 pl-4">
                      {navItem.children.map((child) => (
                        <li key={child.label}>
                          <NoNavLink className="block py-2 text-[16px] text-white/75 hover:text-white">
                            {child.label}
                          </NoNavLink>
                        </li>
                      ))}
                    </ul>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ) : (
                <NoNavLink
                  key={navItem.label}
                  className="flex items-center justify-between border-b border-white/10 py-4 font-display text-[26px] leading-none font-semibold text-white"
                  aria-current={navItem.label === "Home" ? "page" : undefined}
                >
                  {navItem.label}
                  {navItem.label === "Home" ? <span aria-hidden className="h-px w-6 bg-amber" /> : null}
                </NoNavLink>
              ),
            )}
          </AccordionPrimitive.Root>
        </nav>

        <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-6">
          <EnquireButton
            location="mobile-menu"
            size="lg"
            className="w-full"
            onNavigate={() => handleOpenChange(false)}
          >
            {icons.enquire}
            {labels.enquireNow}
          </EnquireButton>
          <a
            href={`tel:${site.phoneE164}`}
            className="flex items-center justify-center gap-2 py-2 font-mono text-sm tracking-[0.1em] text-white/80 hover:text-white"
          >
            <span className="text-amber">{icons.phone}</span>
            {site.phoneDisplay}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
