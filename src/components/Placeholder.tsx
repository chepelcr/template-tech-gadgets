import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: lichen with a frame vein pattern and the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${deep ? 'bg-surface-deep-raised text-ink-on-deep-soft' : 'bg-surface-quiet text-heading'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0 90 C30 70 50 40 100 10" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M20 78 C30 70 32 60 30 50 M42 64 C55 60 60 52 62 42 M62 46 C70 44 76 38 80 28" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </svg>
      <ProductFallbackIcon className="relative h-10 w-10" strokeWidth={1.5} />
    </div>
  );
}
