# SkyPro Aviation — Homepage Rebuild · Product Requirements (PRD)

| | |
|---|---|
| Version | 1.0 — draft for approval |
| Date | 16 Oct 2026 |
| Scope | Homepage only, frontend-only static site |
| Content source | Live homepage, captured verbatim in [`content-extract.md`](content-extract.md) |
| Design reference | Stitch `code.html` (layout and section order only; its copy is ignored), stored in `docs/reference/stitch/` |
| Technical spec | [`TRD.md`](TRD.md) |

---

## 1. Goal

Replace the current Elementor homepage with a premium, fast, animation-rich static homepage that:

1. **Converts visitors into enquiries.** Every major section leads to the enquiry form.
2. **Builds trust quickly.** Real faculty, real student video testimonials, real campus photos and the DGCA pathway are presented clearly.
3. **Feels like aviation.** Navy, amber and ivory colours, flight-path motifs, a boarding pass, an instrument gauge, a plane that flies the pathway. It should feel calm and precise, not loud.
4. **Uses only real content.** All copy comes from the live homepage. Nothing is invented.

## 2. Audience

| Persona | Who | What they need from the homepage |
|---|---|---|
| **Aspirant** (primary) | Students who have passed 12th (or are appearing), aged 16–22, plus their parents. Mostly on mobile. | Eligibility (DGCA requirements), the step-by-step pathway, which course to start with, faculty credibility, student stories, a free counselling session |
| **Licensed pilot** (secondary) | Pilots with a foreign CPL who need DGCA licence conversion or recency, or a type rating | The conversion course, conversion testimonials (10 of the 15 testimonials), a quick way to contact the academy |

## 3. Success metrics

| Metric | Target |
|---|---|
| Enquiry form submissions | Baseline from the current site's CF7 entries; proposed target +30% within 60 days of launch |
| Enquiry form completion rate (started → submitted) | ≥ 35% (proposed) |
| Clicks on CTAs that scroll to the enquiry form | Tracked through GA4 events (when `NEXT_PUBLIC_GA_ID` is set) |
| WhatsApp button clicks | Tracked (GA4 event + Meta Pixel `Contact`) |
| Lighthouse, mobile | Performance ≥ 85 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO = 100 |
| Core Web Vitals | CLS < 0.05 · LCP < 2.5 s (4G mobile) · INP < 200 ms |

## 4. Scope

**In scope**
- The homepage (`/`) as a static export, plus the 404 page that Next.js generates by default.
- Header, footer, mobile menu, floating WhatsApp button, preloader and custom cursor.
- 16 sections (see §8), enquiry form posting to a Google Apps Script endpoint.
- Media pipeline. Phase 0 is done: 79 images (including 2 posters) and 20 videos (5 hero renditions + 15 testimonials) are in `public/media/`, 73 MB in total.
- SEO metadata, JSON-LD, optional GA4 and Meta Pixel driven by env vars.
- Build and deploy to Hostinger (`/out` + `.htaccess`).

**Out of scope**
- Every other page (About, Contact, course pages, blogs, policies), a CMS, a backend, a database, auth, the student dashboard and the admission form subdomains.
- Any real navigation. Every link is `href="#"` except the listed exceptions (§7).
- New copywriting, translations, a blog engine and cookie-consent management (see Open Questions).

---

## 5. Content rules (strict)

1. **Live homepage only.** Text is used verbatim from `content-extract.md`. Fixing typos or anomalies needs approval (see §14).
2. **Stitch copy is ignored.** These strings must never appear: `+91-8800604726`, "Plot 14, Sanganer Airport Institutional Zone", 450+, 100%, "6+ bases", "3,500+ hours", USA base, ICAO, Aviation Medical Center, Garmin G1000, and any invented testimonial quote. QA greps the build for all of them.
3. **Correct contact details:** Phone +91-8955804726 · Email info@skyproaviation.org · Address 69, Ganesham Complex, Devi Nagar, New Sanganer Road, Jaipur, Rajasthan 302019.
4. **Hero stat strip:** only "4 Decades+ Instructor Experience", "400+ Pilots Mentored", "200 Hrs CPL Flying Requirement" and "6 Programs Under One Roof". The live source of each stat is listed in `content-extract.md §20`.
5. **Eyebrows and micro-labels** (e.g. "Courses", "Step 01", "PIC", "XC") reuse words that already appear on the live page or are standard aviation abbreviations of live terms. No new marketing claims.
6. **Alt text** is newly written to *describe* each image. The live site has none. The alt texts are listed in `content-extract.md §21`.
7. **Footer:** "Copyright © 2026 SkyPro Aviation" · "Created by BeBeyond" · Instagram and YouTube icons.

---

## 6. Design direction

### 6.1 Colour tokens (the only colours allowed)

| Token | Hex | Use |
|---|---|---|
| `navy` | `#003366` | Primary brand, headings on light backgrounds, navy buttons |
| `navy-deep` | `#001F3F` | Dark sections, header after scroll, footer |
| `amber` | `#F4B221` | CTAs, accents, runway lines, active states. About 5–10% of the page. **Text on amber is always navy** (contrast 6.9:1) |
| `ivory` | `#F7F4EE` | Warm light sections |
| `mist` | `#EEF3F8` | Cool light sections |
| `white` | `#FFFFFF` | Cards, dotted-grid sections |
| `ink` | `#0E1B2A` | Body text on light backgrounds |
| `muted` | `#5A6A7D` | Secondary text (5.5:1 on white) |
| `hairline` | `rgba(0,51,102,0.10)` | Borders and dividers |

Amber is **never** used for body text on light backgrounds because it fails contrast at 1.9:1. On light backgrounds it is used for fills, strokes and decorative numerals (marked `aria-hidden`). On navy it can be text (7:1).

### 6.2 Typography

