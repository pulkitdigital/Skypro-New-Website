"use client";

import { site } from "@/data/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useHeroScroll } from "./useHeroPassed";

/** The only external link on the page (brief). Appears after the hero. */
export function WhatsAppButton({ icon }: { icon: React.ReactNode }) {
  const { passed } = useHeroScroll(0);

  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SkyPro Aviation on WhatsApp (opens in a new tab)"
      onClick={() => track("whatsapp_click")}
      data-whatsapp
      tabIndex={passed ? 0 : -1}
      aria-hidden={!passed}
      className={cn(
        "hover-shadow fixed right-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 flex size-[52px] items-center justify-center rounded-[6px] bg-amber text-navy transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:right-6 md:bottom-6 md:size-14",
        passed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {icon}
    </a>
  );
}
