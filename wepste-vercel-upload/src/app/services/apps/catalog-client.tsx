'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowUpLeft, Check, Download, ExternalLink, Filter,
  Search, ShieldCheck, Smartphone, Sparkles, Star,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { MobileApp } from '@/data/mobile-apps'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import { useRegion } from '@/components/providers/RegionProvider'

const DEFAULT_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '966500000000'
const SERVICE_PACKAGES = [
  {
    key: 'apps_starter',
    name: 'باقة الانطلاق السريعة',
    price: '١٬٠٠٠',
    subtitle: 'حل خفيف وسريع للمشاريع الناشئة.',
    features: ['تطبيق PWA أو هجين سريع', 'يعمل على iOS وAndroid', 'ربط واتساب لاستقبال الطلبات', 'لوحة تحكم عربية', 'تصميم لهويتك البصرية', 'شهادة SSL'],
  },
  {
    key: 'apps_business',
    name: 'باقة الأعمال والخدمات',
    price: '٢٬٥٠٠',
    subtitle: 'تطبيقات أصلية لمتجرك أو نشاطك.',
    features: ['تطبيق iOS وAndroid', 'تكامل بوابات الدفع', 'إشعارات فورية', 'لوحة تحكم سحابية', 'حسابات وسجل طلبات', 'المساعدة على النشر بالمتاجر', 'دعم وصيانة ٦ أشهر'],
    featured: true,
  },
  {
    key: 'apps_pro',
    name: 'منظومة التطبيقات المتكاملة',
    price: '٥٬٠٠٠',
    subtitle: 'حل متكامل لشركات التوصيل والمنصات.',
    features: ['تطبيق العميل والمندوب', 'لوحة تحكم لإدارة الأسطول', 'تتبع GPS وإدارة الطلبات', 'إدارة التحصيل والفواتير', 'ملكية كاملة للسورس كود', 'تدريب فريق العمل', 'دعم فني ذو أولوية'],
  },
]

