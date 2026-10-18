"use client";

import * as React from "react";
import { preventNav } from "@/lib/utils";

/**
 * Renders href="#" and prevents navigation (docs/PRD.md §7). All nav, footer,
 * course and blog links go through this component so the rule lives in one place.
 */
export const NoNavLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function NoNavLink({ onClick, children, ...props }, ref) {
    return (
      <a
        ref={ref}
        {...props}
        href="#"
        onClick={(event) => {
          preventNav(event);
          onClick?.(event);
        }}
      >
        {children}
      </a>
    );
  },
);
