import type { Course } from "./types";

const readMore = { label: "Read More", href: "#" } as const;

export const courses: Course[] = [
  {
    id: "dgca-ground-classes",
    title: "DGCA Ground Classes",
    subheading: "Master Aviation Fundamentals",
    description:
      "Learn essential DGCA subjects including navigation, meteorology, regulations, and air law. Build a strong foundation in aviation knowledge to prepare for licensing exams and pilot training.",
    image: {
      src: "/media/course-dgca-ground-classes.webp",
      width: 681,
      height: 381,
      alt: "Instructor teaching a DGCA ground class on a digital board",
    },
    readMore,
  },
  {
    id: "atpl-theory-training",
    title: "ATPL Theory Training",
    subheading: "Advance Your Pilot Career",
    description:
      "Gain in-depth knowledge in aerodynamics, flight planning, and systems. This training prepares you for the Airline Transport Pilot License exams, essential for commanding commercial aircraft.",
    image: {
      src: "/media/course-atpl-theory.webp",
      width: 681,
      height: 381,
      alt: "Two pilots at the controls in an airliner cockpit",
    },
    readMore,
  },
  {
    id: "cpl-flight-training",
    title: "CPL Flight Training",
    subheading: "Hands-On Flying Experience",
    description:
      "Train with simulators and actual flight hours to develop aircraft handling, navigation, and safety skills. Essential for earning your Commercial Pilot License and starting your aviation career.",
    image: {
      src: "/media/course-cpl-flight-training.webp",
      width: 681,
      height: 381,
      alt: "SkyPro-branded twin-engine training aircraft in flight",
    },
    readMore,
  },
  {
    id: "type-rating",
    title: "Type Rating",
    subheading: "Specialized Aircraft Training",
    description:
      "Learn to operate specific aircraft with advanced simulator practice and cockpit procedures. Gain expertise in systems, performance, and emergencies to qualify for flying modern commercial jets.",
    image: {
      src: "/media/course-type-rating.webp",
      width: 681,
      height: 381,
      alt: "Two SkyPro-liveried commercial jets parked nose to nose",
    },
    readMore,
  },
  {
    id: "license-conversion",
    title: "License Conversion",
    subheading: "Smooth Certification Transition",
    description:
      "Convert your foreign pilot license to DGCA certification. Cover mandatory exams, regulations, and flight checks for compliance with Indian aviation standards and career opportunities in India.",
    image: {
      src: "/media/course-license-conversion.webp",
      width: 681,
      height: 381,
      alt: "Pilot in uniform beside a training aircraft with the Indian flag",
    },
    readMore,
  },
  {
    id: "mentorship-programme",
    title: "Mentorship Programme",
    subheading: "Guided Aviation Success",
    description:
      "Get one-on-one mentorship from senior pilots and instructors. Receive career advice, technical insights, and industry knowledge to grow as a confident and skilled aviation professional.",
    image: {
      src: "/media/course-mentorship.webp",
      width: 681,
      height: 381,
      alt: "Senior pilot mentoring student pilots at a desk",
    },
    readMore,
  },
];
