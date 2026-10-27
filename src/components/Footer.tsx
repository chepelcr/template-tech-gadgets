import { Link } from 'wouter';
import { useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { ContactDetails } from './ContactDetails';
import { NAV } from './Header';

export function Footer() {
  const { organization } = useStore();
  const isDemo = useIsDemo();
  const { t } = useI18n();
  return (
    <footer className="page mb-6 mt-20">
      <div className="on-deep rounded-[var(--radius-device)] bg-surface-deep px-6 py-10 text-ink-on-deep sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-2xl font-bold">{organization?.name}</p>
            {!isDemo && organization?.description && <p className="mt-3 max-w-sm text-ink-on-deep-soft">{organization.description}</p>}
            {isDemo && <p className="mt-3 max-w-sm text-sm text-ink-on-deep-soft">{t('demo.notice')}</p>}
          </div>
          <nav aria-label={t('footer.navigation')} className="md:col-span-3">
            <ul className="grid grid-cols-2 gap-1 md:grid-cols-1">
              {NAV.map(({ href, key }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-tap items-center font-semibold hover:text-[color:var(--accent)]">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-5">
            <ContactDetails tone="deep" compact />
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-2 border-t border-rule-deep pt-5 text-sm text-ink-on-deep-soft">
          <span>
            © {new Date().getFullYear()} {organization?.name}
          </span>
          <span>{t('footer.madeWith')}</span>
        </div>
      </div>
    </footer>
  );
}
