'use client'

import Image from 'next/image'
import { ArrowDown, ArrowLeft, ArrowUpLeft, BarChart3, Check, ChevronLeft, MousePointer2, Rocket, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { LandingServiceContent } from '@/data/landing-service'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import { useRegion } from '@/components/providers/RegionProvider'

const icons = [Target, Rocket, Sparkles, BarChart3, ShieldCheck, MousePointer2]

export default function LandingServicePage({ content, errorMessage }: { content: LandingServiceContent; errorMessage?: string }) {
  const { contact, isYemen, geoSettings } = useRegion()
  const whatsapp = contact.whatsapp || '966593672193'
  const yerRate = geoSettings.pricing.yerExchangeRate || 450
  const publishedProjects = content.projects.filter(project => project.published)
  const featured = publishedProjects.find(project => project.featured)
  const otherProjects = publishedProjects.filter(project => project.id !== featured?.id)

  return (
    <>
      <Navbar />
      <main dir="rtl" className="overflow-hidden pb-16 pt-24 text-right">
        {errorMessage && <div role="status" className="container-ws mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">{errorMessage}</div>}
        <section className="relative isolate overflow-hidden bg-[#0b1510] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(31,138,84,.32),transparent_35%),radial-gradient(ellipse_at_88%_80%,rgba(245,158,11,.19),transparent_32%)]" />
          <div className="absolute inset-0 opacity-[.075]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)', backgroundSize: '46px 46px' }} />
          <div className="container-ws relative grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />{content.hero.badge}</div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">{content.hero.title}<br /><span className="bg-gradient-to-l from-emerald-200 via-emerald-400 to-[#a3e635] bg-clip-text text-transparent">{content.hero.highlight}</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">{content.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#landing-types" className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500">{content.hero.primaryCta}<ArrowDown size={16} /></a>
                <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('أرغب بمناقشة صفحة هبوط لمشروعي')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">{content.hero.secondaryCta}<ArrowUpLeft size={15} /></a>
              </div>
              <div className="mt-12 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">{content.hero.metrics.map(metric => <div key={metric.label}><div className="text-sm font-black" style={{ color: metric.color }}>{metric.value}</div><div className="mt-1 text-[11px] text-white/50">{metric.label}</div></div>)}</div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[.06] p-3 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-[1.4rem] bg-[#f4f4f0] p-4 text-[#171b18] sm:p-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4"><span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-black/45"><span className="h-2 w-2 rounded-full bg-emerald-500" /> CAMPAIGN / LANDING PAGE</span><span className="text-[10px] text-black/35">PREVIEW 1440 × 900</span></div>
                  <div className="grid min-h-64 grid-cols-[1fr_.8fr] items-center gap-3 py-5">
                    <div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-black text-emerald-800">MADE FOR THE NEXT STEP</span><h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">Make your<br /><span className="text-emerald-700">next move.</span></h2><p className="mt-3 text-[10px] leading-5 text-black/50">A focused page. A clear message. A better experience.</p><div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1F8A54] px-3 py-2 text-[10px] font-bold text-white">Explore the offer <ArrowLeft size={12} /></div><div className="mt-4 flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /><span className="h-1.5 w-1.5 rounded-full bg-black/15" /><span className="h-1.5 w-1.5 rounded-full bg-black/15" /></div></div>
                    <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-[#194c35] to-[#b4d6ae]"><div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 30% 28%,#f0c66e 0 11%,transparent 12%),linear-gradient(145deg,transparent 45%,#fff7 46% 47%,transparent 48%)' }} /><div className="absolute bottom-3 right-3 rounded-xl border border-white/35 bg-white/80 p-3 shadow-lg backdrop-blur"><div className="h-1.5 w-12 rounded bg-emerald-800/70" /><div className="mt-2 h-1.5 w-8 rounded bg-black/15" /><div className="mt-3 h-5 w-16 rounded-md bg-emerald-600" /></div><div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur"><Zap size={16} /></div></div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"><span className="inline-flex items-center gap-2 text-[10px] font-black"><MousePointer2 size={14} className="text-emerald-600" />Clear next action</span><span className="text-[9px] font-bold text-black/40">MOBILE-FIRST · FAST · FOCUSED</span></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-2 rounded-2xl border border-white/10 bg-[#142219] px-4 py-3 shadow-xl sm:-left-7"><div className="flex items-center gap-2 text-xs font-bold"><BarChart3 size={15} className="text-emerald-300" /> جاهزة للقياس والتحسين</div></div>
            </div>
          </div>
        </section>

        <section id="landing-types" className="bg-[var(--bg-soft)] py-16 sm:py-24"><div className="container-ws">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-black tracking-widest text-amber-600">BUILT AROUND YOUR GOAL</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-5xl">صفحة واحدة. هدف واضح.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">نختار بنية الصفحة ومحتواها وفق ما يحتاجه جمهورك، لا وفق قالب واحد للجميع.</p></div><Target className="hidden text-emerald-600 sm:block" size={32} /></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{content.types.map((item, index) => { const Icon = icons[index % icons.length]; return <article key={item.id} className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${item.color}18`, color: item.color }}><Icon size={22} /></span><span className="rounded-full px-3 py-1 text-[10px] font-black" style={{ backgroundColor: `${item.color}14`, color: item.color }}>{item.badge}</span></div><h3 className="mt-5 text-lg font-black text-[var(--text-primary)]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p><div className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-xs font-bold text-[var(--text-primary)]"><Check size={14} style={{ color: item.color }} />{item.outcome}</div></article> })}</div>
        </div></section>

        <section className="container-ws py-16 sm:py-24"><div className="mb-9"><div className="mb-2 text-xs font-black tracking-widest text-emerald-600">BUILT TO PERFORM</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">تفاصيل تصنع فرقاً.</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{content.features.map((feature, index) => { const Icon = icons[(index + 2) % icons.length]; return <div key={feature.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><span className="grid h-10 w-10 place-items-center rounded-xl" style={{ color: feature.color, backgroundColor: `${feature.color}16` }}><Icon size={18} /></span><h3 className="mt-4 font-black text-[var(--text-primary)]">{feature.title}</h3><p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{feature.description}</p></div> })}</div></section>

        <section className="border-y border-[var(--border)] bg-[#0b1510] py-16 text-white sm:py-24"><div className="container-ws"><div className="mb-9"><div className="mb-2 text-xs font-black tracking-widest text-emerald-300">HOW WE WORK</div><h2 className="text-3xl font-black sm:text-4xl">من الهدف إلى الإطلاق.</h2></div><div className="grid gap-4 md:grid-cols-3">{content.process.map((step, index) => <div key={step.title} className="rounded-3xl border border-white/10 bg-white/[.04] p-6"><div className="flex items-center justify-between"><span className="text-xs font-black text-emerald-300">0{index + 1}</span><span className="h-px flex-1 bg-white/10 mx-4" /><ArrowLeft size={15} className="text-white/30" /></div><h3 className="mt-6 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm leading-7 text-white/55">{step.description}</p></div>)}</div></div></section>

        <section className="container-ws py-16 sm:py-24"><div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-black tracking-widest text-emerald-600">SELECTED CAMPAIGNS</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">أعمال وتجارب من الميدان.</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">نماذج لأفكار صفحات يمكن تطويرها وفق أهداف نشاطك.</p></div><span className="text-xs font-bold text-[var(--text-muted)]">{publishedProjects.length} مشاريع</span></div>
          {featured && <ProjectCard project={featured} featured />}
          {otherProjects.length > 0 && <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{otherProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>}
          {!publishedProjects.length && <p className="rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center text-sm text-[var(--text-muted)]">ستظهر الأعمال المنشورة هنا.</p>}
        </section>

        <section className="bg-[var(--bg-soft)] py-16 sm:py-24"><div className="container-ws"><div className="mb-9"><div className="mb-2 text-xs font-black tracking-widest text-emerald-600">CLEAR SCOPE · CLEAR START</div><h2 className="text-3xl font-black text-[var(--text-primary)] sm:text-4xl">اختر نقطة البداية.</h2><p className="mt-3 text-sm text-[var(--text-secondary)]">الأسعار المبدئية ونطاق العمل النهائي يؤكدان بعد فهم تفاصيل المشروع.</p></div><div className="grid gap-4 lg:grid-cols-3">
          {content.packages.map(pkg => {
            const clean = pkg.price.replace(/[^\d\u0660-\u0669]/g, '')
            const western = clean.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 1632))
            const num = parseInt(western, 10) || 0
            const customYer = geoSettings.pricing.customPackagePrices?.[pkg.id]?.yer ||
                              geoSettings.pricing.customPackagePrices?.[`landing_${pkg.id}`]?.yer
            const displayPrice = isYemen
              ? (customYer && customYer > 0 ? customYer.toLocaleString('ar-YE') : Math.round(num * yerRate).toLocaleString('ar-YE'))
              : pkg.price
            const unit = isYemen ? 'ر.ي' : 'ر.س'

            return (
              <article key={pkg.id} className={`flex flex-col rounded-3xl border p-6 sm:p-7 ${pkg.featured ? 'border-emerald-500 bg-emerald-500/[.06] shadow-xl' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                <span className="self-start rounded-full px-3 py-1 text-[10px] font-black" style={{ color: pkg.color, backgroundColor: `${pkg.color}15` }}>{pkg.name}</span>
                <div className="mt-5 text-4xl font-black" style={{ color: pkg.color }}>
                  {displayPrice}<span className="mr-2 text-xs text-[var(--text-muted)]">{unit} · تبدأ من</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{pkg.description}</p>
                <ul className="my-6 flex-1 space-y-3">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex gap-2 text-xs leading-5 text-[var(--text-secondary)]">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />{feature}
                    </li>
                  ))}
                </ul>
                <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`أرغب بالاستفسار عن ${pkg.name}`)}`} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black ${pkg.featured ? 'bg-[#1F8A54] text-white' : 'bg-[var(--bg-muted)] text-[var(--text-primary)]'}`}>
                  {pkg.cta}<ArrowUpLeft size={14} />
                </a>
              </article>
            )
          })}
        </div></div></section>
        <section className="container-ws py-14"><div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#0b1510] p-7 text-white sm:flex-row sm:items-center sm:p-10"><div><div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300"><ShieldCheck size={15} /> BUILT AROUND YOUR AUDIENCE</div><h2 className="mt-3 text-2xl font-black sm:text-3xl">جاهز تعطي حملتك صفحة تستحقها؟</h2><p className="mt-2 text-sm text-white/55">نراجع الهدف معك ونقترح بنية واضحة قابلة للقياس.</p></div><a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('أرغب ببدء مشروع صفحة هبوط')}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black">احجز استشارة <ArrowUpLeft size={15} /></a></div></section>
      </main>
      <Footer />
    </>
  )
}

function ProjectCard({ project, featured = false }: { project: LandingServiceContent['projects'][number]; featured?: boolean }) {
  return <article className={`group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${featured ? 'md:grid md:grid-cols-[1.15fr_.85fr]' : ''}`}>
    <div className={`relative overflow-hidden bg-[var(--bg-muted)] ${featured ? 'min-h-64 md:min-h-[390px]' : 'aspect-[1.55]'}`}>
      {project.coverImage ? <Image src={project.coverImage} alt={project.title} fill sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'} unoptimized={shouldSkipNextImageOptimization(project.coverImage)} className="object-cover transition duration-700 group-hover:scale-[1.035]" /> : <div className="absolute inset-0 grid place-items-center text-5xl font-black text-white" style={{ background: `linear-gradient(135deg, ${project.accentColor}, #101611)` }}>{project.title.slice(0, 1)}</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" /><span className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black text-white" style={{ backgroundColor: project.accentColor }}>{project.category}</span>
    </div>
    <div className={`flex flex-col justify-center p-6 ${featured ? 'md:p-9' : ''}`}><div className="text-[10px] font-black tracking-widest text-emerald-600">LANDING EXPERIENCE</div><h3 className="mt-3 text-xl font-black text-[var(--text-primary)]">{project.title}</h3><p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">{project.summary}</p><p className="mt-4 border-r-2 pr-3 text-xs font-bold leading-6 text-[var(--text-primary)]" style={{ borderColor: project.accentColor }}>{project.outcome}</p><div className="mt-4 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-lg bg-[var(--bg-muted)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-secondary)]">{tag}</span>)}</div>{project.gallery.length > 1 && <div className="mt-4 flex gap-2">{project.gallery.slice(0, 3).map((image, index) => <div key={`${image}-${index}`} className="relative h-12 w-16 overflow-hidden rounded-lg bg-[var(--bg-muted)]"><Image src={image} alt={`${project.title} صورة ${index + 1}`} fill sizes="64px" unoptimized={shouldSkipNextImageOptimization(image)} className="object-cover" /></div>)}</div>}{project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-700">شاهد فيديو المشروع <ChevronLeft size={14} /></a>}</div>
  </article>
}