export default function MobileAppsCatalog({
  initialApps,
  errorMessage,
}: {
  initialApps: MobileApp[]
  errorMessage?: string
}) {
  const { contact, isYemen, geoSettings } = useRegion()
  const wa = contact.whatsapp || DEFAULT_WHATSAPP
  const yerRate = geoSettings.pricing.yerExchangeRate || 450
  const apps = initialApps
  const [category, setCategory] = useState('الكل')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => ['الكل', ...new Set(apps.map(app => app.category))], [apps])
  const visibleApps = useMemo(() => apps.filter(app => {
    const matchesCategory = category === 'الكل' || app.category === category
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || [app.name, app.nameEn, app.category, app.tagline]
      .some(value => value.toLocaleLowerCase().includes(query))
    return matchesCategory && matchesSearch
  }), [apps, category, search])
  const featuredApp = visibleApps.find(app => app.featured)
  const otherApps = visibleApps.filter(app => app.id !== featuredApp?.id)

  return (
    <>
      <Navbar />
      <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
        <section className="relative isolate overflow-hidden bg-[var(--bg)]">
          <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[#1F8A54]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-28 bottom-0 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="container-ws grid min-h-[490px] items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1F8A54]/20 bg-[#1F8A54]/5 px-3.5 py-2 text-xs font-bold text-[#1F8A54]">
                <span className="h-2 w-2 rounded-full bg-[#1F8A54]" />
                حلول جوال من WebStep
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.2] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                تطبيقات تصنع
                <span className="text-gradient-green"> تجربة تستحق التحميل</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                اكتشف تطبيقاتنا ومنتجاتنا الرقمية. صور حقيقية من داخل التطبيق، تفاصيل واضحة، وروابط المتاجر والتنزيل في مكان واحد.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#app-catalog" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm">
                  <Smartphone size={17} /> استكشف التطبيقات <ArrowLeft size={16} />
                </a>
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ويب ستيب، أريد الاستفسار عن تطوير تطبيق جوال')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-6 py-3.5 text-sm font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54] hover:text-[#1F8A54]">
                  تواصل مع فريقنا <ArrowUpLeft size={16} />
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border)] pt-5 text-xs font-semibold text-[var(--text-secondary)]">
                {['تصميم Mobile-first', 'واجهات عربية سهلة', 'روابط تنزيل موثوقة'].map(item => (
                  <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-[#1F8A54]" />{item}</span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#1F8A54]/20 via-transparent to-emerald-300/20 blur-xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)]">
                <div className="overflow-hidden rounded-[1.25rem] bg-[#101b17] p-6 text-white sm:p-8">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="font-bold tracking-wide">WEBSTEP / MOBILE</span><Sparkles size={16} className="text-emerald-300" />
                  </div>
                  <div className="mt-12 flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#1F8A54] shadow-lg shadow-emerald-950/30"><Smartphone size={31} /></div>
                    <div><p className="text-xs text-emerald-200">منتجات رقمية</p><h2 className="mt-1 text-2xl font-black">فكرتك، على الجوال</h2></div>
                  </div>
                  <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">نصمم تجارب واضحة وسريعة، ونبني منتجات تخدم مستخدميك أينما كانوا.</p>
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {['iOS', 'Android', 'QR'].map(item => <div key={item} className="rounded-xl border border-white/10 bg-white/5 py-3 text-center text-xs font-bold">{item}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="app-catalog" className="border-y border-[var(--border)] bg-[var(--bg-soft)] py-14 sm:py-20">
          <div className="container-ws">
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-[#1F8A54]">كتالوج التطبيقات</div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">اكتشف تطبيقاتنا</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">صفحات تفصيلية مستقلة لكل تطبيق، لتصل إلى الصور والميزات والتنزيل بسهولة.</p>
              </div>
              <label className="relative block w-full lg:max-w-xs">
                <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder="ابحث باسم التطبيق..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pe-10 ps-4 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]" />
              </label>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map(item => (
                <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? 'border-[#1F8A54] bg-[#1F8A54] text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[#1F8A54]'}`}>
                  {item === 'الكل' && <Filter size={12} className="ml-1 inline" />}{item}
                </button>
              ))}
            </div>

            {errorMessage && <div role="alert" className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700">{errorMessage}</div>}
            {visibleApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-secondary)]">لا توجد تطبيقات منشورة تطابق البحث حالياً.</div>
            ) : (
              <div className="space-y-6">
                {featuredApp && <AppCard app={featuredApp} featured />}
                {otherApps.length > 0 && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{otherApps.map(app => <AppCard key={app.id} app={app} />)}</div>}
              </div>
            )}
          </div>
        </section>

        <section id="pricing-section" className="container-ws py-14 sm:py-20">
          <div className="mb-9">
            <div className="mb-2 text-xs font-black text-[#1F8A54]">تطوير تطبيق مخصص</div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">خيارات واضحة لبداية مشروعك</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">هذه أسعار بداية تقديرية؛ يتحدد النطاق النهائي بعد فهم متطلبات تطبيقك.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {SERVICE_PACKAGES.map(pkg => {
              const clean = pkg.price.replace(/[^\d\u0660-\u0669]/g, '')
              const western = clean.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 1632))
              const num = parseInt(western, 10) || 0
              const customYer = pkg.key ? geoSettings.pricing.customPackagePrices?.[pkg.key]?.yer : undefined
              const displayPrice = isYemen
                ? (customYer && customYer > 0 ? customYer.toLocaleString('ar-YE') : Math.round(num * yerRate).toLocaleString('ar-YE'))
                : pkg.price
              const unit = isYemen ? 'ر.ي' : 'ر.س'

              return (
                <article key={pkg.name} className={`flex flex-col rounded-3xl border p-5 sm:p-6 ${pkg.featured ? 'border-[#1F8A54] bg-[#1F8A54]/5 shadow-[var(--shadow-md)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-lg font-black text-[var(--text-primary)]">{pkg.name}</h3><p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{pkg.subtitle}</p></div>
                    {pkg.featured && <span className="shrink-0 rounded-full bg-[#1F8A54] px-2.5 py-1 text-[10px] font-bold text-white">الأكثر طلباً</span>}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2 border-b border-[var(--border)] pb-5">
                    <span className="text-3xl font-black text-[#1F8A54]">{displayPrice}</span><span className="text-xs font-bold text-[var(--text-secondary)]">{unit} · دفعة واحدة</span>
                  </div>
                  <ul className="my-5 flex-1 space-y-2.5">
                    {pkg.features.map(feature => <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-[var(--text-secondary)]"><Check size={14} className="mt-0.5 shrink-0 text-[#1F8A54]" />{feature}</li>)}
                  </ul>
                  <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`مرحباً ويب ستيب، أرغب بالاستفسار عن ${pkg.name}`)}`} target="_blank" rel="noopener noreferrer" className={pkg.featured ? 'btn-primary inline-flex items-center justify-center gap-2 px-4 py-3 text-xs' : 'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54] hover:text-[#1F8A54]'}>ناقش احتياجك <ArrowLeft size={14} /></a>
                </article>
              )
            })}
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[var(--text-muted)]">السعر النهائي يعتمد على الميزات والمنصات والتكاملات المطلوبة، ويُعتمد بعد الاتفاق على نطاق العمل.</p>
        </section>

        <section className="container-ws py-14 sm:py-20">
          <div className="grid gap-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-[#1F8A54]"><ShieldCheck size={15} /> تطبيق مناسب لاحتياجك</div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] sm:text-3xl">تبحث عن تطبيق مصمم لمشروعك؟</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">شاركنا فكرتك، وسنساعدك في تحديد المنصات والميزات وطريقة الإطلاق المناسبة.</p>
            </div>
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ويب ستيب، أريد تطوير تطبيق جوال لمشروعي')}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm">ابدأ المحادثة <ArrowLeft size={16} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function AppCard({ app, featured = false }: { app: MobileApp; featured?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${featured ? 'grid lg:grid-cols-2' : 'flex flex-col'}`}>
      <Link href={`/services/apps/${app.slug}`} className={`relative block overflow-hidden bg-[var(--bg-muted)] ${featured ? 'min-h-64 lg:min-h-[380px]' : 'h-52'}`} aria-label={`تفاصيل ${app.name}`}>
        {app.coverImage ? <Image src={app.coverImage} alt={`لقطة من ${app.name}`} fill unoptimized={shouldSkipNextImageOptimization(app.coverImage)} priority={featured} sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, 50vw'} className="object-cover transition duration-700 group-hover:scale-[1.03]" /> : <div className="grid h-full min-h-52 place-items-center text-[#1F8A54]"><Smartphone size={52} /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {app.badge && <span className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow" style={{ backgroundColor: app.accentColor }}>{app.badge}</span>}
        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white">
          <AppIcon app={app} />
          <div><span className="block text-[11px] text-white/75">{app.category}</span><span className="mt-0.5 block text-lg font-black sm:text-xl">{app.name}</span></div>
        </div>
      </Link>
      <div className={`flex flex-1 flex-col p-5 sm:p-7 ${featured ? 'justify-center lg:p-9' : ''}`}>
        <div className="mb-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          {app.rating && <span className="inline-flex items-center gap-1 font-bold text-amber-500"><Star size={13} fill="currentColor" />{app.rating}</span>}
          {app.downloads && <span>{app.downloads} تنزيل</span>}
          {app.size && <span>{app.size}</span>}
        </div>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">{app.tagline}</p>
        <ul className="mt-5 space-y-2">
          {app.features.slice(0, featured ? 4 : 3).map((feature, index) => <li key={`${feature.title}-${index}`} className="flex items-start gap-2 text-xs leading-5 text-[var(--text-secondary)]"><Check size={14} className="mt-0.5 shrink-0 text-[#1F8A54]" /><span>{feature.title}</span></li>)}
        </ul>
        {app.purchasePrice && <p className="mt-5 text-xs font-bold text-[#1F8A54]">{app.purchasePrice}</p>}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--border)] pt-5">
          <Link href={`/services/apps/${app.slug}`} className="btn-primary inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-xs"><span>عرض التفاصيل</span><ArrowLeft size={14} /></Link>
          {app.downloadUrl && <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54] hover:text-[#1F8A54]"><Download size={14} /> تنزيل</a>}
          {!app.downloadUrl && (app.iosUrl || app.androidUrl) && <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-[11px] font-bold text-[var(--text-muted)]"><ExternalLink size={13} /> متوفر على المتاجر</span>}
        </div>
      </div>
    </article>
  )
}

function AppIcon({ app }: { app: MobileApp }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/30 bg-white/15 text-lg font-black text-white shadow-lg backdrop-blur">
      {app.iconUrl ? <Image src={app.iconUrl} alt="" fill unoptimized={shouldSkipNextImageOptimization(app.iconUrl)} sizes="48px" className="object-cover" /> : app.name.slice(0, 1)}
    </span>
  )
}
