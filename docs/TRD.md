# SkyPro Aviation — Homepage Rebuild · Technical Requirements (TRD)

| | |
|---|---|
| Version | 1.0 — draft for approval |
| Date | 16 Oct 2026 |
| Companion docs | [`PRD.md`](PRD.md) · [`content-extract.md`](content-extract.md) |
| Runtime used for Phase 0 | Node 24.18.0 · npm 11.16.0 · Python 3.13 · ffmpeg 6.1.1 (ffmpeg-static) · sharp 0.34.5 · Playwright 1.64 (Chromium 1243) |

---

## 1. Tech stack (exact versions, pinned without `^`)

| Area | Package | Version | Notes |
|---|---|---|---|
| Framework | `next` | **15.5.28** | Latest 15.x (16.4 is "latest" on npm; the brief requires 15) |
| | `react`, `react-dom` | **19.3.1** | Within Next 15 peer range `^19.0.0` |
| Language | `typescript` | **5.9.3** | TS 7.0 is out, but Next 15 tooling targets TS 5.x. `strict: true` |
| | `@types/react` / `@types/react-dom` / `@types/node` | 19.3.0 / 19.3.0 / 24.19.2 | |
| Styling | `tailwindcss`, `@tailwindcss/postcss` | **4.3.3** | CSS-first `@theme` tokens, no `tailwind.config.js` |
| | `postcss` | 8.5.30 | |
| | `tw-animate-css` | 1.4.0 | shadcn v4 animation utilities |
| UI primitives | `shadcn` (CLI, dev only) | 4.22.0 | Generates components into `components/ui/` |
| | `radix-ui` | 1.8.1 | Unified Radix package used by shadcn (Accordion, Select, Checkbox, RadioGroup, Dialog/Sheet, NavigationMenu, Tabs, Slot, Label) |
| | `class-variance-authority` · `clsx` · `tailwind-merge` | 0.7.1 · 2.1.1 · 3.7.0 | `cn()` helper |
| | `embla-carousel-react` | 8.6.0 | shadcn Carousel |
| Animation | `gsap` | **3.15.0** | ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin are all free and included |
| | `@gsap/react` | 2.1.2 | `useGSAP()` |
| | `lenis` | 1.3.27 | Smooth scroll |
| | `motion` | 14.3.0 | `motion/react` micro-interactions |
| Forms | `react-hook-form` | 7.90.0 | |
| | `zod` | **4.6.7** | v4 API (`z.email()`). `@hookform/resolvers` 5.x supports v4 |
| | `@hookform/resolvers` | 5.9.1 | |
| Icons | `@phosphor-icons/react` | 2.1.10 | `weight="light"` (`regular` below 16px). Replaced `lucide-react` in the redesign pass (§18) |
| YouTube | *custom facade* (`components/ui/YouTubeFacade.tsx`) | — | About 40 lines, no dependency (the brief allows "or a custom lightweight facade") |
| Lint/format | `eslint` | 9.39.5 | Flat config |
| | `eslint-config-next` | 15.5.28 | Includes `jsx-a11y` |
| | `@eslint/eslintrc` | 3.3.7 | `FlatCompat` bridge |
| | `prettier` · `prettier-plugin-tailwindcss` | 3.9.10 · 0.8.1 | Class sorting |
| Media tooling (dev) | `sharp` | 0.35.5 | Image conversion |
| | `ffmpeg-static` | 5.3.0 | Bundled ffmpeg 6.1.1 (no system install needed) |
| Testing (dev) | `@playwright/test` | 1.64.1 | E2E, screenshots, scraping |
| | `@axe-core/playwright` | 4.14.0 | Automated a11y checks |
| | `lighthouse` | 13.5.0 | CLI audits |
| | `serve` | 14.2.6 | Serve `/out` locally |

Package manager: **npm** (lockfile committed). `engines.node: ">=20.11"`.

---

## 2. Project configuration

**`next.config.ts`**
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,            // Apache-friendly: /index.html, /404.html
  images: { unoptimized: true },  // per brief; media is pre-optimised by the pipeline
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
```

**`tsconfig.json`**: `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, path alias `@/*` → `./*`.

**Static-export constraints respected:** no Route Handlers, Server Actions, middleware, ISR, `headers()`/`cookies()` or `next/image` optimisation. All interactivity is client-side.

**Environment variables** (`.env.example`):
```bash
# Google Apps Script web-app URL (leave empty to test: payload is logged and Success is shown)
NEXT_PUBLIC_FORM_ENDPOINT=
# Optional analytics: loaded only when set
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
# NEXT_PUBLIC_META_PIXEL_ID currently used on the live site: 2735375403482238
NEXT_PUBLIC_SITE_URL=https://skyproaviation.org
```
These are inlined at **build time**, so changing them requires a rebuild and re-upload.

---

## 3. Folder structure

