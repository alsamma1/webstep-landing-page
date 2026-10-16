'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Monitor, Zap, Lock, TrendingUp, Sparkles, Search, BarChart3, Plug, Lightbulb,
} from 'lucide-react'
import { STATS, FEATURES } from '@/data'
import type { StatsFeaturesSectionData } from '@/lib/homepage-types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor, Zap, Lock, TrendingUp, Sparkles, Search, BarChart3, Plug,
}

/* ─── عداد إحصائية ─── */
function useCountUp(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [active, target, duration])
  return count
}

function StatCard({ value, label, index, visible }: { value: string; label: string; index: number; visible: boolean }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const num    = parseInt(value.replace(/\D/g, ''), 10)
  const suffix = value.replace(/[\d,]/g, '')
  const count  = useCountUp(num, 1600, active)

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-2xl group cursor-default"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity 0.6s ease ${0.1 + index * 0.1}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + index * 0.1}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(31,138,84,0.5)'
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(31,138,84,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="text-4xl font-black text-[#1F8A54] transition-all duration-300 group-hover:scale-110">
        {active ? `${count}${suffix}` : value}
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-1.5 font-semibold">{label}</div>
    </div>
  )
}

/* ─── موضع عناصر الدائرة ─── */
function getCirclePos(index: number, total: number, rx: number, ry: number) {
  const half  = Math.ceil(total / 2)
  const side  = index < half ? -1 : 1
  const pos   = index < half ? index : index - half
  const step  = (ry * 1.6) / (half - 1 || 1)
  const y     = -ry * 0.8 + pos * step
  const x     = side * rx
  return { x, y }
}

/* ─── خط SVG متحرك ─── */
function Arrow({ x, y, delay, visible }: { x: number; y: number; delay: number; visible: boolean }) {
  const len    = Math.sqrt(x * x + y * y)
  const shrink = 52
  const ratio  = (len - shrink) / len
  const ex     = x * ratio
  const ey     = y * ratio
  const id     = `arr-${Math.round(x)}-${Math.round(y)}`

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible', zIndex: 1 }}
    >
      <defs>
        <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1F8A54" opacity="0.7" />
        </marker>
      </defs>
      <line
        x1="50%" y1="50%"
        x2={`calc(50% + ${ex}px)`}
        y2={`calc(50% + ${ey}px)`}
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        markerEnd={`url(#${id})`}
        style={{
          opacity:   visible ? 0.6 : 0,
          transition: `opacity 0.5s ease ${delay + 0.4}s`,
        }}
      />
    </svg>
  )
}

