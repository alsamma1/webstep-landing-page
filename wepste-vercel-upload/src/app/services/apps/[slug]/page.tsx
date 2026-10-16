import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  ArrowRight, Check, Download, ExternalLink, Image as ImageIcon,
  Play, QrCode, Smartphone, Star,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getYouTubeEmbedUrl, type MobileApp } from '@/data/mobile-apps'
import { getMobileAppsCatalog } from '@/lib/mobile-apps-server'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

async function findPublishedApp(slug: string): Promise<MobileApp | null> {
  const { apps } = await getMobileAppsCatalog()
  return apps.find(app => app.slug === slug && app.published) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const app = await findPublishedApp(slug)
  if (!app) return { title: 'التطبيق غير موجود | WebStep', robots: { index: false, follow: false } }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepstep.sa'
  const title = app.seoTitle || app.name
  const description = app.seoDescription || app.description
  const url = `${baseUrl}/services/apps/${app.slug}`
  return {
    title,
    description,
    keywords: [app.name, app.nameEn, app.category, 'تطبيقات جوال', 'WebStep'].filter(Boolean),
    alternates: { canonical: url, languages: { 'ar-SA': url } },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url,
      siteName: 'WebStep',
      title,
      description,
      images: app.coverImage ? [{ url: app.coverImage, alt: app.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: app.coverImage ? [app.coverImage] : undefined,
    },
  }
}

export default async function MobileAppDetailPage({ params }: PageProps) {
  const { slug } = await params
  const app = await findPublishedApp(slug)
  if (!app) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepstep.sa'
  const pageUrl = `${baseUrl}/services/apps/${app.slug}`
  const videoEmbedUrl = getYouTubeEmbedUrl(app.videoUrl)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    alternateName: app.nameEn || undefined,
    description: app.seoDescription || app.description,
    applicationCategory: app.category,
    operatingSystem: [app.iosUrl && 'iOS', app.androidUrl && 'Android'].filter(Boolean).join(', ') || 'iOS, Android',
    image: [app.iconUrl, app.coverImage, ...app.screenshots].filter(Boolean),
    url: pageUrl,
    inLanguage: 'ar-SA',
    publisher: { '@type': 'Organization', name: 'WebStep', url: baseUrl },
    offers: app.purchasePrice ? {
      '@type': 'Offer',
      description: app.purchasePrice,
      priceCurrency: 'SAR',
      url: pageUrl,
    } : undefined,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'التطبيقات', item: `${baseUrl}/services/apps` },
      { '@type': 'ListItem', position: 3, name: app.name, item: pageUrl },
    ],
  }
  const jsonLd = JSON.stringify([schema, breadcrumbSchema]).replace(/</g, '\\u003c')
  const downloadUrl = app.downloadUrl || app.androidUrl || app.iosUrl
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '966500000000'

  return (
    <>
      <Navbar />
      <main dir="rtl" className="overflow-hidden pb-20 pt-24 text-right sm:pb-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-ws pt-5">
          <Link href="/services/apps" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] transition hover:text-[#1F8A54]"><ArrowRight size={14} /> كل التطبيقات</Link>
        </div>

        <section className="relative mt-5 overflow-hidden border-y border-[var(--border)] bg-[var(--bg-soft)]">
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 20% 15%, ${app.accentColor}, transparent 55%)` }} />
          <div className="container-ws relative grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_.9fr] lg:gap-14 lg:py-16">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                {app.badge && <span className="rounded-full px-3 py-1.5 text-white" style={{ backgroundColor: app.accentColor }}>{app.badge}</span>}
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[var(--text-secondary)]">{app.category}</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] text-2xl font-black text-white shadow-lg sm:h-20 sm:w-20" style={!app.iconUrl ? { backgroundColor: app.accentColor } : undefined}>
                  {app.iconUrl ? <Image src={app.iconUrl} alt={`أيقونة ${app.name}`} fill unoptimized={shouldSkipNextImageOptimization(app.iconUrl)} sizes="80px" className="object-cover" /> : app.name.slice(0, 1)}
                </div>
                <div>
                  {app.nameEn && <div dir="ltr" className="text-xs font-bold text-[var(--text-muted)]">{app.nameEn}</div>}
                  <h1 className="mt-1 text-2xl font-black leading-tight text-[var(--text-primary)] sm:text-4xl">{app.name}</h1>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">{app.description}</p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-[var(--text-secondary)]">
                {app.rating && <span className="inline-flex items-center gap-1.5 text-amber-500"><Star size={14} fill="currentColor" />{app.rating}</span>}
                {app.size && <span>{app.size}</span>}
                {app.downloads && <span>{app.downloads} تنزيل</span>}
                <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-[#1F8A54]" /> مصمم للجوال</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {downloadUrl && <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"><Download size={16} /> تنزيل التطبيق <ExternalLink size={13} /></a>}
                {app.iosUrl && <a href={app.iosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54]"><ExternalLink size={14} /> App Store</a>}
                {app.androidUrl && <a href={app.androidUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54]"><ExternalLink size={14} /> Google Play</a>}
              </div>
              {app.purchasePrice && <p className="mt-4 text-xs font-bold text-[#1F8A54]">{app.purchasePrice}</p>}
            </div>

            <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)]">
              {app.coverImage ? <Image src={app.coverImage} alt={`واجهة ${app.name}`} fill unoptimized={shouldSkipNextImageOptimization(app.coverImage)} priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <div className="grid min-h-72 place-items-center rounded-[1.25rem] bg-[var(--bg-muted)] text-[var(--text-muted)]"><Smartphone size={54} /></div>}
            </div>
          </div>
        </section>

        <div className="container-ws grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:py-16">
          <div className="space-y-14">
            {app.screenshots.length > 0 && (
              <section aria-labelledby="screenshots-heading">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div><p className="mb-1 text-xs font-bold text-[#1F8A54]">من داخل التطبيق</p><h2 id="screenshots-heading" className="text-2xl font-black text-[var(--text-primary)]">لقطات وتجربة الاستخدام</h2></div>
                  <ImageIcon size={20} className="text-[#1F8A54]" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {app.screenshots.map((src, index) => (
                    <figure key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                      <Image src={src} alt={`${app.name} - لقطة شاشة ${index + 1}`} width={500} height={625} unoptimized={shouldSkipNextImageOptimization(src)} sizes="(max-width: 640px) 50vw, 33vw" className="aspect-[4/5] w-full object-cover transition hover:scale-[1.02]" />
                      <figcaption className="px-3 py-2 text-[11px] text-[var(--text-muted)]">لقطة شاشة {index + 1}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="features-heading">
              <p className="mb-1 text-xs font-bold text-[#1F8A54]">مصمم لاحتياجاتك</p>
              <h2 id="features-heading" className="text-2xl font-black text-[var(--text-primary)]">المميزات الرئيسية</h2>
              {app.features.length ? (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {app.features.map((feature, index) => (
                    <li key={`${feature.title}-${index}`} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1F8A54]/10 text-[#1F8A54]"><Check size={16} /></span>
                      <span><strong className="block text-sm font-bold text-[var(--text-primary)]">{feature.title}</strong>{feature.description && <span className="mt-1 block text-xs leading-6 text-[var(--text-secondary)]">{feature.description}</span>}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm text-[var(--text-secondary)]">تواصل معنا لمعرفة تفاصيل التطبيق وميزاته.</p>}
            </section>

            {videoEmbedUrl && (
              <section aria-labelledby="video-heading">
                <div className="mb-4 flex items-center gap-2"><Play size={18} className="text-red-500" /><h2 id="video-heading" className="text-2xl font-black text-[var(--text-primary)]">شاهد التطبيق</h2></div>
                <div className="aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-[var(--shadow-md)]">
                  <iframe src={videoEmbedUrl} title={`فيديو شرح ${app.name}`} className="h-full w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
              <h2 className="text-base font-black text-[var(--text-primary)]">احصل على التطبيق</h2>
              <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">اختر طريقة التنزيل المناسبة أو امسح رمز QR من هاتفك.</p>
              <div className="mt-4 space-y-2">
                {app.iosUrl && <a href={app.iosUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-3 text-xs font-bold text-[var(--text-primary)] hover:border-[#1F8A54]"><span>التنزيل من App Store</span><ExternalLink size={14} /></a>}
                {app.androidUrl && <a href={app.androidUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-3 text-xs font-bold text-[var(--text-primary)] hover:border-[#1F8A54]"><span>التنزيل من Google Play</span><ExternalLink size={14} /></a>}
                {app.downloadUrl && <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center justify-center gap-2 px-4 py-3 text-xs"><Download size={15} /> تحميل مباشر</a>}
                {!downloadUrl && <p className="rounded-xl bg-[var(--bg-muted)] p-3 text-xs leading-6 text-[var(--text-muted)]">روابط التنزيل غير متاحة حالياً. تواصل معنا للحصول عليها.</p>}
              </div>
            </div>

            {app.qrImageUrl && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-[var(--shadow-sm)]">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm font-black text-[var(--text-primary)]"><QrCode size={17} className="text-[#1F8A54]" /> امسح لتنزيل التطبيق</div>
                {downloadUrl ? (
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer" aria-label={`مسح QR وتنزيل ${app.name}`}>
                    <Image src={app.qrImageUrl} alt={`رمز QR لتنزيل ${app.name}`} width={176} height={176} unoptimized className="mx-auto aspect-square w-44 rounded-lg border border-[var(--border)] object-contain p-2" />
                  </a>
                ) : <Image src={app.qrImageUrl} alt={`رمز QR للتطبيق ${app.name}`} width={176} height={176} unoptimized className="mx-auto aspect-square w-44 rounded-lg border border-[var(--border)] object-contain p-2" />}
                <p className="mt-3 text-[11px] leading-5 text-[var(--text-muted)]">وجّه كاميرا هاتفك إلى الرمز لفتح رابط التنزيل.</p>
              </div>
            )}

            {(app.purchasePrice || app.subscriptionPrice) && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
                <h2 className="text-sm font-black text-[var(--text-primary)]">خيارات التملك</h2>
                {app.purchasePrice && <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">ملكية:</strong> {app.purchasePrice}</p>}
                {app.subscriptionPrice && <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">سحابي:</strong> {app.subscriptionPrice}</p>}
                <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`مرحباً ويب ستيب، أريد الاستفسار عن ${app.name}`)}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54] hover:text-[#1F8A54]">استفسر عن التطبيق <ArrowRight size={14} /></a>
              </div>
            )}
          </aside>
        </div>
      </main>
      {downloadUrl && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 p-3 backdrop-blur sm:hidden"><a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center justify-center gap-2 py-3 text-sm"><Download size={16} /> تنزيل {app.name}</a></div>}
      <Footer />
    </>
  )
}