```
app/
  layout.tsx            fonts, <html lang="en-IN">, metadata, JSON-LD, analytics, SmoothScroll, Header, Footer, Cursor, WhatsAppButton, Preloader
  page.tsx              composes the 15 sections in order (server component)
  globals.css           Tailwind v4 @import, @theme tokens, base styles, background utilities
  icon.png, apple-icon.png   from public/media/brand/site-icon-{512,180}.png
  sitemap.ts, robots.ts      export const dynamic = "force-static"
  not-found.tsx         simple branded 404 (→ out/404.html)
components/
  layout/   Header.tsx · NavDesktop.tsx · MobileMenu.tsx · Footer.tsx · SmoothScroll.tsx · Preloader.tsx · Cursor.tsx · WhatsAppButton.tsx · SkipLink.tsx
  sections/ HeroVideo · HeroIntro · Highlights · Courses · UpcomingBatch · WhyChoose · Faculty · Requirements
            Pathway · Testimonials · AcademyLife · Enquiry · Faq · Blogs · CounsellingCta
  forms/    EnquiryForm.tsx · enquirySchema.ts · submitEnquiry.ts · FormSuccess.tsx
  ui/       (shadcn) accordion · select · checkbox · radio-group · sheet · dialog · navigation-menu · tabs · carousel · label · button
            (custom) Button · SectionHeading · Eyebrow · RunwayLine · BoardingPass · Gauge · CourseCard · FacultyCard
            TestimonialPlayer · YouTubeFacade · DemoLecturesDialog · StatStrip · OutlinedWord · Media (Img/Video wrappers)
  backgrounds/ DottedGrid · FlightPaths · ChartLines · CompassRose · PhotoBand
  motion/   Reveal · SplitHeading · Counter · Parallax · MagneticButton · DrawLine · Tilt
data/       types.ts · site.ts · nav.ts · courses.ts · batches.ts · whyChoose.ts · faculty.ts · requirements.ts
            pathway.ts · testimonials.ts · faq.ts · blogs.ts · media.ts · highlights.ts · stats.ts · enquiry.ts (form options)
lib/        gsap.ts · lenis.ts (context + scrollToId) · motion.ts (shared easings) · utils.ts (cn) · analytics.ts · media-query.ts
public/
  media/    (Phase 0 output, see §8) · .htaccess · robots fallback
scripts/
  media/    manifest.json · download.(py→mjs) · convert-images.mjs · convert-videos.(sh→mjs)
  scrape/   capture.py · extract_text.py · extract_struct.py   (Phase 0, kept for reproducibility)
  qa/       grep-banned.mjs · check-links.mjs
tests/      e2e/*.spec.ts · playwright.config.ts
docs/       content-extract.md · PRD.md · TRD.md · reference/ (live screenshots, Stitch files)
```

`highlights.ts`, `stats.ts` and `enquiry.ts` are added to the brief's `data/` list so that every visible string lives in `data/`.

---

## 4. Component list

| Component | Kind | Responsibility |
|---|---|---|
| `app/page.tsx` | Server | Section order; passes data imports |
| `SmoothScroll` | Client | Creates Lenis, syncs with GSAP ticker/ScrollTrigger, provides `useLenis()` + `scrollToId()` |
| `Header` / `NavDesktop` / `MobileMenu` | Client | Header states, hide on scroll down, NavigationMenu dropdowns, Sheet menu |
| `Preloader` | Client (SSR markup) | CSS-driven overlay, removed after `load` or 1.2s, once per session |
| `Cursor` | Client | Amber dot via `gsap.quickTo`, mounted only with `(pointer: fine)` and no reduced motion |
| `WhatsAppButton` | Client | Appears after the hero (ScrollTrigger `onToggle`) |
| `HeroVideo` | Client | Source selection, mute toggle, pause off-screen, pinned scale-down |
| `HeroIntro` + `StatStrip` | Client | SplitText H1, counters, image clip reveal |
| `Highlights`, `Courses`, `WhyChoose`, `Requirements`, `Blogs`, `Faq` | Server shell + client motion children | Static markup rendered on the server; `Reveal`/`SplitHeading` add motion |
| `UpcomingBatch` + `BoardingPass` | Server + client hover | Data-driven rows, hidden when no batch is visible |
| `Faculty` + `FacultyCard` | Client | Pinned horizontal scroll (≥ 1024px) or Embla; bio Dialog/Sheet |
| `Gauge` | Client | SVG dial, needle, 4 concentric arcs, counter |
| `Pathway` | Client | SVG route, DrawSVG + MotionPath (pinned ≥ 1024px), vertical variant |
| `Testimonials` + `TestimonialPlayer` | Client | Tabs filter, featured `<video>`, thumbnail strip |
| `AcademyLife` | Client | Column parallax, clip-path reveals |
| `Enquiry` + `EnquiryForm` | Client | RHF + zod form, submit flow, success/error states |
| `CounsellingCta` + `OutlinedWord` | Client | "TAKE OFF" amber fill scrub |
| `DemoLecturesDialog` + `YouTubeFacade` | Client | Global dialog opened through context from any "Watch Demo" button |
| `Footer` | Server | Static columns, outlined wordmark |

`components/ui/Link.tsx` (`NoNavLink`) renders `<a href="#" onClick={preventDefault}>`. Every nav, footer, course and blog link uses it, so the "no redirects" rule is enforced in one place.

---

## 5. Data model (`data/types.ts`)

