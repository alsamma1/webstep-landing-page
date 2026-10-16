'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle, Check, ExternalLink, Eye, ImagePlus, LoaderCircle,
  Plus, Save, Smartphone, Trash2, UploadCloud, X,
} from 'lucide-react'
import Image from 'next/image'
import { uploadImage } from '@/lib/supabase'
import { parseMobileApp, type MobileApp } from '@/data/mobile-apps'
import { shouldSkipNextImageOptimization } from '@/lib/image-optimization'
import YemenPricingPanel from '@/components/admin/YemenPricingPanel'

function createEmptyApp(): MobileApp {
  const id = `app-${crypto.randomUUID().slice(0, 8)}`
  return {
    id,
    slug: id,
    name: '',
    nameEn: '',
    category: '',
    tagline: '',
    description: '',
    badge: '',
    accentColor: '#1F8A54',
    iconUrl: '',
    coverImage: '',
    screenshots: [],
    features: [],
    videoUrl: '',
    iosUrl: '',
    androidUrl: '',
    downloadUrl: '',
    qrImageUrl: '',
    size: '',
    downloads: '',
    rating: '',
    purchasePrice: '',
    subscriptionPrice: '',
    published: false,
    featured: false,
    sortOrder: 100,
    seoTitle: '',
    seoDescription: '',
  }
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  const className = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#1F8A54]'
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${className} resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  )
}

