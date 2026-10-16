'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Save, Users, Eye, Target, Sparkles, Award, Plus, Trash2,
  CheckCircle2, AlertCircle, ArrowUpRight, Shield, RefreshCw
} from 'lucide-react'
import type { AboutPageData } from '@/lib/company-pages-types'

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/about')
      const json = await res.json()
      setData(json)
    } catch {
      setMessage({ type: 'error', text: 'تعذر تحميل بيانات صفحة من نحن' })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!data) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'فشل الحفظ')
      setMessage({ type: 'success', text: 'تم حفظ كافة بيانات صفحة من نحن في Supabase بنجاح! 🎉' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء الحفظ' })
    }
    setSaving(false)
  }

  // Values helpers
  const addValue = () => {
    if (!data) return
    setData({
      ...data,
      values: [
        ...data.values,
        { title: 'قيمة جديدة', desc: 'اكتب وصفاً مختصراً لهذه القيمة...', color: '#1F8A54' }
      ]
    })
  }

  const removeValue = (index: number) => {
    if (!data) return
    setData({
      ...data,
      values: data.values.filter((_, i) => i !== index)
    })
  }

  // Milestones helpers
  const addMilestone = () => {
    if (!data) return
    setData({
      ...data,
      milestones: [
        ...data.milestones,
        { year: '٢٠٢٦', title: 'محطة جديدة', desc: 'اكتب تفاصيل المحطة وإنجازاتها...' }
      ]
    })
  }

  const removeMilestone = (index: number) => {
    if (!data) return
    setData({
      ...data,
      milestones: data.milestones.filter((_, i) => i !== index)
    })
  }

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-sm font-bold text-[var(--text-muted)] flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin text-[#1F8A54]" /> جاري تحميل بيانات صفحة من نحن من Supabase...
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 text-right pb-16" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#1F8A54]/10 text-[#1F8A54] mb-1">
            <Users size={14} /> إدارة محتوى صفحة الشركة
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">صفحة من نحن ورؤيتنا (/about)</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            تحكّم في نصوص الرؤية والرسالة، القيم، محطات المسيرة، والإحصائيات المخزنة في Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Eye size={15} /> معاينة الصفحة الحية
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-[#1F8A54]/25 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? 'جاري الحفظ...' : 'حفظ التعديلات في Supabase'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#1F8A54]/10 text-[#1F8A54] border border-[#1F8A54]/30'
              : 'bg-red-500/10 text-red-500 border border-red-500/30'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ── Hero Settings ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles size={18} className="text-[#1F8A54]" /> نصوص الواجهة العلوية (Hero)
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الشارة العلوية (Badge)</label>
            <input
              type="text"
              value={data.hero.badge}
              onChange={e => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الكلمة الملوّنة (Highlight)</label>
            <input
              type="text"
              value={data.hero.highlight}
              onChange={e => setData({ ...data, hero: { ...data.hero, highlight: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">العنوان الرئيسي</label>
          <input
            type="text"
            value={data.hero.title}
            onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الوصف الترحيبي</label>
          <textarea
            rows={2}
            value={data.hero.subtitle}
            onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54] resize-none"
          />
        </div>
      </div>

      {/* ── Vision & Mission ── */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
            <Target size={18} className="text-[#1F8A54]" /> رؤيتنا (Vision)
          </h2>
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] mb-1 block">عنوان القسم</label>
            <input
              type="text"
              value={data.vision.title}
              onChange={e => setData({ ...data, vision: { ...data.vision, title: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] mb-1 block">نص الرؤية</label>
            <textarea
              rows={4}
              value={data.vision.desc}
              onChange={e => setData({ ...data, vision: { ...data.vision, desc: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54] resize-none"
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
            <Award size={18} className="text-[#6366f1]" /> مهمتنا (Mission)
          </h2>
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] mb-1 block">عنوان القسم</label>
            <input
              type="text"
              value={data.mission.title}
              onChange={e => setData({ ...data, mission: { ...data.mission, title: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] mb-1 block">نص المهمة</label>
            <textarea
              rows={4}
              value={data.mission.desc}
              onChange={e => setData({ ...data, mission: { ...data.mission, desc: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#6366f1] resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── Statistics ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h2 className="text-base font-black text-[var(--text-primary)]">أرقام وإحصائيات النجاح</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.stats.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2">
              <label className="text-[10px] font-black text-[var(--text-muted)]">إحصائية {idx + 1}</label>
              <input
                type="text"
                placeholder="الرقم مثل +١٢٠"
                value={s.val}
                onChange={e => {
                  const updated = [...data.stats]
                  updated[idx].val = e.target.value
                  setData({ ...data, stats: updated })
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[#1F8A54] outline-none"
              />
              <input
                type="text"
                placeholder="العنوان مثل مشروعاً ناجحاً"
                value={s.label}
                onChange={e => {
                  const updated = [...data.stats]
                  updated[idx].label = e.target.value
                  setData({ ...data, stats: updated })
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-bold outline-none"
              />
              <input
                type="text"
                placeholder="الوصف مثل في السعودية"
                value={s.sub}
                onChange={e => {
                  const updated = [...data.stats]
                  updated[idx].sub = e.target.value
                  setData({ ...data, stats: updated })
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-muted)] outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Values ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[var(--text-primary)]">قيم ومبادئ WebStep ({data.values.length})</h2>
          <button
            type="button"
            onClick={addValue}
            className="px-3 py-1.5 rounded-xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-black flex items-center gap-1.5 hover:bg-[#1F8A54]/20 transition-colors"
          >
            <Plus size={14} /> إضافة قيمة
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.values.map((v, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3 relative group">
              <button
                type="button"
                onClick={() => removeValue(idx)}
                className="absolute top-3 left-3 text-red-500/60 hover:text-red-500 transition-colors"
                title="حذف القيمة"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={v.color || '#1F8A54'}
                  onChange={e => {
                    const updated = [...data.values]
                    updated[idx].color = e.target.value
                    setData({ ...data, values: updated })
                  }}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={v.title}
                  placeholder="عنوان القيمة"
                  onChange={e => {
                    const updated = [...data.values]
                    updated[idx].title = e.target.value
                    setData({ ...data, values: updated })
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-black outline-none"
                />
              </div>
              <textarea
                rows={3}
                value={v.desc}
                placeholder="وصف القيمة..."
                onChange={e => {
                  const updated = [...data.values]
                  updated[idx].desc = e.target.value
                  setData({ ...data, values: updated })
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[var(--text-primary)]">محطات مسيرتنا (Milestones) ({data.milestones.length})</h2>
          <button
            type="button"
            onClick={addMilestone}
            className="px-3 py-1.5 rounded-xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-black flex items-center gap-1.5 hover:bg-[#1F8A54]/20 transition-colors"
          >
            <Plus size={14} /> إضافة محطة
          </button>
        </div>
        <div className="space-y-3">
          {data.milestones.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="text"
                placeholder="السنة مثل ٢٠٢٤"
                value={m.year}
                onChange={e => {
                  const updated = [...data.milestones]
                  updated[idx].year = e.target.value
                  setData({ ...data, milestones: updated })
                }}
                className="w-24 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[#1F8A54] text-center outline-none"
              />
              <input
                type="text"
                placeholder="عنوان المحطة"
                value={m.title}
                onChange={e => {
                  const updated = [...data.milestones]
                  updated[idx].title = e.target.value
                  setData({ ...data, milestones: updated })
                }}
                className="w-full sm:w-56 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-black outline-none"
              />
              <input
                type="text"
                placeholder="تفاصيل ما تحقق في هذه السنة..."
                value={m.desc}
                onChange={e => {
                  const updated = [...data.milestones]
                  updated[idx].desc = e.target.value
                  setData({ ...data, milestones: updated })
                }}
                className="flex-1 w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] outline-none"
              />
              <button
                type="button"
                onClick={() => removeMilestone(idx)}
                className="text-red-500/60 hover:text-red-500 p-2 transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Link to Team management ── */}
      <div className="p-5 rounded-2xl border border-[#1F8A54]/20 bg-[#1F8A54]/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F8A54] text-white flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <div className="text-sm font-black text-[var(--text-primary)]">إدارة أعضاء الفريق المنشورين في صفحة من نحن</div>
            <div className="text-xs text-[var(--text-muted)]">إضافة وتعديل صور، مسميات، وحسابات الفريق في جدول team بقاعدة Supabase.</div>
          </div>
        </div>
        <Link
          href="/admin/team"
          className="px-4 py-2 rounded-xl bg-[#1F8A54] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#1F8A54]/25 hover:opacity-90"
        >
          الانتقال لصفحة الفريق <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Bottom Save bar */}
      <div className="sticky bottom-4 p-4 rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] shadow-xl flex items-center justify-between z-20">
        <span className="text-xs text-[var(--text-muted)] font-medium">
          يتم الحفظ الفوري والمباشر في جدول site_settings داخل Supabase.
        </span>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-8 py-3 text-sm font-black flex items-center gap-2 shadow-lg shadow-[#1F8A54]/30 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </div>
    </form>
  )
}
