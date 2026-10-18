/**
 * Desktop scroll indicator on the right edge: a tick ladder, an amber marker that climbs with
 * the scroll progress and the altitude in B612 Mono (0 → 35,000 FT). Decorative and static
 * markup only — the motion runtime shows it after the hero and moves it (transform only). It is
 * kept subtle with a translucent backing rather than element opacity, so the readout stays legible.
 * Hidden below 1280px (where it would touch the content) and with reduced motion.
 */
export function AltitudeIndicator() {
  return (
    <div
      aria-hidden
      data-altitude
      className="pointer-events-none fixed top-1/2 right-2 z-40 hidden w-10 -translate-y-1/2 flex-col items-center gap-2.5 rounded-[4px] bg-navy-deep/70 py-3 opacity-0 transition-opacity duration-500 xl:flex"
    >
      <div className="altitude-ticks relative h-[36vh] w-2.5">
        <span className="absolute inset-y-0 right-0 w-px bg-white/30" />
        <span data-altitude-marker className="absolute top-0 -right-1 block h-[3px] w-4 -translate-y-1/2 rounded-full bg-amber" />
      </div>
      <p className="flex flex-col items-center font-mono text-[9px] leading-tight text-white">
        <span data-altitude-value>0</span>
        <span className="text-white/80">FT</span>
      </p>
    </div>
  );
}
