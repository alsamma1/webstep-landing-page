'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, Edit3, Trash2, Save, X, Search, Briefcase, ExternalLink,
  Sparkles, Award, ArrowRight, CheckCircle2, Layers
} from 'lucide-react'
import type { Job } from '@/lib/db'

const DEPTS = ['هندسة البرمجيات', 'تصميم', 'تسويق', 'محتوى وتسويق', 'إدارة']
const TYPES = ['دوام كامل', 'دوام جزئي', 'عن بُعد', 'عن بُعد / جزئي', 'هجين', 'مستقل']
const EMPTY: Omit<Job, 'id' | 'createdAt' | 'applications'> = {
  title: '',
  department: DEPTS[0],
  type: TYPES[0],
  location: 'الرياض',
  salary: '',
  description: '',
  requirements: [],
  urgent: false,
  active: true,
}

interface CareersContent {
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

const DEFAULT_CONTENT: CareersContent = {
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

export default function CareersAdmin() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'content'>('jobs')

  // ── Jobs Management State ──
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<typeof EMPTY & { id?: string }>(EMPTY)
  const [savingJob, setSavingJob] = useState(false)
  const [reqInput, setReqInput] = useState('')

  // ── Careers Content Settings State ──
  const [pageContent, setPageContent] = useState<CareersContent>(DEFAULT_CONTENT)
  const [loadingContent, setLoadingContent] = useState(true)
  const [savingContent, setSavingContent] = useState(false)
  const [contentStatus, setContentStatus] = useState<string | null>(null)

  const loadJobs = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/jobs')
      const data = await r.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch {
      setJobs([])
    }
    setLoading(false)
  }

  const loadContent = async () => {
    setLoadingContent(true)
    try {
      const r = await fetch('/api/admin/careers-page')
      const data = await r.json()
      if (data && !data.error) {
        setPageContent(data)
      }
    } catch {
      // keep fallback
    }
    setLoadingContent(false)
  }

  useEffect(() => {
    loadJobs()
    loadContent()
  }, [])

