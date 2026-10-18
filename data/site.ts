import type { Social } from "./types";

export const site = {
  name: "SkyPro Aviation",
  url: "https://skyproaviation.org",
  phoneDisplay: "+91-8955804726",
  phoneE164: "+918955804726",
  email: "info@skyproaviation.org",
  website: "www.skyproaviation.org",
  address: {
    line1: "69, Ganesham Complex, Devi Nagar, New Sanganer Road",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302019",
    country: "IN",
  },
  addressDisplay: "69, Ganesham Complex, Devi Nagar, New Sanganer Road, Jaipur, Rajasthan 302019",
  geo: { lat: 26.885677, lng: 75.763584 },
  whatsappUrl: "https://wa.me/918955804726",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/skyproaviation_/", href: "#" },
    { label: "YouTube", url: "https://youtube.com/@skypro-aviation", href: "#" },
  ] satisfies Social[],
  copyright: "Copyright © 2026 SkyPro Aviation",
  createdBy: "Created by BeBeyond",
  seo: {
    title: "SkyPro Aviation | DGCA Ground Classes India | Pilot Training",
    description:
      "DGCA ground classes India for CPL, ATPL theory, pilot training, type rating, and DGCA licence conversion. Learn from airline captains and IAF veterans at SkyPro Aviation.",
    ogImage: "/media/og-image.jpg",
  },
  logo: {
    color: { src: "/media/brand/logo-skypro.webp", width: 151, height: 56, alt: "SkyPro Aviation" },
    white: { src: "/media/brand/logo-skypro-white.webp", width: 151, height: 56, alt: "SkyPro Aviation" },
  },
} as const;
