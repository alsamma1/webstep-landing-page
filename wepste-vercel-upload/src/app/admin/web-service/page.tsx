'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowDown, ArrowUp, Check, ChevronLeft, ExternalLink, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react'
import {
  DEFAULT_WEB_SERVICE_CONTENT,
  WEB_SERVICE_SECTION_LABELS,
  type WebServicePageContent,
} from '@/data/web-service-page'
import { parseWebServiceContent, webServiceContentSchema } from '@/lib/web-service-content'
import YemenPricingPanel from '@/components/admin/YemenPricingPanel'

type ContentPath = Array<string | number>

const ICON_LABELS: Record<string, string> = {
  Globe: 'كرة أرضية',
  Zap: 'برق',
  Palette: 'تصميم',
  Smartphone: 'هاتف',
  Search: 'بحث',
  MessageCircle: 'محادثة',
  Settings: 'إعدادات',
  Shield: 'حماية',
  User: 'شخص',
  Briefcase: 'حقيبة أعمال',
  FolderOpen: 'ملفات',
  Send: 'إرسال',
  Rocket: 'صاروخ',
  Headphones: 'سماعة',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getAtPath(value: unknown, path: ContentPath): unknown {
  return path.reduce<unknown>((current, key) => {
    if (Array.isArray(current) && typeof key === 'number') return current[key]
    if (isRecord(current) && typeof key === 'string') return current[key]
    return undefined
  }, value)
}

function setAtPath(value: unknown, path: ContentPath, nextValue: unknown): unknown {
  if (path.length === 0) return nextValue
  const [key, ...remaining] = path
  if (Array.isArray(value) && typeof key === 'number') {
    const next = [...value]
    next[key] = setAtPath(next[key], remaining, nextValue)
    return next
  }
  if (isRecord(value) && typeof key === 'string') {
    return { ...value, [key]: setAtPath(value[key], remaining, nextValue) }
  }
  return value
}

function itemTitle(value: unknown, index: number): string {
  if (isRecord(value)) {
    for (const key of ['name', 'title', 'label', 'question', 'id']) {
      if (typeof value[key] === 'string' && value[key]) return value[key]
    }
  }
  return `عنصر ${index + 1}`
}

function createArrayItem(path: ContentPath, items: unknown[]): unknown {
  const templateValue = getAtPath(DEFAULT_WEB_SERVICE_CONTENT, path)
  const template = Array.isArray(templateValue) ? templateValue[0] : items[0]
  if (typeof template === 'string') return ''
  if (typeof template === 'number') return 0
  if (typeof template === 'boolean') return false
  if (isRecord(template)) {
    const item = structuredClone(template)
    if (typeof item.id === 'string') item.id = `new-${crypto.randomUUID()}`
    if (typeof item.name === 'string') item.name = `${item.name} جديد`
    return item
  }
  return ''
}

export default function WebServiceAdminPage() {
  const [content, setContent] = useState<unknown>(structuredClone(DEFAULT_WEB_SERVICE_CONTENT))
  const [activeSection, setActiveSection] = useState<keyof WebServicePageContent>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadContent = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/web-service')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تحميل محتوى الصفحة')
      const parsed = parseWebServiceContent(result.content)
      if (!parsed.success) throw new Error('وصل محتوى غير صالح من الخادم')
      setContent(parsed.data)
      setSaved(result.saved === true)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'حدث خطأ غير متوقع أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  const applyContent = (nextContent: unknown) => {
    setContent(nextContent)
    setSaved(false)
    setNotice('')
    setError('')
  }

  const updateField = (path: ContentPath, value: unknown) => {
    applyContent(setAtPath(content, path, value))
  }

  const updateArray = (path: ContentPath, update: (items: unknown[]) => unknown[]) => {
    const current = getAtPath(content, path)
    if (Array.isArray(current)) applyContent(setAtPath(content, path, update(current)))
  }

  const saveContent = async () => {
    const parsed = webServiceContentSchema.safeParse(content)
    if (!parsed.success) {
      setError(`تحقق من البيانات قبل الحفظ: ${parsed.error.issues.slice(0, 4).map(issue => `${issue.path.join('.')}: ${issue.message}`).join('، ')}`)
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/web-service', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: parsed.data }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ محتوى الصفحة')
      setSaved(true)
      setNotice('تم حفظ محتوى صفحة المواقع الإلكترونية في Supabase بنجاح.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'حدث خطأ غير متوقع أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const renderField = (label: string, value: unknown, path: ContentPath): React.ReactNode => {
    const fieldId = `web-service-${path.join('-')}`
    const fieldLabel = label.replace(/([A-Z])/g, ' $1')
    if (Array.isArray(value)) {
      return (
        <fieldset key={fieldId} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
          <legend className="px-2 text-sm font-black text-[var(--text-primary)]">{fieldLabel}</legend>
          <div className="space-y-3">
            {value.map((item, index) => {
              const itemPath = [...path, index]
              return (
                <div key={`${fieldId}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-secondary)]">{itemTitle(item, index)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => updateArray(path, items => {
                          const next = [...items]
                          const current = next[index - 1]
                          next[index - 1] = next[index]
                          next[index] = current
                          return next
                        })}
                        className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-muted)] disabled:opacity-30"
                        aria-label={`تحريك ${itemTitle(item, index)} لأعلى`}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={index === value.length - 1}
                        onClick={() => updateArray(path, items => {
                          const next = [...items]
                          const current = next[index]
                          next[index] = next[index + 1]
                          next[index + 1] = current
                          return next
                        })}
                        className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-muted)] disabled:opacity-30"
                        aria-label={`تحريك ${itemTitle(item, index)} لأسفل`}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateArray(path, items => items.filter((_, itemIndex) => itemIndex !== index))}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                        aria-label={`حذف ${itemTitle(item, index)}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {isRecord(item)
                    ? <div className="grid gap-3 sm:grid-cols-2">{Object.entries(item).map(([key, child]) => renderField(key, child, [...itemPath, key]))}</div>
                    : renderField(`${fieldLabel} ${index + 1}`, item, itemPath)}
                </div>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => updateArray(path, items => [...items, createArrayItem(path, items)])}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#1F8A54]/50 px-4 py-2 text-xs font-bold text-[#1F8A54] transition hover:bg-[#1F8A54]/10"
          >
            <Plus size={15} /> إضافة {fieldLabel}
          </button>
        </fieldset>
      )
    }

    if (isRecord(value)) {
      return (
        <fieldset key={fieldId} className="min-w-0 rounded-2xl border border-[var(--border)] p-4">
          <legend className="px-2 text-sm font-black text-[var(--text-primary)]">{fieldLabel}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(value).map(([key, child]) => renderField(key, child, [...path, key]))}
          </div>
        </fieldset>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <label key={fieldId} className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)]">
          <input type="checkbox" checked={value} onChange={event => updateField(path, event.target.checked)} className="h-4 w-4 accent-[#1F8A54]" />
          <span>{fieldLabel}</span>
        </label>
      )
    }

    if (typeof value === 'number') {
      return (
        <label key={fieldId} className="block text-xs font-bold text-[var(--text-secondary)]">
          <span className="mb-1.5 block">{fieldLabel}</span>
          <input type="number" value={value} min={0} onChange={event => updateField(path, Number(event.target.value))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]" />
        </label>
      )
    }

    if (typeof value === 'string') {
      if (path[path.length - 1] === 'icon') {
        return (
          <label key={fieldId} className="block text-xs font-bold text-[var(--text-secondary)]">
            <span className="mb-1.5 block">{fieldLabel}</span>
            <select value={value} onChange={event => updateField(path, event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]">
              {Object.entries(ICON_LABELS).map(([iconName, iconLabel]) => <option key={iconName} value={iconName}>{iconLabel}</option>)}
            </select>
          </label>
        )
      }
      const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]'
      return (
        <label key={fieldId} className="block min-w-0 text-xs font-bold text-[var(--text-secondary)]">
          <span className="mb-1.5 block">{fieldLabel}</span>
          {value.length > 90
            ? <textarea rows={3} value={value} onChange={event => updateField(path, event.target.value)} className={`${inputClass} resize-y`} />
            : path[path.length - 1] === 'color'
              ? <div className="flex gap-2"><input type="color" value={value} onChange={event => updateField(path, event.target.value)} className="h-10 w-12 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1" /><input value={value} onChange={event => updateField(path, event.target.value)} className={inputClass} /></div>
              : <input value={value} onChange={event => updateField(path, event.target.value)} className={inputClass} />}
        </label>
      )
    }
    return null
  }

  const sectionValue = getAtPath(content, [activeSection])

  return (
    <div className="mx-auto max-w-7xl space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <Link href="/admin" className="hover:text-[#1F8A54]">لوحة التحكم</Link>
            <ChevronLeft size={14} />
            <span>إدارة صفحة المواقع الإلكترونية</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] sm:text-3xl">إدارة صفحة تطوير المواقع</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">عدّل النصوص والبيانات، أضف أو احذف الباقات والأعمال والأسئلة، ثم احفظ لتظهر التغييرات على الموقع المنشور.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/services/web" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]">
            <ExternalLink size={16} /> معاينة الصفحة
          </Link>
          <button type="button" onClick={() => void saveContent()} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#1F8A54]/20 transition hover:bg-[#187344] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'جارٍ الحفظ…' : 'حفظ ونشر التعديلات'}
          </button>
        </div>
      </div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{error}</span></div>}
      {notice && <div role="status" className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700"><Check size={18} /><span>{notice}</span></div>}
      {!loading && !error && !saved && <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700">تعرض الصفحة الآن البيانات الافتراضية. احفظها لأول مرة لتخزينها في جدول Supabase.</div>}

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav aria-label="أقسام محتوى الصفحة" className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 lg:flex-col lg:overflow-visible">
          {(Object.keys(WEB_SERVICE_SECTION_LABELS) as Array<keyof WebServicePageContent>).map(section => (
            <button key={section} type="button" onClick={() => setActiveSection(section)} className={`shrink-0 rounded-xl px-4 py-3 text-right text-sm font-bold transition ${activeSection === section ? 'bg-[#1F8A54] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'}`}>
              {WEB_SERVICE_SECTION_LABELS[section]}
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">{WEB_SERVICE_SECTION_LABELS[activeSection]}</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">كل تعديل هنا يبقى مسودة إلى أن تضغط «حفظ ونشر التعديلات».</p>
            </div>
            {loading && <LoaderCircle size={18} className="animate-spin text-[#1F8A54]" />}
          </div>
          <div className="space-y-4">
            {renderField(WEB_SERVICE_SECTION_LABELS[activeSection], sectionValue, [activeSection])}
          </div>

          {/* Yemen Pricing Panel — shown only in plans section */}
          {activeSection === 'plans' && (
            <div className="mt-6">
              <YemenPricingPanel serviceKey="web" sectionLabel="باقات المواقع" />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