| Role | Font | Spec |
|---|---|---|
| H1 | Barlow Condensed 700 | `clamp(44px, 6.4vw, 96px)` / 0.95 / −0.01em |
| H2 | Barlow Condensed 700 | `clamp(36px, 4vw, 56px)` / 1.0 |
| H3–H4 | Barlow Condensed 600 | 24–32px / 1.1 |
| Body | Barlow 400 (500 for emphasis) | 17–18px / 1.6 (16px on mobile) |
| Eyebrows, numbers, dates, durations, step numbers, tags | B612 Mono 400/700 | 12–14px uppercase, letter-spacing 0.12em. Big numerals 48–96px |

### 6.3 Backgrounds (no flat plain white)

| Treatment | Recipe |
|---|---|
| **White + dotted grid** | 1px navy dots at 6% opacity, 24px grid (CSS `radial-gradient`) |
| **Ivory** | Flat `ivory` plus a faint 1px hairline frame at the section edges |
| **Mist + flight paths** | `mist` with 2–3 dashed great-circle arcs (inline SVG, navy at 8%) |
| **Deep navy + chart** | `navy-deep` with an aeronautical chart-line SVG texture (graticule, VOR rose ticks, airway lines at 6%) and a large compass-rose watermark (white at 4%) that rotates slowly with scroll |
| **Photo band** | Full-bleed photo, navy overlay (`navy-deep` at 78%), giant outlined word (1px white stroke at about 6%) |

Motifs: a thin amber **dashed runway line** under every eyebrow, which draws in from the left. Giant outlined words "SKYPRO", "TAKE OFF" and "SKYPRO AVIATION" (footer).

**Avoid:** glassmorphism, glows, gradient blobs, emoji, pill badges everywhere, 3D/Three.js.

### 6.4 Cards

Radius 14px · 1px hairline border · soft navy shadow (`0 10px 30px -12px rgba(0,31,63,0.18)`) · hover: lift 4px, 3px amber top border, image zoom to 1.06, a subtle 3D tilt that follows the mouse (desktop only, max 4°).

### 6.5 Section rhythm and backgrounds

| # | Section | Background | Eyebrow (index · label) | Heading (verbatim) |
|---|---|---|---|---|
| 1 | HeroVideo | Video | — | — |
| 2 | HeroIntro | Deep navy + chart + compass | 01 · Welcome to SkyPro Aviation | **H1** Your One-Stop Aviation Academy for Pilot Training in India |
| 3 | Highlights | White + dotted grid | — | H2 (visually hidden) "About Us" |
| 4 | Courses | Ivory | 02 · Courses | Our Courses |
| 5 | UpcomingBatch | Mist + flight paths | 03 · Batch | Upcoming Batches |
| 6 | WhyChoose | White + dotted grid | 04 · Why SkyPro | Why Choose SkyPro Aviation? |
| 7 | Faculty | Deep navy + chart + compass | 05 · Faculty | Our Flight Instructors & Faculty |
| 8 | Requirements | Ivory | 06 · DGCA Requirements | DGCA Requirements to Become a Commercial Pilot in India |
| 9 | Pathway | **Photo band 1** (`pathway-bg`), outlined "SKYPRO" | 07 · Step-by-Step Pathway | How to Become a Commercial Pilot in India |
| 10 | Testimonials | White + dotted grid | 08 · Testimonials | Testimonials |
| 11 | AcademyLife | Deep navy, edge-to-edge | 09 · Life at SkyPro | Life at SkyPro Aviation Academy |
| 12 | Enquiry | Mist + flight paths | 10 · Enquire Now | Take Off Your Career in Aviation |
| 13 | Faq | Ivory | 11 · FAQ's | FAQ's |
| 14 | Blogs | White + dotted grid | 12 · Blogs | Insights & Guidance for Aspiring Aviators |
| 15 | CounsellingCta | **Photo band 2** (`bg-counselling-aircraft`), outlined "TAKE OFF" | — | Book Your 1-on-1 Pilot Career Counselling Session With SkyPro Aviation |
| 16 | Footer | Deep navy + outlined "SKYPRO AVIATION" | — | — |

The WhyChoose heading is shown without the live site's stray space before the "?" (live: "Why Choose SkyPro Aviation ?"). This whitespace fix needs approval (OQ-9).

---

## 7. Navigation behaviour

**Header items** (from `data/nav.ts`, every `href: "#"`):
Home · Courses ▾ (DGCA Ground Classes · CPL Flying Training Argentina) · About Us · Contact Us · Admission Forms ▾ (Conversion and Recency Form · Ground School Admission Form) · Student Dashboard · **[Enquire]** button.

> The live labels for the Admission Forms items are "Conversion and Recency **Form**" and "Ground School **Admission Form**". The brief shortened them, so the live labels are used (OQ-10).

**Rules**
- Every nav and footer link renders `href="#"` with `onClick={e => e.preventDefault()}`. Clicking does nothing: the URL does not change, the page does not scroll and no new tab opens.
- Dropdowns open on hover (desktop, 120ms open and 200ms close delay), on click or tap, and on Enter, Space or ArrowDown. Esc closes them and returns focus to the trigger. Arrow keys move between items. Dropdown items do not navigate either.
- **Exceptions:**
  1. Every **Enquire / Enquire Now / Enroll Now / Book Free Counselling** CTA smooth-scrolls with Lenis to `#enquiry` (offset by the header height), then moves focus to the form's first field (Full Name). This is not a redirect, and the URL hash is not changed.
  2. The **floating WhatsApp button** links to `https://wa.me/918955804726` with `target="_blank" rel="noopener noreferrer"`. It is the only external link.
  3. **Watch Demo / Watch Demo Lectures** open an in-page modal with an embedded YouTube player (OQ-4). Nothing navigates away.
  4. **Phone / email:** proposed `tel:` and `mailto:` links (OQ-3). If they are declined, phone and email render as plain text with a copy-to-clipboard button.
