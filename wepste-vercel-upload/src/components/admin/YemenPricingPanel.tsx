'use client'

import Link from 'next/link'
import { ExternalLink, MapPin, DollarSign, Check, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface YemenPricingEntry {
  label: string
  sarPrice: string | number
  yerPrice: string | number
}

interface YemenPricingPanelProps {
  serviceKey: string
  entries?: YemenPricingEntry[]
  sectionLabel?: string
}

const PACKAGE_LABELS: Record<string, string> = {
  landing_starter: 'صفحة هبوط سريعة',
  landing_pro: 'صفحة هبوط إعلانية احترافية',
  web_starter: 'موقع ويب - الباقة الأساسية',
  web_advanced: 'موقع ويب - الباقة المتقدمة',
  web_business: 'موقع ويب - الباقة الاحترافية',
  web_elite: 'موقع ويب - باقة إيليت المخصصة',
  apps_starter: 'تطبيق جوال - باقة الانطلاق',
  apps_business: 'تطبيق جوال - باقة الأعمال',
  apps_pro: 'تطبيق جوال - منظومة متكاملة',
  apps_mvp: 'تطبيق جوال - نموذج أولي MVP',
  ecommerce_starter: 'متجر إلكتروني متكامل',
  ecommerce_growth: 'متجر إلكتروني - باقة النمو',
  design_uiux: 'تصميم واجهات وتجربة UI/UX',
  design_identity: 'تصميم هوية بصرية كاملة',
  systems_cloud: 'أنظمة سحابية مخصصة SaaS',
  support_monthly: 'صيانة ودعم فني دوري',
}

export default function YemenPricingPanel({ serviceKey, entries, sectionLabel }: YemenPricingPanelProps) {
  const [geoSettings, setGeoSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [localPrices, setLocalPrices] = useState<Record<string, { sar: number; yer: number }>>({})

  const loadSettings = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/public/geo')
      const d = await r.json()
      const settings = d.settings || d
      setGeoSettings(settings)
      if (settings?.pricing?.customPackagePrices) {
        setLocalPrices(settings.pricing.customPackagePrices)
      }
    } catch {
      setError('تعذر تحميل إعدادات الأسعار الجغرافية')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  // Filter package keys that match this serviceKey
  const relevantPackageKeys = Object.keys(PACKAGE_LABELS).filter(k => {
    if (serviceKey === 'web') return k.startsWith('web_')
    if (serviceKey === 'apps') return k.startsWith('apps_')
    if (serviceKey === 'landing') return k.startsWith('landing_')
    if (serviceKey === 'ecommerce') return k.startsWith('ecommerce_')
    if (serviceKey === 'design' || serviceKey === 'designs') return k.startsWith('design_')
    if (serviceKey === 'systems') return k.startsWith('systems_')
    if (serviceKey === 'support') return k.startsWith('support_')
    return k.startsWith(`${serviceKey}_`)
  })

  const rate = geoSettings?.pricing?.yerExchangeRate || 450

  const handlePriceChange = (pkgKey: string, field: 'sar' | 'yer', value: number) => {
    setLocalPrices(prev => {
      const current = prev[pkgKey] || { sar: 0, yer: 0 }
      return {
        ...prev,
        [pkgKey]: {
          ...current,
          [field]: value,
          // auto compute YER if SAR changed and no manual YER
          ...(field === 'sar' ? { yer: value * rate } : {}),
        },
      }
    })
  }

  const handleSavePrices = async () => {
    if (!geoSettings) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const updatedSettings = {
        ...geoSettings,
        pricing: {
          ...geoSettings.pricing,
          customPackagePrices: {
            ...(geoSettings.pricing?.customPackagePrices || {}),
            ...localPrices,
          },
        },
      }
      const res = await fetch('/api/admin/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })
      if (!res.ok) throw new Error('فشل حفظ أسعار اليمن')
      setNotice('تم حفظ أسعار اليمن بنجاح في قاعدة البيانات!')
      setGeoSettings(updatedSettings)
      setTimeout(() => setNotice(''), 4000)
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-5 rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 dark:border-emerald-700/50 space-y-4 shadow-sm" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
            <MapPin size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                تسعير اليمن المخصص {sectionLabel ? `— ${sectionLabel}` : ''}
              </h3>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                🇾🇪 ريال يمني (ر.ي)
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              تظهر هذه الأسعار تلقائياً للزوار والمتصفحين من اليمن بناءً على الدولة. معامل التحويل الحالي: 1 ر.س = {rate.toLocaleString('ar-YE')} ر.ي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/geo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100/60 transition"
          >
            إعدادات التخصيص الجغرافي <ExternalLink size={12} />
          </Link>
          <button
            type="button"
            onClick={handleSavePrices}
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <DollarSign size={13} />}
            حفظ أسعار اليمن
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-900/40 p-2.5 rounded-xl">
          <Check size={14} className="text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="text-xs font-bold text-red-600 bg-red-100/70 p-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Relevant Packages Grid */}
      {relevantPackageKeys.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {relevantPackageKeys.map(pkgKey => {
            const label = PACKAGE_LABELS[pkgKey]
            const entry = localPrices[pkgKey] || { sar: 0, yer: 0 }
            return (
              <div
                key={pkgKey}
                className="p-3.5 rounded-xl bg-white/90 dark:bg-black/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-emerald-950 dark:text-emerald-100">{label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block mb-1">السعودية والعالم (ر.س)</span>
                    <input
                      type="number"
                      value={entry.sar || ''}
                      onChange={e => handlePriceChange(pkgKey, 'sar', Number(e.target.value) || 0)}
                      placeholder="السعر ر.س"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold font-mono outline-none focus:border-emerald-500"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">اليمن (ر.ي)</span>
                    <input
                      type="number"
                      value={entry.yer || ''}
                      onChange={e => handlePriceChange(pkgKey, 'yer', Number(e.target.value) || 0)}
                      placeholder="السعر ر.ي"
                      className="w-full rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/40 px-2.5 py-1.5 text-xs font-black font-mono text-emerald-700 dark:text-emerald-200 outline-none focus:border-emerald-600"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Manual entries if passed */}
      {entries && entries.length > 0 && (
        <div className="space-y-2 pt-2">
          {entries.map((e, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-100 dark:border-emerald-800 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-100">{e.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--text-muted)]">🇸🇦 {typeof e.sarPrice === 'number' ? `${e.sarPrice.toLocaleString('ar-SA')} ر.س` : e.sarPrice}</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">🇾🇪 {typeof e.yerPrice === 'number' ? `${e.yerPrice.toLocaleString('ar-YE')} ر.ي` : e.yerPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
