'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  AlertCircle, Check, LoaderCircle,
  Plus, Save, Trash2, UploadCloud,
} from 'lucide-react'
import { DEFAULT_LANDING_SERVICE_CONTENT, type LandingServiceContent, parseLandingServiceContent } from '@/data/landing-service'
import { uploadImage } from '@/lib/supabase'
import YemenPricingPanel from '@/components/admin/YemenPricingPanel'

type Path = Array<string | number>

const labels: Record<string, string> = {
  hero: 'المقدمة الرئيسية', badge: 'الشارة التعريفية', title: 'العنوان الرئيسي', highlight: 'العنوان المميز',
  description: 'الوصف', primaryCta: 'زر الإجراء الرئيسي', secondaryCta: 'زر التواصل', metrics: 'مؤشرات المقدمة',
  value: 'القيمة', label: 'النص التوضيحي', color: 'اللون', types: 'أنواع صفحات الهبوط',
  id: 'المعرّف', outcome: 'النتيجة/الفائدة', features: 'المزايا', titleEn: 'الاسم الإنجليزي',
  projects: 'معرض الأعمال ودراسات الحالة', slug: 'الرابط المختصر', category: 'التصنيف',
  summary: 'نبذة مختصرة', coverImage: 'صورة الغلاف', gallery: 'صور المعرض', videoUrl: 'رابط فيديو YouTube',
  tags: 'الوسوم', published: 'منشور للعامة', featured: 'عمل مميز', accentColor: 'لون التمييز',
  seoTitle: 'عنوان SEO', seoDescription: 'وصف SEO', packages: 'الباقات والأسعار',
  name: 'اسم الباقة', price: 'السعر', cta: 'نص زر الطلب', featuresList: 'المزايا',
  process: 'خطوات العمل', seo: 'إعدادات SEO', keywords: 'الكلمات المفتاحية',
  secondary: 'ثانوي', featuredSection: 'المميز',
}

