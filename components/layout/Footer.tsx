import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { GlobeHemisphereEast } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereEast";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { site } from "@/data/site";
import { footerCourses, footerQuickLinks } from "@/data/nav";
import { about } from "@/data/sections";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { deferredSection } from "@/lib/sectionSizes";
import { cn } from "@/lib/utils";

const firstAboutSentence = about.paragraphs[0]!.split(". ")[0] + ".";
const contactIcon = "mt-0.5 size-5 shrink-0 text-amber";
const column = "flex flex-col gap-6 border-t border-white/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="label text-white/60">{children}</h2>;
}

export function Footer() {
  const cv = deferredSection("footer");
  return (
    <footer data-cursor-zone="plane" className={`tone-dark relative overflow-hidden bg-navy-deep text-white ${cv.className}`} style={cv.style}>
      <div className="container-x relative pt-20 pb-14 md:pt-24 md:pb-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.25fr] lg:gap-0">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <NoNavLink aria-label={`${site.name} — home`} className="self-start">
              <Image src={site.logo.white.src} alt={site.logo.white.alt} width={151} height={56} className="h-12 w-auto" />
            </NoNavLink>
            <p className="max-w-sm text-[15px] text-white/65">{firstAboutSentence}</p>
            <ul className="flex gap-2" aria-label="Social media">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <NoNavLink
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-[4px] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {social.label === "Instagram" ? (
                      <InstagramLogo weight="light" aria-hidden className="size-6" />
                    ) : (
                      <YoutubeLogo weight="light" aria-hidden className="size-6" />
                    )}
                  </NoNavLink>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick Links" className={column}>
            <ColumnTitle>Quick Links</ColumnTitle>
            <ul className="grid gap-3">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <NoNavLink className="text-[15px] text-white/75 transition-colors hover:text-white">{link.label}</NoNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Our Courses" className={column}>
            <ColumnTitle>Our Courses</ColumnTitle>
            <ul className="grid gap-3">
              {footerCourses.map((link) => (
                <li key={link.label}>
                  <NoNavLink className="text-[15px] text-white/75 transition-colors hover:text-white">{link.label}</NoNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={cn(column, "md:col-span-2 lg:col-span-1")}>
            <ColumnTitle>Contact Us</ColumnTitle>
            <ul className="grid gap-4 text-[15px] text-white/80">
              <li>
                <a href={`tel:${site.phoneE164}`} className="flex items-start gap-3 transition-colors hover:text-white">
                  <Phone weight="light" aria-hidden className={contactIcon} />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-start gap-3 transition-colors hover:text-white">
                  <EnvelopeSimple weight="light" aria-hidden className={contactIcon} />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin weight="light" aria-hidden className={contactIcon} />
                <address className="not-italic">{site.addressDisplay}</address>
              </li>
              <li className="flex items-start gap-3">
                <GlobeHemisphereEast weight="light" aria-hidden className={contactIcon} />
                {site.website}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Big wordmark across the bottom; the motion runtime raises it letter by letter */}
      <div aria-hidden className="relative overflow-hidden border-t border-white/10 pt-10 md:pt-14">
        <p data-wordmark className="outline-type mx-auto w-max max-w-full pb-2 text-center text-[12.4vw] [-webkit-text-stroke-color:rgb(255_255_255/0.16)]">
          {site.name.toUpperCase()}
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
          <p>{site.createdBy}</p>
        </div>
      </div>
    </footer>
  );
}
