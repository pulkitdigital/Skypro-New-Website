import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { Batch } from "@/data/types";
import { labels } from "@/data/sections";
import { EnquireButton } from "@/components/ui/EnquireButton";
import { WatchDemoButton } from "@/components/ui/DemoLectures";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-navy">{children}</dd>
    </div>
  );
}

/**
 * One batch as a boarding pass: white main part, perforated edge, navy stub with the actions.
 * The pass slides in once (motion runtime); on hover the stub tears a few px away.
 */
export function BoardingPass({ batch }: { batch: Batch }) {
  return (
    <article data-slide-in aria-label={batch.program} className="group flex flex-col lg:flex-row">
      {/* Main */}
      <div className="flex-1 rounded-t-[6px] border border-b-0 border-hairline bg-ivory p-6 shadow-[0_24px_50px_-36px_rgb(0_31_63/0.45)] md:p-9 lg:rounded-l-[6px] lg:rounded-tr-none lg:border-r-0 lg:border-b">
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5 sm:col-span-3">
            <dt className="text-[14px] text-muted">Program</dt>
            <dd className="font-display text-[28px] leading-[1.05] font-bold text-navy md:text-[32px]">{batch.program}</dd>
          </div>
          <Field label="Mode">
            <span className="text-[17px] font-medium">{batch.classType}</span>
          </Field>
          <Field label="Date">
            <time dateTime={batch.startDateISO} className="font-mono text-[16px] tracking-[0.02em]">
              {batch.startDateLabel}
            </time>
          </Field>
          <Field label="Time">
            <span className="font-mono text-[16px] tracking-[0.02em]">{batch.startTimeLabel}</span>
          </Field>
        </dl>
      </div>

      {/* Perforated edge with punched notches */}
      <div aria-hidden className="relative h-6 shrink-0 border-x border-hairline bg-ivory lg:h-auto lg:w-6 lg:border-x-0 lg:border-y">
        <span className="absolute inset-x-6 top-1/2 border-t border-dashed border-navy/25 lg:inset-x-auto lg:inset-y-6 lg:top-auto lg:left-[11px] lg:border-t-0 lg:border-l" />
        <span className="absolute top-0 -left-3 size-6 rounded-full bg-white lg:-top-3 lg:left-0" />
        <span className="absolute top-0 -right-3 size-6 rounded-full bg-white lg:top-auto lg:right-auto lg:-bottom-3 lg:left-0" />
      </div>

      {/* Stub — tears a few px away on hover */}
      <div className="tone-dark flex flex-col justify-center gap-5 rounded-b-[6px] bg-navy-deep p-6 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1.5 md:p-8 lg:w-[290px] lg:rounded-r-[6px] lg:rounded-bl-none lg:group-hover:translate-x-2 lg:group-hover:translate-y-0 lg:group-hover:rotate-[1.2deg]">
        <EnquireButton location="batch" variant="amber" size="lg" className="w-full">
          {labels.enrollNow}
        </EnquireButton>
        <WatchDemoButton className="min-h-11 self-start text-white">
          {labels.watchDemo}
          <ArrowRight weight="light" aria-hidden className="size-[18px]" />
        </WatchDemoButton>
      </div>
    </article>
  );
}
