'use client'

import { useEffect, useRef } from 'react'
import { Lightbulb, Map, PenTool, Code2, TestTube, Rocket } from 'lucide-react'
import { PROCESS_STEPS } from '@/data'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Lightbulb, Map, PenTool, Code2, TestTube, Rocket,
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          // Animate steps
          gsap.fromTo('.process-step', {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 80%',
            },
          })

          // Animate the connecting line
          gsap.fromTo('.process-line', {
            scaleX: 0,
            transformOrigin: 'right center',
          }, {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 70%',
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
      id="process"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="process-title"
    >
      <div className="absolute inset-0 -z-10 bg-[var(--bg-soft)]" />

      <div className="container-ws">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label mx-auto">كيف نعمل</span>
          <h2 id="process-title" className="section-title">
            رحلتك معنا{' '}
            <span className="text-gradient-green">خطوة بخطوة</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            منهجية واضحة وشفافة من اليوم الأول. تعرف بالضبط ما يحدث وما هي الخطوة القادمة في كل وقت.
          </p>
        </div>

        {/* Steps */}
        <div className="process-steps relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-10 right-[8.33%] left-[8.33%] h-0.5 bg-[var(--border)] -z-0">
            <div
              className="process-line absolute inset-0 bg-gradient-to-l from-[#1F8A54] via-[rgba(31,138,84,0.5)] to-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = iconMap[step.icon]
              const isLast = index === PROCESS_STEPS.length - 1
              return (
                <div
                  key={step.number}
                  className="process-step group"
                  role="article"
                >
                  <div className="ws-card p-6 h-full">
                    {/* Number + Icon */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Step Number */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-xs font-900 text-[var(--text-muted)] group-hover:bg-[#1F8A54] group-hover:text-white transition-all duration-300">
                          {step.number}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(31,138,84,0.1)] text-[#1F8A54] group-hover:bg-[rgba(31,138,84,0.15)] transition-all duration-200">
                        {Icon && <Icon size={20} />}
                      </div>
                    </div>

                    <h3 className="font-800 text-[var(--text-primary)] text-lg mb-2 group-hover:text-[#1F8A54] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-4 h-1 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-[#1F8A54] to-[rgba(31,138,84,0.4)] rounded-full"
                        style={{ width: `${((index + 1) / PROCESS_STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
