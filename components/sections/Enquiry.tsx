import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { headings } from "@/data/sections";
import { enquiryForm } from "@/data/enquiry";
import { site } from "@/data/site";
import { ENQUIRY_ID } from "@/lib/lenis";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryFormLazy } from "@/components/forms/EnquiryFormLazy";
import { RunwayTakeoff } from "@/components/fx/RunwayTakeoff";
import { deferredSection } from "@/lib/sectionSizes";

const icon = "mt-0.5 size-5 shrink-0 text-amber";
const row = "flex min-h-11 items-start gap-3.5 py-3 text-[15px] text-white/90";

/**
 * Split layout: the runway panel (sticky on desktop while the form scrolls) with a scroll-driven
 * takeoff behind the heading and contacts, and the form on a white panel.
 */
export function Enquiry() {
  const h = headings.enquiry;
  const cv = deferredSection("enquiry");

  return (
    <section
      id={ENQUIRY_ID}
      aria-labelledby="enquiry-title"
      className={`relative bg-ivory py-20 md:py-28 ${cv.className}`}
      style={cv.style}
    >
      <div className="container-x">
        <div className="grid overflow-clip rounded-[6px] shadow-[0_30px_70px_-50px_rgb(0_31_63/0.6)] lg:grid-cols-12">
          {/* Runway panel */}
          <div className="relative bg-navy-deep lg:col-span-5">
            <div
              data-runway-panel
              className="tone-dark relative isolate flex min-h-[60vh] flex-col justify-between overflow-hidden text-white lg:sticky lg:top-[88px] lg:h-[calc(100svh-112px)] lg:max-h-full lg:min-h-[560px]"
            >
              <RunwayTakeoff photo="/media/requirements-runway.webp" plane="/media/fx/plane-takeoff.webp" />
              {/* text sits on gradients above the animation */}
              <div className="bg-gradient-to-b from-navy-deep/95 via-navy-deep/75 to-transparent p-7 pb-12 md:p-10 md:pb-14 lg:p-12 lg:pb-14">
                <SectionHeading id="enquiry-title" eyebrow={h.eyebrow} title={h.title} tone="dark">
                  <p className="text-white/85">{enquiryForm.intro}</p>
                </SectionHeading>
              </div>

              <div className="bg-gradient-to-t from-navy-deep via-navy-deep/85 to-transparent px-7 pt-12 pb-6 md:px-10 md:pb-8 lg:px-12 lg:pb-10">
                <ul className="divide-y divide-white/12 border-y border-white/12">
                  <li>
                    <a href={`tel:${site.phoneE164}`} className={`${row} transition-colors hover:text-white`}>
                      <Phone weight="light" aria-hidden className={icon} />
                      {site.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${site.email}`} className={`${row} transition-colors hover:text-white`}>
                      <EnvelopeSimple weight="light" aria-hidden className={icon} />
                      {site.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${site.phoneDisplay} (opens in a new tab)`}
                      className={`${row} transition-colors hover:text-white`}
                    >
                      <WhatsappLogo weight="light" aria-hidden className={icon} />
                      <span>WhatsApp {site.phoneDisplay}</span>
                    </a>
                  </li>
                  <li className={row}>
                    <MapPin weight="light" aria-hidden className={icon} />
                    <address className="not-italic">{site.addressDisplay}</address>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 md:p-10 lg:col-span-7 lg:p-12">
            <EnquiryFormLazy />
          </div>
        </div>
      </div>
    </section>
  );
}
