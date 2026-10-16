'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, Check, ChevronDown, Layers3, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { ManagedServiceContent, ManagedServiceKey } from '@/data/managed-services'
import { SERVICE_CONFIG } from '@/data/managed-services'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import { useRegion } from '@/components/providers/RegionProvider'

const icons = [Sparkles, Workflow, Layers3, ShieldCheck]

function formatCatalogPrice(priceStr: string, isYemen: boolean, yerRate = 450, customYer?: number) {
  if (!isYemen) return priceStr
  if (customYer && customYer > 0) return `${customYer.toLocaleString('ar-YE')} ر.ي`
  const easternToArabic = (s: string) => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
  const clean = easternToArabic(priceStr).replace(/[^0-9]/g, '')
  const num = parseInt(clean, 10)
  if (!num || isNaN(num)) return priceStr
  return `${(num * yerRate).toLocaleString('ar-YE')} ر.ي`
}

function schemaForService(key: ManagedServiceKey, content: ManagedServiceContent) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepstep.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SERVICE_CONFIG[key].name} — دراسات ومشاريع`,
    itemListElement: content.projects.filter(project => project.published).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: `${baseUrl}${SERVICE_CONFIG[key].path}/${project.slug}`,
      image: project.coverImage || undefined,
    })),
  }
}

export default function ServiceCatalog({ serviceKey, content, errorMessage }: {
  serviceKey: ManagedServiceKey
  content: ManagedServiceContent
  errorMessage?: string
}) {
  const { contact, isYemen, geoSettings } = useRegion()
  const config = SERVICE_CONFIG[serviceKey]
  const projects = content.projects.filter(project => project.published).sort((a, b) => a.sortOrder - b.sortOrder)
  const featuredProject = projects.find(project => project.featured)
  const otherProjects = projects.filter(project => project.id !== featuredProject?.id)
  const wa = contact.whatsapp || '966593672193'

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaForService(serviceKey, content)).replace(/</g, '\\u003c') }} />
    <Navbar />
    <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
      {errorMessage && <div role="status" className="container-ws mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">{errorMessage}</div>}
      <section className="relative isolate overflow-hidden bg-[#0b1510] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(31,138,84,.32),transparent_38%),radial-gradient(ellipse_at_88%_85%,rgba(99,102,241,.18),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[.075]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="container-ws relative grid min-h-[650px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />{content.hero.eyebrow || config.name}</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">{content.hero.title}<br /><span className="bg-gradient-to-l from-emerald-200 via-emerald-400 to-lime-300 bg-clip-text text-transparent">{content.hero.highlight}</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">{content.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#service-work" className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-6 py-3.5 text-sm font-black text-white transition hover:bg-emerald-500">{content.hero.primaryCta}<ArrowLeft size={15} /></a>
              <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`أرغب بمناقشة مشروع: ${config.name}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">{content.hero.secondaryCta}<ArrowUpLeft size={15} /></a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-5 text-xs font-semibold text-white/55">{['نطاق واضح', 'تصميم متجاوب', 'تسليم موثق'].map(item => <span className="inline-flex items-center gap-2" key={item}><Check size={14} className="text-emerald-300" />{item}</span>)}</div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[.06] p-3 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-[#f4f5f0] p-4 text-[#151915] sm:p-6">
                <div className="flex items-center justify-between border-b border-black/10 pb-4"><span className="text-[10px] font-black tracking-[.2em] text-black/45">WEBSTEP / {serviceKey.toUpperCase()}</span><span className="flex gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" /><i className="h-2 w-2 rounded-full bg-amber-400" /><i className="h-2 w-2 rounded-full bg-rose-400" /></span></div>
                <div className="grid min-h-72 gap-4 py-5 sm:grid-cols-[.8fr_1.2fr]">
                  <div className="flex flex-col justify-between rounded-2xl bg-[#e8eee7] p-4"><div><span className="text-[9px] font-black tracking-widest text-emerald-800">DIGITAL EXPERIENCE</span><h2 className="mt-4 text-xl font-black leading-tight">{config.title}<br />على مقاس عملك</h2><p className="mt-2 text-[10px] leading-5 text-black/50">تصميم واضح، بنية عملية، وخطوات أقرب لهدفك.</p></div><div className="h-8 rounded-lg bg-[#1F8A54]" /></div>
                  <div className="relative min-h-52 overflow-hidden rounded-2xl bg-[#12241a] p-4 text-white"><span className="text-[9px] font-bold text-emerald-300">WORKSPACE / 01</span><div className="mt-4 grid grid-cols-2 gap-2">{[0, 1, 2, 3].map(index => <div key={index} className="rounded-xl border border-white/10 bg-white/[.07] p-3"><div className="h-2 w-8 rounded bg-emerald-300/80" /><div className="mt-3 h-2 w-full rounded bg-white/15" /><div className="mt-1.5 h-2 w-2/3 rounded bg-white/10" /></div>)}</div><div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[9px] font-bold"><Layers3 size={12} className="text-emerald-300" />Built for real workflows</div></div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"><span className="text-[10px] font-black">Explore the experience</span><span className="text-[9px] font-bold text-black/40">RESPONSIVE · SCALABLE</span></div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 rounded-xl border border-white/10 bg-[#15231a] px-4 py-3 text-[11px] font-bold text-white shadow-xl sm:-right-6"><span className="inline-flex items-center gap-2"><Workflow size={14} className="text-emerald-300" />من الفكرة إلى الإطلاق</span></div>
          </div>
        </div>
      </section>

      <section className="container-ws grid gap-8 py-16 sm:py-20 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-xs font-black tracking-widest text-emerald-600">{content.intro.eyebrow}</p><h2 className="mt-3 text-3xl font-black leading-tight text-[var(--text-primary)] sm:text-4xl">{content.intro.title}</h2></div>
        <p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{content.intro.description}</p>
      </section>

      <section className="bg-[var(--bg-soft)] py-16 sm:py-20"><div className="container-ws">
        <div className="mb-9"><p className="text-xs font-black tracking-widest text-emerald-600">CAPABILITIES</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">أساس متين لتجربة أفضل.</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{content.capabilities.map((item, index) => { const Icon = icons[index % icons.length]; return <article key={`${item.title}-${index}`} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700"><Icon size={20} /></span><h3 className="mt-5 text-base font-black text-[var(--text-primary)]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p></article> })}</div>
      </div></section>

      <section id="service-work" className="container-ws py-16 sm:py-24">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black tracking-widest text-emerald-600">SELECTED WORK</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)] sm:text-4xl">مشاريع وأفكار قابلة للاستكشاف.</h2><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">تصفح التفاصيل والصور والمميزات في صفحة مستقلة لكل مشروع.</p></div><span className="text-xs font-bold text-[var(--text-muted)]">{projects.length} مشروع</span></div>
        {projects.length === 0 ? <div className="rounded-3xl border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-muted)]">لا توجد مشاريع منشورة حالياً.</div> : <div className="space-y-5">
          {featuredProject && <ProjectCard serviceKey={serviceKey} project={featuredProject} featured />}
          {otherProjects.length > 0 && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{otherProjects.map(project => <ProjectCard key={project.id} serviceKey={serviceKey} project={project} />)}</div>}
        </div>}
      </section>

      <section className="border-y border-[var(--border)] bg-[#0b1510] py-16 text-white sm:py-20"><div className="container-ws"><div className="mb-9"><p className="text-xs font-black tracking-widest text-emerald-300">HOW WE WORK</p><h2 className="mt-2 text-3xl font-black">خطوات عملية من البداية للنهاية.</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{content.process.map((step, index) => <article key={`${step.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-xs font-black text-emerald-300">0{index + 1}</span><h3 className="mt-4 font-black">{step.title}</h3><p className="mt-2 text-xs leading-6 text-white/55">{step.description}</p></article>)}</div></div></section>

      <section className="container-ws py-16 sm:py-24"><div className="mb-9"><p className="text-xs font-black tracking-widest text-emerald-600">ENGAGEMENT OPTIONS</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">ابدأ بالنطاق المناسب.</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">التكلفة والمدة النهائية تُعتمد بعد مراجعة المتطلبات والتكاملات.</p></div><div className="grid gap-4 lg:grid-cols-3">{content.packages.map(pkg => <article key={pkg.id} className={`flex flex-col rounded-3xl border p-6 ${pkg.featured ? 'border-emerald-500 bg-emerald-500/[.06] shadow-lg' : 'border-[var(--border)] bg-[var(--surface)]'}`}><h3 className="text-lg font-black text-[var(--text-primary)]">{pkg.name}</h3><div className="mt-4 text-2xl font-black text-emerald-700">{formatCatalogPrice(pkg.price, isYemen, geoSettings.pricing.yerExchangeRate || 450, geoSettings.pricing.customPackagePrices?.[pkg.id]?.yer)}<span className="mr-2 text-[10px] font-bold text-[var(--text-muted)]">{pkg.period}</span></div><p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">{pkg.description}</p><ul className="my-6 flex-1 space-y-3">{pkg.features.map(feature => <li key={feature} className="flex gap-2 text-xs leading-5 text-[var(--text-secondary)]"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />{feature}</li>)}</ul><a href={`https://wa.me/${wa}?text=${encodeURIComponent(`أرغب بالاستفسار عن ${pkg.name} لخدمة ${config.name}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-xs font-black text-[var(--text-primary)] hover:bg-emerald-600 hover:text-white">ناقش الخيار <ArrowUpLeft size={14} /></a></article>)}</div></section>

      <section className="bg-[var(--bg-soft)] py-16"><div className="container-ws grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black tracking-widest text-emerald-600">COMMON QUESTIONS</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">أسئلة شائعة.</h2></div><div className="space-y-3">{content.faqs.map((faq, index) => <details key={`${faq.question}-${index}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[var(--text-primary)]">{faq.question}<ChevronDown size={16} className="shrink-0 transition group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{faq.answer}</p></details>)}</div></div></section>
      <section className="container-ws py-14"><div className="flex flex-col justify-between gap-5 rounded-3xl bg-[#0b1510] p-7 text-white sm:flex-row sm:items-center sm:p-10"><div><p className="text-xs font-black tracking-widest text-emerald-300">LET&apos;S BUILD SOMETHING USEFUL</p><h2 className="mt-3 text-2xl font-black sm:text-3xl">لديك تحدٍ رقمي؟ لنرسم الحل معاً.</h2><p className="mt-2 text-sm text-white/55">شاركنا سياق مشروعك وسنساعدك على تحديد الخطوة الأولى.</p></div><a href={`https://wa.me/${wa}?text=${encodeURIComponent(`أرغب ببدء مشروع ${config.name}`)}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black">ابدأ المحادثة <ArrowUpLeft size={15} /></a></div></section>
    </main>
    <Footer />
  </>
}

function ProjectCard({ serviceKey, project, featured = false }: {
  serviceKey: ManagedServiceKey
  project: ManagedServiceContent['projects'][number]
  featured?: boolean
}) {
  const src = project.coverImage
  return <Link href={`${SERVICE_CONFIG[serviceKey].path}/${project.slug}`} className={`group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${featured ? 'md:grid md:grid-cols-[1.15fr_.85fr]' : 'flex flex-col'}`}>
    <div className={`relative overflow-hidden bg-[var(--bg-muted)] ${featured ? 'min-h-64 md:min-h-[410px]' : 'aspect-[1.55]'}`}>
      {src ? <Image src={src} alt={project.title} fill sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'} unoptimized={shouldSkipNextImageOptimization(src)} className="object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="absolute inset-0 grid place-items-center text-6xl font-black text-white" style={{ background: `linear-gradient(130deg,${project.accentColor},#101611)` }}>{project.title.slice(0, 1)}</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" /><span className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black text-white" style={{ background: project.accentColor }}>{project.category}</span>
    </div>
    <div className="flex flex-1 flex-col justify-center p-6 sm:p-7"><p className="text-[10px] font-black tracking-widest text-emerald-600">CASE STUDY / {project.titleEn || SERVICE_CONFIG[serviceKey].title}</p><h3 className="mt-3 text-xl font-black text-[var(--text-primary)] sm:text-2xl">{project.title}</h3><p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.slice(0, 4).map(tag => <span key={tag} className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">{tag}</span>)}</div><span className="mt-6 inline-flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">عرض التفاصيل والصور <ArrowLeft size={14} className="text-emerald-600 transition group-hover:-translate-x-1" /></span></div>
  </Link>
}