- **Header states**
  - *Over the hero:* transparent. A top scrim (`navy-deep` 55% → 0%, 160px) keeps the white logo and nav readable, because the hero video opens on **white** frames for about 3 seconds. Height 88px.
  - *After the hero:* solid `navy-deep` with a hairline bottom border, height 68px. It hides on scroll down and reappears on scroll up (it never hides while a dropdown or menu is open).
  - Logo: `logo-skypro-white.webp` (navy turned to white, amber kept) in both states.
- **Mobile (< 1024px):** a hamburger opens a right-side **Sheet** with the nav list. Dropdown groups are accordions. An Enquire button is pinned at the bottom with the phone number. Focus is trapped, Esc closes it and body scroll is locked (Lenis stopped).

---

## 8. Section-by-section specification

> Content references use the form `CE §n` = `content-extract.md` section n. Animation details and their reduced-motion and mobile fallbacks are summarised in §8.17 and specified technically in the TRD.

### 8.1 HeroVideo · `components/sections/HeroVideo.tsx` · CE §2
- **Layout:** full screen (`100svh`, minimum 560px), `<video autoplay muted loop playsinline>` with `object-fit: cover` and a poster. **No text on the video.**
- **Sources:** desktop (≥ 768px) `hero-video-1080.webm` → `hero-video-1080.mp4`, with `hero-video-720.mp4` for 768–1279px. Mobile (< 768px) uses the live site's **vertical reel** `hero-video-mobile-720.webm` / `.mp4` (9:16), so it fills a phone screen without cropping heads. Posters: `hero-poster.webp` / `hero-poster-mobile.webp` (logo frames, 24 KB and 9 KB). Sources are chosen by `matchMedia` before the first `load()`, so only one file downloads.
- **Overlays:** transparent header (§7). **Bottom centre:** navy pill "Enquire" with a plane-takeoff icon (lucide `PlaneTakeoff`) → scrolls to the enquiry form. **Bottom right:** round 56px sound toggle (lucide `Volume2`/`VolumeX`, `aria-pressed`, label "Turn sound on"/"Turn sound off"). **Bottom left:** "SCROLL" in B612 Mono with an animated 1px line.
- **Behaviour:** the video is muted by default, and the toggle unmutes it (the audio has speech and music). Autoplay failure (Low Power Mode, data saver) shows the poster with no broken UI. The video pauses when off-screen (IntersectionObserver) to save CPU and battery.
- **Animation:** after the preloader, the header slides down (y −100% → 0) and the Enquire pill rises (y 24 → 0, opacity). **Pinned transition (≥ 1024px):** as HeroIntro scrolls up over the hero, the video scales from 1 to 0.92, its corners round from 0 to 24px and a navy overlay goes from 0 to 0.5 opacity (scrubbed). No pin on smaller screens.

### 8.2 HeroIntro · `HeroIntro.tsx` · CE §3, §4, §20
- **Background:** deep navy + chart lines + compass rose.
- **Layout (desktop):** 12-column grid. Left 7 columns: eyebrow "Welcome to SkyPro Aviation" → **H1** "Your One-Stop Aviation Academy for Pilot Training in India" → About paragraphs 1 and 2 → buttons **[Enquire Now]** (amber, magnetic) **[Watch Demo Lectures]** (outline white). Right 5 columns: `about-academy-lounge.webp` (4:5 crop, radius 14px, thin amber corner ticks).
- **Stat strip:** one slim bar (hairline white border at 12%) with 4 cells and vertical dividers. Numbers in Barlow Condensed 56px, labels in B612 Mono:
  `4 Decades+` Instructor Experience · `400+` Pilots Mentored · `200 Hrs` CPL Flying Requirement · `6` Programs Under One Roof.
- **Mobile:** stacked (eyebrow, H1, text, buttons full width, image 4:3, then the stat strip as a 2×2 grid).
- **Animation:** H1 line-by-line SplitText mask reveal. The runway line draws in. The image reveals with clip-path (inset 100% → 0 from the bottom). Stats count up when in view (400, 200, 6), while "4 Decades+" reveals as text (chars stagger). The compass rose rotates with scroll (0 → 45°).

### 8.3 Highlights · `Highlights.tsx` · CE §5
- 4 items: **Experienced Instructors · Career Focused Approach · Comprehensive Training · Global Opportunities**, each with its live one-line text.
- **Layout:** a white panel that **overlaps the navy/white boundary** by 64px (desktop): 4 columns with vertical hairline dividers. Each item shows a mono index (01–04), a lucide icon (stroke 1.25: `Users`, `Target`, `BookOpen`, `Globe2`), an H3 title and the text. 2×2 on tablet, 1 column on mobile.
- **Animation:** staggered fade-up (y 40 → 0). Icon strokes draw (DrawSVG) on enter.

### 8.4 Courses · `Courses.tsx` · `data/courses.ts` · CE §6
- **Header:** eyebrow + H2 "Our Courses" + intro paragraph (verbatim).
- **6 cards:** DGCA Ground Classes · ATPL Theory Training · CPL Flight Training · Type Rating · License Conversion · Mentorship Programme. Each card has a photo on top (16:10), a mono index, the course title (H3), its subheading (e.g. "Master Aviation Fundamentals"), the description and a "Read More →" link (non-navigating).
- **Featured card:** the first card (DGCA Ground Classes) is wider. Desktop grid on 12 columns: row 1 = [DGCA 6][ATPL 3][CPL 3], row 2 = [Type Rating 4][Conversion 4][Mentorship 4]. The featured card has a larger image (16:9) and a navy title bar. Tablet: 2 columns with the featured card full width. Mobile: 1 column.
- **"Watch Demo Lectures":** the live course cards have **only "Read More"**. Default: Read More only. A Watch Demo link on the DGCA card is possible if approved (OQ-5).
- **Hover:** card lift, amber top border, image zoom 1.06, tilt. **Animation:** staggered fade-up per row.

