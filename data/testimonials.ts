import type { Testimonial, TestimonialCourse } from "./types";

type Row = [slug: string, name: string, course: TestimonialCourse, durationSec: number, posterSize: "large" | "small"];

/** Order as on the live homepage carousel. Self-hosted 9:16 MP4s (see PRD OQ-1). */
const rows: Row[] = [
  ["janvi-jain", "Janvi Jain", "License Conversion & Recency", 46, "large"],
  ["kyran-barucha", "Kyran Barucha", "License Conversion & Recency", 49, "large"],
  ["niranjan-deepak-pawar", "Niranjan Deepak Pawar", "License Conversion & Recency", 30, "large"],
  ["anvesh-lokhande", "Anvesh Lokhande", "License Conversion & Recency", 61, "large"],
  ["saksham-sharma", "Saksham Sharma", "License Conversion & Recency", 72, "large"],
  ["sahaj-singh-dadhiala", "Sahaj Singh Dadhiala", "License Conversion & Recency", 44, "large"],
  ["swarali-joshi", "Swarali Joshi", "DGCA Ground Classes", 63, "small"],
  ["jaspreet-singh", "Jaspreet Singh", "License Conversion & Recency", 25, "large"],
  ["rahil", "Rahil", "DGCA Ground Classes", 37, "large"],
  ["kancharla-yateesh-chandra", "Kancharla Yateesh Chandra", "License Conversion & Recency", 120, "large"],
  ["tanay-lodha", "Tanay Lodha", "License Conversion & Recency", 44, "large"],
  ["harpreet-kaur", "Harpreet Kaur", "DGCA Ground Classes", 47, "small"],
  ["naman-gupta", "Naman Gupta", "DGCA Ground Classes", 23, "small"],
  ["puneet-kukkad", "Puneet Kukkad", "DGCA Ground Classes", 55, "small"],
  ["ishita-gohel", "Ishita Gohel", "License Conversion & Recency", 72, "large"],
];

export const testimonials: Testimonial[] = rows.map(([slug, name, course, durationSec, posterSize]) => {
  const alt = `${name}, ${course} — video testimonial`;
  const poster =
    posterSize === "large"
      ? { src: `/media/testimonials/${slug}.webp`, width: 797, height: 1438, alt }
      : { src: `/media/testimonials/${slug}.webp`, width: 255, height: 460, alt };
  return {
    id: slug,
    name,
    course,
    durationSec,
    poster,
    featuredPoster:
      posterSize === "small"
        ? { src: `/media/testimonials/${slug}-frame.webp`, width: 540, height: 960, alt }
        : undefined,
    video: { src: `/media/video/testimonials/${slug}.mp4`, type: "video/mp4", width: 540, height: 960 },
  };
});

export const testimonialFilters: { id: "all" | TestimonialCourse; label: string }[] = [
  { id: "all", label: "All" },
  { id: "License Conversion & Recency", label: "License Conversion & Recency" },
  { id: "DGCA Ground Classes", label: "DGCA Ground Classes" },
];
