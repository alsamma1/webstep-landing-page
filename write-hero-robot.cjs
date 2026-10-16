const fs = require('fs');
const path = require('path');

const heroPath = path.join(__dirname, '../src/components/sections/HeroExperience.tsx');

const code = `'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ArrowLeft, Globe, Smartphone, Palette, ChevronDown, Volume2, VolumeX, Zap, Shield, TrendingUp, Award } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCharacter } from '@/components/character/CharacterController'

// Lazy-load the heavy Three.js robot (no SSR)
const HeroRobotCharacter = dynamic(
  () => import('@/components/character/HeroRobotCharacter'),
  { ssr: false }
)

const WORDS = ['مواقع', 'تطبيقات', 'أنظمة', 'منتجات']

const HERO_SPEECH = {
  boy: 'أهلاً وسهلاً! أنا بشير، مطوّر أنظمة WebStep. نبني لك منتجاً رقمياً فائق الجودة. من تصميم الواجهات إلى تطوير المواقع والتطبيقات. فريقنا في خدمتك على مدار الساعة.',
  girl: 'مرحباً بك! أنا شيرين، مصممة تجربة المستخدم في WebStep. نصمّم لك واجهات جذّابة تُذهل عملاءك. كل تفصيل مدروس بعناية ليجعل علامتك التجارية لا تُنسى.',
}

const SCENES = [
  {
    id: 'intro',
    eyebrow: 'تقنية. إبداع. نتائج.',
    heading: 'نبني مستقبلك الرقمي',
    sub: 'من الفكرة إلى المنتج الحي — WebStep معك في كل خطوة.',
    accent: '#1F8A54',
    features: [
      { Icon: Zap, text: 'سريع الإطلاق' },
      { Icon: Shield, text: 'آمن 100%' },
      { Icon: TrendingUp, text: 'قابل للنمو' },
    ],
  },
  {
    id: 'services',
    eyebrow: 'خدمات متكاملة',
    heading: 'كل ما تحتاجه في مكان واحد',
    sub: 'تطوير ويب، تطبيقات، تصميم، متاجر، أنظمة — فريق واحد لكل شيء.',
    accent: '#3b82f6',
    features: [
      { Icon: Globe, text: 'مواقع احترافية' },
      { Icon: Smartphone, text: 'تطبيقات موبايل' },
      { Icon: Palette, text: 'تصميم UI/UX' },
    ],
  },
  {
    id: 'quality',
    eyebrow: 'جودة لا تُساوَم',
    heading: 'كود نظيف. تصميم مذهل. أداء فائق.',
    sub: 'كل مشروع نبنيه بأحدث المعايير — سرعة، أمان، وتجربة مستخدم لا تُنسى.',
    accent: '#f59e0b',
    features: [
      { Icon: Award, text: 'جودة إنتاجية' },
      { Icon: Zap, text: 'أداء استثنائي' },
      { Icon: Shield, text: 'أمان مدمج' },
    ],
  },
]

export default function HeroExperience() {
  const { speakPhrase, stopSpeaking, isSpeaking, characterType, voiceEnabled, setVoiceEnabled } = useCharacter()
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [hasGreeted, setHasGreeted] = useState(false)
  const scenesRef = useRef<HTMLDivElement>(null)

  const currentGender = characterType as 'boy' | 'girl'

  // Auto-greet
  const greet = useCallback(() => {
    if (hasGreeted) return
    setHasGreeted(true)
    setTimeout(() => speakPhrase(HERO_SPEECH[currentGender]), 600)
  }, [hasGreeted, speakPhrase, currentGender])

  // Entrance sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 700)
    const t3 = setTimeout(() => setPhase(3), 1200)
    const t4 = setTimeout(() => setPhase(4), 1700)
    const t5 = setTimeout(() => greet(), 2800)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Word cycling
  useEffect(() => {
    if (phase < 3) return
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2000)
    return () => clearInterval(t)
  }, [phase])

  // Scroll scenes
  useEffect(() => {
    const el = scenesRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = -rect.top / (rect.height - window.innerHeight)
      const clamped = Math.max(0, Math.min(progress, 1))
      setScrollY(clamped)
      const idx = Math.min(Math.floor(clamped * SCENES.length), SCENES.length - 1)
      setActiveScene(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scene = SCENES[activeScene]
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div id="home">
      {/* ══ PART 1 — Hero Above The Fold ══ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-[#050a08]"
        aria-labelledby="hero-heading"
      >
        {/* Dark grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: \`linear-gradient(rgba(31,138,84,0.06) 1px, transparent 1px),
              linear-gradient(to right, rgba(31,138,84,0.06) 1px, transparent 1px)\`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Big ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '5%', top: '10%',
            width: '55vw', height: '80vh',
            background: 'radial-gradient(ellipse, rgba(31,138,84,0.10) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-10rem)]">

            {/* ── Text ── */}
            <div className="order-2 lg:order-1" dir="rtl">

              <div
                className={\`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border border-[#1F8A54]/30 transition-all duration-700 \${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}\`}
                style={{ background: 'rgba(31,138,84,0.08)' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
                <span className="text-sm font-semibold text-[#1F8A54]">WebStep — حلول رقمية متكاملة</span>
              </div>

              <h1
                id="hero-heading"
                className={\`text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight mb-6 transition-all duration-700 delay-100 \${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}\`}
              >
                <span className="text-white">نبني</span>
                <br />
                <span
                  key={wordIdx}
                  className="text-[#1F8A54]"
                  style={{ animation: phase >= 3 ? 'wordFlip 0.45s ease-out' : 'none' }}
                >
                  {WORDS[wordIdx]}
                </span>
                <br />
                <span className="text-white/60 text-3xl sm:text-4xl xl:text-5xl font-bold">تبني مستقبلك</span>
              </h1>

              <p
                className={\`text-white/55 text-lg leading-relaxed max-w-lg mb-8 transition-all duration-700 delay-200 \${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}\`}
              >
                نحوّل فكرتك إلى منتج رقمي احترافي. من التصميم إلى الإطلاق — فريق متكامل في خدمتك.
              </p>

              {/* Stats */}
              <div
                className={\`grid grid-cols-3 gap-3 mb-8 transition-all duration-700 delay-300 \${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}\`}
              >
                {[{ v: '+50', l: 'مشروع' }, { v: '+30', l: 'عميل' }, { v: '24h', l: 'دعم' }].map(s => (
                  <div key={s.l} className="text-center py-3 px-2 rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <div className="text-2xl font-black text-[#1F8A54]">{s.v}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div
                className={\`flex flex-col sm:flex-row gap-3 mb-6 transition-all duration-700 delay-400 \${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}\`}
              >
                <button
                  id="hero-cta-start"
                  className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#1F8A54] hover:bg-[#26a667] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(31,138,84,0.4)]"
                  onClick={() => scrollTo('contact')}
                >
                  ابدأ مشروعك
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-cta-explore"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/70 border border-white/[0.12] hover:border-white/25 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => scrollTo('services')}
                >
                  <Globe size={15} />
                  استكشف خدماتنا
                </button>
              </div>

              {/* Voice controls */}
              <div
                className={\`flex items-center gap-2 transition-all duration-700 delay-500 \${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}\`}
              >
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speakPhrase(HERO_SPEECH[currentGender])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white border border-[#1F8A54]/40 transition-all"
                  style={{
                    background: isSpeaking ? 'rgba(31,138,84,0.25)' : 'rgba(31,138,84,0.12)',
                    boxShadow: isSpeaking ? '0 0 16px rgba(31,138,84,0.35)' : 'none',
                    animation: isSpeaking ? 'pulse 1.5s ease infinite' : 'none',
                  }}
                >
                  <Volume2 size={13} />
                  <span>{isSpeaking ? 'إيقاف الصوت' : 'استمع للمساعد'}</span>
                  {isSpeaking && (
                    <span className="flex items-end gap-0.5 mr-1">
                      {[8, 12, 6, 10].map((h, i) => (
                        <span key={i} className="w-0.5 rounded-full bg-emerald-400"
                          style={{ height: h, animation: 'voiceBar 0.4s ease infinite alternate', animationDelay: i * 0.09 + 's' }} />
                      ))}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/50 hover:text-white transition-all"
                  title={voiceEnabled ? 'كتم' : 'تفعيل'}
                >
                  {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
              </div>
            </div>

            {/* ── Robot Character ── */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div
                className={\`w-full transition-all duration-1000 \${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}\`}
                style={{ maxWidth: 480, height: 520 }}
              >
                <HeroRobotCharacter
                  onSpeakRequest={() => {
                    if (isSpeaking) stopSpeaking()
                    else speakPhrase(HERO_SPEECH[currentGender])
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors"
          onClick={() => scrollTo('cinematic-journey')}
          aria-label="اكتشف المزيد"
        >
          <span className="text-xs font-medium">اكتشف</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </section>

      {/* ══ PART 2 — Cinematic Scroll ══ */}
      <div
        id="cinematic-journey"
        ref={scenesRef}
        className="relative"
        style={{ height: \`\${SCENES.length * 100}vh\` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {SCENES.map((sc, i) => {
            const isActive = i === activeScene
            const scProgress = Math.max(0, scrollY * SCENES.length - i)

            return (
              <div
                key={sc.id}
                className={\`absolute inset-0 flex items-center justify-center transition-opacity duration-500 bg-[#050a08] \${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: \`linear-gradient(rgba(31,138,84,0.05) 1px, transparent 1px),
                      linear-gradient(to right, rgba(31,138,84,0.05) 1px, transparent 1px)\`,
                    backgroundSize: '60px 60px',
                  }}
                />

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
                  <div className="max-w-2xl mx-auto text-center" dir="rtl">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-6"
                      style={{
                        borderColor: \`\${sc.accent}40\`,
                        color: sc.accent,
                        background: \`\${sc.accent}10\`,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.6s ease 0.1s',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sc.accent }} />
                      {sc.eyebrow}
                    </div>

                    <h2
                      className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'all 0.6s ease 0.2s',
                      }}
                    >
                      {sc.heading}
                    </h2>

                    <p
                      className="text-white/50 text-lg mb-8 max-w-lg mx-auto"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.6s ease 0.3s',
                      }}
                    >
                      {sc.sub}
                    </p>

                    <div
                      className="flex flex-wrap justify-center gap-2"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'all 0.6s ease 0.4s',
                      }}
                    >
                      {sc.features.map(f => (
                        <div key={f.text} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/60 text-sm font-medium">
                          <f.Icon size={13} style={{ color: sc.accent }} />
                          {f.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.06]">
                  <div
                    className="h-full transition-all duration-100"
                    style={{ width: isActive ? \`\${scProgress * 100}%\` : i < activeScene ? '100%' : '0%', background: sc.accent }}
                  />
                </div>

                {/* Scene dots */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                  {SCENES.map((_, j) => (
                    <div
                      key={j}
                      className="rounded-full transition-all duration-300"
                      style={{ width: j === activeScene ? 20 : 6, height: 6, background: j <= activeScene ? sc.accent : 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(heroPath, code, 'utf8');
console.log('HeroExperience.tsx written:', fs.statSync(heroPath).size, 'bytes');
