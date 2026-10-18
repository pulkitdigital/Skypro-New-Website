import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Presentational pieces of the enquiry form, shared by the real form (lazy chunk) and its
 * loading skeleton, so both have exactly the same footprint (no layout shift on mount).
 */

/** Two-column field grid on tablet/desktop; errors sit in the row gap (absolute). */
export const gridClass = "grid gap-x-6 gap-y-8 md:grid-cols-2";

/** Standard bordered input: 1px border, 4px radius, navy focus ring. */
export const inputClass =
  "h-12 w-full rounded-[4px] border border-navy/25 bg-white px-4 text-[16px] text-ink placeholder:text-muted/80 transition-[border-color,box-shadow] hover:border-navy/50 focus-visible:border-navy focus-visible:shadow-[0_0_0_3px_rgb(0_51_102/0.18)] focus-visible:outline-none aria-[invalid=true]:border-[#b42318]";

export const labelClass = "text-[14px] leading-snug font-medium text-ink";

/** One checkbox / radio option row. */
export const optionClass = "flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[15px] leading-snug text-ink";

/** Label + control + (absolute) error, used for every text/select field. */
export function FieldShell({
  label,
  htmlFor,
  counter,
  wide,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  counter?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative flex flex-col gap-2", wide && "md:col-span-2")}>
      <div className="flex items-end justify-between gap-4">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClass}>
            {label}
          </label>
        ) : (
          <span className={labelClass}>{label}</span>
        )}
        {counter ? <span className="shrink-0 font-mono text-[12px] text-muted">{counter}</span> : null}
      </div>
      {children}
    </div>
  );
}
