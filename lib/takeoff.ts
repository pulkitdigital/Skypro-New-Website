/**
 * Runway takeoff geometry (components/fx/RunwayTakeoff.tsx + the motion runtime), in scene
 * units: x 0–100 across, y 0–150 down (the runway photo's 2:3). The horizon / vanishing point
 * is at (50, 68.6); the runway edge lines meet the frame edges at y 77.4. The path keeps the
 * plane in the panel's middle band, between the heading (top) and the contacts (bottom).
 */
export const TAKEOFF = {
  start: { x: 50, y: 104 }, // on the centreline, near the bottom of the visible runway
  rollEnd: 94, // end of the take-off roll (lift-off point)
  end: { x: 80, y: 40 }, // climbing away, top-right
  endScale: 0.45,
  climb: "M 50 94 C 53 74, 64 52, 80 40",
  vanishing: { x: 50, y: 68.6 },
  edgeY: 77.4,
} as const;
