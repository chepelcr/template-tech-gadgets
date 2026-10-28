import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { catalogHref, paragraphs, usePageMeta, useProductView } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from '@/components/AddToCart';
import { Led } from '@/components/Led';
import { Placeholder } from '@/components/Placeholder';
import { Price } from '@/components/Price';
import { ProductCard } from '@/components/ProductCard';
import { QuantityStepper } from '@/components/QuantityStepper';
import { StoreImage } from '@/components/StoreImage';
import { SectionError } from '@/components/StoreStates';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { item, catalog, category, related, max, quantity, setQuantity } = useProductView(id);
  usePageMeta(item?.name, item?.description);

  if (catalog.isLoading) {
    return (
      <div aria-hidden="true" className="page grid gap-8 pt-8 md:grid-cols-12">
        <div className="module skeleton aspect-[4/3] md:col-span-7" />
        <div className="flex flex-col gap-4 md:col-span-5">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (catalog.isError) {
    return (
      <div className="page pt-16">
        <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page pt-16">
        <div className="module flex flex-col items-start gap-4 p-8">
          <h1 className="text-4xl text-heading">{t('product.notFound.title')}</h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('product.notFound.body')}</p>
          <Link href="/products" className="btn btn-strong">
            {t('product.back')}
          </Link>
        </div>
      </div>
    );
  }

  const text = paragraphs(item.description);

  return (
    <>
      <div className="page pt-6">
        <Link href={category ? catalogHref({ category: category.key }) : '/products'} className="inline-flex min-h-tap items-center gap-2 text-sm font-semibold text-heading hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {category ? category.name : t('product.back')}
        </Link>
        <div className="mt-4 grid gap-8 md:grid-cols-12">
          <div className="module p-3 md:col-span-7">
            <div className="frame relative aspect-[4/3] bg-surface-raised shadow-inset">
              <StoreImage src={item.imageUrl} alt={item.name} priority sizes="(min-width: 768px) 55vw, 100vw" maxWidth={1280} fallback={<Placeholder label={t('product.imageMissing')} />} />
            </div>
            <div aria-hidden="true" className="mx-auto mt-3 h-2 w-2/3 rounded-full bg-[color:var(--ti-panel-deep)]" />
          </div>

          <div className="flex flex-col gap-5 md:col-span-5">
            {item.kind === 'service' && <p className="w-fit rounded-[0.375rem] bg-surface-deep px-2 py-1 text-xs font-semibold text-ink-on-deep">{t('product.service')}</p>}
            <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] text-heading">{item.name}</h1>
            {text.length > 0 && (
              <div className="flex flex-col gap-3 text-lg text-ink-soft">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            <section aria-labelledby="specs" className="module-raised p-4">
              <h2 id="specs" className="sr-only">
                {t('product.specs')}
              </h2>
              <dl className="divide-y divide-[color:var(--rule)] text-sm">
                {category && (
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-ink-soft">{t('product.spec.category')}</dt>
                    <dd className="font-semibold text-heading">{category.name}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-ink-soft">{t('product.spec.availability')}</dt>
                  <dd>
                    <Led item={item} showUntracked />
                  </dd>
                </div>
                {item.duration && (
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-ink-soft">{t('product.spec.duration')}</dt>
                    <dd className="font-semibold text-heading">{item.duration}</dd>
                  </div>
                )}
                {item.difficulty && (
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-ink-soft">{t('product.spec.level')}</dt>
                    <dd className="font-semibold text-heading">{item.difficulty}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-ink-soft">{t('product.spec.price')}</dt>
                  <dd>
                    <Price item={item} size="lg" />
                  </dd>
                </div>
              </dl>
            </section>

            <div className="flex flex-wrap items-center gap-3">
              {item.availability.state !== 'sold_out' && <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={item.name} />}
              <AddToCart item={item} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="page pt-16">
          <h2 id="related" className="mb-5 text-2xl text-heading">
            {t('product.related')}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <ProductCard item={r} category={catalog.categories.find((c) => c.id === r.categoryId)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
