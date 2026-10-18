"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUp } from "@phosphor-icons/react/dist/csr/CaretUp";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

/** Bordered trigger, matching the form's text inputs (components/forms/formLayout.tsx). */
export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-12 w-full items-center justify-between gap-2 rounded-[4px] border border-navy/25 bg-white px-4 text-left text-[16px] text-ink transition-[border-color,box-shadow] hover:border-navy/50 focus-visible:border-navy focus-visible:shadow-[0_0_0_3px_rgb(0_51_102/0.18)] focus-visible:outline-none data-[placeholder]:text-muted aria-[invalid=true]:border-[#b42318] [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDown weight="light" className="size-[18px] shrink-0 text-navy" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        data-lenis-prevent
        className={cn(
          "relative z-[80] max-h-[min(var(--radix-select-content-available-height),340px)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[4px] border border-hairline bg-white text-ink shadow-[0_18px_40px_-24px_rgb(0_31_63/0.45)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center text-navy">
          <CaretUp weight="regular" className="size-3.5" aria-hidden />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="py-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center text-navy">
          <CaretDown weight="regular" className="size-3.5" aria-hidden />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default items-center py-2.5 pr-9 pl-4 text-[15px] outline-none select-none data-[disabled]:opacity-50 data-[highlighted]:bg-mist data-[highlighted]:text-navy",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check weight="regular" className="size-3.5 text-navy" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}
