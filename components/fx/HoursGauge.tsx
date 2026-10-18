/*
 * Semicircle flight-hours gauge (illustration): a 180° dial from 0 to `total` with ticks every
 * total/8 and labels every total/4, an amber progress arc and a needle. The static markup is the
 * final state (needle at `total`); the motion runtime sweeps it in from 0.
 */
const W = 300;
const C = { x: 150, y: 156 };
const R = 124;

function point(r: number, value: number, total: number) {
  const a = Math.PI * (1 - value / total); // 180° (left) → 0° (right)
  return { x: +(C.x + r * Math.cos(a)).toFixed(2), y: +(C.y - r * Math.sin(a)).toFixed(2) };
}

export function HoursGauge({ total }: { total: number }) {
  const ticks = Array.from({ length: 9 }, (_, i) => (i * total) / 8);
  const arc = `M ${C.x - R} ${C.y} A ${R} ${R} 0 0 1 ${C.x + R} ${C.y}`;
  return (
    <svg
      aria-hidden
      data-gauge
      data-gauge-origin={`${C.x} ${C.y}`}
      viewBox={`0 0 ${W} 176`}
      className="w-full max-w-[300px]"
      fill="none"
    >
      <path d={arc} stroke="rgb(255 255 255 / 0.12)" strokeWidth="6" strokeLinecap="round" />
      <path data-gauge-arc d={arc} pathLength={1} stroke="var(--color-amber)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1" />
      {ticks.map((v) => {
        const major = v % (total / 4) === 0;
        const a = point(R - 14, v, total);
        const b = point(R - (major ? 28 : 22), v, total);
        return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`rgb(255 255 255 / ${major ? 0.7 : 0.35})`} strokeWidth={major ? 2 : 1} />;
      })}
      {ticks
        .filter((v) => v % (total / 4) === 0)
        .map((v) => {
          const p = point(R - 44, v, total);
          return (
            <text key={v} x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white/55 font-mono text-[11px]">
              {v}
            </text>
          );
        })}
      {/* needle: drawn pointing up, rotated to the value (−90° = 0, +90° = total) */}
      <g data-gauge-needle transform={`rotate(90 ${C.x} ${C.y})`}>
        <path d={`M ${C.x - 3.5} ${C.y} L ${C.x} ${C.y - (R - 58)} L ${C.x + 3.5} ${C.y} Z`} className="fill-amber" />
      </g>
      <circle cx={C.x} cy={C.y} r="9" className="fill-amber" />
      <circle cx={C.x} cy={C.y} r="3.5" className="fill-navy-deep" />
    </svg>
  );
}
