import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, ChevronLeft, Code2, CloudCog, Rocket, Smartphone, Workflow } from 'lucide-react';
import { getServicePage, servicePages } from '../../../lib/service-pages';

const icons = {
  code: Code2,
  smartphone: Smartphone,
  cloud: CloudCog,
  rocket: Rocket,
  workflow: Workflow,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.description,
      url: `https://wepste.com/services/${service.slug}`,
      siteName: 'ويب ستيب',
      type: 'article',
      locale: 'ar_AR',
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  const Icon = icons[service.icon] || Code2;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `https://wepste.com/services/${service.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'ويب ستيب',
          url: 'https://wepste.com/',
        },
        areaServed: [
          ['SA', 'المملكة العربية السعودية'],
          ['AE', 'الإمارات العربية المتحدة'],
          ['QA', 'قطر'],
          ['KW', 'الكويت'],
          ['BH', 'البحرين'],
          ['OM', 'عُمان'],
          ['EG', 'مصر'],
          ['YE', 'اليمن'],
          ['JO', 'الأردن'],
          ['IQ', 'العراق'],
          ['MA', 'المغرب'],
          ['DZ', 'الجزائر'],
          ['TN', 'تونس'],
          ['LY', 'ليبيا'],
          ['SD', 'السودان'],
        ].map(([identifier, name]) => ({
          '@type': 'Country',
          name,
          identifier,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <ChevronLeft className="h-4 w-4" />
          الرئيسية
        </Link>

        <article className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:mt-8 sm:rounded-[2rem]">
          <header className="bg-gradient-to-bl from-emerald-50 via-white to-cyan-50 p-5 dark:from-emerald-950/50 dark:via-slate-900 dark:to-cyan-950/30 sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-bold text-emerald-700 dark:text-emerald-400">خدمات ويب ستيب للشركات</p>
            <h1 className="mt-2 max-w-3xl text-2xl font-black leading-relaxed text-slate-950 sm:text-4xl dark:text-white">{service.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">{service.intro}</p>
            <Link href="/#order" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
              ناقشنا مشروعك
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <div className="grid gap-8 p-5 sm:gap-10 sm:p-10 md:grid-cols-2">
            <section aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="text-lg font-black sm:text-xl">ما الذي نقدمه؟</h2>
              <ul className="mt-4 space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="process-heading">
              <h2 id="process-heading" className="text-lg font-black sm:text-xl">كيف نعمل؟</h2>
              <ol className="mt-4 space-y-3">
                {service.process.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section aria-labelledby="service-faq-heading" className="border-t border-slate-200 p-5 sm:p-10 dark:border-slate-800">
            <h2 id="service-faq-heading" className="text-lg font-black sm:text-xl">أسئلة شائعة عن {service.title}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.faqs.map(({ question, answer }) => (
                <details key={question} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <summary className="cursor-pointer text-sm font-bold leading-6">{question}</summary>
                  <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-300">{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <nav aria-label="خدمات أخرى" className="mt-5 flex flex-wrap gap-2">
          {servicePages.filter(({ slug: otherSlug }) => otherSlug !== slug).map((other) => (
            <Link key={other.slug} href={`/services/${other.slug}`} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400">
              {other.title}
              <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
