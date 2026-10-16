'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ExternalLink, Star } from 'lucide-react'

/* ─── بيانات المشاريع الافتراضية ─── */
const DEFAULT_PROJECTS = [
  {
    id: 'step-light',
    num: '01',
    title: 'Step Light',
    subtitle: 'منصة إدارة المتاجر',
    description: 'منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية والمحلية — من المخزون والمبيعات إلى تجربة العميل.',
    category: 'منصة تجارية',
    image: '/assets/11.png',
    accent: '#1F8A54',
    tags: ['Next.js', 'PostgreSQL', 'Stripe'],
    rating: 5,
    link: '',
  },
  {
    id: 'step-delivery',
    num: '02',
    title: 'تطبيق مندوب التوصيل',
    subtitle: 'إدارة التوصيل الذكي',
    description: 'تطبيق موبايل متكامل لإدارة رحلات التوصيل، تتبع الطلبات، وتنسيق المناديب في الوقت الفعلي.',
    category: 'تطبيق موبايل',
    image: '/assets/12.png',
    accent: '#3b82f6',
    tags: ['React Native', 'Firebase', 'Maps API'],
    rating: 5,
    link: '',
  },
  {
    id: 'step-erp',
    num: '03',
    title: 'Step ERP',
    subtitle: 'نظام إدارة الموارد',
    description: 'نظام ERP شامل مصمم للشركات — يدمج المحاسبة والمخزون والموارد البشرية في منصة واحدة ذكية.',
    category: 'نظام مؤسسي',
    image: '/assets/13.png',
    accent: '#f97316',
    tags: ['Node.js', 'React', 'MySQL'],
    rating: 5,
    link: '',
  },
  {
    id: 'step-salon',
    num: '04',
    title: 'Step Salon',
    subtitle: 'إدارة الصالونات',
    description: 'تطبيق متخصص لإدارة صالونات التجميل — حجوزات العملاء، إدارة الموظفين، والتقارير المالية.',
    category: 'تطبيق موبايل',
    image: '/assets/14.png',
    accent: '#8b5cf6',
    tags: ['Flutter', 'Supabase', 'Dart'],
    rating: 5,
    link: '',
  },
  {
    id: 'step-biz',
    num: '05',
    title: 'إدارة أعمالك',
    subtitle: 'موقع الأعمال الذكي',
    description: 'موقع احترافي لعرض معلومات أعمالك، إدارة جهات التواصل، والتسويق الرقمي كل شيء في مكان واحد.',
    category: 'موقع إلكتروني',
    image: '/assets/15.png',
    accent: '#92400e',
    tags: ['Next.js', 'Tailwind', 'Vercel'],
    rating: 5,
    link: '',
  },
]

import type { PortfolioSectionData } from '@/lib/homepage-types'

type ProjectItem = typeof DEFAULT_PROJECTS[0]

