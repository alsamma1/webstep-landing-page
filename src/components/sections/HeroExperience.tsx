'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Sun, Moon, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/components/providers/ThemeProvider'
import { STATS } from '@/data'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useRegion } from '@/components/providers/RegionProvider'

import type { HeroSectionData } from '@/lib/homepage-types'

// ─── Animation Stages ─────────────────────────────────────────────────────────
// Stage 0  : شعار (2s)
// Stage 1  : صورة 1 + "مرحباً بك" (2s)
// Stage 2  : صورة 2 + "من خدماتنا" (2s)
// Stage 3  : صورة 3 + "هل أنت مستعد؟" (ثابتة)

type Stage = 0 | 1 | 2 | 3

const WORDS = ['مواقع', 'تطبيقات', 'أنظمة', 'منتجات']

export default function HeroExperience({ data, yemenData }: { data?: HeroSectionData; yemenData?: any }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const settings = useSiteSettings()
  const { region, isYemen, geoSettings } = useRegion()
  const isDark = resolvedTheme === 'dark'
  const heroData = data
  const yemenHero = yemenData

  // Images: geoSettings > yemenHero (if Yemen) > heroData > default
  const resolvedLogo = (region === 'ye' ? geoSettings.images.heroLogo?.ye : geoSettings.images.heroLogo?.sa)
    || (isYemen && yemenHero?.logoImage) || (heroData as any)?.stage0Logo || heroData?.logoImage || '/assets/logo/logo.png'
  const resolvedStage1 = (region === 'ye' ? geoSettings.images.heroStage1?.ye : geoSettings.images.heroStage1?.sa)
    || (isYemen && yemenHero?.stage1Image) || heroData?.stage1Image || '/assets/1.png'
  const resolvedStage2 = (region === 'ye' ? geoSettings.images.heroStage2?.ye : geoSettings.images.heroStage2?.sa)
    || (isYemen && yemenHero?.stage2Image) || heroData?.stage2Image || '/assets/2.png'
  const resolvedStage3 = (region === 'ye' ? geoSettings.images.heroStage3?.ye : geoSettings.images.heroStage3?.sa)
    || (isYemen && yemenHero?.stage3Image) || heroData?.stage3Image || '/assets/3.png'

  // Texts: yemenHero override (when Yemen) > heroData > settings > defaults
  const resolvedBadge = (region === 'ye' ? geoSettings.images.heroBadge?.ye : geoSettings.images.heroBadge?.sa)
    || (isYemen && yemenHero?.badge) || heroData?.badge || settings.homeContent?.heroBadge || 'حلول رقمية عصرية وذكية'
  const resolvedTitlePrefix = (isYemen && yemenHero?.titlePrefix) || heroData?.titlePrefix || ''
  const resolvedTitleSuffix = (isYemen && yemenHero?.titleSuffix) || heroData?.titleSuffix || ''
  const resolvedSubtitle = (isYemen && yemenHero?.subtitle) || heroData?.subtitle || ''
  const resolvedPrimaryBtnText = (isYemen && yemenHero?.primaryBtnText) || heroData?.primaryBtnText || 'ابدأ مشروعك'
  const resolvedPrimaryBtnLink = (isYemen && yemenHero?.primaryBtnLink) || heroData?.primaryBtnLink || '/order'
  const resolvedSecondaryBtnText = (isYemen && yemenHero?.secondaryBtnText) || heroData?.secondaryBtnText || 'تعرف علينا'
  const resolvedSecondaryBtnLink = (isYemen && yemenHero?.secondaryBtnLink) || heroData?.secondaryBtnLink || '/about'
  const words = (isYemen && yemenHero?.rotatingWords?.length ? yemenHero.rotatingWords : null)
    || (heroData?.rotatingWords?.length ? heroData.rotatingWords : null)
    || (settings.homeContent?.heroWords?.length ? settings.homeContent.heroWords : null)
    || WORDS

  const [stage, setStage] = useState<Stage>(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Image animation sequence
  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setStage(1), 2000)
    const t2 = setTimeout(() => setStage(2), 4000)
    const t3 = setTimeout(() => setStage(3), 6000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Text entrance
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 700)
    const t3 = setTimeout(() => setPhase(3), 1200)
    const t4 = setTimeout(() => setPhase(4), 1700)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  // Word cycling
  useEffect(() => {
    if (phase < 3) return
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2000)
    return () => clearInterval(t)
  }, [phase, words.length])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (!mounted) return null

  return (
    <div id="home">
      {/* ══ PART 1 — Hero Above The Fold ══ */}
      <section
        className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-500 ${
          isDark
            ? 'bg-[#050a08]'
            : 'bg-gradient-to-br from-white via-[#f0faf4] to-[#e6f5ec]'
        }`}
        aria-labelledby="hero-heading"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(31,138,84,${isDark ? '0.06' : '0.07'}) 1px, transparent 1px),
              linear-gradient(to right, rgba(31,138,84,${isDark ? '0.06' : '0.07'}) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '5%', top: '10%',
            width: '55vw', height: '80vh',
            background: `radial-gradient(ellipse, rgba(31,138,84,${isDark ? '0.12' : '0.08'}) 0%, transparent 65%)`,
            filter: 'blur(50px)',
          }}
          aria-hidden="true"
        />

       

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-8rem)]"
            dir="rtl"
          >

            {/* ══ العمود الأيسر: المحتوى النصي الثابت ══ */}
            <div className="flex flex-col justify-center order-2 lg:order-1">

              {/* Badge */}
              <div
                className={`transition-all duration-700 mb-5 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${
                    isDark
                      ? 'bg-[rgba(31,138,84,0.08)] border-[#1F8A54]/30 text-[#1F8A54]'
                      : 'bg-[rgba(31,138,84,0.06)] border-[#1F8A54]/25 text-[#1F8A54]'
                  }`}
                >
                  <Sparkles size={13} />
                  {resolvedBadge}
                </span>
              </div>

              {/* Main Heading */}
              <h1
                id="hero-heading"
                className={`text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight mb-6 transition-all duration-700 delay-100 ${
                  phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {resolvedTitlePrefix || 'نبني'}{' '}
                <span
                  key={wordIdx}
                  className="text-[#1F8A54]"
                  style={{ animation: phase >= 3 ? 'wordFlip 0.45s ease-out' : 'none' }}
                >
                  {words[wordIdx % words.length]}
                </span>
                <br />
                <span className={`text-3xl sm:text-4xl xl:text-5xl font-bold ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  {resolvedTitleSuffix || 'تبني مستقبلك'}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className={`text-lg leading-relaxed max-w-xl mb-8 transition-all duration-700 delay-200 ${
                  phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${isDark ? 'text-white/55' : 'text-gray-500'}`}
              >
                {resolvedSubtitle || settings.homeContent?.heroSubtitle || 'نحوّل فكرتك إلى منتج رقمي احترافي. من التصميم إلى الإطلاق — فريق متكامل في خدمتك.'}
              </p>

              {/* Features */}
              <div
                className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-300 ${
                  phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {[
                  { Icon: Zap, text: 'سريع الإطلاق' },
                  { Icon: Shield, text: 'آمن 100%' },
                  { Icon: TrendingUp, text: 'قابل للنمو' },
                ].map(({ Icon, text }) => (
                  <div
                    key={text}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border ${
                      isDark
                        ? 'border-white/[0.08] bg-white/[0.04] text-white/60'
                        : 'border-[rgba(31,138,84,0.15)] bg-[rgba(31,138,84,0.05)] text-gray-600'
                    }`}
                  >
                    <Icon size={13} className="text-[#1F8A54]" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-[400ms] ${
                  phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className={`text-center py-3 px-2 rounded-xl border ${
                      isDark
                        ? 'border-white/[0.08] bg-white/[0.04]'
                        : 'border-[rgba(31,138,84,0.12)] bg-[rgba(31,138,84,0.04)]'
                    }`}
                  >
                    <div className="text-2xl font-black text-[#1F8A54]">{stat.value}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ العمود الأيمن: الشخصية المتحركة ══ */}
            <div className="relative flex items-center justify-center order-1 lg:order-2">

              {/* حاوية بارتفاع ثابت — كل المراحل متمركزة فيها */}
              <div className="relative w-56 sm:w-72 lg:w-80 xl:w-[22rem]" style={{ height: '480px', overflow: 'visible' }}>

                {/* ─ المرحلة 0: الشعار — متمركز ─ */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    opacity: stage === 0 ? 1 : 0,
                    transform: stage === 0 ? 'scale(1)' : 'scale(0.85)',
                    pointerEvents: stage === 0 ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={resolvedLogo}
                    alt="WebStep Logo"
                    width={240}
                    height={240}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>

                {/* ─ المرحلة 1: الصورة 1 — متمركزة ─ */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    opacity: stage === 1 ? 1 : 0,
                    transform: stage === 1 ? 'scale(1)' : 'scale(0.92)',
                    pointerEvents: stage === 1 ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={resolvedStage1}
                    alt="شخصية 1"
                    width={420}
                    height={480}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    quality={80}
                  />
                </div>

                {/* ─ المرحلة 2: الصورة 2 — ضعف الحجم ─ */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    opacity: stage === 2 ? 1 : 0,
                    transform: stage === 2 ? 'scale(2)' : 'scale(0.92)',
                    pointerEvents: stage === 2 ? 'auto' : 'none',
                    zIndex: stage === 2 ? 20 : 0,
                  }}
                >
                  <Image
                    src={resolvedStage2}
                    alt="شخصية 2"
                    width={420}
                    height={480}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    quality={80}
                  />
                </div>

                {/* ─ المرحلة 3: الصورة 3 — ثابتة ومتمركزة ─ */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    opacity: stage === 3 ? 1 : 0,
                    transform: stage === 3 ? 'scale(1)' : 'scale(0.92)',
                    pointerEvents: stage === 3 ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={resolvedStage3}
                    alt="شخصية 3"
                    width={420}
                    height={480}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    quality={80}
                  />
                </div>

                {/* فقاعة الكلام — متمركزة على اليسار */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-10 lg:-left-14 w-32 sm:w-40">
                  <SpeechBubble
                    visible={stage === 1}
                    text={heroData?.stage1BubbleText || 'مرحباً بك 👋'}
                    subtext={heroData?.stage1BubbleSubtext || 'أهلاً بك معنا'}
                  />
                  <SpeechBubble
                    visible={stage === 2}
                    text={heroData?.stage2BubbleText || '✨ خدماتنا'}
                    subtext={heroData?.stage2BubbleSubtext || 'مواقع · تطبيقات · UI/UX'}
                    pop
                  />
                  <SpeechBubble
                    visible={stage === 3}
                    text={heroData?.stage3BubbleText || 'مستعد؟ 🚀'}
                    subtext={heroData?.stage3BubbleSubtext || 'مرر لعالمنا'}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-colors ${
            isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-[#1F8A54]'
          }`}
          onClick={() => scrollTo('cinematic-journey')}
          aria-label="اكتشف المزيد"
        >
          <span className="text-xs font-medium">اكتشف</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </section>

      {/* ══ PART 2 — Cinematic Scroll ══ */}
      <CinematicScroll isDark={isDark} />
    </div>
  )
}

// ─── Speech Bubble ────────────────────────────────────────────────────────────
function SpeechBubble({
  visible,
  text,
  subtext,
  pop = false,
}: {
  visible: boolean
  text: string
  subtext?: string
  pop?: boolean
}) {
  return (
    <div
      className="absolute inset-0 w-full transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : `translateY(${pop ? 14 : 10}px) scale(0.92)`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* ذيل الفقاعة نحو الشخصية (يمين) */}
      <div
        className="absolute -right-2.5 top-4 w-0 h-0"
        style={{
          borderTop: '7px solid transparent',
          borderBottom: '7px solid transparent',
          borderLeft: '10px solid rgba(31,138,84,0.35)',
        }}
      />

      <div className="rounded-xl px-3 py-2 shadow-lg border border-[rgba(31,138,84,0.35)] bg-[rgba(31,138,84,0.08)] backdrop-blur-sm">
        <div className="text-xs font-bold text-[#1F8A54] leading-snug">
          {text}
        </div>
        {subtext && (
          <div className="text-[10px] leading-tight text-[#1F8A54]/70 mt-0.5">
            {subtext}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cinematic Scroll ─────────────────────────────────────────────────────────
const SCENES = [
  {
    id: 'intro',
    eyebrow: 'تقنية. إبداع. نتائج.',
    heading: 'نبني مستقبلك الرقمي',
    sub: 'من الفكرة إلى المنتج الحي — WebStep معك في كل خطوة.',
    accent: '#1F8A54',
    bgImage: '/assets/4.png',
    textAnim: 'pop',
  },
  {
    id: 'services',
    eyebrow: 'خدمات متكاملة',
    heading: 'كل ما تحتاجه في مكان واحد',
    sub: 'تطوير ويب، تطبيقات، تصميم، متاجر، أنظمة — فريق واحد لكل شيء.',
    accent: '#1F8A54',
    bgImage: null,
    textAnim: 'burst',
  },
  {
    id: 'quality',
    eyebrow: 'جودة لا تُساوَم',
    heading: 'كود نظيف. تصميم مذهل. أداء فائق.',
    sub: 'كل مشروع نبنيه بأحدث المعايير — سرعة، أمان، وتجربة مستخدم لا تُنسى.',
    accent: '#f59e0b',
    bgImage: null,
  },
]

function CinematicScroll({ isDark }: { isDark: boolean }) {
  const [activeScene, setActiveScene] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const scenesRef = useRef<HTMLDivElement>(null)

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

  return (
    <>
    <div
      id="cinematic-journey"
      ref={scenesRef}
      className="relative"
      style={{ height: `${SCENES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {SCENES.map((sc, i) => {
          const isActive = i === activeScene
          const scProgress = Math.max(0, scrollY * SCENES.length - i)
          /* انبثاق: المشهد الأول pop (scale صغير→كبير)، الثاني burst (من بعيد جداً) */
          const isPop    = sc.textAnim === 'pop'
          const isBurst  = sc.textAnim === 'burst'

          return (
            <div
              key={sc.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity:       isActive ? 1 : 0,
                zIndex:        isActive ? 10 : 0,
                /* الانبثاق بالمشهد كله */
                transform:     isActive
                  ? 'scale(1) translateY(0)'
                  : isBurst
                    ? 'scale(0.35) translateY(60px)'
                    : isPop
                      ? 'scale(0.75) translateY(30px)'
                      : 'scale(0.92)',
                transition: isActive
                  ? `opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.8s cubic-bezier(0.34,1.56,0.64,1)`
                  : 'opacity 0.45s ease, transform 0.45s ease',
              }}
            >
              {/* ─ خلفية الـ Scene ─ */}
              {sc.bgImage ? (
                /* المشهد الأول: صورة متمركزة مع كلام فوقها */
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 ${
                      isDark ? 'bg-[#050a08]' : 'bg-gradient-to-br from-white via-[#f0faf4] to-[#e6f5ec]'
                    }`}
                  />
                  <Image
                    src={sc.bgImage}
                    alt={sc.heading}
                    width={1920}
                    height={1080}
                    className="relative z-10 object-contain drop-shadow-2xl"
                    style={{ width: '88vw', height: '88vh', transform: 'translateY(10%)' }}
                    quality={85}
                    priority={i === 0}
                  />
                </div>
              ) : (
                /* خلفية اللون العادية (المشهد الثاني والثالث) */
                <>
                  <div
                    className={`absolute inset-0 ${
                      isDark ? 'bg-[#050a08]' : 'bg-gradient-to-br from-white via-[#f0faf4] to-[#e6f5ec]'
                    }`}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(rgba(31,138,84,0.05) 1px, transparent 1px),
                        linear-gradient(to right, rgba(31,138,84,0.05) 1px, transparent 1px)`,
                      backgroundSize: '60px 60px',
                    }}
                  />
                  {/* توهج خلفي إضافي للمشهد الثاني */}
                  {isBurst && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${sc.accent}12 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                      }}
                    />
                  )}
                </>
              )}

              {/* ─ النص المنبثق — كل المشاهد ─ */}
              <div
                className="relative z-20 w-full max-w-5xl mx-auto px-4"
                style={sc.bgImage ? { transform: 'translateY(-30%)' } : {}}
              >
                <div className="max-w-2xl mx-auto text-center" dir="rtl">

                  {/* Eyebrow badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-10"
                    style={{
                      borderColor: `${sc.accent}40`,
                      color: sc.accent,
                      background: `${sc.accent}10`,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
                      transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.05s',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sc.accent }} />
                    {sc.eyebrow}
                  </div>

                  {/* Heading */}
                  <h2
                    className="font-black mb-8 text-[#1F8A54]"
                    style={{
                      fontSize: isBurst ? 'clamp(2.2rem, 6vw, 5rem)' : 'clamp(2rem, 5vw, 4rem)',
                      lineHeight: 1.25,
                      letterSpacing: isBurst ? '-0.02em' : 'normal',
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? 'translateY(0) scale(1)'
                        : isBurst
                          ? 'translateY(40px) scale(0.7)'
                          : 'translateY(28px) scale(0.88)',
                      transition: `all 0.75s cubic-bezier(0.34,1.56,0.64,1) ${isBurst ? '0.1s' : '0.2s'}`,
                      /* ظل نصي للمشهد الثاني */
                      textShadow: isBurst && isActive
                        ? `0 0 60px ${sc.accent}40, 0 4px 20px ${sc.accent}20`
                        : 'none',
                    }}
                  >
                    {sc.heading}
                  </h2>

                  {/* Sub */}
                  <p
                    className={`leading-loose mb-8 max-w-lg mx-auto ${
                      isDark ? 'text-white/55' : 'text-gray-600'
                    }`}
                    style={{
                      fontSize: isBurst ? '1.2rem' : '1.1rem',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.65s ease ${isBurst ? '0.2s' : '0.3s'}`,
                    }}
                  >
                    {sc.sub}
                  </p>

                  {/* زخارف إضافية للمشهد الثاني */}
                  {isBurst && isActive && (
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                      {['تطوير ويب', 'تطبيقات', 'UI/UX', 'متاجر', 'أنظمة'].map((tag, ti) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 rounded-full text-sm font-semibold"
                          style={{
                            background: `${sc.accent}12`,
                            border: `1px solid ${sc.accent}30`,
                            color: sc.accent,
                            animation: `tagPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + ti * 0.07}s both`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                  className="h-full transition-all duration-100"
                  style={{
                    width: isActive ? `${scProgress * 100}%` : i < activeScene ? '10%' : '0%',
                    background: sc.bgImage ? '#fff' : sc.accent,
                  }}
                />
              </div>

              {/* Scene dots */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                {SCENES.map((_, j) => (
                  <div
                    key={j}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: j === activeScene ? 20 : 6,
                      height: 6,
                      background:
                        j <= activeScene
                          ? (sc.bgImage ? '#fff' : sc.accent)
                          : isDark
                            ? 'rgba(255,255,255,0.15)'
                            : 'rgba(0,0,0,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
    <style jsx>{`
      @keyframes tagPop {
        from { opacity: 0; transform: scale(0.5) translateY(12px); }
        to   { opacity: 1; transform: scale(1) translateY(0);      }
      }
    `}</style>
    </>
  )
}