### 8.5 UpcomingBatch · `UpcomingBatch.tsx` + `ui/BoardingPass.tsx` · `data/batches.ts` · CE §7
- **Boarding-pass card**, one row per batch (data supports many):
  - **Main part:** mono header row "SKYPRO AVIATION · BATCH #1". Fields as label/value pairs: PROGRAM "DGCA Ground Classes – Navigation and Meteorology" · CLASS "Online/Offline" · DATE "15th April 2026" · TIME "11:00 AM". A dashed flight line with plane glyph from "JAI" to "CPL" (decorative, `aria-hidden`).
  - **Perforated edge:** a radial-gradient notch mask plus a dotted tear line.
  - **Amber stub:** "BATCH #1" vertical mono text + **[Watch Demo]** (opens the demo modal) + **[Enroll Now]** (scrolls to the enquiry form). Text on amber is navy.
- **Mobile:** the stub moves below the main part with a horizontal perforation.
- **Animation:** the card slides in (x 60 → 0, rotate 2° → 0). On hover the stub "tears": it moves 6px right and rotates 1.5°, and the perforation gap widens.
- ⚠️ This block is **hidden on every device on the live site**, and its date is in the past (OQ-2). `batches.ts` has a `visible` flag, and the whole section disappears when no batch is visible.

### 8.6 WhyChoose · `WhyChoose.tsx` · `data/whyChoose.ts` · CE §8
- **Layout (desktop):** 2 columns. **Left (5 columns):** sticky image (`life/life-03.webp`, an instructor at the digital board, portrait 4:5, sticky `top: 96px`) with a slow parallax (y −6% → 6%). **Right (7 columns):** eyebrow + H2 + the two intro paragraphs, then an `<ol>` of **6 numbered points**. Each point has a big amber mono number (72px, `aria-hidden`; `<ol>` carries the semantics), a hairline divider, an H3 title and the text.
- **Mobile:** image on top (16:10, not sticky), then the list. Numbers drop to 44px.
- **Animation:** each point fades up as it enters, and its number counts from 00 to NN.

### 8.7 Faculty · `Faculty.tsx` · `data/faculty.ts` · CE §9
- **5 cards** with tall **3:4 portraits** (the source is a 625px square on a navy studio backdrop, cropped from the sides). Name (H3) and role overlaid on a navy gradient (bottom 45%). **Aircraft tags** in mono chips (only aircraft named in the bio: e.g. "MIG-21 · MIG-29 · ATR"). A **[Read bio]** button opens a Dialog (desktop) or Sheet (mobile) with the **full verbatim bio**, plus **[Watch Demo Lectures]** where the live site has a demo (Thapliyal, Dahiya, Golchha).
- **Role line** = a short fragment in each bio's own words (no new copy; Choudhary's joins two fragments of her bio):
  - Thapliyal: "Veteran fighter pilot, flight and ground subjects instructor"
  - Dahiya: "Air Force veteran"
  - Mehta: "Veteran fighter pilot and qualified flight safety accident investigator"
  - Choudhary: "Navigator, Indian Air Force"
  - Golchha: "Airbus A320 type-rated pilot"
- **Desktop (≥ 1024px):** pinned horizontal scroll. Scrolling down moves the card track left (scrub, pin length = track overflow). A progress bar with the mono counter "01 / 05" sits under the track.
- **< 1024px:** Embla swipe carousel (snap, peek of the next card, dots and arrows, keyboard accessible).

### 8.8 Requirements · `Requirements.tsx` + `ui/Gauge.tsx` · `data/requirements.ts` · CE §10
- **6 numbered cards** (01–06): Educational Qualification · Age Requirement · Medical Fitness · DGCA Computer Number · Ground School Training · Flying Hours Requirement. Each card has a lucide icon (stroke 1.25: `GraduationCap`, `CalendarCheck`, `HeartPulse`, `Hash`, `School`, `Gauge`).
- **Ground School card** lists its 6 subjects as mono chips.
- **Flying Hours card (highlighted):** navy card spanning 2 rows on desktop:
  - **Animated 200-hour gauge:** a semicircular dial from 0 to 200 with ticks every 25 and labels at 0/50/100/150/200. The needle sweeps 0 → 200 and a centre readout counts up to "200 HRS".
  - **Four minimum arcs**, filled in sequence as concentric thin arcs on the same 0–200 scale: **100 PIC · 50 XC · 10 IF · 5 NIGHT**. They are drawn as **separate concentric arcs, not stacked**, because the live text says XC and night hours are logged *as PIC*, so the minimums overlap. Stacking them would misstate the rule.
  - Below the gauge: the 4 verbatim bullet lines + "Flight checks" with its 5 sub-items (collapsible on mobile).
- **Layout:** desktop 3 columns (Flying Hours card occupies column 3, rows 1–2). Tablet 2 columns. Mobile 1 column with the Flying Hours card last.
- **Animation:** staggered card reveal. The gauge animates once at 40% visibility (needle 1.6s `power3.out`, then arcs 0.3s apart).

### 8.9 Pathway · `Pathway.tsx` · `data/pathway.ts` · CE §11 — *Photo band 1*
- **Background:** `pathway-bg.webp`, navy overlay at 78%, giant outlined "SKYPRO" behind the content.
- **Heading:** eyebrow "Step-by-Step Pathway" + H2 "How to Become a Commercial Pilot in India". The live heading is split here, not rewritten.
- **6 steps** (Step 01 … 06, mono) with titles and texts verbatim.
- **Desktop:** steps alternate above and below a **dashed amber flight route** (SVG cubic path spanning the width). A small plane icon sits on the route. The section **pins for about 150vh**: the route draws with scroll (DrawSVG, scrubbed) and the plane follows it (MotionPath, `autoRotate`). Each step marker lights up (amber fill, card from 40% to 100% opacity) when the plane reaches it.
- **Mobile and tablet:** vertical route on the left, with steps stacked on the right. The route draws as you scroll (no pin) and the plane moves down the line.

