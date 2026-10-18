import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

export default function config(phase: string): NextConfig {
  return {
    output: "export",
    // Apache/LiteSpeed friendly: /index.html, /404.html
    trailingSlash: true,
    // Media is pre-optimised by scripts/media (WebP, sized), see docs/TRD.md §6
    images: { unoptimized: true },
    // `next dev` gets its own folder: `next build` always writes .next (and exports to out/),
    // so a build can run while the dev server is up without corrupting it.
    ...(phase === PHASE_DEVELOPMENT_SERVER ? { distDir: ".next-dev" } : {}),
    reactStrictMode: true,
    poweredByHeader: false,
  };
}
