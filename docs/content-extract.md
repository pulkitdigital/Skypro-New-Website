# SkyPro Aviation — Homepage Content Extract

- **Source:** https://skyproaviation.org/ (homepage only, public URL, no login)
- **Extracted:** 16 Oct 2026
- **Methods:** raw HTML parse (BeautifulSoup) incl. Elementor `data-settings` JSON and Elementor post CSS (`post-2433.css`) for background images · public `wp-json/wp/v2/media` (241 items, 3 pages) · headless Chromium (Playwright) at 1440×900 and 375×812, slow scroll to bottom, every image/media response captured.
- **Rule:** everything below is copied **verbatim** from the live homepage (typos, spacing and punctuation preserved). Editorial notes are in *italics* or under "Notes". Sections hidden on every device on the live site are marked **[HIDDEN ON LIVE]**.

---

## 0. Page meta

| Field | Value |
|---|---|
| `<title>` | SkyPro Aviation \| DGCA Ground Classes India \| Pilot Training |
| meta description | DGCA ground classes India for CPL, ATPL theory, pilot training, type rating, and DGCA licence conversion. Learn from airline captains and IAF veterans at SkyPro Aviation. |
| canonical | https://skyproaviation.org/ |
| og:site_name | SkyPro Aviation |
| robots | follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large |
| Favicon | `cropped-Untitled-design-2025-09-16T154002.319` (512 px source) |
| Meta Pixel on live | ID `2735375403482238` (for `NEXT_PUBLIC_META_PIXEL_ID`) |
| GA4 / GTM on live | none found |
| Live JSON-LD extras | geo 26.885677, 75.763584 · opening hours Mon–Sat 09:00–19:00 (schema only, not visible on page) |

---

## 1. Header / navigation

Logo (left) · nav (right):

- Home
- Courses ▾
  - DGCA Ground Classes
  - CPL Flying Training Argentina
- About Us
- Contact Us
- Admission Forms ▾
  - Conversion and Recency Form
  - Ground School Admission Form
- Student Dashboard
- **Enquire** (button)

*Live hrefs (for reference only; the rebuild uses `href="#"` everywhere):* Home → `/`, DGCA Ground Classes → `/ground-classes-for-dgca-exams/`, CPL Flying Training Argentina → `/cpl-training-in-argentina/`, About Us → `/about-us/`, Contact Us → `/contact-us/`, Conversion and Recency Form → `https://recency.skyproaviation.org/`, Ground School Admission Form → `https://groundschool.skyproaviation.org/`, Student Dashboard → `http://classes.skyproaviation.org/`, Enquire → `/#Enquire`.

---

## 2. Hero video (no text)

- Desktop (> 768 px): `Video-V4-1.mp4` — 1920×1080, 58.2 s, H.264 + AAC stereo (speech + music, mean −12.6 dB).
- Mobile (≤ 768 px): `Reel-V4.mp4` — 9:16 (stored 1080×1080, SAR 9:16), 56.7 s, H.264 + AAC.
- Autoplay, muted, loop, playsinline. Round mute/unmute toggle bottom-right.
- Button: **Enquire** (plane-departure icon) → enquiry section.
- First ~2 s of both videos are a white frame → SkyPro logo animation on white; then interview footage (incl. burned-in lower third "Captain Rishabh Golchha").

---

## 3. Hero intro (H1)

**H1:** Welcome to SkyPro Aviation – Your One-Stop Aviation Academy for Pilot Training in India

---

## 4. About Us

- Eyebrow (h6): About Us
- Heading (h2): About Us
- Paragraph 1: SkyPro Aviation is one of India’s leading pilot training academies, guided by airline-experienced instructors from top carriers. We offer a complete pathway from DGCA ground classes to flying training, licence conversion, and type rating assistance, all under one roof.
- Paragraph 2: Our mission is to make pilot training affordable, high-quality, and fully guided, enabling aspiring pilots to focus on developing the skills and confidence necessary for a successful aviation career.
- Button: Read More *(live → /about-us/)*
- Image: `2026/09/7.webp` (reception lounge, aircraft wall sculpture) → `about-academy-lounge.webp`

## 5. Highlights (4 icon boxes inside About)

| # | Title | Text |
|---|---|---|
| 1 | Experienced Instructors | Learn from airline-trained pilots and aviation experts. |
| 2 | Career Focused Approach | Affordable programs to build skills and confidence for aviation careers. |
| 3 | Comprehensive Training | DGCA classes, flight training, licence conversion & type rating in one place. |
| 4 | Global Opportunities | From training to airline jobs, connect with aviation opportunities worldwide. |

---

## 6. Our Courses

- Heading (h2): Our Courses
- Intro: Comprehensive pilot training programs from ground classes to advanced ratings, designed to meet DGCA standards and boost aviation careers.
- Layout on live: vertical tab list (left) + content card with background photo (right).

