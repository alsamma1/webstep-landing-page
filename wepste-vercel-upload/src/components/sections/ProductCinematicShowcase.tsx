'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Monitor,
  Smartphone,
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Maximize2,
} from 'lucide-react'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface ShowcaseFeature {
  id: string
  title: string
  subtitle: string
  metric: string
  metricLabel: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  previewContent: {
    heading: string
    subheading: string
    highlights: string[]
    tags: string[]
  }
}

const SHOWCASE_TABS: ShowcaseFeature[] = [
  {
    id: 'web',
    title: 'منصات الويب المتطورة',
    subtitle: 'سرعة استثنائية وتحويل عالي للزوار',
    metric: '99.9%',
    metricLabel: 'Lighthouse Score',
    icon: Monitor,
    previewContent: {
      heading: 'Next-Gen Web Architecture',
      subheading: 'مبنية بتقنيات Next.js 15 مع Server Components وتوليد فوري للصفحات',
      highlights: [
        'تحميل الصفحة في أقل من 0.4 ثانية',
        'بنية SEO محسنة تلقائياً لمحركات البحث',
        'تصميم تفاعلي يدعم جميع مقاسات الشاشات بدقة 4K',
        'معدل تحويل الزوار أعلى بنسبة 140%',
      ],
      tags: ['Next.js', 'React 19', 'Tailwind', 'GSAP'],
    },
  },
  {
    id: 'apps',
    title: 'تطبيقات الهواتف الذكية',
    subtitle: 'تجربة مستخدم أصلية Native فائقة النعومة',
    metric: '60 FPS',
    metricLabel: 'سلاسة الحركة',
    icon: Smartphone,
    previewContent: {
      heading: 'Cross-Platform Native Apps',
      subheading: 'تطبيقات iOS و Android بأداء استثنائي وتكامل كامل مع ميزات الأجهزة',
      highlights: [
        'إشعارات فورية ذكية وتزامن لحظي',
        'دعم العمل بدون اتصال بالإنترنت Offline-first',
        'بوابات دفع مدمجة كـ Apple Pay و Mada',
        'واجهات لمس سريعة الاستجابة بتأثيرات Haptic',
      ],
      tags: ['iOS & Android', 'React Native', 'Push API', 'Biometrics'],
    },
  },
  {
    id: 'systems',
    title: 'أنظمة ولوحات التحكم السحابية',
    subtitle: 'إدارة متكاملة لبيانات وعمليات الشركات',
    metric: '10x',
    metricLabel: 'تسريع دورة العمل',
    icon: LayoutDashboard,
    previewContent: {
      heading: 'Enterprise Cloud Dashboard',
      subheading: 'لوحات تحكم تفاعلية متقدمة تربط جميع أقسام شركتك في شاشة واحدة',
      highlights: [
        'تحليلات بيانية حية في الوقت الفعلي',
        'نظام صلاحيات متعدد المستويات وآمن',
        'تقارير تفصيلية مدعومة بالذكاء الاصطناعي',
        'تكامل كامل مع قواعد البيانات وخدمات API',
      ],
      tags: ['PostgreSQL', 'Live Analytics', 'Role Auth', 'REST & GraphQL'],
    },
  },
]

