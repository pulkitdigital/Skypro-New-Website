# SkyPro Aviation homepage — Phase 5 QA report

**Date:** 17 October 2026 · **Build:** Next.js 15.5.28 static export (`out/`), first-load JS **183 KB** (budget 190 KB)
**Environment:** local Windows machine, Playwright Chromium 1243, Lighthouse 13.5.0, served with `serve out -l 4173`

## 1. Summary

| Check | Target | Result | Status |
|---|---|---|---|
| E2E suite (desktop 1440×900 + Pixel 7) | all pass | 54 passed · 4 skipped by design · 0 failed | ✅ |
| Nav/footer links never navigate | 0 navigations | 0 navigations, 0 popups, URL unchanged | ✅ |
| Enquire CTAs → form | smooth scroll + focus | every CTA lands the form at the header offset (84 px) and focuses Full Name | ✅ |
| Only external link | WhatsApp, new tab | `https://wa.me/918955804726`, `target=_blank` (plus approved `tel:`/`mailto:`) | ✅ |
| Content matches `docs/content-extract.md` | nothing invented | 326 strings checked · 15 approved deviations · 0 unexplained | ✅ |
| `8800604726` / `Plot 14` | 0 hits | 0 hits in `out/` and in `app/ components/ data/ lib/ public/ tests/` | ✅ |
| Screenshots 1440/1280/768/375 | no overflow | 0 px horizontal overflow at every width | ✅ |
| Lighthouse mobile Performance | ≥ 85 | 70–85, **median 83** (2 of 5 runs ≥ 85) | ⚠️ borderline (see §6) |
| Lighthouse mobile Accessibility | ≥ 95 | **100** (all runs) | ✅ |
| Lighthouse SEO | 100 | **100** (mobile and desktop) | ✅ |
| CLS | < 0.05 | **0** (all runs) | ✅ |
| Lighthouse desktop | — | Performance **98** · A11y/BP/SEO **100** | ✅ |

## 2. Playwright E2E (`npm run test:e2e`)

58 tests (29 × 2 projects): **54 passed, 4 skipped, 0 failed** (2.5 min).

| Spec | What it proves |
|---|---|
| `navigation.spec.ts` | Every anchor's `href` is `#`, an in-page id, `tel:`, `mailto:` or `wa.me`. Clicking every nav, footer, course and blog link changes nothing: same URL, 0 navigations, 0 popups. Each Enquire CTA (header, hero pill, intro, batch, counselling, mobile menu) scrolls to the form, focuses Full Name and leaves the URL without a `#`. The WhatsApp button is hidden on the hero, shows after it and opens `wa.me` in a new tab. The demo-lecture dialog uses click-to-load players. Faculty "Read bio" shows the verbatim bio. |
| `form.spec.ts` | Live labels, options and placeholders. An empty submit shows inline errors and focuses the first invalid field. Invalid mobile numbers are rejected. A valid submit (no endpoint configured) logs the full JSON payload and shows the success panel. A filled honeypot never sends. |
| `quality.spec.ts` | axe: no serious or critical WCAG 2.x A/AA violations. One H1, no skipped heading levels, alt on every image, no duplicate ids. The skip link is the first tab stop. The header dropdown and the FAQ accordion work with the keyboard. The hero sound toggle exposes its state. No horizontal overflow at 320/375/768/1280/1440. No failed requests during a full scroll. JSON-LD (EducationalOrganization + FAQPage) matches the visible FAQ. Reduced motion means no pins, no smooth scroll and no motion runtime. Without JavaScript every section and its content is visible. |

**Skipped by design (4):**
- The header Enquire button is hidden below 640 px, so its test is skipped on mobile.
- The mobile-menu test is skipped on desktop.
- The keyboard dropdown test is desktop-nav only.
- The overflow sweep creates its own viewports, so it runs once (in the desktop project).

**Mobile CTA jump check** (`npm run qa:jump`): 4 CTAs × 3 runs on Pixel 7 emulation. Every run lands the form at exactly 84 px, focuses Full Name and runs no ScrollTrigger refresh before landing.

## 3. Content audit (`npm run qa:content`)

- **326** user-facing strings in `data/*.ts` were checked. Each must appear verbatim in `docs/content-extract.md` (the live homepage scrape) and in the built page.
- **21** strings render only on interaction (dialogs, dropdowns). They ship in the RSC payload or client JS and are covered by the E2E dialog tests.
- **15 approved deviations**, all from PRD decisions or the brief:

