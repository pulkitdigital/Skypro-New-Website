"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { enquiryForm, interestOptions, startOptions } from "@/data/enquiry";
import { whenNear } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";
import { FieldShell, gridClass, inputClass, labelClass, optionClass } from "./formLayout";

export const ENQUIRY_LOAD_EVENT = "enquiry:load";

const importForm = () => import("./EnquiryForm").then((m) => m.EnquiryForm);
const EnquiryForm = dynamic(importForm, { ssr: false, loading: () => <FormSkeleton /> });

/** Static stand-in with the same layout as the real form (no layout shift on mount).
 *  The option-group labels are blocks with a bottom margin, like the form's <legend>s. */
function FormSkeleton() {
  const f = enquiryForm.fields;
  const box = <span className={cn(inputClass, "block")} />;
  const options = (list: readonly string[], round: boolean) => (
    <div className="grid gap-x-6 sm:grid-cols-2">
      {list.map((option) => (
        <span key={option} className={optionClass}>
          <span className={cn("size-5 shrink-0 border border-navy/40", round ? "rounded-full" : "rounded-[3px]")} />
          {option}
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <p className="sr-only">&nbsp;</p>
      <div className={gridClass}>
        <FieldShell label={f.name.label}>{box}</FieldShell>
        <FieldShell label={f.mobile.label}>
          <span className="flex gap-2">
            <span className={cn(inputClass, "block w-[112px] shrink-0")} />
            {box}
          </span>
        </FieldShell>
        <FieldShell label={f.email.label}>{box}</FieldShell>
        <FieldShell label={f.qualification.label}>{box}</FieldShell>
        <FieldShell label={f.state.label}>{box}</FieldShell>
        <FieldShell label={f.city.label}>{box}</FieldShell>
        <div className="md:col-span-2">
          <span className={cn(labelClass, "mb-2 block")}>{f.interest.label}</span>
          {options(interestOptions, false)}
        </div>
        <div className="md:col-span-2">
          <span className={cn(labelClass, "mb-2 block")}>{f.start.label}</span>
          {options(startOptions, true)}
        </div>
        <FieldShell label={f.question.label} counter="0/2000" wide>
          <span className={cn(inputClass, "block h-[104px]")} />
        </FieldShell>
        <div className="flex items-start gap-3 md:col-span-2">
          <span className="mt-0.5 size-5 shrink-0 rounded-[3px] border border-navy/40" />
          <span className="text-[14px] leading-relaxed text-ink/85">{f.consent.label}*</span>
        </div>
        <div className="flex flex-col gap-3 pt-2 md:col-span-2">
          <span className="block h-14 w-full rounded-[4px] bg-amber/60" />
          <span className="text-[13px] text-muted">* Required</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Loads the enquiry form (react-hook-form + zod + Radix Select…) only when it's near the
 * viewport or when an Enquire CTA is clicked (never during startup).
 */
export function EnquiryFormLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const show = () => alive && setReady(true);

    window.addEventListener(ENQUIRY_LOAD_EVENT, show);
    if (ref.current) whenNear(ref.current, "1200px").then(show);

    return () => {
      alive = false;
      window.removeEventListener(ENQUIRY_LOAD_EVENT, show);
    };
  }, []);

  return <div ref={ref}>{ready ? <EnquiryForm /> : <FormSkeleton />}</div>;
}