```ts
export type Href = "#";                                  // real routes can be swapped in later
export interface MediaImage { src: string; width: number; height: number; alt: string }   // alt "" = decorative
export interface MediaVideo { src: string; type: "video/mp4" | "video/webm"; width: number; height: number }

export interface NavItem { label: string; href: Href; children?: NavItem[] }
export interface Site {
  name: string; phoneDisplay: string; phoneE164: string; email: string;
  address: { line1: string; city: string; state: string; postalCode: string; country: "IN" };
  geo: { lat: number; lng: number };
  whatsappUrl: "https://wa.me/918955804726";
  socials: { label: "Instagram" | "YouTube"; url: string; href: Href }[];
  copyright: string; createdBy: string; website: string;
  seo: { title: string; description: string; canonical: string; ogImage: string };
}
export interface Stat { value: number | null; display: string; suffix?: string; label: string; source: string }  // value null = text reveal ("4 Decades+")
export interface Highlight { id: string; title: string; text: string; icon: LucideIconName }
export interface Course {
  id: string; title: string; subheading: string; description: string;
  image: MediaImage; featured?: boolean;
  links: { label: "Read More"; href: Href }[];              // + optional { label: "Watch Demo Lectures"; demoId } (OQ-5)
}
export interface Batch {
  id: string; number: number; program: string; classType: string;
  startDateISO: string; startDateLabel: string; startTimeLabel: string;
  demoVideoId?: string; visible: boolean;
}
export interface WhyPoint { id: string; title: string; text: string }
export interface FacultyMember {
  id: string; name: string; role: string;                   // role = verbatim bio fragment
  bio: string[]; aircraft: string[]; image: MediaImage; demoVideoId?: string;
}
export interface Requirement {
  id: string; number: number; title: string; text: string; icon: LucideIconName;
  highlight?: boolean;
  subjects?: string[];                                       // Ground School
  hours?: { code: "PIC" | "XC" | "IF" | "NIGHT"; hours: number; text: string }[];   // Flying Hours
  flightChecks?: string[];
}
export interface PathwayStep { step: number; title: string; text: string }
export type TestimonialCourse = "License Conversion & Recency" | "DGCA Ground Classes";
export interface Testimonial { id: string; name: string; course: TestimonialCourse; poster: MediaImage; video: MediaVideo; durationSec: number }
export interface Faq { id: string; question: string; answer: string }
export interface Blog { id: string; title: string; excerpt: string; image: MediaImage; href: Href }
export interface DemoLecture { id: string; facultyId: string; youtubeId: string; title: string }
```

All copy in `data/*.ts` is pasted from `content-extract.md`. A unit check (`scripts/qa/check-content.mjs`) compares every string in `data/` against the extract and fails on mismatches not on an allow-list of approved OQ edits.

---

## 6. Media pipeline

### 6.1 What Phase 0 produced (`public/media/`, 73 MB)

```
brand/        logo-skypro.webp · logo-skypro-white.webp · site-icon.webp · site-icon-{512,180,32}.png · heading-swoosh.svg
video/        hero-video-1080.mp4 (7.2 MB) · hero-video-720.mp4 (4.5) · hero-video-1080.webm (7.4)
              hero-video-mobile-720.mp4 (4.7) · hero-video-mobile-720.webm (5.4) · hero-poster.webp · hero-poster-mobile.webp
video/testimonials/  15 × <slug>.mp4 (540×960, 1.2–5.0 MB, 41 MB total)
testimonials/ 15 × <slug>.webp posters
life/         life-01 … life-19.webp
blogs/        cpl-training-argentina-guide · cpl-argentina-vs-south-africa · become-pilot-after-12th
icons/        req-*.webp (6, kept but replaced by lucide in the UI)
*.webp        about, courses (6), why-*, faculty (5), requirements, pathway, faq, backgrounds
```

### 6.2 Pipeline steps (re-runnable, `npm run media`)
1. **Manifest:** `scripts/media/manifest.json` is the single list of source URL → clean name → section. Alt text lives in `data/*.ts`, not in the manifest.
2. **Download:** fetch originals with `Accept: */*`, so the server returns the original PNG/JPG and not its on-the-fly WebP, into a git-ignored `.media-cache/`.
3. **Images:** sharp, `rotate()`, then `resize({ width: 1920, withoutEnlargement: true })`, then WebP (photos q80 / `smartSubsample`; graphics and alpha q90 / alphaQuality 100). Phase 2 adds **640w variants** (`name-640.webp`) for gallery, blog and course images (see §6.4).
4. **Derived assets:** white logo (navy pixels → white, amber kept), favicon PNGs, **OG image** 1200×630 (Phase 2), and **video-frame posters** at 540×960 for the 4 low-res testimonial posters (Phase 2).
5. **Video:** ffmpeg-static, H.264 High `-preset slow` `+faststart`, AAC 96k (the hero has meaningful speech + music, so audio is kept). Desktop hero: CRF 26 / ≤ 1 Mbps (1080) and ≤ 650 kbps (720). VP9 WebM ~780 kbps + Opus. Mobile reel: anamorphic 1080×1080 SAR 9:16 → square-pixel 720×1280. Testimonials: centre-crop `608:1080:656:0` from the pillarboxed 1920×1080, then 540×960, CRF 28.
6. **Naming:** kebab-case, `section-subject[-variant].ext` (e.g. `faculty-arvind-thapliyal.webp`, `hero-video-mobile-720.mp4`).

