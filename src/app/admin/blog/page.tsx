'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Plus, Search, Edit3, Trash2, Save, X, Eye,
  Image as ImageIcon, Upload, Globe, Tag, FileText, Loader2,
  Video, MessageSquare, Type, List, Quote, Minus, Link2,
  GripVertical, ChevronUp, ChevronDown, Check, ExternalLink,
  LayoutGrid, AlignLeft, Trash, CheckCircle2, RefreshCw
} from 'lucide-react'
import type { BlogPost, BlogComment, ContentBlock, ContentBlockType } from '@/lib/supabase.types'
import { uploadImage } from '@/lib/supabase'

const CATEGORIES = ['عام', 'تطوير المواقع والأنظمة', 'السيو والذكاء الاصطناعي', 'تصميم واجهات UI/UX', 'استراتيجيات ونمو الأعمال', 'ملفات الأعمال والصفحات الشخصية']

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '',
  content_blocks: [] as ContentBlock[],
  cover_image: '', gallery: [] as string[], video_url: '',
  category: 'عام', tags: [] as string[],
  author: 'فريق WebStep', author_role: 'فريق التحرير', author_avatar: '',
  read_time: 5, published: false,
  seo_title: '', seo_description: '', seo_keywords: [] as string[],
  og_image: '', canonical_url: ''
}

function generateId() { return Math.random().toString(36).slice(2, 9) }

