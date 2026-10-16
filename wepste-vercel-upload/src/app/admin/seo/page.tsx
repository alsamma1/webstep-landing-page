'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Save, Globe, RefreshCw, CheckCircle2, Search, Loader2,
  ExternalLink, Home, Building2, Phone, Send, Briefcase,
  BookOpen, Smartphone, Store, Palette, Boxes, PanelsTopLeft,
  TrendingUp, Headset, ShieldCheck, Scale, Sparkles, Copy,
  Check, FileCode, Bot, Eye, Smartphone as MobileIcon, Monitor,
  Plus, Trash2, Tag, Database, ShieldAlert
} from 'lucide-react'
import { uploadImage } from '@/lib/supabase'

interface PageSEO {
  page_slug: string
  title: string | null
  description: string | null
  keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical: string | null
  schema_json?: any
  updated_at?: string | null
}

interface PageMeta {
  slug: string
  label: string
  category: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const PAGE_CONFIGS: PageMeta[] = [
  { slug: 'home', label: 'الصفحة الرئيسية', category: 'الأساسية', icon: Home },
  { slug: 'about', label: 'من نحن ورؤيتنا', category: 'الشركة', icon: Building2 },
  { slug: 'contact', label: 'تواصل معنا', category: 'الشركة', icon: Phone },
  { slug: 'order', label: 'تقديم طلب مشروع', category: 'الطلبات', icon: Send },
  { slug: 'careers', label: 'الوظائف والتوظيف', category: 'الشركة', icon: Briefcase },
  { slug: 'blog', label: 'المدونة التقنية', category: 'المحتوى', icon: BookOpen },
  { slug: 'services/web', label: 'تطوير المواقع والويب', category: 'الخدمات', icon: Globe },
  { slug: 'services/apps', label: 'تطبيقات الجوال', category: 'الخدمات', icon: Smartphone },
  { slug: 'services/ecommerce', label: 'المتاجر الإلكترونية', category: 'الخدمات', icon: Store },
  { slug: 'services/design', label: 'تصميم UI/UX', category: 'الخدمات', icon: Palette },
  { slug: 'services/systems', label: 'الأنظمة السحابية وSaaS', category: 'الخدمات', icon: Boxes },
  { slug: 'services/landing', label: 'صفحات الهبوط', category: 'الخدمات', icon: PanelsTopLeft },
  { slug: 'services/marketing', label: 'التسويق الرقمي والسيو', category: 'الخدمات', icon: TrendingUp },
  { slug: 'services/support', label: 'الدعم الفني والصيانة', category: 'الخدمات', icon: Headset },
  { slug: 'terms', label: 'الشروط والأحكام', category: 'القانونية', icon: Scale },
  { slug: 'privacy', label: 'سياسة الخصوصية', category: 'القانونية', icon: ShieldCheck },
]

const BASE_URL = 'https://wepste.com'

export default function SEOAdmin() {
  const [pages, setPages] = useState<PageSEO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState<string>('home')
  const [form, setForm] = useState<PageSEO | null>(null)
  const [saving, setSaving] = useState(false)
  const [syncingAll, setSyncingAll] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null)
  const [kwInput, setKwInput] = useState('')
  const [kwSearchFilter, setKwSearchFilter] = useState('')
  const [bulkKwInput, setBulkKwInput] = useState('')
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [region, setRegion] = useState<'sa' | 'ye'>('sa')
  const [activeTab, setActiveTab] = useState<'meta' | 'keywords' | 'social' | 'schema'>('meta')
  const [imageUploading, setImageUploading] = useState(false)
  const [copiedSchema, setCopiedSchema] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/seo')
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'تعذر تحميل إعدادات SEO')
      const list = Array.isArray(data) ? data : []
      setPages(list)
      const current = list.find((p: PageSEO) => p.page_slug === selectedSlug)
      if (current) {
        setForm(current)
      } else if (list.length > 0) {
        setForm(list[0])
        setSelectedSlug(list[0].page_slug)
      }
    } catch (error) {
      console.error('SEO settings load failed:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSlug])

  useEffect(() => {
    void load()
  }, [load])

  const selectPage = (slug: string) => {
    setSelectedSlug(slug)
    const page = pages.find((p) => p.page_slug === slug)
    if (page) {
      setForm(page)
    } else {
      setForm({
        page_slug: slug,
        title: '',
        description: '',
        keywords: [],
        og_title: '',
        og_description: '',
        og_image: null,
        canonical: `${BASE_URL}/${slug === 'home' ? '' : slug}`,
      })
    }
    setSavedSuccess(null)
  }

  const save = async () => {
    if (!form) return
    setSaving(true)
    setSavedSuccess(null)
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ إعدادات SEO')

      setSavedSuccess('تم حفظ إعدادات الـ SEO بنجاح في قاعدة البيانات!')
      setTimeout(() => setSavedSuccess(null), 4000)
      await load()
    } catch (error: any) {
      alert(error?.message || 'تعذر حفظ إعدادات SEO')
    } finally {
      setSaving(false)
    }
  }

  // مزامنة وحفظ كافة الـ 17 صفحة دفعة واحدة مع 100+ كلمة لكل صفحة
  const handleSyncAllPages = async () => {
    if (!confirm('هل تريد مزامنة وحفظ بيانات الـ SEO لجميع الـ 17 صفحة في قاعدة البيانات Supabase مع أكثر من 100 كلمة مفتاحية لكل قسم؟')) {
      return
    }

    setSyncingAll(true)
    setSavedSuccess(null)
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_all' }),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'فشلت المزامنة الشاملة')

      setSavedSuccess(resData.message || 'تمت مزامنة جميع الصفحات بنجاح في Supabase!')
      setTimeout(() => setSavedSuccess(null), 5000)
      await load()
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء المزامنة')
    } finally {
      setSyncingAll(false)
    }
  }

  // جلب وتعبئة كلمات مفتاحية استراتيجية حسب المنطقة الجغرافية
  const handlePopulateMasterKeywords = async (targetRegion: 'sa' | 'ye' = region) => {
    if (!form) return
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_master_keywords',
          page_slug: form.page_slug,
          region: targetRegion,
        }),
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.keywords)) {
        // Merge without duplicates
        const currentSet = new Set(form.keywords || [])
        data.keywords.forEach((k: string) => currentSet.add(k))
        const merged = Array.from(currentSet)
        setForm({
          ...form,
          keywords: merged,
          schema_json: data.schema || form.schema_json,
          ...(targetRegion === 'ye' && data.suggestedTitle && !form.title ? { title: data.suggestedTitle } : {}),
          ...(targetRegion === 'ye' && data.suggestedDescription && !form.description ? { description: data.suggestedDescription } : {}),
        })
        const regName = targetRegion === 'ye' ? 'اليمن (صنعاء، عدن، الريال اليمني)' : 'السعودية والخليج'
        setSavedSuccess(`تم توليد وإدراج كلمات استهداف ${regName}! لا تنسَ الضغط على زر الحفظ.`)
        setTimeout(() => setSavedSuccess(null), 4500)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // تحديث كود الذكاء الاصطناعي (Schema.org) للمنطقة المحددة
  const handleRegenerateSchemaForRegion = async (targetRegion: 'sa' | 'ye') => {
    if (!form) return
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_master_keywords',
          page_slug: form.page_slug,
          region: targetRegion,
        }),
      })
      const data = await res.json()
      if (res.ok && data.schema) {
        setForm({
          ...form,
          schema_json: data.schema,
        })
        setSavedSuccess(`تم تحديث بيانات الذكاء الاصطناعي JSON-LD لمنطقة ${targetRegion === 'ye' ? 'اليمن' : 'السعودية والعالم'} بنجاح! اضغط حفظ لاعتماده.`)
        setTimeout(() => setSavedSuccess(null), 4000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const addKw = () => {
    if (!form || !kwInput.trim()) return
    const trimmed = kwInput.trim()
    if (!form.keywords?.includes(trimmed)) {
      setForm({ ...form, keywords: [...(form.keywords || []), trimmed] })
    }
    setKwInput('')
  }

  const handleBulkAdd = () => {
    if (!form || !bulkKwInput.trim()) return
    const terms = bulkKwInput
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const currentSet = new Set(form.keywords || [])
    terms.forEach((t) => currentSet.add(t))
    setForm({ ...form, keywords: Array.from(currentSet) })
    setBulkKwInput('')
    setShowBulkInput(false)
  }

  const removeKw = (kw: string) => {
    if (!form) return
    setForm({ ...form, keywords: (form.keywords || []).filter((k) => k !== kw) })
  }

  const copySchemaToClipboard = () => {
    if (!form?.schema_json) return
    navigator.clipboard.writeText(JSON.stringify(form.schema_json, null, 2))
    setCopiedSchema(true)
    setTimeout(() => setCopiedSchema(false), 3000)
  }

  const activePageConfig = PAGE_CONFIGS.find((p) => p.slug === selectedSlug) || PAGE_CONFIGS[0]
  const ActiveIcon = activePageConfig.icon

  const filteredPages = PAGE_CONFIGS.filter(
    (p) => p.label.includes(searchQuery) || p.slug.includes(searchQuery)
  )

  const currentKeywords = form?.keywords || []
  const filteredKeywords = currentKeywords.filter((k) =>
    k.toLowerCase().includes(kwSearchFilter.toLowerCase())
  )

  return (
    <div className="space-y-6 text-right max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1F8A54] to-[#10b981] text-white flex items-center justify-center shadow-lg shadow-[#1F8A54]/25 shrink-0">
            <Globe size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                مركز إدارة محركات البحث (SEO & AI Engines)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A54]/15 text-[#1F8A54] text-xs font-black border border-[#1F8A54]/25 flex items-center gap-1.5">
                <Database size={12} />
                قاعدة بيانات Supabase
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              تحكم حقيقي في عناوين، أوصاف، والكلمات المفتاحية الاستراتيجية للتصدر في Google ومحركات الذكاء الاصطناعي (ChatGPT, Perplexity, Gemini) للرابط الرسمي <strong>https://wepste.com</strong>.
            </p>
          </div>
        </div>

        {/* Geographic Region Switcher in Header */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)]">
          <span className="text-xs font-black text-[var(--text-muted)] px-2">المنطقة الجغرافية:</span>
          <button
            type="button"
            onClick={() => setRegion('sa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              region === 'sa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
            }`}
          >
            <span>🇸🇦</span> السعودية والعالم
          </button>
          <button
            type="button"
            onClick={() => setRegion('ye')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              region === 'ye'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
            }`}
          >
            <span>🇾🇪</span> اليمن (صنعاء وعدن)
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
          <a
            href="/sitemap.xml"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[#1F8A54] transition-all"
            title="عرض خريطة الموقع المحدثة لمحركات البحث"
          >
            <FileCode size={14} className="text-[#1F8A54]" />
            <span>sitemap.xml</span>
            <ExternalLink size={12} className="opacity-50" />
          </a>

          <button
            type="button"
            onClick={handleSyncAllPages}
            disabled={syncingAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 hover:bg-[#1F8A54]/20 text-[#1F8A54] text-xs font-black transition-all shadow-sm"
            title="تعبئة ومزامنة جميع الـ 17 صفحة بأكثر من 100 كلمة مفتاحية دفعة واحدة في Supabase"
          >
            {syncingAll ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>مزامنة كافة الـ 17 صفحة في Supabase</span>
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving || imageUploading}
            className="btn-primary flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-lg transition-all"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1F8A54]/10 border border-[#1F8A54]/30 text-[#1F8A54] text-xs sm:text-sm font-bold shadow-sm animate-fadeIn">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Main Workspace: Sidebar & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Pages Selector) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="text-xs font-black text-[var(--text-primary)]">صفحات وأقسام الموقع ({PAGE_CONFIGS.length})</span>
              <span className="text-[10px] text-[var(--text-muted)]">اختر للتعديل</span>
            </div>

            {/* Search Filter for pages */}
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صفحة..."
                className="w-full pr-8 pl-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
              />
            </div>

            {/* List */}
            <div className="space-y-1 max-h-[640px] overflow-y-auto scrollbar-thin pr-0.5">
              {filteredPages.map((page) => {
                const isSelected = selectedSlug === page.slug
                const Icon = page.icon
                const dbPage = pages.find((p) => p.page_slug === page.slug)
                const kwCount = dbPage?.keywords?.length ?? 100

                return (
                  <button
                    key={page.slug}
                    onClick={() => selectPage(page.slug)}
                    className={`w-full text-right p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/25 ring-2 ring-[#1F8A54]/30'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#1F8A54]/10 text-[#1F8A54]'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-black">{page.label}</div>
                        <div
                          className={`text-[10px] font-mono truncate ${
                            isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          /{page.slug === 'home' ? '' : page.slug}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : kwCount >= 100
                          ? 'bg-[#1F8A54]/10 text-[#1F8A54]'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {kwCount} كلمة
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Editor Panel) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] gap-3">
              <Loader2 size={32} className="animate-spin text-[#1F8A54]" />
              <span className="text-sm font-semibold">جاري تحميل بيانات الـ SEO وقائمة الكلمات المفتاحية...</span>
            </div>
          ) : form ? (
            <div className="space-y-6">
              {/* Selected Page Header & Tabs */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1F8A54]/15 text-[#1F8A54] flex items-center justify-center shadow-sm">
                      <ActiveIcon size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--text-primary)]">
                        {activePageConfig.label}
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)] font-mono">
                        المسار: https://wepstep.sa/{form.page_slug === 'home' ? '' : form.page_slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] font-black border border-[#1F8A54]/20 flex items-center gap-1.5">
                      <Tag size={12} />
                      {form.keywords?.length || 0} كلمة مفتاحية مفعلة
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'meta', label: 'العنوان والوصف والـ SERP', icon: Search },
                    { id: 'keywords', label: `بنك الكلمات المفتاحية (${form.keywords?.length || 0})`, icon: Tag },
                    { id: 'social', label: 'المشاركة على السوشيال (OpenGraph)', icon: Globe },
                    { id: 'schema', label: 'البيانات المنظمة للذكاء الاصطناعي (Schema)', icon: Bot },
                  ].map((tab) => {
                    const TabIcon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                          isActive
                            ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/20'
                            : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <TabIcon size={14} />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* TAB 1: Meta Tags & Google SERP Preview */}
              {activeTab === 'meta' && (
                <div className="space-y-6">
                  {/* Google & AI SERP Live Preview */}
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-muted)]/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Search size={16} className="text-[#1F8A54]" />
                        <span className="text-xs font-black text-[var(--text-primary)]">
                          معاينة مباشرة في نتائج بحث Google و محركات الذكاء الاصطناعي
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() => setRegion('sa')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              region === 'sa' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            🇸🇦 السعودية
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegion('ye')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              region === 'ye' ? 'bg-emerald-600 text-white' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            🇾🇪 اليمن
                          </button>
                        </div>
                        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              previewDevice === 'desktop' ? 'bg-[#1F8A54] text-white' : 'text-[var(--text-muted)]'
                            }`}
                            title="معاينة سطح المكتب"
                          >
                            <Monitor size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              previewDevice === 'mobile' ? 'bg-[#1F8A54] text-white' : 'text-[var(--text-muted)]'
                            }`}
                            title="معاينة شاشة الجوال"
                          >
                            <MobileIcon size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div
                        className={`p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-2 font-sans transition-all ${
                          previewDevice === 'mobile' ? 'max-w-md mx-auto shadow-md' : 'w-full'
                        }`}
                      >
                        {/* URL Line */}
                        <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)] flex-wrap">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-5 h-5 rounded-full bg-[#1F8A54] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                              W
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-[var(--text-primary)]">WebStep</span>
                              <span className="mx-1.5">›</span>
                              <span>https://wepste.com/{form.page_slug === 'home' ? '' : form.page_slug}</span>
                            </div>
                          </div>
                          {region === 'ye' ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md shrink-0">
                              🇾🇪 Google اليمن (google.com.ye)
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-md shrink-0">
                              🇸🇦 Google السعودية والعالم (google.com.sa)
                            </span>
                          )}
                        </div>

                        {/* Title Line */}
                        <h3 className="text-base sm:text-lg font-bold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                          {form.title || activePageConfig.label}
                        </h3>

                        {/* Snippet Line */}
                        <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                          {form.description || 'لم يتم إضافة وصف بعد، يُنصح بكتابة وصف جذاب ومقنع بين 150 إلى 160 حرفاً.'}
                        </p>
                      </div>

                      {/* AI Search Citation Card (Perplexity & ChatGPT) */}
                      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#1F8A54]/10 via-[#10b981]/5 to-transparent border border-[#1F8A54]/25 flex items-start gap-3">
                        <Bot size={20} className="text-[#1F8A54] shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <span className="font-black text-[var(--text-primary)]">
                            جاهزية محركات بحث الذكاء الاصطناعي (GEO - AI Citations)
                          </span>
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            الصفحة مزودة بوسوم البيانات المنظمة JSON-LD والكلمات المفتاحية الاستراتيجية لتضمن ظهور اسم WebStep عند سؤال الذكاء الاصطناعي (ChatGPT Search, Perplexity, Gemini).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields Card */}
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
                    {/* Title Input */}
                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-2 flex items-center justify-between">
                        <span>عنوان الصفحة الرئيسي (Title Tag)</span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            (form.title || '').length > 60
                              ? 'text-red-500'
                              : (form.title || '').length >= 40
                              ? 'text-[#1F8A54]'
                              : 'text-amber-500'
                          }`}
                        >
                          {(form.title || '').length} / 60 حرف (المثالي: 50-60)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="العنوان الذي يظهر في نتائج البحث..."
                        className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-bold"
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-2 flex items-center justify-between">
                        <span>وصف الصفحة لمحركات البحث (Meta Description)</span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            (form.description || '').length > 160
                              ? 'text-red-500'
                              : (form.description || '').length >= 130
                              ? 'text-[#1F8A54]'
                              : 'text-amber-500'
                          }`}
                        >
                          {(form.description || '').length} / 160 حرف (المثالي: 140-160)
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="وصف تسويقي مقنع يظهر أسفل العنوان في نتائج البحث ويشجع الزائر على النقر..."
                        className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none leading-relaxed"
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-2 block">
                        الرابط الأساسي المعتمد (Canonical URL)
                      </label>
                      <input
                        type="url"
                        value={form.canonical || ''}
                        onChange={(e) => setForm({ ...form, canonical: e.target.value })}
                        placeholder="https://wepste.com/..."
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-mono focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Keywords Bank (+100 Keywords) */}
              {activeTab === 'keywords' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
                    {/* Header + Generator Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#1F8A54]/15 via-[var(--bg-muted)] to-[#10b981]/5 border border-[#1F8A54]/25">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Tag size={18} className="text-[#1F8A54]" />
                          <h3 className="text-sm font-black text-[var(--text-primary)]">
                            بنك الكلمات المفتاحية الاستراتيجي ({currentKeywords.length} كلمة)
                          </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          يضمن تصدر الموقع في نتائج بحث جوجل والمدن السعودية (الرياض، جدة، الدمام) ومحركات الذكاء الاصطناعي.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handlePopulateMasterKeywords('sa')}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
                        >
                          <Sparkles size={14} />
                          <span>🇸🇦 تعبئة كلمات السعودية والخليج</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePopulateMasterKeywords('ye')}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
                        >
                          <Sparkles size={14} />
                          <span>🇾🇪 تعبئة كلمات استهداف اليمن</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowBulkInput(!showBulkInput)}
                          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-secondary)] transition-all"
                        >
                          {showBulkInput ? 'إلغاء الإضافة المجمعة' : 'إضافة دفعة كلمات'}
                        </button>
                      </div>
                    </div>

                    {/* Bulk Input Drawer */}
                    {showBulkInput && (
                      <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-3 animate-fadeIn">
                        <label className="text-xs font-black text-[var(--text-primary)] block">
                          الصق الكلمات المفتاحية مفصولة بفواصل أو أسطر جديدة:
                        </label>
                        <textarea
                          rows={4}
                          value={bulkKwInput}
                          onChange={(e) => setBulkKwInput(e.target.value)}
                          placeholder="تطوير مواقع, برمجة تطبيقات بالرياض, تصميم متجر الكتروني, سيو وتصدر قوقل..."
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-[#1F8A54] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleBulkAdd}
                          className="btn-primary px-6 py-2 rounded-xl text-xs font-black text-white"
                        >
                          إضافة هذه الكلمات الآن
                        </button>
                      </div>
                    )}

                    {/* Single Add & Search Filter */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Add Single Keyword */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={kwInput}
                          onChange={(e) => setKwInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addKw()
                            }
                          }}
                          placeholder="أدخل كلمة مفتاحية جديدة واضغط Enter..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none font-bold"
                        />
                        <button
                          type="button"
                          onClick={addKw}
                          className="px-4 py-2.5 rounded-xl bg-[#1F8A54]/10 hover:bg-[#1F8A54]/20 text-[#1F8A54] text-xs font-black border border-[#1F8A54]/20 transition-colors flex items-center gap-1.5"
                        >
                          <Plus size={14} />
                          <span>إضافة</span>
                        </button>
                      </div>

                      {/* Search Filter for Current Keywords */}
                      <div className="relative">
                        <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={kwSearchFilter}
                          onChange={(e) => setKwSearchFilter(e.target.value)}
                          placeholder="تصفية الكلمات المعروضة بالأسفل..."
                          className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                        />
                      </div>
                    </div>

                    {/* Keywords Tag Cloud */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <span>الكلمات المفتاحية النشطة ({filteredKeywords.length}):</span>
                        {currentKeywords.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من رغبتك في مسح كافة الكلمات المفتاحية لهذه الصفحة؟')) {
                                setForm({ ...form, keywords: [] })
                              }
                            }}
                            className="text-red-500 hover:underline text-[11px]"
                          >
                            مسح الكل
                          </button>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/30 min-h-60 max-h-96 overflow-y-auto scrollbar-thin flex flex-wrap gap-2 content-start">
                        {filteredKeywords.length === 0 ? (
                          <div className="w-full flex flex-col items-center justify-center py-12 text-[var(--text-muted)] text-xs gap-2">
                            <Tag size={24} className="opacity-40" />
                            <span>لا توجد كلمات مفتاحية مطابقة. اضغط على «توليد وتعبئة +100 كلمة متصدرة» بالأعلى.</span>
                          </div>
                        ) : (
                          filteredKeywords.map((kw, i) => (
                            <span
                              key={`${kw}-${i}`}
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[#1F8A54]/40 hover:shadow-sm transition-all"
                            >
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">#{i + 1}</span>
                              <span>{kw}</span>
                              <button
                                type="button"
                                onClick={() => removeKw(kw)}
                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-0.5 rounded"
                                title="حذف الكلمة"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Social & OpenGraph */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
                    <div className="pb-3 border-b border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe size={18} className="text-[#1F8A54]" />
                        <h3 className="text-sm font-black text-[var(--text-primary)]">
                          إعدادات بطاقات المشاركة على السوشيال ميديا (OpenGraph & Twitter Card)
                        </h3>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        تظهر عند مشاركة الرابط على واتساب، تويتر/X، ولينكدإن
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                        عنوان المشاركة (og:title)
                      </label>
                      <input
                        type="text"
                        value={form.og_title || ''}
                        onChange={(e) => setForm({ ...form, og_title: e.target.value })}
                        placeholder={form.title || 'عنوان جذاب للمشاركة'}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                        وصف المشاركة (og:description)
                      </label>
                      <textarea
                        rows={2}
                        value={form.og_description || ''}
                        onChange={(e) => setForm({ ...form, og_description: e.target.value })}
                        placeholder={form.description || 'وصف مختصر ومشجع للنقر على الرابط'}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                      />
                    </div>

                    {/* Image Upload & Preview */}
                    <div>
                      <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                        صورة المشاركة (og:image) — الأبعاد الموصى بها: 1200x630
                      </label>
                      <input
                        type="text"
                        value={form.og_image || ''}
                        onChange={(e) => setForm({ ...form, og_image: e.target.value })}
                        placeholder="https://wepste.com/assets/logo/logo.png"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-mono focus:border-[#1F8A54] outline-none"
                      />

                      <div className="mt-3 flex items-center gap-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[var(--surface)] text-xs font-bold text-[var(--text-secondary)] transition-colors">
                          <Plus size={14} />
                          <span>رفع صورة جديدة من جهازك</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={imageUploading}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              e.currentTarget.value = ''
                              if (!file) return
                              setImageUploading(true)
                              try {
                                const image = await uploadImage('site', file, 'og')
                                if (image) {
                                  setForm((curr) => (curr ? { ...curr, og_image: image } : curr))
                                }
                              } catch (err: any) {
                                alert(err?.message || 'تعذر رفع الصورة')
                              } finally {
                                setImageUploading(false)
                              }
                            }}
                          />
                        </label>
                        {imageUploading && (
                          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                            <Loader2 size={13} className="animate-spin text-[#1F8A54]" />
                            جاري رفع وضغط الصورة...
                          </span>
                        )}
                      </div>

                      {form.og_image && (
                        <div className="mt-4 p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] inline-block">
                          <img
                            src={form.og_image}
                            alt="معاينة صورة OpenGraph"
                            className="h-32 w-auto max-w-full rounded-xl object-cover shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Structured Data Schema (JSON-LD) */}
              {activeTab === 'schema' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
                    <div className="pb-3 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Bot size={18} className="text-[#1F8A54]" />
                        <h3 className="text-sm font-black text-[var(--text-primary)]">
                          البيانات المنظمة للذكاء الاصطناعي وجوجل (Schema.org JSON-LD)
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Region selector for Schema */}
                        <div className="flex items-center gap-1 bg-[var(--bg-muted)] p-1 rounded-xl border border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() => handleRegenerateSchemaForRegion('sa')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              region === 'sa'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
                            }`}
                          >
                            🇸🇦 كود السعودية
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRegenerateSchemaForRegion('ye')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              region === 'ye'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
                            }`}
                          >
                            🇾🇪 كود اليمن
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={copySchemaToClipboard}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-secondary)] transition-colors"
                        >
                          {copiedSchema ? <Check size={14} className="text-[#1F8A54]" /> : <Copy size={14} />}
                          <span>{copiedSchema ? 'تم النسخ!' : 'نسخ الكود'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-[var(--text-secondary)] leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-200">
                        <span>🌐</span>
                        <span>الرابط الرسمي المعتمد في Schema ومحركات البحث: <strong>https://wepste.com</strong></span>
                      </div>
                      <p>
                        💡 <strong>التكامل الجغرافي مع محركات الذكاء الاصطناعي:</strong> يتم تضمين بيانات العنوان والمقر والهواتف بحسب المنطقة المحددة ({region === 'ye' ? 'صنعاء، اليمن، الريال اليمني، هواتف 771111357' : 'الرياض، السعودية، الريال السعودي، هواتف +966593672193'}) لتمكين نماذج ChatGPT, Perplexity, Gemini من إبراز WebStep للعملاء المحليين بدقة عالية.
                      </p>
                    </div>

                    <pre
                      dir="ltr"
                      className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] text-xs font-mono overflow-x-auto max-h-96 scrollbar-thin text-[var(--text-primary)] leading-relaxed"
                    >
                      {JSON.stringify(form.schema_json || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                  <Database size={15} className="text-[#1F8A54]" />
                  <span>
                    يتم الحفظ والمزامنة مباشرة في جدول <code>pages_seo</code> في Supabase
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-9 py-3 rounded-2xl text-sm font-black text-white shadow-lg transition-all"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>جاري الحفظ في Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>حفظ تعديلات الصفحة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
