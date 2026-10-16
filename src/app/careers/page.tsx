'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Code2, Palette, BarChart3, Smartphone, Server, PenLine,
  MapPin, Clock, Briefcase, Users, Star, Zap, Heart,
  Coffee, Globe, Award, ArrowRight, Send, ChevronRight,
  CheckCircle2, X, Upload, Building
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

/* ─── Jobs ─── */
const JOBS = [
  {
    id: 'frontend-dev',
    title: 'مطور Frontend Senior',
    department: 'هندسة البرمجيات',
    type: 'دوام كامل',
    location: 'الرياض (هجين)',
    salary: '١٠,٠٠٠ – ١٨,٠٠٠ ر.س',
    icon: Code2,
    color: '#1F8A54',
    urgent: true,
    description: 'نبحث عن مطور Frontend متمكن لبناء واجهات مستخدم استثنائية باستخدام Next.js وTailwind CSS. ستعمل على مشاريع متنوعة لعملاء سعوديين وخليجيين.',
    requirements: [
      '٣+ سنوات خبرة في React / Next.js',
      'إتقان TypeScript وTailwind CSS',
      'خبرة في Figma Handoff وComponent Systems',
      'فهم جيد لـ Performance وCore Web Vitals',
      'القدرة على العمل ضمن فريق Agile',
    ],
    extras: ['بورتفوليو GitHub قوي', 'خبرة في Framer Motion ميزة إضافية'],
  },
  {
    id: 'uiux-designer',
    title: 'مصمم UI/UX متمكن',
    department: 'تصميم',
    type: 'دوام كامل',
    location: 'الرياض (هجين)',
    salary: '٨,٠٠٠ – ١٤,٠٠٠ ر.س',
    icon: Palette,
    color: '#ec4899',
    urgent: true,
    description: 'نريد مصمم UX يفهم عقل المستخدم ويُترجمه لتصاميم Figma قابلة للتطوير المباشر.',
    requirements: [
      '٣+ سنوات تصميم UI/UX',
      'إتقان Figma (Auto Layout, Variables, Components)',
      'خبرة في UX Research وUser Testing',
      'Portfolio يُثبت تأثير تصاميمك على الأعمال',
      'فهم HTML/CSS ميزة إضافية',
    ],
    extras: ['بورتفوليو Behance أو Dribbble', 'خبرة Design Systems'],
  },
  {
    id: 'digital-marketing',
    title: 'متخصص تسويق رقمي',
    department: 'تسويق',
    type: 'دوام كامل',
    location: 'الرياض (عن بُعد)',
    salary: '٧,٠٠٠ – ١٢,٠٠٠ ر.س',
    icon: BarChart3,
    color: '#6366f1',
    urgent: false,
    description: 'نبحث عن متخصص يجمع بين SEO، إعلانات مدفوعة، وتحليل البيانات لتحقيق نمو حقيقي للعملاء.',
    requirements: [
      '٢+ سنوات في Digital Marketing',
      'إتقان Google Ads وMeta Ads',
      'خبرة SEO (On-Page + Technical)',
      'فهم GA4 وGTM وLooker Studio',
      'مهارات كتابة نصوص تسويقية (Copywriting)',
    ],
    extras: ['شهادة Google Ads أو Meta Blueprint', 'خبرة B2B SaaS Marketing'],
  },
  {
    id: 'flutter-dev',
    title: 'مطور Flutter Mobile',
    department: 'هندسة البرمجيات',
    type: 'دوام كامل / مستقل',
    location: 'الرياض (عن بُعد)',
    salary: '٩,٠٠٠ – ١٦,٠٠٠ ر.س',
    icon: Smartphone,
    color: '#f59e0b',
    urgent: false,
    description: 'مطور Flutter لبناء تطبيقات iOS وAndroid عالية الجودة بـ Architecture نظيف ومحافظة ممتازة.',
    requirements: [
      '٢+ سنوات Flutter & Dart',
      'خبرة Firebase، REST APIs، State Management (Riverpod/BLoC)',
      'نشر ناجح في App Store وPlay Store',
      'اهتمام بالأداء وتجربة المستخدم',
    ],
    extras: ['خبرة في Native Modules', 'اهتمام بـ Animations'],
  },
  {
    id: 'content-writer',
    title: 'كاتب محتوى رقمي (Arabic)',
    department: 'محتوى وتسويق',
    type: 'عن بُعد / جزئي',
    location: 'عن بُعد',
    salary: '٤,٠٠٠ – ٧,٠٠٠ ر.س',
    icon: PenLine,
    color: '#06b6d4',
    urgent: false,
    description: 'كاتب محتوى SEO ذو تفكير تسويقي لكتابة مقالات، نصوص صفحات، ومحتوى سوشيال ميديا.',
    requirements: [
      'كتابة عربية احترافية وخالية من الأخطاء',
      'فهم أساسيات SEO والكلمات المفتاحية',
      'خبرة في كتابة محتوى تقني وتسويقي',
      'سرعة كتابة ١٠٠٠+ كلمة بجودة عالية',
    ],
    extras: ['خبرة AI Content (ChatGPT)', 'خلفية تقنية ميزة'],
  },
]

