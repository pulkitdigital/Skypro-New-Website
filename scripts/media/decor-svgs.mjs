// Writes the decorative background texture as a static file (public/media/decor/chart-lines.svg).
// Rendering it as <img> instead of inline SVG keeps its nodes out of React hydration.
// (The compass rose and flight-path textures were retired in the redesign pass.)
// Usage: node scripts/media/decor-svgs.mjs
import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "public", "media", "decor");
fs.mkdirSync(out, { recursive: true });

// Aeronautical chart texture (white, ~4–9% opacity) for the deep-navy sections.
const chart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
<defs><pattern id="g" width="120" height="120" patternUnits="userSpaceOnUse">
<path d="M120 0H0V120" stroke="#fff" stroke-opacity="0.05"/><path d="M60 0v6M60 114v6M0 60h6M114 60h6" stroke="#fff" stroke-opacity="0.06"/>
</pattern></defs>
<rect width="1440" height="900" fill="url(#g)"/>
<g stroke="#fff" stroke-opacity="0.07"><path d="M-40 760 L520 330 L980 410 L1500 40"/><path d="M-40 180 L420 420 L860 470 L1480 860" stroke-dasharray="10 8"/><path d="M300 960 L520 330 L640 -40" stroke-dasharray="2 6"/><path d="M980 410 L1180 960"/></g>
<g stroke="#fff" stroke-opacity="0.09"><circle cx="520" cy="330" r="5"/><circle cx="980" cy="410" r="5"/><circle cx="860" cy="470" r="3"/><path d="M514 330h12M520 324v12M974 410h12M980 404v12"/></g>
<g stroke="#fff" stroke-opacity="0.06"><circle cx="980" cy="410" r="120" stroke-dasharray="1 7.5"/><circle cx="980" cy="410" r="96" stroke-dasharray="1 14"/></g>
</svg>`;

const file = path.join(out, "chart-lines.svg");
fs.writeFileSync(file, chart.replace(/\n/g, ""));
console.log(`public/media/decor/chart-lines.svg  ${fs.statSync(file).size} B`);