export default function ProductCinematicShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const frameRef = useRef<HTMLDivElement>(null)

  const currentTab = SHOWCASE_TABS[activeTab]

  // Playback timer (cycles tabs every 6 seconds if playing and not hovered)
  useEffect(() => {
    if (!isPlaying || isHovered) return

    const duration = 6000
    const interval = 50
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += interval
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)

      if (elapsed >= duration) {
        elapsed = 0
        setProgress(0)
        setActiveTab(prev => {
          const next = (prev + 1) % SHOWCASE_TABS.length
          return next
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, isHovered, activeTab])

  // Mouse tilt effect on device frame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleTabSelect = (idx: number) => {
    setActiveTab(idx)
    setProgress(0)
  }

  return (
    <section
      id="product-showcase"
      className="relative py-32 bg-[#090b0e] text-white overflow-hidden select-none"
      aria-label="استعراض المنتج والتجربة السينمائية"
      dir="rtl"
    >
      {/* Cinematic Ambient Lighting (Apple / Samsung style) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse, rgba(31,138,84,0.18) 0%, rgba(14,40,25,0.08) 45%, transparent 75%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F8A54]/40 bg-[#1F8A54]/10 mb-5 backdrop-blur-md">
            <Sparkles size={14} className="text-[#1F8A54] animate-spin-slow" />
            <span className="text-xs sm:text-sm font-semibold text-[#1F8A54] tracking-wide">
              تجربة رقمية سينمائية — The WebStep Experience
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
            منتجات رقمية <span className="text-gradient-emerald">تسبق معايير اليوم</span>
          </h2>
          <p className="text-sm sm:text-lg text-white/60 leading-relaxed">
            استكشف كيف نحوّل الأفكار المعقدة إلى واجهات رقمية سلسة، تجمع بين هندسة الأداء المتقنة والجمال البصري المبهر.
          </p>
        </div>

        {/* Tab Switcher & Video Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.03] p-2.5 rounded-2xl border border-white/10 backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {SHOWCASE_TABS.map((tab, idx) => {
              const TabIcon = tab.icon
              const active = idx === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
                    active
                      ? 'bg-[#1F8A54] text-white shadow-[0_0_20px_rgba(31,138,84,0.4)]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  aria-pressed={active}
                >
                  <TabIcon size={16} />
                  <span>{tab.title}</span>
                </button>
              )
            })}
          </div>

          {/* Controls: Play/Pause, Reset, Device Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-xl border border-white/05">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${device === 'desktop' ? 'bg-[#1F8A54] text-white' : 'text-white/50 hover:text-white'}`}
                title="شاشة كمبيوتر"
                aria-label="عرض كمبيوتر"
              >
                <Monitor size={15} />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${device === 'tablet' ? 'bg-[#1F8A54] text-white' : 'text-white/50 hover:text-white'}`}
                title="شاشة لوحية"
                aria-label="عرض جهاز لوحي"
              >
                <LayoutDashboard size={15} />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${device === 'mobile' ? 'bg-[#1F8A54] text-white' : 'text-white/50 hover:text-white'}`}
                title="شاشة هاتف"
                aria-label="عرض موبايل"
              >
                <Smartphone size={15} />
              </button>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white/80 transition-colors border border-white/05"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الاستعراض'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
            </button>
          </div>
        </div>

        {/* ── Main Showcase Area: Device Screen + Character ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* High-Tech Device Showcase Window (Apple / Samsung style) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="relative transition-transform duration-300 ease-out"
              style={{
                perspective: '1200px',
                transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
              }}
            >
              {/* Outer Device Bezel (Titanium & Glass style) */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#2a3036] via-[#15191d] to-[#0c0f12] p-2.5 sm:p-3.5 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(31,138,84,0.15)]">
                {/* Top Status Bar with Camera & Window Controls */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>

                  {/* Dynamic Island / Header label */}
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A54] animate-pulse" />
                    <span>webstep-core://preview/{currentTab.id}</span>
                  </div>

                  <div className="flex items-center gap-2 text-white/40">
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Display Screen */}
                <div
                  className={`relative rounded-2xl overflow-hidden bg-[#0d1217] border border-white/05 min-h-[360px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-500 ${
                    device === 'mobile' ? 'max-w-sm mx-auto' : device === 'tablet' ? 'max-w-xl mx-auto' : 'w-full'
                  }`}
                >
                  {/* Subtle Scanline Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
                    }}
                  />

                  {/* Inner UI Preview Content */}
                  <div className="relative z-10">
                    {/* Top Tag & Metric Badge */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {currentTab.previewContent.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/[0.07] border border-white/10 text-white/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 bg-[#1F8A54]/15 border border-[#1F8A54]/30 px-3 py-1 rounded-lg">
                        <span className="text-lg font-black text-[#1F8A54]">{currentTab.metric}</span>
                        <span className="text-[11px] text-white/60 font-semibold">{currentTab.metricLabel}</span>
                      </div>
                    </div>

                    {/* Content title */}
                    <h3 className="text-xl sm:text-3xl font-black text-white mb-2 leading-snug">
                      {currentTab.previewContent.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed max-w-xl">
                      {currentTab.previewContent.subheading}
                    </p>

                    {/* Highlights Grid with Lucide Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {currentTab.previewContent.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/05 backdrop-blur-sm"
                        >
                          <CheckCircle2 size={16} className="text-[#1F8A54] flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Interactive Footer within Screen */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live Render Engine • 60 FPS Optimized</span>
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-[#1F8A54] hover:text-[#26a667] font-semibold transition-colors"
                    >
                      <span>طلب نموذج حي لمشروعك</span>
                      <ChevronRight size={14} className="rotate-180" />
                    </a>
                  </div>
                </div>

                {/* Scrubber / Progress line at bottom of device frame */}
                <div className="mt-2.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1F8A54] to-emerald-400 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side CTAs */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center text-center">
            {/* Quick action buttons */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <a
                href="#contact"
                className="w-full py-3 px-5 rounded-xl bg-[#1F8A54] hover:bg-[#26a667] text-white font-bold text-sm shadow-[0_4px_20px_rgba(31,138,84,0.35)] transition-all duration-200 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                <span>ابنِ مشروعك معنا الآن</span>
              </a>

              <a
                href="#portfolio"
                className="w-full py-3 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white font-semibold text-sm border border-white/10 transition-all text-center flex items-center justify-center gap-2"
              >
                <ExternalLink size={15} />
                <span>استعرض سابقة أعمالنا</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
