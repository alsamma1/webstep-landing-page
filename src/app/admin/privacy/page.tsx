'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck, Plus, Trash2, ArrowUp, ArrowDown, Save,
  RefreshCw, CheckCircle2, AlertCircle, ExternalLink,
  Calendar, FileText, ChevronDown, ChevronUp, Eye
} from 'lucide-react'
import { LegalPageData, LegalSection, DEFAULT_PRIVACY_DATA } from '@/lib/legal-pages-server'

export default function AdminPrivacyPage() {
  const [data, setData] = useState<LegalPageData>(DEFAULT_PRIVACY_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/legal?type=privacy')
      .then((res) => res.json())
      .then((resData) => {
        if (resData && Array.isArray(resData.sections)) {
          setData(resData)
          if (resData.sections.length > 0) {
            setExpandedSection(resData.sections[0].id)
          }
        }
      })
      .catch((err) => console.error('Error fetching privacy data:', err))
      .finally(() => setLoading(false))
  }, [])

  const setTodayDate = () => {
    const today = new Date()
    const monthsArabic = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
    const formatted = `${today.getDate()} ${monthsArabic[today.getMonth()]} ${today.getFullYear()}`
    setData((prev) => ({ ...prev, lastUpdated: formatted }))
  }

  const handleAddSection = () => {
    const newId = `priv-${Date.now()}`
    const newSection: LegalSection = {
      id: newId,
      title: 'بند خصوصية جديد',
      content: 'اكتب هنا تفاصيل هذا البند وسياسته المتعلقة بحماية ومعالجة البيانات...',
    }
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
    setExpandedSection(newId)
  }

  const handleUpdateSection = (id: string, field: 'title' | 'content', value: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }))
  }

  const handleDeleteSection = (id: string) => {
    if (data.sections.length <= 1) {
      alert('يجب أن تحتوي الصفحة على بند واحد على الأقل.')
      return
    }
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا البند؟')) {
      setData((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== id),
      }))
    }
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSections = [...data.sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSections.length) return

    const temp = newSections[index]
    newSections[index] = newSections[targetIndex]
    newSections[targetIndex] = temp

    setData((prev) => ({ ...prev, sections: newSections }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'privacy', data }),
      })
      const result = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: result.message || 'تم حفظ صفحة سياسة الخصوصية بنجاح في قاعدة البيانات!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'حدث خطأ أثناء حفظ البيانات' })
      }
    } catch {
      setMessage({ type: 'error', text: 'فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-[var(--text-muted)] gap-3">
        <RefreshCw size={28} className="animate-spin text-[#1F8A54]" />
        <span className="text-sm font-semibold">جاري تحميل بيانات سياسة الخصوصية من Supabase...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1F8A54]/15 text-[#1F8A54] flex items-center justify-center shadow-md">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">إدارة سياسة الخصوصية</h1>
              <span className="px-2 py-0.5 rounded-md bg-[#1F8A54]/15 text-[#1F8A54] text-[10px] font-black border border-[#1F8A54]/20">
                قاعدة البيانات Supabase
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              تحكم ببنود سياسة الخصوصية، جمع البيانات، وتاريخ التحديث المنشور في الموقع
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/privacy"
            target="_blank"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
          >
            <Eye size={15} />
            <span>معاينة بالموقع</span>
            <ExternalLink size={12} className="opacity-60" />
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-lg transition-all"
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
            message.type === 'success'
              ? 'bg-[#1F8A54]/10 border-[#1F8A54]/30 text-[#1F8A54]'
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Info Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#1F8A54]" />
            <h2 className="text-sm font-black text-[var(--text-primary)]">بيانات رأس الصفحة وتاريخ التغيير</h2>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">تظهر في أعلى صفحة /privacy</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
              عنوان الصفحة الرئيسي
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none"
              placeholder="سياسة الخصوصية"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
              تاريخ آخر تغيير / تحديث
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={data.lastUpdated}
                  onChange={(e) => setData({ ...data, lastUpdated: e.target.value })}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-medium"
                  placeholder="مثال: أكتوبر ٢٠٢٥ أو ١٦ أكتوبر ٢٠٢٦"
                />
              </div>
              <button
                type="button"
                onClick={setTodayDate}
                className="px-3.5 py-2.5 rounded-xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 hover:bg-[#1F8A54]/20 text-[#1F8A54] text-xs font-bold shrink-0 transition-colors"
                title="تحديث التاريخ لليوم الحالي"
              >
                تحديث لليوم
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
            الوصف المختصر تحت العنوان
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none"
            placeholder="نحن نأخذ خصوصيتك بجدية بالغة. تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها."
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[var(--text-primary)]">بنود سياسة الخصوصية ({data.sections.length})</h2>
            <span className="text-xs text-[var(--text-muted)]">— يمكنك تعديل، ترتيب، أو إضافة بنود إضافية</span>
          </div>
          <button
            onClick={handleAddSection}
            className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={15} />
            <span>إضافة بند جديد</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.sections.map((section, index) => {
            const isExpanded = expandedSection === section.id
            return (
              <div
                key={section.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm transition-all"
              >
                {/* Section Header */}
                <div className="p-4 bg-[var(--bg-muted)]/60 flex items-center justify-between gap-3 border-b border-[var(--border)]/60">
                  <div
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#1F8A54]/15 text-[#1F8A54] font-black text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-[var(--text-primary)] hover:text-[#1F8A54] transition-colors line-clamp-1">
                      {section.title || `بند بدون عنوان (${index + 1})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="تحريك لأعلى"
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === data.sections.length - 1}
                      title="تحريك لأسفل"
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      title="حذف البند"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors mr-1"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Section Body */}
                {isExpanded && (
                  <div className="p-5 space-y-4 bg-[var(--surface)] animate-fadeIn">
                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                        عنوان البند
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-bold"
                        placeholder="مثال: البيانات التي نجمعها"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                        نص وشرح البند
                      </label>
                      <textarea
                        rows={4}
                        value={section.content}
                        onChange={(e) => handleUpdateSection(section.id, 'content', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none leading-relaxed font-normal"
                        placeholder="اكتب هنا التفاصيل الدقيقة لكيفية جمع واستخدام وحماية البيانات في هذا البند..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Add & Save buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={handleAddSection}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-[#1F8A54]/40 hover:border-[#1F8A54] bg-[#1F8A54]/5 hover:bg-[#1F8A54]/10 text-xs font-bold text-[#1F8A54] transition-colors"
          >
            <Plus size={15} />
            <span>إضافة بند جديد في الأسفل</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-white shadow-lg transition-all"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>جاري الحفظ إلى قاعدة البيانات...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>حفظ التعديلات والتحديثات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
