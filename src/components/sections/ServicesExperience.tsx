'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Globe, Smartphone, Palette, LayoutTemplate, ShoppingCart,
  Server, TrendingUp, HeartHandshake, Check,
} from 'lucide-react'
import { SERVICES } from '@/data'

import type { ServicesExperienceSectionData } from '@/lib/homepage-types'

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Globe, Smartphone, Palette,
  Layout: LayoutTemplate,
  ShoppingCart, Server, TrendingUp, HeartHandshake,
}

export default function ServicesExperience({ data }: { data?: ServicesExperienceSectionData }) {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const servicesList = data?.items && data.items.length > 0 ? data.items : SERVICES

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    autoRef.current = setInterval(() => {
      handleGoTo((p) => (p + 1) % servicesList.length)
    }, 3000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesList.length])

  function handleGoTo(updater: number | ((p: number) => number)) {
    setActive((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (next === prev) return prev
      setAnimating(true)
      setTimeout(() => setAnimating(false), 400)
      return next
    })
  }

  function handleClick(i: number) {
    if (autoRef.current) clearInterval(autoRef.current)
    handleGoTo(i)
    autoRef.current = setInterval(() => {
      handleGoTo((p) => (p + 1) % servicesList.length)
    }, 3000)
  }

  const safeIdx = active < servicesList.length ? active : 0
  const svc = servicesList[safeIdx] || servicesList[0]
  const Icon = (svc?.icon && SERVICE_ICONS[svc.icon]) ? SERVICE_ICONS[svc.icon] : Globe

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      aria-labelledby="services-heading"
    >
      <div className="absolute inset-0 bg-[var(--bg-soft)] -z-10" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(31,138,84,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">

        {/* ─── العنوان ─── */}
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
         
          <h2 id="services-heading" className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] mb-3">
            {data?.title || 'خدماتنا'}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {data?.subtitle || 'اضغط على رقم الخدمة لعرض تفاصيلها داخل الشاشة'}
          </p>
        </div>

        {/* ─── التخطيط الجانبي ─── */}
        <div className={`flex items-center gap-4 sm:gap-60 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* ─ عمود الدوائر على اليسار ─ */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            {servicesList.map((s, i) => {
              const isAct = i === safeIdx
              return (
                <button
                  key={s.id || i}
                  onClick={() => handleClick(i)}
                  aria-label={s.title}
                  title={s.title}
                  className="group relative flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1F8A54]"
                  style={{
                    width: isAct ? 52 : 40,
                    height: isAct ? 52 : 40,
                    background: isAct ? '#1F8A54' : 'rgba(31,138,84,0.08)',
                    border: isAct ? '2px solid #1F8A54' : '2px solid rgba(31,138,84,0.25)',
                    color: isAct ? '#fff' : 'rgba(31,138,84,0.7)',
                    boxShadow: isAct ? '0 0 20px rgba(31,138,84,0.4)' : 'none',
                    transform: isAct ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {i + 1}
                  {/* Tooltip */}
                  <span className="absolute right-full mr-2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium bg-[#1F8A54] text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {s.title}
                  </span>
                </button>
              )
            })}

            {/* اسم الخدمة عمودي */}
            <p
              className="text-xs font-semibold text-[#1F8A54] mt-2"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {svc?.title}
            </p>
          </div>

          {/* ─ الصورة على اليمين ─ */}
          <div className="relative flex-1 min-w-0">
            <Image
              src={data?.screenImage || '/assets/6.png'}
              alt="شاشة العرض"
              width={1200}
              height={750}
              className="w-full h-auto object-contain"
              quality={85}
              priority
            />

            {/* ─── overlay داخل شاشة الصورة ─── */}
            {/* عدّل top/left/right/bottom حسب موضع الشاشة في الصورة الفعلية */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: '23%',
                left: '45%',
                right: '3%',
                bottom: '26%',
                transform: 'skewX(1.5deg) skewY(-0.21deg)',
                transformOrigin: 'center center',
                borderRadius: '4px',
              }}
            >
              {/* خلفية شبه شفافة */}
              <div className="absolute inset-0" style={{ background: 'rgba(5, 18, 10, 0.88)' }} />

              {/* شبكة */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(31,138,84,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(31,138,84,0.5) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* المحتوى المتحرك */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div className="text-center w-full max-w-sm">
                  {/* أيقونة */}
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3"
                    style={{ background: 'rgba(31,138,84,0.2)', border: '1.5px solid rgba(31,138,84,0.5)' }}
                  >
                    <Icon size={22} className="text-[#1F8A54]" />
                  </div>

                  {/* رقم + عنوان إنجليزي */}
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <span className="text-[#1F8A54] text-xs font-mono opacity-70">0{safeIdx + 1}</span>
                    <span className="text-[#1F8A54] text-xs opacity-40">/</span>
                    <span className="text-[#1F8A54] text-xs font-mono opacity-40">{svc?.titleEn || ''}</span>
                  </div>

                  {/* العنوان العربي */}
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-2">{svc?.title || ''}</h3>

                  {/* الوصف */}
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-3 max-w-xs mx-auto">
                    {(svc as any)?.description || (svc as any)?.desc || ''}
                  </p>

                  {/* الميزات */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {(((svc as any)?.features || (svc as any)?.points || []) as string[]).map((f: string) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(31,138,84,0.15)', border: '1px solid rgba(31,138,84,0.3)', color: '#4ade80' }}
                      >
                        <Check size={9} />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* شريط التقدم */}
            
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
