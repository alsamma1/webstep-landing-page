const fs = require('fs');
const path = require('path');

// ── Hero Experience — HeroExperience.tsx ─────────────────────────────
const heroPath = path.join(__dirname, '../src/components/sections/HeroExperience.tsx');

const heroCode = `'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ArrowLeft, Globe, Smartphone, Palette, ChevronDown,
  Zap, Shield, TrendingUp, Award, Volume2, VolumeX, UserCheck, User,
} from 'lucide-react'
import WebStepPhotoCharacterRig from '@/components/character/WebStepPhotoCharacterRig'
import { useCharacter } from '@/components/character/CharacterController'

const WORDS = ['مواقع', 'تطبيقات', 'أنظمة', 'منتجات']

// Hero welcome messages for auto-speak
const HERO_SPEECH = {
  boy: 'أهلاً وسهلاً! أنا بشير، مطوّر أنظمة WebStep. نحن هنا لنحوّل فكرتك الرقمية إلى منتج احترافي فائق السرعة. من تصميم الواجهات، إلى تطوير المواقع والتطبيقات، وصولاً للإطلاق الكامل — فريقنا في خدمتك على مدار الساعة.',
  girl: 'مرحباً بك! أنا شيرين، مصممة تجربة المستخدم في WebStep. نصمّم لك واجهات جذّابة تُذهل عملاءك وتزيد من معدلات التحويل والمبيعات. كل تفصيل مدروس بعناية ليجعل علامتك التجارية لا تُنسى.',
}

// Cinematic scroll scenes
const SCENES = [
  {
    id: 'intro',
    eyebrow: 'تقنية. إبداع. نتائج.',
    heading: 'نبني مستقبلك الرقمي',
    sub: 'من الفكرة إلى المنتج الحي — WebStep معك في كل خطوة.',
    characterState: 'welcome' as const,
    bg: 'from-[#0a0a0a] to-[#0f1a12]',
    accent: '#1F8A54',
  },
  {
    id: 'services-teaser',
    eyebrow: 'خدمات متكاملة',
    heading: 'كل ما تحتاجه في مكان واحد',
    sub: 'تطوير ويب، تطبيقات، تصميم، متاجر، أنظمة — فريق واحد لكل شيء.',
    characterState: 'point' as const,
    bg: 'from-[#0a0a0a] to-[#0d1520]',
    accent: '#3b82f6',
  },
  {
    id: 'quality',
    eyebrow: 'جودة لا تُساوَم',
    heading: 'كود نظيف. تصميم مذهل. أداء فائق.',
    sub: 'كل مشروع نبنيه بأحدث المعايير — سرعة، أمان، وتجربة مستخدم لا تُنسى.',
    characterState: 'thinking' as const,
    bg: 'from-[#0a0a0a] to-[#1a0d0d]',
    accent: '#f59e0b',
  },
]

export default function HeroExperience() {
  const { setState, speakPhrase, stopSpeaking, isSpeaking, characterType, toggleCharacterType, voiceEnabled, setVoiceEnabled } = useCharacter()
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [hasGreeted, setHasGreeted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const scenesRef = useRef<HTMLDivElement>(null)

  const currentName = characterType === 'boy' ? 'بشير' : 'شيرين'
  const currentGender = characterType

  // Auto-greet once after entrance animation
  const triggerGreeting = useCallback(() => {
    if (hasGreeted) return
    setHasGreeted(true)
    setState('wave', 2500)
    setTimeout(() => {
      speakPhrase(HERO_SPEECH[currentGender as 'boy' | 'girl'])
    }, 800)
  }, [hasGreeted, setState, speakPhrase, currentGender])

  // Entrance sequence
  useEffect(() => {
    setState('welcome', 2500)
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 700)
    const t3 = setTimeout(() => setPhase(3), 1200)
    const t4 = setTimeout(() => setPhase(4), 1700)
    // Auto-greet after entrance
    const t5 = setTimeout(() => triggerGreeting(), 2400)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-greet when character switches
  useEffect(() => {
    if (phase >= 4) {
      setState('wave', 2000)
      setTimeout(() => speakPhrase(HERO_SPEECH[currentGender as 'boy' | 'girl']), 600)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterType])

  // Word cycling
  useEffect(() => {
    if (phase < 3) return
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2000)
    return () => clearInterval(t)
  }, [phase])

  // Scroll-driven scene switching
  useEffect(() => {
    const el = scenesRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = -rect.top / (rect.height - window.innerHeight)
      const clamped = Math.max(0, Math.min(progress, 1))
      setScrollY(clamped)
      const idx = Math.min(Math.floor(clamped * SCENES.length), SCENES.length - 1)
      if (idx !== activeScene) {
        setActiveScene(idx)
        setState(SCENES[idx].characterState)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene, setState])

  const scene = SCENES[activeScene]
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div ref={heroRef} id="home">
      {/* ══ PART 1 — Hero Above The Fold ══ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
        aria-labelledby="hero-heading"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: \`linear-gradient(rgba(31,138,84,0.07) 1px, transparent 1px),
              linear-gradient(to right, rgba(31,138,84,0.07) 1px, transparent 1px)\`,
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Green radial glow */}
        <div
          className="absolute top-1/4 right-1/3 w-[50vw] h-[50vw] max-w-[700px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(31,138,84,0.12) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">

            {/* ── Text Side ── */}
            <div className="order-2 lg:order-1" dir="rtl">
              <div
                className={\`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border border-[#1F8A54]/30 bg-[#1F8A54]/08 transition-all duration-700 \${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}\`}
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
                  <div key={s.l} className="text-center py-3 px-2 rounded-xl border border-white/08 bg-white/04">
                    <div className="text-2xl font-black text-[#1F8A54]">{s.v}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div
                className={\`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-400 \${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}\`}
              >
                <button
                  id="hero-cta-start"
                  className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#1F8A54] hover:bg-[#26a667] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(31,138,84,0.4)]"
                  onClick={() => { setState('point', 1500); scrollTo('contact') }}
                  onMouseEnter={() => setState('point')}
                  onMouseLeave={() => setState('idle')}
                >
                  ابدأ مشروعك
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-cta-explore"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => { setState('look', 1200); scrollTo('services') }}
                  onMouseEnter={() => setState('look')}
                  onMouseLeave={() => setState('idle')}
                >
                  <Globe size={15} />
                  استكشف خدماتنا
                </button>
              </div>
            </div>

            {/* ── Character Side ── */}
            <div className="order-1 lg:order-2 flex flex-col items-center justify-center relative gap-4">

              {/* Ambient glow behind character */}
              <div
                className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none"
                style={{
                  background: characterType === 'boy'
                    ? 'radial-gradient(circle, rgba(31,138,84,0.18) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
                  filter: 'blur(35px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  transition: 'background 0.8s ease',
                }}
                aria-hidden="true"
              />

              {/* Orbit ring */}
              <div
                className="absolute w-80 h-80 md:w-[420px] md:h-[420px] rounded-full pointer-events-none"
                style={{
                  border: \`1px solid \${characterType === 'boy' ? 'rgba(31,138,84,0.12)' : 'rgba(124,58,237,0.12)'}\`,
                  animation: 'spinSlow 30s linear infinite',
                  transition: 'border-color 0.8s ease',
                }}
                aria-hidden="true"
              />

              {/* Tech badges */}
              {[
                { Icon: Globe, label: 'Web', pos: 'top-8 left-4 md:left-0', delay: '0s' },
                { Icon: Smartphone, label: 'Mobile', pos: 'bottom-32 left-0 md:-left-4', delay: '0.5s' },
                { Icon: Palette, label: 'UI/UX', pos: 'top-1/3 -right-2 md:right-4', delay: '1s' },
              ].map(b => (
                <div
                  key={b.label}
                  className={\`absolute \${b.pos} z-20 flex items-center gap-1.5 bg-white/06 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/70\`}
                  style={{ animation: 'float 5s ease-in-out infinite', animationDelay: b.delay }}
                  aria-hidden="true"
                >
                  <b.Icon size={13} className="text-[#1F8A54]" />
                  {b.label}
                </div>
              ))}

              {/* Character */}
              <div
                className={\`relative z-10 transition-all duration-1000 \${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}\`}
              >
                <WebStepPhotoCharacterRig
                  size="xl"
                  sectionId="home"
                  showBadge={false}
                  showVoiceButton={false}
                  interactive={true}
                  onClick={() => {
                    setState('wave', 2000)
                    speakPhrase(HERO_SPEECH[currentGender as 'boy' | 'girl'])
                  }}
                />
              </div>

              {/* Character Controls Panel */}
              <div
                className={\`relative z-20 flex flex-col items-center gap-3 transition-all duration-700 \${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}\`}
              >
                {/* Name tag */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-sm font-bold"
                  style={{
                    background: characterType === 'boy' ? 'rgba(31,138,84,0.15)' : 'rgba(124,58,237,0.15)',
                    borderColor: characterType === 'boy' ? 'rgba(31,138,84,0.5)' : 'rgba(124,58,237,0.5)',
                    color: characterType === 'boy' ? '#34d399' : '#a78bfa',
                  }}
                >
                  {characterType === 'boy' ? <User size={14} /> : <UserCheck size={14} />}
                  <span>{currentName}</span>
                  <span className="text-white/40 text-xs font-normal">
                    {characterType === 'boy' ? '— مطوّر أنظمة' : '— مصممة UI/UX'}
                  </span>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-2">
                  {/* Speak / Stop */}
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking()
                      } else {
                        setState('wave', 2000)
                        speakPhrase(HERO_SPEECH[currentGender as 'boy' | 'girl'])
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all"
                    style={{
                      background: isSpeaking
                        ? '#b45309'
                        : (characterType === 'boy' ? '#1F8A54' : '#7c3aed'),
                      boxShadow: isSpeaking
                        ? '0 2px 12px rgba(180,83,9,0.4)'
                        : (characterType === 'boy' ? '0 2px 16px rgba(31,138,84,0.45)' : '0 2px 16px rgba(124,58,237,0.45)'),
                      animation: isSpeaking ? 'pulse 1.2s ease-in-out infinite' : 'none',
                    }}
                    aria-label={isSpeaking ? 'إيقاف الصوت' : 'تشغيل الترحيب الصوتي'}
                  >
                    {isSpeaking
                      ? <VolumeX size={15} />
                      : <Volume2 size={15} />
                    }
                    <span>{isSpeaking ? 'إيقاف الصوت' : \`استمع لـ \${currentName}\`}</span>

                    {/* Speaking waveform */}
                    {isSpeaking && (
                      <span className="flex items-end gap-0.5 mr-1">
                        {[10, 16, 8, 14, 10].map((h, i) => (
                          <span
                            key={i}
                            className="w-0.5 rounded-full bg-white"
                            style={{ height: h + 'px', animation: 'bounce 0.5s ease-in-out infinite', animationDelay: i * 0.08 + 's' }}
                          />
                        ))}
                      </span>
                    )}
                  </button>

                  {/* Switch character — ONLY button to switch */}
                  <button
                    onClick={() => {
                      stopSpeaking()
                      toggleCharacterType()
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white/75 hover:text-white transition-all"
                    aria-label="تبديل الشخصية"
                  >
                    {characterType === 'boy'
                      ? <><UserCheck size={14} className="text-purple-400" /><span>شيرين</span></>
                      : <><User size={14} className="text-emerald-400" /><span>بشير</span></>
                    }
                  </button>

                  {/* Voice mute toggle */}
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/50 hover:text-white transition-all"
                    title={voiceEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
                  >
                    {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                </div>
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

      {/* ══ PART 2 — Cinematic Scroll (Apple-style) ══ */}
      <div
        id="cinematic-journey"
        ref={scenesRef}
        className="relative"
        style={{ height: \`\${SCENES.length * 100}vh\` }}
        aria-label="تجربة سينمائية"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {SCENES.map((sc, i) => {
            const isActive = i === activeScene
            const progress = isActive ? Math.max(0, (scrollY * SCENES.length) - i) : i < activeScene ? 1 : 0

            return (
              <div
                key={sc.id}
                className={\`absolute inset-0 flex items-center justify-center transition-opacity duration-500 bg-[#0a0a0a] \${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
                aria-hidden={!isActive}
              >
                <div className={\`absolute inset-0 bg-gradient-to-br \${sc.bg} opacity-80\`} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div dir="rtl">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-5"
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
                        className="text-white/50 text-lg leading-relaxed max-w-lg mb-8"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'all 0.6s ease 0.35s',
                        }}
                      >
                        {sc.sub}
                      </p>

                      <div
                        className="flex flex-wrap gap-2"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                          transition: 'all 0.6s ease 0.45s',
                        }}
                      >
                        {i === 0 && [
                          { Icon: Zap, text: 'سريع الإطلاق' },
                          { Icon: Shield, text: 'آمن 100%' },
                          { Icon: TrendingUp, text: 'قابل للنمو' },
                        ].map(f => (
                          <div key={f.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/06 border border-white/08 text-white/60 text-xs font-medium">
                            <f.Icon size={12} style={{ color: sc.accent }} />
                            {f.text}
                          </div>
                        ))}
                        {i === 1 && [
                          { Icon: Globe, text: 'مواقع احترافية' },
                          { Icon: Smartphone, text: 'تطبيقات موبايل' },
                          { Icon: Palette, text: 'تصميم UI/UX' },
                        ].map(f => (
                          <div key={f.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/06 border border-white/08 text-white/60 text-xs font-medium">
                            <f.Icon size={12} style={{ color: sc.accent }} />
                            {f.text}
                          </div>
                        ))}
                        {i === 2 && [
                          { Icon: Award, text: 'جودة إنتاجية' },
                          { Icon: Zap, text: 'أداء استثنائي' },
                          { Icon: Shield, text: 'أمان مدمج' },
                        ].map(f => (
                          <div key={f.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/06 border border-white/08 text-white/60 text-xs font-medium">
                            <f.Icon size={12} style={{ color: sc.accent }} />
                            {f.text}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="flex justify-center"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                        transition: 'all 0.7s ease 0.15s',
                      }}
                    >
                      <WebStepPhotoCharacterRig size="xl" showBadge={false} showVoiceButton={false} />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/08">
                  <div
                    className="h-full transition-all duration-100"
                    style={{
                      width: isActive ? \`\${progress * 100}%\` : i < activeScene ? '100%' : '0%',
                      background: sc.accent,
                    }}
                  />
                </div>

                {/* Scene dots */}
                <div className="absolute bottom-6 right-6 flex items-center gap-3">
                  {SCENES.map((_, j) => (
                    <div
                      key={j}
                      className="rounded-full transition-all duration-400"
                      style={{
                        width: j === activeScene ? 24 : 6,
                        height: 6,
                        background: j <= activeScene ? sc.accent : 'rgba(255,255,255,0.2)',
                      }}
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

fs.writeFileSync(heroPath, heroCode, 'utf8');
console.log('HeroExperience written:', fs.statSync(heroPath).size, 'bytes');

// ── Also update InteractiveCompanion names ─────────────────
const companionPath = path.join(__dirname, '../src/components/character/InteractiveCompanion.tsx');
let comp = fs.readFileSync(companionPath, 'utf8');
comp = comp.replace(/ريان/g, 'بشير');
comp = comp.replace(/سارة/g, 'شيرين');
comp = comp.replace(/المهندس\)/g, 'المطوّر)');
comp = comp.replace(/المصممة\)/g, 'المصممة)');
fs.writeFileSync(companionPath, comp, 'utf8');
console.log('InteractiveCompanion updated:', fs.statSync(companionPath).size, 'bytes');

// ── Update ThreeDCharacterCanvas names ─────────────────────
const canvasPath = path.join(__dirname, '../src/components/character/ThreeDCharacterCanvas.tsx');
let canvas = fs.readFileSync(canvasPath, 'utf8');
canvas = canvas.replace(/ريان — المهندس/g, 'بشير — المطوّر');
canvas = canvas.replace(/سارة — المصممة/g, 'شيرين — المصممة');
canvas = canvas.replace(/شخصية ريان/g, 'شخصية بشير');
canvas = canvas.replace(/شخصية سارة/g, 'شخصية شيرين');
canvas = canvas.replace(/ريان\b/g, 'بشير');
canvas = canvas.replace(/سارة\b/g, 'شيرين');
fs.writeFileSync(canvasPath, canvas, 'utf8');
console.log('ThreeDCharacterCanvas updated:', fs.statSync(canvasPath).size, 'bytes');

console.log('\\nAll files updated successfully!');
