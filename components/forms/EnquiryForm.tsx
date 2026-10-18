"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AirplaneTakeoff } from "@phosphor-icons/react/dist/csr/AirplaneTakeoff";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CircleNotch } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { Warning } from "@phosphor-icons/react/dist/csr/Warning";
import {
  enquiryForm,
  interestOptions,
  qualificationOptions,
  startOptions,
  stateOptions,
} from "@/data/enquiry";
import { ENQUIRY_FIRST_FIELD_ID, ENQUIRY_ID, scrollToId } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enquiryDefaults, enquirySchema, type EnquiryValues } from "./enquirySchema";
import { submitEnquiry } from "./submitEnquiry";
import { FieldShell, gridClass, inputClass, labelClass, optionClass } from "./formLayout";

type Status = "idle" | "sending" | "takeoff" | "success" | "error";

const f = enquiryForm.fields;

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Take-off curve from the button's plane icon (quadratic Bézier, px relative to the icon). */
const P0 = { x: 0, y: 0 };
const P1 = { x: 110, y: -6 };
const P2 = { x: 300, y: -190 };
const bezier = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
});
const heading = (t: number) =>
  (Math.atan2(2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y), 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x)) * 180) /
  Math.PI;
const TRAIL_D = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
const TAKEOFF_MS = 1100;
const TAKEOFF_EASE = "cubic-bezier(0.5, 0, 0.75, 0.25)";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    // Rendered in the gap below its field (absolute), so showing an error never shifts the
    // layout — e.g. a blur error appearing between mousedown and mouseup on "Submit".
    <p id={id} className="absolute top-full left-0 mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-[1.3] text-[#b42318]">
      <Warning weight="regular" className="mt-px size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

const ORDER: (keyof EnquiryValues)[] = [
  "name",
  "mobile",
  "email",
  "qualification",
  "state",
  "city",
  "interest",
  "start",
  "question",
  "consent",
];
const FOCUS_ID: Partial<Record<keyof EnquiryValues, string>> = {
  name: ENQUIRY_FIRST_FIELD_ID,
  mobile: "enquiry-mobile",
  email: "enquiry-email",
  qualification: "enquiry-qualification",
  state: "enquiry-state",
  city: "enquiry-city",
  interest: "enquiry-interest-0",
  start: "enquiry-start-0",
  question: "enquiry-question",
  consent: "enquiry-consent",
};

