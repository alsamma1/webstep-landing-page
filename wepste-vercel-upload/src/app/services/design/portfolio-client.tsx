'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, ArrowUpLeft, Check, Layers3, Play, Sparkles, Workflow } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { UiuxDesign } from '@/data/uiux-designs'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import { useRegion } from '@/components/providers/RegionProvider'

const packages = [
  { key: 'design_uiux', label: 'واجهات UI/UX', price: '١٬٥٠٠', description: 'Figma Prototype كامل وجاهز للتطوير', features: ['بحث وتجهيز تدفق المستخدم', 'Wireframes وواجهات عالية الدقة', 'نظام تصميم ومكونات', 'Prototype قابل للتفاعل'], featured: true },
  { key: 'design_identity', label: 'هوية بصرية', price: '٨٠٠', description: 'هوية مرئية متناسقة وقابلة للتوسع', features: ['اتجاهات تصميم أولية', 'شعار ودليل استخدام الهوية', 'ألوان وخطوط معتمدة', 'تسليم الأصول الرقمية'], featured: false },
  { key: 'design_uxaudit', label: 'مراجعة تجربة UX', price: '٢٬٠٠٠', description: 'تدقيق تجربة منتجك وتحديد فرص التحسين', features: ['مراجعة قابلية الاستخدام', 'خريطة نقاط التعثر', 'توصيات مرتبة بالأولوية', 'تصور للحلول المقترحة'], featured: false },
]

