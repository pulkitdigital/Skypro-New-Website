"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { ENQUIRY_ID, scrollToEnquiry } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface EnquireButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  /** Analytics label, e.g. "hero", "header", "counselling". */
  location: string;
  onNavigate?: () => void;
}

/**
 * In-page CTA: smooth-scrolls to the enquiry form and focuses its first field.
 * The URL hash is never changed (href is only a no-JS fallback).
 */
export function EnquireButton({ children, className, variant, size, location, onNavigate }: EnquireButtonProps) {
  return (
    <a
      href={`#${ENQUIRY_ID}`}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
        track("cta_enquire_click", { location });
        scrollToEnquiry();
      }}
    >
      {children}
    </a>
  );
}