function ImageField({
  label,
  value,
  onChange,
  hint,
  preserveSharpness = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  preserveSharpness?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (file?: File) => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadImage('projects', file, 'mobile-apps', preserveSharpness ? 'lossless' : 'balanced')
      if (!url) throw new Error('لم يُرجع التخزين رابط الصورة')
      onChange(url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'تعذر رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-[var(--text-secondary)]">{label}</span>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] transition hover:border-[#1F8A54]">
          {uploading ? <LoaderCircle size={13} className="animate-spin" /> : <UploadCloud size={13} />}
          {uploading ? 'جارٍ الرفع...' : 'رفع من الجهاز'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={event => {
              void handleFile(event.target.files?.[0])
              event.currentTarget.value = ''
            }}
          />
        </label>
      </div>
      {hint && <p className="text-[11px] leading-5 text-[var(--text-muted)]">{hint}</p>}
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="أو الصق رابط الصورة"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#1F8A54]"
        dir="ltr"
      />
      {uploadError && <p role="alert" className="text-xs text-red-600">{uploadError}</p>}
      {value && (
        <div className="relative h-32 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]">
          <Image src={value} alt={`معاينة ${label}`} fill unoptimized={shouldSkipNextImageOptimization(value)} sizes="(max-width: 640px) 100vw, 480px" className="object-contain" />
        </div>
      )}
    </div>
  )
}

export default function AdminAppsPage() {
  const [apps, setApps] = useState<MobileApp[]>([])
  const [form, setForm] = useState<MobileApp | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadApps = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/apps', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تحميل التطبيقات')
      setApps(result.apps)
      setSaved(result.saved === true)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'حدث خطأ أثناء تحميل التطبيقات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadApps() }, [])

  const update = <K extends keyof MobileApp>(key: K, value: MobileApp[K]) => {
    setForm(current => current ? { ...current, [key]: value } : current)
  }

  const saveApp = async () => {
    if (!form) return
    const parsed = parseMobileApp(form)
    if (!parsed.success) {
      setError(`راجع الحقول المطلوبة: ${parsed.error.issues.slice(0, 3).map(issue => issue.path.join('.')).join('، ')}`)
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const isNew = !apps.some(app => app.id === form.id)
      const response = await fetch(isNew ? '/api/admin/apps' : `/api/admin/apps/${encodeURIComponent(form.id)}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ التطبيق')
      setForm(null)
      setNotice('تم حفظ بيانات التطبيق في Supabase بنجاح.')
      await loadApps()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'حدث خطأ أثناء حفظ التطبيق')
    } finally {
      setSaving(false)
    }
  }

  const deleteApp = async (app: MobileApp) => {
    if (!window.confirm(`هل تريد حذف «${app.name}» من كتالوج التطبيقات؟`)) return
    setError('')
    try {
      const response = await fetch(`/api/admin/apps/${encodeURIComponent(app.id)}`, { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حذف التطبيق')
      setNotice('تم حذف التطبيق.')
      await loadApps()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'حدث خطأ أثناء الحذف')
    }
  }

  const updateFeature = (index: number, key: 'title' | 'description', value: string) => {
    if (!form) return
    const features = [...form.features]
    features[index] = { ...features[index], [key]: value }
    update('features', features)
  }

  const updateScreenshot = (index: number, value: string) => {
    if (!form) return
    const screenshots = [...form.screenshots]
    screenshots[index] = value
    update('screenshots', screenshots)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1F8A54]">
            <Smartphone size={15} /> إدارة كتالوج التطبيقات
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] sm:text-3xl">التطبيقات وتفاصيلها</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            أدر تفاصيل كل تطبيق وصوره وروابط المتاجر والتنزيل وفيديو الشرح ورمز QR. تحفظ التغييرات في Supabase وتظهر في الموقع بعد النشر.
          </p>
        </div>
        <button
          onClick={() => { setError(''); setNotice(''); setForm(createEmptyApp()) }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1F8A54] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#176840]"
        >
          <Plus size={17} /> إضافة تطبيق
        </button>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700"><Check size={17} />{notice}</div>}
      {!saved && !loading && <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800">المعروض حالياً هو المحتوى الافتراضي. احفظ أو أضف تطبيقاً لنقل الكتالوج إلى جدول الإعدادات في Supabase.</div>}

      {form && (
        <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="font-black text-[var(--text-primary)]">{apps.some(app => app.id === form.id) ? 'تعديل بيانات التطبيق' : 'إضافة تطبيق جديد'}</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">الحقول الإلزامية مميزة بعلامة *</p>
            </div>
            <button onClick={() => setForm(null)} aria-label="إغلاق المحرر" className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"><X size={18} /></button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="اسم التطبيق *" value={form.name} onChange={v => update('name', v)} />
            <TextField label="الاسم بالإنجليزية" value={form.nameEn} onChange={v => update('nameEn', v)} />
            <TextField label="التصنيف *" value={form.category} onChange={v => update('category', v)} />
            <TextField label="المعرّف الرابط (slug) *" value={form.slug} onChange={v => update('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="my-mobile-app" />
            <TextField label="شارة التطبيق" value={form.badge} onChange={v => update('badge', v)} />
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-[var(--text-secondary)]">لون الهوية</span>
              <input type="color" value={form.accentColor} onChange={e => update('accentColor', e.target.value)} className="h-10 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1" />
            </label>
            <div className="sm:col-span-2 lg:col-span-3"><TextField label="نبذة قصيرة *" value={form.tagline} onChange={v => update('tagline', v)} multiline /></div>
            <div className="sm:col-span-2 lg:col-span-3"><TextField label="الوصف الكامل *" value={form.description} onChange={v => update('description', v)} multiline /></div>
            <TextField label="السعر/الملكية" value={form.purchasePrice} onChange={v => update('purchasePrice', v)} />
            <TextField label="السعر السحابي/الاشتراك" value={form.subscriptionPrice} onChange={v => update('subscriptionPrice', v)} />
            <TextField label="حجم التطبيق" value={form.size} onChange={v => update('size', v)} placeholder="مثال: ٢٨ ميغابايت" />
            <TextField label="التقييم (اختياري)" value={form.rating} onChange={v => update('rating', v)} placeholder="مثال: 4.9" />
            <TextField label="عدد التنزيلات (اختياري)" value={form.downloads} onChange={v => update('downloads', v)} />
            <TextField label="ترتيب العرض" value={String(form.sortOrder)} onChange={v => update('sortOrder', Number.parseInt(v, 10) || 0)} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ImageField label="أيقونة التطبيق" value={form.iconUrl} onChange={v => update('iconUrl', v)} hint="ترفع إلى Supabase Storage بعد ضغطها، أو الصق رابط صورة." />
            <ImageField label="صورة الغلاف الرئيسية" value={form.coverImage} onChange={v => update('coverImage', v)} />
            <ImageField label="صورة رمز QR للتنزيل" value={form.qrImageUrl} onChange={v => update('qrImageUrl', v)} preserveSharpness hint="تُحفظ هذه الصورة بصيغة PNG دون فقدان التفاصيل لتحافظ على قابلية المسح. اربط رمز QR برابط التنزيل أدناه." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="رابط فيديو YouTube" value={form.videoUrl} onChange={v => update('videoUrl', v)} placeholder="https://youtu.be/..." />
            <TextField label="رابط تنزيل مباشر (APK أو ملف)" value={form.downloadUrl} onChange={v => update('downloadUrl', v)} placeholder="https://..." />
            <TextField label="رابط App Store" value={form.iosUrl} onChange={v => update('iosUrl', v)} placeholder="https://apps.apple.com/..." />
            <TextField label="رابط Google Play" value={form.androidUrl} onChange={v => update('androidUrl', v)} placeholder="https://play.google.com/..." />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-[var(--text-primary)]">صور شاشات التطبيق</h3>
              <button onClick={() => update('screenshots', [...form.screenshots, ''])} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-bold hover:border-[#1F8A54]"><ImagePlus size={14} /> إضافة صورة</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {form.screenshots.map((url, index) => (
                <div key={`${index}-${url.slice(0, 20)}`} className="space-y-2 rounded-xl border border-[var(--border)] p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                    <span>لقطة شاشة {index + 1}</span>
                    <button onClick={() => update('screenshots', form.screenshots.filter((_, i) => i !== index))} aria-label="حذف الصورة" className="text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <ImageField label="" value={url} onChange={value => updateScreenshot(index, value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-[var(--text-primary)]">المميزات</h3>
              <button onClick={() => update('features', [...form.features, { title: '', description: '' }])} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-bold hover:border-[#1F8A54]"><Plus size={14} /> إضافة ميزة</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {form.features.map((feature, index) => (
                <div key={index} className="space-y-2 rounded-xl border border-[var(--border)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)]">ميزة {index + 1}</span>
                    <button onClick={() => update('features', form.features.filter((_, i) => i !== index))} aria-label="حذف الميزة" className="text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <TextField label="العنوان" value={feature.title} onChange={v => updateFeature(index, 'title', v)} />
                  <TextField label="التفاصيل" value={feature.description} onChange={v => updateFeature(index, 'description', v)} multiline />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="عنوان SEO" value={form.seoTitle} onChange={v => update('seoTitle', v)} />
            <TextField label="وصف SEO" value={form.seoDescription} onChange={v => update('seoDescription', v)} multiline />
          </div>
          <div className="flex flex-wrap gap-5 border-t border-[var(--border)] pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} className="accent-[#1F8A54]" /> منشور للعامة</label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-[#1F8A54]" /> تطبيق مميز</label>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">
            <button onClick={() => setForm(null)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold">إلغاء</button>
            <button onClick={() => void saveApp()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1F8A54] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} حفظ في Supabase
            </button>
          </div>
        </section>
      )}

      <YemenPricingPanel serviceKey="apps" sectionLabel="باقات تطوير وتصميم التطبيقات" />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-[var(--text-muted)]"><LoaderCircle size={18} className="animate-spin" /> جارٍ تحميل التطبيقات...</div>
      ) : apps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center text-sm text-[var(--text-secondary)]">لا توجد تطبيقات بعد. أضف التطبيق الأول للبدء.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map(app => (
            <article key={app.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center gap-3 p-4">
                {app.iconUrl || app.coverImage ? (
                  <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)]">
                    <Image src={app.iconUrl || app.coverImage} alt="" fill unoptimized={shouldSkipNextImageOptimization(app.iconUrl || app.coverImage)} sizes="56px" className="object-cover" />
                  </span>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white" style={{ background: app.accentColor }}>{app.name.slice(0, 1) || <Smartphone />}</div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-black text-[var(--text-primary)]">{app.name}</h2>
                  <p className="truncate text-xs text-[var(--text-muted)]">{app.category}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${app.published ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'}`}>{app.published ? 'منشور' : 'مسودة'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] p-3">
                <a href={`/services/apps/${app.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[#1F8A54]"><ExternalLink size={13} /> معاينة</a>
                <div className="flex gap-1">
                  <button onClick={() => { setError(''); setForm(app) }} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#1F8A54] hover:bg-green-500/10"><Eye size={13} /> تعديل</button>
                  <button onClick={() => void deleteApp(app)} aria-label={`حذف ${app.name}`} className="rounded-lg p-1.5 text-red-600 hover:bg-red-500/10"><Trash2 size={14} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
