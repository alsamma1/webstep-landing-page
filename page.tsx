'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Target, Eye, Heart, Rocket, Users, Globe, Award,
  TrendingUp, Shield, Zap, Star, CheckCircle2,
  Lightbulb, HandshakeIcon, ArrowRight, Send,
  MapPin, Clock, Coffee, Code2, Palette, BarChart3,
  User as UserIcon
} from 'lucide-react'
import { DEFAULT_ABOUT_PAGE, type AboutPageData } from '@/lib/company-pages-types'

/* ─── Helper to check if string is a valid image URL ─── */
function isImageUrl(url?: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/') ||
    /\.(webp|png|jpe?g|svg|gif|avif)($|\?)/i.test(trimmed)
  )
}

/* ─── Default Fallback Team Members ─── */
const DEFAULT_TEAM = [
  {
    name: 'أحمد العمري',
    role: 'المؤسس والمدير التقني',
    bio: 'مطور Full-Stack بخبرة ١٠+ سنوات. بنى أكثر من ١٢٠ مشروعاً رقمياً للسوق السعودي والخليجي.',
    avatar: '',
    skills: ['Next.js', 'React', 'Node.js', 'AWS'],
    color: '#1F8A54',
  },
  {
    name: 'سارة الجهني',
    role: 'مديرة تصميم UI/UX',
    bio: 'مصممة بخبرة ٨ سنوات. متخصصة في تحسين تجربة المستخدم ورفع معدلات التحويل.',
    avatar: '',
    skills: ['Figma', 'UX Research', 'Design Systems', 'Framer'],
    color: '#ec4899',
  },
  {
    name: 'محمد الحارثي',
    role: 'مدير التسويق الرقمي',
    bio: 'خبير تسويق رقمي وSEO. حقق نمو +٣٤٠٪ في حركة البحث لعملاء متعددين.',
    avatar: '',
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'Analytics'],
    color: '#6366f1',
  },
  {
    name: 'فيصل الدوسري',
    role: 'مطور تطبيقات الجوال',
    bio: 'متخصص Flutter وReact Native. أطلق ١٥+ تطبيق بمعدل تقييم ٤.٨+ في المتاجر.',
    avatar: '',
    skills: ['Flutter', 'React Native', 'Firebase', 'Dart'],
    color: '#f59e0b',
  },
]

/* ─── Milestones Fallback ─── */
const DEFAULT_MILESTONES = [
  { year: '٢٠١٩', title: 'التأسيس', desc: 'بدأنا بمشروعَين فقط ومكتب صغير في الرياض.' },
  { year: '٢٠٢١', title: 'الخمسون مشروع', desc: 'أتممنا ٥٠ مشروعاً وبنينا فريق من ١٢ متخصصاً.' },
  { year: '٢٠٢٣', title: 'إطلاق Step ERP', desc: 'أطلقنا نظام ERP الخاص بنا ووصلنا لـ ٢٠+ عميل مؤسسي.' },
  { year: '٢٠٢٤', title: 'توسّع خليجي', desc: 'افتتحنا شراكات في الإمارات والكويت وأتممنا ١٢٠+ مشروع.' },
  { year: '٢٠٢٥', title: 'مرحلة AI-First', desc: 'دمجنا الذكاء الاصطناعي في كل خدماتنا وتسليماتنا.' },
]

