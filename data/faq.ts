import type { Faq } from "./types";

/**
 * FAQs, verbatim from the live homepage.
 * #3: CMS leftovers "Add Your " / "Heading Text Here" removed (PRD OQ-7, approved default).
 * #1: the age (17) differs from the Requirements card (18) — kept verbatim pending client confirmation (OQ-6).
 */
export const faqs: Faq[] = [
  {
    id: "admission-prerequisites",
    question: "What are the admission prerequisites and requirements?",
    answer:
      "Applicants must be at least 17 years old, hold a valid Class 1 Medical Certificate, and have completed high school or equivalent. Basic English proficiency is essential for training and communication. Previous flight experience is not mandatory.",
  },
  {
    id: "training-day",
    question: "What is a typical flight training day like?",
    answer:
      "Your day begins with a briefing, weather check, and flight planning. You’ll have both simulator or aircraft flying sessions and classroom theory lessons. Debriefing follows to review performance and progress.",
  },
  {
    id: "prepare-class-date",
    question: "How should I prepare for my class date?",
    answer:
      "Review your pre-course materials and ensure your medical and documents are ready. Get familiar with basic aviation terminology. Arrive well-rested and ready to focus.",
  },
  {
    id: "uniform-policy",
    question: "What is the uniform policy or dress code?",
    answer:
      "Students must wear the official SkyPro Aviation uniform during training hours. Uniforms include a white pilot shirt, black trousers, and epaulets. Proper grooming and polished shoes are required.",
  },
  {
    id: "total-immersion",
    question: "Why is Total Immersion Flight Training best?",
    answer:
      "It allows students to fully focus on flying without long gaps between lessons. Consistent practice builds confidence and skill faster. The program is designed for rapid, high-quality learning.",
  },
  {
    id: "attendance-policy",
    question: "What is SkyPro Aviation’s attendance policy?",
    answer:
      "Students must maintain at least 90% attendance to remain in good standing. All absences should be pre-approved unless in emergencies. Missing classes may delay training progress.",
  },
];
