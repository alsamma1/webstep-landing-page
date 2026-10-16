'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, Sparkles, Star } from 'lucide-react'
import WebStepCharacter from '@/components/character/WebStepCharacter'
import { STATS } from '@/data'
import type { CharacterState } from '@/types'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [characterState, setCharacterState] = useState<CharacterState>('welcome')
  const [hasGsap, setHasGsap] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
      // Switch to idle after welcome
      setTimeout(() => setCharacterState('idle'), 2000)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // GSAP animations
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)
        setHasGsap(true)

        const ctx = gsap.context(() => {
          // Animate hero text elements
          gsap.fromTo(
            '.hero-animate',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              delay: 0.3,
            }
          )

          // Parallax on scroll
          gsap.to('.hero-character', {
            y: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })

          // Fade out hero on scroll
          gsap.to('.hero-content', {
            opacity: 0,
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: '60% top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }, sectionRef)

        return () => ctx.revert()
      } catch {
        // GSAP not loaded yet, animations fall back to CSS
      }
    }

    initGsap()
  }, [])

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
    }
  }

  const scrollToServices = () => {
    const el = document.getElementById('services')
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
    }
  }

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(31,138,84,0.4) 1px, transparent 1px), linear-gradient(to right, rgba(31,138,84,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial gradient */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full opacity-[0.07] dark:opacity-[0.12]"
          style={{
            background: 'radial-gradient(ellipse at center, #1F8A54 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Orb right */}
        <div
          className="absolute top-1/4 -right-20 w-80 h-80 rounded-full opacity-[0.08] dark:opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #1F8A54 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container-ws w-full pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Text Content */}
          <div className="hero-content flex flex-col justify-center order-2 lg:order-1">
            {/* Badge */}
            <div className={`hero-animate transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="section-label">
                <Sparkles size={12} />
                حلول رقمية عصرية
              </span>
            </div>

            {/* Main Title */}
            <h1
              id="hero-title"
              className={`hero-animate text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] text-[var(--text-primary)] mb-5 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              نُحوّل{' '}
              <span className="text-gradient-green relative">
                فكرتك
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 3 Q50 0 100 3 Q150 6 200 3"
                    stroke="#1F8A54"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              إلى منتج رقمي
            </h1>

            {/* Subtitle */}
            <p className={`hero-animate section-subtitle mb-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              نبني مواقع وتطبيقات وأنظمة رقمية مصممة لتكبر مع أعمالك. من الفكرة إلى الإطلاق — نحن معك في كل خطوة.
            </p>

            {/* CTA Buttons */}
            <div className={`hero-animate flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button
                id="hero-cta-primary"
                onClick={() => {
                  setCharacterState('success')
                  setTimeout(() => setCharacterState('idle'), 2000)
                  scrollToContact()
                }}
                className="btn-primary group"
                onMouseEnter={() => setCharacterState('point')}
                onMouseLeave={() => setCharacterState('idle')}
              >
                ابدأ مشروعك
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-cta-secondary"
                onClick={scrollToServices}
                className="btn-secondary"
                onMouseEnter={() => setCharacterState('look')}
                onMouseLeave={() => setCharacterState('idle')}
              >
                استكشف خدماتنا
              </button>
            </div>

            {/* Stats */}
            <div className={`hero-animate grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-[400ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center sm:text-right">
                  <div className="text-2xl font-black text-[#1F8A54] counter-number">{stat.value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Character Area */}
          <div className="hero-character relative flex items-center justify-center order-1 lg:order-2">
            {/* Decorative ring */}
            <div
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-[rgba(31,138,84,0.12)] animate-[spinSlow_20s_linear_infinite]"
              aria-hidden="true"
            />
            <div
              className="absolute w-52 h-52 md:w-72 md:h-72 rounded-full border border-[rgba(31,138,84,0.08)] animate-[spinSlow_15s_linear_infinite_reverse]"
              aria-hidden="true"
            />

            {/* Floating badges */}
            <div
              className="absolute top-4 -right-2 md:right-4 glass-card px-3 py-2 rounded-xl text-xs font-700 text-[var(--text-primary)] animate-[float_5s_ease-in-out_infinite]"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
                UI/UX Design
              </div>
            </div>

            <div
              className="absolute bottom-8 -left-2 md:left-4 glass-card px-3 py-2 rounded-xl text-xs font-700 text-[var(--text-primary)] animate-[float_6s_ease-in-out_infinite_reverse]"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1.5">
                <Star size={10} className="text-[#1F8A54] fill-[#1F8A54]" />
                100% رضا العملاء
              </div>
            </div>

            <div
              className="absolute top-1/3 -left-4 md:-left-6 glass-card px-3 py-2 rounded-xl text-xs font-700 text-[var(--text-primary)] animate-[float_7s_ease-in-out_infinite]"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[#1F8A54]">⚡</span>
                أداء فائق
              </div>
            </div>

            {/* Character */}
            <WebStepCharacter
              state={characterState}
              size="lg"
              enableMouseTracking={true}
              className="relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollDown}
        aria-label="انتقل للأسفل"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[var(--text-muted)] hover:text-[#1F8A54] transition-colors animate-[bounceSubtle_2s_ease-in-out_infinite]"
      >
        <span className="text-xs font-500">اكتشف المزيد</span>
        <ChevronDown size={18} />
      </button>
    </section>
  )
}