  // Save Job
  const saveJob = async () => {
    if (!form.title.trim()) return alert('المسمى الوظيفي مطلوب')
    setSavingJob(true)
    if (form.id) {
      await fetch(`/api/admin/jobs/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    await loadJobs()
    setSavingJob(false)
    setModal(false)
    setForm(EMPTY)
  }

  const delJob = async (id: string) => {
    if (!confirm('حذف الوظيفة؟')) return
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
    await loadJobs()
  }

  const toggleActive = async (j: Job) => {
    await fetch(`/api/admin/jobs/${j.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !j.active }),
    })
    await loadJobs()
  }

  // Save Page Content
  const saveContent = async () => {
    setSavingContent(true)
    setContentStatus(null)
    try {
      const res = await fetch('/api/admin/careers-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageContent),
      })
      const result = await res.json()
      if (result.success) {
        setContentStatus('تم حفظ وتحديث صفحة التوظيف بنجاح في قاعدة البيانات!')
      } else {
        setContentStatus('حدث خطأ أثناء الحفظ: ' + (result.error || ''))
      }
    } catch (err: unknown) {
      setContentStatus('تعذر الاتصال بالسيرفر للحفظ')
    }
    setSavingContent(false)
  }

  // Perks helpers
  const updatePerk = (index: number, field: string, val: string) => {
    setPageContent(prev => {
      const next = [...prev.perks]
      next[index] = { ...next[index], [field]: val }
      return { ...prev, perks: next }
    })
  }

  const addPerk = () => {
    setPageContent(prev => ({
      ...prev,
      perks: [...prev.perks, { title: 'ميزة جديدة', desc: 'تفاصيل الميزة والحافز الوظيفي...', color: '#1F8A54' }],
    }))
  }

  const removePerk = (index: number) => {
    setPageContent(prev => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }))
  }

  // Steps helpers
  const updateStep = (index: number, field: string, val: string) => {
    setPageContent(prev => {
      const next = [...prev.steps]
      next[index] = { ...next[index], [field]: val }
      return { ...prev, steps: next }
    })
  }

  const addStep = () => {
    const num = (pageContent.steps.length + 1).toString().padStart(2, '0')
    setPageContent(prev => ({
      ...prev,
      steps: [...prev.steps, { num, title: 'خطوة جديدة', desc: 'شرح الخطوة للمتقدم...' }],
    }))
  }

  const removeStep = (index: number) => {
    setPageContent(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] font-bold">
              قسم تواصل معنا
            </span>
            <span className="text-xs text-[var(--text-muted)]">إدارة صفحة التوظيف والوظائف</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">إدارة التوظيف وانضم إلينا</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/careers"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
          >
            <ExternalLink size={14} /> معاينة الصفحة العامة
          </Link>

          {activeTab === 'jobs' ? (
            <button
              onClick={() => { setForm(EMPTY); setModal(true) }}
              className="btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <Plus size={16} /> إضافة وظيفة جديدة
            </button>
          ) : (
            <button
              onClick={saveContent}
              disabled={savingContent}
              className="btn-primary px-6 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <Save size={16} /> {savingContent ? 'جاري الحفظ...' : 'حفظ إعدادات الصفحة'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-black border-b-2 transition-all ${
            activeTab === 'jobs'
              ? 'border-[#1F8A54] text-[#1F8A54]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Briefcase size={16} /> الوظائف الشاغرة ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-black border-b-2 transition-all ${
            activeTab === 'content'
              ? 'border-[#1F8A54] text-[#1F8A54]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers size={16} /> محتوى صفحة التوظيف (Hero والمزايا والخطوات)
        </button>
      </div>

      {contentStatus && (
        <div className="p-4 rounded-2xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-bold flex items-center justify-between">
          <span>{contentStatus}</span>
          <button onClick={() => setContentStatus(null)}><X size={14} /></button>
        </div>
      )}

      {/* ═══ TAB 1: JOBS TABLE ═══ */}
      {activeTab === 'jobs' && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">المسمى</th>
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)] hidden md:table-cell">القسم</th>
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)] hidden lg:table-cell">النوع</th>
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)] hidden lg:table-cell">الطلبات</th>
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">الحالة</th>
                  <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sm text-[var(--text-muted)]">جاري التحميل...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sm text-[var(--text-muted)]">لا توجد وظائف حالياً</td></tr>
                ) : (
                  jobs.map(j => (
                    <tr key={j.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--text-primary)]">{j.title}</span>
                          {j.urgent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] font-black">
                              عاجل
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">{j.salary || 'غير محدد'}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-[var(--text-secondary)]">{j.department}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-secondary)]">{j.type}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs font-black text-[var(--text-primary)]">{j.applications || 0}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(j)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-black ${
                            j.active ? 'bg-[#1F8A54]/10 text-[#1F8A54]' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                          }`}
                        >
                          {j.active ? '✓ مفتوحة' : 'مغلقة'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setForm({ ...j }); setModal(true) }}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[#1F8A54]"
                            title="تعديل"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => delJob(j.id)}
                            className="p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[var(--text-muted)] hover:text-[#ef4444]"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: PAGE CONTENT ═══ */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-[#1F8A54]" />
              <h3 className="font-black text-base text-[var(--text-primary)]">واجهة الصفحة (Hero)</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">شارة العنوان (Badge)</label>
                <input
                  value={pageContent.hero.badge}
                  onChange={e => setPageContent(p => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">النص الملون (Highlight)</label>
                <input
                  value={pageContent.hero.highlight}
                  onChange={e => setPageContent(p => ({ ...p, hero: { ...p.hero, highlight: e.target.value } }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان الرئيسي</label>
                <input
                  value={pageContent.hero.title}
                  onChange={e => setPageContent(p => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف التوضيحي</label>
                <textarea
                  value={pageContent.hero.subtitle}
                  onChange={e => setPageContent(p => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Perks / Benefits */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#1F8A54]" />
                <h3 className="font-black text-base text-[var(--text-primary)]">مزايا وحوافز العمل (Perks)</h3>
              </div>
              <button
                onClick={addPerk}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1F8A54]/30 text-[#1F8A54] hover:bg-[#1F8A54]/10 text-xs font-bold transition-colors"
              >
                <Plus size={14} /> إضافة ميزة
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {pageContent.perks.map((perk, i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">ميزة #{i + 1}</span>
                    <button onClick={() => removePerk(i)} className="text-[var(--text-muted)] hover:text-[#ef4444]">
                      <X size={14} />
                    </button>
                  </div>
                  <div>
                    <input
                      value={perk.title}
                      onChange={e => updatePerk(i, 'title', e.target.value)}
                      placeholder="عنوان الميزة"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-bold outline-none focus:border-[#1F8A54]"
                    />
                  </div>
                  <div>
                    <textarea
                      value={perk.desc}
                      onChange={e => updatePerk(i, 'desc', e.target.value)}
                      placeholder="شرح الميزة..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs resize-none outline-none focus:border-[#1F8A54]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Steps */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#1F8A54]" />
                <h3 className="font-black text-base text-[var(--text-primary)]">مراحل وخطوات التوظيف</h3>
              </div>
              <button
                onClick={addStep}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1F8A54]/30 text-[#1F8A54] hover:bg-[#1F8A54]/10 text-xs font-bold transition-colors"
              >
                <Plus size={14} /> إضافة خطوة
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pageContent.steps.map((st, i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <input
                      value={st.num}
                      onChange={e => updateStep(i, 'num', e.target.value)}
                      className="w-12 px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)] font-mono text-xs font-bold text-center"
                    />
                    <button onClick={() => removeStep(i)} className="text-[var(--text-muted)] hover:text-[#ef4444]">
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    value={st.title}
                    onChange={e => updateStep(i, 'title', e.target.value)}
                    placeholder="عنوان المرحلة"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-bold outline-none focus:border-[#1F8A54]"
                  />
                  <textarea
                    value={st.desc}
                    onChange={e => updateStep(i, 'desc', e.target.value)}
                    placeholder="شرح المرحلة..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs resize-none outline-none focus:border-[#1F8A54]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Job Add/Edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-muted)]">
              <h3 className="font-black text-base text-[var(--text-primary)]">
                {form.id ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}
              </h3>
              <button onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-black mb-1.5 block">المسمى الوظيفي *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">القسم</label>
                  <select
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                  >
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">نوع العمل</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                  >
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">الموقع</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">الراتب</label>
                  <input
                    value={form.salary}
                    onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                    placeholder="٨,٠٠٠ – ١٢,٠٠٠ ر.س"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black mb-1.5 block">الوصف الوظيفي</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black mb-1.5 block">المتطلبات</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={reqInput}
                    onChange={e => setReqInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (reqInput.trim()) {
                          setForm(f => ({ ...f, requirements: [...f.requirements, reqInput.trim()] }))
                          setReqInput('')
                        }
                      }
                    }}
                    placeholder="اكتب متطلباً واضغط Enter"
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                  />
                </div>
                <ul className="space-y-1">
                  {form.requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-muted)] px-3 py-2 rounded-xl">
                      <span className="flex-1">• {r}</span>
                      <button onClick={() => setForm(f => ({ ...f, requirements: f.requirements.filter((_, j) => j !== i) }))}>
                        <X size={10} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={form.urgent}
                    onChange={e => setForm(f => ({ ...f, urgent: e.target.checked }))}
                    className="rounded"
                  />
                  وظيفة عاجلة
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="rounded"
                  />
                  مفتوحة للتقديم
                </label>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-bold">
                  إلغاء
                </button>
                <button
                  onClick={saveJob}
                  disabled={savingJob}
                  className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {savingJob ? 'حفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