/* ─── Benefits ─── */
const BENEFITS = [
  { icon: Zap, title: 'مشاريع تحدّي', desc: 'ستعمل على مشاريع حقيقية تصنع فارقاً في السوق.', color: '#1F8A54' },
  { icon: Globe, title: 'بيئة هجينة', desc: 'مرونة العمل من المكتب أو البيت حسب طبيعة المهمة.', color: '#6366f1' },
  { icon: Award, title: 'تطوير مستمر', desc: 'ميزانية تدريب سنوية + اشتراكات في أدوات ومنصات تعليمية.', color: '#f59e0b' },
  { icon: Heart, title: 'بيئة إيجابية', desc: 'ثقافة احترام واهتمام بالإنسان قبل الإنتاجية.', color: '#ec4899' },
  { icon: Coffee, title: 'مكتب عصري', desc: 'مكتب مجهز بالكامل في الرياض مع قهوة لا تنتهي! ☕', color: '#8b5cf6' },
  { icon: Building, title: 'نمو وترقي', desc: 'مسار واضح للنمو الوظيفي ومراجعة رواتب سنوية.', color: '#06b6d4' },
]

/* ─── Apply Modal ─── */
function ApplyModal({ job, onClose }: { job: typeof JOBS[0]; onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const settings = useSiteSettings()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'career',
          name,
          phone,
          email,
          subject: `طلب وظيفة: ${job.title}`,
          message: `طلب توظيف لوظيفة: ${job.title}\nالقسم: ${job.department}\nبورتفوليو / لينكدإن: ${portfolio}\nملاحظة المتقدم: ${note}`,
        }),
      })
      if (!response.ok) throw new Error('تعذر تسجيل طلب التوظيف')
    } catch (err) {
      console.error('Job application save error:', err)
      return
    }

    const wa = (settings.whatsapp || '966500000000').replace(/[^0-9]/g, '')
    const text = encodeURIComponent(`🎯 طلب وظيفة — WebStep Careers\n\nالوظيفة: ${job.title}\n\nالاسم: ${name}\nالهاتف: ${phone}\nالبريد: ${email}\nبورتفوليو/لينكدإن: ${portfolio}\n\nملاحظة:\n${note}`)
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank')
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" dir="rtl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-muted)]">
          <div>
            <h3 className="font-black text-base text-[var(--text-primary)]">التقدم لوظيفة: {job.title}</h3>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{job.department} · {job.location}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-soft)] text-[var(--text-muted)]"><X size={18} /></button>
        </div>

        {!sent ? (
          <form onSubmit={handleApply} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الاسم الكامل *</label>
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="محمد أحمد"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">رقم الجوال *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} required type="tel" placeholder="+٩٦٦ ٥٠٠ ٠٠٠ ٠٠٠"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">البريد الإلكتروني *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="example@email.com"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">رابط البورتفوليو / LinkedIn *</label>
              <input value={portfolio} onChange={e => setPortfolio(e.target.value)} required placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">لماذا WebStep؟ (اختياري)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="أخبرنا عن نفسك وسبب رغبتك بالانضمام..."
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
            </div>
            <button type="submit" className="w-full btn-primary py-3.5 text-sm font-black flex items-center justify-center gap-2">
              <Send size={15} /> تقديم الطلب عبر واتساب
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1F8A54]/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-[#1F8A54]" />
            </div>
            <h3 className="font-black text-lg text-[var(--text-primary)] mb-2">تم تقديم طلبك! 🎉</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">أرسل الرسالة الجاهزة على واتساب وسيتواصل معك فريق HR خلال ٣ أيام عمل.</p>
            <button onClick={onClose} className="btn-primary px-6 py-2.5 text-sm">إغلاق</button>
          </div>
        )}
      </div>
    </div>
  )
}

