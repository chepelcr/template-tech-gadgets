import type { CatalogItem } from '@/core';
import { useI18n } from '@/i18n';

/** Availability as a status LED with its words; untracked items show nothing. */
export function Led({ item, showUntracked = false }: { item: CatalogItem; showUntracked?: boolean }) {
  const { t, plural } = useI18n();
  const a = item.availability;
  if (a.state === 'untracked') {
    return showUntracked ? (
      <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
        <span className="led" aria-hidden="true" />
        {t('product.spec.untracked')}
      </span>
    ) : null;
  }
  const state = a.state === 'sold_out' ? 'off' : a.state === 'low' ? 'low' : 'on';
  const text = a.state === 'sold_out' ? t('product.soldOut') : a.state === 'low' ? plural('product.low', a.quantity) : t('product.spec.inStock');
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${a.state === 'in_stock' ? 'text-ink' : 'text-offer'}`}>
      <span className="led" data-state={state} aria-hidden="true" />
      {text}
    </span>
  );
}
