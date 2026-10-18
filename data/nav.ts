import type { NavItem } from "./types";

/** Header navigation — labels exactly as on the live site. Every href is "#" (no redirects). */
export const headerNav: NavItem[] = [
  { label: "Home", href: "#" },
  {
    label: "Courses",
    href: "#",
    children: [
      { label: "DGCA Ground Classes", href: "#" },
      { label: "CPL Flying Training Argentina", href: "#" },
    ],
  },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
  {
    label: "Admission Forms",
    href: "#",
    children: [
      { label: "Conversion and Recency Form", href: "#" },
      { label: "Ground School Admission Form", href: "#" },
    ],
  },
  { label: "Student Dashboard", href: "#" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Blogs", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Disclaimer", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms Of Use", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export const footerCourses: NavItem[] = [
  { label: "DGCA Ground Classes", href: "#" },
  { label: "ATPL Theory Training", href: "#" },
  { label: "Flight Training", href: "#" },
  { label: "Type Rating", href: "#" },
  { label: "License Conversion", href: "#" },
  { label: "Mentorship Programme", href: "#" },
];
