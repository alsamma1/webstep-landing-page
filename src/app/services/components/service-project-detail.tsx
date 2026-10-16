import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpLeft, Check, ExternalLink, Images, Play, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getYouTubeEmbedUrl } from '@/data/uiux-designs'
import { SERVICE_CONFIG, type ManagedServiceKey } from '@/data/managed-services'
import { findManagedProject } from '@/app/services/components/service-pages'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateManagedProjectMetadata(serviceKey: ManagedServiceKey, { params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { project } = await findManagedProject(serviceKey, slug)
  if (!project) return { title: 'المشروع غير موجود | WebStep', robots: { index: false, follow: false } }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const url = `${baseUrl}${SERVICE_CONFIG[serviceKey].path}/${project.slug}`
  const title = project.seoTitle || `${project.title} | ${SERVICE_CONFIG[serviceKey].name}`
  const description = project.seoDescription || project.summary
  return {
    title, description,
    keywords: [...project.tags, project.category, SERVICE_CONFIG[serviceKey].name, 'WebStep'],
    alternates: { canonical: url, languages: { 'ar-SA': url } },
    openGraph: {
      type: 'article', locale: 'ar_SA', url, siteName: 'WebStep', title, description,
      images: project.coverImage ? [{ url: project.coverImage, alt: project.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: project.coverImage ? [project.coverImage] : undefined },
  }
}

export async function ManagedServiceProjectDetail({ serviceKey, params }: {
  serviceKey: ManagedServiceKey
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { project } = await findManagedProject(serviceKey, slug)
  if (!project) notFound()
  const service = SERVICE_CONFIG[serviceKey]
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const pageUrl = `${baseUrl}${service.path}/${project.slug}`
  const gallery = [...new Set([project.coverImage, ...project.gallery].filter(Boolean))]
  const video = getYouTubeEmbedUrl(project.videoUrl)
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'CreativeWork',
      name: project.title, alternateName: project.titleEn || undefined,
      description: project.seoDescription || project.summary, url: pageUrl,
      image: gallery, genre: project.category, keywords: project.tags.join(', '),
      creator: { '@type': 'Organization', name: 'WebStep', url: baseUrl }, inLanguage: 'ar-SA',
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: service.name, item: `${baseUrl}${service.path}` },
        { '@type': 'ListItem', position: 3, name: project.title, item: pageUrl },
      ],
    },
  ]
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '966500000000'

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <Navbar />
    <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
      <section className="relative flex min-h-[calc(100svh-6rem)] items-end overflow-hidden bg-[#0b1510] text-white">
        {project.coverImage && <Image src={project.coverImage} alt={project.title} fill priority sizes="100vw" unoptimized={shouldSkipNextImageOptimization(project.coverImage)} className="object-cover opacity-45" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d09] via-[#080d09]/65 to-[#080d09]/10" />
        <div className="container-ws relative z-10 pb-12 pt-8 sm:pb-20">
          <Link href={service.path} className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur hover:bg-white/10"><ArrowRight size={14} /> العودة إلى {service.title}</Link>
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full px-3 py-1.5 text-[10px] font-black text-white" style={{ backgroundColor: project.accentColor }}>{project.category}</span>{project.featured && <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold text-amber-200"><Sparkles size={12} /> دراسة حالة مميزة</span>}</div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{project.title}</h1>
            {project.titleEn && <p dir="ltr" className="mt-3 text-sm font-semibold text-white/55">{project.titleEn}</p>}
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{project.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">{project.externalUrl && <a href={project.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#101611]">زيارة المشروع <ExternalLink size={15} /></a>}<a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`أرغب بمناقشة مشروع مشابه: ${project.title}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold">ناقش مشروعاً مشابهاً <ArrowUpLeft size={15} /></a></div>
          </div>
          <div className="mt-9 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold text-white/75">{tag}</span>)}</div>
        </div>
      </section>

      <section className="container-ws grid gap-8 py-16 sm:py-20 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-xs font-black tracking-widest text-emerald-600">PROJECT OVERVIEW</p><h2 className="mt-3 text-3xl font-black text-[var(--text-primary)]">فكرة واضحة.<br />تنفيذ مناسب.</h2></div>
        <div><p className="text-base leading-8 text-[var(--text-secondary)]">{project.description}</p>{project.outcome && <div className="mt-6 rounded-2xl border-r-4 bg-[var(--bg-soft)] p-5 text-sm font-bold leading-7 text-[var(--text-primary)]" style={{ borderColor: project.accentColor }}>{project.outcome}</div>}</div>
      </section>
      <section className="bg-[var(--bg-soft)] py-16 sm:py-20"><div className="container-ws"><div className="mb-8 flex items-end justify-between"><div><p className="inline-flex items-center gap-2 text-xs font-black text-emerald-600"><Images size={15} /> PROJECT GALLERY</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">صور وتفاصيل المشروع</h2></div><span className="text-xs font-bold text-[var(--text-muted)]">{gallery.length} صور</span></div>{gallery.length ? <div className="grid auto-rows-[220px] gap-4 sm:auto-rows-[300px] md:grid-cols-2 lg:auto-rows-[360px]">{gallery.map((image, index) => <figure key={image} className={`group relative overflow-hidden rounded-3xl bg-[var(--bg-muted)] ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}><Image src={image} alt={`${project.title} — صورة ${index + 1}`} fill sizes={index === 0 ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 100vw, 40vw'} unoptimized={shouldSkipNextImageOptimization(image)} className="object-cover transition duration-700 group-hover:scale-[1.025]" /><figcaption className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">{project.title} · {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div> : <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center text-sm text-[var(--text-muted)]">أضف صور المشروع من صفحة الإدارة.</div>}</div></section>
      {project.features.length > 0 && <section className="container-ws py-16 sm:py-20"><div className="mb-8"><p className="text-xs font-black tracking-widest text-emerald-600">KEY FEATURES</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">مكونات الحل</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{project.features.map((feature, index) => <div key={`${feature}-${index}`} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700"><Check size={15} /></span><p className="text-sm leading-6 text-[var(--text-secondary)]">{feature}</p></div>)}</div></section>}
      {video && <section className="bg-[#0b1510] py-16 text-white sm:py-20"><div className="container-ws"><p className="inline-flex items-center gap-2 text-xs font-black text-emerald-300"><Play size={14} /> PROJECT WALKTHROUGH</p><h2 className="mb-7 mt-2 text-3xl font-black">شاهد تفاصيل المشروع</h2><div className="mx-auto aspect-video max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"><iframe src={video} title={`فيديو ${project.title}`} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div></section>}
      <section className="container-ws py-14"><div className="flex flex-col justify-between gap-5 rounded-3xl bg-[#0b1510] p-7 text-white sm:flex-row sm:items-center sm:p-10"><div><p className="text-xs font-black text-emerald-300">LET&apos;S TALK</p><h2 className="mt-2 text-2xl font-black">هل تريد حلاً مشابهاً لعملك؟</h2></div><a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`أرغب بمناقشة ${service.name}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black">ابدأ النقاش <ArrowUpLeft size={15} /></a></div></section>
    </main>
    <Footer />
  </>
}