### 8.10 Testimonials · `Testimonials.tsx` · `data/testimonials.ts` · CE §12
- The live testimonials are **self-hosted MP4 videos, not YouTube** (OQ-1). Every video is 9:16, compressed to 540×960 (1.2–5.0 MB each).
- **Layout (desktop):** left = **large featured player** (9:16, about 380×676) with its poster, a big amber play button and the name and course below. Right = **filter tabs** *All (15) · License Conversion & Recency (10) · DGCA Ground Classes (5)* and a **thumbnail strip/grid** (3 columns, poster + name + course chip). Clicking a thumbnail loads it into the featured player. Names and course labels only, **no quotes, no star ratings**.
- **Player:** native `<video controls playsinline preload="none">`. The source is attached only on first play. Playing one video pauses any other.
- **Mobile:** tabs scroll horizontally, then the featured player at full width (max 420px), then a horizontal Embla thumbnail strip.
- **Animation:** tab switch with a Motion `layout` cross-fade. Thumbnails stagger in.
- Four posters are only 255×460 (Swarali, Harpreet, Naman, Puneet). For those, the featured poster is a frame taken from their video (TRD §6).

### 8.11 AcademyLife · `AcademyLife.tsx` · `data/media.ts` · CE §13
- **Edge-to-edge mosaic** on deep navy: 4 columns on desktop, 3 on tablet and 2 on mobile. 17 photos are used (`life-14` duplicates the About image and `life-05` nearly duplicates `life-01`; see OQ-12).
- **Animation:** columns scroll at different speeds (parallax y: −8%, +6%, −4%, +8%; desktop only). Each image reveals with clip-path (inset 0 0 100% 0 → 0) as it enters. Mobile: simple fade.
- No lightbox in v1 (the live site has one). It can be added on request.

### 8.12 Enquiry · `Enquiry.tsx` · CE §14, §19 · anchor `id="enquiry"`
- **Split layout:**
  - **Left (5 columns):** photo `life/life-10.webp` (cadets in uniform) in a 4:5 frame, eyebrow "Enquire Now", H2 "Take Off Your Career in Aviation", then the contact list (phone, email, address) with lucide icons.
  - **Right (7 columns):** a white card with the form (§9).
- **Mobile:** heading and contact details first, the photo becomes a 16:9 strip, then the form.

