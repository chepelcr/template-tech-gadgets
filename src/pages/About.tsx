import { aboutContent, paragraphs, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

export default function About() {
  const { t } = useI18n();
  const cms = useCmsPage('about');
  const about = aboutContent(cms.page);
  usePageMeta(cms.page?.title ?? t('nav.about'), cms.page?.metaDescription);
  const story = paragraphs(about.story.content);

  return (
    <div className="page pt-8">
      <section className="module-raised grid gap-6 overflow-hidden rounded-[var(--radius-device)] p-3 md:grid-cols-12 md:items-center">
        <div className="p-5 md:col-span-5 md:p-8">
          {cms.isLoading ? (
            <div aria-hidden="true" className="flex flex-col gap-3">
              <div className="skeleton h-12 w-56" />
              <div className="skeleton h-5 w-72" />
            </div>
          ) : cms.isError ? (
            <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
          ) : (
            <>
              <h1 className="text-[clamp(2.4rem,6vw,4rem)] text-heading">{about.hero.title ?? t('nav.about')}</h1>
              {about.hero.subtitle && <p className="mt-4 text-lg text-ink-soft">{about.hero.subtitle}</p>}
            </>
          )}
        </div>
        {about.hero.image && (
          <div className="frame aspect-[16/10] bg-surface-quiet shadow-inset md:col-span-7">
            <StoreImage src={about.hero.image} alt="" priority sizes="(min-width: 768px) 55vw, 100vw" fallback={<Placeholder />} />
          </div>
        )}
      </section>

      {(about.story.title || story.length > 0) && (
        <section className="grid gap-8 pt-14 md:grid-cols-12">
          <div className={about.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
            {about.story.title && <h2 className="text-3xl text-heading">{about.story.title}</h2>}
            <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-lg text-ink-soft">
              {story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {about.story.image && (
            <div className="module p-2.5 md:col-span-5">
              <div className="frame-sm aspect-[4/3] bg-surface-raised shadow-inset">
                <StoreImage src={about.story.image} alt="" sizes="(min-width: 768px) 35vw, 100vw" maxWidth={960} fallback={<Placeholder />} />
              </div>
            </div>
          )}
        </section>
      )}

      {about.values.items.length > 0 && (
        <section className="pt-14">
          {about.values.title && <h2 className="mb-5 text-3xl text-heading">{about.values.title}</h2>}
          <ul className="module grid divide-y divide-[color:var(--rule)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {about.values.items.map((value) => (
              <li key={value.title} className="flex flex-col gap-3 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-key)] bg-surface-raised text-heading shadow-[var(--shadow-key)]">
                  <CmsIcon icon={value.icon} className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="text-xl text-heading">{value.title}</h3>
                {value.description && <p className="text-ink-soft">{value.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