### 6.3 `next/image` usage
- `images.unoptimized: true` → `next/image` renders a plain `<img>` with the given `src`, `width` and `height`, so aspect ratio is reserved and CLS stays at 0. It adds `loading="lazy"` unless `priority`.
- `priority` only on the HeroIntro image (it can enter the first viewport during the pinned transition). The hero poster is a `<video poster>` attribute, so it is preloaded with `<link rel="preload" as="image" media="…">` per breakpoint instead.
- Wrapper `components/ui/Media.tsx` → `<Img image={MediaImage} sizes? />` always passes width, height and alt from `data/` (so alt can't be forgotten; enforced by the TS type).
- Decorative backgrounds (`pathway-bg`, `bg-counselling-aircraft`) use `<Img alt="">` with `object-cover` in an absolutely positioned layer. CSS `background-image` is not used for them, so they lazy-load and appear in the preload scanner.

### 6.4 ⚠️ Technical decision for approval: responsive `srcset`
With `unoptimized: true`, `next/image` emits **no `srcset`**, so phones download 1200–1920px images for 340px slots. Lighthouse may flag "Properly size images".
- **Option A (brief as written):** keep `unoptimized: true`. The `Img` wrapper renders a manual `srcSet` for assets that have a `-640` variant. **Default.**
- **Option B:** `images: { loader: "custom", loaderFile: "./lib/image-loader.ts" }` mapping widths to pre-generated variants. This is cleaner but deviates from the brief's `unoptimized: true`.

### 6.5 Replacing the hero video (README will repeat this)
1. Put the new master file in `.media-cache/`.
2. Run `npm run media:video -- --hero path/to/file.mp4`, which writes all 5 renditions and both posters.
3. Bump `HERO_VERSION` in `data/media.ts` (appended as `?v=` to bust the `/media` cache).
4. Rebuild and re-upload.

---

## 7. Animation architecture

### 7.1 `lib/gsap.ts` (client-only)
```ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}
export const BP = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tablet:  "(min-width: 768px) and (max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  mobile:  "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  reduce:  "(prefers-reduced-motion: reduce)",
} as const;
export { gsap, ScrollTrigger, SplitText, useGSAP };
```

### 7.2 Lenis ↔ ScrollTrigger (`components/layout/SmoothScroll.tsx`)
```ts
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false });
lenis.on("scroll", ScrollTrigger.update);
const tick = (t: number) => lenis.raf(t * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);
// cleanup: gsap.ticker.remove(tick); lenis.destroy();
```
- **Not created** when `prefers-reduced-motion: reduce`; `scrollToId()` then falls back to `element.scrollIntoView({ behavior: "auto" })`.
- `scrollToId("enquiry")` → `lenis.scrollTo(el, { offset: -headerHeight, duration: 1.2, onComplete: focusFirstField })`.
- `lenis.stop()` / `lenis.start()` while the Sheet, Dialog or Select is open. Modal content gets `data-lenis-prevent`.
- `ScrollTrigger.refresh()` after `document.fonts.ready`, after the preloader exits, and after images with known dimensions load (dimensions are reserved, so refreshes are cheap).

### 7.3 Writing animations
- Every animated component uses `useGSAP(() => { … }, { scope: ref })`. Tweens, ScrollTriggers and SplitText instances created inside are reverted automatically on unmount (React 19 Strict Mode double-mount safe).
- Breakpoint and motion logic goes through `gsap.matchMedia()` with the `BP` conditions. Each branch returns its own cleanup, and resizing across a breakpoint reverts and re-creates cleanly.
- **No-JS / pre-hydration visibility:** content is visible by default. A blocking inline script adds `html.js` + `html.motion-ok` (when there is no reduced motion). Initial hidden states are applied in JS (`gsap.set`) inside `useGSAP`, never in CSS, so nothing stays hidden if JS fails.
- **Only `transform`, `opacity` and `clip-path`** are animated, using `will-change` sparingly (set on start, cleared on complete).
- **SplitText:** `SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, onSplit: self => gsap.from(self.lines, { yPercent: 105, stagger: 0.08 }) })`. `autoSplit` re-splits after font load and resize. `aria` handling is built in (SplitText 3.13+ keeps an `aria-label` on the parent).
- **Pins** (desktop only): hero → intro (`pin: heroRef, pinSpacing: false`; HeroIntro has `position: relative; z-index: 2` and scrolls over), faculty (`pin: true`, `end: () => "+=" + track.scrollWidth - innerWidth`, `invalidateOnRefresh`), pathway (`end: "+=150%"`). Pins are created in DOM order so later triggers calculate start positions correctly (`refreshPriority` where needed).
- **Pathway:** `gsap.timeline({ scrollTrigger: { scrub: 0.6, pin } })` → `drawSVG: "0% 0%" → "0% 100%"` on the dashed route (a solid mask path reveals the dashed visible path, so dash styling survives DrawSVG) + `motionPath: { path, align: path, autoRotate: true, alignOrigin: [0.5, 0.5] }` on the plane. Step activation uses the timeline's `onUpdate` progress compared to each step's pre-computed path progress (`MotionPathPlugin.getRelativePosition` / sampled lengths).
- **Gauge:** a single timeline (needle `rotation` −90° → 90°, counter via `gsap.to(obj, { val: 200, onUpdate })`, arcs with `drawSVG` to `hours/200`). It plays once (`once: true`).
- **Counters** (`motion/Counter.tsx`): `textContent` tween with `snap: 1`. Final values are rendered on the server, so they are correct for no-JS, reduced motion and crawlers.
- **Compass, chart lines, outlined words:** `scrub: true` transforms, desktop and tablet only.
- **Cursor and magnetic:** `gsap.quickTo(x/y, { duration: 0.35, ease: "power3" })`. Listeners are added only under `(pointer: fine)`.
- **Motion (`motion/react`):** buttons (whileHover/whileTap scale 0.98), Sheet/Dialog content, Accordion height (`AnimatePresence` + `height: "auto"`), testimonial tab `layout` transitions, form state swaps. `MotionConfig reducedMotion="user"` wraps the app.
- **Video work:** the hero `<video>` is paused by IntersectionObserver when < 10% visible. Testimonial players pause each other through a small store.

### 7.4 Reduced-motion and mobile fallbacks

| Feature | ≥ 1024 | 768–1023 | < 768 | Reduced motion |
|---|---|---|---|---|
| Lenis | ✓ | ✓ (wheel only) | native | ✗ |
| Pins (hero, faculty, pathway) | ✓ | ✗ | ✗ | ✗ |
| Faculty | horizontal pin | Embla | Embla | Embla, no autoplay |
| Pathway | horizontal route, pinned | vertical, scrubbed draw | vertical, scrubbed draw | static route, all steps lit |
| Parallax / compass rotation | ✓ | light | ✗ | ✗ |
| SplitText reveals | ✓ | ✓ | fade only | ✗ (instant) |
| Card reveals | y 40 | y 32 | y 16 | ✗ |
| Tilt, cursor, magnetic | ✓ | ✗ | ✗ | ✗ |
| Preloader | ✓ | ✓ | ✓ | ✗ |
| Gauge / counters | animated | animated | animated | final values |

### 7.5 Performance guardrails for motion
- One GSAP ticker drives Lenis and everything else; there are no extra `requestAnimationFrame` loops.
- Background SVG textures are static inline symbols, and only their wrapper is transformed.
- No `filter`/`box-shadow` animation. Hover shadows switch with an opacity crossfade on a pseudo-element.
- Phase 4 checks each section in a Chrome Performance trace (≥ 55 fps on a 4× CPU throttle at 1440, no long tasks over 50ms from animation code).

---

## 8. Video handling

| Video | Element setup | Loading |
|---|---|---|
| Hero desktop | `<video muted autoplay loop playsInline poster>` + `<source webm>` + `<source mp4>`. 1080 at ≥ 1280px, 720 at 768–1279px | Sources injected in `useLayoutEffect` from `matchMedia`, so only one rendition is fetched. `preload="auto"` |
| Hero mobile | Same, with the 9:16 reel `hero-video-mobile-720.{webm,mp4}` | Same |
| Testimonials | `<video controls playsInline preload="none" poster>` | `src` set on first play, 540×960 mp4 |
| Demo lectures | `YouTubeFacade`: local-styled button with `i.ytimg.com/vi/{id}/hqdefault.jpg` → on click, iframe `youtube-nocookie.com/embed/{id}?autoplay=1` | Nothing loads until the click |

The sound toggle unmutes the hero (a user gesture, so it is allowed by autoplay policies). The video and its audio pause when the hero leaves the viewport and resume when it returns.

---

## 9. Form submission flow

```
EnquiryForm (RHF, zodResolver(enquirySchema), mode: "onTouched")
  └─ onSubmit(values)
       ├─ honeypot filled? → setState("success"); return            (bots get a fake success)
       ├─ setState("sending")                                         (button disabled, fields read-only)
       ├─ payload = toFormEncoded({ ...normalise(values), source: "homepage", submittedAt, pageUrl })
       ├─ endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT
       │    └─ empty → console.info("[enquiry]", payload); await delay(800); success
       ├─ await fetch(endpoint, { method: "POST", mode: "no-cors",
       │       headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
       │       body: payload, keepalive: true })                     (opaque response: a resolved fetch = success)
       ├─ success → track("generate_lead"/"Lead"); setState("success"); reset()
       └─ catch (network/abort, 15 s timeout) → setState("error") (values kept, Try again)
```

- **Why `no-cors` + form-encoding:** Apps Script web apps don't answer CORS preflights. A "simple" form-encoded POST needs no preflight, and Apps Script reads it from `e.parameter`. The cost is that the response is opaque, so server-side validation errors cannot be shown. Validation is fully client-side, and Apps Script should still sanity-check its input.
- **Normalisation:** mobile → `"+<code> <national number>"`, e.g. `"+91 9829012345"`; `interest` → `"DGCA Ground Classes (CPL), Flying Training"`; `consent` → `"yes"`; strings trimmed.
- **Apps Script contract** (sample `doPost(e)` provided in README): append a row `[submittedAt, name, mobile, email, qualification, state, city, interest, start, question, consent, source, pageUrl]` to a Sheet and optionally `MailApp.sendEmail` to info@skyproaviation.org. Deploy as *Web app → Execute as: Me → Who has access: Anyone*.
- **Spam:** honeypot + a minimum fill time of 3s (`startedAt` ref). reCAPTCHA is not used (the live site has it; adding it would need a key and a backend check, so it is out of scope).

---

## 10. Analytics (optional)

`components/layout/Analytics.tsx` (client), rendered in `layout.tsx` only when IDs exist:
- GA4: `next/script` `afterInteractive` gtag snippet. Events: `generate_lead`, `cta_enquire_click` (with `location`), `whatsapp_click`, `video_play` (testimonial name), `demo_open`.
- Meta Pixel: the standard snippet with `PageView`, `Lead` on submit and `Contact` on WhatsApp.
- `lib/analytics.ts` exposes `track(event, params)`, which does nothing when neither tool is loaded.

---

## 11. SEO implementation

- `app/layout.tsx` `export const metadata: Metadata` → title, description, `metadataBase: new URL(NEXT_PUBLIC_SITE_URL)`, `alternates.canonical: "/"`, `openGraph` (type website, locale `en_IN`, siteName, image `/media/og-image.jpg` 1200×630), `twitter: summary_large_image`, `robots: { index: true, follow: true }`, `icons`.
- `export const viewport` → `themeColor: "#001F3F"`, `width: device-width`, `initialScale: 1`.
- `components/seo/JsonLd.tsx` (server) renders `<script type="application/ld+json">` for `EducationalOrganization` + `FAQPage`, built from `data/site.ts` and `data/faq.ts` (a single source, so visible FAQ = schema FAQ).
- `app/sitemap.ts` + `app/robots.ts` with `dynamic = "force-static"` → `out/sitemap.xml`, `out/robots.txt`.

---

## 12. Build and deploy

### 12.1 Scripts (`package.json`)
```
dev            next dev --turbopack
build          next build                      → /out (static)
start:static   serve out -l 4173
lint           eslint . && tsc --noEmit         (`next lint` is deprecated in 15.5)
format         prettier --write .
media          node scripts/media/run.mjs       (download → convert images → convert video)
test:e2e       playwright test
test:lh        lighthouse http://localhost:4173 --preset=perf --form-factor=mobile … (see §14)
qa             npm run lint && npm run build && node scripts/qa/grep-banned.mjs && npm run test:e2e
```

### 12.2 `public/.htaccess` (copied to `out/.htaccess`)
```apache
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

# Force HTTPS + non-www on the serving host (works on staging too; canonical URL is in <link rel=canonical>)
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# MIME types
AddType video/mp4 .mp4
AddType video/webm .webm
AddType image/webp .webp
AddType font/woff2 .woff2
AddType application/manifest+json .webmanifest

# Compression (Brotli where available, else gzip)
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain application/javascript application/json image/svg+xml application/xml
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain application/javascript application/json image/svg+xml application/xml
</IfModule>

# Caching (FilesMatch rather than <If>, for LiteSpeed compatibility)
<IfModule mod_headers.c>
  <FilesMatch "\.(html|xml|txt)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  # JS/CSS/fonts only exist under /_next/static and are content-hashed
  <FilesMatch "\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # /media files are not hashed
  <FilesMatch "\.(webp|png|jpg|svg|ico|mp4|webm)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```
`/media` gets 30 days (not 1 year) because media filenames are not content-hashed. Replacing a file without renaming it would otherwise stay stale for a year. Versioned query strings (§6.5) handle hot swaps. Hostinger runs LiteSpeed, which honours these directives and also serves Brotli natively. Video range requests work out of the box.

### 12.3 Hostinger upload
1. Run `npm run build` and check that `out/index.html`, `out/404.html`, `out/.htaccess` and `out/media/**` exist. Dotfiles in `public/` are copied by Next; this is verified in Phase 2.
2. In hPanel → File Manager → `public_html/`, back up and remove the WordPress files only after the client approves the cutover (or deploy first to a subdomain such as `new.skyproaviation.org`).
3. Upload the **contents** of `out/` (zip, upload, extract) so that `public_html/index.html` sits at the root.
4. Purge the LiteSpeed/CDN cache, then smoke-test HTTPS, the form, the video and the 404 page.
5. Rollback: keep the WordPress backup zip. Restore = extract it back.

---

## 13. Performance budget

| Item | Budget | How |
|---|---|---|
| JS initial (gzip) | ≤ 190 KB | Server components for static markup. GSAP plugins only in `lib/gsap.ts` (no dynamic imports needed, they are about 60 KB gz total). Motion only for micro-interactions (`LazyMotion` + `domAnimation`) |
| CSS (gzip) | ≤ 30 KB | Tailwind v4 tree-shaken output |
| Fonts | ≤ 6 files, ≤ 120 KB | `next/font/google`, Latin subset, `display: swap`. `adjustFontFallback` avoids CLS |
| HTML | ≤ 60 KB gzip | |
| LCP | ≤ 2.5 s (Moto G Power, 4G) | Poster ≤ 30 KB, preloaded via `<link rel=preload as=image media=…>` per breakpoint |
| CLS | < 0.05 | Explicit dimensions on all media; fonts with fallback metrics; no late-injected banners |
| TBT | < 200 ms | No heavy work on hydrate. SplitText runs after `fonts.ready` and idle |
| Bytes before first interaction (excluding hero video) | ≤ 600 KB | Lazy-load everything below the hero |
| Hero video | 4.5–7.4 MB, starts after the poster | One rendition per device |

---

## 14. Testing checklist

**Automated (Playwright, `tests/e2e`)**
- `no-redirect.spec.ts`: click every `header a`, `footer a`, course/blog "Read More" and dropdown item. Assert `page.url()` is unchanged, no `popup` event, and `scrollY` is unchanged (except Enquire CTAs).
- `enquire-scroll.spec.ts`: each Enquire/Enroll CTA → `#enquiry` in view, and focus is on the Full Name field.
- `whatsapp.spec.ts`: the button is hidden on the hero and visible after it. `href === "https://wa.me/918955804726"`, `target=_blank`, `rel` includes `noopener`.
- `form.spec.ts`: required errors, invalid mobile (`12345`, `5123456789`), valid `+91 98290 12345` → `+91 9829012345`; another country (UK `07911 123456` → `+44 7911123456`); interest ≥ 1; consent required; honeypot → no `console.info`; empty endpoint → Success + payload logged.
- `screenshots.spec.ts`: full-page at **1440 / 1280 / 768 / 375**, with motion disabled (`reducedMotion: "reduce"`) for deterministic captures, plus a motion-on 1440 run for review.
- `a11y.spec.ts`: axe-core with zero serious/critical violations. Keyboard pass through nav dropdowns, Sheet, Accordion, Select, tabs and dialogs.
- `overflow.spec.ts`: `document.documentElement.scrollWidth <= innerWidth` at 320, 375, 768, 1280 and 1440.
- `reduced-motion.spec.ts`: no element with `opacity: 0` in `main` after load. No pin-spacer elements.

**Content QA (`scripts/qa`)**
- `grep-banned.mjs`: fails if `out/**` contains `8800604726`, `Plot 14`, `450+`, `100%`, `6+ bases`, `3,500`, `USA base`, `ICAO`, `Aviation Medical`, `G1000`, `Garmin`, or the placeholder names `Priya Sharma`, `Riya Kapoor`, `Aditya Verma`, `Neha Singh`.
- `check-content.mjs`: every string in `data/` exists in `content-extract.md` (or the approved-edits list).
- Contact check: the phone appears only as `+91-8955804726` / `+918955804726`, and the address string matches exactly.

**Lighthouse** (`lighthouse` CLI 13.5 against `serve out`): mobile preset, 3 runs, median reported. Targets: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100, CLS < 0.05. Run after each Phase 4 section.

**Manual**
- Real devices: iPhone (Safari, Low Power Mode → poster fallback), Android Chrome mid-range. Hero autoplay, sound toggle, pinned sections at 1280 and 1440, trackpad and mouse-wheel smoothness, Windows high-contrast focus visibility.
- Network throttled (Fast 4G): poster first, no layout jump when the video starts.

---

## 15. Technical decisions needing approval

| # | Decision | Why | Default |
|---|---|---|---|
| TD-1 | **Header dropdowns use Radix `NavigationMenu`** (shadcn `navigation-menu`) instead of `DropdownMenu` | `DropdownMenu` is an *application menu* (`role="menu"`, focus-trapped, no hover-open). Site navigation should follow the disclosure pattern with hover + keyboard, which NavigationMenu provides. `DropdownMenu` is not needed elsewhere | NavigationMenu |
| TD-2 | **Responsive images** with `unoptimized: true` | No automatic `srcset` (§6.4) | Option A: manual `srcSet` for 640w variants |
| TD-3 | **Self-hosted testimonial videos** (41 MB in `/media`) instead of YouTube | The live site has no YouTube IDs for testimonials (PRD OQ-1) | Self-host |
| TD-4 | **Zod 4** (not 3) | Current major; resolvers 5.x support it | Zod 4.6.7 |
| TD-5 | **TypeScript 5.9.3** (not 7.0) | Next 15 compatibility | 5.9.3 |
| TD-6 | **Custom YouTube facade** instead of `lite-youtube-embed` | Avoids a web component + CSS import; about 40 lines with the same behaviour | Custom |
| TD-7 | **Media cache = 30 days** (not 1 year) | Filenames are not hashed (§12.2) | 30 days + `?v=` busting |

---

## 16. Phase plan (after "approved")

| Phase | Deliverable | Exit check |
|---|---|---|
| 2 | `create-next-app` 15.5.28 (TS, App Router, ESLint), Tailwind v4 tokens, fonts, shadcn init + components, `lib/gsap.ts`, `SmoothScroll`, Header (non-redirecting NavigationMenu + Sheet), Footer, `.htaccess`, `.env.example`, media scripts ported to Node, OG image | `npm run build` produces `/out`; nav no-redirect test passes |
| 3 | All 15 sections, static, with real `data/*.ts` content, no animation | Screenshots at 1440 + 375 sent for review; content check passes |
| 4 | Animations section by section (preloader → hero → … → footer), with a Lighthouse run after each | ≥ 55 fps trace; Lighthouse within budget after each section |
| 5 | QA: Playwright screenshots 1440/1280/768/375, Lighthouse, no-redirect, content diff, banned-string grep, a11y | Report with scores and screenshots |


---

## 17. Phase 4 implementation notes (as built)

These notes record where the build differs from §7/§13 above, and why. Everything below was measured on the static build with Playwright and Lighthouse 13.5 on this machine.

### 17.1 Architecture
- **Lazy motion runtime.** GSAP, ScrollTrigger, `@gsap/react`, Lenis and every scroll animation live in `components/motion/runtime/*`. It is a separate chunk that `MotionLayer` loads after `load` + idle, and **never for `prefers-reduced-motion`**. Inside the runtime, all animation is created in `useGSAP` + `gsap.matchMedia` and reverted on unmount or breakpoint change. Sections are plain markup with `data-*` hooks (`data-reveal`, `data-split`, `data-counter`, `data-gauge`, `data-route`, `data-takeoff-fill`…).
- **Per-section setup.** Each section's animations are created only when it comes within ~60% of a viewport (IntersectionObserver). SplitText, DrawSVG and MotionPath are loaded on demand. **SplitText is never loaded on phones**, where headings fade instead.
- **Intro.** The header slide-down and hero pill rise are **CSS keyframes** timed to the preloader (no JS at startup).
- **Lenis** runs only for fine pointers (desktop/trackpad). On touch devices it would only add a per-frame loop, because it does not smooth touch.
- **Faculty pin.** The runtime pins the section and tells `Faculty` via the `skypro:faculty-pin` event to switch Embla off. If the runtime never loads, it stays a normal swipe carousel.
- **Pathway.** The route draws and the plane flies with a **scrub, not a pin**. A pin would hide the lower step cards on laptop-height screens (the section is ~1,230px tall).
- **Hero transition.** It animates `scale` only, on a pre-rounded media layer that is 48px larger than the viewport, instead of animating `clip-path` (which repaints every frame).
- **Moving layers:** since the redesign pass (§18) only the Academy Life columns drift; they get `will-change: transform`. Chart textures stay static, because promoting full-section layers costs too much memory.
- **Decorative SVG:** the chart-line texture is a static file in `public/media/decor/`, rendered as `<img>` (no hydration cost). The compass rose and flight-path textures were retired in §18.
- **`content-visibility: auto`** on below-the-fold sections (not the pinned Faculty). Measured placeholder heights per breakpoint are in `lib/sectionSizes.ts` (re-measure with `scripts/qa/section-heights.mjs`). A ResizeObserver refreshes ScrollTrigger when a section first renders. That refresh waits until the scroll has come to rest, because `ScrollTrigger.refresh()` writes the scroll position, which would cut short a touch fling or a CTA jump. In-page jumps render every deferred section for the trip (`html.cv-render`). When the scroll ends (`scrollend`, or 6 still frames as a fallback), they pin each section's real height as its placeholder, then run up to three correction passes. Phase 5 regression check: `npm run qa:jump`.
- **Hero video** shows the poster (the video's own opening logo frame) first. It starts on the first scroll/touch/pointer interaction or ~3.5s after `load`. It never starts on Save-Data or 2G connections.
- **Lazy enquiry form.** react-hook-form, zod and the Radix Select/Checkbox/Radio parts load only when the form nears the viewport or an Enquire CTA is clicked. A same-footprint skeleton is rendered meanwhile.
- **Preloader caption.** The preloader shows the live eyebrow "Welcome to SkyPro Aviation" in a system mono font. Chrome ignores full-viewport images (the hero poster) as LCP candidates, so this text becomes the LCP and paints with FCP.
- **TD-1 confirmed:** header dropdowns use Radix `NavigationMenu`.

### 17.2 Measured results
| Metric | Before Phase 4 tuning | Now |
|---|---|---|
| First-load JS (Next build report) | 232 KB | **183 KB** (budget 190) |
| Desktop scroll, 4× CPU throttle (software rendering) | 26.5 fps with animations | **44–45 fps** (no-animation baseline: 44.8) |
| Mobile scroll, 4× CPU throttle | 42.9 fps | **55.9 fps** (baseline 54.1) |
| Startup blocking time, 4× throttle (Playwright proxy) | ~700–850 ms | ~350–570 ms (noisy machine) |
| Lighthouse mobile (local) | Perf 55 · A11y 97 · BP 96 · SEO 100 | Perf **70–85, median 83** (5 runs, Phase 5 final build) · A11y **100** · BP **100** · SEO **100** · CLS **0** |
| Lighthouse desktop (local) | — | Perf **98** (3 runs) · A11y/BP/SEO **100** · LCP 0.9s · TBT 0ms · CLS 0 |

**Caveat on local Lighthouse.** On this machine, Lighthouse's own trace presents the first frame anywhere from 0.4s to 2.7s for the *same static HTML*: the main thread is idle, and the delay is in headless compositing under background load. Lantern's simulated LCP inherits that delay. The authoritative score should come from **PageSpeed Insights against the deployed staging URL**, which is part of Phase 5.

## 18. Redesign pass (17 Oct 2026): less template, more editorial

This section supersedes earlier notes where they conflict. No text, data file or section order changed.

- **Type.** Barlow Condensed 600/700 for headings, nav and buttons; Barlow 400/500 for body; B612 Mono 400/700 for labels, numbers, dates and step numbers (uppercase, 0.1em). The scale is H1 72/44, H2 52/34, H3 26/22 (desktop/mobile), body 17/16. Headings use line-height 1.0 and -0.01em tracking; body line-height is 1.65. `@source not "../docs"` keeps Tailwind from generating classes out of the Stitch mock-up (it had pulled in an unused `Outfit` font class).
- **Icons.** Phosphor only, imported per icon. Server components use `@phosphor-icons/react/dist/ssr/<Icon>`. First-load client components (header, mobile menu, hero player, WhatsApp, demo dialog, faculty carousel, testimonials) receive their icons as props from a server parent (`components/layout/layoutIcons.tsx` or a section's server wrapper), so Phosphor's multi-weight path data never ships in first-load JS. Only the lazy form chunk imports from `dist/csr/*`. The hand-drawn icon file was removed; the only inline SVG left is the two illustrations (pathway route, 200-hour gauge).
- **Shape.** Radius is at most 6px on images/cards and 4px on inputs and buttons. Fully round shapes are limited to the hero Enquire pill, the round video buttons, the testimonial filter pills, the batch "Online/Offline" tag, radio controls, pathway waypoints and the boarding-pass punch holes. There are no resting shadows, only a subtle shadow on hover. Hairlines (`rgb(0 51 102 / .12)`) replace boxes.
- **Eyebrows.** A mono section label ("02 — Courses") appears in four sections only: Hero intro, Courses, Pathway and Enquiry. The other eyebrow strings stay in `data/sections.ts`; `check-content.mjs` lists the one that no longer renders anywhere ("Why SkyPro") under "intentionally not shown".
- **Rhythm.** Backgrounds run navy → white → ivory → mist → navy (Why Choose) → white (Faculty) → ivory → navy (Pathway) → white → navy (Life) → white → ivory → white → photo band → navy. Why Choose sits on navy so its large amber mono numbers pass contrast (amber on white is 1.86:1). Section padding varies (64/96/128px).
- **Motion kept.** Lenis, the hero scale-down, SplitText line reveals on H1/H2 only (1.0s expo.out, 0.06s stagger), stat counters (1.0s), the pathway route draw and MotionPath plane, the gauge sweep (1.0s), the Academy Life column drift, `clip-path` reveals on large photos (`data-clip-reveal`; a fade on phones), one 300ms fade per content block (`data-block`), the boarding-pass stub tear on hover (CSS), and the faculty pin (desktop).
- **Motion removed.** The custom cursor, magnetic buttons, 3D tilt, compass rotation, per-item fade-ups, Why Choose count-ins, the boarding-pass slide-in, the outlined "TAKE OFF" and "SkyPro" words, and the eyebrow runway draw.
- **Courses hover preview** is CSS only: `.course-list:has(.course-row:nth-child(n):is(:hover, :focus-within)) .course-preview:nth-child(n)`.
- **Results.**
  - First-load JS: 162 KB (was 183).
  - E2E: 54 passed, 4 skipped by design.
  - axe: 0 colour-contrast violations at 1440 and 412 (`scripts/qa/contrast.mjs`).
  - Lighthouse desktop: 98–99, with A11y/BP/SEO at 100.
  - Lighthouse mobile: 74–86 over 8 runs (median ≈ 81.5; three runs ≥ 85), with A11y/BP/SEO at 100 and CLS 0.001. The same local-noise caveat as §17.2 applies.

