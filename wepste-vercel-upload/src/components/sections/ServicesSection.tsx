'use client'

import { useEffect, useRef } from 'react'
import { Globe, Smartphone, Palette, Layout, ShoppingCart, Server, TrendingUp, HeartHandshake, ArrowLeft } from 'lucide-react'
import { SERVICES } from '@/data'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, Smartphone, Palette, Layout, ShoppingCart, Server, TrendingUp, HeartHandshake,
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          // Animate cards in
          gsap.fromTo('.service-card', {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.services-grid',
              start: 'top 85%',
            },
          })

          // Section title
          gsap.fromTo('.services-header > *', {
            opacity: 0,
            y: 30,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.services-header',
              start: 'top 85%',
            },
          })
        }, sectionRef)

        return () => ctx.revert()
      } catch {}
    }
    initGsap()
  }, [])

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="services-title"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[var(--bg-soft)]" />

      <div className="container-ws">
        {/* Header */}
        <div className="services-header text-center mb-14">
          <span className="section-label mx-auto">خدماتنا</span>
          <h2 id="services-title" className="section-title">
            كل ما تحتاجه{' '}
            <span className="text-gradient-green">تحت سقف واحد</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            من الفكرة إلى المنتج النهائي — نقدم خدمات تقنية متكاملة تلبي احتياجات مشروعك بأعلى المعايير.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <div
                key={service.id}
                className="service-card ws-card p-6 group cursor-pointer"
                role="article"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(31,138,84,0.1)] text-[#1F8A54] mb-4 group-hover:bg-[#1F8A54] group-hover:text-white transition-all duration-300">
                  {Icon && <Icon size={22} />}
                </div>

                {/* Title */}
                <h3 className="font-800 text-[var(--text-primary)] text-base mb-1 group-hover:text-[#1F8A54] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-3 font-500">{service.titleEn}</p>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A54] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className="flex items-center gap-1 text-xs font-700 text-[#1F8A54] hover:gap-2 transition-all mt-auto"
                >
                  اطلب الخدمة
                  <ArrowLeft size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
