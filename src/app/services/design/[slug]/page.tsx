import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpLeft, Check, ExternalLink, Images, Play, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getYouTubeEmbedUrl } from '@/data/uiux-designs'
import { getUiuxDesigns } from '@/lib/uiux-designs-server'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

async function findDesign(slug: string) {
  const designs = await getUiuxDesigns()
  return designs.find(design => design.slug === slug && design.published) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const design = await findDesign(slug)
  if (!design) return { title: 'التصميم غير موجود | WebStep', robots: { index: false, follow: false } }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const url = `${baseUrl}/services/design/${design.slug}`
  const title = design.seoTitle || `${design.title} | دراسة تصميم UI/UX`
  const description = design.seoDescription || design.summary
  return {
    title,
    description,
    keywords: [...design.tags, design.category, 'تصميم UI UX', 'WebStep'],
    alternates: { canonical: url, languages: { 'ar-SA': url } },
    openGraph: {
      type: 'article',
      locale: 'ar_SA',
      url,
      siteName: 'WebStep',
      title,
      description,
      images: design.coverImage ? [{ url: design.coverImage, alt: design.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: design.coverImage ? [design.coverImage] : undefined,
    },
  }
}

export default async function UiuxDesignDetailPage({ params }: PageProps) {
  const { slug } = await params
  const design = await findDesign(slug)
  if (!design) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const pageUrl = `${baseUrl}/services/design/${design.slug}`
  const images = [...new Set([design.coverImage, ...design.gallery].filter(Boolean))]
  const videoEmbed = getYouTubeEmbedUrl(design.videoUrl)
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: design.title,
      alternateName: design.titleEn || undefined,
      description: design.seoDescription || design.summary,
      url: pageUrl,
      image: images,
      genre: design.category,
      keywords: design.tags.join(', '),
      creator: { '@type': 'Organization', name: 'WebStep', url: baseUrl },
      inLanguage: 'ar-SA',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'تصميم UI/UX', item: `${baseUrl}/services/design` },
        { '@type': 'ListItem', position: 3, name: design.title, item: pageUrl },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Navbar />
      <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
        <section className="relative flex min-h-[calc(100svh-6rem)] items-end overflow-hidden bg-[#101611] text-white">
          {design.coverImage && <Image src={design.coverImage} alt={design.title} fill priority sizes="100vw" unoptimized={shouldSkipNextImageOptimization(design.coverImage)} className="object-cover opacity-45" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d0b] via-[#0a0d0b]/65 to-[#0a0d0b]/10" />
          <div className="container-ws relative z-10 pb-12 pt-8 sm:pb-20">
            <Link href="/services/design" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur transition hover:bg-white/10"><ArrowRight size={14} /> كل التصاميم</Link>
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full px-3 py-1.5 text-[11px] font-black text-white" style={{ backgroundColor: design.accentColor }}>{design.category}</span>{design.featured && <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[11px] font-bold text-amber-200"><Sparkles size={12} /> مشروع مميز</span>}</div>
              <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{design.title}</h1>
              {design.titleEn && <p dir="ltr" className="mt-3 text-sm font-semibold tracking-wide text-white/55">{design.titleEn}</p>}
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{design.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {design.figmaUrl && <a href={design.figmaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#101611]">معاينة التصميم <ExternalLink size={15} /></a>}
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '966500000000'}?text=${encodeURIComponent(`أرغب بمناقشة تصميم مشابه لمشروع ${design.title}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white">ناقش مشروعاً مشابهاً <ArrowUpLeft size={15} /></a>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-2">{design.tags.map(tag => <span key={tag} className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold text-white/75">{tag}</span>)}</div>
          </div>
        </section>

        <section className="container-ws grid gap-10 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
          <div><div className="mb-3 text-xs font-black tracking-widest text-emerald-600">THE THINKING</div><h2 className="text-3xl font-black leading-tight text-[var(--text-primary)]">التصميم يبدأ<br />بفهم المشكلة.</h2></div>
          <div><p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{design.description}</p>{design.outcome && <div className="mt-7 rounded-2xl border-r-4 bg-[var(--bg-soft)] p-5 text-sm font-bold leading-7 text-[var(--text-primary)]" style={{ borderColor: design.accentColor }}>{design.outcome}</div>}</div>
        </section>

        <section className="bg-[var(--bg-soft)] py-16 sm:py-24">
          <div className="container-ws">
            <div className="mb-8 flex items-end justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-2 text-xs font-black text-emerald-600"><Images size={15} /> VISUAL EXPLORATION</div><h2 className="text-3xl font-black text-[var(--text-primary)]">من داخل المشروع</h2></div><span className="text-xs font-bold text-[var(--text-muted)]">{images.length} صور</span></div>
            {images.length ? <div className="grid auto-rows-[220px] gap-4 sm:auto-rows-[280px] md:grid-cols-2 lg:auto-rows-[340px]">{images.map((image, index) => <figure key={image} className={`group relative overflow-hidden rounded-3xl bg-[var(--bg-muted)] ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}><Image src={image} alt={`${design.title} — صورة ${index + 1}`} fill sizes={index === 0 ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 100vw, 40vw'} unoptimized={shouldSkipNextImageOptimization(image)} className="object-cover transition duration-700 group-hover:scale-[1.025]" /><figcaption className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">{design.title} · {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div> : <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center text-sm text-[var(--text-muted)]">أضف صوراً للمشروع من لوحة إدارة UI/UX.</div>}
          </div>
        </section>

        {design.features.length > 0 && <section className="container-ws py-16 sm:py-24"><div className="mb-9"><div className="mb-2 text-xs font-black text-emerald-600">DESIGN DETAILS</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">تفاصيل التجربة</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{design.features.map((feature, index) => <div key={`${feature}-${index}`} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600"><Check size={16} /></span><p className="text-sm font-semibold leading-6 text-[var(--text-secondary)]">{feature}</p></div>)}</div></section>}

        {videoEmbed && <section className="bg-[#101611] py-16 text-white sm:py-24"><div className="container-ws"><div className="mb-7"><div className="mb-2 inline-flex items-center gap-2 text-xs font-black text-emerald-300"><Play size={14} /> PROJECT WALKTHROUGH</div><h2 className="text-3xl font-black sm:text-4xl">شاهد التصميم أثناء العمل</h2></div><div className="mx-auto aspect-video max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"><iframe src={videoEmbed} title={`فيديو شرح ${design.title}`} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div></section>}

        <section className="container-ws py-14"><div className="flex flex-col justify-between gap-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="text-xs font-black text-emerald-600">NEXT PROJECT</p><h2 className="mt-2 text-2xl font-black text-[var(--text-primary)]">هل تريد تجربة مماثلة لمنتجك؟</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">نساعدك في تحويل احتياجات المستخدم إلى تصميم جاهز للتنفيذ.</p></div><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '966500000000'}?text=${encodeURIComponent('أرغب باستشارة حول تصميم UI/UX')}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white">ابدأ الحديث <ArrowUpLeft size={15} /></a></div></section>
      </main>
      <Footer />
    </>
  )
}
