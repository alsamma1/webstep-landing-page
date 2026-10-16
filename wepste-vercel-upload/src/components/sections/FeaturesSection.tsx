'use client'

import { useEffect, useRef } from 'react'
import { Monitor, Zap, Lock, TrendingUp, Sparkles, Search, BarChart3, Plug } from 'lucide-react'
import { FEATURES } from '@/data'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor, Zap, Lock, TrendingUp, Sparkles, Search, BarChart3, Plug,
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          gsap.fromTo('.feature-item', {
            opacity: 0,
            x: -30,
          }, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.features-grid',
              start: 'top 80%',
            },
          })
        }, sectionRef)

        return () => ctx.revert()
      } catch {}
    }
    initGsap()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="features-title"
    >
      <div className="absolute inset-0 -z-10 bg-[var(--bg)]" />

      <div className="container-ws">
        <div className="text-center mb-14">
          <span className="section-label mx-auto">المميزات</span>
          <h2 id="features-title" className="section-title">
            مبني على أساس{' '}
            <span className="text-gradient-green">متين</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            كل منتج نبنيه يأتي مجهزاً بهذه المميزات الأساسية دون أن تطلبها.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <div
                key={feature.id}
                className="feature-item group p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(31,138,84,0.35)] hover:shadow-[0_4px_30px_rgba(31,138,84,0.1)] transition-all duration-300 cursor-default"
                role="article"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[rgba(31,138,84,0.15)] to-[rgba(31,138,84,0.05)] text-[#1F8A54] group-hover:from-[#1F8A54] group-hover:to-[#176840] group-hover:text-white transition-all duration-300">
                    {Icon && <Icon size={18} />}
                  </div>
                  <h3 className="font-700 text-sm text-[var(--text-primary)]">{feature.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Big CTA Banner */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#1F8A54] to-[#0e5c38] p-10 md:p-14 text-white">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
              جاهز لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-white/80 text-base mb-8">
              انضم إلى عملائنا الراضين وابدأ رحلتك الرقمية مع WebStep اليوم.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById('contact')
                  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
                }}
                className="px-8 py-3.5 bg-white text-[#1F8A54] font-800 rounded-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200 text-sm"
                id="features-cta-btn"
              >
                ابدأ مشروعك الآن
              </button>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white/10 text-white font-700 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-sm"
              >
                تواصل واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
