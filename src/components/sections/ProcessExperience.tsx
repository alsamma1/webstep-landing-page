'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Lightbulb, Map, PenTool, Code2, TestTube, Rocket, X, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { ProcessSectionData } from '@/lib/homepage-types'

const PROCESS_ICON_MAP: Record<string, React.ElementType> = {
  Lightbulb, Map, PenTool, Code2, TestTube, Rocket,
}

const STEPS = [
  { number: '01', suit: '♠', icon: Lightbulb, title: 'فهم الفكرة',           description: 'نجلس معك لفهم رؤيتك وأهدافك وجمهورك المستهدف. هذه الخطوة تحدد كل شيء.',      color: '#1F8A54' },
  { number: '02', suit: '♥', icon: Map,        title: 'التخطيط الاستراتيجي', description: 'نضع خارطة طريق واضحة مع جدول زمني وميزانية محددة — لا مفاجآت.',              color: '#ef4444' },
  { number: '03', suit: '♦', icon: PenTool,    title: 'التصميم الإبداعي',     description: 'نصمم تجربة بصرية مذهلة تعكس هويتك وتجذب جمهورك بنماذج أولية تفاعلية.',      color: '#f59e0b' },
  { number: '04', suit: '♣', icon: Code2,      title: 'التطوير والبناء',      description: 'نكتب كوداً نظيفاً وفعالاً بأحدث التقنيات مع ضمان الأداء والأمان.',            color: '#1F8A54' },
  { number: '05', suit: '♠', icon: TestTube,   title: 'الاختبار والجودة',     description: 'اختبار شامل على جميع الأجهزة والمتصفحات — صفر أخطاء في الإطلاق.',           color: '#3b82f6' },
  { number: '06', suit: '♦', icon: Rocket,     title: 'الإطلاق والمتابعة',    description: 'إطلاق احترافي مع مراقبة مستمرة. نبقى معك بعد الإطلاق لضمان نجاحك.',        color: '#1F8A54' },
]

const DECK_EXTRAS = [
  { rotate: -14, tx: -7,  ty:  5  },
  { rotate: -7,  tx: -3,  ty:  2  },
  { rotate: -1,  tx:  0,  ty:  0  },
  { rotate:  6,  tx:  3,  ty: -3  },
  { rotate:  13, tx:  7,  ty: -7  },
]

const GRID = [
  { x: 0,   y: 0   }, { x: 175, y: 0   }, { x: 350, y: 0   },
  { x: 0,   y: 265 }, { x: 175, y: 265 }, { x: 350, y: 265 },
]
const CARD_W = 155
const CARD_H = 230

/* ─── ظهر البطاقة ─── */
function CardBack({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg,#0d2318 0%,#183a26 50%,#0d2318 100%)',
        border: '1.5px solid rgba(31,138,84,0.55)',
        backfaceVisibility: 'hidden',
        ...style,
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(31,138,84,.4) 0,rgba(31,138,84,.4) 1px,transparent 1px,transparent 8px)' }} />
      <span className="relative z-10 font-black" style={{ fontSize: 56, color: 'transparent', WebkitTextStroke: '2px rgba(31,138,84,0.85)', letterSpacing: '-.05em' }}>W</span>
      <span className="absolute top-2 right-3 text-[#1F8A54]/50 text-xs font-bold">W</span>
      <span className="absolute bottom-2 left-3 text-[#1F8A54]/50 text-xs font-bold rotate-180">W</span>
    </div>
  )
}

