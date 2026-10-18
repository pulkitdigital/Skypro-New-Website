import type { Batch } from "./types";

/**
 * Upcoming batches. The section is hidden when no batch is `visible`.
 * NOTE (PRD OQ-2): this batch is hidden on the live site and its date has passed — update before launch.
 */
export const batches: Batch[] = [
  {
    id: "dgca-nav-met-2026-04",
    number: 1,
    program: "DGCA Ground Classes - Navigation and Meteorology",
    classType: "Online/Offline",
    startDateISO: "2026-04-15T11:00:00+05:30",
    startDateLabel: "15th April 2026",
    startTimeLabel: "11:00 AM",
    visible: true,
  },
];
