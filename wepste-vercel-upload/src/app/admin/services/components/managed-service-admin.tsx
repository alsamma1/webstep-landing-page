'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { AlertCircle, Check, ExternalLink, LoaderCircle, Plus, Save, Trash2, UploadCloud } from 'lucide-react'
import {
  DEFAULT_MANAGED_SERVICES,
  SERVICE_CONFIG,
  managedServiceContentSchema,
  type ManagedServiceContent,
  type ManagedServiceKey,
} from '@/data/managed-services'
import { uploadImage } from '@/lib/supabase'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import YemenPricingPanel from '@/components/admin/YemenPricingPanel'

type Path = Array<string | number>

const labels: Record<string, string> = {
  hero: 'مقدمة الصفحة', eyebrow: 'العنوان التعريفي', title: 'العنوان الرئيسي', highlight: 'النص المميز',
  description: 'الوصف', primaryCta: 'زر الإجراء الرئيسي', secondaryCta: 'زر التواصل',
  intro: 'قسم التعريف بالخدمة', capabilities: 'مجالات وقدرات الخدمة', icon: 'رمز البطاقة',
  process: 'مراحل التنفيذ', projects: 'المشاريع ودراسات الحالة', id: 'المعرّف',
  slug: 'الرابط المختصر', titleEn: 'الاسم الإنجليزي', category: 'التصنيف', summary: 'ملخص المشروع',
  outcome: 'النتيجة أو الأثر', coverImage: 'صورة الغلاف', gallery: 'معرض الصور', videoUrl: 'رابط فيديو YouTube',
  externalUrl: 'رابط المشروع', tags: 'الوسوم', features: 'المميزات', published: 'منشور للعامة',
  featured: 'مشروع مميز', accentColor: 'لون التمييز', sortOrder: 'ترتيب العرض',
  seoTitle: 'عنوان SEO', seoDescription: 'وصف SEO', packages: 'الباقات والأسعار',
  name: 'اسم الباقة', price: 'السعر أو النطاق', period: 'مدة/نوع التعاقد',
  faqs: 'الأسئلة الشائعة', question: 'السؤال', answer: 'الإجابة',
  seo: 'تحسين محركات البحث', keywords: 'الكلمات المفتاحية',
}

function getPath(value: unknown, path: Path): unknown {
  return path.reduce<unknown>((current, key) => {
    if (Array.isArray(current) && typeof key === 'number') return current[key]
    if (current && typeof current === 'object' && !Array.isArray(current) && typeof key === 'string') return (current as Record<string, unknown>)[key]
    return undefined
  }, value)
}

function setPath(value: unknown, path: Path, nextValue: unknown): unknown {
  if (path.length === 0) return nextValue
  const [key, ...rest] = path
  if (Array.isArray(value) && typeof key === 'number') {
    const next = [...value]
    next[key] = setPath(next[key], rest, nextValue)
    return next
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && typeof key === 'string') {
    const record = value as Record<string, unknown>
    return { ...record, [key]: setPath(record[key], rest, nextValue) }
  }
  return value
}

function blankProject() {
  const id = `project-${crypto.randomUUID().slice(0, 8)}`
  return {
    id, slug: id, title: '', titleEn: '', category: '', summary: '', description: '', outcome: '',
    coverImage: '', gallery: [], videoUrl: '', externalUrl: '', tags: [], features: [],
    published: false, featured: false, accentColor: '#1F8A54', sortOrder: 100, seoTitle: '', seoDescription: '',
  }
}

function newItem(defaults: unknown, path: Path, existing: unknown[]): unknown {
  if (path.length === 1 && path[0] === 'projects') return blankProject()
  const sample = getPath(defaults, path)
  const template = Array.isArray(sample) ? sample[0] : existing[0]
  if (typeof template === 'string') return ''
  if (typeof template === 'number') return 0
  if (typeof template === 'boolean') return false
  if (template && typeof template === 'object') {
    const copy = structuredClone(template) as Record<string, unknown>
    if (typeof copy.id === 'string') copy.id = `item-${crypto.randomUUID().slice(0, 8)}`
    if (typeof copy.slug === 'string') copy.slug = `item-${crypto.randomUUID().slice(0, 8)}`
    for (const key of ['title', 'titleEn', 'name', 'category', 'summary', 'description', 'outcome', 'seoTitle', 'seoDescription', 'question', 'answer', 'videoUrl', 'externalUrl', 'coverImage']) {
      if (typeof copy[key] === 'string') copy[key] = ''
    }
    if (Array.isArray(copy.gallery)) copy.gallery = []
    if (Array.isArray(copy.tags)) copy.tags = []
    if (Array.isArray(copy.features)) copy.features = []
    copy.published = false
    copy.featured = false
    copy.sortOrder = 100
    return copy
  }
  return ''
}

