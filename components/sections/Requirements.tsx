import type { Icon } from "@phosphor-icons/react";
import { CalendarCheck } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { ChalkboardTeacher } from "@phosphor-icons/react/dist/ssr/ChalkboardTeacher";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { IdentificationCard } from "@phosphor-icons/react/dist/ssr/IdentificationCard";
import { Stethoscope } from "@phosphor-icons/react/dist/ssr/Stethoscope";
import { Timer } from "@phosphor-icons/react/dist/ssr/Timer";
import { deferredSection } from "@/lib/sectionSizes";
import { requirements, TOTAL_FLYING_HOURS } from "@/data/requirements";
import { headings } from "@/data/sections";
import type { FlyingHours, Requirement } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

const ICONS: Record<string, Icon> = {
  education: GraduationCap,
  age: CalendarCheck,
  medical: Stethoscope,
  "computer-number": IdentificationCard,
  "ground-school": ChalkboardTeacher,
  "flying-hours": Timer,
};

/** Row labels for the flying-hours bars (each is a fragment of its own requirement text). */
const HOURS_LABEL: Record<FlyingHours["code"], string> = {
  PIC: "Pilot-in-Command",
  XC: "Cross-country",
  IF: "Instrument",
  NIGHT: "Night",
};

function CardTop({ req, dark }: { req: Requirement; dark?: boolean }) {
  const CardIcon = ICONS[req.id];
  return (
    <div className="flex items-start justify-between gap-4">
      {/* decorative outlined numeral (the list carries the order), drawn as a graphic */}
      <svg aria-hidden viewBox="0 0 60 40" className="h-10 w-[60px] overflow-visible">
        <text x="0" y="37" fill="none" stroke="var(--color-amber)" strokeWidth="1.5" className="font-display text-[48px] font-bold">
          {pad(req.number)}
        </text>
      </svg>
      {CardIcon ? <CardIcon weight="light" aria-hidden className={cn("size-6 shrink-0", dark ? "text-white/70" : "text-navy/70")} /> : null}
    </div>
  );
}

/** Desktop columns (of 6): 01–03 a third each, 04–05 half each; 05 is full width on tablets. */
const SPAN: Record<string, string> = {
  education: "lg:col-span-2",
  age: "lg:col-span-2",
  medical: "lg:col-span-2",
  "computer-number": "lg:col-span-3",
  "ground-school": "md:col-span-2 lg:col-span-3",
};

/** 01–05: light card, outlined number, line icon, title and text (05 adds its subjects as chips). */
function RequirementCard({ req }: { req: Requirement }) {
  return (
    <li className={cn("flex flex-col gap-4 rounded-[6px] border border-hairline bg-white p-6", SPAN[req.id])}>
      <CardTop req={req} />
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] leading-[1.1] font-semibold text-navy">{req.title}</h3>
        <p className="text-muted">{req.text}</p>
        {req.subjects ? (
          <ul aria-label="CPL ground school subjects" className="mt-2 flex flex-wrap gap-1.5">
            {req.subjects.map((subject) => (
              <li key={subject} className="rounded-[4px] border border-hairline bg-mist px-2.5 py-1.5 text-[13px] leading-tight font-medium text-navy">
                {subject}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

/**
 * 06: the full-width navy card. Desktop: three parts side by side — the total (~25%), the four
 * hour bars as a 2×2 grid (~45%) and the flight checks (~30%, after a thin divider). Below
 * desktop the parts stack.
 */
function FlyingHoursCard({ req }: { req: Requirement }) {
  return (
    <li className="tone-dark grid gap-8 rounded-[6px] bg-navy p-6 text-white md:col-span-2 lg:col-span-6 lg:grid-cols-[minmax(0,25fr)_minmax(0,45fr)_minmax(0,30fr)] lg:gap-10 lg:p-8">
      <div className="flex flex-col gap-4">
        <CardTop req={req} dark />
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[22px] leading-[1.1] font-semibold">{req.title}</h3>
          <p className="text-[15px] text-white/80">{req.text}</p>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[56px] leading-none font-bold">{TOTAL_FLYING_HOURS}</span>
          <span className="label text-white/70">Minimum total flying hours</span>
        </p>
      </div>

      {req.hours ? (
        <ul data-hours className="grid content-start gap-x-8 gap-y-6 md:grid-cols-2">
          {req.hours.map((row) => (
            <li key={row.code} className="flex flex-col gap-1.5">
              {/* label and hours on one line; in a narrow cell the hours drop below the label */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="label whitespace-nowrap text-white/85 md:text-[12px]">{HOURS_LABEL[row.code]}</span>
                <span className="shrink-0 font-mono text-[13px] whitespace-nowrap text-white/60">
                  <span className="text-white">{row.hours}</span>/{TOTAL_FLYING_HOURS} hrs
                </span>
              </div>
              <span aria-hidden className="relative block h-[3px] overflow-hidden rounded-full bg-white/12">
                <span
                  data-hours-bar
                  className="absolute inset-y-0 left-0 rounded-full bg-amber"
                  style={{ width: `${(row.hours / TOTAL_FLYING_HOURS) * 100}%` }}
                />
              </span>
              <p className="text-[12.5px] leading-snug text-white/65">{row.text}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {req.flightChecks ? (
        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <p className="label text-white/85">{req.flightChecks.title}</p>
          <ul className="grid gap-x-6 gap-y-1.5 text-[13px] leading-snug text-white/75 md:grid-cols-2 lg:grid-cols-1">
            {req.flightChecks.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check weight="light" aria-hidden className="mt-px size-3.5 shrink-0 text-amber" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Six-column grid on desktop: 01–03 in a row of thirds, 04–05 in a row of halves, then the navy
 * flying-hours card (06) across the full width. Tablet: two columns with 05 and 06 full width;
 * phones: one column, 01 → 06. The cards rise in a stagger and the hours bars fill as card 06
 * comes into view (motion runtime). Every line of the requirements is always visible.
 */
export function Requirements() {
  const cv = deferredSection("requirements");
  const h = headings.requirements;
  return (
    <section id="requirements" className={`relative bg-ivory py-20 md:py-28 ${cv.className}`} style={cv.style}>
      <div className="container-x">
        <SectionHeading title={h.title} className="mb-10 max-w-3xl" />
        <ol data-stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {requirements.map((req) => (req.highlight ? <FlyingHoursCard key={req.id} req={req} /> : <RequirementCard key={req.id} req={req} />))}
        </ol>
      </div>
    </section>
  );
}