/* ─── بطاقة المشروع المصغّرة ─── */
function ProjectThumb({
  project, isActive, onClick,
}: {
  project: ProjectItem
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 relative rounded-2xl overflow-hidden focus:outline-none group"
      style={{
        width:  isActive ? 150 : 90,
        height: 72,
        opacity: isActive ? 1 : 0.5,
        border: `2px solid ${isActive ? project.accent : 'transparent'}`,
        boxShadow: isActive ? `0 4px 20px ${project.accent}50` : 'none',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
      aria-label={project.title}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width:768px) 150px, 150px"
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        quality={60}
      />
      {/* طبقة تدرج */}
      <div
        className="absolute inset-0"
        style={{
          background: isActive
            ? `linear-gradient(to top, ${project.accent}cc 0%, transparent 60%)`
            : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }}
      />
      {isActive && (
        <span className="absolute bottom-1.5 right-2 text-white text-[9px] font-bold leading-tight">
          {project.title}
        </span>
      )}
    </button>
  )
}

export default function PortfolioExperience({ data }: { data?: PortfolioSectionData }) {
  const rawProjects = (data as any)?.projects || (data as any)?.items
  const initialProjects = rawProjects && rawProjects.length > 0 ? (rawProjects as ProjectItem[]) : DEFAULT_PROJECTS
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects)
  const [active, setActive]   = useState(0)
  const [prev,   setPrev]     = useState<number | null>(null)
  const [dir,    setDir]      = useState<'next'|'prev'>('next')
  const [transitioning, setTransitioning] = useState(false)
  const [visible, setVisible] = useState(true)
  const [cardVisible, setCardVisible] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const autoRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  /* جلب المشاريع من قاعدة البيانات إذا لم يتم تمريرها */
  useEffect(() => {
    const rawList = (data as any)?.projects || (data as any)?.items
    if (rawList && rawList.length > 0) {
      setProjects(rawList as ProjectItem[])
      return
    }
    fetch('/api/public/content?type=projects')
      .then(res => res.json())
      .then(dbData => {
        if (!Array.isArray(dbData) || dbData.length === 0) return
        const accents = ['#1F8A54', '#3b82f6', '#f97316', '#8b5cf6', '#92400e', '#06b6d4', '#ec4899', '#10b981']
        const mapped: ProjectItem[] = dbData.map((item: any, idx: number) => ({
            id: String(item.id || `proj-${idx}`),
            num: String(idx + 1).padStart(2, '0'),
            title: item.title || 'مشروع',
            subtitle: item.client || item.subtitle || item.category || 'مشروع ويب ستيب',
            description: item.description || '',
            category: item.category || 'مشروع تقني',
            image: (item.image && typeof item.image === 'string' && item.image.trim()) ? item.image : (item.image_url || `/assets/${(idx % 5) + 11}.png`),
            accent: item.accent || accents[idx % accents.length],
            tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : ['Web']),
            rating: typeof item.rating === 'number' ? item.rating : 5,
            link: item.url || item.link || '',
        }))
        setProjects(mapped)
      })
      .catch(error => console.error('Public project content fallback active:', error))
  }, [])

  /* IntersectionObserver */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          setTimeout(() => setCardVisible(true), 200)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const goTo = useCallback((direction: 'next' | 'prev') => {
    if (transitioning || projects.length < 2) return
    setDir(direction)
    setTransitioning(true)
    // بداية الخروج
    setPrev(active)
    setTimeout(() => {
      setActive(prevIdx =>
        direction === 'next'
          ? (prevIdx + 1) % projects.length
          : (prevIdx - 1 + projects.length) % projects.length
      )
      setTimeout(() => {
        setTransitioning(false)
        setPrev(null)
      }, 600)
    }, 300)
  }, [active, transitioning, projects.length])

  /* Auto-play */
  useEffect(() => {
    autoRef.current = setInterval(() => goTo('next'), 5000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [goTo])

  function handleNav(direction: 'next' | 'prev') {
    if (autoRef.current) clearInterval(autoRef.current)
    goTo(direction)
    autoRef.current = setInterval(() => goTo('next'), 5000)
  }

  function handleThumbClick(i: number) {
    if (i === active) return
    if (autoRef.current) clearInterval(autoRef.current)
    const direction = i > active ? 'next' : 'prev'
    setDir(direction)
    setTransitioning(true)
    setPrev(active)
    setTimeout(() => {
      setActive(i)
      setTimeout(() => {
        setTransitioning(false)
        setPrev(null)
      }, 600)
    }, 300)
    autoRef.current = setInterval(() => goTo('next'), 5000)
  }

  if (projects.length === 0) return null

  const proj = projects[active] || projects[0]
  const prevProj = prev !== null && projects[prev] ? projects[prev] : null

  /* حساب تحويل الدخول والخروج */
  const enterFromX = dir === 'next' ? '80px' : '-80px'
  const exitToX   = dir === 'next' ? '-60px' : '60px'

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      aria-labelledby="portfolio-heading"
    >
      {/* خلفية */}
      <div className="absolute inset-0 -z-10" style={{ background: 'var(--bg-base)' }} />
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 70% 60% at 60% 50%, ${proj.accent}0d 0%, transparent 70%)` }}
      />
      {/* جسيمات */}
      {visible && [0,1,2,3].map(i => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            background: proj.accent,
            opacity: 0.1,
            right: `${10 + i * 20}%`,
            top: `${15 + i * 20}%`,
            animation: `orbitFloat ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">

        {/* ─── العنوان ─── */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
            <span className="text-sm font-semibold text-[#1F8A54]">
              {data?.badge || 'أعمالنا'}
            </span>
          </div>
          <h2 id="portfolio-heading" className="text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
            {data?.title || 'من أعمالنا'}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mt-3">
            {data?.subtitle || 'منتجات رقمية بنيناها بأعلى معايير الجودة'}
          </p>
        </div>

        {/* ─── البطاقة الرئيسية ─── */}
        <div
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0) scale(1)' : `translateY(60px) scale(0.95)`,
            transition: 'opacity 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: `1.5px solid ${proj.accent}20`,
              boxShadow: `0 40px 100px ${proj.accent}15, 0 8px 32px rgba(0,0,0,0.08)`,
              transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
            }}
          >
            {/* شريط اللون العلوي */}
            <div
              className="h-1 w-full transition-all duration-500"
              style={{ background: `linear-gradient(to left, ${proj.accent}, ${proj.accent}40)` }}
            />

            <div className="flex flex-col lg:flex-row">

              {/* ─ الصورة ─ */}
              <div className="relative lg:w-[55%] flex-shrink-0 overflow-hidden" style={{ minHeight: 320 }}>
                {/* الصورة الخارجة */}
                {prevProj && (
                  <div
                    key={`exit-${prev}`}
                    className="absolute inset-0"
                    style={{
                      opacity: 0,
                      transform: `translateX(${exitToX}) scale(0.95)`,
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      zIndex: 1,
                    }}
                  >
                    <Image
                      src={prevProj.image}
                      alt={prevProj.title}
                      fill
                      sizes="(max-width:768px) 100vw, 55vw"
                      className="object-cover"
                      quality={80}
                    />
                  </div>
                )}

                {/* الصورة الداخلة */}
                <div
                  key={`enter-${active}`}
                  className="absolute inset-0"
                  style={{
                    opacity: transitioning ? 0 : 1,
                    transform: transitioning ? `translateX(${enterFromX}) scale(1.05)` : 'translateX(0) scale(1)',
                    transition: transitioning
                      ? 'none'
                      : 'opacity 0.65s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.65s cubic-bezier(0.4,0,0.2,1) 0.1s',
                    zIndex: 2,
                  }}
                >
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width:768px) 100vw, 55vw"
                    className="object-cover"
                    quality={85}
                    priority
                  />
                  {/* طبقة تدرج جمالية */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to left, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)' }}
                  />
                </div>

                {/* شارة الفئة */}
                <div
                  className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
                  style={{
                    background: `${proj.accent}dd`,
                    color: '#fff',
                    transition: 'background 0.4s ease',
                  }}
                >
                  {proj.category}
                </div>

                {/* رقم المشروع الزخرفي */}
                <div
                  className="absolute -bottom-2 -left-2 text-9xl font-black leading-none select-none pointer-events-none z-10"
                  style={{ color: `${proj.accent}15`, transition: 'color 0.5s ease' }}
                >
                  {proj.num}
                </div>
              </div>

              {/* ─ النص ─ */}
              <div
                className="flex-1 p-8 lg:p-10 flex flex-col justify-center"
                style={{
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning
                    ? `translateX(${dir === 'next' ? '20px' : '-20px'})`
                    : 'translateX(0)',
                  transition: transitioning
                    ? 'none'
                    : 'opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s',
                }}
              >
                {/* تقييم + فئة */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: proj.rating }).map((_, i) => (
                      <Star key={i} size={12} fill={proj.accent} color={proj.accent} />
                    ))}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${proj.accent}15`, color: proj.accent, border: `1px solid ${proj.accent}30` }}
                  >
                    {proj.category}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-mono opacity-50">
                    {proj.num} / {String(projects.length).padStart(2, '0')}
                  </span>
                </div>

                {/* العنوان */}
                <h3
                  className="text-3xl sm:text-4xl font-black mb-2 leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {proj.title}
                </h3>
                <p className="text-base font-semibold mb-4" style={{ color: proj.accent }}>
                  {proj.subtitle}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed text-base mb-6">
                  {proj.description}
                </p>

                {/* التقنيات */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: `${proj.accent}10`,
                        color: proj.accent,
                        border: `1px solid ${proj.accent}25`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* أزرار التنقل */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleNav('prev')}
                    className="w-12 h-12 rounded-full flex items-center justify-center focus:outline-none group"
                    style={{
                      background: 'var(--surface)',
                      border: '1.5px solid var(--border)',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.1) translateX(2px)'
                      e.currentTarget.style.borderColor = proj.accent
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                    aria-label="السابق"
                  >
                    <ArrowRight size={18} className="text-[var(--text-primary)]" />
                  </button>
                  <button
                    onClick={() => handleNav('next')}
                    className="w-12 h-12 rounded-full flex items-center justify-center focus:outline-none"
                    style={{
                      background: proj.accent,
                      boxShadow: `0 6px 24px ${proj.accent}50`,
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.15) translateX(-2px)'
                      e.currentTarget.style.boxShadow = `0 10px 32px ${proj.accent}70`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = `0 6px 24px ${proj.accent}50`
                    }}
                    aria-label="التالي"
                  >
                    <ArrowLeft size={18} className="text-white" />
                  </button>

                  {/* نقاط التنقل */}
                  <div className="flex items-center gap-2 mr-2">
                    {projects.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => handleThumbClick(i)}
                        className="rounded-full focus:outline-none"
                        style={{
                          width:  i === active ? 24 : 8,
                          height: 8,
                          background: i === active ? proj.accent : 'var(--border)',
                          transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                        aria-label={p.title}
                      />
                    ))}
                  </div>

                  {/* رابط المشروع إن وجد */}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md mr-auto hover:opacity-90 hover:scale-105"
                      style={{ background: proj.accent }}
                    >
                      <ExternalLink size={13} />
                      <span>معاينة المشروع</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── شريط المشاريع المصغّرة ─── */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            {projects.map((p, i) => (
              <ProjectThumb
                key={p.id}
                project={p}
                isActive={i === active}
                onClick={() => handleThumbClick(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbitFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-12px) translateX(6px); }
          50% { transform: translateY(-8px) translateX(-4px); }
          75% { transform: translateY(-16px) translateX(8px); }
        }
      `}</style>
    </section>
  )
}
