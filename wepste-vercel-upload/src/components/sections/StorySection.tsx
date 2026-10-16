'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

/* ─── بيانات الخطوات ─── */
const STEPS = [
  {
    id: 'problem',
    num: '01',
    tag: 'المشكلة',
    heading: 'هل تعاني من هذا؟',
    body: 'مواقع بطيئة لا تُحوّل، مطورون يختفون بعد التسليم، تصاميم تبدو هواة — مشاريع تُكلّف الكثير وتُعطي القليل.',
    bullets: ['موقع بطيء يُنفّر الزوار', 'تصميم لا يعكس قيمتك', 'دعم يختفي بعد الإطلاق'],
    accent: '#ef4444',
    image: '/assets/7.png',
  },
  {
    id: 'solution',
    num: '02',
    tag: 'الحل',
    heading: 'نبني تجارب رقمية حقيقية',
    body: 'كل مشروع يُعامَل كمنتج. تصميم محكم بمعايير عالمية، كود نظيف يدوم، وأداء يجعلك في الصدارة.',
    bullets: ['تصميم UI/UX احترافي', 'أداء يتجاوز 90+ على Lighthouse', 'كود نظيف قابل للتوسع'],
    accent: '#1F8A54',
    image: '/assets/8.png',
  },
  {
    id: 'speed',
    num: '03',
    tag: 'السرعة',
    heading: 'من الفكرة إلى الإطلاق — بسرعة',
    body: 'لا انتظار لأشهر طويلة. نعمل بمنهجية Agile لتسليم المشاريع في أقل وقت ممكن دون أي تنازل عن الجودة.',
    bullets: ['تسليم MVP في أسبوعين', 'تحديثات مستمرة أثناء التطوير', 'شفافية كاملة في كل مرحلة'],
    accent: '#f59e0b',
    image: '/assets/9.png',
  },
  {
    id: 'support',
    num: '04',
    tag: 'الدعم',
    heading: 'معك دائماً — حتى بعد الإطلاق',
    body: 'الإطلاق ليس النهاية، بل البداية. فريقنا يبقى معك بدعم فني حقيقي واستجابة سريعة وصيانة مستمرة.',
    bullets: ['دعم فني 24/7', 'صيانة وتحديثات دورية', 'تقارير أداء شهرية'],
    accent: '#1F8A54',
    image: '/assets/10.png',
  },
]