### 8.13 FAQ · `Faq.tsx` · `data/faq.ts` · CE §15
- Left: `faq-aircraft.webp` (sticky on desktop). Right: a Radix **Accordion** (single, collapsible) with 6 items. The first item is open by default.
- Answers: verbatim, pending OQ-6 (age 17 vs 18) and OQ-7 (FAQ #3 leftovers).
- **Animation:** Motion height and opacity transition on open and close. A plane-glyph indicator rotates 90° when open.

### 8.14 Blogs · `Blogs.tsx` · `data/blogs.ts` · CE §16
- 3 cards: image (3:2), title (H3), excerpt and "Read More" with a plane icon (non-navigating). Card hover styles from §6.4.
- Mobile: 1 column (or a swipe carousel if 3 tall cards feel long; decided in Phase 3).

### 8.15 CounsellingCta · `CounsellingCta.tsx` · CE §17 — *Photo band 2*
- Full-bleed `bg-counselling-aircraft.webp`, navy overlay, giant outlined **"TAKE OFF"**.
- Content: H2, paragraph (verbatim, OQ-8), 4 bullets with amber check-plane icons, the highlight line "Limited Slots Available. Reserve Yours Today!" in amber mono (on navy, so contrast passes).
- **Bar:** "Unlock Your Pilot Path" · "Call Us:- +91-8955804726" · **[Enquire Now]** (amber, magnetic) → scrolls to the enquiry form.
- **Animation:** as the section scrolls through, the outlined "TAKE OFF" fills with amber from left to right (clip-path on an amber copy, scrubbed).

### 8.16 Footer · `layout/Footer.tsx` · CE §18
- **Deep navy, 4 columns:**
  1. White logo + the first About sentence (verbatim) + Instagram and YouTube icons
  2. Quick Links (Home, Blogs, About Us, Contact Us, Disclaimer, Privacy Policy, Terms Of Use, Cookie Policy)
  3. Our Courses (DGCA Ground Classes, ATPL Theory Training, Flight Training, Type Rating, License Conversion, Mentorship Programme)
  4. Contact Us (phone, email, address, www.skyproaviation.org)
- All links are non-navigating, social icons included (OQ-3). The map embed from the live footer is omitted (OQ-11).
- A giant outlined **"SKYPRO AVIATION"** wordmark spans the full width below the columns (Barlow Condensed, 1px stroke at 10%).
- **Bottom bar:** "Copyright © 2026 SkyPro Aviation" · "Created by BeBeyond".
- **Mobile:** columns stack, and Quick Links and Our Courses become 2 columns side by side.

### 8.17 Global UI and motion

| Element | Spec | Reduced motion | < 768px |
|---|---|---|---|
| **Preloader** | Logo + thin runway progress line (amber). Lasts at most 1.2s, then fades out. Shown once per session (`sessionStorage`). Rendered in the static HTML (CSS-driven) so it does not wait for JS | Skipped | Shown (max 1.2s) |
| **Lenis smooth scroll** | Synced to ScrollTrigger | Off | Native touch scroll (Lenis does not smooth touch) |
| **Custom cursor** | 8px amber dot that grows to 40px with a navy 1px ring over interactive elements. `mix-blend` is not used | Off | Off (only with `pointer: fine`) |
| **Magnetic buttons** | Primary CTAs pull up to 8px toward the cursor | Off | Off |
| **SplitText headings** | Every H1/H2 reveals line by line with a mask | Instant | Instant fade instead |
| **Eyebrow runway line** | Draws in left → right | Static | Static |
| **Card reveals** | Staggered y 40 → 0, opacity 0 → 1 | Instant | y 16, shorter |
| **3D tilt on hover** | Max 4°, desktop only | Off | Off |
| **Parallax** (compass, chart lines, outlined words, mosaic) | Scrubbed transforms | Off | Off |
| **Pinning** (hero, faculty, pathway) | ≥ 1024px only | Off | Off |
| **Floating WhatsApp** | 56px amber circle with the WhatsApp glyph in navy, bottom right, appears after the hero (scale/opacity). Label "Chat with SkyPro Aviation on WhatsApp" | Appears without animation | 52px, 16px from the edges, stays clear of the iOS home bar |

Only `transform`, `opacity` and `clip-path` are animated. Every element that is revealed by animation is **visible without JS** (the hidden start state is added only after hydration).

---

## 9. Enquiry form specification

| # | Field (label verbatim) | Control | Validation (zod) | Error message |
|---|---|---|---|---|
| 1 | Full Name* | text, `autocomplete="name"` | trimmed, 2–80 chars, letters, spaces, `.`, `'` and `-` only | "Please enter your full name." |
| 2 | Mobile No.* | two fields: country-code Select (default India +91, `data/countryCodes.ts`) + tel input, `autocomplete="tel-national"` | strip spaces, `-`, a pasted `+code`/`00code` (or `91` for India) and a trunk `0`; India `/^[6-9]\d{9}$/`, elsewhere 6–14 digits (≤ 15 with the code) | "Enter a valid mobile number." |
| 3 | Email Address* | email, `autocomplete="email"` | `z.email()` | "Enter a valid email address." |
| 4 | Current Education Qualification* | Select | one of: 10th · 12th Appearing · 12th Pass · Graduation | "Please choose an option." |
| 5 | State* | Select (typeahead) | one of the 36 states/UTs (CE §14) | "Please choose your state." |
| 6 | City* | text, `autocomplete="address-level2"` | 2–60 chars | "Please enter your city." |
| 7 | Which of these are you interested in?* | **Checkbox group** (multi-select, as on live) | ≥ 1 of: DGCA Ground Classes (CPL) · Flying Training · Conversion & Recency · Career Counselling | "Select at least one option." |
| 8 | How soon do you plan to start?* | Radio group (cards) | one of: Immediately (0-3 months) · Soon (3-6 months) · Later (6-12 months) · Just Exploring for Now | "Please choose one." |
| 9 | Any specific question you’d like us to assist with? | textarea | optional, ≤ 2000 chars, live counter | — |
| 10 | Consent checkbox* (label verbatim) | Checkbox | must be `true` | "Please agree so we can contact you." |
| — | Honeypot `company` | text, visually hidden, `tabindex=-1`, `autocomplete="off"`, `aria-hidden` | if filled → pretend success, send nothing | — |

Placeholders are verbatim from live: "Enter your full name", "Enter your mobile no.", "name@example.com", "Your city", "Ask us anything about training, eligibility, fees, process…". Submit label: **"Submit Enquiry"**.

The option text "Immediately (0-3 months)" uses a hyphen on live. The brief shows an en dash. The live hyphen is kept (OQ-10).

**States**
- **Idle → validating:** errors appear inline under each field after its first blur, then update on change. On submit, focus moves to the first invalid field and an `aria-live="polite"` summary announces the error count.
- **Sending:** the button is disabled and shows "Sending…" with a small plane spinner. Fields are read-only. Double submit is impossible.
- **Success:** the form card is replaced with a Motion transition by a confirmation panel: an animated check, then a plane taking off along a dashed line, "Thank you, {first name}!" and "We have received your enquiry. Our team will contact you shortly.", plus a [Send another enquiry] button. ⚠️ These two success sentences are **new UI copy** that the live site does not show (it uses CF7's default message). They need approval (OQ-13).
- **Error (network failure):** an inline amber-bordered alert "Something went wrong. Please try again or call +91-8955804726." with [Try again]. Form values are kept.
- **No endpoint configured** (`NEXT_PUBLIC_FORM_ENDPOINT` empty): logs the payload with `console.info` and shows Success, so the UI can be tested.

**Payload** (form-encoded): `name, mobile (10 digits), email, qualification, state, city, interest (comma-joined), start, question, consent ("yes"), source ("homepage"), submittedAt (ISO), pageUrl`.

**Analytics:** `generate_lead` (GA4) and `Lead` (Meta Pixel) fire only on success, and only when those IDs are set.

---

## 10. Responsive behaviour

| | Desktop 1440 | Laptop 1280 | Tablet 768 | Mobile 375 |
|---|---|---|---|---|
| Container | 1280 max, 80px gutters | 1160, 60px | 100%, 32px | 100%, 20px (≥ 16px) |
| Header | Full nav + dropdowns | Full nav (tighter gaps) | Hamburger → Sheet | Hamburger → Sheet |
| Hero | 1080p, pinned scale-down | 720p, pinned scale-down | 720p, no pin | Vertical reel 720×1280, no pin |
| HeroIntro | 7/5 split, stat bar 4-up | Same | Stacked, stats 4-up | Stacked, stats 2×2 |
| Highlights | 4-up overlapping strip | 4-up | 2×2 | 1 column |
| Courses | 12-col [6,3,3]/[4,4,4] | Same | 2 columns, featured full width | 1 column |
| Boarding pass | Horizontal with right stub | Same | Horizontal | Stub below |
| WhyChoose | Sticky image + list | Same | Stacked | Stacked |
| Faculty | Pinned horizontal scroll | Pinned horizontal scroll | Swipe carousel | Swipe carousel |
| Requirements | 3 columns, gauge card spans 2 rows | Same | 2 columns | 1 column |
| Pathway | Pinned horizontal route | Same | Vertical route | Vertical route |
| Testimonials | Player + 3-col thumbnail grid | Player + 2-col grid | Player + strip | Player + strip |
| AcademyLife | 4 columns, parallax | 4 columns | 3 columns | 2 columns |
| Enquiry | 5/7 split | 5/7 split | Stacked | Stacked |
| Footer | 4 columns | 4 columns | 2×2 | Stacked (links 2-up) |

There is no horizontal page scroll at any width (checked at 320px too). Tap targets are at least 44×44px.

---

## 11. Accessibility requirements (WCAG 2.2 AA)

- **One H1** (HeroIntro). Logical H2 → H3 order. Landmarks: `header`, `nav` (aria-label "Main"), `main`, `footer`.
- A **skip link** ("Skip to content") is the first focusable element.
- **Visible focus:** 2px amber outline plus a 2px navy offset ring on light backgrounds, white on navy. Focus is never removed.
- **Keyboard:** dropdowns, the mobile Sheet, Accordion, Select, carousels, tabs, the video toggle, testimonial tabs and thumbnails, and dialogs all work with the keyboard (Radix gives the base). The pinned horizontal Faculty section stays reachable by Tab (focus moves the scroll position).
- **Media:** `alt` on every image (decorative = `alt=""`). The hero video is muted by default, has a pause control (the sound toggle + a pause button exposed to screen readers) and is `aria-hidden`, with the poster carrying the alt text. Testimonial videos have native controls (no captions exist; OQ-14).
- **Colour contrast:** AA for all text. Amber is never body text on light backgrounds (see §6.1).
- **Motion:** `prefers-reduced-motion` turns off Lenis, pinning, parallax, SplitText, the cursor and the preloader, and content shows instantly. No flashing.
- **Forms:** every input has a `<label>`. Errors use `aria-invalid` + `aria-describedby`. Required fields have `aria-required`. The live region announces submit results.
- **Language:** `<html lang="en-IN">`.

## 12. SEO requirements

- **Metadata API:** title "SkyPro Aviation | DGCA Ground Classes India | Pilot Training" and the meta description, both verbatim from live (CE §0). Canonical `https://skyproaviation.org/`. `robots: index, follow`. OpenGraph + Twitter card with an **OG image** 1200×630 (`/media/og-image.jpg`, built from the About photo + white logo on navy).
- **JSON-LD** (in the page HTML):
  - `EducationalOrganization`: name, url, logo, image, description (About ¶1 verbatim), telephone `+91-8955804726`, email, `PostalAddress` (69, Ganesham Complex, Devi Nagar, New Sanganer Road · Jaipur · Rajasthan · 302019 · IN), `geo` (from the live map pin) and `sameAs` (Instagram, YouTube). The live schema's course descriptions are **not** reused, because they contain "ICAO" and "USA".
  - `FAQPage`: the 6 Q&As, using the approved FAQ text (OQ-6/7).
- `robots.txt` + `sitemap.xml` (homepage only), favicon set (32/180/512) and `theme-color` `#001F3F`.
- Semantic headings, descriptive link text. "Read More" links get `aria-label="Read more about {title}"`.

## 13. Performance requirements

| Budget | Target |
|---|---|
| Initial JS (gzip) | ≤ 190 KB (Next runtime + GSAP + Lenis + Motion + Radix parts used) |
| CSS (gzip) | ≤ 30 KB |
| Fonts | 6 woff2 files, Latin subset, `display: swap`. Only the heading font is preloaded |
| LCP element | Hero poster (≤ 30 KB) |
| Images below the fold | `loading="lazy"`, explicit width/height (no CLS) |
| Testimonial videos | `preload="none"`, source attached on play |
| Hero video | One file per device (720p mobile reel = 4.7 MB), paused when off-screen |
| Third-party scripts | None by default. GA4 and Pixel load `afterInteractive` only when their env vars are set. YouTube loads only after a click (facade) |

---

## 14. Open Questions (need a decision before or during Phase 3)

Each question has a **proposed default**. Phase 3 will use the default unless you decide otherwise.

| # | Question | Finding | Proposed default |
|---|---|---|---|
| **OQ-1** | **Testimonials are not YouTube.** The brief assumes YouTube testimonial videos. On the live site all 15 are self-hosted MP4s (9:16, pillarboxed in 1920×1080). | Videos were downloaded and compressed: 540×960, 1.2–5.0 MB each, 41 MB total in `public/media/video/testimonials/`. | Self-hosted `<video>` player (§8.10). **Alternative:** upload them to the SkyPro YouTube channel, give me the IDs and I'll switch to the lite-YouTube facade (smaller hosting footprint). |
| **OQ-2** | **The Upcoming Batch is hidden on the live site and already past.** The batch table is hidden on all devices; its only date (15th April 2026) is 6 months ago. The live time format is "11:00:00". | — | Build it as briefed, with the "11:00 AM" format. **Please send the current batch(es)** or tell me to keep the section hidden (`visible: false`). |
| **OQ-3** | **Phone, email and social links.** The brief says WhatsApp is the only external link. | `tel:`/`mailto:` open the dialler or mail app; they are not web navigation. | Phone = `tel:+918955804726` and email = `mailto:`, because they are essential for a mobile lead site. Instagram and YouTube icons stay non-navigating (`href="#"`, real URLs kept in data). Say "plain text only" to make phone and email non-clickable with a copy button. |
| **OQ-4** | **What "Watch Demo / Watch Demo Lectures" does.** The live site links to YouTube (`jhBCpukAaFg` Thapliyal, `L7o4hkw6t0A` Dahiya, `2N9pTNhCPiY` Golchha; the batch demo `zjSYG67adbY` is commented out). | Opening YouTube would be an external redirect. | An in-page modal with a click-to-load `youtube-nocookie` embed. HeroIntro and Batch buttons open it with tabs for the 3 lectures; faculty buttons open it on their own lecture. **Alternative:** the button only scrolls to the Faculty section (what the live batch button does today). |
| **OQ-5** | **Course card "Watch Demo Lectures".** The brief lists Read More / Watch Demo per course card; the live cards have Read More only. | — | Read More only. Add Watch Demo on DGCA Ground Classes if you confirm which video. |
| **OQ-6** | **Minimum age: 17 or 18?** FAQ #1 says "at least 17 years old"; the Requirements card says "Minimum 18 years old at the time of applying for the CPL". | These are not strictly contradictory (17 to *start* training vs 18 for the *licence*), but they read as a conflict. | Keep both verbatim. Suggested FAQ fix for you to approve: "…at least 17 years old to begin training (18 to be issued a CPL)…". |
| **OQ-7** | **FAQ #3 has CMS leftovers.** The answer starts "Add Your Review your pre-course materials…" and ends "…ready to focus.Heading Text Here". | Obvious editor leftovers. | Remove "Add Your " and "Heading Text Here" → "Review your pre-course materials and ensure your medical and documents are ready. Get familiar with basic aviation terminology. Arrive well-rested and ready to focus." **Needs your OK.** |
| **OQ-8** | **Counselling paragraph punctuation.** It ends "…where you can." before the bullets. | Reads as if a colon was intended. | Keep verbatim unless approved to change "." → ":". |
| **OQ-9** | **Small typography fixes.** "Why Choose SkyPro Aviation **?**" (stray space) and a double space in the Why Choose paragraph. | — | Remove the stray space and the double space (whitespace only, no wording change). |
| **OQ-10** | **Label differences between the brief and live.** Admission Forms items: live "Conversion and Recency Form" / "Ground School Admission Form" vs brief "Conversion and Recency" / "Ground School". "0-3 months" (live) vs "0–3 months" (brief). "Created By" (live) vs "Created by" (brief). | — | Nav and form labels follow live. The footer credit follows the brief ("Created by BeBeyond"). |
| **OQ-11** | **Footer map.** The live footer has a Google Maps embed. | It is a heavy third-party iframe (≈ 600 KB, cookies), and the brief does not mention it. | Omit it. Optional: a click-to-load map in column 4. |
| **OQ-12** | **Duplicate gallery photos.** `life-14` = the About photo; `life-05` ≈ `life-01`. | — | Use 17 of the 19 photos (drop those two). |
| **OQ-13** | **Form success and error copy.** The live site shows no custom message. | New UI strings are needed. | "Thank you, {first name}!" / "We have received your enquiry. Our team will contact you shortly." / "Something went wrong. Please try again or call +91-8955804726." **Needs your OK** (or supply your own). |
| **OQ-14** | **Missing or low-resolution assets.** | (a) The **logo** is only 151×56 px and there is no SVG (the live JSON-LD's `/2025/08/logo.png` returns 404). It will look soft on retina screens and on the preloader. (b) Faculty portraits are 625px squares (soft at 2× on 3:4 cards). (c) Course images are 681×381 (soft on the wide featured card). (d) 4 testimonial posters are 255×460. (e) No captions or transcripts exist for any video. | **Please send:** an SVG logo (navy + white versions), portraits at least 1200px, and course photos at least 1600px wide, if available. For now: current assets, plus poster frames taken from the videos for (d). |
| **OQ-15** | **"400+ Pilots Mentored" attribution.** On the live site this is Capt. Rishabh Golchha's personal figure, not an academy figure. | The brief allows it as an academy stat. | Use as briefed. Flagging it because the academy-level claim is slightly stronger than the source. |
| **OQ-16** | **Tracking and consent.** The live site loads Meta Pixel `2735375403482238`; no GA4 was found. | India's DPDP Act may require consent for marketing pixels. | Pixel and GA4 load only when their env vars are set (Pixel ID pre-filled in `.env.example` as a comment). A consent banner is out of scope unless you request one. |
| **OQ-17** | **The hero video opens on white frames for about 3 seconds.** | White logo and nav over a white frame are unreadable. | Add a top navy scrim behind the header (§7). Alternatively, trim the first 2 seconds of the hero video (I can re-encode). |
| **OQ-18** | **Opening hours.** "Mon–Sat 09:00–19:00" exists only in the live JSON-LD, not as visible text. | — | Include it in JSON-LD only if you confirm it is current. Never show it as visible text. |

---

## 15. Acceptance criteria (summary)

1. All 16 sections render with content identical to `content-extract.md`, except approved OQ changes.
2. No nav, footer, course or blog link changes the URL or opens a tab. Enquiry CTAs scroll to `#enquiry` and focus the first field. WhatsApp opens `wa.me/918955804726` in a new tab.
3. A grep of the build for `8800604726`, `Plot 14`, `450+`, `100%`, `3,500`, `ICAO`, `USA`, `G1000`, `Garmin` and `Aviation Medical` returns nothing.
4. Lighthouse (mobile) Performance ≥ 85, Accessibility ≥ 95, SEO 100, CLS < 0.05.
5. Playwright screenshots at 1440, 1280, 768 and 375 match the approved Phase 3 layouts, with no horizontal overflow.
6. With `prefers-reduced-motion`, all content is visible immediately, with no pinning, no smooth scroll and no parallax.
7. The form validates every rule in §9, the honeypot blocks submission, and the empty endpoint shows Success and logs the payload.
