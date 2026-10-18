"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer flex size-5 shrink-0 items-center justify-center rounded-[3px] border border-navy/40 bg-white transition-colors outline-none hover:border-navy data-[state=checked]:border-navy data-[state=checked]:bg-navy data-[state=checked]:text-white aria-[invalid=true]:border-[#b42318]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check weight="bold" className="size-3.5" aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