interface CareersPageData {
  hero: {
    badge: string
    title: string
    highlight: string
    subtitle: string
  }
  perks: Array<{
    title: string
    desc: string
    color: string
  }>
  steps: Array<{
    num: string
    title: string
    desc: string
  }>
}

const DEFAULT_CAREERS_DATA: CareersPageData = {
  hero: {
    badge: 'انضم إلى فريق النخبة',
    title: 'اصنع مستقبلك المهني مع',
    highlight: 'عائلة WebStep',
    subtitle: 'نبحث دائماً عن المبدعين والشغوفين بالتقنية والتصميم للانضمام إلى رحلتنا في بناء وتطوير المنتجات الرقمية الحديثة.',
  },
  perks: [
    { title: 'رواتب مجزية وحوافز', desc: 'رواتب تنافسية ترتبط بالأداء المتميز ومكافآت على إنجاز المشاريع.', color: '#1F8A54' },
    { title: 'مرونة بيئة العمل', desc: 'إمكانية العمل الهجين أو عن بُعد بمرونة تدعم التوازن بين العمل والحياة.', color: '#6366f1' },
    { title: 'تطوير وتدريب مستمر', desc: 'ميزانية سنوية مخصصة للدورات والمؤتمرات واشتراكات في أحدث الأدوات التقنية.', color: '#f59e0b' },
    { title: 'مشاريع نوعية وتقنيات حديثة', desc: 'فرصة العمل على تقنيات الذكاء الاصطناعي، Next.js، والتطبيقات الواسعة الانتشار.', color: '#ec4899' },
  ],
  steps: [
    { num: '٠١', title: 'التقديم', desc: 'أرسل بياناتك وبورتفوليو أعمالك عبر النموذج السريع.' },
    { num: '٠٢', title: 'مراجعة الطلب', desc: 'يقوم الفريق بمراجعة أعمالك خلال ٣ إلى ٥ أيام عمل.' },
    { num: '٠٣', title: 'المقابلة الفنية', desc: 'جلسة حوارية ممتعة للتعرف على مهاراتك وثقافة العمل.' },
    { num: '٠٤', title: 'عرض الانضمام', desc: 'نرحب بك عضواً أساسياً في فريق WebStep!' },
  ],
}

