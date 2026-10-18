import type { Requirement } from "./types";

export const requirements: Requirement[] = [
  {
    id: "education",
    number: 1,
    title: "Educational Qualification",
    text: "Minimum 10+2 with Physics and Mathematics from a recognised board (or equivalent).",
  },
  {
    id: "age",
    number: 2,
    title: "Age Requirement",
    text: "Minimum 18 years old at the time of applying for the Commercial Pilot Licence (CPL).",
  },
  {
    id: "medical",
    number: 3,
    title: "Medical Fitness",
    text: "Must hold a valid DGCA Class 1 Medical Certificate issued by an authorised medical examiner.",
  },
  {
    id: "computer-number",
    number: 4,
    title: "DGCA Computer Number",
    text: "Mandatory registration with DGCA and obtaining a Computer Number before attempting any DGCA theory exams.",
  },
  {
    id: "ground-school",
    number: 5,
    title: "Ground School Training",
    text: "Successful completion of DGCA-approved ground classes for CPL subjects.",
    subjects: [
      "Air Navigation",
      "Aviation Meteorology",
      "Air Regulation",
      "Technical General",
      "Technical Specific",
      "Radio Telephony (RTR-A)",
    ],
  },
  {
    id: "flying-hours",
    number: 6,
    title: "Flying Hours Requirement",
    text: "A minimum of 200 total flying hours, which must include at least:",
    highlight: true,
    hours: [
      { code: "PIC", hours: 100, text: "100 hours as Pilot-in-Command (PIC)" },
      {
        code: "XC",
        hours: 50,
        text: "50 hours cross-country as PIC, with at least one solo cross-country flight covering 300 nm (555.6 km), with full-stop landings at two different aerodromes",
      },
      {
        code: "IF",
        hours: 10,
        text: "10 hours instrument flight, with a minimum of 5 hours on an aircraft and the remainder on an approved simulator",
      },
      { code: "NIGHT", hours: 5, text: "5 hours of night flying as PIC, with at least 10 take-offs and full-stop landings" },
    ],
    flightChecks: {
      title: "Flight checks",
      items: [
        "250 nm day cross country with examiner",
        "120 nm night cross-country with examiner",
        "General flying test by day",
        "General flying test at night",
        "Instrument rating test",
      ],
    },
  },
];

export const TOTAL_FLYING_HOURS = 200;
