import { Link } from 'wouter';
import type { CatalogCategory, CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Led } from './Led';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { StoreImage } from './StoreImage';

interface ProductCardProps {
  item: CatalogItem;
  category?: CatalogCategory;
  sizes?: string;
  layout?: 'module' | 'row';
  headingLevel?: 'h2' | 'h3';
}

const focusRing =
  'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[color:var(--focus)]';

/** A device module: the product in a recessed window, its readout and a key. */
export function ProductCard({ item, category, sizes = '(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw', layout = 'module', headingLevel = 'h3' }: ProductCardProps) {
  const { t } = useI18n();
  const Heading = headingLevel;
  const link = (
    <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
      {item.name}
    </Link>
  );

  if (layout === 'row') {
    return (
      <article className={`group relative grid grid-cols-[4rem_1fr] items-center gap-x-4 gap-y-2 rounded-[var(--radius-frame-sm)] px-2 py-3 sm:grid-cols-[4rem_minmax(0,1fr)_10rem_8rem_auto] ${focusRing}`}>
        <div className="frame-sm row-span-2 aspect-square bg-surface-raised shadow-inset sm:row-span-1">
          <StoreImage src={item.imageUrl} alt="" sizes="4rem" maxWidth={400} fallback={<Placeholder />} />
        </div>
        <div className="min-w-0">
          <Heading className="truncate text-base font-semibold text-heading">{link}</Heading>
          <p className="truncate text-sm text-ink-soft">
            {category?.name}
            {item.kind === 'service' && ` · ${t('product.service')}`}
            {item.duration && ` · ${item.duration}`}
          </p>
        </div>
        <div className="col-start-2 sm:col-start-auto">
          <Led item={item} />
        </div>
        <div className="col-start-2 sm:col-start-auto sm:text-right">
          <Price item={item} />
        </div>
        <div className="relative z-10 col-start-2 sm:col-start-auto">
          <AddToCart item={item} variant="compact" tone="quiet" />
        </div>
      </article>
    );
  }

  return (
    <article className={`module group relative flex h-full flex-col p-2.5 ${focusRing}`}>
      <div className="frame-sm relative aspect-square bg-surface-raised shadow-inset">
        <StoreImage src={item.imageUrl} alt="" sizes={sizes} maxWidth={960} fallback={<Placeholder />} />
        {item.kind === 'service' && (
          <span className="absolute left-2.5 top-2.5 rounded-[0.375rem] bg-surface-deep px-2 py-1 text-xs font-semibold text-ink-on-deep">{t('product.service')}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1.5 pb-1 pt-3">
        {category && <p className="text-xs font-medium text-ink-soft">{category.name}</p>}
        <Heading className="text-base font-semibold leading-snug text-heading">{link}</Heading>
        {item.duration && <p className="text-sm text-ink-soft">{t('product.duration', { duration: item.duration })}</p>}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <Price item={item} />
          <Led item={item} />
        </div>
        <div className="relative z-10 pt-1">
          <AddToCart item={item} variant="compact" tone="quiet" className="w-full" />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="module flex flex-col gap-3 p-2.5">
      <div className="skeleton aspect-square" />
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-7 w-24" />
    </div>
  );
}
