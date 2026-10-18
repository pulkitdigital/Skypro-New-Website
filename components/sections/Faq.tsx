import { Minus } from "@phosphor-icons/react/dist/ssr/Minus";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { deferredSection } from "@/lib/sectionSizes";
import { headings, labels } from "@/data/sections";
import { site } from "@/data/site";
import { FaqAccordion } from "./FaqAccordion";

const contactLink = "flex items-center gap-3 text-[16px] text-navy transition-colors hover:text-navy-deep hover:underline";

/** Heading + contact links (sticky on desktop) beside a plain accordion. */
export function Faq() {
  const cv = deferredSection("faq");
  const h = headings.faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className={`relative bg-white py-20 md:py-28 ${cv.className}`} style={cv.style}>
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-10 lg:sticky lg:top-[100px]">
            <h2 id="faq-title" data-split className="h2 text-navy">
              {h.title}
            </h2>
            <div className="flex flex-col gap-4 border-t border-hairline pt-7">
              <p className="font-display text-[22px] leading-tight font-semibold text-navy">Still have questions?</p>
              <a href={`tel:${site.phoneE164}`} className={contactLink}>
                <Phone weight="light" aria-hidden className="size-5 text-navy" />
                {labels.call} {site.phoneDisplay}
              </a>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp SkyPro Aviation (opens in a new tab)"
                className={contactLink}
              >
                <WhatsappLogo weight="light" aria-hidden className="size-5 text-navy" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div data-block className="lg:col-span-8">
          <FaqAccordion plus={<Plus weight="light" className="size-5" />} minus={<Minus weight="light" className="size-5" />} />
        </div>
      </div>
    </section>
  );
}
