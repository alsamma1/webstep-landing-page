'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Save, Send, Eye, DollarSign, MessageCircle, ShoppingBag, Plus, Trash2,
  CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, RefreshCw, Layers
} from 'lucide-react'
import type { OrderPageData } from '@/lib/company-pages-types'

const SERVICE_LABELS: Record<string, string> = {
  web: 'تطوير المواقع الإلكترونية',
  apps: 'تطبيقات الجوال (iOS / Android)',
  design: 'تصميم UI/UX والهويات',
  landing: 'صفحات الهبوط الإعلانية',
  ecommerce: 'المتاجر الإلكترونية',
  systems: 'الأنظمة الرقمية وSaaS',
}

export default function AdminOrderSettingsPage() {
  const [data, setData] = useState<OrderPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newTierInputs, setNewTierInputs] = useState<Record<string, string>>({})
  const [regionTab, setRegionTab] = useState<'sa' | 'ye'>('sa')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/order-settings')
      const json = await res.json()
      setData(json)
    } catch {
      setMessage({ type: 'error', text: 'تعذر تحميل إعدادات صفحة تقديم الطلب' })
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
      const res = await fetch('/api/admin/order-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'فشل الحفظ')
      setMessage({ type: 'success', text: 'تم حفظ إعدادات ونموذج الطلب في Supabase بنجاح! 🎉' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء الحفظ' })
    }
    setSaving(false)
  }

  const addTier = (serviceKey: string) => {
    const inputKey = `${regionTab}_${serviceKey}`
    const val = (newTierInputs[inputKey] || '').trim()
    if (!val || !data) return
    if (regionTab === 'ye') {
      setData({
        ...data,
        yemenBudgetTiers: {
          ...(data.yemenBudgetTiers || {}),
          [serviceKey]: [...((data.yemenBudgetTiers || {})[serviceKey] || []), val],
        },
      })
    } else {
      setData({
        ...data,
        budgetTiers: {
          ...data.budgetTiers,
          [serviceKey]: [...(data.budgetTiers[serviceKey] || []), val],
        },
      })
    }
    setNewTierInputs({ ...newTierInputs, [inputKey]: '' })
  }

  const removeTier = (serviceKey: string, index: number) => {
    if (!data) return
    if (regionTab === 'ye') {
      const tiers = (data.yemenBudgetTiers || {})[serviceKey] || []
      setData({
        ...data,
        yemenBudgetTiers: {
          ...(data.yemenBudgetTiers || {}),
          [serviceKey]: tiers.filter((_, i) => i !== index),
        },
      })
    } else {
      setData({
        ...data,
        budgetTiers: {
          ...data.budgetTiers,
          [serviceKey]: data.budgetTiers[serviceKey].filter((_, i) => i !== index),
        },
      })
    }
  }

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-sm font-bold text-[var(--text-muted)] flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin text-[#1F8A54]" /> جاري تحميل إعدادات صفحة الطلب من Supabase...
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 text-right pb-16" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#1F8A54]/10 text-[#1F8A54] mb-1">
            <Send size={14} /> إدارة نموذج وتقديم الطلبات
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">صفحة تقديم طلب مشروع (/order)</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            تحكّم في فئات ميزانيات الخدمات، أرقام تحويل الواتساب، والرسائل الترحيبية المخزنة في Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/order"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Eye size={15} /> معاينة صفحة الطلب الحية
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

      {/* ── Region Tabs ── */}
      <div className="flex gap-2 p-1 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] w-fit">
        <button
          type="button"
          onClick={() => setRegionTab('sa')}
          className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${regionTab === 'sa' ? 'bg-[var(--surface)] shadow text-[#1F8A54]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          🇸🇦 السعودية وبقية العالم
        </button>
        <button
          type="button"
          onClick={() => setRegionTab('ye')}
          className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${regionTab === 'ye' ? 'bg-[var(--surface)] shadow text-emerald-700' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          🇾🇪 منطقة اليمن
        </button>
      </div>

      {/* ── General & WhatsApp Settings ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles size={18} className="text-[#1F8A54]" /> إعدادات التوجيه والترحيب
          {regionTab === 'ye' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">منطقة اليمن</span>}
        </h2>
        {regionTab === 'sa' ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الشارة العلوية (Badge)</label>
              <input type="text" value={data.hero.badge}
                onChange={e => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block flex items-center gap-1.5">
                <MessageCircle size={14} className="text-[#1F8A54]" /> واتساب استقبال الطلبات (السعودية)
              </label>
              <input type="text" value={data.whatsappNumber}
                onChange={e => setData({ ...data, whatsappNumber: e.target.value })}
                placeholder="966593672193" dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]" />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-emerald-700 mb-1 block flex items-center gap-1.5">
                <MessageCircle size={14} className="text-emerald-600" /> واتساب استقبال الطلبات (اليمن)
              </label>
              <input type="text" value={data.yemenWhatsappNumber || ''}
                onChange={e => setData({ ...data, yemenWhatsappNumber: e.target.value })}
                placeholder="967771111357" dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-emerald-500">✓</span> عنوان الصفحة وشارتها مشتركة لكلا المنطقتين
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">عنوان الصفحة</label>
          <input type="text" value={data.hero.title}
            onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]" />
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">الوصف الإرشادي</label>
          <textarea rows={2} value={data.hero.subtitle}
            onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54] resize-none" />
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">
            {regionTab === 'ye' ? 'نص شارة العرض الخاص لليمن' : 'نص شارة الخصم / العرض الخاص'}
          </label>
          {regionTab === 'sa' ? (
            <input type="text" value={data.discountNotice}
              onChange={e => setData({ ...data, discountNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm outline-none focus:border-[#1F8A54]" />
          ) : (
            <input type="text" value={data.yemenDiscountNotice || ''}
              onChange={e => setData({ ...data, yemenDiscountNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 text-sm outline-none focus:border-emerald-500" />
          )}
        </div>
      </div>

      {/* ── Budget Tiers by Service ── */}
      <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
        <div>
          <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
            <DollarSign size={18} className="text-[#1F8A54]" />
            {regionTab === 'ye' ? 'فئات الميزانيات لليمن (ر.ي)' : 'فئات الميزانيات المقترحة (ر.س)'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {regionTab === 'ye'
              ? 'تظهر هذه الخيارات بالريال اليمني للمستخدمين في اليمن فقط.'
              : 'تظهر هذه الخيارات للمستخدمين في السعودية وبقية دول العالم.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(SERVICE_LABELS).map(([key, label]) => {
            const inputKey = `${regionTab}_${key}`
            const tiers = regionTab === 'ye'
              ? ((data.yemenBudgetTiers || {})[key] || [])
              : (data.budgetTiers[key] || [])
            return (
              <div key={key} className={`p-4 rounded-2xl border bg-[var(--bg-muted)] space-y-3 ${regionTab === 'ye' ? 'border-emerald-200' : 'border-[var(--border)]'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                    <Layers size={14} className={regionTab === 'ye' ? 'text-emerald-600' : 'text-[#1F8A54]'} /> {label}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">{tiers.length} خيارات</span>
                </div>

                <div className="space-y-1.5">
                  {tiers.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{t}</span>
                      <button type="button" onClick={() => removeTier(key, idx)}
                        className="text-red-500/60 hover:text-red-500 transition-colors" title="حذف الخيار">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input type="text"
                    placeholder={regionTab === 'ye' ? 'مثال: ١٥٠,٠٠٠ – ٣٠٠,٠٠٠ ر.ي' : 'مثال: ١,٠٠٠ – ٣,٠٠٠ ر.س'}
                    value={newTierInputs[inputKey] || ''}
                    onChange={e => setNewTierInputs({ ...newTierInputs, [inputKey]: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTier(key) } }}
                    className={`flex-1 px-3 py-1.5 rounded-xl border bg-[var(--surface)] text-xs outline-none ${regionTab === 'ye' ? 'border-emerald-300 focus:border-emerald-500' : 'border-[var(--border)] focus:border-[#1F8A54]'}`} />
                  <button type="button" onClick={() => addTier(key)}
                    className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold hover:opacity-90 ${regionTab === 'ye' ? 'bg-emerald-600' : 'bg-[#1F8A54]'}`}>
                    إضافة
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Link to Orders Inbox ── */}
      <div className="p-5 rounded-2xl border border-[#1F8A54]/20 bg-[#1F8A54]/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F8A54] text-white flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="text-sm font-black text-[var(--text-primary)]">متابعة الطلبات المستلمة (Orders Inbox)</div>
            <div className="text-xs text-[var(--text-muted)]">إدارة حالات الطلبات، تحديث الملاحظات، وفرز طلبات المشاريع في Supabase.</div>
          </div>
        </div>
        <Link href="/admin/orders"
          className="px-4 py-2 rounded-xl bg-[#1F8A54] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#1F8A54]/25 hover:opacity-90">
          الانتقال لجدول الطلبات <ArrowUpRight size={14} />
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
