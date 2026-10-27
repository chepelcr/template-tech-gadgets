import { LazyScene } from '@/core';

const loadDevice = () => import('@/scenes/device');

/** The same radio, drawn flat: the fallback and the reduced-motion view. */
export function DeviceArt() {
  return (
    <svg viewBox="0 0 520 360" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="tg-grille" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.4" opacity="0.32" style={{ fill: 'var(--ti-shell)' }} />
        </pattern>
      </defs>
      <ellipse cx="260" cy="306" rx="210" ry="16" opacity="0.18" style={{ fill: 'var(--ti-graphite)' }} />
      <rect x="40" y="296" width="440" height="30" rx="10" style={{ fill: 'var(--ti-panel-deep)' }} />
      <rect x="70" y="66" width="380" height="232" rx="38" strokeWidth="2" style={{ fill: 'var(--ti-dial)', stroke: 'var(--ti-panel-deep)' }} />
      <rect x="98" y="96" width="172" height="172" rx="22" style={{ fill: 'var(--ti-graphite)' }} />
      <rect x="98" y="96" width="172" height="172" rx="22" fill="url(#tg-grille)" />
      <rect x="292" y="100" width="130" height="44" rx="10" style={{ fill: 'var(--ti-graphite)' }} />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={304 + i * 10.6} x2={304 + i * 10.6} y1={i % 5 === 0 ? 110 : 116} y2="134" strokeWidth={i % 5 === 0 ? 2 : 1} opacity="0.85" style={{ stroke: 'var(--ti-shell)' }} />
      ))}
      <rect x="370" y="106" width="3" height="32" style={{ fill: 'var(--ti-signal)' }} />
      <circle cx="326" cy="214" r="34" style={{ fill: 'var(--ti-graphite)' }} />
      <rect x="324" y="186" width="4" height="22" rx="2" transform="rotate(-28 326 214)" style={{ fill: 'var(--ti-shell)' }} />
      <circle cx="402" cy="232" r="22" style={{ fill: 'var(--ti-signal)' }} />
      <rect x="400" y="214" width="4" height="14" rx="2" transform="rotate(18 402 232)" style={{ fill: 'var(--ti-shell)' }} />
      <circle cx="402" cy="176" r="6" style={{ fill: 'var(--ti-led)' }} />
      <circle cx="402" cy="176" r="11" opacity="0.18" style={{ fill: 'var(--ti-led)' }} />
    </svg>
  );
}

/** The hero's signature: the 3D radio when the device can afford it, the drawing otherwise. */
export function Device({ label }: { label?: string }) {
  return (
    <LazyScene
      load={loadDevice}
      fallback={<DeviceArt />}
      label={label}
      style={{ aspectRatio: '13 / 9' }}
      className="w-full [&>[data-fx-fallback]]:h-full"
    />
  );
}
