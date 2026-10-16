'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Globe, Smartphone, ShoppingCart, Server, Palette, LayoutTemplate,
  TrendingUp, HeartHandshake, ArrowUpLeft,
} from 'lucide-react'

const SERVICES = [
  {
    href: '/services/web',
    icon: Globe,
    title: 'تطوير المواقع',
    titleEn: 'Web Development',
    desc: 'مواقع احترافية سريعة وآمنة تُحقق أهدافك',
    accent: '#1F8A54',
    gradient: 'from-[#1F8A54] to-[#26a667]',
    num: '01',
    tags: ['Next.js', 'React', 'SEO'],
  },
  {
    href: '/services/apps',
    icon: Smartphone,
    title: 'تطبيقات الموبايل',
    titleEn: 'Mobile Apps',
    desc: 'iOS & Android بتجربة مستخدم استثنائية',
    accent: '#3b82f6',
    gradient: 'from-[#3b82f6] to-[#6366f1]',
    num: '02',
    tags: ['Flutter', 'React Native', 'Swift'],
  },
  {
    href: '/services/ecommerce',
    icon: ShoppingCart,
    title: 'المتاجر الإلكترونية',
    titleEn: 'E-Commerce',
    desc: 'متجرك الرقمي مع تجربة تسوق سلسة وآمنة',
    accent: '#f97316',
    gradient: 'from-[#f97316] to-[#fb923c]',
    num: '03',
    tags: ['Shopify', 'WooCommerce', 'Stripe'],
  },
  {
    href: '/services/systems',
    icon: Server,
    title: 'الأنظمة والـ ERP',
    titleEn: 'Systems & ERP',
    desc: 'لوحات تحكم وأنظمة إدارية تُبسّط عملياتك',
    accent: '#8b5cf6',
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    num: '04',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    href: '/services/design',
    icon: Palette,
    title: 'تصميم UI/UX',
    titleEn: 'UI/UX Design',
    desc: 'هويات بصرية مذهلة تسحر الزائر وتُقنعه',
    accent: '#ec4899',
    gradient: 'from-[#ec4899] to-[#f472b6]',
    num: '05',
    tags: ['Figma', 'Motion', 'Branding'],
  },
  {
    href: '/services/landing',
    icon: LayoutTemplate,
    title: 'صفحات الهبوط',
    titleEn: 'Landing Pages',
    desc: 'صفحات تسويقية تُحوّل الزوار إلى عملاء',
    accent: '#f59e0b',
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
    num: '06',
    tags: ['CRO', 'A/B Test', 'Analytics'],
  },
  {
    href: '/services/marketing',
    icon: TrendingUp,
    title: 'التسويق الرقمي',
    titleEn: 'Digital Marketing',
    desc: 'SEO وإعلانات تصل لجمهورك المستهدف',
    accent: '#06b6d4',
    gradient: 'from-[#06b6d4] to-[#38bdf8]',
    num: '07',
    tags: ['SEO', 'SEM', 'Content'],
  },
  {
    href: '/services/support',
    icon: HeartHandshake,
    title: 'الدعم والصيانة',
    titleEn: 'Support & Care',
    desc: 'معك دائماً بعد الإطلاق — دعم فني 24/7',
    accent: '#1F8A54',
    gradient: 'from-[#1F8A54] to-[#059669]',
    num: '08',
    tags: ['24/7', 'Updates', 'Monitoring'],
  },
]

import type { ServicesNavSectionData } from '@/lib/homepage-types'

const NAV_ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, ShoppingCart, Server, Palette, Layout: LayoutTemplate, LayoutTemplate,
  TrendingUp, HeartHandshake,
}

const HREF_ICON_MAP: Record<string, React.ElementType> = {
  '/services/web': Globe,
  '/services/apps': Smartphone,
  '/services/ecommerce': ShoppingCart,
  '/services/systems': Server,
  '/services/design': Palette,
  '/services/landing': LayoutTemplate,
  '/services/marketing': TrendingUp,
  '/services/support': HeartHandshake,
}