/* ─── بطاقة عرض مرئي للخطوات بدون صورة ─── */
function StepVisual({ step }: { step: typeof STEPS[0] }) {
  const icons: Record<string, string[]> = {
    solution: ['🎨', '⚡', '🔒', '📈'],
    speed: ['📅', '🔄', '👁️', '🚀'],
    support: ['🛡️', '🔧', '📊', '📞'],
  }
  const emojis = icons[step.id] || ['✨', '💡', '🎯', '🏆']

  return (
    <div className="w-full h-full flex items-center justify-center p-8 lg:p-12">
      <div className="relative w-full max-w-sm">
        {/* دائرة مركزية */}
        <div
          className="mx-auto flex items-center justify-center rounded-full mb-8"
          style={{
            width: 120,
            height: 120,
            background: `${step.accent}15`,
            border: `3px solid ${step.accent}40`,
            boxShadow: `0 0 40px ${step.accent}20`,
          }}
        >
          <span
            className="text-5xl font-black"
            style={{ color: `${step.accent}30` }}
          >
            {step.num}
          </span>
        </div>

        {/* بطاقات الميزات */}
        <div className="grid grid-cols-2 gap-3">
          {step.bullets.map((b, i) => (
            <div
              key={b}
              className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
              style={{
                background: `${step.accent}08`,
                border: `1px solid ${step.accent}25`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <span className="text-2xl">{emojis[i] || '✦'}</span>
              <span
                className="text-xs font-semibold leading-tight"
                style={{ color: step.accent }}
              >
                {b}
              </span>
            </div>
          ))}
        </div>

        {/* خلفية توهج */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${step.accent}08 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      </div>
    </div>
  )
}

import type { StorySectionData } from '@/lib/homepage-types'

export default function StorySection({ data }: { data?: StorySectionData }) {
  const stepsList = data?.steps && data.steps.length > 0 ? data.steps : STEPS
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    stepsList.forEach((_, i) => {
      const el = stepRefs.current[i]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i)
        },
        { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [stepsList.length])

  const safeActive = active < stepsList.length ? active : 0
  const step = stepsList[safeActive] || stepsList[0] || {
    id: 'step',
    num: '01',
    tag: '',
    heading: '',
    body: '',
    bullets: [],
    accent: '#1F8A54',
    image: '',
  }

  return (
    <section id="about" aria-labelledby="story-heading" className="relative">

      {/* ─── رأس القسم ─── */}
      <div className="bg-[var(--bg-soft)] py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
          <span className="text-sm font-semibold text-[#1F8A54]">
            {data?.badge || 'لماذا WebStep؟'}
          </span>
        </div>
        <h2 id="story-heading" className="text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
          {data?.title || 'القصة كاملة'}
        </h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto mt-3">
          {data?.subtitle || 'مرّر للأسفل لاكتشاف كيف نحوّل تحدياتك إلى نجاحات رقمية'}
        </p>
      </div>

      {/* ─── المنطقة اللصيقة ─── */}
      <div ref={sectionRef} className="relative" style={{ height: `${stepsList.length * 100}vh` }}>

        {/* اللوحة الثابتة */}
        <div className="sticky top-0 h-screen overflow-hidden flex" dir="rtl">

          {/* ─ عمود النص (يمين) ─ */}
          <div className="relative flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-[var(--bg-base)]">

            {/* خلفية ناعمة */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(ellipse at 80% 50%, ${step.accent}12 0%, transparent 65%)`,
              }}
            />

            {/* مؤشرات الخطوات (نقاط) */}
            <div className="absolute top-8 left-8 flex gap-2">
              {stepsList.map((s, i) => (
                <button
                  key={s.id || i}
                  onClick={() => {
                    stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === safeActive ? 28 : 8,
                    height: 8,
                    background: i === safeActive ? step.accent : 'rgba(31,138,84,0.2)',
                  }}
                  aria-label={s.heading}
                />
              ))}
            </div>

            {/* المحتوى — كل شريحة تظهر وتختفي */}
            <div className="relative z-10 max-w-lg">
              {stepsList.map((s, i) => (
                <div
                  key={s.id || i}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: i === safeActive ? 1 : 0,
                    transform: i === safeActive
                      ? 'translateY(0) scale(1)'
                      : i < safeActive
                        ? 'translateY(-24px) scale(0.97)'
                        : 'translateY(24px) scale(0.97)',
                    transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
                    pointerEvents: i === safeActive ? 'auto' : 'none',
                  }}
                >
                  {/* التاق + الرقم */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: `${s.accent}18`, color: s.accent, border: `1px solid ${s.accent}40` }}
                    >
                      {s.tag}
                    </span>
                    <span className="text-5xl font-black opacity-[0.06] text-[var(--text-primary)] select-none">
                      {s.num}
                    </span>
                  </div>

                  {/* العنوان */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5 text-[var(--text-primary)]">
                    {s.heading}
                  </h3>

                  {/* النص */}
                  <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] mb-7">
                    {s.body}
                  </p>

                  {/* النقاط */}
                  <ul className="space-y-3">
                    {(s.bullets || []).map((b, bi) => (
                      <li
                        key={b}
                        className="flex items-center gap-3"
                        style={{ transitionDelay: `${bi * 60}ms` }}
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: `${s.accent || '#1F8A54'}20`, border: `1.5px solid ${s.accent || '#1F8A54'}` }}
                        >
                          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                            <path d="M1 3.5L3 5.5L7 1.5" stroke={s.accent || '#1F8A54'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* spacer لتحديد الارتفاع */}
              <div className="invisible">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full">{step?.tag}</span>
                  <span className="text-5xl font-black">{step?.num}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">{step?.heading}</h3>
                <p className="text-base sm:text-lg leading-relaxed mb-7">{step?.body}</p>
                <ul className="space-y-3">
                  {(step?.bullets || []).map(b => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex-shrink-0" />
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* شريط التقدم سفلي */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border)]">
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{ width: `${((safeActive + 1) / stepsList.length) * 100}%`, background: step?.accent || '#1F8A54' }}
              />
            </div>
          </div>

          {/* ─ عمود الوسائط (يسار) ─ */}
          <div
            className="relative w-[45%] lg:w-[50%] flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--bg-base)' }}
          >
            {/* توهج خلفي بلون الخطوة */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(ellipse at center, ${step?.accent || '#1F8A54'}15 0%, transparent 70%)`,
              }}
            />

            {/* الشرائح */}
            {stepsList.map((s, i) => (
              <div
                key={s.id || i}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: i === safeActive ? 1 : 0,
                  transform: i === safeActive
                    ? 'scale(1) translateY(0)'
                    : i < safeActive
                      ? 'scale(0.94) translateY(-20px)'
                      : 'scale(0.94) translateY(20px)',
                  transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
                  pointerEvents: i === safeActive ? 'auto' : 'none',
                }}
              >
                {s.image ? (
                  /* كل الشرائح تعرض صورتها */
                  <div className="w-full h-full p-6 lg:p-10 flex items-center justify-center">
                    <Image
                      src={s.image}
                      alt={s.heading || 'خطوة'}
                      width={900}
                      height={700}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{ maxHeight: '80vh' }}
                      quality={85}
                      priority={i === 0}
                    />
                  </div>
                ) : (
                  <StepVisual step={s} />
                )}
              </div>
            ))}

            {/* رقم الخطوة الزخرفي */}
            <div className="absolute bottom-6 left-6 z-10 select-none pointer-events-none transition-all duration-700">
              <span className="text-6xl font-black leading-none" style={{ color: `${step?.accent || '#1F8A54'}25` }}>
                {step?.num}
              </span>
            </div>
          </div>
        </div>

        {/* ─── مناطق scroll الشفافة ─── */}
        <div className="absolute inset-0 pointer-events-none">
          {stepsList.map((_, i) => (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el }}
              className="pointer-events-auto"
              style={{ height: '100vh' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