/* ─── وجه البطاقة ─── */
function CardFace({ step, isDark }: { step: any; isDark: boolean }) {
  const Icon = (typeof step.icon === 'string' ? PROCESS_ICON_MAP[step.icon] : step.icon) || Lightbulb
  const isRed = step.suit === '♥' || step.suit === '♦'
  return (
    <div
      className="absolute inset-0 rounded-xl flex flex-col overflow-hidden select-none"
      style={{
        background: isDark ? 'linear-gradient(145deg,#111b15,#1a2e20)' : 'linear-gradient(145deg,#ffffff,#f5fdf8)',
        border: `1.5px solid ${isDark ? 'rgba(31,138,84,0.3)' : 'rgba(31,138,84,0.2)'}`,
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      {/* أرقام الركنين */}
      <div className="absolute top-2 left-3 flex flex-col items-center leading-none">
        <span className="text-sm font-black" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.number}</span>
        <span className="text-xs"            style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.suit}</span>
      </div>
      <div className="absolute bottom-2 right-3 flex flex-col items-center leading-none rotate-180">
        <span className="text-sm font-black" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.number}</span>
        <span className="text-xs"            style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.suit}</span>
      </div>

      {/* المحتوى */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-3 py-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 flex-shrink-0"
          style={{ background: `${step.color}18`, border: `1.5px solid ${step.color}40` }}
        >
          <Icon size={18} style={{ color: step.color }} />
        </div>
        <span className="text-xl mb-1" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.suit}</span>
        <h3 className="text-xs font-black mb-1.5 leading-tight" style={{ color: '#1F8A54' }}>{step.title}</h3>
        <p className="text-[9px] leading-relaxed line-clamp-4" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}>
          {step.description}
        </p>
      </div>
    </div>
  )
}

/* ─── Modal البطاقة المكبّرة — مُحسَّن ─── */
function CardModal({ step, isDark, onClose }: { step: any; isDark: boolean; onClose: () => void }) {
  const Icon = (typeof step.icon === 'string' ? PROCESS_ICON_MAP[step.icon] : step.icon) || Lightbulb
  const isRed = step.suit === '♥' || step.suit === '♦'
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* تعتيم الخلفية */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" style={{ animation: 'fadeIn .25s ease both' }} />

      {/* البطاقة المكبّرة */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          width: 340, maxWidth: '90vw',
          background: isDark ? 'linear-gradient(145deg,#111b15,#1a2e20)' : 'linear-gradient(145deg,#ffffff,#f0fdf7)',
          border: `2px solid ${step.color}40`,
          animation: 'cardPop .4s cubic-bezier(.34,1.56,.64,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* رأس ملوّن */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ background: `linear-gradient(135deg, ${step.color}18 0%, transparent 100%)`, borderBottom: `1px solid ${step.color}20` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${step.color}18`, border: `2px solid ${step.color}40` }}
              >
                <Icon size={24} style={{ color: step.color }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: step.color }}>{step.number} {step.suit}</p>
                <h3 className="text-lg font-black" style={{ color: '#1F8A54' }}>{step.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-black/10"
              aria-label="إغلاق"
            >
              <X size={18} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }} />
            </button>
          </div>

          {/* شريط اللون */}
          <div className="h-1 rounded-full" style={{ background: `linear-gradient(to left, ${step.color}, ${step.color}40)` }} />
        </div>

        {/* الوصف */}
        <div className="px-6 py-5">
          <p className="text-base leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)' }}>
            {step.description}
          </p>
        </div>

        {/* رمز الدعة الزخرفي */}
        <div className="absolute bottom-4 left-4 text-5xl opacity-5 select-none pointer-events-none" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>{step.suit}</div>
      </div>
    </div>
  )
}

