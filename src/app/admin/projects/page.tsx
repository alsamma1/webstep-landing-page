'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit3, Trash2, Save, X, Star, Link as LinkIcon, RefreshCw } from 'lucide-react'
import type { Project } from '@/lib/db'
import { uploadImage } from '@/lib/supabase'

const CATEGORIES = ['مواقع ويب', 'تطبيقات جوال', 'متاجر إلكترونية', 'أنظمة رقمية', 'تصميم UI/UX', 'صفحات هبوط', 'تسويق رقمي']
const EMPTY: Omit<Project, 'id' | 'createdAt'> = { title: '', description: '', category: CATEGORIES[0], tags: [], image: '', url: '', featured: false }

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<typeof EMPTY & { id?: string }>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  const handleImageSelect = async (file?: File) => {
    if (!file) return
    setImageUploading(true)
    try {
      const image = await uploadImage('projects', file, 'portfolio')
      if (image) setForm(current => ({ ...current, image }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر رفع الصورة')
    } finally {
      setImageUploading(false)
    }
  }

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/projects')
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'تعذر تحميل المشاريع')
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Projects load failed:', error)
      setProjects([])
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  const filtered = projects.filter(p => p.title.includes(search) || p.category.includes(search))

  const save = async () => {
    if (!form.title.trim()) return alert('العنوان مطلوب')
    setSaving(true)
    try {
      const response = await fetch(form.id ? `/api/admin/projects/${form.id}` : '/api/admin/projects', {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ المشروع')
      await load()
      setModal(false)
      setForm(EMPTY)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر حفظ المشروع')
    } finally {
      setSaving(false)
    }
  }
  const del = async (id: string) => { if (!confirm('حذف المشروع؟')) return; await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' }); await load() }

  return (
    <div className="space-y-5 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">إدارة أعمالنا (Portfolio)</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{projects.length} مشروع · {projects.filter(p => p.featured).length} مميز</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal(true) }} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
          <Plus size={16} /> مشروع جديد
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو التصنيف..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-sm text-[var(--text-muted)]">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-sm text-[var(--text-muted)]">لا توجد مشاريع — أضف مشروعك الأول!</div>
        ) : filtered.map(p => (
          <div key={p.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:shadow-lg transition-all">
            <div className="h-40 bg-gradient-to-br from-[#1F8A54]/20 to-[#6366f1]/20 relative">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
              {p.featured && (
                <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f59e0b] text-white text-[9px] font-black">
                  <Star size={9} /> مميز
                </span>
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-bold">{p.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-sm text-[var(--text-primary)] mb-1">{p.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border)]">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ ...p }); setModal(true) }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--bg-muted)] flex items-center justify-center gap-1">
                  <Edit3 size={12} /> تعديل
                </button>
                {p.url && <a href={p.url} target="_blank" className="py-2 px-3 rounded-xl text-xs font-bold border border-[var(--border)] hover:text-[#1F8A54]"><LinkIcon size={12} /></a>}
                <button onClick={() => del(p.id)} className="py-2 px-3 rounded-xl text-xs border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-muted)]">
              <h3 className="font-black text-base text-[var(--text-primary)]">{form.id ? 'تعديل مشروع' : 'إضافة مشروع'}</h3>
              <button onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black mb-1.5 block">اسم المشروع *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">التصنيف</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black mb-1.5 block">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black mb-1.5 block">صورة المشروع</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={imageUploading}
                    onChange={e => { void handleImageSelect(e.target.files?.[0]); e.currentTarget.value = '' }}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs" />
                  {imageUploading && <span className="text-xs text-[var(--text-muted)]">ضغط الصورة ورفعها...</span>}
                  {form.image && <img src={form.image} alt="معاينة صورة المشروع" className="mt-2 h-24 w-full rounded-lg object-cover" />}
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block">رابط المشروع</label>
                  <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black mb-1.5 block">الوسوم</label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput('') } } }}
                    placeholder="وسم + Enter" className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(t => <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#1F8A54]/10 text-[#1F8A54]">{t} <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={9} /></button></span>)}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
                <span className="text-sm font-bold text-[var(--text-primary)]">مشروع مميز (يظهر في القسم الأول)</span>
              </label>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-bold">إلغاء</button>
                <button onClick={save} disabled={saving || imageUploading} className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                  <Save size={14} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