/** Keeps the form's height (no layout shift) and is brought into view when it appears. */
function Received({ firstName, minHeight, onAgain }: { firstName: string; minHeight: number; onAgain: () => void }) {
  useEffect(() => scrollToId(ENQUIRY_ID), []);
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ minHeight }}
      className="flex min-h-[420px] animate-in flex-col items-start justify-center gap-5 py-10 duration-500 fade-in-0"
    >
      <CheckCircle weight="light" aria-hidden className="size-14 text-navy" />
      <h3 className="font-display text-[34px] leading-[1.05] font-bold text-navy md:text-[40px]">
        {enquiryForm.success.title(firstName || "there")}
      </h3>
      <p className="max-w-md text-muted">{enquiryForm.success.text}</p>
      <button type="button" className="link-arrow mt-2 text-navy" onClick={onAgain}>
        <ArrowCounterClockwise weight="light" className="size-[18px]" aria-hidden />
        {enquiryForm.success.again}
      </button>
    </div>
  );
}

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [firstName, setFirstName] = useState("");
  const [summary, setSummary] = useState("");
  const [formHeight, setFormHeight] = useState(0);
  const mountedAt = useRef(0);
  const lastValues = useRef<EnquiryValues | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLSpanElement>(null);
  const trail = useRef<SVGPathElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: enquiryDefaults,
    mode: "onTouched",
  });

  const questionLength = watch("question")?.length ?? 0;

  const succeed = (name: string) => {
    setFirstName(name);
    setFormHeight(scope.current?.offsetHeight ?? 0);
    setStatus(reduceMotion() ? "success" : "takeoff");
  };

  // Take-off: the plane lifts off the button along a curve, leaving a contrail; then the message shows.
  useEffect(() => {
    if (status !== "takeoff") return;
    const icon = plane.current;
    const path = trail.current;
    const timer = window.setTimeout(() => setStatus("success"), TAKEOFF_MS + 150);
    if (!icon?.animate || !path) return () => window.clearTimeout(timer);
    const start = heading(0);
    const frames = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      const p = bezier(t);
      return { transform: `translate(${p.x}px, ${p.y}px) rotate(${heading(t) - start}deg)`, opacity: t > 0.8 ? (1 - t) * 5 : 1 };
    });
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    const animations = [
      icon.animate(frames, { duration: TAKEOFF_MS, easing: TAKEOFF_EASE, fill: "forwards" }),
      path.animate(
        [
          { strokeDashoffset: length, opacity: 0.9 },
          { strokeDashoffset: 0, opacity: 0.9, offset: 0.85 },
          { strokeDashoffset: 0, opacity: 0 },
        ],
        { duration: TAKEOFF_MS + 150, easing: TAKEOFF_EASE, fill: "forwards" },
      ),
    ];
    return () => {
      window.clearTimeout(timer);
      animations.forEach((a) => a.cancel());
    };
  }, [status]);

  const send = async (form: EnquiryValues) => {
    lastValues.current = form;
    setSummary("");
    // Honeypot or impossibly fast submit → pretend success, send nothing.
    if (form.company || Date.now() - mountedAt.current < 3000) {
      succeed(form.name.split(" ")[0] ?? "");
      return;
    }
    setStatus("sending");
    try {
      await submitEnquiry(form);
      track("generate_lead", { interest: form.interest.join(", "), start: form.start });
      succeed(form.name.trim().split(/\s+/)[0] ?? "");
    } catch {
      setStatus("error");
    }
  };

  const onInvalid = (errs: FieldErrors<EnquiryValues>) => {
    const keys = ORDER.filter((k) => errs[k]);
    setSummary(`Please fix ${keys.length} ${keys.length === 1 ? "field" : "fields"} highlighted below.`);
    const first = keys[0] ? FOCUS_ID[keys[0]] : undefined;
    if (first) document.getElementById(first)?.focus();
  };

  const busy = status === "sending" || status === "takeoff";
  const describedBy = (key: keyof EnquiryValues) => (errors[key] ? `enquiry-${key}-error` : undefined);

  if (status === "success") {
    return (
      <Received
        firstName={firstName}
        minHeight={formHeight}
        onAgain={() => {
          reset(enquiryDefaults);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <div ref={scope}>
      <form noValidate onSubmit={handleSubmit(send, onInvalid)} aria-describedby="enquiry-summary" className="flex flex-col gap-6">
        <p id="enquiry-summary" aria-live="polite" className={cn("text-[14px] text-[#b42318]", !summary && "sr-only")}>
          {summary}
        </p>

        {status === "error" ? (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-[4px] border border-[#b42318]/40 bg-[#b42318]/5 p-4 text-[15px] text-[#b42318] sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-start gap-2">
              <Warning weight="regular" className="mt-0.5 size-4 shrink-0" aria-hidden />
              {enquiryForm.error.text}
            </p>
            <Button
              variant="navy"
              size="sm"
              onClick={() => (lastValues.current ? void send(lastValues.current) : setStatus("idle"))}
            >
              {enquiryForm.error.retry}
            </Button>
          </div>
        ) : null}

        <fieldset
          disabled={busy}
          className={cn(gridClass, "min-w-0 transition-opacity duration-700", status === "takeoff" && "[&>*:not(:last-child)]:opacity-30")}
        >
          <FieldShell label={f.name.label} htmlFor={ENQUIRY_FIRST_FIELD_ID}>
            <input
              id={ENQUIRY_FIRST_FIELD_ID}
              type="text"
              autoComplete="name"
              placeholder={f.name.placeholder}
              aria-required
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name")}
              className={inputClass}
              {...register("name")}
            />
            <FieldError id="enquiry-name-error" message={errors.name?.message} />
          </FieldShell>
          <FieldShell label={f.mobile.label} htmlFor="enquiry-mobile">
            <div className="relative">
              <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[14px] text-navy/80">
                +91
              </span>
              <input
                id="enquiry-mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={16}
                placeholder={f.mobile.placeholder}
                aria-required
                aria-invalid={!!errors.mobile}
                aria-describedby={describedBy("mobile")}
                className={cn(inputClass, "pl-14")}
                {...register("mobile")}
              />
            </div>
            <FieldError id="enquiry-mobile-error" message={errors.mobile?.message} />
          </FieldShell>
          <FieldShell label={f.email.label} htmlFor="enquiry-email">
            <input
              id="enquiry-email"
              type="email"
              autoComplete="email"
              placeholder={f.email.placeholder}
              aria-required
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("email")}
              className={inputClass}
              {...register("email")}
            />
            <FieldError id="enquiry-email-error" message={errors.email?.message} />
          </FieldShell>
          <FieldShell label={f.qualification.label} htmlFor="enquiry-qualification">
            <Controller
              control={control}
              name="qualification"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange} disabled={busy}>
                  <SelectTrigger
                    id="enquiry-qualification"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-required
                    aria-invalid={!!errors.qualification}
                    aria-describedby={describedBy("qualification")}
                  >
                    <SelectValue placeholder={f.qualification.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="enquiry-qualification-error" message={errors.qualification?.message} />
          </FieldShell>
          <FieldShell label={f.state.label} htmlFor="enquiry-state">
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange} disabled={busy}>
                  <SelectTrigger
                    id="enquiry-state"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-required
                    aria-invalid={!!errors.state}
                    aria-describedby={describedBy("state")}
                  >
                    <SelectValue placeholder={f.state.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="enquiry-state-error" message={errors.state?.message} />
          </FieldShell>
          <FieldShell label={f.city.label} htmlFor="enquiry-city">
            <input
              id="enquiry-city"
              type="text"
              autoComplete="address-level2"
              placeholder={f.city.placeholder}
              aria-required
              aria-invalid={!!errors.city}
              aria-describedby={describedBy("city")}
              className={inputClass}
              {...register("city")}
            />
            <FieldError id="enquiry-city-error" message={errors.city?.message} />
          </FieldShell>

          {/* Interest — multi-select (as on the live form) */}
          <Controller
            control={control}
            name="interest"
            render={({ field }) => (
              <fieldset className="relative md:col-span-2" aria-describedby={describedBy("interest")}>
                <legend className={cn(labelClass, "mb-2")}>{f.interest.label}</legend>
                <div className="grid gap-x-6 sm:grid-cols-2">
                  {interestOptions.map((option, i) => {
                    const checked = field.value.includes(option);
                    return (
                      <label key={option} htmlFor={`enquiry-interest-${i}`} className={optionClass}>
                        <Checkbox
                          id={`enquiry-interest-${i}`}
                          checked={checked}
                          aria-invalid={!!errors.interest}
                          onBlur={field.onBlur}
                          onCheckedChange={(state) =>
                            field.onChange(state === true ? [...field.value, option] : field.value.filter((v) => v !== option))
                          }
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                <FieldError id="enquiry-interest-error" message={errors.interest?.message} />
              </fieldset>
            )}
          />

          <Controller
            control={control}
            name="start"
            render={({ field }) => (
              <fieldset className="relative md:col-span-2" aria-describedby={describedBy("start")}>
                <legend className={cn(labelClass, "mb-2")}>{f.start.label}</legend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-required
                  aria-invalid={!!errors.start}
                  className="gap-x-6 gap-y-0 sm:grid-cols-2"
                >
                  {startOptions.map((option, i) => (
                    <label key={option} htmlFor={`enquiry-start-${i}`} className={optionClass}>
                      <RadioGroupItem id={`enquiry-start-${i}`} value={option} onBlur={field.onBlur} aria-invalid={!!errors.start} />
                      {option}
                    </label>
                  ))}
                </RadioGroup>
                <FieldError id="enquiry-start-error" message={errors.start?.message} />
              </fieldset>
            )}
          />

          <FieldShell label={f.question.label} htmlFor="enquiry-question" counter={`${questionLength}/2000`} wide>
            <textarea
              id="enquiry-question"
              rows={3}
              maxLength={2000}
              placeholder={f.question.placeholder}
              aria-invalid={!!errors.question}
              aria-describedby={describedBy("question")}
              className={cn(inputClass, "h-auto resize-y py-3 leading-relaxed")}
              {...register("question")}
            />
            <FieldError id="enquiry-question-error" message={errors.question?.message} />
          </FieldShell>

          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <div className="relative flex items-start gap-3 md:col-span-2">
                <Checkbox
                  id="enquiry-consent"
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={(state) => field.onChange(state === true)}
                  onBlur={field.onBlur}
                  aria-required
                  aria-invalid={!!errors.consent}
                  aria-describedby={describedBy("consent")}
                  className="mt-0.5"
                />
                <label htmlFor="enquiry-consent" className="text-[14px] leading-relaxed text-ink/85">
                  {f.consent.label}
                  <span aria-hidden className="text-navy">
                    *
                  </span>
                </label>
                <FieldError id="enquiry-consent-error" message={errors.consent?.message} />
              </div>
            )}
          />

          {/* Honeypot */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="enquiry-company">Company</label>
            <input id="enquiry-company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
          </div>

          <div className="flex flex-col gap-3 pt-2 md:col-span-2">
            <Button type="submit" size="lg" disabled={busy} className="w-full disabled:opacity-100" aria-disabled={busy}>
              <span className="relative inline-flex">
                {status === "sending" ? <CircleNotch weight="regular" className="animate-spin" aria-hidden /> : null}
                <span ref={plane} className={cn("inline-flex", status === "sending" && "hidden")}>
                  <AirplaneTakeoff weight="light" aria-hidden />
                </span>
                {/* contrail: starts at the icon's centre */}
                <svg aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 overflow-visible" width="1" height="1" fill="none">
                  <path ref={trail} d={TRAIL_D} stroke="var(--color-amber)" strokeWidth="2" strokeLinecap="round" opacity="0" />
                </svg>
              </span>
              {status === "sending" ? enquiryForm.sending : enquiryForm.submit}
            </Button>
            <p className="text-[13px] text-muted">* Required</p>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