const BLOCK_TYPES: { type: ContentBlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'heading', label: 'عنوان فرعي', icon: <Type size={14} /> },
  { type: 'paragraph', label: 'فقرة نصية', icon: <AlignLeft size={14} /> },
  { type: 'image', label: 'صورة', icon: <ImageIcon size={14} /> },
  { type: 'gallery', label: 'معرض صور', icon: <LayoutGrid size={14} /> },
  { type: 'quote', label: 'اقتباس', icon: <Quote size={14} /> },
  { type: 'list', label: 'قائمة نقطية', icon: <List size={14} /> },
  { type: 'video', label: 'فيديو يوتيوب', icon: <Video size={14} /> },
  { type: 'link', label: 'رابط داخلي', icon: <Link2 size={14} /> },
  { type: 'divider', label: 'فاصل', icon: <Minus size={14} /> },
]

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [tab, setTab] = useState<'content' | 'blocks' | 'media' | 'seo' | 'comments'>('content')
  const [form, setForm] = useState<typeof EMPTY_FORM & { id?: string }>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [kwInput, setKwInput] = useState('')
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const blockImageRef = useRef<HTMLInputElement>(null)
  const [activeBlockImageId, setActiveBlockImageId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/blog')
      const data = await r.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch { setPosts([]) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = posts.filter(p => p.title?.includes(search) || p.category?.includes(search))

  const handleTitle = (v: string) => {
    const slug = v.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '').slice(0, 80)
    setForm(f => ({ ...f, title: v, slug: f.id ? f.slug : slug }))
  }

  // ─── رفع صورة الغلاف ────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading('cover')
    try {
      const url = await uploadImage('blog', file, 'covers')
      if (url) setForm(f => ({ ...f, cover_image: url, og_image: f.og_image || url }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'فشل رفع الصورة')
    } finally {
      setUploading(null)
      if (coverRef.current) coverRef.current.value = ''
    }
  }

  // ─── رفع صور المعرض ─────────────────────────────────────────
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading('gallery')
    const urls: string[] = []
    try {
      for (const file of files) {
        const url = await uploadImage('blog', file, 'gallery')
        if (url) urls.push(url)
      }
      setForm(f => ({ ...f, gallery: [...(f.gallery || []), ...urls] }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'فشل رفع صور المعرض')
    } finally {
      setUploading(null)
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  // ─── رفع صورة داخل block ────────────────────────────────────
  const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !activeBlockImageId) return
    setUploading('block-' + activeBlockImageId)
    try {
      const url = await uploadImage('blog', file, 'blocks')
      if (url) {
        setForm(f => ({
          ...f,
          content_blocks: f.content_blocks.map(b =>
            b.id === activeBlockImageId ? { ...b, url } : b
          )
        }))
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'فشل رفع الصورة')
    } finally {
      setUploading(null)
      setActiveBlockImageId(null)
      if (blockImageRef.current) blockImageRef.current.value = ''
    }
  }

  // ─── Content Blocks CRUD ─────────────────────────────────────
  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(), type,
      ...(type === 'heading' ? { level: 2, text: '' } : {}),
      ...(type === 'paragraph' ? { content: '' } : {}),
      ...(type === 'quote' ? { content: '' } : {}),
      ...(type === 'image' ? { url: '', caption: '', position: 'full' } : {}),
      ...(type === 'gallery' ? { urls: [], caption: '' } : {}),
      ...(type === 'list' ? { items: [''], ordered: false } : {}),
      ...(type === 'video' ? { videoUrl: '' } : {}),
      ...(type === 'link' ? { href: '', label: '', internal: true } : {}),
      ...(type === 'divider' ? {} : {}),
    }
    setForm(f => ({ ...f, content_blocks: [...f.content_blocks, newBlock] }))
  }

  const updateBlock = (id: string, patch: Partial<ContentBlock>) => {
    setForm(f => ({ ...f, content_blocks: f.content_blocks.map(b => b.id === id ? { ...b, ...patch } : b) }))
  }

  const removeBlock = (id: string) => {
    setForm(f => ({ ...f, content_blocks: f.content_blocks.filter(b => b.id !== id) }))
  }

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    setForm(f => {
      const arr = [...f.content_blocks]
      const idx = arr.findIndex(b => b.id === id)
      if (dir === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      if (dir === 'down' && idx < arr.length - 1) [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      return { ...f, content_blocks: arr }
    })
  }

  // ─── Save ─────────────────────────────────────────────────────
  const save = async () => {
    if (!form.title.trim()) return alert('العنوان مطلوب')
    if (!form.slug.trim()) return alert('الرابط (Slug) مطلوب')
    setSaving(true)
    const { id: _id, ...payload } = form
    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id ? `/api/admin/blog/${form.id}` : '/api/admin/blog'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'خطأ في الحفظ')
      await load()
      setModal(false)
      setForm(EMPTY_FORM)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر حفظ المقال')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: string) => {
    if (!confirm('حذف المقال نهائياً؟')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    await load()
  }

  const togglePublish = async (p: BlogPost) => {
    await fetch(`/api/admin/blog/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published })
    })
    await load()
  }

  const openEdit = (p: BlogPost) => {
    setForm({
      ...EMPTY_FORM,
      ...p,
      id: p.id,
      content_blocks: (p.content_blocks as ContentBlock[]) || [],
      gallery: p.gallery || [],
      tags: p.tags || [],
      seo_keywords: p.seo_keywords || [],
      video_url: p.video_url || '',
      author_role: p.author_role || 'فريق التحرير',
      author_avatar: p.author_avatar || '',
    } as typeof EMPTY_FORM & { id: string })
    setTab('content')
    setModal(true)
  }

  // ─── جلب التعليقات للمقال الحالي ─────────────────────────────
  const loadComments = async (slug: string) => {
    setLoadingComments(true)
    try {
      const r = await fetch(`/api/blog/${slug}/comments`)
      setComments(await r.json())
    } catch { setComments([]) }
    setLoadingComments(false)
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('حذف التعليق؟')) return
    await fetch(`/api/admin/blog/${form.id}/comments/${commentId}`, { method: 'DELETE' })
    if (form.slug) loadComments(form.slug)
  }

  const toggleApprove = async (commentId: string, approved: boolean) => {
    await fetch(`/api/admin/blog/${form.id}/comments/${commentId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !approved })
    })
    if (form.slug) loadComments(form.slug)
  }

  useEffect(() => {
    if (tab === 'comments' && form.id && form.slug) loadComments(form.slug)
  }, [tab, form.id, form.slug])

  // ─── Render Block Editor ──────────────────────────────────────
  const renderBlock = (block: ContentBlock, idx: number) => {
    const isFirst = idx === 0
    const isLast = idx === form.content_blocks.length - 1
    const isUploadingThis = uploading === 'block-' + block.id

    return (
      <div key={block.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden">
        {/* Block header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <GripVertical size={14} />
            <span className="font-bold">{BLOCK_TYPES.find(b => b.type === block.type)?.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => moveBlock(block.id, 'up')} disabled={isFirst} className="p-1 rounded hover:bg-[var(--bg-muted)] disabled:opacity-30"><ChevronUp size={13} /></button>
            <button onClick={() => moveBlock(block.id, 'down')} disabled={isLast} className="p-1 rounded hover:bg-[var(--bg-muted)] disabled:opacity-30"><ChevronDown size={13} /></button>
            <button onClick={() => removeBlock(block.id)} className="p-1 rounded hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500"><Trash size={13} /></button>
          </div>
        </div>

        {/* Block body */}
        <div className="p-3 space-y-2">
          {block.type === 'heading' && (
            <div className="flex gap-2">
              <select value={block.level || 2} onChange={e => updateBlock(block.id, { level: +e.target.value as 2 | 3 | 4 })}
                className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
                <option value={2}>H2 - عنوان رئيسي</option>
                <option value={3}>H3 - عنوان ثانوي</option>
                <option value={4}>H4 - عنوان صغير</option>
              </select>
              <input value={block.text || ''} onChange={e => updateBlock(block.id, { text: e.target.value })}
                placeholder="نص العنوان الفرعي..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-bold focus:border-[#1F8A54] outline-none" />
            </div>
          )}

          {(block.type === 'paragraph' || block.type === 'quote') && (
            <textarea value={block.content || ''} onChange={e => updateBlock(block.id, { content: e.target.value })}
              placeholder={block.type === 'quote' ? 'نص الاقتباس...' : 'اكتب الفقرة هنا...'}
              rows={block.type === 'quote' ? 2 : 4}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm resize-none focus:border-[#1F8A54] outline-none" />
          )}

          {block.type === 'image' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input ref={blockImageRef} type="file" accept="image/*" onChange={handleBlockImageUpload} className="hidden" />
                <button type="button" onClick={() => { setActiveBlockImageId(block.id); blockImageRef.current?.click() }}
                  disabled={!!uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs hover:border-[#1F8A54]/50 transition-all">
                  {isUploadingThis ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span>{isUploadingThis ? 'جاري الرفع...' : 'رفع صورة'}</span>
                </button>
                <input value={block.url || ''} onChange={e => updateBlock(block.id, { url: e.target.value })}
                  placeholder="أو الصق رابط الصورة..." dir="ltr"
                  className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
                <select value={block.position || 'full'} onChange={e => updateBlock(block.id, { position: e.target.value as ContentBlock['position'] })}
                  className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
                  <option value="full">عرض كامل</option>
                  <option value="center">وسط</option>
                  <option value="right">يمين</option>
                  <option value="left">يسار</option>
                </select>
              </div>
              <input value={block.caption || ''} onChange={e => updateBlock(block.id, { caption: e.target.value })}
                placeholder="تعليق على الصورة (اختياري)"
                className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
              {block.url && <img src={block.url} alt="" className="h-24 rounded-lg object-cover" />}
            </div>
          )}

          {block.type === 'gallery' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button type="button" onClick={() => { setActiveBlockImageId(block.id + '-gallery'); blockImageRef.current?.click() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs hover:border-[#1F8A54]/50">
                  <Upload size={12} /> إضافة صور
                </button>
                <input placeholder="رابط صورة + Enter" dir="ltr"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) { updateBlock(block.id, { urls: [...(block.urls || []), val] }); (e.target as HTMLInputElement).value = '' }
                    }
                  }}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(block.urls || []).map((u, i) => (
                  <div key={i} className="relative">
                    <img src={u} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={() => updateBlock(block.id, { urls: block.urls!.filter((_, j) => j !== i) })}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <X size={8} />
                    </button>
                  </div>
                ))}
              </div>
              <input value={block.caption || ''} onChange={e => updateBlock(block.id, { caption: e.target.value })}
                placeholder="تعليق على المعرض"
                className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
            </div>
          )}

          {block.type === 'list' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={!!block.ordered} onChange={e => updateBlock(block.id, { ordered: e.target.checked })} />
                  قائمة مرقمة
                </label>
              </div>
              {(block.items || ['']).map((item, i) => (
                <div key={i} className="flex gap-1.5">
                  <input value={item} onChange={e => {
                    const items = [...(block.items || [])]
                    items[i] = e.target.value
                    updateBlock(block.id, { items })
                  }}
                    placeholder={`عنصر ${i + 1}`}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] outline-none" />
                  <button onClick={() => updateBlock(block.id, { items: (block.items || []).filter((_, j) => j !== i) })}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500"><Trash size={11} /></button>
                </div>
              ))}
              <button onClick={() => updateBlock(block.id, { items: [...(block.items || []), ''] })}
                className="text-xs text-[#1F8A54] hover:underline flex items-center gap-1">
                <Plus size={11} /> إضافة عنصر
              </button>
            </div>
          )}

          {block.type === 'video' && (
            <div>
              <input value={block.videoUrl || ''} onChange={e => updateBlock(block.id, { videoUrl: e.target.value })}
                placeholder="رابط يوتيوب: https://www.youtube.com/watch?v=..." dir="ltr"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-mono focus:border-[#1F8A54] outline-none" />
              {block.videoUrl && (
                <div className="mt-2 text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#1F8A54]" /> تم إضافة رابط الفيديو
                </div>
              )}
            </div>
          )}

          {block.type === 'link' && (
            <div className="grid grid-cols-2 gap-2">
              <input value={block.href || ''} onChange={e => updateBlock(block.id, { href: e.target.value })}
                placeholder="الرابط: /blog/slug أو https://..." dir="ltr"
                className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
              <input value={block.label || ''} onChange={e => updateBlock(block.id, { label: e.target.value })}
                placeholder="نص الرابط"
                className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none" />
              <label className="flex items-center gap-1.5 text-xs cursor-pointer col-span-2">
                <input type="checkbox" checked={!!block.internal} onChange={e => updateBlock(block.id, { internal: e.target.checked })} />
                رابط داخلي (نفس الموقع)
              </label>
            </div>
          )}

          {block.type === 'divider' && (
            <div className="border-t-2 border-dashed border-[var(--border)] my-1 opacity-50" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">إدارة المدونة</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {posts.length} مقال · {posts.filter(p => p.published).length} منشور
          </p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setTab('content'); setModal(true) }}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
          <Plus size={16} /> مقال جديد
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] outline-none" />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
              <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">المقال</th>
              <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)] hidden md:table-cell">التصنيف</th>
              <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)] hidden lg:table-cell">المشاهدات / الإعجابات</th>
              <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">الحالة</th>
              <th className="px-4 py-3 text-xs font-black text-[var(--text-muted)]">إجراءات</th>
            </tr></thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading
                ? <tr><td colSpan={5} className="text-center py-10 text-sm text-[var(--text-muted)]"><Loader2 size={20} className="animate-spin mx-auto mb-2" />جاري التحميل...</td></tr>
                : filtered.length === 0
                  ? <tr><td colSpan={5} className="text-center py-10 text-sm text-[var(--text-muted)]">لا توجد مقالات</td></tr>
                  : filtered.map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg bg-[#1F8A54]/10 overflow-hidden shrink-0">
                            {p.cover_image
                              ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                              : <FileText size={16} className="m-auto mt-2 text-[#1F8A54]/50" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">{p.title}</div>
                            <div className="text-[10px] text-[var(--text-muted)] font-mono">/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-[var(--text-secondary)]">{p.category}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-2">
                          <Eye size={11} /> {p.views?.toLocaleString('ar') || 0}
                          <span className="text-red-400">♥ {p.likes || 0}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublish(p)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-black transition-all ${p.published ? 'bg-[#1F8A54]/10 text-[#1F8A54]' : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
                          {p.published ? '✓ منشور' : 'مسودة'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {p.published && (
                            <a href={`/blog/${p.slug}`} target="_blank"
                              className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[#1F8A54]">
                              <Eye size={14} />
                            </a>
                          )}
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[#1F8A54]">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => del(p.id)}
                            className="p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[var(--text-muted)] hover:text-[#ef4444]">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Modal ══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--bg-muted)]">
              <div className="flex-1">
                <h3 className="font-black text-base text-[var(--text-primary)]">{form.id ? 'تعديل المقال' : 'مقال جديد'}</h3>
                {form.slug && <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">/blog/{form.slug}</div>}
              </div>
              {/* Tabs */}
              <div className="flex rounded-xl border border-[var(--border)] overflow-hidden text-xs">
                {[
                  { id: 'content', label: 'المحتوى', icon: FileText },
                  { id: 'blocks', label: 'الأقسام', icon: LayoutGrid },
                  { id: 'media', label: 'الوسائط', icon: ImageIcon },
                  { id: 'seo', label: 'SEO', icon: Globe },
                  ...(form.id ? [{ id: 'comments', label: 'التعليقات', icon: MessageSquare }] : []),
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                    className={`flex items-center gap-1 px-3 py-2 font-bold transition-all ${tab === t.id ? 'bg-[#1F8A54] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]'}`}>
                    <t.icon size={12} /> {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-[var(--bg-soft)]"><X size={16} /></button>
            </div>

            <div className="p-5 space-y-4 max-h-[76vh] overflow-y-auto">

              {/* ─── Tab: المحتوى الأساسي ─── */}
              {tab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black mb-1.5 block">عنوان المقال *</label>
                    <input value={form.title} onChange={e => handleTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black mb-1.5 block">الرابط (Slug) *</label>
                      <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black mb-1.5 block">التصنيف</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black mb-1.5 block">المقتطف (يظهر في قائمة المدونة)</label>
                    <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-black mb-1.5 block">محتوى المقال النصي (Markdown مدعوم)</label>
                    <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none font-mono" dir="rtl" />
                  </div>

                  <div>
                    <label className="text-xs font-black mb-1.5 block">الوسوم</label>
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput('') } } }}
                      placeholder="وسم + Enter"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map(t => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#1F8A54]/10 text-[#1F8A54]">
                          {t} <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={9} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-black mb-1.5 block">الكاتب</label>
                      <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black mb-1.5 block">صفة الكاتب</label>
                      <input value={form.author_role} onChange={e => setForm(f => ({ ...f, author_role: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black mb-1.5 block">وقت القراءة (دقائق)</label>
                      <input type="number" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: +e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none" />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">نشر المقال فوراً</span>
                  </label>
                </div>
              )}

              {/* ─── Tab: الأقسام الغنية (Content Blocks) ─── */}
              {tab === 'blocks' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#1F8A54]/8 border border-[#1F8A54]/20 text-xs text-[#1F8A54] font-bold">
                    أضف أقساماً غنية للمقال: عناوين فرعية، صور، معارض، روابط، اقتباسات، وفيديوهات يوتيوب
                  </div>

                  {/* أزرار إضافة Block */}
                  <div className="flex flex-wrap gap-2">
                    {BLOCK_TYPES.map(bt => (
                      <button key={bt.type} onClick={() => addBlock(bt.type)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold hover:border-[#1F8A54] hover:text-[#1F8A54] transition-all">
                        {bt.icon} {bt.label}
                      </button>
                    ))}
                  </div>

                  {/* قائمة الـ Blocks */}
                  <input ref={blockImageRef} type="file" accept="image/*" onChange={handleBlockImageUpload} className="hidden" />
                  <div className="space-y-3">
                    {form.content_blocks.length === 0
                      ? <div className="text-center py-8 text-sm text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-xl">اضغط على أي زر بالأعلى لإضافة قسم</div>
                      : form.content_blocks.map((b, i) => renderBlock(b, i))
                    }
                  </div>
                </div>
              )}

              {/* ─── Tab: الوسائط ─── */}
              {tab === 'media' && (
                <div className="space-y-5">
                  {/* صورة الغلاف */}
                  <div>
                    <label className="text-xs font-black mb-2 block">صورة الغلاف الرئيسية</label>
                    <div className="flex gap-2">
                      <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      <button type="button" onClick={() => coverRef.current?.click()} disabled={!!uploading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm hover:border-[#1F8A54]/50 hover:text-[#1F8A54] transition-all">
                        {uploading === 'cover' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>{uploading === 'cover' ? 'جاري الرفع...' : 'رفع من الجهاز'}</span>
                      </button>
                      <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                        placeholder="أو الصق رابط الصورة..." dir="ltr"
                        className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none" />
                    </div>
                    {form.cover_image && <img src={form.cover_image} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-[var(--border)]" />}
                  </div>

                  {/* رابط الفيديو */}
                  <div>
                    <label className="text-xs font-black mb-2 block flex items-center gap-1.5"><Video size={13} className="text-[#1F8A54]" /> رابط فيديو يوتيوب</label>
                    <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..." dir="ltr"
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none" />
                    {form.video_url && (
                      <div className="mt-2 text-xs text-[#1F8A54] flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> تم إضافة رابط يوتيوب — سيظهر مُدمجاً في المقال
                      </div>
                    )}
                  </div>

                  {/* معرض الصور */}
                  <div>
                    <label className="text-xs font-black mb-2 block flex items-center gap-1.5"><LayoutGrid size={13} className="text-[#1F8A54]" /> معرض صور المقال</label>
                    <div className="flex gap-2 mb-3">
                      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                      <button type="button" onClick={() => galleryRef.current?.click()} disabled={!!uploading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm hover:border-[#1F8A54]/50 hover:text-[#1F8A54] transition-all">
                        {uploading === 'gallery' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>{uploading === 'gallery' ? 'جاري الرفع...' : 'رفع صور متعددة'}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(form.gallery || []).map((url, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-[var(--border)]" />
                          <button onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }))}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={10} />
                          </button>
                          <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded">{i + 1}</span>
                        </div>
                      ))}
                      {(form.gallery || []).length === 0 && (
                        <div className="col-span-4 text-center py-6 text-xs text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-xl">لا توجد صور في المعرض</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Tab: SEO ─── */}
              {tab === 'seo' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#1F8A54]/8 border border-[#1F8A54]/20 text-xs text-[#1F8A54] font-bold">
                    ✓ عند النشر، يُضاف المقال تلقائياً إلى Sitemap ويمكن لـ Google فهرسته خلال ساعات
                  </div>
                  <div>
                    <label className="text-xs font-black mb-1.5 flex justify-between">
                      <span>عنوان SEO</span>
                      <span className={`text-[10px] ${(form.seo_title || form.title).length > 60 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>{(form.seo_title || form.title).length}/60</span>
                    </label>
                    <input value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                      placeholder={form.title || 'عنوان يظهر في نتائج البحث'}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-black mb-1.5 flex justify-between">
                      <span>وصف SEO</span>
                      <span className={`text-[10px] ${(form.seo_description || form.excerpt || '').length > 160 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>{(form.seo_description || form.excerpt || '').length}/160</span>
                    </label>
                    <textarea value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} rows={3}
                      placeholder={form.excerpt || 'وصف يظهر أسفل العنوان في Google'}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm resize-none focus:border-[#1F8A54] outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-black mb-1.5 block">الكلمات المفتاحية</label>
                    <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (kwInput.trim()) { setForm(f => ({ ...f, seo_keywords: [...f.seo_keywords, kwInput.trim()] })); setKwInput('') } } }}
                      placeholder="كلمة مفتاحية + Enter"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {form.seo_keywords.map(k => (
                        <span key={k} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#6366f1]/10 text-[#6366f1]">
                          {k} <button onClick={() => setForm(f => ({ ...f, seo_keywords: f.seo_keywords.filter(x => x !== k) }))}><X size={9} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Google Preview */}
                  <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--bg-muted)]">
                    <div className="text-xs font-black text-[var(--text-muted)] mb-3">معاينة Google:</div>
                    <div className="text-[11px] text-[var(--text-muted)]">wepstep.sa › blog › {form.slug || 'slug'}</div>
                    <div className="text-[15px] font-bold text-[#1a0dab] line-clamp-1">{form.seo_title || form.title || 'عنوان المقال'}</div>
                    <div className="text-xs text-[#545454] line-clamp-2">{form.seo_description || form.excerpt || 'وصف المقال...'}</div>
                  </div>
                </div>
              )}

              {/* ─── Tab: التعليقات ─── */}
              {tab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">تعليقات المقال ({comments.length})</h4>
                    <button onClick={() => form.slug && loadComments(form.slug)} className="text-xs text-[#1F8A54] flex items-center gap-1">
                      <RefreshCw size={11} /> تحديث
                    </button>
                  </div>
                  {loadingComments
                    ? <div className="text-center py-8"><Loader2 size={20} className="animate-spin mx-auto text-[var(--text-muted)]" /></div>
                    : comments.length === 0
                      ? <div className="text-center py-8 text-sm text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-xl">لا توجد تعليقات على هذا المقال</div>
                      : comments.map(c => (
                        <div key={c.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-[var(--text-primary)]">{c.name}</span>
                                {c.email && <span className="text-[10px] text-[var(--text-muted)] font-mono">{c.email}</span>}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${c.approved ? 'bg-[#1F8A54]/10 text-[#1F8A54]' : 'bg-orange-100 text-orange-600'}`}>
                                  {c.approved ? '✓ مقبول' : 'معلق'}
                                </span>
                                {c.parent_id && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">رد</span>}
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{c.content}</p>
                              <div className="text-[10px] text-[var(--text-muted)] mt-1">{new Date(c.created_at).toLocaleDateString('ar-SA')}</div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => toggleApprove(c.id, c.approved)}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[#1F8A54]" title={c.approved ? 'إلغاء القبول' : 'قبول'}>
                                <Check size={13} />
                              </button>
                              <button onClick={() => deleteComment(c.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}

              {/* ─── Actions ─── */}
              <div className="flex gap-2 pt-2 border-t border-[var(--border)] sticky bottom-0 bg-[var(--surface)] pb-1">
                <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold">إلغاء</button>
                <button type="button" onClick={save} disabled={saving || !!uploading}
                  className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin shrink-0" /> : <Save size={14} className="shrink-0" />}
                  <span>{saving ? 'جاري الحفظ...' : form.published ? 'نشر وحفظ' : 'حفظ مسودة'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
