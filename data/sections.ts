import type { SectionHeading } from "./types";

/**
 * Section headings, verbatim from the live homepage. `eyebrow` is the small label above the
 * title, used only where the live page pairs two headings (h3 + h4) or splits the H1.
 */
export const headings = {
  heroIntro: { eyebrow: "Welcome to SkyPro Aviation", title: "Your One-Stop Aviation Academy for Pilot Training in India" },
  courses: { title: "Our Courses" },
  batches: { title: "Upcoming Batches" },
  whyChoose: { title: "Why Choose SkyPro Aviation?" },
  faculty: { title: "Our Flight Instructors & Faculty" },
  requirements: { title: "DGCA Requirements to Become a Commercial Pilot in India" },
  pathway: { title: "How to Become a Commercial Pilot in India" },
  testimonials: { title: "Testimonials" },
  life: { title: "Life at SkyPro Aviation Academy" },
  enquiry: { eyebrow: "Enquire Now", title: "Take Off Your Career in Aviation" },
  faq: { title: "FAQ's" },
  blogs: { eyebrow: "Blogs", title: "Insights & Guidance for Aspiring Aviators" },
} satisfies Record<string, SectionHeading>;

export const about = {
  /** Visually hidden H2 for the Highlights strip. */
  srHeading: "About Us",
  paragraphs: [
    "SkyPro Aviation is one of India’s leading pilot training academies, guided by airline-experienced instructors from top carriers. We offer a complete pathway from DGCA ground classes to flying training, licence conversion, and type rating assistance, all under one roof.",
    "Our mission is to make pilot training affordable, high-quality, and fully guided, enabling aspiring pilots to focus on developing the skills and confidence necessary for a successful aviation career.",
  ],
};

export const coursesIntro =
  "Comprehensive pilot training programs from ground classes to advanced ratings, designed to meet DGCA standards and boost aviation careers.";

export const whyChooseIntro = [
  "At SkyPro Aviation, we believe becoming a commercial pilot should be a clear, structured, and supportive journey, not a maze of confusion, delays, and hidden costs. Our programs are designed and delivered by airline-experienced professionals who know exactly what it takes to succeed in the aviation industry.",
  "When you train with us, you gain more than just knowledge. You gain a partner committed to guiding you from your first classroom session to your first airline cockpit.",
];

export const counselling = {
  title: "Book Your 1-on-1 Pilot Career Counselling Session With SkyPro Aviation",
  paragraph:
    "Choosing to become a pilot is a life-changing decision, and the proper guidance can make all the difference. At SkyPro Aviation, we offer a free, personalised counselling session where you can.",
  bullets: [
    "Understand the complete pathway to a DGCA-approved Commercial Pilot Licence (CPL)",
    "Get clarity on costs, timelines, and training options in India and abroad",
    "Learn about medical requirements",
    "Explore career opportunities and the airline selection process",
  ],
  highlight: "Limited Slots Available. Reserve Yours Today!",
  cta: "Book Free Counselling",
};

export const labels = {
  enquire: "Enquire",
  enquireNow: "Enquire Now",
  enrollNow: "Enroll Now",
  watchDemo: "Watch Demo",
  watchDemoLectures: "Watch Demo Lectures",
  readMore: "Read More",
  scroll: "Scroll",
  call: "Call",
};
