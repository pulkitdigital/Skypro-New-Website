import type { Icon } from "@phosphor-icons/react";
import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr/AirplaneTilt";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { CloudSun } from "@phosphor-icons/react/dist/ssr/CloudSun";
import { Compass } from "@phosphor-icons/react/dist/ssr/Compass";
import { Gear } from "@phosphor-icons/react/dist/ssr/Gear";
import { Headset } from "@phosphor-icons/react/dist/ssr/Headset";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { deferredSection } from "@/lib/sectionSizes";
import { requirements, TOTAL_FLYING_HOURS } from "@/data/requirements";
import { headings } from "@/data/sections";
import type { FlyingHours } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoursGauge } from "@/components/fx/HoursGauge";

const pad = (n: number) => String(n).padStart(2, "0");

/** One icon per ground-school subject (in data order). */
const SUBJECT_ICONS: Record<string, Icon> = {
  "Air Navigation": Compass,
  "Aviation Meteorology": CloudSun,
  "Air Regulation": Scales,
  "Technical General": Gear,
  "Technical Specific": AirplaneTilt,
  "Radio Telephony (RTR-A)": Headset,
};

/** Row labels for the flying-hours bars (each is a fragment of its own requirement text). */
const HOURS_LABEL: Record<FlyingHours["code"], string> = {
  PIC: "Pilot-in-Command",
  XC: "Cross-country",
  IF: "Instrument",
  NIGHT: "Night",
};

/**
 * Items 01–05 as rows (a check circle draws itself as each scrolls in; item 05's subjects flip
 * in as tiles) beside a navy "Flying Hours Requirement" panel (item 06, sticky on tall desktop
 * screens): gauge + counter, four bars with the full text, and the flight checks ticking in.
 * Every line of the requirements is always visible.
 */
export function Requirements() {
  const cv = deferredSection("requirements");
  const h = headings.requirements;
  const flying = requirements.find((r) => r.highlight);
  const items = requirements.filter((r) => !r.highlight);

  return (
    <section id="requirements" className={`relative bg-ivory py-20 md:py-28 ${cv.className}`} style={cv.style}>
      <div className="container-x">
        <SectionHeading title={h.title} className="mb-12 max-w-3xl md:mb-16" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* 01–05 */}
          <ol className="border-t border-hairline lg:col-span-5">
            {items.map((req) => (
              <li key={req.id} data-check className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-hairline py-7">
                {/* amber on a navy chip (amber text needs a navy backing for contrast) */}
                <span aria-hidden className="flex size-10 items-center justify-center rounded-[4px] bg-navy-deep font-mono text-[15px] font-bold text-amber">
                  {pad(req.number)}
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[24px] leading-[1.1] font-semibold text-navy">{req.title}</h3>
                    <CheckCircle data-tick weight="light" aria-hidden className="size-7 shrink-0 text-amber" />
                  </div>
                  <p className="text-muted">{req.text}</p>
                  {req.subjects ? (
                    <ul aria-label="CPL ground school subjects" data-tiles className="mt-3 grid grid-cols-2 gap-2.5">
                      {req.subjects.map((subject) => {
                        const SubjectIcon = SUBJECT_ICONS[subject];
                        return (
                          <li
                            key={subject}
                            data-tile
                            className="flex min-h-[64px] items-center gap-3 rounded-[4px] border border-hairline bg-white px-3 py-2.5 text-[14px] leading-snug font-medium text-navy"
                          >
                            {SubjectIcon ? <SubjectIcon weight="light" aria-hidden className="size-6 shrink-0 text-amber" /> : null}
                            {subject}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          {/* 06 — Flying hours */}
          {flying?.hours ? (
            <div className="lg:col-span-7">
              <div data-cockpit className="sticky-tall tone-dark screen-glow flex flex-col gap-8 rounded-[6px] bg-navy-deep p-6 text-white md:p-9">
                <div className="flex flex-col gap-2">
                  <h3 className="flex items-baseline gap-3">
                    <span aria-hidden className="font-mono text-[18px] font-bold text-amber">
                      {pad(flying.number)}
                    </span>
                    <span className="label text-white/85">{flying.title}</span>
                  </h3>
                  <p className="text-white/80">{flying.text}</p>
                </div>

                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
                  <div className="w-full max-w-[260px] shrink-0">
                    <HoursGauge total={TOTAL_FLYING_HOURS} />
                  </div>
                  <p className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                    <span data-gauge-value className="font-mono text-[64px] leading-none font-bold md:text-[76px]">
                      {TOTAL_FLYING_HOURS}
                    </span>
                    <span className="label text-white/70">Minimum total flying hours</span>
                  </p>
                </div>

                <ul className="flex flex-col border-t border-white/12">
                  {flying.hours.map((row) => (
                    <li key={row.code} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-white/12 py-4 md:grid-cols-[5.5rem_1fr]">
                      <span className="font-mono text-[34px] leading-none font-bold text-amber md:text-[40px]">{row.hours}</span>
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex items-baseline justify-between gap-3 text-[14px]">
                          <span className="font-medium">{HOURS_LABEL[row.code]}</span>
                          <span className="font-mono text-white/60">
                            {row.hours}/{TOTAL_FLYING_HOURS} hrs
                          </span>
                        </div>
                        <span aria-hidden className="relative block h-1 overflow-hidden rounded-full bg-white/12">
                          <span
                            data-hours-bar
                            className="absolute inset-y-0 left-0 rounded-full bg-amber"
                            style={{ width: `${(row.hours / TOTAL_FLYING_HOURS) * 100}%` }}
                          />
                        </span>
                        <p className="text-[14.5px] leading-relaxed text-white/80">{row.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {flying.flightChecks ? (
                  <div className="flex flex-col gap-3">
                    <p className="label text-white/85">{flying.flightChecks.title}</p>
                    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {flying.flightChecks.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[15px] text-white/85">
                          <Check data-flight-check weight="light" aria-hidden className="mt-0.5 size-[18px] shrink-0 text-amber" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
