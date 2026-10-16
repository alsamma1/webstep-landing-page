'use client'

import { useState, useEffect } from 'react'
import {
  Globe, Save, RefreshCw, CheckCircle2, AlertCircle, Phone, Mail,
  Coins, Image as ImageIcon, Share2, MapPin, Building, Flag, ArrowLeftRight,
  Sparkles, Layers
} from 'lucide-react'
import type { GeoSettings, RegionCode } from '@/lib/geo'
import { DEFAULT_GEO_SETTINGS } from '@/lib/geo'

export default function AdminGeoPage() {
  const [settings, setSettings] = useState<GeoSettings>(DEFAULT_GEO_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'contacts' | 'pricing' | 'images' | 'seo'>('contacts')
  const [calculatorSar, setCalculatorSar] = useState<number>(1000)

  // Fetch settings from API
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/geo')
      if (!res.ok) throw new Error('فشل تحميل الإعدادات الجغرافية')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'حدث خطأ في جلب البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSaveSuccess(false)

      const res = await fetch('/api/admin/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'فشل حفظ الإعدادات')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'تعذر حفظ التغييرات')
    } finally {
      setSaving(false)
    }
  }

  const calculatedYer = Math.round(calculatorSar * (settings.pricing.yerExchangeRate || 450))

  return (
    <div className="space-y-8 pb-16" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Globe size={26} />
            </span>
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)]">
                التخصيص الجغرافي والأسعار الإقليمية
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                تخصيص كامل لأرقام التواصل، العملات، الأسعار، وصور الصفحة الرئيسية لكل من اليمن والسعودية/العالم
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            تحديث
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-950/20 transition disabled:opacity-50"
          >
            <Save size={14} className={saving ? 'animate-spin' : ''} />
            {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold">
          <CheckCircle2 size={18} />
          <span>تم حفظ الإعدادات بنجاح وتحديث قاعدة البيانات! التغييرات تظهر فوراً لزوار الموقع.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition shrink-0 ${
            activeTab === 'contacts'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
          }`}
        >
          <Phone size={15} />
          بيانات التواصل والمواقع (اليمن / السعودية)
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition shrink-0 ${
            activeTab === 'pricing'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
          }`}
        >
          <Coins size={15} />
          العملات وتحويل الأسعار (YER & SAR)
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition shrink-0 ${
            activeTab === 'images'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
          }`}
        >
          <ImageIcon size={15} />
          صور الصفحة الرئيسية الجغرافية
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition shrink-0 ${
            activeTab === 'seo'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
          }`}
        >
          <Share2 size={15} />
          السيو وشبكات التواصل والنطاق
        </button>
      </div>

      {/* ─── TAB 1: Contacts ─── */}
      {activeTab === 'contacts' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Yemen Settings */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇾🇪</span>
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)]">بيانات منطقة اليمن</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">تظهر تلقائياً للزوار من اليمن أو عند اختيارها</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600">
                ريال يمني (ر.ي)
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الهاتف (الرقم الخام للاتصال والواتساب)
                </label>
                <input
                  type="text"
                  value={settings.yemen.phone}
                  onChange={e => setSettings({
                    ...settings,
                    yemen: { ...settings.yemen, phone: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="771111357"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الهاتف المعروض (العرض البصري)
                </label>
                <input
                  type="text"
                  value={settings.yemen.phoneFormatted}
                  onChange={e => setSettings({
                    ...settings,
                    yemen: { ...settings.yemen, phoneFormatted: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="+967 771 111 357"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الواتساب مع المفتاح الدولي
                </label>
                <input
                  type="text"
                  value={settings.yemen.whatsapp}
                  onChange={e => setSettings({
                    ...settings,
                    yemen: { ...settings.yemen, whatsapp: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="967771111357"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  البريد الإلكتروني لليمن
                </label>
                <input
                  type="email"
                  value={settings.yemen.email}
                  onChange={e => setSettings({
                    ...settings,
                    yemen: { ...settings.yemen, email: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="alsmh655@gmail.com"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">المدينة</label>
                  <input
                    type="text"
                    value={settings.yemen.city}
                    onChange={e => setSettings({
                      ...settings,
                      yemen: { ...settings.yemen, city: e.target.value }
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="صنعاء"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">رمز العملة</label>
                  <input
                    type="text"
                    value={settings.yemen.currency}
                    onChange={e => setSettings({
                      ...settings,
                      yemen: { ...settings.yemen, currency: e.target.value }
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="ر.ي"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">العنوان الكامل</label>
                <input
                  type="text"
                  value={settings.yemen.address}
                  onChange={e => setSettings({
                    ...settings,
                    yemen: { ...settings.yemen, address: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="صنعاء، الجمهورية اليمنية"
                />
              </div>
            </div>
          </div>

          {/* Saudi Arabia / Global Settings */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇸🇦</span>
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)]">بيانات السعودية والعالم</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">تظهر تلقائياً للزوار من السعودية وبقية دول العالم</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-600">
                ريال سعودي (ر.س)
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الهاتف (الرقم المعتمد)
                </label>
                <input
                  type="text"
                  value={settings.saudi.phone}
                  onChange={e => setSettings({
                    ...settings,
                    saudi: { ...settings.saudi, phone: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="+966593672193"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الهاتف المعروض (العرض البصري)
                </label>
                <input
                  type="text"
                  value={settings.saudi.phoneFormatted}
                  onChange={e => setSettings({
                    ...settings,
                    saudi: { ...settings.saudi, phoneFormatted: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="+966 59 367 2193"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رقم الواتساب مع المفتاح الدولي
                </label>
                <input
                  type="text"
                  value={settings.saudi.whatsapp}
                  onChange={e => setSettings({
                    ...settings,
                    saudi: { ...settings.saudi, whatsapp: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="966593672193"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  البريد الإلكتروني الرسمي
                </label>
                <input
                  type="email"
                  value={settings.saudi.email}
                  onChange={e => setSettings({
                    ...settings,
                    saudi: { ...settings.saudi, email: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="hello@wepstep.com"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">المدينة</label>
                  <input
                    type="text"
                    value={settings.saudi.city}
                    onChange={e => setSettings({
                      ...settings,
                      saudi: { ...settings.saudi, city: e.target.value }
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="الرياض"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">رمز العملة</label>
                  <input
                    type="text"
                    value={settings.saudi.currency}
                    onChange={e => setSettings({
                      ...settings,
                      saudi: { ...settings.saudi, currency: e.target.value }
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="ر.س"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">العنوان الكامل</label>
                <input
                  type="text"
                  value={settings.saudi.address}
                  onChange={e => setSettings({
                    ...settings,
                    saudi: { ...settings.saudi, address: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)]"
                  placeholder="الرياض، المملكة العربية السعودية"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Pricing ─── */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Exchange Rate Card */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-amber-500" />
                <h3 className="text-sm font-black text-[var(--text-primary)]">معامل تحويل الريال اليمني</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                سعر صرف 1 ريال سعودي مقابل الريال اليمني. يُستخدم لتحويل أسعار الباقات والخدمات فوراً عند تصفح زوار اليمن.
              </p>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                  1 ريال سعودي = (بالريال اليمني)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.pricing.yerExchangeRate}
                    onChange={e => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, yerExchangeRate: Number(e.target.value) || 450 }
                    })}
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-base font-black text-[var(--text-primary)] font-mono"
                    min="1"
                    dir="ltr"
                  />
                  <span className="text-xs font-bold text-[var(--text-muted)]">ر.ي</span>
                </div>
              </div>
            </div>

            {/* Quick Live Calculator */}
            <div className="lg:col-span-2 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-emerald-600" />
                <h3 className="text-sm font-black text-[var(--text-primary)]">حاسبة تسعير فورية للمعاينة</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                جرب إدخال أي سعر بالريال السعودي لترى كيف يظهر مباشرة للعميل في اليمن:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    السعر بالسعودي (ر.س)
                  </label>
                  <input
                    type="number"
                    value={calculatorSar}
                    onChange={e => setCalculatorSar(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-black text-[var(--text-primary)] font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block">السعر المعادل في اليمن</span>
                  <div className="text-xl font-black text-emerald-600 mt-0.5">
                    {calculatedYer.toLocaleString('ar-YE')} <span className="text-xs font-bold">ر.ي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Custom Package Prices */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <h3 className="text-sm font-black text-[var(--text-primary)]">
              تخصيص أسعار الباقات اليدوي (اختياري)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              إذا كنت تفضل تثبيت سعر معين لباقة معينة في اليمن بدلاً من التحويل الحسابي، يمكنك تعديله هنا:
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'landing_starter', label: 'صفحة هبوط سريعة', defaultSar: 1000, defaultYer: 450000 },
                { key: 'landing_pro', label: 'صفحة هبوط إعلانية احترافية', defaultSar: 2200, defaultYer: 990000 },
                { key: 'web_starter', label: 'موقع ويب - الباقة الأساسية', defaultSar: 300, defaultYer: 135000 },
                { key: 'web_advanced', label: 'موقع ويب - الباقة المتقدمة', defaultSar: 700, defaultYer: 315000 },
                { key: 'web_business', label: 'موقع ويب - الباقة الاحترافية', defaultSar: 1000, defaultYer: 450000 },
                { key: 'web_elite', label: 'موقع ويب - باقة إيليت المخصصة', defaultSar: 2000, defaultYer: 900000 },
                { key: 'apps_starter', label: 'تطبيق جوال - باقة الانطلاق', defaultSar: 1000, defaultYer: 450000 },
                { key: 'apps_business', label: 'تطبيق جوال - باقة الأعمال', defaultSar: 2500, defaultYer: 1125000 },
                { key: 'apps_pro', label: 'تطبيق جوال - منظومة متكاملة', defaultSar: 5000, defaultYer: 2250000 },
                { key: 'ecommerce_starter', label: 'متجر إلكتروني متكامل', defaultSar: 3000, defaultYer: 1350000 },
                { key: 'design_uiux', label: 'تصميم واجهات وتجربة UI/UX', defaultSar: 1500, defaultYer: 675000 },
                { key: 'design_identity', label: 'تصميم هوية بصرية كاملة', defaultSar: 800, defaultYer: 360000 },
                { key: 'systems_cloud', label: 'أنظمة سحابية مخصصة SaaS', defaultSar: 6500, defaultYer: 2925000 },
                { key: 'support_monthly', label: 'صيانة ودعم فني دوري', defaultSar: 500, defaultYer: 225000 },
              ].map(pkg => {
                const custom = settings.pricing.customPackagePrices?.[pkg.key]
                const sarVal = custom?.sar ?? pkg.defaultSar
                const yerVal = custom?.yer ?? pkg.defaultYer

                return (
                  <div key={pkg.key} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2">
                    <div className="font-bold text-xs text-[var(--text-primary)]">{pkg.label}</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block">السعودية (ر.س)</span>
                        <input
                          type="number"
                          value={sarVal}
                          onChange={e => {
                            const newSar = Number(e.target.value) || 0
                            setSettings({
                              ...settings,
                              pricing: {
                                ...settings.pricing,
                                customPackagePrices: {
                                  ...(settings.pricing.customPackagePrices || {}),
                                  [pkg.key]: { sar: newSar, yer: yerVal },
                                },
                              },
                            })
                          }}
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 font-mono text-xs font-bold"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block">اليمن (ر.ي مستقل)</span>
                        <input
                          type="number"
                          value={yerVal}
                          onChange={e => {
                            const newYer = Number(e.target.value) || 0
                            setSettings({
                              ...settings,
                              pricing: {
                                ...settings.pricing,
                                customPackagePrices: {
                                  ...(settings.pricing.customPackagePrices || {}),
                                  [pkg.key]: { sar: sarVal, yer: newYer },
                                },
                              },
                            })
                          }}
                          className="w-full rounded-lg border border-emerald-500/30 bg-[var(--surface)] px-2 py-1.5 font-mono text-xs font-black text-emerald-700"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: Images ─── */}
      {activeTab === 'images' && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">
              صور الصفحة الرئيسية حسب الموقع الجغرافي
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              اختر مسار أو رابط الصورة التي تظهر في كل قسم عندما يتصفح الزائر من اليمن، أو عندما يتصفح من السعودية وبقية العالم.
            </p>
          </div>

          <div className="space-y-6 text-xs">
            {/* 1. Hero Badge Text */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3">
              <div className="font-black text-xs text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-600" />
                شارة الهيرو العلوية (Hero Badge)
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇾🇪 نص الشارة لزوار اليمن
                  </label>
                  <input
                    type="text"
                    value={settings.images.heroBadge?.ye || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        heroBadge: { ...settings.images.heroBadge, ye: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="حلول رقمية متقدمة في اليمن وبأفضل الأسعار"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇸🇦 نص الشارة للسعودية والعالم
                  </label>
                  <input
                    type="text"
                    value={settings.images.heroBadge?.sa || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        heroBadge: { ...settings.images.heroBadge, sa: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)]"
                    placeholder="حلول رقمية عصرية وذكية للسوق السعودي والخليجي"
                  />
                </div>
              </div>
            </div>

            {/* 2. Hero Logo */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3">
              <div className="font-black text-xs text-[var(--text-primary)]">
                شعار الهيرو (المرحلة 0)
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇾🇪 صورة الشعار لليمن
                  </label>
                  <input
                    type="text"
                    value={settings.images.heroLogo?.ye || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        heroLogo: { ...settings.images.heroLogo, ye: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                    placeholder="/assets/logo/logo.png"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇸🇦 صورة الشعار للسعودية والعالم
                  </label>
                  <input
                    type="text"
                    value={settings.images.heroLogo?.sa || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        heroLogo: { ...settings.images.heroLogo, sa: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                    placeholder="/assets/logo/logo.png"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* 3. Hero Characters Stages 1, 2, 3 */}
            {[
              { key: 'heroStage1', label: 'المرحلة 1: شخصية مرحباً بك (Stage 1)' },
              { key: 'heroStage2', label: 'المرحلة 2: شخصية خدماتنا (Stage 2)' },
              { key: 'heroStage3', label: 'المرحلة 3: الشخصية الثابتة (Stage 3)' },
            ].map(stage => {
              const current = (settings.images as any)[stage.key] as { ye?: string; sa?: string } | undefined
              return (
                <div key={stage.key} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3">
                  <div className="font-black text-xs text-[var(--text-primary)]">{stage.label}</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                        🇾🇪 صورة اليمن
                      </label>
                      <input
                        type="text"
                        value={current?.ye || ''}
                        onChange={e => setSettings({
                          ...settings,
                          images: {
                            ...settings.images,
                            [stage.key]: { ...(current || {}), ye: e.target.value },
                          },
                        })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                        placeholder="/assets/1.png"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                        🇸🇦 صورة السعودية والعالم
                      </label>
                      <input
                        type="text"
                        value={current?.sa || ''}
                        onChange={e => setSettings({
                          ...settings,
                          images: {
                            ...settings.images,
                            [stage.key]: { ...(current || {}), sa: e.target.value },
                          },
                        })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                        placeholder="/assets/1.png"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* 4. About & Features Sections */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3">
              <div className="font-black text-xs text-[var(--text-primary)]">
                صورة قسم من نحن ورؤيتنا (About Section)
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇾🇪 صورة اليمن
                  </label>
                  <input
                    type="text"
                    value={settings.images.aboutImage?.ye || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        aboutImage: { ...settings.images.aboutImage, ye: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                    placeholder="/assets/logo/logo.png"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    🇸🇦 صورة السعودية والعالم
                  </label>
                  <input
                    type="text"
                    value={settings.images.aboutImage?.sa || ''}
                    onChange={e => setSettings({
                      ...settings,
                      images: {
                        ...settings.images,
                        aboutImage: { ...settings.images.aboutImage, sa: e.target.value },
                      },
                    })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                    placeholder="/assets/logo/logo.png"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: SEO & Social ─── */}
      {activeTab === 'seo' && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">
              إعدادات السيو والروابط الرسمية
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              الروابط الرسمية المعتمدة لمحركات البحث ومخططات Schema.org التلقائية.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--text-secondary)] mb-1">
                رابط الموقع الرسمي (Canonical URL)
              </label>
              <input
                type="text"
                value={settings.siteUrl}
                onChange={e => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                placeholder="https://wepstep.com"
                dir="ltr"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                يتم استخدامه في جميع عناوين Canonical وملفات sitemap.xml وrobots.txt ومخططات Google Schema.
              </span>
            </div>

            <div>
              <label className="block font-bold text-[var(--text-secondary)] mb-1">
                رابط حساب إنستقرام الرسمي
              </label>
              <input
                type="text"
                value={settings.social.instagram}
                onChange={e => setSettings({
                  ...settings,
                  social: { ...settings.social, instagram: e.target.value }
                })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                placeholder="https://instagram.com/wepstep"
                dir="ltr"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                اليوزر المعتمد: <strong>wepstep</strong>
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رابط حساب تويتر (X)
                </label>
                <input
                  type="text"
                  value={settings.social.twitter || ''}
                  onChange={e => setSettings({
                    ...settings,
                    social: { ...settings.social, twitter: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="https://twitter.com/wepstep"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">
                  رابط صفحة لينكد إن
                </label>
                <input
                  type="text"
                  value={settings.social.linkedin || ''}
                  onChange={e => setSettings({
                    ...settings,
                    social: { ...settings.social, linkedin: e.target.value }
                  })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-[var(--text-primary)] font-mono"
                  placeholder="https://linkedin.com/company/wepstep"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
