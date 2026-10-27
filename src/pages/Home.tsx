import { Link } from 'wouter';
import { catalogHref, categoriesWithItems, facetsFor, featuredItems, homeContent, onColor, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { Device } from '@/components/Device';
import { Placeholder } from '@/components/Placeholder';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

export default function Home() {
  const { t, plural } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 8);
  const index = categoriesWithItems(catalog.categories, catalog.items);
  const counts = facetsFor(catalog.items).categories;
  const categoryOf = (id: string | null) => catalog.categories.find((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="page pt-6 md:pt-10">
        <div className="module-raised relative grid gap-8 overflow-hidden rounded-[var(--radius-device)] p-6 sm:p-8 md:grid-cols-12 md:items-center lg:p-12">
          <div className="md:col-span-6 lg:col-span-5">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-4">
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-14 w-full" />
                <div className="skeleton h-5 w-4/5" />
                <div className="flex gap-3">
                  <div className="skeleton h-11 w-36" />
                  <div className="skeleton h-11 w-36" />
                </div>
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                {home.hero.badge && (
                  <p className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-surface-quiet px-3 py-1.5 text-sm font-semibold text-heading shadow-inset">
                    <span className="led" data-state="on" aria-hidden="true" />
                    {home.hero.badge}
                  </p>
                )}
                {home.hero.title && <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] text-heading">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mt-5 max-w-[34rem] text-lg text-ink-soft">{home.hero.subtitle}</p>}
                <div className="mt-8 flex flex-wrap gap-3">
                  {home.hero.ctaPrimary && (
                    <Link href="/products" className="btn btn-accent">
                      {home.hero.ctaPrimary}
                    </Link>
                  )}
                  {home.hero.ctaSecondary && (
                    <Link href="/contact" className="btn btn-quiet">
                      {home.hero.ctaSecondary}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="relative md:col-span-6 lg:col-span-7">
            <Device label={home.hero.title ?? undefined} />
          </div>
          {home.hero.image && (
            <div className="rounded-[calc(var(--radius-device)-1rem)] bg-surface-deep p-2 md:col-span-12">
              <div className="frame aspect-[16/9] bg-surface-deep-raised sm:aspect-[3/1]">
                <StoreImage src={home.hero.image} alt="" sizes="(min-width: 1024px) 70rem, 100vw" maxWidth={1600} fallback={<Placeholder tone="deep" />} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby={home.categories.title ? 'home-index' : undefined} className="page pt-14">
        {(home.categories.title || home.categories.subtitle) && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              {home.categories.title && (
                <h2 id="home-index" className="text-3xl text-heading">
                  {home.categories.title}
                </h2>
              )}
              {home.categories.subtitle && <p className="mt-1 text-ink-soft">{home.categories.subtitle}</p>}
            </div>
          </div>
        )}
        {catalog.isLoading ? (
          <div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="module skeleton h-24" />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {index.map((category) => (
              <li key={category.id}>
                <Link href={catalogHref({ category: category.key })} className="module group flex h-full items-center gap-3 p-2.5 transition-transform active:translate-y-px">
                  <span className="frame-sm relative block aspect-square w-14 shrink-0 bg-surface-raised shadow-inset">
                    <StoreImage
                      src={category.imageUrl}
                      alt=""
                      sizes="3.5rem"
                      maxWidth={400}
                      fallback={
                        <span
                          className="grid h-full w-full place-items-center text-lg font-bold"
                          style={{ background: category.backgroundColor ?? undefined, color: category.backgroundColor ? onColor(category.backgroundColor) : undefined }}
                        >
                          {category.name.slice(0, 1)}
                        </span>
                      }
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-heading group-hover:underline">{category.name}</span>
                    <span className="text-sm text-ink-soft">{plural('category.count', counts.get(category.id) ?? 0)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby={home.featured.title ? 'home-bench' : undefined} className="page pt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            {home.featured.badge && <p className="mb-2 text-sm font-semibold text-accent-text">{home.featured.badge}</p>}
            {home.featured.title && (
              <h2 id="home-bench" className="text-3xl text-heading">
                {home.featured.title}
              </h2>
            )}
            {home.featured.subtitle && <p className="mt-1 text-ink-soft">{home.featured.subtitle}</p>}
          </div>
          {catalog.items.length > 0 && (
            <Link href="/products" className="btn btn-quiet">
              {t('catalog.viewAll')}
            </Link>
          )}
        </div>
        {catalog.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? null : featured.length === 0 ? (
          <p className="module p-6 text-ink-soft">{t('catalog.empty.store')}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} category={categoryOf(item.categoryId)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-16">
          <ul className="module grid divide-y divide-[color:var(--rule)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {home.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-key)] bg-surface-raised text-heading shadow-[var(--shadow-key)]">
                  <CmsIcon icon={benefit.icon} className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-lg text-heading">{benefit.title}</h3>
                  {benefit.description && <p className="mt-1 text-ink-soft">{benefit.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-16">
          <div className="module grid gap-6 p-3 md:grid-cols-12 md:items-center md:gap-10">
            {home.story.image && (
              <div className="frame aspect-[4/3] bg-surface-raised shadow-inset md:col-span-6">
                <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder />} />
              </div>
            )}
            <div className={`p-4 md:p-6 ${home.story.image ? 'md:col-span-6' : 'md:col-span-12'}`}>
              {home.story.title && <h2 className="text-3xl text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-6">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-16">
          <div className="on-deep flex flex-col gap-5 rounded-[var(--radius-device)] bg-surface-deep p-8 text-ink-on-deep md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              {home.cta.title && <h2 className="text-3xl">{home.cta.title}</h2>}
              {home.cta.description && <p className="mt-2 text-ink-on-deep-soft">{home.cta.description}</p>}
            </div>
            {home.cta.buttonText && (
              <Link href="/contact" className="btn btn-accent shrink-0">
                {home.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
