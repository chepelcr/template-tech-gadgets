import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';
import { ThemeToggle } from './ThemeToggle';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

function StoreMark() {
  const { organization, theme } = useStore();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!organization) return <span aria-hidden="true" className="skeleton block h-7 w-24 max-w-full" />;
  return (
    <span className="flex min-w-0 items-center gap-2">
      {logo ? (
        <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-[var(--radius-key)] object-cover" />
      ) : (
        <span aria-hidden="true" className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-key)] bg-surface-deep">
          <span className="grille absolute inset-1.5 rounded-[0.375rem] opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-[color:var(--accent)]" />
        </span>
      )}
      <span className="truncate text-base font-bold tracking-tight sm:text-xl">{organization.name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    const onAdded = () => setTaps((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header ref={headerRef} className="relative z-30 border-b border-rule bg-surface">
      {isDemo && (
        <p className="bg-surface-deep py-1.5 text-center text-xs font-medium text-ink-on-deep-soft sm:text-sm">
          <span className="led mr-2 align-middle" data-state="low" aria-hidden="true" />
          {t('demo.notice')}
        </p>
      )}
      <div className="page flex h-14 items-center gap-1.5 sm:h-16 sm:gap-2">
        <Link href="/" className="min-w-0 flex-1 rounded-[var(--radius-key)] py-1 pr-1 text-heading lg:flex-initial">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1 rounded-[0.875rem] bg-surface-quiet p-1 shadow-inset">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="flex min-h-[2.5rem] items-center rounded-[var(--radius-key)] px-3 text-sm font-semibold text-ink-soft transition-colors hover:text-heading aria-[current=page]:bg-surface-raised aria-[current=page]:text-heading aria-[current=page]:shadow-[var(--shadow-key)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <button type="button" onClick={openCart} className="btn btn-strong shrink-0 !gap-1.5 !px-2 sm:!px-3">
          <ShoppingCart key={taps} aria-hidden="true" className={`h-5 w-5 ${taps ? 'basket-settle' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="min-w-6 rounded-[0.375rem] bg-surface-deep-raised px-1.5 py-0.5 text-center text-sm font-bold tabular-nums text-[color:var(--accent)]">
            {String(count).padStart(2, '0')}
          </span>
          <span className="sr-only">{plural('cart.items', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn shrink-0 text-heading hover:bg-surface-quiet lg:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal container={headerRef.current}>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="nav-menu fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto overscroll-contain rounded-b-2xl bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] text-heading shadow-lift">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-heading">{t('nav.menu')}</Dialog.Title>
                <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label={t('nav.primary')} className="mt-1">
                <ul className="flex flex-col gap-1">
                  {NAV.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive(href) ? 'page' : undefined}
                        className="module flex min-h-tap items-center justify-between px-3 text-lg font-semibold text-heading aria-[current=page]:bg-surface-raised"
                      >
                        {t(key)}
                        {isActive(href) && <span className="led" data-state="on" aria-hidden="true" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