/* ─── المكوّن الرئيسي ─── */
export default function ProcessExperience({ data }: { data?: ProcessSectionData }) {
  const rawSteps = (data as any)?.cards || (data as any)?.steps
  const stepsList: typeof STEPS = (rawSteps && rawSteps.length > 0 ? rawSteps : STEPS).slice(0, 6)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [visible,    setVisible]    = useState(false)
  const [dealt,      setDealt]      = useState(false)
  const [flipped,    setFlipped]    = useState<boolean[]>(Array(6).fill(false))
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const deckRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        setVisible(true)
        setTimeout(() => setDealt(true), 400)
        stepsList.forEach((_: any, i: number) => {
          setTimeout(() => setFlipped(p => { const n = [...p]; n[i] = true; return n }), 1100 + i * 220)
        })
      }
    }, { threshold: 0.25 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [visible, stepsList])

  const onDeckMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = deckRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 2, y: ((e.clientY - rect.top) / rect.height - 0.5) * 2 })
  }, [])
  const onDeckMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), [])

  return (
    <>
      {/* Modal للبطاقة المكبّرة */}
      {activeCard !== null && stepsList[activeCard] && (
        <CardModal step={stepsList[activeCard]} isDark={isDark} onClose={() => setActiveCard(null)} />
      )}

      <section
        id="process"
        ref={sectionRef}
        className="relative py-24 overflow-hidden"
        aria-labelledby="process-heading"
      >
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg,var(--bg-base) 0%,var(--bg-soft) 100%)' }} />
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 50%,rgba(31,138,84,.07) 0%,transparent 70%)' }} />

        {/* جسيمات عائمة زخرفية */}
        {visible && [0,1,2,3,4].map(i => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              background: '#1F8A54',
              opacity: 0.15,
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `particleFloat ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">

          {/* العنوان */}
          <div
            className="text-center mb-16"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
              <span className="text-sm font-semibold text-[#1F8A54]">
                {data?.badge || 'طريقة عملنا'}
              </span>
            </div>
            <h2 id="process-heading" className="text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
              {data?.title || 'رحلة مشروعك معنا'}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto mt-3">
              {data?.subtitle || '6 خطوات منظّمة — اضغط على أي بطاقة لتكبيرها'}
            </p>
          </div>

          {/* ─── التخطيط ─── */}
          {/* شاشات سطح المكتب واللابتوب (lg وأعلى) */}
          <div className="hidden lg:flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">

            {/* البطاقات الست — يمين */}
            <div
              className="relative flex-shrink-0"
              style={{
                width: 350 + CARD_W,
                height: 265 + CARD_H,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-50px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              }}
            >
              {stepsList.map((step, i) => {
                const g = GRID[i]
                const isHov = hoveredCard === i
                return (
                  <div
                    key={step.number || i}
                    className="absolute cursor-pointer"
                    style={{
                      width: CARD_W, height: CARD_H,
                      left:  dealt ? g.x : 600,
                      top:   dealt ? g.y : 80,
                      transition: `left .75s cubic-bezier(.34,1.56,.64,1) ${i*90}ms, top .75s cubic-bezier(.34,1.56,.64,1) ${i*90}ms, transform .3s ease, filter .3s ease, z-index 0s`,
                      zIndex: isHov ? 100 : 40 + i,
                      perspective: 800,
                      filter: isHov
                        ? `drop-shadow(0 16px 40px ${step.color}50)`
                        : 'drop-shadow(0 6px 18px rgba(0,0,0,.22))',
                      transform: isHov ? 'scale(1.06) translateY(-6px)' : 'scale(1)',
                    }}
                    onClick={() => setActiveCard(i)}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      style={{
                        width: '100%', height: '100%', position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: 'transform .7s cubic-bezier(.4,0,.2,1)',
                        transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <CardBack />
                      <CardFace step={step} isDark={isDark} />
                    </div>

                    {/* مؤشر الضغط */}
                    {flipped[i] && (
                      <div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-semibold whitespace-nowrap"
                        style={{
                          color: step.color,
                          opacity: isHov ? 1 : 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        اضغط للتكبير
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* الحزمة + شرح — يسار */}
            <div
              className="flex flex-col items-center gap-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(50px)',
                transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
              }}
            >
              {/* الحزمة */}
              <div
                ref={deckRef}
                className="relative flex-shrink-0 select-none"
                style={{ width: CARD_W + 40, height: CARD_H + 60, zIndex: 10 }}
                onMouseMove={onDeckMouseMove}
                onMouseLeave={onDeckMouseLeave}
              >
                {/* الحزمة الأساسية */}
                <div
                  className="absolute"
                  style={{ width: CARD_W, height: CARD_H, left: 20, top: 40, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}
                >
                  <CardBack />
                </div>

                {/* البطاقات المبعثرة — تتفاعل مع الماوس */}
                {DECK_EXTRAS.map((extra, i) => {
                  const floatX  = mouse.x * (6 + i * 4)
                  const floatY  = mouse.y * (4 + i * 3)
                  const rotateZ = extra.rotate + mouse.x * (3 + i)
                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        width: CARD_W, height: CARD_H,
                        left: 20 + extra.tx,
                        top:  40 + extra.ty,
                        transform: `rotate(${rotateZ}deg) translate(${floatX}px,${floatY}px)`,
                        transition: `transform 0.${3 + i}s cubic-bezier(.25,.46,.45,.94) ${i * 0.06}s`,
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,.3)',
                        zIndex: i + 1,
                      }}
                    >
                      <CardBack />
                    </div>
                  )
                })}

                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold"
                  style={{ color: 'rgba(31,138,84,0.55)' }}
                >
                  حزمة البطاقات • 6 خطوات
                </div>
              </div>

              {/* لوحة تعليمات */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{
                  background: isDark ? 'rgba(31,138,84,0.08)' : 'rgba(31,138,84,0.04)',
                  border: '1px solid rgba(31,138,84,0.2)',
                  maxWidth: CARD_W + 40,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(31,138,84,0.12)' }}>
                  <ArrowLeft size={18} className="text-[#1F8A54]" />
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">كيف تتفاعل؟</p>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                  تحوم فوق الحزمة لتحريكها، واضغط على أي بطاقة لرؤية تفاصيل الخطوة
                </p>
              </div>
            </div>
          </div>

          {/* ─── تخطيط الهواتف والأجهزة الذكية (< lg) ─── */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {stepsList.map((step, i) => {
                const Icon = (typeof step.icon === 'string' ? PROCESS_ICON_MAP[step.icon] : step.icon) || Lightbulb
                const isRed = step.suit === '♥' || step.suit === '♦'
                return (
                  <div
                    key={step.number || i}
                    onClick={() => setActiveCard(i)}
                    className="group relative rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-95 transition-all duration-200"
                    style={{
                      background: isDark
                        ? 'linear-gradient(145deg, #111b15, #1a2e20)'
                        : 'linear-gradient(145deg, #ffffff, #f7fdf9)',
                      border: `1.5px solid ${isDark ? 'rgba(31,138,84,0.3)' : 'rgba(31,138,84,0.2)'}`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      minHeight: 180,
                    }}
                  >
                    {/* ركن علوي: الرقم والرمز والأيقونة */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>
                          {step.number}
                        </span>
                        <span className="text-xs" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>
                          {step.suit}
                        </span>
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${step.color}18`, border: `1px solid ${step.color}40` }}
                      >
                        <Icon size={16} style={{ color: step.color }} />
                      </div>
                    </div>

                    {/* المحتوى */}
                    <div className="my-auto">
                      <h3 className="text-xs font-black text-[#1F8A54] leading-tight mb-1">
                        {step.title}
                      </h3>
                      <p
                        className="text-[10px] leading-relaxed line-clamp-3"
                        style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* ركن سفلي: اضغط للتفاصيل */}
                    <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[var(--border)]/50">
                      <span className="text-[9px] font-bold text-[#1F8A54]">
                        اضغط للتفاصيل
                      </span>
                      <span className="text-[10px]" style={{ color: isRed ? '#ef4444' : '#1F8A54' }}>
                        {step.suit}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* شريط خطوات تفاعلي مبسط أسفل البطاقات */}
            <div
              className="mt-5 p-3 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none"
              style={{
                background: isDark ? 'rgba(31,138,84,0.08)' : 'rgba(31,138,84,0.04)',
                border: '1px solid rgba(31,138,84,0.2)',
              }}
            >
              {stepsList.map((step, i) => (
                <button
                  key={step.number || i}
                  onClick={() => setActiveCard(i)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all active:scale-95"
                  style={{
                    background: activeCard === i ? '#1F8A54' : 'var(--surface)',
                    color: activeCard === i ? '#fff' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span>{step.number}</span>
                  <span className="text-[9px] opacity-75">{step.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
          @keyframes cardPop { from{opacity:0;transform:scale(.8) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
          @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-12px) rotate(120deg); }
            66% { transform: translateY(-6px) rotate(240deg); }
          }
        `}</style>
      </section>
    </>
  )
}
