"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  tone = "light",
  closeIcon,
  closeClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  tone?: "light" | "dark";
  closeIcon: React.ReactNode;
  /** Extra classes for the close button (e.g. when it sits on a photo). */
  closeClassName?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-navy-deep/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        data-lenis-prevent
        className={cn(
          "fixed z-[95] flex max-h-[92svh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-[6px] outline-none",
          // mobile: bottom sheet · desktop: centred dialog
          "inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:max-w-3xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[6px]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          tone === "dark" ? "tone-dark bg-navy-deep text-white" : "bg-white text-ink",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-4 right-4 flex size-10 items-center justify-center rounded-[4px] transition-colors",
            tone === "dark" ? "bg-white/10 text-white hover:bg-white hover:text-navy" : "bg-mist text-navy hover:bg-navy hover:text-white",
            closeClassName,
          )}
        >
          {closeIcon}
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("h3", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-muted", className)} {...props} />;
}