export default function CareersPage() {
  const settings = useSiteSettings()
  const [pageData, setPageData] = useState<CareersPageData>(DEFAULT_CAREERS_DATA)
  const [activeJob, setActiveJob] = useState<typeof JOBS[0] | null>(null)
  const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null)
  const [filter, setFilter] = useState<string>('الكل')
  const [jobsList, setJobsList] = useState<typeof JOBS>([])

  useEffect(() => {
    fetch('/api/public/careers-page')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setPageData(data)
        }
      })
      .catch(err => console.error('Careers page settings error:', err))

    fetch('/api/public/content?type=jobs')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error(data.error || 'تعذر تحميل الوظائف')
        setJobsList(data.map((j: Record<string, unknown>) => ({
          id: String(j.id || ''),
          title: String(j.title || ''),
          department: String(j.department || 'عام'),
          type: String(j.type || 'دوام كامل'),
          location: String(j.location || 'الرياض'),
          salary: String(j.salary || 'حسب الخبرة'),
          icon: Code2,
          color: '#1F8A54',
          urgent: Boolean(j.urgent),
          description: String(j.description || ''),
          requirements: Array.isArray(j.requirements) ? j.requirements : [],
          extras: Array.isArray(j.benefits) ? j.benefits : [],
        })))
      })
      .catch(error => console.error('Public job content failed:', error))
  }, [])

  const departments = ['الكل', ...Array.from(new Set(jobsList.map(j => j.department)))]
  const filteredJobs = filter === 'الكل' ? jobsList : jobsList.filter(j => j.department === filter)

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-24 pb-20 overflow-x-hidden text-right">

        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--border)] py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #1F8A54, transparent 60%)' }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-8" style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }} />
          </div>
          <div className="container-ws relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] mb-6">
              <Briefcase size={14} /> {pageData.hero?.badge || `${jobsList.filter(j => j.urgent).length || 3} وظائف عاجلة مفتوحة الآن`}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[var(--text-primary)] mb-5 tracking-tight leading-tight">
              {pageData.hero?.title || 'انضم لفريق يبني'}<br /><span className="text-gradient-green">{pageData.hero?.highlight || 'مستقبلاً رقمياً'}</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
              {pageData.hero?.subtitle || 'نبحث عن أشخاص موهوبين يريدون ترك بصمة حقيقية في السوق الرقمي السعودي — لا مجرد موظفين.'}
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              {[
                { val: (jobsList.length || JOBS.length).toString(), label: 'وظيفة مفتوحة' },
                { val: '٢٠+', label: 'عضو في الفريق' },
                { val: '٤.٩/٥', label: 'تقييم بيئة العمل' },
              ].map(s => (
                <div key={s.val} className="px-6 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="text-2xl font-black text-[#1F8A54]">{s.val}</div>
                  <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ══ */}
        <section className="section-padding bg-[var(--bg-soft)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">لماذا WebStep؟</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(pageData.perks && pageData.perks.length > 0 ? pageData.perks : BENEFITS).map((b, idx) => {
                const Icon = (b as any).icon || Zap
                return (
                  <div key={b.title + idx} className="flex gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color || '#1F8A54'}15` }}>
                      <Icon size={18} style={{ color: b.color || '#1F8A54' }} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[var(--text-primary)] mb-1">{b.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ JOBS ══ */}
        <section className="section-padding bg-[var(--bg)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-[#1F8A54] mb-1 block">الوظائف المفتوحة</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">اختر مجالك وقدّم الآن</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map(d => (
                  <button key={d} onClick={() => setFilter(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filter === d ? 'bg-[#1F8A54] text-white border-transparent' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {filteredJobs.map(job => {
                const Icon = job.icon
                const isActive = activeJob?.id === job.id
                return (
                  <div key={job.id} className={`rounded-3xl border bg-[var(--surface)] overflow-hidden transition-all duration-300 cursor-pointer ${isActive ? 'border-[#1F8A54]/50 shadow-xl' : 'border-[var(--border)] hover:shadow-lg hover:border-[#1F8A54]/30'}`}
                    onClick={() => setActiveJob(isActive ? null : job)}>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${job.color}15` }}>
                            <Icon size={20} style={{ color: job.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-base text-[var(--text-primary)]">{job.title}</h3>
                              {job.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#ef4444]/15 text-[#ef4444]">عاجل</span>}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">{job.department}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} className={`text-[var(--text-muted)] transition-transform mt-1 ${isActive ? 'rotate-90' : ''}`} />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {[job.type, job.location, job.salary].map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
                        ))}
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{job.description}</p>
                    </div>

                    {isActive && (
                      <div className="px-6 pb-6 pt-2 border-t border-[var(--border)] bg-[var(--bg-muted)]" onClick={e => e.stopPropagation()}>
                        <h4 className="text-xs font-black text-[var(--text-primary)] mb-3">المتطلبات:</h4>
                        <ul className="space-y-1.5 mb-5">
                          {job.requirements.map(r => (
                            <li key={r} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                              <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: job.color }} />{r}
                            </li>
                          ))}
                        </ul>
                        {job.extras.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs font-bold text-[var(--text-muted)] mb-1.5">⭐ مميزات إضافية:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {job.extras.map(e => (
                                <span key={e} className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-[var(--border)] bg-[var(--surface)]">{e}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-md transition-all hover:opacity-90"
                          style={{ background: `linear-gradient(135deg, ${job.color}, ${job.color}cc)` }}>
                          <Send size={14} /> تقدّم لهذه الوظيفة الآن
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Dynamic Hiring Steps */}
            {pageData.steps && pageData.steps.length > 0 && (
              <div className="mt-14 mb-8">
                <div className="text-center mb-8">
                  <span className="text-xs font-bold text-[#1F8A54] mb-1 block">خطوات بسيطة وسريعة</span>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">كيف تبدأ رحلتك معنا؟</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pageData.steps.map(s => (
                    <div key={s.num} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
                      <div className="text-2xl font-black text-[#1F8A54]/25 mb-2 font-mono">{s.num}</div>
                      <h4 className="font-black text-sm text-[var(--text-primary)] mb-1.5">{s.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open application */}
            <div className="mt-8 p-7 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] text-center">
              <div className="text-2xl mb-3">🌟</div>
              <h3 className="font-black text-lg text-[var(--text-primary)] mb-2">لا تجد وظيفتك؟</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">أرسل لنا CV وبورتفوليوك وسنتواصل معك عند توفر فرصة مناسبة.</p>
              <a href={`https://wa.me/${(settings.whatsapp || '966500000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود إرسال CV للانضمام لفريق WebStep في مجال:')}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary px-7 py-3 text-sm inline-flex items-center gap-2">
                <Send size={14} /> أرسل CV مفتوح
              </a>
            </div>
          </div>
        </section>

      </main>

      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      <Footer />
    </>
  )
}
