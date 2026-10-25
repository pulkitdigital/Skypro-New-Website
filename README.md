# SkyPro Aviation — Homepage (Next.js 15 static site)

Frontend-only rebuild of the SkyPro Aviation homepage. It is built with Next.js 15 (App Router) as a static export that you upload to Hostinger. There is no backend, CMS or database. All content lives in `data/*.ts`.

- Product and technical specs: [`docs/PRD.md`](docs/PRD.md), [`docs/TRD.md`](docs/TRD.md)
- Verbatim live-site content and media manifest: [`docs/content-extract.md`](docs/content-extract.md)

## Requirements

- Node.js 20.11 or newer (developed on Node 24), npm 10 or newer

## Install and run

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
```

This writes the static site to `/out`. To preview the exact files you will upload:

```bash
npm run start:static
```

Then open http://localhost:4173.

Other scripts:

| Script | What it does |
|---|---|
| `npm run lint` | ESLint + TypeScript check |
| `npm run test:e2e` | Playwright suite (desktop 1440 + Pixel 7): no-redirect links, CTAs, form, dialogs, axe, overflow, reduced motion, no-JS. Serves `out/` on :4173 itself if nothing is running there |
| `npm run qa:grep` | Fails if the build contains banned/invented strings (wrong phone, Stitch placeholders…) |
| `npm run qa:content` | Fails unless every string in `data/*.ts` is verbatim from `docs/content-extract.md` (or on its approved list) and present in the build |
| `npm run qa:jump -- "<CTA selector>"` | Mobile CTA jump check: lands on the form at the header offset, focuses Full Name, no ScrollTrigger refresh mid-scroll |
| `npm run screenshots` | Full-page screenshots of `localhost:4173` at 1440/1280/768/375 → `screenshots/` (needs `npx playwright install chromium`, or set `PW_CHROMIUM` to an existing Chromium) |
| `node scripts/qa/section-shots.mjs <name> <url> <selector…>` | Screenshots of chosen sections at 1440 + 375, stacked → `screenshots/redesign/` |
| `node scripts/qa/contrast.mjs` | axe colour-contrast check at 1440 and 412 (prints each failing node with its ratio) |
| `node scripts/qa/smoke.mjs` | Smoke test: nav links don't navigate, Enquire scrolls to the form, form validation and success |
| `node scripts/qa/motion-check.mjs [width] [outDir] [reduce]` | Motion runtime check: console errors, preloader, pins, nothing left hidden + mid-animation snapshots |
| `node scripts/qa/perf.mjs [width] [cpuThrottle]` | Scroll frame-rate probe (per section) under CPU throttling |
| `node scripts/qa/startup.mjs` · `trace.mjs` · `profile.mjs` | Startup blocking time, main-thread trace breakdown, CPU profile |
| `node scripts/qa/section-heights.mjs` | Re-measure section heights for `lib/sectionSizes.ts` after big content changes |
| `node scripts/qa/latency-server.mjs` | Static server with artificial latency (more realistic local Lighthouse runs) |

> **Building while `npm run dev` is running** is fine: the dev server writes to `.next-dev/` (see `next.config.ts`), while `npm run build` uses `.next/` and exports to `out/`.

## How the motion works (short version)

- Sections are plain markup with `data-*` hooks (`data-reveal`, `data-split`, `data-counter`, `data-hours-bar`, …).
- `components/motion/runtime/` (GSAP, ScrollTrigger, Lenis) is a separate chunk. It loads after the page has loaded, never for visitors with *reduced motion*, and animates each section only as it approaches the viewport.
- The preloader and the header/hero intro are pure CSS.
- To add an animation to new markup, give the element one of the existing `data-*` attributes, or add a rule in `components/motion/runtime/sections.ts`.

## Editing content

Every visible string is in `data/`. Edit the file, save, and the dev server updates.

| File | Content |
|---|---|
| `data/site.ts` | Phone, email, address, WhatsApp, social URLs, SEO title/description, footer credits |
| `data/nav.ts` | Header menu, footer Quick Links and Our Courses (all `href: "#"`; swap in real routes later) |
| `data/sections.ts` | Section eyebrows/headings, About paragraphs, Why Choose intro, Counselling CTA copy |
| `data/stats.ts` | Hero stat strip |
| `data/highlights.ts` | 4 highlights |
| `data/courses.ts` | 6 course cards (`featured: true` = the wide first card) |
| `data/batches.ts` | Upcoming batches. Set `visible: false` on every batch to hide the section |
| `data/whyChoose.ts` | 6 numbered points + sticky image |
| `data/faculty.ts` | Faculty cards, bios, tags, YouTube demo IDs |
| `data/requirements.ts` | DGCA requirement cards + flying-hours breakdown |
| `data/pathway.ts` | 6 pathway steps |
| `data/testimonials.ts` | Testimonial videos (name, course, duration) |
| `data/faq.ts` | FAQ questions/answers (also used for the FAQPage JSON-LD) |
| `data/blogs.ts` | 3 blog cards |
| `data/media.ts` | Hero video sources/posters, About/Enquiry images, Life at SkyPro gallery |
| `data/enquiry.ts` | Form labels, placeholders, dropdown options, success/error copy |

Images live in `public/media/`. When you add one, give it explicit `width`, `height` and `alt` in the data file, so the layout never shifts. Use `alt: ""` for purely decorative images.

## Replacing the hero video

1. Put the new master file (MP4, 16:9 for desktop, and optionally a 9:16 reel for mobile) in `.media-cache/` as `video__hero-video-src-desktop.mp4` and/or `video__hero-video-src-mobile.mp4`.
2. Run `npm run media:video`. It uses the bundled ffmpeg (`ffmpeg-static`) to write `public/media/video/hero-video-1080.mp4`, `-720.mp4`, `-1080.webm`, `hero-video-mobile-720.{mp4,webm}` and the posters. If the ffmpeg binary is missing, run `npm approve-scripts ffmpeg-static && npm rebuild ffmpeg-static`.
3. Bump `HERO_VERSION` in `data/media.ts` (busts the 30-day `/media` browser cache), and update the two `<link rel="preload">` poster URLs in `app/layout.tsx` with the same `?v=` value.
4. `npm run build` and re-upload `/out`.

Targets: under 8 MB per file. Audio is kept because the hero has a sound toggle.

## Enquiry form → Google Sheets (Apps Script)

The form sends a form-encoded `POST` to `NEXT_PUBLIC_FORM_ENDPOINT` (`mode: "no-cors"`, so no CORS setup is needed). If the variable is empty, the payload is logged to the browser console and the success state is shown, which is useful for testing.

1. Create a Google Sheet. Go to Extensions → Apps Script, and paste:

   ```js
   const SHEET_NAME = "Enquiries";
   const NOTIFY = "info@skyproaviation.org"; // or "" to disable email

   function doPost(e) {
     const p = e.parameter;
     const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActive().insertSheet(SHEET_NAME);
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(["Submitted at", "Name", "Mobile", "Email", "Qualification", "State", "City", "Interest", "Start", "Question", "Consent", "Source", "Page"]);
     }
     sheet.appendRow([p.submittedAt, p.name, p.mobile, p.email, p.qualification, p.state, p.city, p.interest, p.start, p.question, p.consent, p.source, p.pageUrl]);
     if (NOTIFY) MailApp.sendEmail(NOTIFY, "New enquiry: " + p.name, JSON.stringify(p, null, 2));
     return ContentService.createTextOutput("ok");
   }
   ```

2. Click Deploy → New deployment → Web app. Set **Execute as: Me** and **Who has access: Anyone**. Copy the `/exec` URL.
3. Create `.env.local` (copy `.env.example`) and set `NEXT_PUBLIC_FORM_ENDPOINT=<that URL>`.
4. Rebuild: env vars are baked in at build time.

Optional analytics, which load only when set: `NEXT_PUBLIC_GA_ID` (GA4) and `NEXT_PUBLIC_META_PIXEL_ID`. The live site's Pixel ID is noted in `.env.example`.

## Deploying to Hostinger

1. Run `npm run build`. Check that `out/index.html`, `out/404.html`, `out/.htaccess` and `out/media/` exist.
2. In hPanel → **File Manager** → `public_html/`, back up the current WordPress files first (download a zip). Alternatively, test on a subdomain such as `new.skyproaviation.org` first. Use a subdomain, not a subfolder: the site's asset paths start at the domain root (`/_next`, `/media`).
3. Run `npm run package`. It writes `deploy/skypro-homepage-<date>.zip` containing the **contents** of `out/`, with Linux-safe paths, and checks the archive. Upload that zip to the site's root folder (`public_html/`, or the subdomain's folder) and extract it there. `index.html` must sit at the root. Don't zip `out/` with Windows' "Send to → Compressed folder" or PowerShell 5.1's `Compress-Archive`: the paths can break when extracted on Hostinger.
4. Make sure the hidden `.htaccess` was extracted (enable "Show hidden files"). It forces HTTPS and non-www on whichever host serves the site, enables Brotli/gzip, and sets cache headers: `/_next/static` is cached 1 year (hashed), `/media` 30 days.
5. Purge the Hostinger / LiteSpeed cache, then test: HTTPS redirect, hero video, form submission, `/404`.

To roll back, restore the WordPress backup zip.

## Project status

- Phase 0–1: content extraction, media pipeline, PRD/TRD ✅
- Phase 2–3: project setup, layout shell, all sections static with real content ✅
- Phase 4: animations (GSAP, Lenis, SplitText, DrawSVG, MotionPath, Motion) ✅ (see `docs/TRD.md` §17 for how they're loaded and the measured results)
- Phase 5: QA (Playwright, screenshots at 4 widths, Lighthouse, a11y, content audit) ✅ (results in `docs/QA-report.md`)

Still open before launch: a PageSpeed Insights run on the staging URL, the Apps Script form endpoint, and the content questions in `docs/QA-report.md` §8 (batch date, logo SVG, etc., from `docs/PRD.md` §14).