| Kind | Strings |
|---|---|
| Brief wording | "Created by BeBeyond" (live: "Created By"); "11:00 AM" (live: "11:00:00") |
| OQ-13 form copy | success text, error text (with +91-8955804726), "Send another enquiry", "Try again", "Sending…" |
| Faculty role lines | 3 short role lines taken from fragments of each live bio; the full bios are verbatim |
| UI labels | "Why SkyPro" eyebrow, "Read bio", "Scroll", "NIGHT" gauge code, "SkyPro Aviation promotional video" alt text |

- The four hero stats are exactly the brief-approved ones: "4 Decades+ Instructor Experience", "400+ Pilots Mentored", "200 Hrs CPL Flying Requirement", "6 Programs Under One Roof".
- No testimonial quotes, counters, partner countries or accreditations were invented. Testimonials are the live videos.

## 4. Banned strings (`npm run qa:grep` + raw grep)

- `scripts/qa/grep-banned.mjs` scanned 40 files in `out/` and found **no banned strings**. It checks:
  - `8800604726`, `Plot 14`, "Sanganer Airport Institutional", "6+ bases", "3,500", "USA base", "ICAO", "Aviation Medical Center", "G1000", "Garmin"
  - the Stitch testimonial names, and "Heading Text Here"
  - "450+" and "100%" in visible text
- Raw `grep` for `8800604726|Plot 14` found **0 hits** in `app/`, `components/`, `data/`, `lib/`, `public/`, `tests/` and `out/`. The only mentions are the "never use" rules in `docs/PRD.md` and `docs/TRD.md`, and the pattern list in the grep script itself.
- The only phone numbers in the built HTML are `+91-8955804726` (8×), `+918955804726` (6×, `tel:` and JSON-LD) and `918955804726` (1×, WhatsApp).

## 5. Screenshots (`npm run screenshots`)

Full-page captures with motion reduced, stitched from segments because Chrome caps a single capture at about 16,384 px:

| File | Height | Horizontal overflow |
|---|---|---|
| `screenshots/home-1440.png` | 18,179 px | 0 px |
| `screenshots/home-1280.png` | 17,835 px | 0 px |
| `screenshots/home-768.png` | 25,460 px | 0 px |
| `screenshots/home-375.png` | 27,517 px | 0 px |

## 6. Lighthouse 13.5 (final build)

The reports are in `screenshots/lighthouse/final/*.report.html`.

**Mobile** (default: simulated slow 4G, 4× CPU)

| Run | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85 | 100 | 100 | 100 | 1.7 s | 4.0 s | 130 ms | 0 | 3.0 s |
| 2 | 70 | 100 | 100 | 100 | 1.7 s | 4.1 s | 540 ms | 0 | 3.9 s |
| 3 | 83 | 100 | 100 | 100 | 1.7 s | 4.0 s | 180 ms | 0 | 3.1 s |
| 4 | 73 | 100 | 100 | 100 | 1.7 s | 4.2 s | 360 ms | 0 | 5.2 s |
| 5 | 85 | 100 | 100 | 100 | 1.7 s | 4.0 s | 90 ms | 0 | 3.2 s |

**Desktop** (`--preset=desktop`): 98 / 98 / 98, with A11y, BP and SEO at 100 in every run. FCP 0.4 s · LCP 0.9 s · TBT 0 ms · CLS 0 · SI 1.2–1.3 s.

**Reading the mobile numbers**
- FCP, LCP and CLS are stable across runs. The spread comes from **TBT (90–540 ms)**, which tracks background load on this machine, not the page.
- The *observed* LCP element is the preloader logo, painted at about 0.4 s. The 4.0 s LCP is Lighthouse's simulated slow-4G/4×-CPU estimate.
- Page weight is 544 KiB transferred, with JS bootup of about 1.1 s.
- **Recommendation:** run PageSpeed Insights against the staging URL on Hostinger (real network and CPU, Brotli and cache headers from `.htaccess`). That score is the authoritative one for the ≥ 85 target. If it still falls short there, the next levers are trimming hydration (more server components) and the startup cost of the preloader.

## 7. Bugs found and fixed during QA

