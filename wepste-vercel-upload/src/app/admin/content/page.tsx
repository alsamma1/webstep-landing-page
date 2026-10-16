'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Save, Eye, ExternalLink, ArrowUp, ArrowDown, Monitor, Tablet,
  Smartphone, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw,
  Sparkles, Layers, Sliders, ChevronDown, ChevronUp, Image as ImageIcon,
  Check, X, MoveUp, MoveDown, EyeOff
} from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'
import {
  DEFAULT_HOMEPAGE_DATA,
  type HomepageData,
  type SectionMeta,
  type DeviceVisibility
} from '@/lib/homepage-types'

export default function AdminHomepageContentPage() {
  const [data, setData] = useState<HomepageData>(DEFAULT_HOMEPAGE_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<
    'order' | 'hero' | 'services_exp' | 'story' | 'process' | 'services_nav' | 'stats_feat' | 'portfolio'
  >('order')
  const [regionTab, setRegionTab] = useState<'sa' | 'ye'>('sa')

  // Load from API
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/homepage')
      const json = await res.json()
      if (json && !json.error) {
        setData(json)
      }
    } catch (err: any) {
      console.error('Failed to load homepage content:', err)
      setMessage({ type: 'error', text: 'تعذر تحميل المحتوى من السيرفر' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Save to API
  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        throw new Error(result.error || 'فشل حفظ التعديلات')
      }
      setMessage({ type: 'success', text: result.message || 'تم حفظ جميع التعديلات بنجاح في Supabase' })
    } catch (err: any) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء الحفظ' })
    } finally {
      setSaving(false)
    }
  }

  // ── Reorder Sections ──
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...data.sectionOrder]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newOrder.length) return

    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIdx]
    newOrder[targetIdx] = temp

    setData(prev => ({ ...prev, sectionOrder: newOrder }))
  }

  const toggleSectionEnabled = (sectionId: string) => {
    setData(prev => {
      const curr = prev.sectionsMeta[sectionId] || {
        id: sectionId,
        label: sectionId,
        enabled: true,
        visibility: { desktop: true, tablet: true, mobile: true },
      }
      return {
        ...prev,
        sectionsMeta: {
          ...prev.sectionsMeta,
          [sectionId]: { ...curr, enabled: !curr.enabled },
        },
      }
    })
  }

  const toggleDeviceVisibility = (sectionId: string, device: keyof DeviceVisibility) => {
    setData(prev => {
      const curr = prev.sectionsMeta[sectionId] || {
        id: sectionId,
        label: sectionId,
        enabled: true,
        visibility: { desktop: true, tablet: true, mobile: true },
      }
      return {
        ...prev,
        sectionsMeta: {
          ...prev.sectionsMeta,
          [sectionId]: {
            ...curr,
            visibility: {
              ...curr.visibility,
              [device]: !curr.visibility[device],
            },
          },
        },
      }
    })
  }

  // Helper to reorder any array
  const moveArrayItem = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= arr.length) return arr
    const copy = [...arr]
    const temp = copy[index]
    copy[index] = copy[targetIdx]
    copy[targetIdx] = temp
    return copy
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[var(--text-muted)] space-y-3" dir="rtl">
        <RefreshCw size={24} className="animate-spin text-[#1F8A54] mx-auto" />
        <p>جاري تحميل محتوى وأقسام الصفحة الرئيسية من Supabase...</p>
      </div>
    )
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none transition-colors'
  const textareaClass = 'w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none transition-colors'

  return (
    <div className="space-y-6 text-right pb-16" dir="rtl">
      {/* ══ Header ══ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] font-bold">
              لوحة التحكم المركزية
            </span>
            <span className="text-xs text-[var(--text-muted)]">إدارة كاملة للصفحة الرئيسية وأقسامها</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">محتوى وترتيب الصفحة الرئيسية</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            تحكم بكل قسم بالتفصيل، رفع الصور، إعادة الترتيب، وضبط الظهور على الهواتف والشاشات.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
          >
            <ExternalLink size={14} /> معاينة الموقع الحي
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md"
          >
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'جاري الحفظ في Supabase...' : 'حفظ كل التغييرات'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in ${
            message.type === 'success'
              ? 'border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54]'
              : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ══ Navigation Tabs ══ */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold">
        {[
          { id: 'order', label: 'ترتيب وظهور الأقسام', icon: Sliders },
          { id: 'hero', label: 'الواجهة (Hero)', icon: Sparkles },
          { id: 'services_exp', label: 'ماذا نقدم لك', icon: Layers },
          { id: 'story', label: 'قصتنا ولماذا نحن', icon: Layers },
          { id: 'process', label: 'كيف نعمل', icon: Layers },
          { id: 'services_nav', label: 'خدماتنا الشاملة', icon: Layers },
          { id: 'stats_feat', label: 'الأرقام والمميزات', icon: Layers },
          { id: 'portfolio', label: 'أعمالنا ومشاريعنا', icon: Layers },
        ].map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#1F8A54] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* ══ Region Switcher (shown for content-sensitive tabs) ══ */}
      {['hero'].includes(activeTab) && (
        <div className="flex gap-2 p-1 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] w-fit">
          <button type="button" onClick={() => setRegionTab('sa')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
              regionTab === 'sa' ? 'bg-[var(--surface)] shadow text-[#1F8A54]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}>🇸🇦 السعودية وبقية العالم</button>
          <button type="button" onClick={() => setRegionTab('ye')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
              regionTab === 'ye' ? 'bg-[var(--surface)] shadow text-emerald-700' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}>🇾🇪 منطقة اليمن</button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 0: SECTIONS ORDERING & DEVICE VISIBILITY
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'order' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-[#1F8A54]" />
              <h2 className="text-base font-black text-[var(--text-primary)]">ترتيب أقسام الصفحة الرئيسية وضبط الشاشات</h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              يمكنك تغيير ترتيب أي قسم عبر الأسهم لأعلى وأسفل، وتفعيل أو إيقاف ظهور القسم بالكامل، أو تخصيص ظهوره على (الكمبيوتر، التابلت، أو الهاتف).
            </p>
          </div>

          <div className="space-y-2.5">
            {data.sectionOrder.map((sectionId, index) => {
              const meta = data.sectionsMeta[sectionId] || {
                id: sectionId,
                label: sectionId,
                enabled: true,
                visibility: { desktop: true, tablet: true, mobile: true },
              }
              const isFirst = index === 0
              const isLast = index === data.sectionOrder.length - 1

              return (
                <div
                  key={sectionId}
                  className={`p-4 rounded-2xl border transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
                    meta.enabled
                      ? 'border-[var(--border)] bg-[var(--surface)] shadow-sm'
                      : 'border-dashed border-[var(--border)] bg-[var(--bg-muted)] opacity-70'
                  }`}
                >
                  {/* Left: Reorder Controls + Label */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={isFirst}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={isLast}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <span className="w-6 h-6 rounded-lg bg-[var(--bg-muted)] font-mono text-xs font-bold flex items-center justify-center text-[var(--text-muted)]">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[var(--text-primary)] truncate">
                          {meta.label}
                        </span>
                        {!meta.enabled && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444]">
                            معطّل
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">id: {sectionId}</span>
                    </div>
                  </div>

                  {/* Right: Device Visibility Controls & Enable Toggle */}
                  <div className="flex items-center gap-2 justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                    {/* Desktop Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDeviceVisibility(sectionId, 'desktop')}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        meta.visibility.desktop
                          ? 'border-[#1F8A54]/40 bg-[#1F8A54]/10 text-[#1F8A54]'
                          : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)] line-through'
                      }`}
                      title="ظهور على أجهزة الكمبيوتر (Desktop)"
                    >
                      <Monitor size={13} />
                      <span className="hidden md:inline">كمبيوتر</span>
                    </button>

                    {/* Tablet Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDeviceVisibility(sectionId, 'tablet')}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        meta.visibility.tablet
                          ? 'border-[#1F8A54]/40 bg-[#1F8A54]/10 text-[#1F8A54]'
                          : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)] line-through'
                      }`}
                      title="ظهور على أجهزة التابلت (Tablet)"
                    >
                      <Tablet size={13} />
                      <span className="hidden md:inline">تابلت</span>
                    </button>

                    {/* Mobile Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDeviceVisibility(sectionId, 'mobile')}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        meta.visibility.mobile
                          ? 'border-[#1F8A54]/40 bg-[#1F8A54]/10 text-[#1F8A54]'
                          : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)] line-through'
                      }`}
                      title="ظهور على الهواتف الذكية (Mobile)"
                    >
                      <Smartphone size={13} />
                      <span className="hidden md:inline">هاتف</span>
                    </button>

                    {/* Enable/Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSectionEnabled(sectionId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        meta.enabled
                          ? 'bg-[#1F8A54] text-white shadow-sm'
                          : 'bg-[#ef4444] text-white shadow-sm'
                      }`}
                    >
                      {meta.enabled ? 'مفعّل ✓' : 'معطّل ✕'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 1: HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {regionTab === 'sa' ? (
            <>
              {/* ── SA Hero Texts ── */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <h2 className="text-base font-black text-[var(--text-primary)]">نصوص وعناوين الواجهة (Hero Texts) — السعودية وبقية العالم</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة العلوية (Badge)</label>
                    <input className={inputClass} value={data.hero.badge}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, badge: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">بادئة العنوان (Prefix)</label>
                    <input className={inputClass} value={data.hero.titlePrefix}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, titlePrefix: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">تكملة العنوان (Suffix)</label>
                    <input className={inputClass} value={data.hero.titleSuffix}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, titleSuffix: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الكلمات الدوارة (افصل بفاصلة)</label>
                    <input className={inputClass} value={data.hero.rotatingWords.join('، ')}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, rotatingWords: e.target.value.split(/[،,]/).map(w => w.trim()).filter(Boolean) } }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف التوضيحي للواجهة</label>
                    <textarea className={textareaClass} rows={3} value={data.hero.subtitle}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, subtitle: e.target.value } }))} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">نص الزر الرئيسي</label>
                    <input className={inputClass} value={data.hero.primaryBtnText}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, primaryBtnText: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رابط الزر الرئيسي</label>
                    <input className={inputClass} dir="ltr" value={data.hero.primaryBtnLink}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, primaryBtnLink: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">نص الزر الثانوي</label>
                    <input className={inputClass} value={data.hero.secondaryBtnText}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, secondaryBtnText: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رابط الزر الثانوي</label>
                    <input className={inputClass} dir="ltr" value={data.hero.secondaryBtnLink}
                      onChange={e => setData(d => ({ ...d, hero: { ...d.hero, secondaryBtnLink: e.target.value } }))} />
                  </div>
                </div>
              </div>
              {/* SA Hero Images */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <h2 className="text-base font-black text-[var(--text-primary)]">صور الواجهة — السعودية وبقية العالم</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <ImageUploadField label="شعار البداية (المرحلة 0)" value={data.hero.logoImage}
                    onChange={url => setData(d => ({ ...d, hero: { ...d.hero, logoImage: url } }))} helpText="الشعار المتمركز في الثانية الأولى" />
                  <ImageUploadField label="الصورة الأولى (المرحلة 1)" value={data.hero.stage1Image}
                    onChange={url => setData(d => ({ ...d, hero: { ...d.hero, stage1Image: url } }))} helpText="مجسم الترحيب" />
                  <ImageUploadField label="الصورة الثانية (المرحلة 2)" value={data.hero.stage2Image}
                    onChange={url => setData(d => ({ ...d, hero: { ...d.hero, stage2Image: url } }))} helpText="مجسم الخدمات" />
                  <ImageUploadField label="الصورة الثالثة (المرحلة 3)" value={data.hero.stage3Image}
                    onChange={url => setData(d => ({ ...d, hero: { ...d.hero, stage3Image: url } }))} helpText="المجسم الثابت النهائي" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ── Yemen Hero notice ── */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <span className="text-lg">🇾🇪</span>
                <span>حقول اليمن اختيارية — إذا تُركت فارغة يُستخدم المحتوى السعودي كافتراضي. اترك أي حقل فارغاً لاستخدام القيمة الافتراضية.</span>
              </div>
              {/* Yemen Hero Texts */}
              <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
                <h2 className="text-base font-black text-emerald-800 flex items-center gap-2">
                  نصوص الواجهة لزوار اليمن <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">يمن فقط</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">الشارة العلوية (اتركه فارغاً للافتراضي)</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} value={data.yemenHero?.badge || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, badge: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">بادئة العنوان</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} value={data.yemenHero?.titlePrefix || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, titlePrefix: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">تكملة العنوان</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} value={data.yemenHero?.titleSuffix || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, titleSuffix: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">الكلمات الدوارة (افصل بفاصلة)</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`}
                      value={(data.yemenHero?.rotatingWords || []).join('، ')}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, rotatingWords: e.target.value.split(/[،,]/).map(w => w.trim()).filter(Boolean) } }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">الوصف التوضيحي للواجهة</label>
                    <textarea className={`${textareaClass} border-emerald-300 focus:border-emerald-500`} rows={3}
                      value={data.yemenHero?.subtitle || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, subtitle: e.target.value } }))} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">نص الزر الرئيسي</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} value={data.yemenHero?.primaryBtnText || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, primaryBtnText: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">رابط الزر الرئيسي</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} dir="ltr" value={data.yemenHero?.primaryBtnLink || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, primaryBtnLink: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">نص الزر الثانوي</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} value={data.yemenHero?.secondaryBtnText || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, secondaryBtnText: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-700 mb-1 block">رابط الزر الثانوي</label>
                    <input className={`${inputClass} border-emerald-300 focus:border-emerald-500`} dir="ltr" value={data.yemenHero?.secondaryBtnLink || ''}
                      onChange={e => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, secondaryBtnLink: e.target.value } }))} />
                  </div>
                </div>
              </div>
              {/* Yemen Hero Images */}
              <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
                <h2 className="text-base font-black text-emerald-800 flex items-center gap-2">
                  صور الواجهة لزوار اليمن <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">يمن فقط</span>
                </h2>
                <p className="text-xs text-emerald-700">اترك الحقل فارغاً لاستخدام الصور الافتراضية (صور السعودية).</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <ImageUploadField label="شعار البداية — اليمن" value={data.yemenHero?.logoImage || ''}
                    onChange={url => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, logoImage: url } }))} helpText="اختياري — يُعرض لزوار اليمن فقط" />
                  <ImageUploadField label="الصورة الأولى — اليمن" value={data.yemenHero?.stage1Image || ''}
                    onChange={url => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, stage1Image: url } }))} helpText="اختياري — يُعرض لزوار اليمن فقط" />
                  <ImageUploadField label="الصورة الثانية — اليمن" value={data.yemenHero?.stage2Image || ''}
                    onChange={url => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, stage2Image: url } }))} helpText="اختياري — يُعرض لزوار اليمن فقط" />
                  <ImageUploadField label="الصورة الثالثة — اليمن" value={data.yemenHero?.stage3Image || ''}
                    onChange={url => setData(d => ({ ...d, yemenHero: { ...d.yemenHero, stage3Image: url } }))} helpText="اختياري — يُعرض لزوار اليمن فقط" />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 2: SERVICES EXPERIENCE (ماذا نقدم لك)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'services_exp' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم ماذا نقدم لك</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.servicesExperience.badge}
                  onChange={e => setData(d => ({ ...d, servicesExperience: { ...d.servicesExperience, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان الرئيسي</label>
                <input
                  className={inputClass}
                  value={data.servicesExperience.title}
                  onChange={e => setData(d => ({ ...d, servicesExperience: { ...d.servicesExperience, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف التوضيحي</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.servicesExperience.subtitle}
                  onChange={e => setData(d => ({ ...d, servicesExperience: { ...d.servicesExperience, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                الخدمات التفاعلية ({data.servicesExperience.items.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newId = `service-${Date.now()}`
                  setData(d => ({
                    ...d,
                    servicesExperience: {
                      ...d.servicesExperience,
                      items: [
                        ...d.servicesExperience.items,
                        {
                          id: newId,
                          title: 'خدمة جديدة',
                          titleEn: 'New Service',
                          desc: 'شرح الخدمة ومزاياها للعميل...',
                          icon: 'Globe',
                          image: '/assets/1.png',
                          accent: '#1F8A54',
                          points: ['ميزة رقم 1', 'ميزة رقم 2', 'ميزة رقم 3'],
                          link: '/services/web',
                        },
                      ],
                    },
                  }))
                }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة خدمة جديدة
              </button>
            </div>

            {data.servicesExperience.items.map((svc, idx) => (
              <div key={svc.id + idx} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-[var(--text-primary)]">{svc.title}</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">({svc.titleEn})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          servicesExperience: {
                            ...d.servicesExperience,
                            items: moveArrayItem(d.servicesExperience.items, idx, 'up'),
                          },
                        }))
                      }
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          servicesExperience: {
                            ...d.servicesExperience,
                            items: moveArrayItem(d.servicesExperience.items, idx, 'down'),
                          },
                        }))
                      }
                      disabled={idx === data.servicesExperience.items.length - 1}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف خدمة "${svc.title}"؟`)) return
                        setData(d => ({
                          ...d,
                          servicesExperience: {
                            ...d.servicesExperience,
                            items: d.servicesExperience.items.filter((_, i) => i !== idx),
                          },
                        }))
                      }}
                      className="p-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"
                      title="حذف الخدمة"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">اسم الخدمة (عربي)</label>
                    <input
                      className={inputClass}
                      value={svc.title}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], title: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">اسم الخدمة (إنجليزي)</label>
                    <input
                      className={inputClass}
                      value={svc.titleEn}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], titleEn: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">لون التمييز (Hex)</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={svc.accent}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], accent: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رابط الصفحة</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={svc.link}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], link: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">اسم الأيقونة (Lucide)</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={svc.icon}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], icon: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">وصف الخدمة</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      value={svc.desc}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], desc: val }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <ImageUploadField
                      label="صورة الخدمة المرافقة"
                      value={svc.image}
                      onChange={url => {
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], image: url }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">نقاط ومزايا الخدمة (افصل بفاصلة)</label>
                    <input
                      className={inputClass}
                      value={svc.points.join('، ')}
                      onChange={e => {
                        const pts = e.target.value.split(/[،,]/).map(p => p.trim()).filter(Boolean)
                        setData(d => {
                          const items = [...d.servicesExperience.items]
                          items[idx] = { ...items[idx], points: pts }
                          return { ...d, servicesExperience: { ...d.servicesExperience, items } }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 3: STORY SECTION (قصتنا ولماذا نحن)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'story' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم قصتنا ولماذا نحن</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.story.badge}
                  onChange={e => setData(d => ({ ...d, story: { ...d.story, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان الرئيسي</label>
                <input
                  className={inputClass}
                  value={data.story.title}
                  onChange={e => setData(d => ({ ...d, story: { ...d.story, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف التوضيحي</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.story.subtitle}
                  onChange={e => setData(d => ({ ...d, story: { ...d.story, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          {/* Story Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                محطات القصة ومراحل التحول ({data.story.steps.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const num = (data.story.steps.length + 1).toString().padStart(2, '0')
                  setData(d => ({
                    ...d,
                    story: {
                      ...d.story,
                      steps: [
                        ...d.story.steps,
                        {
                          id: `step-${Date.now()}`,
                          num,
                          tag: 'مرحلة جديدة',
                          heading: 'عنوان المرحلة الجديد',
                          body: 'شرح تفاصيل هذه المرحلة...',
                          bullets: ['نقطة 1', 'نقطة 2', 'نقطة 3'],
                          accent: '#1F8A54',
                          image: '/assets/7.png',
                        },
                      ],
                    },
                  }))
                }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة محطة جديدة
              </button>
            </div>

            {data.story.steps.map((st, idx) => (
              <div key={st.id + idx} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)]">
                      {st.num}
                    </span>
                    <span className="font-black text-sm text-[var(--text-primary)]">{st.heading}</span>
                    <span className="text-xs text-[var(--text-muted)]">({st.tag})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          story: { ...d.story, steps: moveArrayItem(d.story.steps, idx, 'up') },
                        }))
                      }
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          story: { ...d.story, steps: moveArrayItem(d.story.steps, idx, 'down') },
                        }))
                      }
                      disabled={idx === data.story.steps.length - 1}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف محطة "${st.heading}"؟`)) return
                        setData(d => ({
                          ...d,
                          story: { ...d.story, steps: d.story.steps.filter((_, i) => i !== idx) },
                        }))
                      }}
                      className="p-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رقم المحطة</label>
                    <input
                      className={inputClass}
                      value={st.num}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], num: val }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوسم (Tag)</label>
                    <input
                      className={inputClass}
                      value={st.tag}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], tag: val }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">لون التمييز (Hex)</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={st.accent}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], accent: val }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">عنوان المحطة الرئيسي</label>
                    <input
                      className={inputClass}
                      value={st.heading}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], heading: val }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">نص المحطة والشرح</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      value={st.body}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], body: val }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <ImageUploadField
                      label="صورة أو رسمة المحطة"
                      value={st.image}
                      onChange={url => {
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], image: url }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">النقاط المدعومة (افصل بفاصلة)</label>
                    <input
                      className={inputClass}
                      value={st.bullets.join('، ')}
                      onChange={e => {
                        const pts = e.target.value.split(/[،,]/).map(p => p.trim()).filter(Boolean)
                        setData(d => {
                          const steps = [...d.story.steps]
                          steps[idx] = { ...steps[idx], bullets: pts }
                          return { ...d, story: { ...d.story, steps } }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 4: PROCESS (كيف نعمل)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم كيف نعمل (Process Deck)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.process.badge}
                  onChange={e => setData(d => ({ ...d, process: { ...d.process, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان الرئيسي</label>
                <input
                  className={inputClass}
                  value={data.process.title}
                  onChange={e => setData(d => ({ ...d, process: { ...d.process, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف التوضيحي</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.process.subtitle}
                  onChange={e => setData(d => ({ ...d, process: { ...d.process, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                بطاقات مراحل التطوير ({data.process.steps.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const num = (data.process.steps.length + 1).toString().padStart(2, '0')
                  setData(d => ({
                    ...d,
                    process: {
                      ...d.process,
                      steps: [
                        ...d.process.steps,
                        {
                          number: num,
                          suit: '♠',
                          title: 'مرحلة جديدة',
                          description: 'شرح موجز لهذه المرحلة...',
                          color: '#1F8A54',
                        },
                      ],
                    },
                  }))
                }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة بطاقة جديدة
              </button>
            </div>

            {data.process.steps.map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)]">
                      {st.number} {st.suit}
                    </span>
                    <span className="font-black text-sm text-[var(--text-primary)]">{st.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          process: { ...d.process, steps: moveArrayItem(d.process.steps, idx, 'up') },
                        }))
                      }
                      disabled={idx === 0}
                      className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          process: { ...d.process, steps: moveArrayItem(d.process.steps, idx, 'down') },
                        }))
                      }
                      disabled={idx === data.process.steps.length - 1}
                      className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف بطاقة "${st.title}"؟`)) return
                        setData(d => ({
                          ...d,
                          process: { ...d.process, steps: d.process.steps.filter((_, i) => i !== idx) },
                        }))
                      }}
                      className="p-1 rounded border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رقم البطاقة</label>
                    <input
                      className={inputClass}
                      value={st.number}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.process.steps]
                          steps[idx] = { ...steps[idx], number: val }
                          return { ...d, process: { ...d.process, steps } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رمز اللعب (Suit)</label>
                    <input
                      className={inputClass}
                      value={st.suit}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.process.steps]
                          steps[idx] = { ...steps[idx], suit: val }
                          return { ...d, process: { ...d.process, steps } }
                        })
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">عنوان المرحلة</label>
                    <input
                      className={inputClass}
                      value={st.title}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.process.steps]
                          steps[idx] = { ...steps[idx], title: val }
                          return { ...d, process: { ...d.process, steps } }
                        })
                      }}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">شرح المرحلة</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      value={st.description}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const steps = [...d.process.steps]
                          steps[idx] = { ...steps[idx], description: val }
                          return { ...d, process: { ...d.process, steps } }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 5: SERVICES NAVIGATION (خدماتنا الشاملة)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'services_nav' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم خدماتنا الشاملة</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.servicesNav.badge}
                  onChange={e => setData(d => ({ ...d, servicesNav: { ...d.servicesNav, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان</label>
                <input
                  className={inputClass}
                  value={data.servicesNav.title}
                  onChange={e => setData(d => ({ ...d, servicesNav: { ...d.servicesNav, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.servicesNav.subtitle}
                  onChange={e => setData(d => ({ ...d, servicesNav: { ...d.servicesNav, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                شبكة الخدمات ({data.servicesNav.items.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const num = (data.servicesNav.items.length + 1).toString().padStart(2, '0')
                  setData(d => ({
                    ...d,
                    servicesNav: {
                      ...d.servicesNav,
                      items: [
                        ...d.servicesNav.items,
                        {
                          title: 'خدمة جديدة',
                          titleEn: 'New Service',
                          desc: 'وصف الخدمة هنا...',
                          href: '/services/web',
                          accent: '#1F8A54',
                          num,
                          tags: ['Next.js', 'React'],
                        },
                      ],
                    },
                  }))
                }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة خدمة للشبكة
              </button>
            </div>

            {data.servicesNav.items.map((svc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)]">
                      {svc.num}
                    </span>
                    <span className="font-black text-sm text-[var(--text-primary)]">{svc.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          servicesNav: { ...d.servicesNav, items: moveArrayItem(d.servicesNav.items, idx, 'up') },
                        }))
                      }
                      disabled={idx === 0}
                      className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          servicesNav: { ...d.servicesNav, items: moveArrayItem(d.servicesNav.items, idx, 'down') },
                        }))
                      }
                      disabled={idx === data.servicesNav.items.length - 1}
                      className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف "${svc.title}"؟`)) return
                        setData(d => ({
                          ...d,
                          servicesNav: { ...d.servicesNav, items: d.servicesNav.items.filter((_, i) => i !== idx) },
                        }))
                      }}
                      className="p-1 rounded border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الاسم عربي</label>
                    <input
                      className={inputClass}
                      value={svc.title}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesNav.items]
                          items[idx] = { ...items[idx], title: val }
                          return { ...d, servicesNav: { ...d.servicesNav, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الاسم إنجليزي</label>
                    <input
                      className={inputClass}
                      value={svc.titleEn}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesNav.items]
                          items[idx] = { ...items[idx], titleEn: val }
                          return { ...d, servicesNav: { ...d.servicesNav, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الرابط</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={svc.href}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesNav.items]
                          items[idx] = { ...items[idx], href: val }
                          return { ...d, servicesNav: { ...d.servicesNav, items } }
                        })
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      value={svc.desc}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.servicesNav.items]
                          items[idx] = { ...items[idx], desc: val }
                          return { ...d, servicesNav: { ...d.servicesNav, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوسوم (افصل بفاصلة)</label>
                    <input
                      className={inputClass}
                      value={svc.tags.join('، ')}
                      onChange={e => {
                        const pts = e.target.value.split(/[،,]/).map(p => p.trim()).filter(Boolean)
                        setData(d => {
                          const items = [...d.servicesNav.items]
                          items[idx] = { ...items[idx], tags: pts }
                          return { ...d, servicesNav: { ...d.servicesNav, items } }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 6: STATS & FEATURES (الأرقام والمميزات)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'stats_feat' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم الأرقام والمميزات</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.statsFeatures.badge}
                  onChange={e => setData(d => ({ ...d, statsFeatures: { ...d.statsFeatures, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان</label>
                <input
                  className={inputClass}
                  value={data.statsFeatures.title}
                  onChange={e => setData(d => ({ ...d, statsFeatures: { ...d.statsFeatures, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.statsFeatures.subtitle}
                  onChange={e => setData(d => ({ ...d, statsFeatures: { ...d.statsFeatures, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--text-primary)]">أرقام وإحصائيات العدادات</h3>
              <button
                type="button"
                onClick={() =>
                  setData(d => ({
                    ...d,
                    statsFeatures: {
                      ...d.statsFeatures,
                      stats: [...d.statsFeatures.stats, { value: '٥٠+', label: 'إحصائية جديدة' }],
                    },
                  }))
                }
                className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1"
              >
                <Plus size={13} /> إضافة عداد
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.statsFeatures.stats.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] font-bold">عداد #{idx + 1}</span>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          statsFeatures: {
                            ...d.statsFeatures,
                            stats: d.statsFeatures.stats.filter((_, i) => i !== idx),
                          },
                        }))
                      }
                      className="text-[var(--text-muted)] hover:text-[#ef4444]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <input
                    className={inputClass}
                    value={st.value}
                    placeholder="القيمة (مثال: ١٢٠+)"
                    onChange={e => {
                      const val = e.target.value
                      setData(d => {
                        const stats = [...d.statsFeatures.stats]
                        stats[idx] = { ...stats[idx], value: val }
                        return { ...d, statsFeatures: { ...d.statsFeatures, stats } }
                      })
                    }}
                  />
                  <input
                    className={inputClass}
                    value={st.label}
                    placeholder="الوصف (مثال: مشروع منجز)"
                    onChange={e => {
                      const val = e.target.value
                      setData(d => {
                        const stats = [...d.statsFeatures.stats]
                        stats[idx] = { ...stats[idx], label: val }
                        return { ...d, statsFeatures: { ...d.statsFeatures, stats } }
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features Cards */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--text-primary)]">بطاقات المميزات التنافسية</h3>
              <button
                type="button"
                onClick={() =>
                  setData(d => ({
                    ...d,
                    statsFeatures: {
                      ...d.statsFeatures,
                      features: [
                        ...d.statsFeatures.features,
                        {
                          title: 'ميزة جديدة',
                          desc: 'شرح الميزة القوية...',
                          icon: 'Zap',
                          highlight: 'ميزة فريدة',
                          accent: '#1F8A54',
                        },
                      ],
                    },
                  }))
                }
                className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1"
              >
                <Plus size={13} /> إضافة ميزة
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {data.statsFeatures.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">ميزة #{idx + 1}</span>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          statsFeatures: {
                            ...d.statsFeatures,
                            features: d.statsFeatures.features.filter((_, i) => i !== idx),
                          },
                        }))
                      }
                      className="text-[var(--text-muted)] hover:text-[#ef4444]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      className={inputClass}
                      value={feat.title}
                      placeholder="عنوان الميزة"
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const features = [...d.statsFeatures.features]
                          features[idx] = { ...features[idx], title: val }
                          return { ...d, statsFeatures: { ...d.statsFeatures, features } }
                        })
                      }}
                    />
                    <input
                      className={inputClass}
                      value={feat.highlight}
                      placeholder="الشارة (مثال: أداء 95+)"
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const features = [...d.statsFeatures.features]
                          features[idx] = { ...features[idx], highlight: val }
                          return { ...d, statsFeatures: { ...d.statsFeatures, features } }
                        })
                      }}
                    />
                  </div>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    value={feat.desc}
                    placeholder="شرح الميزة..."
                    onChange={e => {
                      const val = e.target.value
                      setData(d => {
                        const features = [...d.statsFeatures.features]
                        features[idx] = { ...features[idx], desc: val }
                        return { ...d, statsFeatures: { ...d.statsFeatures, features } }
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 7: PORTFOLIO (أعمالنا ومشاريعنا)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-base font-black text-[var(--text-primary)]">رأس قسم أعمالنا ومشاريعنا المختارة</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الشارة</label>
                <input
                  className={inputClass}
                  value={data.portfolio.badge}
                  onChange={e => setData(d => ({ ...d, portfolio: { ...d.portfolio, badge: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">العنوان</label>
                <input
                  className={inputClass}
                  value={data.portfolio.title}
                  onChange={e => setData(d => ({ ...d, portfolio: { ...d.portfolio, title: e.target.value } }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف</label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={data.portfolio.subtitle}
                  onChange={e => setData(d => ({ ...d, portfolio: { ...d.portfolio, subtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                المشاريع المعروضة ({data.portfolio.items.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const num = (data.portfolio.items.length + 1).toString().padStart(2, '0')
                  setData(d => ({
                    ...d,
                    portfolio: {
                      ...d.portfolio,
                      items: [
                        ...d.portfolio.items,
                        {
                          id: `proj-${Date.now()}`,
                          num,
                          title: 'مشروع جديد',
                          subtitle: 'منصة ويب حديثة',
                          description: 'شرح مختصر لأهداف المشروع والنتائج المحققة للعميل...',
                          category: 'منصة رقمية',
                          image: '/assets/11.png',
                          accent: '#1F8A54',
                          tags: ['Next.js', 'PostgreSQL'],
                          rating: 5,
                          link: '',
                        },
                      ],
                    },
                  }))
                }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة مشروع جديد
              </button>
            </div>

            {data.portfolio.items.map((proj, idx) => (
              <div key={proj.id + idx} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)]">
                      {proj.num}
                    </span>
                    <span className="font-black text-sm text-[var(--text-primary)]">{proj.title}</span>
                    <span className="text-xs text-[var(--text-muted)]">({proj.category})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          portfolio: { ...d.portfolio, items: moveArrayItem(d.portfolio.items, idx, 'up') },
                        }))
                      }
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setData(d => ({
                          ...d,
                          portfolio: { ...d.portfolio, items: moveArrayItem(d.portfolio.items, idx, 'down') },
                        }))
                      }
                      disabled={idx === data.portfolio.items.length - 1}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف مشروع "${proj.title}"؟`)) return
                        setData(d => ({
                          ...d,
                          portfolio: { ...d.portfolio, items: d.portfolio.items.filter((_, i) => i !== idx) },
                        }))
                      }}
                      className="p-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">اسم المشروع</label>
                    <input
                      className={inputClass}
                      value={proj.title}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], title: val }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">الوصف الفرعي</label>
                    <input
                      className={inputClass}
                      value={proj.subtitle}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], subtitle: val }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">التصنيف</label>
                    <input
                      className={inputClass}
                      value={proj.category}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], category: val }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">رابط المشروع الخارجي (اختياري)</label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      value={proj.link}
                      placeholder="https://..."
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], link: val }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">التقنيات (افصل بفاصلة)</label>
                    <input
                      className={inputClass}
                      value={proj.tags.join('، ')}
                      onChange={e => {
                        const pts = e.target.value.split(/[،,]/).map(p => p.trim()).filter(Boolean)
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], tags: pts }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">نبذة ووصف تفصيلي للمشروع</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      value={proj.description}
                      onChange={e => {
                        const val = e.target.value
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], description: val }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <ImageUploadField
                      label="صورة لقطة المشروع"
                      value={proj.image}
                      onChange={url => {
                        setData(d => {
                          const items = [...d.portfolio.items]
                          items[idx] = { ...items[idx], image: url }
                          return { ...d, portfolio: { ...d.portfolio, items } }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
