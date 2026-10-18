"use client";

import { NavigationMenu } from "radix-ui";
import { headerNav } from "@/data/nav";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { cn } from "@/lib/utils";

const linkBase =
  "relative inline-flex h-10 items-center gap-1.5 px-2.5 font-display text-[17px] font-semibold tracking-[0.02em] text-white/85 transition-colors hover:text-white xl:px-3.5";

/**
 * Header navigation (Radix NavigationMenu — disclosure pattern with hover + keyboard; TRD TD-1).
 * Links never navigate.
 */
export function NavDesktop({ caret, className }: { caret: React.ReactNode; className?: string }) {
  return (
    <NavigationMenu.Root delayDuration={120} skipDelayDuration={240} aria-label="Main" className={cn("relative", className)}>
      <NavigationMenu.List className="flex items-center gap-0.5 xl:gap-1">
        {headerNav.map((item) =>
          item.children ? (
            <NavigationMenu.Item key={item.label} value={item.label} className="relative">
              <NavigationMenu.Trigger className={cn(linkBase, "group data-[state=open]:text-white")}>
                {item.label}
                <span className="transition-transform duration-300 group-data-[state=open]:rotate-180">{caret}</span>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute top-full left-0 pt-3 data-[motion]:animate-in data-[motion]:fade-in-0">
                <ul className="w-72 rounded-[6px] border border-hairline bg-white py-2">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <NavigationMenu.Link asChild>
                        <NoNavLink className="group/link flex items-center justify-between gap-3 px-5 py-2.5 text-[15px] font-medium text-navy transition-colors hover:bg-mist focus-visible:bg-mist">
                          {child.label}
                          <span aria-hidden className="h-px w-3 bg-amber transition-[width] duration-300 group-hover/link:w-6" />
                        </NoNavLink>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Link asChild active={item.label === "Home"}>
                <NoNavLink
                  className={cn(
                    linkBase,
                    "data-[active]:text-white data-[active]:after:absolute data-[active]:after:inset-x-2.5 data-[active]:after:-bottom-0.5 data-[active]:after:h-px data-[active]:after:bg-amber xl:data-[active]:after:inset-x-3.5",
                  )}
                >
                  {item.label}
                </NoNavLink>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
