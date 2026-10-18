// Content audit: every user-facing string in data/*.ts must
//   (1) appear verbatim in docs/content-extract.md (or be on the approved list below), and
//   (2) appear in the built page (out/index.html — text or attributes).
// Usage: node scripts/qa/check-content.mjs [buildDir=out]
import fs from "node:fs";
import path from "node:path";

const buildDir = process.argv[2] || "out";
const norm = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\\|/g, "|")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const extract = norm(fs.readFileSync("docs/content-extract.md", "utf8"));
const rawHtml = fs.readFileSync(path.join(buildDir, "index.html"), "utf8");
const html = norm(rawHtml);
// visible text (tags removed) — catches strings split by inline elements
const htmlText = norm(rawHtml.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, ""));
// strings that render only on interaction (dialogs, dropdowns) live in the RSC payload, JSON-escaped twice
// …or in the client JS chunks (client components bundle their data)
const chunkDir = path.join(buildDir, "_next", "static", "chunks");
const chunks = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) chunks.push(fs.readFileSync(p, "utf8"));
  }
})(chunkDir);
const js = chunks.join(" ");
const inPayload = (s) => {
  const once = JSON.stringify(s).slice(1, -1);
  const twice = JSON.stringify(once).slice(1, -1);
  return rawHtml.includes(once) || rawHtml.includes(twice) || js.includes(s) || js.includes(once);
};

/** Approved non-verbatim strings, with the reason (PRD §5 / §14 decisions). */
const APPROVED = new Map([
  ["Review your pre-course materials and ensure your medical and documents are ready. Get familiar with basic aviation terminology. Arrive well-rested and ready to focus.", "OQ-7: CMS leftovers removed from FAQ #3"],
  ["Why Choose SkyPro Aviation?", "OQ-9: stray space before '?' removed (the h6 eyebrow on live already reads this way)"],
  ["At SkyPro Aviation, we believe becoming a commercial pilot should be a clear, structured, and supportive journey, not a maze of confusion, delays, and hidden costs. Our programs are designed and delivered by airline-experienced professionals who know exactly what it takes to succeed in the aviation industry.", "OQ-9: double space removed"],
  ["Created by BeBeyond", "Brief wording (live: 'Created By')"],
  ["11:00 AM", "Brief format (live: '11:00:00')"],
  ["15th April 2026", "Live has a trailing period"],
  ["We have received your enquiry. Our team will contact you shortly.", "OQ-13: new success copy (approved default)"],
  ["Something went wrong. Please try again or call +91-8955804726.", "OQ-13: new error copy (approved default)"],
  ["Send another enquiry", "OQ-13: UI action"],
  ["Sending…", "UI state"],
  ["Try again", "UI action"],
  ["Scroll", "UI label"],
  ["SkyPro Aviation reception lounge with a wooden aircraft wall sculpture", "alt text (describes the image)"],
  ["SkyPro Aviation promotional video", "alt text"],
  ["Veteran fighter pilot, flight and ground subjects instructor", "role line = fragment of the live bio"],
  ["Veteran fighter pilot and qualified flight safety accident investigator", "role line = fragment of the live bio"],
  ["Navigator, Indian Air Force", "role line = joins two fragments of the live bio"],
  ["Airbus A320 type-rated pilot", "role line = fragment of the live bio"],
  ["Mig 21", "aircraft tag from bio"],
  ["Mig 29", "aircraft tag from bio"],
  ["Programs Under One Roof", "brief-approved stat label"],
  ["Instructor Experience", "brief-approved stat label"],
  ["Pilots Mentored", "brief-approved stat label"],
  ["CPL Flying Requirement", "brief-approved stat label"],
  ["4 Decades+", "brief-approved stat"],
  ["Please enter your full name.", "validation message (PRD §9)"],
  ["Enter a valid 10-digit Indian mobile number.", "validation message (PRD §9)"],
  ["Enter a valid email address.", "validation message (PRD §9)"],
  ["Please choose an option.", "validation message (PRD §9)"],
  ["Please choose your state.", "validation message (PRD §9)"],
  ["Please enter your city.", "validation message (PRD §9)"],
  ["Select at least one option.", "validation message (PRD §9)"],
  ["Please choose one.", "validation message (PRD §9)"],
  ["Please agree so we can contact you.", "validation message (PRD §9)"],
  ["Please keep your question under 2000 characters.", "validation message"],
  ["https://skyproaviation.org", "site URL"],
  ["/media/og-image.jpg", "asset path"],
  ["NIGHT", "flying-hours row id (live: night flying hours)"],
  ["Book Free Counselling", "CTA label requested in the 2026-10-17 tone-down brief"],
  ["Share your details and our team will contact you shortly.", "enquiry intro requested in the tone-down brief, built from the OQ-13 success copy"],
]);

