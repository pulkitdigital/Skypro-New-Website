// Fails if the static build contains content that must never ship (docs/PRD.md §5).
// Usage: node scripts/qa/grep-banned.mjs [dir=out]
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] || "out";
const BANNED = [
  "8800604726",
  "Plot 14",
  "Sanganer Airport Institutional",
  "6+ bases",
  "3,500",
  "USA base",
  "ICAO",
  "Aviation Medical Center",
  "G1000",
  "Garmin",
  "Priya Sharma",
  "Riya Kapoor",
  "Aditya Verma",
  "Neha Singh",
  "Heading Text Here",
];

// Generic tokens that also occur in CSS/JS (e.g. width:100%) — checked against visible HTML text only.
const TEXT_ONLY = ["450+", "100%"];

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

const files = [];
(function walk(d) {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(html|txt|js|json|xml|css)$/.test(entry.name)) files.push(p);
  }
})(dir);

let hits = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const term of BANNED) {
    if (text.includes(term)) {
      hits++;
      console.error(`✗ "${term}" found in ${file}`);
    }
  }
  if (file.endsWith(".html")) {
    const visible = visibleText(text);
    for (const term of TEXT_ONLY) {
      if (visible.includes(term)) {
        hits++;
        console.error(`✗ "${term}" found in visible text of ${file}`);
      }
    }
  }
}
if (hits) {
  console.error(`\n${hits} banned string(s) found.`);
  process.exit(1);
}
console.log(`✓ No banned strings in ${files.length} files under ${dir}/`);