/* ─── بطاقة المعيار ─── */
function FeatureNode({
  feature, x, y, index, visible,
}: {
  feature: any
  x: number; y: number
  index: number; visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const Icon  = (feature.icon && ICON_MAP[feature.icon]) ? ICON_MAP[feature.icon] : Lightbulb
  const delay = 0.4 + index * 0.1

  return (
    <div
      className="absolute"
      style={{
        left:      `calc(50% + ${x}px)`,
        top:       `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) ${visible ? 'scale(1)' : 'scale(0.4)'}`,
        opacity:   visible ? 1 : 0,
        transition: `opacity 0.5s ease ${delay}s, transform 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
        zIndex: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex flex-col items-center gap-1.5 cursor-default"
        style={{
          transform: hovered ? 'translateY(-6px) scale(1.08)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* الأيقونة */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{
            background: hovered ? '#1F8A54' : 'var(--surface)',
            border: '1.5px solid rgba(31,138,84,0.35)',
            boxShadow: hovered
              ? '0 8px 30px rgba(31,138,84,0.45), 0 0 0 4px rgba(31,138,84,0.1)'
              : '0 4px 12px rgba(0,0,0,.12)',
            transition: 'all 0.3s ease',
          }}
        >
          <Icon size={20} className={hovered ? 'text-white' : 'text-[#1F8A54]'} />
        </div>
        {/* العنوان */}
        <span
          className="text-xs font-black text-center leading-tight max-w-[90px] whitespace-pre-wrap"
          style={{
            color: hovered ? '#1F8A54' : 'var(--text-primary)',
            transition: 'color 0.2s ease',
          }}
        >
          {feature.title}
        </span>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute z-50 w-44 rounded-xl p-3 text-xs leading-relaxed shadow-2xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid rgba(31,138,84,0.3)',
            color: 'var(--text-secondary)',
            top: '50%',
            transform: 'translateY(-50%)',
            ...(x >= 0
              ? { left: 'calc(100% + 12px)' }
              : { right: 'calc(100% + 12px)' }
            ),
            animation: 'tooltipIn .2s cubic-bezier(.34,1.56,.64,1) both',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(31,138,84,0.15)',
          }}
        >
          <p className="font-bold text-[#1F8A54] mb-1 text-[10px]">{feature.title}</p>
          {feature.description}
        </div>
      )}
    </div>
  )
}

/* ─── المكوّن الرئيسي ─── */
export default function StatsFeatures({ data }: { data?: StatsFeaturesSectionData }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const statsList = data?.stats && data.stats.length > 0 ? data.stats : STATS
  const featuresList = data?.features && data.features.length > 0 ? data.features : FEATURES

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const total = featuresList.length
  const RX    = 260
  const RY    = 200

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden" aria-label="إحصاءات ومزايا">
      <div className="absolute inset-0 bg-[var(--bg-soft)] -z-10" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(31,138,84,0.06) 0%,transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* جسيمات عائمة */}
      {visible && [0,1,2,3,4,5].map(i => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            background: '#1F8A54',
            opacity: 0.12,
            left: `${8 + i * 15}%`,
            top: `${10 + (i * 13) % 70}%`,
            animation: `floatParticle ${4 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">

        {/* ─── الإحصاءات ─── */}
        <div
          className="mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
              <span className="text-sm font-semibold text-[#1F8A54]">{data?.badge || 'أرقام تتحدث عن نفسها'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
              {data?.title || 'إنجازاتنا بالأرقام'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statsList.map((stat, i) => (
              <StatCard key={stat.label || i} value={stat.value} label={stat.label} index={i} visible={visible} />
            ))}
          </div>
        </div>

        {/* ─── عنوان المعايير ─── */}
        <div
          className="text-center mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
            <span className="text-sm font-semibold text-[#1F8A54]">لماذا نتميز</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)]">معايير جودتنا</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mt-3 text-sm">
            {data?.subtitle || 'كل معيار ينبثق مباشرةً من هوية WebStep — تحوّم على أي معيار لتعرف أكثر'}
          </p>
        </div>

        {/* ─── مخطط الشعار + السهام + المعايير (شاشات الكمبيوتر والتابلت) ─── */}
        <div
          className="hidden md:block relative mx-auto"
          style={{ width: '100%', maxWidth: 700, height: 580 }}
        >
          {/* تدرج الخطوط */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1F8A54" stopOpacity="0" />
                <stop offset="100%" stopColor="#1F8A54" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>

          {/* السهام */}
          {featuresList.map((_, i) => {
            const { x, y } = getCirclePos(i, total, RX, RY)
            return (
              <Arrow key={i} x={x} y={y} delay={i * 0.1} visible={visible} />
            )
          })}

          {/* الشعار في المنتصف */}
          <div
            className="absolute z-20"
            style={{
              left: '50%', top: '50%',
              transform: `translate(-50%,-50%) ${visible ? 'scale(1)' : 'scale(0)'}`,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.7s ease 0.1s, transform 0.8s cubic-bezier(.34,1.56,.64,1) 0.1s',
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 120, height: 120,
                background: 'var(--surface)',
                border: '2px solid rgba(31,138,84,0.4)',
                boxShadow: '0 0 0 12px rgba(31,138,84,0.06), 0 0 0 24px rgba(31,138,84,0.03), 0 16px 48px rgba(0,0,0,.18)',
              }}
            >
              <Image
                src="/assets/logo.png"
                alt="WebStep Logo"
                width={80}
                height={80}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>

            {/* نبضتان */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '2px solid rgba(31,138,84,0.3)',
                animation: visible ? 'pulseRing 2.5s ease-out infinite' : 'none',
              }}
            />
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '2px solid rgba(31,138,84,0.15)',
                animation: visible ? 'pulseRing 2.5s ease-out infinite 1.25s' : 'none',
              }}
            />
          </div>

          {/* المعايير */}
          {featuresList.map((f, i) => {
            const { x, y } = getCirclePos(i, total, RX, RY)
            return (
              <FeatureNode
                key={(f as any)?.id || f.title || i}
                feature={f}
                x={x} y={y}
                index={i}
                visible={visible}
              />
            )
          })}
        </div>

        {/* ─── تخطيط الهواتف الذكية: شعار بارز ومعايير الجودة بشكل منسق وجذاب ─── */}
        <div className="block md:hidden mt-4">
          {/* الشعار المركزي بنبضاته في المنتصف */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative">
              <div
                className="relative flex items-center justify-center rounded-full z-10"
                style={{
                  width: 90, height: 90,
                  background: 'var(--surface)',
                  border: '2px solid rgba(31,138,84,0.4)',
                  boxShadow: '0 0 0 8px rgba(31,138,84,0.08), 0 0 0 16px rgba(31,138,84,0.03), 0 12px 32px rgba(0,0,0,.15)',
                }}
              >
                <Image
                  src="/assets/logo.png"
                  alt="WebStep Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>

              {/* نبضتان */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '2px solid rgba(31,138,84,0.3)',
                  animation: visible ? 'pulseRing 2.5s ease-out infinite' : 'none',
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '2px solid rgba(31,138,84,0.15)',
                  animation: visible ? 'pulseRing 2.5s ease-out infinite 1.25s' : 'none',
                }}
              />
            </div>
            <span className="text-xs font-bold text-[#1F8A54] mt-3.5 tracking-wide">
              معايير الجودة في كل خطوة
            </span>
          </div>

          {/* شبكة المعايير المنسقة للموبايل */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {featuresList.map((f, i) => {
              const Icon = (f.icon && ICON_MAP[f.icon]) ? ICON_MAP[f.icon] : Lightbulb
              return (
                <div
                  key={(f as any)?.id || f.title || i}
                  className="relative p-3.5 rounded-2xl flex items-start gap-3 transition-all duration-300"
                  style={{
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.4s ease ${0.05 + i * 0.04}s, transform 0.4s ease ${0.05 + i * 0.04}s`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5"
                    style={{
                      background: 'rgba(31,138,84,0.08)',
                      border: '1.5px solid rgba(31,138,84,0.25)',
                    }}
                  >
                    <Icon size={18} className="text-[#1F8A54]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-[var(--text-primary)] mb-0.5 leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                      {(f as any)?.description || (f as any)?.desc || ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(2.2); opacity: 0;  }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(-50%) scale(0.9); }
          to   { opacity: 1; transform: translateY(-50%) scale(1);   }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  )
}