/** Data strings the design intentionally does not render (they stay in data/ for later use). */
const NOT_SHOWN = new Map([
  ["NIGHT", "row id only — the flying-hours bars are labelled in words (Night)"],
]);

const files = fs.readdirSync("data").filter((f) => f.endsWith(".ts") && f !== "types.ts");
const strings = new Map(); // text -> file
for (const file of files) {
  // ignore comments (they quote removed CMS leftovers etc.)
  const src = fs.readFileSync(path.join("data", file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
    const s = norm(m[1]);
    if (s.length < 4 || !/[A-Za-z]/.test(s)) continue;
    if (/^[a-z0-9-]+$/.test(s) && !/\s/.test(s)) continue; // ids / slugs
    if (s.startsWith("/") || s.startsWith(".") || s.startsWith("(") || s.startsWith("video/") || s.includes("${")) continue; // paths, regex, mime types
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) continue; // ISO dates (machine-readable)
    if (/^https?:\/\/(www\.)?(instagram|youtube|wa\.me)/.test(s)) continue; // social URLs (data only)
    if (["License Conversion & Recency", "DGCA Ground Classes"].includes(s) && file === "types.ts") continue;
    strings.set(s, file);
  }
}

const notInExtract = [];
const notOnPage = [];
const interactiveOnly = [];
const approvedUsed = [];
const notShown = [];
for (const [s, file] of strings) {
  if (!extract.includes(s)) {
    if (APPROVED.has(s)) approvedUsed.push([s, APPROVED.get(s)]);
    else notInExtract.push(`${file}: ${s}`);
  }
}
// Strings that only exist in client-only states (form messages, success) aren't in the static HTML.
const clientOnly = new Set([...APPROVED.keys()].filter((k) => /enquiry|went wrong|another|Sending|Try again|Please|Enter a valid|Select at least/.test(k)));
const enquiryOnly = /enquiry\.ts$/;
for (const [s, file] of strings) {
  if (clientOnly.has(s) || enquiryOnly.test(file) || ["/media/og-image.jpg"].includes(s)) continue;
  if (html.includes(s) || htmlText.includes(s)) continue;
  if (NOT_SHOWN.has(s)) {
    notShown.push(`${file}: ${s}  [${NOT_SHOWN.get(s)}]`);
    continue;
  }
  if (inPayload(s)) interactiveOnly.push(`${file}: ${s.slice(0, 60)}${s.length > 60 ? "…" : ""}`);
  else notOnPage.push(`${file}: ${s}`);
}

console.log(`checked ${strings.size} strings from data/*.ts`);
console.log(`approved deviations used: ${approvedUsed.length}`);
for (const [s, why] of approvedUsed) console.log(`  ~ ${s.slice(0, 70)}${s.length > 70 ? "…" : ""}  [${why}]`);
if (interactiveOnly.length) {
  console.log(`
rendered on interaction (dialogs / dropdowns — shipped in the RSC payload or client JS, covered by E2E): ${interactiveOnly.length}`);
  interactiveOnly.forEach((x) => console.log("  · " + x));
}
if (notShown.length) {
  console.log(`
intentionally not shown (design decision): ${notShown.length}`);
  notShown.forEach((x) => console.log("  - " + x));
}
if (notInExtract.length) {
  console.log(`\n✗ NOT in content-extract.md (${notInExtract.length}):`);
  notInExtract.forEach((x) => console.log("  " + x));
}
if (notOnPage.length) {
  console.log(`\n✗ NOT found in ${buildDir}/index.html (${notOnPage.length}):`);
  notOnPage.forEach((x) => console.log("  " + x));
}
if (!notInExtract.length && !notOnPage.length) console.log("\n✓ every data string is verbatim from the live extract (or approved) and present in the build");
process.exit(notInExtract.length || notOnPage.length ? 1 : 0);