function DesignImage({ src, alt, className, sizes }: { src: string; alt: string; className: string; sizes: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={shouldSkipNextImageOptimization(src)} className={className} />
}

export default function UiuxPortfolio({ designs, errorMessage }: { designs: UiuxDesign[]; errorMessage?: string }) {
  const { contact, isYemen, geoSettings } = useRegion()
  const wa = contact.whatsapp || '966593672193'
  const yerRate = geoSettings.pricing.yerExchangeRate || 450
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepstep.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مشاريع تصميم واجهات وتجارب المستخدم UI/UX',
    itemListElement: designs.map((design, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: design.title,
      url: `${baseUrl}/services/design/${design.slug}`,
      image: design.coverImage || undefined,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Navbar />
      <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
        <section className="relative isolate overflow-hidden bg-[#101611] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(31,138,84,.28),transparent_38%),radial-gradient(ellipse_at_85%_84%,rgba(99,102,241,.2),transparent_38%)]" />
          <div className="absolute inset-0 opacity-[.09]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="container-ws relative grid min-h-[670px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-emerald-200"><Sparkles size={15} /> WebStep Design Studio · UI / UX</div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.2] tracking-tight sm:text-6xl lg:text-7xl">نصمم تجارب<br /><span className="text-emerald-300">تبدو بديهية.</span><br />وتعمل بذكاء.</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">واجهات رقمية جميلة تنطلق من احتياج المستخدم وتتحول إلى منتجات واضحة، قابلة للتطوير، ومهيأة لكل شاشة.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#design-work" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-white transition hover:bg-emerald-400">استكشف المشاريع <ArrowDown size={16} /></a>
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent('مرحباً، أرغب باستشارة لتصميم UI/UX')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">ابدأ مشروعك <ArrowUpLeft size={16} /></a>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/15 pt-6">
                {[['01', 'بحث وفهم'], ['02', 'تصميم واختبار'], ['03', 'تسليم للمطور']].map(([n, text]) => <div key={n} className="flex items-center gap-2 text-xs font-bold text-white/70"><span className="text-emerald-300">{n}</span>{text}</div>)}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-[2rem] bg-emerald-400/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/[.06] p-3 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-[#f7f7f2] p-4 text-[#151715] sm:p-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /></div><span className="text-[10px] font-black tracking-widest text-black/45">FIGMA · DESIGN CANVAS</span></div>
                  <div className="grid min-h-72 grid-cols-[.65fr_1fr] gap-3 py-4">
                    <div className="space-y-3 rounded-2xl bg-[#e5ebdf] p-4"><div className="h-3 w-2/3 rounded bg-[#193a2a]" /><div className="h-2 w-full rounded bg-black/10" /><div className="h-2 w-4/5 rounded bg-black/10" /><div className="mt-8 grid grid-cols-2 gap-2">{['#1F8A54','#d9eadf','#101611','#f1b75c'].map(c => <div key={c} className="aspect-square rounded-xl" style={{ backgroundColor: c }} />)}</div><div className="h-8 rounded-lg bg-[#1F8A54]" /></div>
                    <div className="flex flex-col justify-between rounded-2xl bg-[#15251b] p-4 text-white"><div><span className="text-[10px] font-bold text-emerald-300">DESIGN SYSTEM / 2026</span><h2 className="mt-5 text-2xl font-black leading-tight">Make it<br />feel simple.</h2><p className="mt-3 text-[10px] leading-5 text-white/60">Each detail is a decision. Build for real people.</p></div><div className="flex items-end gap-2"><div className="h-16 flex-1 rounded-t-lg bg-emerald-400/80" /><div className="h-24 flex-1 rounded-t-lg bg-emerald-400" /><div className="h-12 flex-1 rounded-t-lg bg-amber-300" /><div className="h-20 flex-1 rounded-t-lg bg-indigo-300" /></div></div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"><span className="inline-flex items-center gap-2 text-xs font-black"><Layers3 size={15} className="text-emerald-600" /> Design system ready</span><span className="text-[10px] font-bold text-black/40">Auto Layout · Components</span></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl border border-white/15 bg-[#18231b] px-4 py-3 shadow-xl sm:-right-7"><div className="flex items-center gap-2 text-xs font-bold"><Workflow size={15} className="text-emerald-300" /> من البحث إلى prototype</div></div>
            </div>
          </div>
        </section>

        <section id="design-work" className="container-ws py-16 sm:py-24">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><div className="mb-2 text-xs font-black tracking-widest text-emerald-600">SELECTED WORK · 2026</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-5xl">تصاميم، وراء كل منها فكرة.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">استكشف دراسات الحالة والصور والميزات والتفاصيل التفاعلية لكل مشروع.</p></div>
            <span className="text-sm font-bold text-[var(--text-muted)]">{designs.length.toLocaleString('ar-SA')} مشاريع منشورة</span>
          </div>
          {errorMessage && <div role="alert" className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">{errorMessage} شغّل ملف الترحيل الخاص بالتصاميم في Supabase SQL Editor.</div>}
          {designs.length === 0 ? <div className="rounded-3xl border border-dashed border-[var(--border-strong)] p-12 text-center"><p className="font-bold text-[var(--text-primary)]">لا توجد تصاميم منشورة حتى الآن.</p><p className="mt-2 text-sm text-[var(--text-muted)]">أضف مشاريعك من لوحة تحكم UI/UX بعد تهيئة جدول Supabase.</p></div> : (
            <div className="grid gap-6 md:grid-cols-2">
              {designs.map((design, index) => <Link key={design.id} href={`/services/design/${design.slug}`} className={`group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_.8fr]' : ''}`}>
                <div className={`relative overflow-hidden bg-[var(--bg-muted)] ${index === 0 ? 'min-h-72 md:min-h-[430px]' : 'aspect-[1.45]'}`}>
                  {design.coverImage ? <DesignImage src={design.coverImage} alt={design.title} className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes={index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 50vw'} /> : <div className="absolute inset-0 grid place-items-center text-7xl font-black text-white" style={{ background: `linear-gradient(135deg, ${design.accentColor}, #101611)` }}>{design.title.slice(0, 1)}</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />
                  <span className="absolute right-5 top-5 rounded-full px-3 py-1.5 text-[10px] font-black text-white shadow" style={{ backgroundColor: design.accentColor }}>{design.category}</span>
                  <span className="absolute bottom-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur transition group-hover:bg-emerald-500"><ArrowLeft size={18} /></span>
                </div>
                <div className={`flex flex-col justify-center p-6 sm:p-8 ${index === 0 ? 'md:p-10' : ''}`}>
                  <div className="text-[10px] font-black tracking-[.2em] text-emerald-600">CASE STUDY / {String(index + 1).padStart(2, '0')}</div>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-[var(--text-primary)] sm:text-3xl">{design.title}</h3>
                  {design.titleEn && <p dir="ltr" className="mt-1 text-xs font-bold text-[var(--text-muted)]">{design.titleEn}</p>}
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{design.summary}</p>
                  {design.outcome && <p className="mt-5 border-r-2 pr-3 text-xs font-bold leading-6 text-emerald-700" style={{ borderColor: design.accentColor }}>{design.outcome}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">{design.tags.slice(0, 4).map(tag => <span key={tag} className="rounded-lg bg-[var(--bg-muted)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">{tag}</span>)}</div>
                  <div className="mt-7 flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">استكشف دراسة الحالة <ArrowLeft size={15} className="text-emerald-600 transition group-hover:-translate-x-1" /></div>
                </div>
              </Link>)}
            </div>
          )}
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--bg-soft)] py-16 sm:py-24">
          <div className="container-ws"><div className="mb-9"><div className="mb-2 text-xs font-black text-emerald-600">DESIGN SERVICES</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">اختَر نقطة البداية.</h2><p className="mt-3 text-sm text-[var(--text-secondary)]">باقات واضحة نضبط نطاقها النهائي بعد جلسة فهم احتياجك.</p></div>
            <div className="grid gap-4 lg:grid-cols-3">
              {packages.map(pkg => {
                const clean = pkg.price.replace(/[^\d\u0660-\u0669]/g, '')
                const western = clean.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 1632))
                const num = parseInt(western, 10) || 0
                const customYer = pkg.key ? geoSettings.pricing.customPackagePrices?.[pkg.key]?.yer : undefined
                const displayPrice = isYemen
                  ? (customYer && customYer > 0 ? customYer.toLocaleString('ar-YE') : Math.round(num * yerRate).toLocaleString('ar-YE'))
                  : pkg.price
                const unit = isYemen ? 'ر.ي' : 'ر.س'

                return (
                  <article key={pkg.label} className={`flex flex-col rounded-3xl border p-6 ${pkg.featured ? 'border-emerald-500 bg-emerald-500/[.06] shadow-lg' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                    <h3 className="text-lg font-black text-[var(--text-primary)]">{pkg.label}</h3>
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">{pkg.description}</p>
                    <div className="my-5 border-b border-[var(--border)] pb-5 text-3xl font-black text-emerald-700">
                      {displayPrice} <span className="text-xs text-[var(--text-muted)]">{unit} · تبدأ من</span>
                    </div>
                    <ul className="mb-6 flex-1 space-y-3">
                      {pkg.features.map(feature => (
                        <li key={feature} className="flex gap-2 text-xs text-[var(--text-secondary)]">
                          <Check size={14} className="shrink-0 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-xs font-black text-[var(--text-primary)] hover:bg-emerald-500 hover:text-white transition" href={`https://wa.me/${wa}?text=${encodeURIComponent(`أرغب بالاستفسار عن ${pkg.label}`)}`} target="_blank" rel="noreferrer">
                      ناقش المشروع <ArrowUpLeft size={14} />
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        <section className="container-ws py-14">
          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#101611] p-7 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300"><Play size={14} /> MAKE IT CLEAR</div>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">هل لديك منتج يحتاج تجربة أفضل؟</h2>
              <p className="mt-2 text-sm text-white/60">نبدأ بفهم المشكلة، ثم نصمم الحل الذي يحتاجه المستخدم.</p>
            </div>
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent('أرغب بمناقشة مشروع UI/UX')}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black hover:bg-emerald-600 transition">
              احجز استشارة <ArrowUpLeft size={16} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
