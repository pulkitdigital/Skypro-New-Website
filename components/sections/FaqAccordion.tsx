"use client";

import { useState } from "react";
import { faqs } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * Accordion: one row open at a time (the first by default). Opening a row extends an amber
 * dashed runway centreline under the question, turns the Plus into a Minus and slides the
 * answer down (grid-rows transition). Every answer stays in the DOM (SEO); closed ones are inert.
 */
export function FaqAccordion({ plus, minus }: { plus: React.ReactNode; minus: React.ReactNode }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="border-t border-hairline">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        const buttonId = `faq-q-${faq.id}`;
        const panelId = `faq-a-${faq.id}`;
        return (
          <div key={faq.id} className="group border-b border-hairline">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : faq.id)}
                className="relative flex min-h-11 w-full cursor-pointer items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="font-display text-[21px] leading-[1.2] font-semibold text-navy transition-colors group-hover:text-navy-deep md:text-[24px]">
                  {faq.question}
                </span>
                {/* Plus → Minus: the plus turns a quarter and hands over to the minus */}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                    isOpen ? "border-amber bg-amber text-navy" : "border-navy/25 text-navy group-hover:border-navy",
                  )}
                >
                  <span className={cn("absolute transition-[rotate,opacity] duration-300", isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100")}>
                    {plus}
                  </span>
                  <span className={cn("absolute transition-[rotate,opacity] duration-300", isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")}>
                    {minus}
                  </span>
                </span>
                {/* runway centreline */}
                <span
                  aria-hidden
                  className={cn(
                    "dash-x absolute bottom-0 left-0 w-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              data-faq-panel
              className={cn(
                "grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "max-w-3xl pt-5 pr-12 pb-7 text-[17px] text-muted transition-[opacity,translate] duration-500",
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                  )}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
