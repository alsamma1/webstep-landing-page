'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  AlertCircle, Check, ExternalLink, Eye, ImagePlus, LoaderCircle,
  Plus, Save, Trash2, UploadCloud, X,
} from 'lucide-react'
import { uploadImage } from '@/lib/supabase'
import { parseUiuxDesign, type UiuxDesign } from '@/data/uiux-designs'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import YemenPricingPanel from '@/components/admin/YemenPricingPanel'

function makeBlankDesign(): UiuxDesign {
  const id = `design-${crypto.randomUUID().slice(0, 8)}`
  return {
    id, slug: id, title: '', titleEn: '', category: '', summary: '', description: '',
    coverImage: '', gallery: [], tags: [], features: [], outcome: '', accentColor: '#1F8A54',
    videoUrl: '', figmaUrl: '', published: false, featured: false, sortOrder: 100,
    seoTitle: '', seoDescription: '',
  }
}

function Field({ label, value, onChange, multiline = false, hint, direction }: {
  label: string; value: string; onChange: (value: string) => void
  multiline?: boolean; hint?: string; direction?: 'ltr' | 'rtl'
}) {
  const className = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]'
  return <label className="block space-y-1.5"><span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span>{hint && <span className="block text-[10px] leading-5 text-[var(--text-muted)]">{hint}</span>}
    {multiline ? <textarea value={value} onChange={event => onChange(event.target.value)} rows={4} dir={direction} className={`${className} resize-y`} /> : <input value={value} onChange={event => onChange(event.target.value)} dir={direction} className={className} />}
  </label>
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const handleUpload = async (file?: File) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const url = await uploadImage('projects', file, 'uiux-designs')
      if (!url) throw new Error('لم يُرجع التخزين رابط الصورة')
      onChange(url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع الصورة')
    } finally { setUploading(false) }
  }
  return <div className="space-y-2"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span><label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-bold"><UploadCloud size={13} />{uploading ? 'جارٍ الرفع...' : 'رفع من الجهاز'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => { void handleUpload(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} /></label></div><input dir="ltr" value={value} onChange={event => onChange(event.target.value)} placeholder="أو الصق رابط الصورة" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs outline-none focus:border-[#1F8A54]" />{error && <p role="alert" className="text-xs text-red-600">{error}</p>}{value && <div className="relative h-40 overflow-hidden rounded-xl bg-[var(--bg-muted)]"><Image src={value} alt={`معاينة ${label}`} fill sizes="480px" unoptimized={shouldSkipNextImageOptimization(value)} className="object-cover" /></div>}</div>
}

