import { LayoutGrid, List, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  productsContent,
  showsKindFilter,
  showsOfferFilter,
  useCatalogView,
  useCmsPage,
  usePageMeta,
  type CatalogCategory,
  type CatalogItem,
  type ItemKind,
  type SortKey,
} from '@/core';
import { useI18n } from '@/i18n';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { SectionError } from '@/components/StoreStates';

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'name'];
const VIEW_KEY = 'tsuru:catalog-view';
type View = 'grid' | 'list';

function readView(): View {
  try {
    return window.localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
}

function Results({ items, view, categoryOf }: { items: CatalogItem[]; view: View; categoryOf: (id: string | null) => CatalogCategory | undefined }) {
  if (view === 'list') {
    return (
      <ul className="module divide-y divide-[color:var(--rule)] px-2">
        {items.map((item) => (
          <li key={item.id}>
            <ProductCard item={item} category={categoryOf(item.categoryId)} layout="row" />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <ProductCard item={item} category={categoryOf(item.categoryId)} />
        </li>
      ))}
    </ul>
  );
}

export default function Catalog() {
  const { t, plural } = useI18n();
  const cms = useCmsPage('products');
  const content = productsContent(cms.page);
  usePageMeta(cms.page?.title ?? t('catalog.title'), cms.page?.metaDescription);
  const { catalog, params, setParams, query, setQuery, facets, categories, results, active, grouped, selected, uncategorized, categoryOf, clearAll } =
    useCatalogView();
  const [view, setView] = useState<View>('grid');

  useEffect(() => setView(readView()), []);
  const chooseView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  };

  const kinds: Array<{ value: ItemKind | null; key: string }> = [
    { value: null, key: 'catalog.kind.all' },
    { value: 'product', key: 'catalog.kind.product' },
    { value: 'service', key: 'catalog.kind.service' },
  ];
  const segment =
    'inline-flex min-h-[2.5rem] items-center rounded-[var(--radius-key)] px-3.5 text-sm font-semibold text-ink-soft hover:text-heading aria-pressed:bg-surface-raised aria-pressed:text-heading aria-pressed:shadow-[var(--shadow-key)]';

  return (
    <div className="page pt-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
        <div>
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] text-heading">{content.hero.title ?? t('catalog.title')}</h1>
          {content.hero.subtitle && <p className="mt-2 max-w-2xl text-lg text-ink-soft">{content.hero.subtitle}</p>}
        </div>
        <p aria-live="polite" className="text-sm font-semibold text-ink-soft">
          {catalog.isLoading ? t('state.loading') : plural('catalog.results', results.length)}
          {selected && ` · ${selected.name}`}
        </p>
      </header>

      <div className="module mt-6 flex flex-col gap-4 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="catalog-search" className="sr-only">
            {t('catalog.search')}
          </label>
          <div className="relative min-w-[14rem] flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input id="catalog-search" type="search" className="field pl-10" placeholder={t('catalog.search.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          {showsKindFilter(facets) && (
            <div role="group" aria-label={t('catalog.kind')} className="flex rounded-[0.875rem] bg-surface p-1 shadow-inset">
              {kinds.map(({ value, key }) => (
                <button key={key} type="button" aria-pressed={params.kind === value} className={segment} onClick={() => setParams({ kind: value })}>
                  {t(key)}
                </button>
              ))}
            </div>
          )}

          <label htmlFor="catalog-sort" className="sr-only">
            {t('catalog.sort')}
          </label>
          <select id="catalog-sort" className="field w-auto min-w-[12rem]" value={params.sort} onChange={(e) => setParams({ sort: e.target.value as SortKey })}>
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`catalog.sort.${s}`)}
              </option>
            ))}
          </select>

          <div role="group" aria-label={t('catalog.view')} className="flex rounded-[0.875rem] bg-surface p-1 shadow-inset">
            <button type="button" aria-pressed={view === 'grid'} className={segment} onClick={() => chooseView('grid')} aria-label={t('catalog.view.grid')}>
              <LayoutGrid aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" aria-pressed={view === 'list'} className={segment} onClick={() => chooseView('list')} aria-label={t('catalog.view.list')}>
              <List aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(categories.length > 1 || showsOfferFilter(facets)) && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 1 && (
              <div role="group" aria-label={t('catalog.category')} className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button type="button" aria-pressed={!params.category} className={`${segment} shrink-0 bg-surface`} onClick={() => setParams({ category: null })}>
                  {t('catalog.category.all')}
                  <span className="ml-2 tabular-nums opacity-70">{facets.total}</span>
                </button>
                {categories.map((c) => (
                  <button key={c.id} type="button" aria-pressed={params.category === c.key} className={`${segment} shrink-0 bg-surface`} onClick={() => setParams({ category: c.key })}>
                    {c.name}
                    <span className="ml-2 tabular-nums opacity-70">{facets.categories.get(c.id) ?? 0}</span>
                  </button>
                ))}
              </div>
            )}
            {showsOfferFilter(facets) && (
              <label className="ml-auto inline-flex min-h-tap cursor-pointer items-center gap-3 text-sm font-semibold text-heading">
                <span className="relative inline-flex h-6 w-11 items-center">
                  <input type="checkbox" className="peer absolute inset-0 cursor-pointer opacity-0" checked={params.sale} onChange={(e) => setParams({ sale: e.target.checked })} />
                  <span aria-hidden="true" className="h-6 w-11 rounded-full bg-surface shadow-inset transition-colors peer-checked:bg-[color:var(--accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--focus)]" />
                  <span aria-hidden="true" className="absolute left-1 h-4 w-4 rounded-full bg-surface-raised shadow-[var(--shadow-key)] transition-transform peer-checked:translate-x-5" />
                </span>
                {t('catalog.offers')}
              </label>
            )}
            {active && (
              <button type="button" className="btn btn-quiet min-h-[2.5rem] px-3 text-sm" onClick={clearAll}>
                <X aria-hidden="true" className="h-4 w-4" />
                {t('catalog.filters.clear')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {catalog.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : catalog.items.length === 0 ? (
          <p className="module p-6 text-ink-soft">{t('catalog.empty.store')}</p>
        ) : results.length === 0 ? (
          <div className="module flex flex-col items-start gap-3 p-8">
            <p className="text-2xl font-bold text-heading">{t('catalog.empty.title')}</p>
            <p className="text-ink-soft">{t('catalog.empty.body')}</p>
            <button type="button" className="btn btn-strong mt-2" onClick={clearAll}>
              {t('catalog.filters.clear')}
            </button>
          </div>
        ) : grouped ? (
          <div className="flex flex-col gap-12">
            {categories.map((category) => {
              const items = results.filter((i) => i.categoryId === category.id);
              if (!items.length) return null;
              return (
                <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 id={`cat-${category.id}`} className="text-2xl text-heading">
                      {category.name}
                    </h2>
                    <span className="text-sm tabular-nums text-ink-soft">{items.length}</span>
                    {category.description && <p className="hidden text-ink-soft md:block">{category.description}</p>}
                  </div>
                  <Results items={items} view={view} categoryOf={() => undefined} />
                </section>
              );
            })}
            {uncategorized.length > 0 && <Results items={uncategorized} view={view} categoryOf={categoryOf} />}
          </div>
        ) : (
          <Results items={results} view={view} categoryOf={categoryOf} />
        )}
      </div>
    </div>
  );
}