| # | Tab title | Subheading (h4) | Description | Link | Image |
|---|---|---|---|---|---|
| 1 | DGCA Ground Classes | Master Aviation Fundamentals | Learn essential DGCA subjects including navigation, meteorology, regulations, and air law. Build a strong foundation in aviation knowledge to prepare for licensing exams and pilot training. | Read More *(live → /ground-classes-for-dgca-exams/)* | `course-dgca-ground-classes.webp` |
| 2 | ATPL Theory Training | Advance Your Pilot Career | Gain in-depth knowledge in aerodynamics, flight planning, and systems. This training prepares you for the Airline Transport Pilot License exams, essential for commanding commercial aircraft. | Read More *(live → #)* | `course-atpl-theory.webp` |
| 3 | CPL Flight Training | Hands-On Flying Experience | Train with simulators and actual flight hours to develop aircraft handling, navigation, and safety skills. Essential for earning your Commercial Pilot License and starting your aviation career. | Read More *(#)* | `course-cpl-flight-training.webp` |
| 4 | Type Rating | Specialized Aircraft Training | Learn to operate specific aircraft with advanced simulator practice and cockpit procedures. Gain expertise in systems, performance, and emergencies to qualify for flying modern commercial jets. | Read More *(#)* | `course-type-rating.webp` |
| 5 | License Conversion | Smooth Certification Transition | Convert your foreign pilot license to DGCA certification. Cover mandatory exams, regulations, and flight checks for compliance with Indian aviation standards and career opportunities in India. | Read More *(#)* | `course-license-conversion.webp` |
| 6 | Mentorship Programme | Guided Aviation Success | Get one-on-one mentorship from senior pilots and instructors. Receive career advice, technical insights, and industry knowledge to grow as a confident and skilled aviation professional. | Read More *(#)* | `course-mentorship.webp` |

*Note: course cards on the live site have only "Read More" — no "Watch Demo Lectures" link.*

---

## 7. Upcoming Batches **[HIDDEN ON LIVE]**

Container `e189e27` / `f19c662` carries `elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile`.

- Heading (h3): Upcoming Batches
- Table columns: # · Program Name · Class Type · Batch Start Date · Batch Start Time · Demo Class · Enroll Now

| # | Program Name | Class Type | Batch Start Date | Batch Start Time | Demo Class | Enroll Now |
|---|---|---|---|---|---|---|
| #1 | DGCA Ground Classes - Navigation and Meteorology | Online/Offline | 15th April 2026. | 11:00:00 | Watch Demo *(live → scrolls to `#FacultySection`)* | Enroll |

*A commented-out demo button points to YouTube `zjSYG67adbY`.*

---

## 8. Why Choose SkyPro Aviation

- Heading (h2): Why Choose SkyPro Aviation ?
- Eyebrow (h6): Why Choose SkyPro Aviation?
- Paragraph 1: At SkyPro Aviation, we believe becoming a commercial pilot should be a clear, structured, and supportive journey,  not a maze of confusion, delays, and hidden costs. Our programs are designed and delivered by airline-experienced professionals who know exactly what it takes to succeed in the aviation industry.
- Paragraph 2: When you train with us, you gain more than just knowledge. You gain a partner committed to guiding you from your first classroom session to your first airline cockpit.
- Image: `why-choose-aircraft-wide.webp` (desktop) / `why-choose-aircraft.webp` (mobile)

| # | Point (h5) | Text |
|---|---|---|
| 1 | Airline-Experienced Mentors | Instructors with flying experience at leading carriers such as Qatar Airways, Air India, and IndiGo bring real-world cockpit expertise to your training. |
| 2 | Global Training Network | CPL training options in India and abroad through vetted, DGCA-compliant partner schools, with seamless licence conversion support. |
| 3 | Complete Pilot Pathway | DGCA ground classes, ATPL theory, flying training, licence conversion, type rating, and cadet pilot preparations, all under one roof. |
| 4 | Small Batches, Personalised Attention | Excellent student-to-instructor ratios ensure individual guidance, close progress tracking, and timely feedback. |
| 5 | Transparent Processes | Clear fee structures, realistic timelines, and honest advice at every stage. No hidden costs, discount gimmicks, or last-minute surprises. |
| 6 | Ongoing Career Support | Mentorship continues beyond training, with guidance for airline interviews, type ratings, and long-term career planning. |

*Live layout: horizontal expanding accordion with tinted aircraft backgrounds (`why-*.webp`, 1140×406).*

---

## 9. Our Flight Instructors & Faculty

Heading (h2): Our Flight Instructors & Faculty

### 9.1 Gp Capt. Arvind Thapliyal — `faculty-arvind-thapliyal.webp` · demo: YouTube `jhBCpukAaFg`

Gp Capt Arvind “Thaps” Thapliyal (Retd) is a veteran fighter pilot, flight and ground subjects instructor, and safety professional, with over four decades of experience in military and civil aviation.

His military career includes extensive operational and instructional flying experience on several piston and jet engine aircraft. He has been the CFI of a premier IAF training establishment and held important posts in the operational and aviation safety branches.

Post his military service, he was the DGCA-approved CGI and Safety Manager, and Tech General instructor at one of the best-known Indian FTOs for nearly seven years.

A post-graduate, qualified ADAPT assessor and an ATPL holder with a vast knowledge of aviation, Gp Capt Thapliyal also writes regularly on civil aviation safety and training issues in India.

Button: Watch Demo Lectures

### 9.2 Gp Capt. Narender Kumar Dahiya — `faculty-narender-kumar-dahiya.webp` · demo: YouTube `L7o4hkw6t0A`

Group Captain NK Dahiya is a Air Force veteran. He flew Mig 21 and Mig 29. Was a flight instructor. After 26 years of service, he switched to civil aviation in 2012. He was instructor for Indigo cadet program at NFTI and there after Captain on ATR aircraft.

He last flew with Indigo till Jan 2025. Now he enjoys flying his paraglider. He has climbed Everest twice and was leader of IAF Ladies expedition in 2011. He is a skier as well and has trained with Swiss Army for avalanche rescue.

Button: Watch Demo Lectures

### 9.3 Group Captain Punit Mehta — `faculty-punit-mehta.webp` · no demo link

Group Captain Punit Mehta is a veteran fighter pilot and qualified flight safety accident investigator, with over three decades of experience in military aviation. He has extensively flown the MiG-21, the MiG-27, and the Microlite aircraft.

He commanded two independent air bases, an independent air defence combat unit, and was chief instructor of the Air Force Institute of Nuclear, Biological and Chemical Warfare.

Post-military service he acquired his DGCA-approved drone pilot license.

A postgraduate, he is an enthusiastic traveller, bird watcher and photographer and is currently in the process of publishing his book of short stories titled "Birds Beyond Runways".

### 9.4 Sqn Ldr. Nivedita Choudhary — `faculty-nivedita-choudhary.webp` · no demo link

Sqn Ldr Nivedita Choudhary belongs to Jhunjhunu, Rajasthan. She was commissioned into the Indian Air Force in 2008. As a Navigator, she flew the HPT-32 (Trainer) and AN-32 aircraft during her active flying service.

She has been awarded by the Defence Minister of India, Shri A. K. Antony, and the Chief Minister of Rajasthan, Shri Ashok Gehlot, for her outstanding achievements and contribution in the field of adventure sports.

On 21 May 2011, she became the first woman from Rajasthan to climb Mount Everest (8,848 m). She is also the first woman officer of the Indian Air Force to summit Mount Everest.

### 9.5 Capt. Rishabh Golchha — `faculty-rishabh-golchha.webp` · demo: YouTube `2N9pTNhCPiY`

Capt Rishabh Golchha, an Airbus A320 type-rated pilot, has trained and mentored over 400 aspiring pilots, many of whom now fly as professionals. He teaches across all core aviation subjects with a strong focus on Navigation and Meteorology, simplifying complex concepts into practical, real-world knowledge.

Calm and composed in his approach, he prepares students not just to clear exams but to develop the professional mindset required for airline operations. With his blend of airline expertise and instructional skill, Capt Rishabh guides the next generation of aviators with clarity and confidence.

Button: Watch Demo Lectures

*Aircraft named in bios (usable as mono "aircraft tags", nothing added): Arvind — "several piston and jet engine aircraft" (no types named) · Dahiya — Mig 21, Mig 29, ATR · Mehta — MiG-21, MiG-27, Microlite · Choudhary — HPT-32, AN-32 · Golchha — Airbus A320.*

---

## 10. DGCA Requirements

- Eyebrow (h6): DGCA Requirements
- Heading (h2): DGCA Requirements to Become a Commercial Pilot in India
- Side image: `requirements-runway.webp` (runway centreline, portrait) · aircraft cut-out `requirements-aircraft-cutout.webp`

| # | Title | Text | Icon |
|---|---|---|---|
| 1 | Educational Qualification | Minimum 10+2 with Physics and Mathematics from a recognised board (or equivalent). | `icons/req-education.webp` |
| 2 | Age Requirement | Minimum 18 years old at the time of applying for the Commercial Pilot Licence (CPL). | `icons/req-age.webp` |
| 3 | Medical Fitness | Must hold a valid DGCA Class 1 Medical Certificate issued by an authorised medical examiner. | `icons/req-medical.webp` |
| 4 | DGCA Computer Number | Mandatory registration with DGCA and obtaining a Computer Number before attempting any DGCA theory exams. | `icons/req-computer-number.webp` |
| 5 | Ground School Training | Successful completion of DGCA-approved ground classes for CPL subjects. | `icons/req-ground-school.webp` |
| 6 | Flying Hours Requirement | A minimum of 200 total flying hours, which must include at least: | `icons/req-flying-hours.webp` |

Ground School subjects (chips): Air Navigation · Aviation Meteorology · Air Regulation · Technical General · Technical Specific · Radio Telephony (RTR-A)

Flying Hours list:
- 100 hours as Pilot-in-Command (PIC)
- 50 hours cross-country as PIC, with at least one solo cross-country flight covering 300 nm (555.6 km), with full-stop landings at two different aerodromes
- 10 hours instrument flight, with a minimum of 5 hours on an aircraft and the remainder on an approved simulator
- 5 hours of night flying as PIC, with at least 10 take-offs and full-stop landings
- Flight checks
  - 250 nm day cross country with examiner
  - 120 nm night cross-country with examiner
  - General flying test by day
  - General flying test at night
  - Instrument rating test

---

## 11. Step-by-Step Pathway

- Heading (h2): How to Become a Commercial Pilot in India - Step-by-Step Pathway
- Background: `pathway-bg.webp` (airliner on apron, grey overlay on live)

| Step | Title (h6) | Text |
|---|---|---|
| 1 | DGCA Class-2 Medical Examination | Obtain your DGCA Class-2 medical certificate from an authorised examiner to begin training. |
| 2 | Join Ground School & Clear DGCA Theory Exams | Start DGCA theory classes for CPL subjects: Air Navigation, Aviation Meteorology, Air Regulation, Technical General, Technical Specific, and RTR-A. Clear DGCA CPL theory exams. |
| 3 | DGCA Class-1 Medical Certification | Undergo DGCA Class-1 medical with an approved examiner before commencing flight training. |
| 4 | Flying Training (India or Abroad) | Complete a minimum of 200 flying hours, covering PIC, cross-country, instrument, and night flying requirements as per DGCA norms. |
| 5 | Licence Conversion (If Trained Abroad) | Fulfill DGCA conversion requirements and skill tests to convert your foreign CPL to an Indian CPL. |
| 6 | Type Rating & Career Placement | Complete an aircraft type rating to qualify for airline operations, followed by airline selection processes and assessments. |

---

## 12. Testimonials

- Heading (h2): Testimonials
- Format on live: carousel of **self-hosted MP4 video cards** (not YouTube) — portrait poster image, play button, 5 stars, name, course label. **No written quotes.**

| # | Name | Course label | Live video | Local video | Poster |
|---|---|---|---|---|---|
| 1 | Janvi Jain | License Conversion & Recency | `2025/11/Skypro-Review-Janvi-Jain.mp4` | `video/testimonials/janvi-jain.mp4` | `testimonials/janvi-jain.webp` |
| 2 | Kyran Barucha | License Conversion & Recency | `2025/12/Kyran-Barucha-Review.mp4` | `video/testimonials/kyran-barucha.mp4` | `testimonials/kyran-barucha.webp` |
| 3 | Niranjan Deepak Pawar | License Conversion & Recency | `2025/12/Niranjan-Deepak-Pawar-Testimonial-Review.mp4` | `video/testimonials/niranjan-deepak-pawar.mp4` | `testimonials/niranjan-deepak-pawar.webp` |
| 4 | Anvesh Lokhande | License Conversion & Recency | `2025/11/Sequence-08-2.mp4` | `video/testimonials/anvesh-lokhande.mp4` | `testimonials/anvesh-lokhande.webp` |
| 5 | Saksham Sharma | License Conversion & Recency | `2025/12/Saksham-Sharma-Revview.mp4` | `video/testimonials/saksham-sharma.mp4` | `testimonials/saksham-sharma.webp` |
| 6 | Sahaj Singh Dadhiala | License Conversion & Recency | `2025/10/Sahaj-Singh.mp4` | `video/testimonials/sahaj-singh-dadhiala.mp4` | `testimonials/sahaj-singh-dadhiala.webp` |
| 7 | Swarali Joshi | DGCA Ground Classes | `2025/09/Ogihjtryiotu.mp4` | `video/testimonials/swarali-joshi.mp4` | `testimonials/swarali-joshi.webp` |
| 8 | Jaspreet Singh | License Conversion & Recency | `2025/10/Jaspreet-Singh-2.mp4` | `video/testimonials/jaspreet-singh.mp4` | `testimonials/jaspreet-singh.webp` |
| 9 | Rahil | DGCA Ground Classes | `2025/10/Rahil-Testimonial-V2-2.mp4` | `video/testimonials/rahil.mp4` | `testimonials/rahil.webp` |
| 10 | Kancharla Yateesh Chandra | License Conversion & Recency | `2025/10/Kancharla-Yateesh-2.mp4` | `video/testimonials/kancharla-yateesh-chandra.mp4` | `testimonials/kancharla-yateesh-chandra.webp` |
| 11 | Tanay Lodha | License Conversion & Recency | `2025/12/Tanay-Review.mp4` | `video/testimonials/tanay-lodha.mp4` | `testimonials/tanay-lodha.webp` |
| 12 | Harpreet Kaur | DGCA Ground Classes | `2025/09/Whatsapp-Video-2025-09-12-At-15.28-2.mp4` | `video/testimonials/harpreet-kaur.mp4` | `testimonials/harpreet-kaur.webp` |
| 13 | Naman Gupta | DGCA Ground Classes | `2025/09/Mvi-4262-2.mp4` | `video/testimonials/naman-gupta.mp4` | `testimonials/naman-gupta.webp` |
| 14 | Puneet Kukkad | DGCA Ground Classes | `2025/09/Mvi-4259-4.mp4` | `video/testimonials/puneet-kukkad.mp4` | `testimonials/puneet-kukkad.webp` |
| 15 | Ishita Gohel | License Conversion & Recency | `2025/10/Ishita-Gohel-Testimonial-V2-1.mp4` | `video/testimonials/ishita-gohel.mp4` | `testimonials/ishita-gohel.webp` |

Counts: License Conversion & Recency = 10 · DGCA Ground Classes = 5.

**Excluded — [HIDDEN ON LIVE] placeholder block** (`fc79b4a`, Elementor placeholder images, template copy): "Priya Sharma / ATPL Theory Training", "Riya Kapoor / Type Rating", "Aditya Verma / License Conversion", "Neha Singh / Mentorship Programme" with one-line quotes. These are template dummies and must **not** be used.

---

## 13. Life at SkyPro Aviation Academy

- Heading (h2): Life at SkyPro Aviation Academy
- Live layout: 3-column masonry gallery on a navy striped background (`bg-life-navy.webp`), 19 images, lightbox.
- Images in live order → `life/life-01.webp` … `life/life-19.webp` (see §21 for alt text).

---

## 14. Enquiry form

- Heading (h3): Enquire Now
- Sub-heading (h4): Take Off Your Career in Aviation
- Anchor on live: `#Enquire`
- Live backend: Contact Form 7 (`wpcf7-f1597`) + Google reCAPTCHA.

| Field (label, verbatim) | Live `name` | Type | Placeholder | Required |
|---|---|---|---|---|
| Full Name* | `Name` | text | Enter your full name | yes |
| Mobile No.* | `Mobile` | tel | Enter your mobile no. | yes |
| Email Address* | `Email` | email | name@example.com | yes |
| Current Education Qualification* | `Qualification` | select | —Please choose an option— | yes |
| State* | `State` | select | —Please choose an option— | yes |
| City* | `City` | text | Your city | yes |
| Which of these are you interested in?* | `Interest[]` | **checkboxes (multi-select)** | — | yes |
| How soon do you plan to start?* | `Start` | radio | — | yes |
| Any specific question you’d like us to assist with? | `Questions` | textarea (max 2000) | Ask us anything about training, eligibility, fees, process… | no |
| I agree to receive communication from SkyPro Aviation via phone, email, or WhatsApp for updates and assistance related to my inquiry. | `Consent` | checkbox | — | yes (per brief) |

Submit button: **Submit Enquiry**

Options:

- **Current Education Qualification:** 10th · 12th Appearing · 12th Pass · Graduation
- **State (36):** Andaman & Nicobar Islands · Andhra Pradesh · Arunachal Pradesh · Assam · Bihar · Chandigarh · Chhattisgarh · Dadra & Nagar Haveli and Daman & Diu · Delhi (NCT) · Goa · Gujarat · Haryana · Himachal Pradesh · Jammu & Kashmir · Jharkhand · Karnataka · Kerala · Ladakh · Lakshadweep · Madhya Pradesh · Maharashtra · Manipur · Meghalaya · Mizoram · Nagaland · Odisha · Puducherry · Punjab · Rajasthan · Sikkim · Tamil Nadu · Telangana · Tripura · Uttar Pradesh · Uttarakhand · West Bengal
- **Interested in:** DGCA Ground Classes (CPL) · Flying Training · Conversion & Recency · Career Counselling
- **How soon:** Immediately (0-3 months) · Soon (3-6 months) · Later (6-12 months) · Just Exploring for Now

---

## 15. FAQ's

- Heading (h3): FAQ's
- Side image: `faq-aircraft.webp` (hand holding a model airliner at sunset)

1. **What are the admission prerequisites and requirements?**
   Applicants must be at least 17 years old, hold a valid Class 1 Medical Certificate, and have completed high school or equivalent. Basic English proficiency is essential for training and communication. Previous flight experience is not mandatory.
2. **What is a typical flight training day like?**
   Your day begins with a briefing, weather check, and flight planning. You’ll have both simulator or aircraft flying sessions and classroom theory lessons. Debriefing follows to review performance and progress.
3. **How should I prepare for my class date?**
   Add Your Review your pre-course materials and ensure your medical and documents are ready. Get familiar with basic aviation terminology. Arrive well-rested and ready to focus.Heading Text Here
4. **What is the uniform policy or dress code?**
   Students must wear the official SkyPro Aviation uniform during training hours. Uniforms include a white pilot shirt, black trousers, and epaulets. Proper grooming and polished shoes are required.
5. **Why is Total Immersion Flight Training best?**
   It allows students to fully focus on flying without long gaps between lessons. Consistent practice builds confidence and skill faster. The program is designed for rapid, high-quality learning.
6. **What is SkyPro Aviation’s attendance policy?**
   Students must maintain at least 90% attendance to remain in good standing. All absences should be pre-approved unless in emergencies. Missing classes may delay training progress.

---

## 16. Blogs

- Heading (h3): Blogs
- Sub-heading (h4): Insights & Guidance for Aspiring Aviators

| # | Title | Excerpt | Image | Live "Read More" |
|---|---|---|---|---|
| 1 | CPL Training in Argentina: Complete Guide for Indian Students | Argentina is quickly emerging as one of the best-kept secrets for Indian students pursuing a Commercial Pilot Licence (CPL). | `blogs/cpl-training-argentina-guide.webp` | /cpl-training-in-argentina/ |
| 2 | CPL Training in Argentina vs South Africa: Which is Better for Indian Students? | South Africa has long been one of the most popular destinations for Indian students pursuing a commercial pilot licence (CPL). | `blogs/cpl-argentina-vs-south-africa.webp` | /cpl-training-in-argentina-vs-south-africa/ |
| 3 | How to Become a Pilot in India After 12th | Becoming a commercial pilot in India is one of the most sought-after career paths among students who love aviation, travel, and the skies. But the journey is often misunderstood ... | `blogs/become-pilot-after-12th.webp` | /how-to-become-a-pilot-in-india/ |

Link label: Read More (with plane icon). Section link: Blogs → /blogs/. *Blog images have text baked in (title artwork).*

---

## 17. Counselling CTA

- Background: `bg-counselling-aircraft.webp` (jet above clouds)
- Heading (h2): Book Your 1-on-1 Pilot Career Counselling Session With SkyPro Aviation
- Paragraph: Choosing to become a pilot is a life-changing decision, and the proper guidance can make all the difference. At SkyPro Aviation, we offer a free, personalised counselling session where you can.
- Bullets:
  - Understand the complete pathway to a DGCA-approved Commercial Pilot Licence (CPL)
  - Get clarity on costs, timelines, and training options in India and abroad
  - Learn about medical requirements
  - Explore career opportunities and the airline selection process
- Highlight line: Limited Slots Available. Reserve Yours Today!
- Bar: "Unlock Your Pilot Path" (h6) · "Call Us:-" +91-8955804726 · button **Enquire Now**

---

## 18. Footer

**Contact Us**
- +91-8955804726 *(live href `tel:8955804726` — rebuild uses `tel:+918955804726` only if tel links are approved; see PRD)*
- info@skyproaviation.org
- 69, Ganesham Complex, Devi Nagar, New Sanganer Road, Jaipur, Rajasthan, 302019
- www.skyproaviation.org
- Instagram (`https://www.instagram.com/skyproaviation_/`) · Youtube (`https://youtube.com/@skypro-aviation`)

**Quick Links:** Home · Blogs · About Us · Contact Us · Disclaimer · Privacy Policy · Terms Of Use · Cookie Policy

**Our Courses:** DGCA Ground Classes · ATPL Theory Training · Flight Training · Type Rating · License Conversion · Mentorship Programme

**4th column:** Google Maps embed (SkyPro Aviation, 26.8857 N, 75.7636 E).

**Bottom bar:** Created By BeBeyond *(live → https://bebeyond.digital/)* · Copyright © 2026 SkyPro Aviation

---

## 19. Canonical contact details (use these everywhere)

- Phone: **+91-8955804726**
- Email: **info@skyproaviation.org**
- Address: **69, Ganesham Complex, Devi Nagar, New Sanganer Road, Jaipur, Rajasthan 302019**
- WhatsApp (brief): `https://wa.me/918955804726`
- Instagram: https://www.instagram.com/skyproaviation_/ · YouTube: https://youtube.com/@skypro-aviation

## 20. Facts allowed in the hero stat strip (per brief, each traceable to live copy)

| Stat | Source on live page |
|---|---|
| 4 Decades+ — Instructor Experience | Faculty §9.1: "with over four decades of experience in military and civil aviation" |
| 400+ — Pilots Mentored | Faculty §9.5: "has trained and mentored over 400 aspiring pilots" |
| 200 Hrs — CPL Flying Requirement | Requirements §10: "A minimum of 200 total flying hours" |
| 6 — Programs Under One Roof | Courses §6: six programmes |

---

## 21. Media manifest (downloaded → `public/media/`)

All images converted to WebP with sharp (photos q80, graphics q90 + alpha, max width 1920 px). No source image on the live site has alt text, so the alt text below is newly written to describe each image. `""` = decorative.

### Brand
| Local file | Source (`/wp-content/uploads/…`) | Size | Alt |
|---|---|---|---|
| `brand/logo-skypro.webp` | 2025/08/Untitled-design-2025-09-04T155549.217-Photoroom.png | 151×56 | SkyPro Aviation |
| `brand/logo-skypro-white.webp` | derived (navy → white, amber kept) | 151×56 | SkyPro Aviation |
| `brand/site-icon.webp`, `brand/site-icon-{512,180,32}.png` | 2025/09/cropped-Untitled-design-2025-09-16T154002.319.png | 512² | — |
| `brand/heading-swoosh.svg` | 2025/09/Untitled-design-21.svg | 40×42 | "" |

### Video (compressed with ffmpeg 6.1.1)
| Local file | Source | Spec |
|---|---|---|
| `video/hero-video-1080.mp4` | 2025/09/Video-V4-1.mp4 | 1920×1080 H.264 CRF26 ≤1 Mbps + AAC 96k, faststart (7.2 MB) |
| `video/hero-video-720.mp4` | same | 1280×720 H.264 ≤650 kbps + AAC 96k (4.5 MB) |
| `video/hero-video-1080.webm` | same | 1920×1080 VP9 ~780 kbps + Opus 80k (7.4 MB) |
| `video/hero-poster.webp` | frame @ 2.0 s | 1920×1080 (SkyPro logo frame) |
| `video/hero-video-mobile-720.mp4` | 2025/09/Reel-V4.mp4 | 720×1280 H.264 ≤700 kbps + AAC 96k (4.7 MB) |
| `video/hero-video-mobile-720.webm` | same | 720×1280 VP9 ~480 kbps + Opus 80k (5.4 MB) |
| `video/hero-poster-mobile.webp` | frame @ 2.5 s | 720×1280 (SkyPro logo frame) |
| `video/testimonials/<slug>.mp4` ×15 | see §12 | 9:16 content centre-cropped from pillarboxed 1920×1080 → 540×960 H.264 CRF28 + AAC 96k |

### Sections
| Local file | Source | Size | Alt |
|---|---|---|---|
| `about-academy-lounge.webp` | 2026/09/7.webp | 1200×800 | SkyPro Aviation reception lounge with a wooden aircraft wall sculpture |
| `bg-courses-sky.webp` | 2025/09/1440720-10-1.png | 1440×720 | "" |
| `course-dgca-ground-classes.webp` | 2025/09/Website-Banners-5.png | 681×381 | Instructor teaching a DGCA ground class on a digital board |
| `course-atpl-theory.webp` | 2025/09/Website-Banners-7.png | 681×381 | Two pilots at the controls in an airliner cockpit |
| `course-cpl-flight-training.webp` | 2025/09/Website-Banners-6.png | 681×381 | SkyPro-branded twin-engine training aircraft in flight |
| `course-type-rating.webp` | 2025/09/Website-Banners-9.png | 681×381 | Two SkyPro-liveried commercial jets parked nose to nose |
| `course-license-conversion.webp` | 2025/09/Website-Banners-8.png | 681×381 | Pilot in uniform beside a training aircraft with the Indian flag |
| `course-mentorship.webp` | 2025/09/Website-Banners-10.png | 681×381 | Senior pilot mentoring student pilots at a desk |
| `why-choose-aircraft-wide.webp` | 2025/09/Untitled-design-2025-09-06T153806.194-1.png | 1375×453 | Commercial airliner climbing after take-off |
| `why-choose-aircraft.webp` | 2025/08/Untitled-550-x-450-px-3-e1756877428461.png | 550×360 | Commercial airliner climbing after take-off |
| `why-airline-mentors.webp` … `why-career-support.webp` (6) | 2025/08/{1-1,6-2,3-2,4-2,2-2,5-2}.png | 1140×406 | "" (tinted backgrounds) |
| `faculty-arvind-thapliyal.webp` | 2026/02/Skypro-Faculty-3.webp | 625×625 | Gp Capt. Arvind Thapliyal (Retd) in SkyPro uniform |
| `faculty-narender-kumar-dahiya.webp` | 2026/02/Skypro-Faculty-5.webp | 625×625 | Gp Capt. Narender Kumar Dahiya in SkyPro uniform |
| `faculty-punit-mehta.webp` | 2026/06/punit-mehta.webp | 625×625 | Group Captain Punit Mehta |
| `faculty-nivedita-choudhary.webp` | 2026/02/Skypro-Faculty-4.webp | 625×625 | Sqn Ldr. Nivedita Choudhary in SkyPro uniform |
| `faculty-rishabh-golchha.webp` | 2026/02/Skypro-Faculty-6.webp | 625×625 | Capt. Rishabh Golchha in SkyPro uniform |
| `requirements-runway.webp` | 2025/09/WhatsApp-Image-2025-09-05-at-12.19.31-PM-1.jpeg | 1024×1536 | "" (runway centreline) |
| `requirements-aircraft-cutout.webp` | 2025/09/Firefly_20250901125239-removebg-preview.png | 736×339 | "" |
| `icons/req-*.webp` (6) | 2025/08/Icons-80-x-82-px-{9,11,12,13,14,15}.png | 250×256 | "" |
| `pathway-bg.webp` | 2025/09/WhatsApp-Image-2025-09-05-at-12.18.28-PM.jpeg | 1600×772 | "" |
| `testimonials/<slug>.webp` (15) | see §12 | 797×1438 (3 are 255×460) | `<Name>, <course label> — video testimonial` |
| `bg-life-navy.webp` | 2025/09/1440720-18-1.png | 1440×720 | "" |
| `faq-aircraft.webp` | 2025/09/Untitled-design-2025-09-05T122008.038.png | 550×450 | Hand holding a model airliner against a sunset sky |
| `blogs/*.webp` (3) | 2026/09/2.webp · 2026/09/1.webp · 2026/05/how-to-become-pilot.webp | 889×593 / 1536×1024 | blog title |
| `bg-counselling-aircraft.webp` | 2025/09/1440720-29.webp | 1440×720 | "" |

### Life at SkyPro gallery
| Local file | Source | Size | Alt |
|---|---|---|---|
| `life/life-01.webp` | 2026/02/Sequence-01.00_00_03_20.Still006-e1772105403195.webp | 1080×910 | SkyPro students and instructors on a hilltop at sunrise near Jaipur |
| `life/life-02.webp` | 2026/02/DSC_7770-scaled.webp | 1920×1280 | SkyPro faculty in uniform in front of a backlit SkyPro display |
| `life/life-03.webp` | 2025/09/IMG_4320_1_11zon-scaled.jpg | 1600×2400 | Instructor writing on a digital board during a ground class |
| `life/life-04.webp` | 2026/02/Sequence-01.00_00_04_14.Still007-e1772105186910.webp | 1080×864 | SkyPro students on a hilltop overlooking Jaipur |
| `life/life-05.webp` | 2026/02/Sequence-01.00_00_05_28.Still008-e1772105204438.webp | 1080×822 | SkyPro students and instructors on a hilltop at sunrise |
| `life/life-06.webp` | 2025/09/IMG_4290_5_11zon-scaled.jpg | 1600×1067 | Student pilot beside the aircraft wall sculpture at SkyPro |
| `life/life-07.webp` | 2026/02/Sequence-01.00_00_01_16.Still005-e1772105122429.webp | 1080×1018 | SkyPro students on a hilltop above a lake in Jaipur |
| `life/life-08.webp` | 2026/09/1-1.webp | 1200×800 | SkyPro meeting room with a conference table and display screen |
| `life/life-09.webp` | 2026/09/2-1.webp | 1200×800 | Neon SkyPro Aviation logo sign on a marble wall |
| `life/life-10.webp` | 2026/09/3.webp | 1200×800 | SkyPro cadets in uniform in front of a SkyPro backdrop |
| `life/life-11.webp` | 2026/09/4.webp | 1200×800 | Aircraft wall sculpture and faculty standee at the SkyPro reception |
| `life/life-12.webp` | 2026/09/5.webp | 1200×800 | SkyPro faculty in uniform in front of the SkyPro backdrop |
| `life/life-13.webp` | 2026/09/6.webp | 1200×800 | Wall of certificates and framed photographs at SkyPro |
| `life/life-14.webp` | 2026/09/7.webp | 1200×800 | SkyPro reception lounge with aircraft wall sculpture |
| `life/life-15.webp` | 2026/09/8.webp | 1200×800 | Propeller wall decor and reception desk at SkyPro |
| `life/life-16.webp` | 2026/09/9.webp | 1200×800 | SkyPro faculty and students group photo |
| `life/life-17.webp` | 2026/09/10.webp | 1200×800 | Dual monitors showing the SkyPro logo at a simulator station |
| `life/life-18.webp` | 2026/09/11.webp | 1200×800 | Airliner cockpit panel poster for procedures training |
| `life/life-19.webp` | 2026/09/12.webp | 1200×800 | Flight simulator joystick and throttle on a desk |

*Not downloaded (not real homepage content):* Elementor placeholder.png, Google Maps tiles, reCAPTCHA logo, the 6 mobile-only accordion variants `2025/09/{1..6}-1.png` (duplicates of the desktop why-* backgrounds).

---

## 22. Anomalies found on the live page (carried into PRD → Open Questions)

1. FAQ #1 says minimum age **17**; Requirements card says **18**.
2. FAQ #1 says "Class 1 Medical" for admission; Pathway says Class-2 first, Class-1 before flight training.
3. FAQ #3 answer contains editor leftovers: "**Add Your** Review your…" and "…ready to focus.**Heading Text Here**".
4. Upcoming Batches block is hidden on every device; its only batch date (15 April 2026) is already in the past (today: 16 Oct 2026). Time shows "11:00:00".
5. Testimonials are self-hosted MP4s, not YouTube; only faculty demo lectures use YouTube.
6. Course cards have "Read More" only (no "Watch Demo Lectures").
7. Logo source is only 151×56 px; no SVG/high-res version is public (`/2025/08/logo.png` referenced in live JSON-LD returns 404).
8. Live JSON-LD course descriptions mention "ICAO-level air law" and "USA" — on the brief's banned list; not reused.
9. Counselling paragraph ends "…where you can." (reads as if a colon was intended before the bullets).
10. Why Choose heading has a stray space: "Why Choose SkyPro Aviation ?"; Why Choose paragraph has a double space.
11. "400+" is Capt. Rishabh Golchha's personal figure in his bio, not an academy-wide figure.
12. `life-14` is the same photo as the About image; `life-01` and `life-05` are near-duplicates.
13. Footer phone link on live is `tel:8955804726` (no country code).