export default function AdminUiuxDesignsPage() {
  const [designs, setDesigns] = useState<UiuxDesign[]>([])
  const [form, setForm] = useState<UiuxDesign | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadDesigns = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/admin/designs', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تحميل التصاميم')
      setDesigns(result.designs)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل التصاميم')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void loadDesigns() }, [loadDesigns])

  const update = <K extends keyof UiuxDesign>(key: K, value: UiuxDesign[K]) => setForm(current => current ? { ...current, [key]: value } : current)

  const save = async () => {
    if (!form) return
    const parsed = parseUiuxDesign(form)
    if (!parsed.success) {
      setError(`راجع الحقول المطلوبة: ${parsed.error.issues.slice(0, 4).map(issue => issue.path.join('.')).join('، ')}`)
      return
    }
    setSaving(true); setError(''); setNotice('')
    try {
      const isExisting = designs.some(design => design.id === form.id)
      const response = await fetch('/api/admin/designs', {
        method: isExisting ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ التصميم')
      setForm(null); setNotice('تم حفظ التصميم في Supabase.'); await loadDesigns()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ التصميم')
    } finally { setSaving(false) }
  }

  const remove = async (design: UiuxDesign) => {
    if (!window.confirm(`هل تريد حذف «${design.title}»؟`)) return
    setError('')
    try {
      const response = await fetch(`/api/admin/designs?id=${encodeURIComponent(design.id)}`, { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حذف التصميم')
      setNotice('تم حذف التصميم.'); await loadDesigns()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف التصميم')
    }
  }

  return <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black tracking-widest text-[#1F8A54]">UI / UX PORTFOLIO</p><h1 className="mt-1 text-2xl font-black text-[var(--text-primary)]">إدارة مشاريع التصميم</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">أضف دراسات الحالة والصور والميزات والفيديو وروابط Figma وبيانات SEO.</p></div><button onClick={() => { setError(''); setForm(makeBlankDesign()) }} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> مشروع جديد</button></header>
    {error && <div role="alert" className="flex gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"><AlertCircle size={17} className="shrink-0" />{error}{error.includes('ترحيل') && <a className="font-black underline" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">افتح Supabase SQL Editor</a>}</div>}
    {notice && <div role="status" className="flex gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700"><Check size={17} />{notice}</div>}
    {form && <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-7">
      <div className="flex items-center justify-between"><h2 className="text-lg font-black">{designs.some(design => design.id === form.id) ? 'تعديل دراسة التصميم' : 'إضافة دراسة تصميم'}</h2><button aria-label="إغلاق" onClick={() => setForm(null)} className="rounded-lg p-2 hover:bg-[var(--bg-muted)]"><X size={18} /></button></div>
      <div className="grid gap-4 md:grid-cols-2"><Field label="عنوان المشروع *" value={form.title} onChange={value => update('title', value)} /><Field label="العنوان بالإنجليزية" value={form.titleEn} onChange={value => update('titleEn', value)} direction="ltr" /><Field label="الرابط المختصر (slug) *" value={form.slug} onChange={value => update('slug', value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} direction="ltr" hint="أحرف إنجليزية صغيرة وأرقام وشرطات فقط" /><Field label="التصنيف *" value={form.category} onChange={value => update('category', value)} /><Field label="نبذة مختصرة *" value={form.summary} onChange={value => update('summary', value)} multiline /><Field label="قصة المشروع ووصفه *" value={form.description} onChange={value => update('description', value)} multiline /><div className="md:col-span-2"><ImageUpload label="صورة الغلاف" value={form.coverImage} onChange={value => update('coverImage', value)} /></div><Field label="صور المعرض (رابط في كل سطر)" value={form.gallery.join('\n')} onChange={value => update('gallery', value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))} multiline direction="ltr" hint="ارفع الصور أدناه أو الصق روابط صور صالحة، حتى 30 صورة." /><Field label="الميزات (ميزة في كل سطر)" value={form.features.join('\n')} onChange={value => update('features', value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))} multiline /><Field label="النتيجة أو أثر التصميم" value={form.outcome} onChange={value => update('outcome', value)} multiline /><Field label="الوسوم (وسم في كل سطر)" value={form.tags.join('\n')} onChange={value => update('tags', value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))} multiline /><Field label="رابط فيديو YouTube" value={form.videoUrl} onChange={value => update('videoUrl', value)} direction="ltr" /><Field label="رابط Figma / Prototype" value={form.figmaUrl} onChange={value => update('figmaUrl', value)} direction="ltr" /><label className="block space-y-2"><span className="text-xs font-bold">لون التمييز</span><input type="color" value={form.accentColor} onChange={event => update('accentColor', event.target.value)} className="h-11 w-full cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1" /></label><Field label="ترتيب العرض" value={String(form.sortOrder)} onChange={value => update('sortOrder', Number(value) || 0)} /><Field label="عنوان SEO" value={form.seoTitle} onChange={value => update('seoTitle', value)} /><Field label="وصف SEO" value={form.seoDescription} onChange={value => update('seoDescription', value)} multiline /><div className="flex flex-wrap items-center gap-5 md:col-span-2"><label className="inline-flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={event => update('published', event.target.checked)} className="accent-[#1F8A54]" /> منشور للعامة</label><label className="inline-flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.featured} onChange={event => update('featured', event.target.checked)} className="accent-[#1F8A54]" /> مشروع مميز</label></div></div>
      <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-4"><p className="mb-3 inline-flex items-center gap-2 text-xs font-black"><ImagePlus size={15} /> رفع صور إضافية من الجهاز</p><div className="grid gap-3 sm:grid-cols-2"><GalleryUploader onUploaded={url => update('gallery', [...form.gallery, url])} /></div><p className="mt-2 text-[10px] text-[var(--text-muted)]">تُضغط الصور وتُرفع إلى Supabase Storage في مجلد uiux-designs.</p></div>
      <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4"><button onClick={() => setForm(null)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold">إلغاء</button><button disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />} حفظ في Supabase</button></div>
    </section>}

    <YemenPricingPanel serviceKey="design" sectionLabel="باقات تصميم الهويات والواجهات UI/UX" />

    {loading ? <div className="flex justify-center py-16"><LoaderCircle className="animate-spin text-[#1F8A54]" /></div> : designs.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-muted)]">لا توجد مشاريع في قاعدة البيانات بعد. تحقق من ترحيل جدول uiux_designs ثم أضف أول مشروع.</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{designs.map(design => <article key={design.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"><div className="relative h-48 bg-[var(--bg-muted)]">{design.coverImage && <Image src={design.coverImage} alt={design.title} fill sizes="400px" unoptimized={shouldSkipNextImageOptimization(design.coverImage)} className="object-cover" />}<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${design.published ? 'bg-emerald-600 text-white' : 'bg-black/70 text-white'}`}>{design.published ? 'منشور' : 'مسودة'}</span></div><div className="space-y-3 p-4"><div><h3 className="font-black">{design.title}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{design.category} · {design.gallery.length} صور</p></div><p className="line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{design.summary}</p><div className="flex items-center gap-2 border-t border-[var(--border)] pt-3"><button onClick={() => { setError(''); setForm(design) }} className="flex-1 rounded-lg bg-[var(--bg-muted)] px-3 py-2 text-xs font-bold">تعديل</button><a href={`/services/design/${design.slug}`} target="_blank" rel="noreferrer" aria-label="معاينة" className="rounded-lg border border-[var(--border)] p-2"><Eye size={15} /></a><button onClick={() => void remove(design)} aria-label="حذف" className="rounded-lg border border-red-500/20 p-2 text-red-600"><Trash2 size={15} /></button><a href="/services/design" target="_blank" rel="noreferrer" aria-label="صفحة الخدمة" className="rounded-lg border border-[var(--border)] p-2"><ExternalLink size={15} /></a></div></div></article>)}</div>}
  </div>
}

function GalleryUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  return <div><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-xs font-bold hover:border-[#1F8A54]">{uploading ? <LoaderCircle size={14} className="animate-spin" /> : <UploadCloud size={14} />}{uploading ? 'جارٍ الرفع...' : 'اختيار صورة'}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={async event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return; setUploading(true); setError(''); try { const url = await uploadImage('projects', file, 'uiux-designs'); if (!url) throw new Error('لم يُرجع التخزين رابط الصورة'); onUploaded(url) } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع الصورة') } finally { setUploading(false) } }} /></label>{error && <p role="alert" className="mt-1 text-[10px] text-red-600">{error}</p>}</div>
}
