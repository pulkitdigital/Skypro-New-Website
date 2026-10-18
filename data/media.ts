import type { MediaImage } from "./types";

/** Bump to bust the 30-day /media cache after replacing the hero video (see README). */
export const HERO_VERSION = "1";

const v = (src: string) => `${src}?v=${HERO_VERSION}`;

export const heroVideo = {
  desktop1080: [
    { src: v("/media/video/hero-video-1080.webm"), type: "video/webm" },
    { src: v("/media/video/hero-video-1080.mp4"), type: "video/mp4" },
  ],
  desktop720: [{ src: v("/media/video/hero-video-720.mp4"), type: "video/mp4" }],
  mobile: [
    { src: v("/media/video/hero-video-mobile-720.webm"), type: "video/webm" },
    { src: v("/media/video/hero-video-mobile-720.mp4"), type: "video/mp4" },
  ],
  poster: { src: v("/media/video/hero-poster.webp"), width: 1920, height: 1080 },
  posterMobile: { src: v("/media/video/hero-poster-mobile.webp"), width: 720, height: 1280 },
  alt: "SkyPro Aviation promotional video",
} as const;

export const aboutImage: MediaImage = {
  src: "/media/about-academy-lounge.webp",
  width: 1200,
  height: 800,
  alt: "SkyPro Aviation reception lounge with a wooden aircraft wall sculpture",
};

export const counsellingBackground: MediaImage = {
  src: "/media/bg-counselling-aircraft.webp",
  width: 1440,
  height: 720,
  alt: "",
};

const life = (n: string, width: number, height: number, alt: string): MediaImage => ({
  src: `/media/life/life-${n}.webp`,
  width,
  height,
  alt,
});

/** Life at SkyPro — 17 of 19 live photos (life-05 and life-14 are duplicates; PRD OQ-12). */
export const lifeGallery: MediaImage[] = [
  life("01", 1080, 910, "SkyPro students and instructors on a hilltop at sunrise near Jaipur"),
  life("02", 1920, 1280, "SkyPro faculty in uniform in front of a backlit SkyPro display"),
  life("03", 1600, 2400, "Instructor writing on a digital board during a ground class"),
  life("04", 1080, 864, "SkyPro students on a hilltop overlooking Jaipur"),
  life("06", 1600, 1067, "Student pilot beside the aircraft wall sculpture at SkyPro"),
  life("07", 1080, 1018, "SkyPro students on a hilltop above a lake in Jaipur"),
  life("08", 1200, 800, "SkyPro meeting room with a conference table and display screen"),
  life("09", 1200, 800, "Neon SkyPro Aviation logo sign on a marble wall"),
  life("10", 1200, 800, "SkyPro cadets in uniform in front of a SkyPro backdrop"),
  life("11", 1200, 800, "Aircraft wall sculpture and faculty standee at the SkyPro reception"),
  life("12", 1200, 800, "SkyPro faculty in uniform in front of the SkyPro backdrop"),
  life("13", 1200, 800, "Wall of certificates and framed photographs at SkyPro"),
  life("15", 1200, 800, "Propeller wall decor and reception desk at SkyPro"),
  life("16", 1200, 800, "SkyPro faculty and students group photo"),
  life("17", 1200, 800, "Dual monitors showing the SkyPro logo at a simulator station"),
  life("18", 1200, 800, "Airliner cockpit panel poster for procedures training"),
  life("19", 1200, 800, "Flight simulator joystick and throttle on a desk"),
];