1. **Faculty "Read bio" didn't open on desktop.** The pinned track's focus-follow handler scrolled on mouse focus, so the button moved between mousedown and mouseup. It now reacts only to keyboard focus (`:focus-visible`) on cards that are off-screen.
2. **axe `aria-prohibited-attr` on the "4 Decades+" stat.** The SplitText span had a label. The animated copy is now `aria-hidden`, with an sr-only copy that carries the text.
3. **CTAs landed 168 px too low on desktop.** The header offset was applied twice, because Lenis already applies `scroll-padding-top`. `content-visibility` placeholders also caused overshoot. The fix removes the extra offset and renders the deferred sections during a jump (`html.cv-render`). The form now lands at exactly 84 px.
4. **The first form submit click was lost.** A blur validation error inserted on mousedown pushed the button down. Errors are now absolutely positioned, so validation never shifts the layout.
5. **The payload preview was truncated in the console.** It is now logged as JSON.
6. **Full-page screenshots repeated after about 16k px.** They are now captured in segments and stitched.
7. **The "4 Decades+" stat overlapped its neighbours at 768 px.** It now uses fluid type size and tablet padding.
8. **Mobile CTA jumps were cut short.** This surfaced while testing an experiment that loaded the motion runtime on the first touch. The experiment was reverted, and the root cause was fixed:
   - The ScrollTrigger refresh that follows a section's first render now waits until the scroll is at rest. A refresh writes the scroll position, which also cancelled touch flings.
   - Jumps settle on `scrollend`, with a frame-based fallback.
   - Each deferred section's real height is pinned as its placeholder before `content-visibility` resumes, so the page no longer shifts after landing.

Test-only fixes (not product bugs): the header Enquire is hidden below 640 px (now a skip), strict-mode heading duplicates, decorative `aria-hidden` layers in the no-JS check, and the overflow sweep timeout.

## 8. Open items before launch

| # | Item | Owner / action |
|---|---|---|
| 1 | **Form endpoint.** `NEXT_PUBLIC_FORM_ENDPOINT` is empty, so the form logs the payload and shows success but **sends nothing**. | Deploy the Apps Script web app (README "Enquiry form → Google Sheets"), set the env var and rebuild. |
| 2 | **Upcoming Batch (OQ-2).** "15th April 2026" is six months past and hidden on the live site. It is shown as briefed. | Send the next batch date, or set `visible: false` in `data/batches.ts`. |
| 3 | **Minimum age (OQ-6).** The FAQ says 17; the Requirements card says 18 (for the CPL). Both are kept verbatim. | Confirm the wording. |
| 4 | **Assets (OQ-14).** The logo is 151×56 raster (soft on retina and the preloader). Portraits are 625 px; course images are 681 px wide. | Send an SVG logo (navy and white) and higher-resolution photos. |
| 5 | **PageSpeed Insights on staging.** | Upload `out/` to a staging URL and run PSI (mobile). |
| 6 | **Tracking (OQ-16).** The Meta Pixel and GA4 load only if their env vars are set. There is no consent banner. | Decide on the pixel and consent. |
| 7 | **"400+ Pilots Mentored" (OQ-15)** is a personal figure on live and is used as an academy stat per the brief. | Confirm. |
| 8 | **SEO note.** Full faculty bios live in dialogs (client JS), not in the static HTML. The names, roles and aircraft are in the HTML. | Optional: render bios in the HTML if search visibility for them matters. |
| 9 | **Social icons (OQ-3)** are non-navigating per the brief. | Confirm, or allow them as external links. |

## 9. Re-check after the redesign pass (17 Oct 2026)

The redesign changed layout, icons and motion only. Text, data and section order are unchanged (see `docs/TRD.md` §18).

- E2E: 54 passed, 4 skipped by design.
- Content audit: pass. One eyebrow ("Why SkyPro") is intentionally not shown.
- Banned strings: 0 hits.
- Full-page screenshots: 0 px overflow (`screenshots/home-1440.png`, `screenshots/home-375.png`).
- First-load JS: 162 KB.
- axe colour contrast: 0 violations.
- Lighthouse desktop: 98–99.
- Lighthouse mobile: 74–86 over 8 runs (median ≈ 81.5; A11y/BP/SEO 100; CLS 0.001). The reports are in `screenshots/lighthouse/redesign/`.

## 10. How to re-run

```bash
npm run build
npm run start:static
npm run test:e2e
npm run qa:content
npm run qa:grep
npm run qa:jump -- "[data-hero-pill] a[href='#enquiry']"
npm run screenshots
```

Run Lighthouse with `npx lighthouse@13.5.0 http://localhost:4173/ --view` for mobile, and add `--preset=desktop` for desktop.
