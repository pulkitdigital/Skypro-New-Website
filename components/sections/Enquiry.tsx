import Image from "next/image";
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
import { deferredSection } from "@/lib/sectionSizes";

const icon = "mt-0.5 size-5 shrink-0 text-amber";
const row = "flex min-h-11 items-start gap-3.5 py-3 text-[15px] text-white/90";

/**
 * Split layout: the navy panel (runway photo under a navy overlay) with the heading and the
 * contacts grouped together, sticky on desktop while the form scrolls, and the form on a white panel.
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
          {/* Navy panel */}
          <div className="relative isolate bg-navy-deep lg:col-span-5">
            <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
              <Image
                src="/media/requirements-runway.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_62%]"
              />
              <div className="absolute inset-0 bg-navy-deep/[0.78]" />
            </div>

            <div className="tone-dark flex flex-col gap-10 p-7 py-10 text-white md:gap-12 md:p-10 lg:sticky lg:top-[88px] lg:p-12">
              <SectionHeading id="enquiry-title" eyebrow={h.eyebrow} title={h.title} tone="dark">
                <p className="text-white/85">{enquiryForm.intro}</p>
              </SectionHeading>

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

          {/* Form */}
          <div className="bg-white p-6 md:p-10 lg:col-span-7 lg:p-12">
            <EnquiryFormLazy />
          </div>
        </div>
      </div>
    </section>
  );
}
