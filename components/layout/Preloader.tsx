import { site } from "@/data/site";
import { headings } from "@/data/sections";

/**
 * Logo + progress line, max 1.2 s. Pure CSS (in the static HTML), so it never
 * waits for JS. Hidden on repeat visits in the same session (html.no-preloader, set by
 * an inline script in <head>) and for prefers-reduced-motion.
 */
export function Preloader() {
  return (
    <div aria-hidden className="preloader">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={site.logo.white.src} alt="" width={151} height={56} className="preloader__logo" />
      <div className="preloader__runway">
        <span className="preloader__bar" />
      </div>
      {/* Live eyebrow copy. As text it is also the page's LCP element (paints with FCP). */}
      <p className="preloader__caption">{headings.heroIntro.eyebrow}</p>
    </div>
  );
}