export default function AboutPage() {
  const [pageData, setPageData] = useState<AboutPageData>(DEFAULT_ABOUT_PAGE)
  const [teamList, setTeamList] = useState<typeof DEFAULT_TEAM>(DEFAULT_TEAM)

  useEffect(() => {
    // 1. Fetch About Page content from Supabase
    fetch('/api/public/about')
      .then((r) => r.json())
      .then((json) => {
        if (json && typeof json === 'object') {
          setPageData((prev) => ({
            ...prev,
            ...json,
            hero: { ...prev.hero, ...(json.hero || {}) },
            vision: { ...prev.vision, ...(json.vision || {}) },
            mission: { ...prev.mission, ...(json.mission || {}) },
            stats: Array.isArray(json.stats) && json.stats.length > 0 ? json.stats : prev.stats,
            values: Array.isArray(json.values) && json.values.length > 0 ? json.values : prev.values,
            milestones: Array.isArray(json.milestones) && json.milestones.length > 0 ? json.milestones : prev.milestones,
          }))
        }
      })
      .catch((e) => console.warn('About content fallback active:', e))

    // 2. Fetch team members from Supabase team table
    fetch('/api/public/content?type=team')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return

        const colors = ['#1F8A54', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6']
        const mappedFromDb = data.map((m: Record<string, unknown>, idx: number) => ({
          name: String(m.name || ''),
          role: String(m.role || ''),
          bio: String(m.bio || ''),
          avatar: String(m.avatar || '').trim(),
          skills: Array.isArray(m.skills) ? m.skills : ['تقنية', 'WebStep'],
          color: colors[idx % colors.length],
        }))

        if (mappedFromDb.length > 0) {
          // If DB has fewer than 4 members, append from default team so grid remains complete and rich
          const existingNames = new Set(mappedFromDb.map((m) => m.name.trim()))
          const remainingDefaults = DEFAULT_TEAM.filter((d) => !existingNames.has(d.name.trim()))
          const combined = [...mappedFromDb, ...remainingDefaults].slice(0, Math.max(mappedFromDb.length, 4))
          setTeamList(combined)
        }
      })
      .catch((error) => console.error('Public team content fallback active:', error))
  }, [])

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-24 pb-20 overflow-x-hidden text-right">
        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--border)] py-20 sm:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, #1F8A54, transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-8"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }}
            />
          </div>
          <div className="container-ws relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] mb-6">
                <Users size={14} /> {pageData.hero.badge}
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[var(--text-primary)] leading-[1.15] mb-6 tracking-tight">
                {pageData.hero.title}{' '}
                <span className="text-gradient-green">{pageData.hero.highlight}</span>
              </h1>
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10">
                {pageData.hero.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                {pageData.stats.map((s: any, idx: number) => {
                  const colors = ['#1F8A54', '#6366f1', '#f59e0b', '#ec4899']
                  const col = colors[idx % colors.length]
                  const number = s.val || s.number || '١٠٠+'
                  const label = s.label || 'إحصائية'
                  return (
                    <div
                      key={idx}
                      className="text-center px-6 py-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md min-w-[130px]"
                    >
                      <div className="text-2xl sm:text-3xl font-black" style={{ color: col }}>
                        {number}
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)] mt-1">{label}</div>
                      {s.sub && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.sub}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══ VISION & MISSION ══ */}
        <section className="section-padding bg-[var(--bg-soft)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Vision */}
              <div className="p-8 rounded-3xl border border-[#1F8A54]/30 bg-[#1F8A54]/5 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-15"
                  style={{ background: '#1F8A54' }}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#1F8A54]/15 flex items-center justify-center mb-5">
                    <Eye size={24} className="text-[#1F8A54]" />
                  </div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">{pageData.vision.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                    {pageData.vision.desc}
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="p-8 rounded-3xl border border-[#6366f1]/30 bg-[#6366f1]/5 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-15"
                  style={{ background: '#6366f1' }}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/15 flex items-center justify-center mb-5">
                    <Target size={24} className="text-[#6366f1]" />
                  </div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">{pageData.mission.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                    {pageData.mission.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section className="section-padding bg-[var(--bg)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">قيمنا الجوهرية</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">ما الذي يجعل WebStep مختلفة؟</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageData.values.map((v, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:shadow-xl hover:border-[#1F8A54]/40 transition-all duration-300 group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: `${v.color || '#1F8A54'}15` }}
                    >
                      <Award size={20} style={{ color: v.color || '#1F8A54' }} />
                    </div>
                    <h4 className="font-black text-base text-[var(--text-primary)] mb-2">{v.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ TEAM SECTION WITH PROPER AVATAR / IMAGE RENDERING ══ */}
        <section className="section-padding bg-[var(--bg-soft)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="mb-10 text-center sm:text-right">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">فريق العمل</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                العقول التي تبني مستقبلك الرقمي
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamList.map((m, idx) => {
                const hasImg = isImageUrl(m.avatar)
                return (
                  <div
                    key={`${m.name}-${idx}`}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Member Avatar / Image Container */}
                    <div
                      className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden relative group-hover:scale-105 transition-all duration-300 border-2"
                      style={{
                        background: `${m.color || '#1F8A54'}15`,
                        borderColor: `${m.color || '#1F8A54'}40`,
                      }}
                    >
                      {hasImg ? (
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            // If the image fails to load, gracefully display the stylized initial
                            const target = e.currentTarget
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('.avatar-fallback')) {
                              const fallback = document.createElement('div')
                              fallback.className =
                                'avatar-fallback font-black text-2xl text-[#1F8A54] flex items-center justify-center w-full h-full'
                              fallback.innerText = m.name ? m.name.charAt(0) : 'م'
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      ) : m.avatar && m.avatar.length <= 4 ? (
                        <span className="text-3xl">{m.avatar}</span>
                      ) : (
                        <div className="font-black text-2xl flex items-center justify-center w-full h-full" style={{ color: m.color || '#1F8A54' }}>
                          {m.name ? m.name.charAt(0) : 'م'}
                        </div>
                      )}
                    </div>

                    <h4 className="font-black text-base text-[var(--text-primary)] mb-1">{m.name}</h4>
                    <div className="text-xs font-bold mb-3" style={{ color: m.color || '#1F8A54' }}>
                      {m.role}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[40px]">
                      {m.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {m.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-secondary)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ TIMELINE ══ */}
        <section className="section-padding bg-[var(--bg)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="mb-10 text-center sm:text-right">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">مسيرتنا</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">من الفكرة إلى الريادة</h2>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute right-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1F8A54] via-[#1F8A54]/50 to-transparent" />
              <div className="space-y-8 pr-12">
                {(pageData.milestones && pageData.milestones.length > 0
                  ? pageData.milestones
                  : DEFAULT_MILESTONES
                ).map((m, i) => (
                  <div key={m.year + '-' + i} className="relative">
                    <div
                      className="absolute -right-12 top-1 w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)' }}
                    >
                      {i + 1}
                    </div>
                    <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[#1F8A54]/40 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#1F8A54]/10 text-[#1F8A54]">
                          {m.year}
                        </span>
                        <h4 className="font-black text-base text-[var(--text-primary)]">{m.title}</h4>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="section-padding bg-[var(--bg-soft)]">
          <div className="container-ws">
            <div
              className="rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden border border-[#1F8A54]/20"
              style={{ background: 'linear-gradient(135deg, #0a1a10 0%, #0d2818 50%, #0a1a10 100%)' }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
                  style={{ background: '#1F8A54' }}
                />
                <div
                  className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-15"
                  style={{ background: '#6366f1' }}
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">مستعد تبني مشروعك معنا؟</h2>
                <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                  ابدأ بتقديم طلبك الآن — فريقنا سيتواصل معك خلال ساعتين.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/order" className="btn-primary px-8 py-3.5 text-sm flex items-center gap-2 shadow-lg">
                    <Send size={16} /> قدّم طلبك الآن
                  </Link>
                  <Link
                    href="/contact"
                    className="px-7 py-3.5 rounded-xl border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    تواصل معنا مباشرة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
