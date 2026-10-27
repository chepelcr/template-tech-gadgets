import { Link } from 'wouter';
import { usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { DeviceArt } from '@/components/Device';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('notFound.title'));
  return (
    <div className="page pt-12">
      <div className="module-raised grid items-center gap-6 rounded-[var(--radius-device)] p-6 md:grid-cols-2 md:p-12">
        <div>
          <h1 className="text-[clamp(2.4rem,6vw,4rem)] text-heading">{t('notFound.title')}</h1>
          <p className="mt-4 max-w-md text-lg text-ink-soft">{t('notFound.body')}</p>
          <Link href="/" className="btn btn-strong mt-6">
            {t('notFound.cta')}
          </Link>
        </div>
        <div className="opacity-70 grayscale">
          <DeviceArt />
        </div>
      </div>
    </div>
  );
}