function getAtPath(value: unknown, path: Path): unknown {
  return path.reduce<unknown>((current, key) => {
    if (Array.isArray(current) && typeof key === 'number') return current[key]
    if (current && typeof current === 'object' && !Array.isArray(current) && typeof key === 'string') {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, value)
}

function setAtPath(value: unknown, path: Path, nextValue: unknown): unknown {
  if (!path.length) return nextValue
  const [key, ...rest] = path
  if (Array.isArray(value) && typeof key === 'number') {
    const next = [...value]
    next[key] = setAtPath(next[key], rest, nextValue)
    return next
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && typeof key === 'string') {
    const record = value as Record<string, unknown>
    return { ...record, [key]: setAtPath(record[key], rest, nextValue) }
  }
  return value
}

function cloneNewItem(defaults: unknown, path: Path, current: unknown[]): unknown {
  const template = getAtPath(defaults, path)
  const sample = Array.isArray(template) ? template[0] : current[0]
  if (Array.isArray(sample)) return []
  if (sample && typeof sample === 'object') {
    const clone = structuredClone(sample) as Record<string, unknown>
    if (typeof clone.id === 'string') clone.id = `new-${crypto.randomUUID().slice(0, 8)}`
    if (typeof clone.slug === 'string') clone.slug = `new-${crypto.randomUUID().slice(0, 8)}`
    if (typeof clone.title === 'string') clone.title = ''
    if (typeof clone.name === 'string') clone.name = ''
    if (typeof clone.summary === 'string') clone.summary = ''
    if (typeof clone.description === 'string') clone.description = ''
    return clone
  }
  return ''
}

function UploadImageButton({ onUploaded, multiple = false }: { onUploaded: (url: string) => void; multiple?: boolean }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  return <div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-[11px] font-bold transition hover:border-[#1F8A54]"><UploadCloud size={14} />{uploading ? 'جارٍ ضغط الصورة ورفعها...' : multiple ? 'رفع صورة للمعرض' : 'رفع صورة من الجهاز'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} disabled={uploading} className="sr-only" onChange={async event => { const files = Array.from(event.currentTarget.files || []); event.currentTarget.value = ''; if (!files.length) return; setUploading(true); setError(''); try { for (const file of files) { const url = await uploadImage('projects', file, 'landing-pages'); if (!url) throw new Error('لم يُرجع التخزين رابط الصورة'); onUploaded(url) } } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع الصورة') } finally { setUploading(false) } }} /></label>{error && <p role="alert" className="mt-1 text-[10px] text-red-600">{error}</p>}</div>
}

export default function AdminLandingServicePage() {
  const [content, setContent] = useState<LandingServiceContent>(structuredClone(DEFAULT_LANDING_SERVICE_CONTENT))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/landing-service', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تحميل بيانات الصفحة')
      const parsed = parseLandingServiceContent(result.content)
      if (!parsed.success) throw new Error('بيانات صفحة الهبوط في قاعدة البيانات غير صالحة')
      setContent(parsed.data)
      setSaved(result.saved === true)
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل بيانات الصفحة')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load])

  const update = (path: Path, value: unknown) => {
    setContent(current => setAtPath(current, path, value) as LandingServiceContent)
    setSaved(false)
    setNotice('')
  }

  const save = async () => {
    const parsed = parseLandingServiceContent(content)
    if (!parsed.success) {
      setError(`راجع الحقول قبل الحفظ: ${parsed.error.issues.slice(0, 5).map(issue => issue.path.join('.')).join('، ')}`)
      return
    }
    setSaving(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/admin/landing-service', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: parsed.data }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ بيانات الصفحة')
      setSaved(true)
      setNotice('تم حفظ التغييرات في Supabase بنجاح.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ بيانات الصفحة')
    } finally { setSaving(false) }
  }

  const renderField = (value: unknown, path: Path, keyName: string): ReactNode => {
    const label = labels[keyName] || keyName
    if (typeof value === 'string') {
      if (keyName === 'coverImage') {
        return <div key={path.join('.')} className="space-y-2"><Field label={label} value={value} onChange={next => update(path, next)} direction="ltr" /><UploadImageButton onUploaded={url => update(path, url)} /></div>
      }
      const longText = value.length > 90 || ['description', 'summary', 'outcome', 'seoDescription'].includes(keyName)
      return <Field key={path.join('.')} label={label} value={value} onChange={next => update(path, next)} multiline={longText} direction={['slug', 'videoUrl', 'seoTitle'].includes(keyName) ? 'ltr' : undefined} />
    }
    if (typeof value === 'number') {
      return <label key={path.join('.')} className="block space-y-1.5"><span className="text-xs font-bold">{label}</span><input type="number" value={value} onChange={event => update(path, Number(event.target.value))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[#1F8A54]" /></label>
    }
    if (typeof value === 'boolean') {
      return <label key={path.join('.')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-bold"><input type="checkbox" checked={value} onChange={event => update(path, event.target.checked)} className="accent-[#1F8A54]" />{label}</label>
    }
    if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) {
        return <div key={path.join('.')} className="space-y-2"><Field label={`${label} — عنصر في كل سطر`} value={value.join('\n')} onChange={next => update(path, next.split(/\r?\n/).map(item => item.trim()).filter(Boolean))} multiline direction={['gallery', 'keywords'].includes(keyName) ? 'ltr' : undefined} />{keyName === 'gallery' && <UploadImageButton multiple onUploaded={url => update(path, [...value, url])} />}</div>
      }
      return <fieldset key={path.join('.')} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 sm:p-5">
        <legend className="px-2 text-sm font-black">{label} <span className="text-xs font-medium text-[var(--text-muted)]">({value.length})</span></legend>
        {value.map((item, index) => <div key={`${path.join('.')}-${index}`} className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 pt-10">
          <span className="absolute right-4 top-3 text-[10px] font-black text-[var(--text-muted)]">العنصر {index + 1}</span>
          <button type="button" onClick={() => update(path, value.filter((_, itemIndex) => itemIndex !== index))} aria-label={`حذف ${label} ${index + 1}`} className="absolute left-3 top-2 rounded-lg p-1.5 text-red-600 hover:bg-red-500/10"><Trash2 size={14} /></button>
          {renderField(item, [...path, index], keyName)}
        </div>)}
        <button type="button" onClick={() => update(path, [...value, cloneNewItem(DEFAULT_LANDING_SERVICE_CONTENT, path, value)])} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs font-bold hover:border-[#1F8A54]"><Plus size={14} />إضافة {label}</button>
      </fieldset>
    }
    if (value && typeof value === 'object') {
      const fields = Object.entries(value as Record<string, unknown>)
      const isRootSection = path.length === 1
      return <fieldset key={path.join('.')} className={`space-y-4 rounded-2xl border border-[var(--border)] p-4 sm:p-5 ${isRootSection ? 'bg-[var(--surface)] shadow-[var(--shadow-sm)]' : 'bg-[var(--bg-soft)]'}`}>
        {isRootSection && <legend className="px-2 text-base font-black">{label}</legend>}
        <div className="grid gap-4 md:grid-cols-2">{fields.map(([childKey, childValue]) => <div key={childKey} className={Array.isArray(childValue) || (typeof childValue === 'string' && childValue.length > 180) ? 'md:col-span-2' : ''}>{renderField(childValue, [...path, childKey], childKey)}</div>)}</div>
      </fieldset>
    }
    return null
  }

  return <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black tracking-widest text-amber-600">LANDING PAGE STUDIO</p><h1 className="mt-1 text-2xl font-black text-[var(--text-primary)]">إدارة خدمة صفحات الهبوط</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">تحكم في المقدمة والأنواع والمزايا ومعرض الأعمال والباقات وSEO من مكان واحد.</p></div><div className="flex gap-2"><a href="/services/landing" target="_blank" rel="noreferrer" className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold">معاينة الصفحة</a><button onClick={() => void save()} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{saved ? 'محفوظ' : 'حفظ التغييرات'}</button></div></header>
    {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{error} {error.toLowerCase().includes('migration') || error.includes('ترحيل') ? <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="font-black underline">افتح Supabase</a> : null}</span></div>}
    {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700"><Check size={17} />{notice}</div>}
    {loading ? <div className="flex justify-center py-20"><LoaderCircle className="animate-spin text-[#1F8A54]" /></div> : <div className="space-y-4">{Object.entries(content).map(([key, value]) => <div key={key}>{renderField(value, [key], key)}{key === 'packages' && <div className="mt-4"><YemenPricingPanel serviceKey="landing" sectionLabel="باقات صفحات الهبوط" /></div>}</div>)}</div>}
    {!loading && <div className="sticky bottom-4 flex justify-end"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-5 py-3 text-sm font-black text-white shadow-xl disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}حفظ المحتوى في Supabase</button></div>}
  </div>
}

function Field({ label, value, onChange, multiline = false, direction }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; direction?: 'ltr' | 'rtl' }) {
  const className = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#1F8A54]'
  return <label className="block space-y-1.5"><span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span>{multiline ? <textarea value={value} dir={direction} rows={4} onChange={event => onChange(event.target.value)} className={`${className} resize-y`} /> : <input value={value} dir={direction} onChange={event => onChange(event.target.value)} className={className} />}</label>
}
