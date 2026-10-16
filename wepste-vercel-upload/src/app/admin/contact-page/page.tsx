'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Save, Phone, Eye, MessageCircle, HelpCircle, Plus, Trash2,
  CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, RefreshCw, Mail, MapPin, Clock
} from 'lucide-react'
import type { ContactPageData } from '@/lib/company-pages-types'

export default function AdminContactPage() {
  const [data, setData] = useState<ContactPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [channelTab, setChannelTab] = useState<'sa' | 'ye'>('sa')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contact-page')
      const json = await res.json()
      setData(json)
    } catch {
      setMessage({ type: 'error', text: 'تعذر تحميل بيانات صفحة تواصل معنا' })
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
      const res = await fetch('/api/admin/contact-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'فشل الحفظ')
      setMessage({ type: 'success', text: 'تم حفظ بيانات صفحة تواصل معنا والأسئلة الشائعة في Supabase بنجاح! 🎉' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء الحفظ' })
    }
    setSaving(false)
  }

  const addFaq = () => {
    if (!data) return
    setData({
      ...data,
      faqs: [
        ...data.faqs,
        { q: 'سؤال شائع جديد؟', a: 'اكتب الإجابة المفصلة والشافية هنا...' }
      ]
    })
  }

  const removeFaq = (index: number) => {
    if (!data) return
    setData({
      ...data,
      faqs: data.faqs.filter((_, i) => i !== index)
    })
  }

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-sm font-bold text-[var(--text-muted)] flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin text-[#1F8A54]" /> جاري تحميل بيانات صفحة تواصل معنا من Supabase...
      </div>
    )
  }

  const activeChannels = channelTab === 'ye'
    ? (data.yemenChannels || {
        whatsapp: '967771111357',
        email: 'alsmh655@gmail.com',
        phone: '+967 771 111 357',
        address: 'صنعاء، الجمهورية اليمنية',
        workingHoursWeekday: 'السبت – الخميس: ٩ص – ٩م',
        workingHoursWeekend: 'الجمعة: مغلق',
        responseTimeText: 'الرد المباشر لعملاء اليمن عبر واتساب والاتصال خلال دقائق',
      })
    : data.channels

  const updateActiveChannels = (updated: Partial<typeof activeChannels>) => {
    if (channelTab === 'ye') {
      setData({
        ...data,
        yemenChannels: {
          ...activeChannels,
          ...updated,
        },
      })
    } else {
      setData({
        ...data,
        channels: {
          ...data.channels,
          ...updated,
        },
      })
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 text-right pb-16" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#1F8A54]/10 text-[#1F8A54] mb-1">
            <Phone size={14} /> إدارة محتوى صفحة التواصل
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">صفحة تواصل معنا (/contact)</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            تحكّم في قنوات الاتصال، أوقات العمل، والأسئلة الشائعة (FAQ) المخزنة في قاعدة Supabase حسب كل منطقة جغرافية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
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
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الشارة (Badge)</label>
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

      {/* ── Channels & Info (Dual-Region Tabs) ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
              <Phone size={18} className="text-[#1F8A54]" /> بيانات وقنوات التواصل حسب المنطقة الجغرافية
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              حدد قنوات التواصل التي تظهر لعملاء السعودية وبقية دول العالم، وتلك التي تظهر لعملاء اليمن تلقائياً.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-muted)] p-1 rounded-2xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setChannelTab('sa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                channelTab === 'sa'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🇸🇦</span> السعودية وبقية العالم
            </button>
            <button
              type="button"
              onClick={() => setChannelTab('ye')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                channelTab === 'ye'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🇾🇪</span> منطقة اليمن
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
              <MessageCircle size={14} className="text-[#1F8A54]" /> رقم واتساب ({channelTab === 'ye' ? 'اليمن' : 'السعودية'})
            </label>
            <input
              type="text"
              value={activeChannels.whatsapp}
              onChange={e => updateActiveChannels({ whatsapp: e.target.value })}
              placeholder={channelTab === 'ye' ? '967771111357' : '966593672193'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54] font-mono"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
              <Mail size={14} className="text-[#6366f1]" /> البريد الإلكتروني ({channelTab === 'ye' ? 'اليمن' : 'السعودية'})
            </label>
            <input
              type="email"
              value={activeChannels.email}
              onChange={e => updateActiveChannels({ email: e.target.value })}
              placeholder={channelTab === 'ye' ? 'alsmh655@gmail.com' : 'hello@wepstep.com'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
              <Phone size={14} className="text-[#1F8A54]" /> الهاتف المباشر المعروض
            </label>
            <input
              type="text"
              value={activeChannels.phone}
              onChange={e => updateActiveChannels({ phone: e.target.value })}
              placeholder={channelTab === 'ye' ? '+967 771 111 357' : '+966 59 367 2193'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" /> موقع المقر / المدينة
            </label>
            <input
              type="text"
              value={activeChannels.address}
              onChange={e => updateActiveChannels({ address: e.target.value })}
              placeholder={channelTab === 'ye' ? 'صنعاء، الجمهورية اليمنية' : 'الرياض، المملكة العربية السعودية'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" /> نص شارة سرعة الرد
            </label>
            <input
              type="text"
              value={activeChannels.responseTimeText}
              onChange={e => updateActiveChannels({ responseTimeText: e.target.value })}
              placeholder="متوسط زمن الاستجابة: أقل من ساعتين"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">أوقات العمل (الأيام العادية)</label>
            <input
              type="text"
              value={activeChannels.workingHoursWeekday}
              onChange={e => updateActiveChannels({ workingHoursWeekday: e.target.value })}
              placeholder={channelTab === 'ye' ? 'السبت – الخميس: ٩ص – ٩م' : 'الأحد – الخميس: ٩ص – ٨م'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">أوقات العمل (نهاية الأسبوع)</label>
            <input
              type="text"
              value={activeChannels.workingHoursWeekend}
              onChange={e => updateActiveChannels({ workingHoursWeekend: e.target.value })}
              placeholder={channelTab === 'ye' ? 'الجمعة: مغلق' : 'الجمعة: ٢م – ٦م'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]"
            />
          </div>
        </div>
      </div>

      {/* ── FAQs Section ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
              <HelpCircle size={18} className="text-[#1F8A54]" /> الأسئلة الشائعة (FAQ) ({data.faqs.length})
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">تظهر هذه الأسئلة للمستخدمين في أسفل صفحة تواصل معنا بشكل تفاعلي.</p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="px-3 py-1.5 rounded-xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-black flex items-center gap-1.5 hover:bg-[#1F8A54]/20 transition-colors"
          >
            <Plus size={14} /> إضافة سؤال جديد
          </button>
        </div>

        <div className="space-y-4">
          {data.faqs.map((f, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2 relative group">
              <div className="flex items-center justify-between gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#1F8A54]/15 text-[#1F8A54] text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder="نص السؤال..."
                  value={f.q}
                  onChange={e => {
                    const updated = [...data.faqs]
                    updated[idx].q = e.target.value
                    setData({ ...data, faqs: updated })
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-black outline-none focus:border-[#1F8A54]"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="text-red-500/60 hover:text-red-500 p-2 transition-colors"
                  title="حذف السؤال"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="الإجابة الشاملة على السؤال..."
                value={f.a}
                onChange={e => {
                  const updated = [...data.faqs]
                  updated[idx].a = e.target.value
                  setData({ ...data, faqs: updated })
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] outline-none focus:border-[#1F8A54] resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Link to Messages ── */}
      <div className="p-5 rounded-2xl border border-[#1F8A54]/20 bg-[#1F8A54]/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F8A54] text-white flex items-center justify-center">
            <MessageCircle size={18} />
          </div>
          <div>
            <div className="text-sm font-black text-[var(--text-primary)]">صندوق رسائل واستفسارات التواصل</div>
            <div className="text-xs text-[var(--text-muted)]">الاطلاع على الرسائل والطلبات الواردة مباشرة من نموذج صفحة التواصل في Supabase.</div>
          </div>
        </div>
        <Link
          href="/admin/messages"
          className="px-4 py-2 rounded-xl bg-[#1F8A54] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#1F8A54]/25 hover:opacity-90"
        >
          فتح صندوق الرسائل <ArrowUpRight size={14} />
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
