/** Every link renders with href="#" for now; real routes can be swapped in later. */
export type Href = "#";

/** alt "" = decorative image. */
export interface MediaImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface MediaVideo {
  src: string;
  type: "video/mp4" | "video/webm";
  width: number;
  height: number;
}

export interface NavItem {
  label: string;
  href: Href;
  children?: NavItem[];
}

export interface Social {
  label: "Instagram" | "YouTube";
  /** Real profile URL, kept for later / JSON-LD. Links render non-navigating. */
  url: string;
  href: Href;
}

export interface Stat {
  /** Number to count up to; null = text reveal (e.g. "4 Decades+"). */
  value: number | null;
  display: string;
  unit?: string;
  label: string;
}

export interface Highlight {
  id: string;
  title: string;
  text: string;
}

export interface Course {
  id: string;
  title: string;
  subheading: string;
  description: string;
  image: MediaImage;
  readMore: { label: "Read More"; href: Href };
}

export interface Batch {
  id: string;
  number: number;
  program: string;
  classType: string;
  startDateISO: string;
  startDateLabel: string;
  startTimeLabel: string;
  visible: boolean;
}

export interface WhyPoint {
  id: string;
  title: string;
  text: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  /** Short fragment in the bio's own words. */
  role: string;
  bio: string[];
  /** Aircraft / credentials named in the bio. */
  tags: string[];
  /** Verbatim fragments of the bio, shown as short facts. */
  experience?: string;
  achievement?: string;
  image: MediaImage;
  demoVideoId?: string;
}

export interface FlyingHours {
  code: "PIC" | "XC" | "IF" | "NIGHT";
  hours: number;
  text: string;
}

export interface Requirement {
  id: string;
  number: number;
  title: string;
  text: string;
  highlight?: boolean;
  subjects?: string[];
  hours?: FlyingHours[];
  flightChecks?: { title: string; items: string[] };
}

export interface PathwayStep {
  step: number;
  title: string;
  text: string;
}

export type TestimonialCourse = "License Conversion & Recency" | "DGCA Ground Classes";

export interface Testimonial {
  id: string;
  name: string;
  course: TestimonialCourse;
  poster: MediaImage;
  /** Larger poster for the featured player when the original poster is low-res. */
  featuredPoster?: MediaImage;
  video: MediaVideo;
  durationSec: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  image: MediaImage;
  href: Href;
}

export interface DemoLecture {
  id: string;
  facultyId: string;
  title: string;
  youtubeId: string;
}

export interface SectionHeading {
  /** Small label above the title (only where the live page has one). */
  eyebrow?: string;
  title: string;
}
