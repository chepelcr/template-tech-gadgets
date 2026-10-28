import { Plus } from 'lucide-react';
import { announce, isPurchasable, useCart, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';

export const BASKET_EVENT = 'tsuru:basket-added';

/** Adds the item and tells the header to settle the basket; sold-out items cannot be added. */
export function AddToCart({ item, quantity = 1, variant = 'full', tone = 'accent', className = '' }: { item: CatalogItem; quantity?: number; variant?: 'full' | 'compact'; tone?: 'accent' | 'quiet'; className?: string }) {
  const { t, langOf } = useI18n();
  const add = useCart((s) => s.add);
  const available = isPurchasable(item);

  const onAdd = () => {
    const added = add(item, quantity);
    if (added <= 0) {
      announce(t('product.limit'));
      return;
    }
    const message = t('product.added', { name: item.name });
    announce(added < quantity ? `${message}. ${t('product.limit')}` : message);
    window.dispatchEvent(new CustomEvent(BASKET_EVENT));
  };

  if (!available) {
    return (
      <button type="button" disabled className={`btn btn-quiet ${className}`}>
        {t('product.soldOut')}
      </button>
    );
  }

  return (
    <button type="button" onClick={onAdd} className={`btn ${tone === 'quiet' ? 'btn-quiet' : 'btn-accent'} ${variant === 'compact' ? 'px-4 text-sm' : ''} ${className}`}>
      <Plus aria-hidden="true" className={`h-4 w-4 ${tone === 'quiet' ? 'text-accent-text' : ''}`} strokeWidth={2.5} />
      <span lang={langOf('product.add')}>{t('product.add')}</span>
    </button>
  );
}