export default function ServicesNav({ data }: { data?: ServicesNavSectionData }) {
  const [visible, setVisible]   = useState(false)
  const [hovered, setHovered]   = useState<string | null>(null)
  const [titleVisible, setTitleVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const rawServices = data?.items || (data as any)?.services
  const servicesList: typeof SERVICES = ((rawServices && rawServices.length > 0) ? rawServices : SERVICES) as typeof SERVICES

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          setTimeout(() => setTitleVisible(true), 100)
        }
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const hovSvc = servicesList.find((s: any) => s.href === hovered)

  return (
    <section
      ref={sectionRef}
      id="services-nav"
      aria-labelledby="sn-heading"
      className="relative py-16 sm:py-28 overflow-hidden scroll-mt-20"
    >
      {/* ─── خلفية ─── */}
      <div className="absolute inset-0 -z-10 bg-[var(--bg-base,var(--bg))]" />

      {/* توهج يتغير مع الـ hover */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-all duration-700"
        style={{
          background: hovSvc
            ? `radial-gradient(ellipse 60% 50% at 50% 50%, ${hovSvc.accent}0c 0%, transparent 70%)`
            : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,138,84,0.05) 0%, transparent 70%)',
        }}
      />

      {/* شبكة زخرفية */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(31,138,84,0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(31,138,84,0.03) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">

        {/* ─── العنوان ─── */}
        <div
          className="mb-8 sm:mb-16"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* الشارة */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <div className="h-px flex-1 max-w-[36px] sm:max-w-[48px]" style={{ background: 'rgba(31,138,84,0.35)' }} />
            <span
              className="text-[11px] sm:text-xs font-bold tracking-widest uppercase"
              style={{
                color: '#1F8A54',
                fontFamily: 'var(--font-display, sans-serif)',
              }}
            >
              {data?.badge || 'Our Services'}
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1F8A54] animate-pulse" />
          </div>

          {/* العنوان الرئيسي */}
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <h2
              id="sn-heading"
              className="text-2xl sm:text-5xl lg:text-7xl font-black leading-tight text-[var(--text-primary)]"
            >
              {data?.title || 'ماذا نقدم لك؟'}
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] max-w-lg mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed">
            {data?.subtitle || 'اختر الخدمة لتكتشف كيف نحوّلها إلى منتج رقمي يفوق توقعاتك'}
          </p>
        </div>

        {/* ─── الشبكة ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {servicesList.map((svc, i) => {
            const Icon  = (typeof svc.icon === 'string' ? NAV_ICON_MAP[svc.icon] : svc.icon) || HREF_ICON_MAP[svc.href] || Globe
            const isHov = hovered === svc.href

            return (
              <Link
                key={svc.href || i}
                href={svc.href}
                prefetch={true}
                className="group relative rounded-xl sm:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A54] transition-transform active:scale-[0.98]"
                style={{
                  opacity:   visible ? 1 : 0,
                  transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
                  transition: `opacity 0.5s ease ${i * 0.04}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s`,
                }}
                onMouseEnter={() => setHovered(svc.href)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* ─ البطاقة ─ */}
                <div
                  className="relative h-full rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 overflow-hidden"
                  style={{
                    background: isHov ? `${svc.accent}0c` : 'var(--surface)',
                    border: `1.5px solid ${isHov ? svc.accent + '55' : 'var(--border)'}`,
                    boxShadow: isHov
                      ? `0 16px 40px ${svc.accent}22, 0 4px 16px ${svc.accent}18, 0 0 0 1px ${svc.accent}22`
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isHov ? 'translateY(-4px) scale(1.015)' : 'translateY(0) scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  {/* رقم الخدمة — ضخم في الخلفية */}
                  <span
                    className="absolute -top-1 -left-1 text-[3.2rem] sm:text-[5rem] font-black leading-none select-none pointer-events-none"
                    style={{
                      fontFamily: 'var(--font-display, sans-serif)',
                      color: isHov ? `${svc.accent}15` : 'rgba(0,0,0,0.03)',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {svc.num}
                  </span>

                  {/* أيقونة */}
                  <div
                    className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isHov
                        ? `linear-gradient(135deg, ${svc.accent}, ${svc.accent}cc)`
                        : `${svc.accent}12`,
                      color: isHov ? '#fff' : svc.accent,
                      boxShadow: isHov ? `0 8px 24px ${svc.accent}50` : 'none',
                      transform: isHov ? 'rotate(-6deg) scale(1.1)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* العنوان الإنجليزي الصغير */}
                  <span
                    className="relative z-10 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase truncate"
                    style={{
                      fontFamily: 'var(--font-display, sans-serif)',
                      color: isHov ? svc.accent : 'var(--text-muted)',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {svc.titleEn}
                  </span>

                  {/* العنوان العربي */}
                  <h3
                    className="relative z-10 text-xs sm:text-base font-black leading-snug sm:leading-tight -mt-1 line-clamp-1 sm:line-clamp-none"
                    style={{
                      color: isHov ? svc.accent : 'var(--text-primary)',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {svc.title}
                  </h3>

                  {/* الوصف */}
                  <p className="relative z-10 text-[10.5px] sm:text-xs leading-relaxed text-[var(--text-secondary)] flex-1 line-clamp-2 sm:line-clamp-none">
                    {svc.desc}
                  </p>

                  {/* التاقات */}
                  <div className="relative z-10 hidden sm:flex flex-wrap gap-1.5">
                    {(svc.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{
                          fontFamily: 'var(--font-display, sans-serif)',
                          background: isHov ? `${svc.accent}15` : 'var(--bg-soft,rgba(0,0,0,0.04))',
                          color: isHov ? svc.accent : 'var(--text-muted)',
                          border: `1px solid ${isHov ? svc.accent + '30' : 'transparent'}`,
                          transition: 'all 0.25s ease',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* سهم الدخول */}
                  <div
                    className="relative z-10 flex items-center justify-between mt-auto pt-1 sm:pt-0"
                    style={{
                      color: svc.accent,
                    }}
                  >
                    <span className="text-[10px] sm:text-[11px] font-bold">
                      اعرف المزيد
                    </span>
                    <ArrowUpLeft size={13} className="transition-transform group-hover:-translate-x-1" />
                  </div>

                  {/* خط سفلي متحرك */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl sm:rounded-b-2xl"
                    style={{
                      background: `linear-gradient(to left, ${svc.accent}, ${svc.accent}44)`,
                      transform: isHov ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  />
                </div>
              </Link>
            )
          })}
        </div>

        {/* ─── عداد الخدمات ─── */}
        <div
          className="flex items-center justify-between mt-10 pt-8 border-t border-[var(--border)]"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.5s',
          }}
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span
              className="text-3xl font-black"
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                color: '#1F8A54',
              }}
            >
              8
            </span>
            {' '}خدمة متخصصة — فريق واحد لكل شيء
          </p>
          <div className="flex items-center gap-1.5">
            {SERVICES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: hovered === SERVICES[i].href ? 18 : 5,
                  height: 5,
                  background: hovered === SERVICES[i].href
                    ? SERVICES[i].accent
                    : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