function FileUploader({ multiple, onUploaded }: { multiple?: boolean; onUploaded: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  return <div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-[11px] font-bold hover:border-[#1F8A54]"><UploadCloud size={14} />{uploading ? 'جارٍ ضغط ورفع الصور...' : multiple ? 'رفع صور للمعرض' : 'رفع صورة من الجهاز'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} disabled={uploading} className="sr-only" onChange={async event => { const files = Array.from(event.currentTarget.files || []); event.currentTarget.value = ''; if (!files.length) return; setUploading(true); setError(''); try { const urls: string[] = []; for (const file of files) { const url = await uploadImage('projects', file, 'managed-services'); if (!url) throw new Error('لم يُرجع التخزين رابط الصورة'); urls.push(url) } onUploaded(urls) } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع الصور') } finally { setUploading(false) } }} /></label>{error && <p role="alert" className="mt-1 text-[10px] text-red-600">{error}</p>}</div>
}

export default function ManagedServiceAdmin({ serviceKey, serviceName }: { serviceKey: ManagedServiceKey; serviceName: string }) {
  const [content, setContent] = useState<ManagedServiceContent>(structuredClone(DEFAULT_MANAGED_SERVICES[serviceKey]))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const config = SERVICE_CONFIG[serviceKey]

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/services/${serviceKey}`, { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تحميل محتوى الخدمة')
      const parsed = managedServiceContentSchema.safeParse(result.content)
      if (!parsed.success) throw new Error('محتوى الخدمة المخزن لا يطابق الحقول المطلوبة')
      setContent(parsed.data)
      setSaved(result.saved === true)
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل محتوى الخدمة')
    } finally { setLoading(false) }
  }, [serviceKey])

  useEffect(() => { void load() }, [load])

  const update = (path: Path, value: unknown) => {
    setContent(current => setPath(current, path, value) as ManagedServiceContent)
    setSaved(false); setNotice('')
  }

  const save = async () => {
    const parsed = managedServiceContentSchema.safeParse(content)
    if (!parsed.success) {
      setError(`راجع الحقول المطلوبة: ${parsed.error.issues.slice(0, 5).map(issue => issue.path.join('.')).join('، ')}`)
      return
    }
    setSaving(true); setError(''); setNotice('')
    try {
      const response = await fetch(`/api/admin/services/${serviceKey}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: parsed.data }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ محتوى الخدمة')
      setSaved(true); setNotice(`تم حفظ محتوى ${serviceName} في Supabase.`)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ محتوى الخدمة')
    } finally { setSaving(false) }
  }

  const render = (value: unknown, path: Path, keyName: string): ReactNode => {
    const label = labels[keyName] || keyName
    if (typeof value === 'string') {
      if (keyName === 'coverImage') return <div key={path.join('.')} className="space-y-2"><TextField label={label} value={value} onChange={next => update(path, next)} direction="ltr" /><FileUploader onUploaded={urls => update(path, urls[0])} />{value && <div className="relative h-36 overflow-hidden rounded-xl bg-[var(--bg-muted)]"><Image src={value} alt="معاينة الصورة" fill sizes="480px" unoptimized={shouldSkipNextImageOptimization(value)} className="object-cover" /></div>}</div>
      const long = value.length > 100 || ['description', 'summary', 'outcome', 'seoDescription', 'answer'].includes(keyName)
      return <TextField key={path.join('.')} label={label} value={value} onChange={next => update(path, next)} multiline={long} direction={['slug', 'videoUrl', 'externalUrl', 'titleEn'].includes(keyName) ? 'ltr' : undefined} />
    }
    if (typeof value === 'number') return <label key={path.join('.')} className="block space-y-1.5"><span className="text-xs font-bold">{label}</span><input type="number" value={value} onChange={event => update(path, Number(event.target.value))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm" /></label>
    if (typeof value === 'boolean') return <label key={path.join('.')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-bold"><input type="checkbox" checked={value} onChange={event => update(path, event.target.checked)} className="accent-[#1F8A54]" />{label}</label>
    if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) return <div key={path.join('.')} className="space-y-2"><TextField label={`${label} — عنصر في كل سطر`} value={value.join('\n')} onChange={next => update(path, next.split(/\r?\n/).map(item => item.trim()).filter(Boolean))} multiline direction={keyName === 'gallery' ? 'ltr' : undefined} />{keyName === 'gallery' && <FileUploader multiple onUploaded={urls => update(path, [...value, ...urls])} />}</div>
      return <fieldset key={path.join('.')} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
        <legend className="px-2 text-sm font-black">{label} ({value.length})</legend>
        {value.map((item, index) => <div key={`${path.join('.')}-${index}`} className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 pt-10"><span className="absolute right-4 top-3 text-[10px] font-black text-[var(--text-muted)]">عنصر {index + 1}</span><button type="button" onClick={() => update(path, value.filter((_, i) => i !== index))} aria-label={`حذف ${label}`} className="absolute left-3 top-2 rounded-lg p-1.5 text-red-600"><Trash2 size={14} /></button>{render(item, [...path, index], keyName)}</div>)}
        <button type="button" onClick={() => update(path, [...value, newItem(DEFAULT_MANAGED_SERVICES[serviceKey], path, value)])} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs font-bold hover:border-[#1F8A54]"><Plus size={14} />إضافة {label}</button>
      </fieldset>
    }
    if (value && typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>)
      return <fieldset key={path.join('.')} className={`space-y-4 rounded-2xl border border-[var(--border)] p-4 sm:p-5 ${path.length === 1 ? 'bg-[var(--surface)] shadow-[var(--shadow-sm)]' : 'bg-[var(--bg-soft)]'}`}>
        {path.length === 1 && <legend className="px-2 text-base font-black">{label}</legend>}
        <div className="grid gap-4 md:grid-cols-2">{entries.map(([childKey, childValue]) => <div key={childKey} className={Array.isArray(childValue) || (typeof childValue === 'string' && childValue.length > 180) ? 'md:col-span-2' : ''}>{render(childValue, [...path, childKey], childKey)}</div>)}</div>
      </fieldset>
    }
    return null
  }

  return <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black tracking-widest text-emerald-600">SERVICE CONTENT STUDIO</p><h1 className="mt-1 text-2xl font-black text-[var(--text-primary)]">إدارة {serviceName}</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">حرر محتوى الصفحة والمشاريع والتفاصيل والأسعار والصور وSEO.</p></div><div className="flex gap-2"><a href={config.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold">معاينة <ExternalLink size={13} /></a><button onClick={() => void save()} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{saved ? 'محفوظ' : 'حفظ التغييرات'}</button></div></header>
    {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{error} {error.includes('ترحيل') && <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="font-black underline">افتح Supabase SQL Editor</a>}</span></div>}
    {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700"><Check size={17} />{notice}</div>}
    {loading ? <div className="flex justify-center py-20"><LoaderCircle className="animate-spin text-[#1F8A54]" /></div> : <div className="space-y-4">{Object.entries(content).map(([key, value]) => <div key={key}>{render(value, [key], key)}{key === 'packages' && <div className="mt-4"><YemenPricingPanel serviceKey={serviceKey} sectionLabel={`باقات ${serviceName}`} /></div>}</div>)}</div>}
    {!loading && <div className="sticky bottom-4 flex justify-end"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-5 py-3 text-sm font-black text-white shadow-xl disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}حفظ المحتوى في Supabase</button></div>}
  </div>
}

function TextField({ label, value, onChange, multiline = false, direction }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; direction?: 'rtl' | 'ltr'
}) {
  const className = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]'
  return <label className="block space-y-1.5"><span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span>{multiline ? <textarea value={value} dir={direction} rows={4} onChange={event => onChange(event.target.value)} className={`${className} resize-y`} /> : <input value={value} dir={direction} onChange={event => onChange(event.target.value)} className={className} />}</label>
}
