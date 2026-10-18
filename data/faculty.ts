import type { DemoLecture, FacultyMember } from "./types";

const portrait = (slug: string, alt: string) => ({
  src: `/media/faculty-${slug}.webp`,
  width: 625,
  height: 625,
  alt,
});

export const faculty: FacultyMember[] = [
  {
    id: "arvind-thapliyal",
    name: "Gp Capt. Arvind Thapliyal",
    role: "Veteran fighter pilot, flight and ground subjects instructor",
    tags: ["CFI", "CGI", "ATPL"],
    experience: "over four decades of experience in military and civil aviation",
    achievement: "He has been the CFI of a premier IAF training establishment",
    image: portrait("arvind-thapliyal", "Gp Capt. Arvind Thapliyal (Retd) in SkyPro uniform"),
    demoVideoId: "jhBCpukAaFg",
    bio: [
      "Gp Capt Arvind “Thaps” Thapliyal (Retd) is a veteran fighter pilot, flight and ground subjects instructor, and safety professional, with over four decades of experience in military and civil aviation.",
      "His military career includes extensive operational and instructional flying experience on several piston and jet engine aircraft. He has been the CFI of a premier IAF training establishment and held important posts in the operational and aviation safety branches.",
      "Post his military service, he was the DGCA-approved CGI and Safety Manager, and Tech General instructor at one of the best-known Indian FTOs for nearly seven years.",
      "A post-graduate, qualified ADAPT assessor and an ATPL holder with a vast knowledge of aviation, Gp Capt Thapliyal also writes regularly on civil aviation safety and training issues in India.",
    ],
  },
  {
    id: "narender-kumar-dahiya",
    name: "Gp Capt. Narender Kumar Dahiya",
    role: "Air Force veteran",
    tags: ["Mig 21", "Mig 29", "ATR"],
    experience: "26 years of service",
    achievement: "He has climbed Everest twice",
    image: portrait("narender-kumar-dahiya", "Gp Capt. Narender Kumar Dahiya in SkyPro uniform"),
    demoVideoId: "L7o4hkw6t0A",
    bio: [
      "Group Captain NK Dahiya is a Air Force veteran. He flew Mig 21 and Mig 29. Was a flight instructor. After 26 years of service, he switched to civil aviation in 2012. He was instructor for Indigo cadet program at NFTI and there after Captain on ATR aircraft.",
      "He last flew with Indigo till Jan 2025. Now he enjoys flying his paraglider. He has climbed Everest twice and was leader of IAF Ladies expedition in 2011. He is a skier as well and has trained with Swiss Army for avalanche rescue.",
    ],
  },
  {
    id: "punit-mehta",
    name: "Group Captain Punit Mehta",
    role: "Veteran fighter pilot and qualified flight safety accident investigator",
    tags: ["MiG-21", "MiG-27", "Microlite"],
    experience: "over three decades of experience in military aviation",
    achievement: "He commanded two independent air bases",
    image: portrait("punit-mehta", "Group Captain Punit Mehta"),
    bio: [
      "Group Captain Punit Mehta is a veteran fighter pilot and qualified flight safety accident investigator, with over three decades of experience in military aviation. He has extensively flown the MiG-21, the MiG-27, and the Microlite aircraft.",
      "He commanded two independent air bases, an independent air defence combat unit, and was chief instructor of the Air Force Institute of Nuclear, Biological and Chemical Warfare.",
      "Post-military service he acquired his DGCA-approved drone pilot license.",
      "A postgraduate, he is an enthusiastic traveller, bird watcher and photographer and is currently in the process of publishing his book of short stories titled \"Birds Beyond Runways\".",
    ],
  },
  {
    id: "nivedita-choudhary",
    name: "Sqn Ldr. Nivedita Choudhary",
    role: "Navigator, Indian Air Force",
    tags: ["HPT-32", "AN-32"],
    experience: "commissioned into the Indian Air Force in 2008",
    achievement: "the first woman officer of the Indian Air Force to summit Mount Everest",
    image: portrait("nivedita-choudhary", "Sqn Ldr. Nivedita Choudhary in SkyPro uniform"),
    bio: [
      "Sqn Ldr Nivedita Choudhary belongs to Jhunjhunu, Rajasthan. She was commissioned into the Indian Air Force in 2008. As a Navigator, she flew the HPT-32 (Trainer) and AN-32 aircraft during her active flying service.",
      "She has been awarded by the Defence Minister of India, Shri A. K. Antony, and the Chief Minister of Rajasthan, Shri Ashok Gehlot, for her outstanding achievements and contribution in the field of adventure sports.",
      "On 21 May 2011, she became the first woman from Rajasthan to climb Mount Everest (8,848 m). She is also the first woman officer of the Indian Air Force to summit Mount Everest.",
    ],
  },
  {
    id: "rishabh-golchha",
    name: "Capt. Rishabh Golchha",
    role: "Airbus A320 type-rated pilot",
    tags: ["Airbus A320"],
    achievement: "has trained and mentored over 400 aspiring pilots",
    image: portrait("rishabh-golchha", "Capt. Rishabh Golchha in SkyPro uniform"),
    demoVideoId: "2N9pTNhCPiY",
    bio: [
      "Capt Rishabh Golchha, an Airbus A320 type-rated pilot, has trained and mentored over 400 aspiring pilots, many of whom now fly as professionals. He teaches across all core aviation subjects with a strong focus on Navigation and Meteorology, simplifying complex concepts into practical, real-world knowledge.",
      "Calm and composed in his approach, he prepares students not just to clear exams but to develop the professional mindset required for airline operations. With his blend of airline expertise and instructional skill, Capt Rishabh guides the next generation of aviators with clarity and confidence.",
    ],
  },
];

/** "Watch Demo Lectures" — the faculty demo videos linked on the live homepage. */
export const demoLectures: DemoLecture[] = faculty
  .filter((f): f is FacultyMember & { demoVideoId: string } => Boolean(f.demoVideoId))
  .map((f) => ({ id: `demo-${f.id}`, facultyId: f.id, title: f.name, youtubeId: f.demoVideoId }));
