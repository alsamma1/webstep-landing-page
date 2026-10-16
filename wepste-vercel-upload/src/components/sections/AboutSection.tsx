'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Sparkles, Zap, ArrowUpRight, Users, Monitor, Shield, Fingerprint, Eye } from 'lucide-react'
import { WHY_ITEMS } from '@/data'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles, Zap, ArrowUpRight, Users, Monitor, Shield, Fingerprint, Eye,
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="about-title"
    >
      {/* BG accent */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full opacity-[0.04] dark:opacity-[0.07] -z-10"
        style={{
          background: 'radial-gradient(circle, #1F8A54 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      {/* خطوط زخرفية */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(31,138,84,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(31,138,84,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container-ws">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Character */}
          <div
            className="flex justify-center lg:justify-end order-2 lg:order-1 relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(60px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            <div className="relative">
              {/* حلقات زخرفية */}
              <div
                className="absolute rounded-full border pointer-events-none"
                style={{
                  inset: '-32px',
                  borderColor: 'rgba(31,138,84,0.08)',
                  animation: 'spin 20s linear infinite',
                }}
              />
              <div
                className="absolute rounded-full border pointer-events-none"
                style={{
                  inset: '-16px',
                  borderColor: 'rgba(31,138,84,0.05)',
                  animation: 'spin 15s linear infinite reverse',
                }}
              />

              {/* بطاقة الخلفية */}
              <div className="absolute -inset-8 rounded-3xl bg-[rgba(31,138,84,0.05)] dark:bg-[rgba(31,138,84,0.08)] -z-10" />

              {/* شارات عائمة */}
              <div
                className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-xl text-xs font-bold z-20"
                style={{ animation: 'float 5s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
                  <span className="text-[var(--text-primary)]">100% جودة</span>
                </div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 glass-card px-3 py-2 rounded-xl text-xs font-bold z-20"
                style={{ animation: 'float 6s ease-in-out infinite reverse' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1F8A54]">⚡</span>
                  <span className="text-[var(--text-primary)]">أداء فائق</span>
                </div>
              </div>

              {/* الشعار + تأثيرات بصرية */}
              <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
                {/* دائرة خارجية دوارة */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed pointer-events-none"
                  style={{ borderColor: 'rgba(31,138,84,0.15)', animation: 'spin 18s linear infinite' }}
                />
                {/* دائرة وسطية */}
                <div
                  className="absolute rounded-full border pointer-events-none"
                  style={{ inset: '20px', borderColor: 'rgba(31,138,84,0.08)', animation: 'spin 12s linear infinite reverse' }}
                />
                {/* دائرة داخلية */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: '40px',
                    background: 'radial-gradient(circle, rgba(31,138,84,0.08) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite',
                  }}
                />
                {/* اللوغو المركزي */}
                <div
                  className="relative z-10 flex items-center justify-center rounded-full shadow-2xl"
                  style={{
                    width: 120, height: 120,
                    background: 'var(--surface)',
                    border: '2px solid rgba(31,138,84,0.3)',
                    boxShadow: '0 0 0 12px rgba(31,138,84,0.05), 0 20px 60px rgba(31,138,84,0.2)',
                    animation: 'float 5s ease-in-out infinite',
                  }}
                >
                  <Image src="/assets/logo.png" alt="WebStep" width={72} height={72} className="object-contain" style={{ width: 72, height: 'auto' }} />
                </div>
                {/* نقاط مدارية */}
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: '#1F8A54',
                      opacity: 0.3 + i * 0.15,
                      top: '50%', left: '50%',
                      transform: `rotate(${i * 90}deg) translateX(110px) translateY(-50%)`,
                      animation: `spin ${8 + i * 2}s linear infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
              }}
            >
              <span className="section-label">لماذا WebStep؟</span>
              <h2 id="about-title" className="section-title">
                ليس مجرد{' '}
                <span className="text-gradient-green">مطورين</span>
                <br />
                نحن شركاء نجاحك
              </h2>
              <p className="section-subtitle mb-8">
                في WebStep، نؤمن أن كل مشروع هو فرصة لبناء شيء استثنائي. نجمع بين التقنية المتقدمة والتصميم الرائع لنقدم لك منتجاً يفوق توقعاتك.
              </p>
            </div>

            {/* Why Grid */}
            <div className="why-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHY_ITEMS.map((item, i) => {
                const Icon = iconMap[item.icon]
                const isHovered = hoveredCard === item.id
                return (
                  <div
                    key={item.id}
                    className="why-card group relative flex items-start gap-3 p-4 rounded-xl border cursor-default overflow-hidden"
                    style={{
                      borderColor: isHovered ? 'rgba(31,138,84,0.4)' : 'var(--border)',
                      background: isHovered ? 'rgba(31,138,84,0.04)' : 'var(--surface)',
                      boxShadow: isHovered ? '0 8px 30px rgba(31,138,84,0.12)' : 'none',
                      transform: isHovered ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                      opacity: visible ? 1 : 0,
                      transitionDelay: `${0.2 + i * 0.07}s`,
                    }}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* نبضة خلفية عند الـ hover */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-xl"
                      style={{
                        background: `radial-gradient(ellipse at 20% 50%, rgba(31,138,84,0.08) 0%, transparent 70%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10 transition-all duration-300"
                      style={{
                        background: isHovered ? '#1F8A54' : 'rgba(31,138,84,0.1)',
                        color: isHovered ? '#fff' : '#1F8A54',
                        transform: isHovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)',
                      }}
                    >
                      {Icon && <Icon size={16} />}
                    </div>
                    <div className="relative z-10">
                      <h3
                        className="font-700 text-sm mb-0.5 transition-colors duration-200"
                        style={{ color: isHovered ? '#1F8A54' : 'var(--text-primary)' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}
