import type { Stat } from "./types";

/** Only facts that appear on the live homepage (sources in docs/content-extract.md §20). */
export const stats: Stat[] = [
  { value: null, display: "4 Decades+", label: "Instructor Experience" },
  { value: 400, display: "400+", unit: "+", label: "Pilots Mentored" },
  { value: 200, display: "200", unit: "Hrs", label: "CPL Flying Requirement" },
  { value: 6, display: "6", label: "Programs Under One Roof" },
];
