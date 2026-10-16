'use client'

import { useState, useEffect } from 'react'
import {
  Save, RefreshCw, ExternalLink, ArrowUp, ArrowDown,
  Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle,
  Sparkles, Layers, Phone, Link as LinkIcon, Compass, Palette
} from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'
import {
  DEFAULT_NAVBAR_CONFIG,
  type NavbarConfig,
  type NavbarItem,
  type DropdownMenuItem
} from '@/lib/navbar-types'

const AVAILABLE_ICONS = [
  'Globe', 'Smartphone', 'Palette', 'LayoutTemplate', 'ShoppingCart',
  'Server', 'TrendingUp', 'HeartHandshake', 'Phone', 'Users', 'Send',
  'Briefcase', 'Info', 'MessageCircle', 'BookOpen', 'Shield', 'Sparkles'
]

export default function AdminNavbarPage() {
  const [config, setConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG)
  const [activeTab, setActiveTab] = useState<'main' | 'services' | 'contact'>('main')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Load configuration from API
  useEffect(() => {
    fetch('/api/admin/navbar')
      .then(res => {
        if (!res.ok) throw new Error('فشل جلب إعدادات الشريط العلوي')
        return res.json()
      })
      .then(data => {
        if (data && !data.error) {
          setConfig(data)
        }
      })
      .catch(err => {
        console.error('Navbar fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // Save changes
  const handleSave = async () => {
    setSaving(true)
    setErrorMessage('')
    setSavedSuccess(false)

    try {
      const res = await fetch('/api/admin/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'حدث خطأ أثناء الحفظ')
      }
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  // Restore defaults
  const handleResetDefaults = () => {
    if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية للشريط العلوي؟')) {
      setConfig(DEFAULT_NAVBAR_CONFIG)
    }
  }

  // Nav Items Reordering & CRUD
  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.navItems]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIdx]
    newItems[targetIdx] = temp
    setConfig({ ...config, navItems: newItems })
  }

  const updateNavItem = (index: number, patch: Partial<NavbarItem>) => {
    const newItems = [...config.navItems]
    newItems[index] = { ...newItems[index], ...patch }
    setConfig({ ...config, navItems: newItems })
  }

  const removeNavItem = (index: number) => {
    if (confirm('هل تريد حذف هذا الرابط؟')) {
      setConfig({ ...config, navItems: config.navItems.filter((_, i) => i !== index) })
    }
  }

  const addNavItem = () => {
    const newItem: NavbarItem = {
      id: `nav-${Date.now()}`,
      label: 'رابط جديد',
      href: '#section',
      enabled: true,
    }
    setConfig({ ...config, navItems: [...config.navItems, newItem] })
  }

  // Services Menu Reordering & CRUD
  const moveServiceItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.servicesMenu]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIdx]
    newItems[targetIdx] = temp
    setConfig({ ...config, servicesMenu: newItems })
  }

  const updateServiceItem = (index: number, patch: Partial<DropdownMenuItem>) => {
    const newItems = [...config.servicesMenu]
    newItems[index] = { ...newItems[index], ...patch }
    setConfig({ ...config, servicesMenu: newItems })
  }

  const removeServiceItem = (index: number) => {
    if (confirm('هل تريد حذف هذه الخدمة من القائمة المنسدلة؟')) {
      setConfig({ ...config, servicesMenu: config.servicesMenu.filter((_, i) => i !== index) })
    }
  }

  const addServiceItem = () => {
    const newItem: DropdownMenuItem = {
      id: `svc-${Date.now()}`,
      label: 'خدمة جديدة',
      sub: 'وصف مختصر ومميز للخدمة',
      href: '/services/new',
      icon: 'Globe',
      color: '#1F8A54',
      enabled: true,
    }
    setConfig({ ...config, servicesMenu: [...config.servicesMenu, newItem] })
  }

  // Contact Menu Reordering & CRUD
  const moveContactItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.contactMenu]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIdx]
    newItems[targetIdx] = temp
    setConfig({ ...config, contactMenu: newItems })
  }

  const updateContactItem = (index: number, patch: Partial<DropdownMenuItem>) => {
    const newItems = [...config.contactMenu]
    newItems[index] = { ...newItems[index], ...patch }
    setConfig({ ...config, contactMenu: newItems })
  }

  const removeContactItem = (index: number) => {
    if (confirm('هل تريد حذف هذا العنصر؟')) {
      setConfig({ ...config, contactMenu: config.contactMenu.filter((_, i) => i !== index) })
    }
  }

  const addContactItem = () => {
    const newItem: DropdownMenuItem = {
      id: `contact-${Date.now()}`,
      label: 'صفحة جديدة',
      sub: 'تفاصيل ورابط الصفحة',
      href: '/new-page',
      icon: 'Phone',
      color: '#1F8A54',
      enabled: true,
    }
    setConfig({ ...config, contactMenu: [...config.contactMenu, newItem] })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1F8A54] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)] font-medium">جاري تحميل إعدادات الشريط العلوي...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16" dir="rtl">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#1F8A54]/10 text-[#1F8A54] mb-2">
            <Compass size={13} />
            إدارة الشريط العلوي للموقع
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            التحكم في الشريط العلوي (Navbar)
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            التحكم الكامل في الروابط، ترتيب ظهور الخدمات والأقسام، الشعار، والأزرار وربطها بـ Supabase
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:text-[#1F8A54] hover:bg-[var(--bg-soft)] transition"
          >
            <ExternalLink size={15} />
            معاينة الموقع
          </a>

          <button
            onClick={handleResetDefaults}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50/10 transition"
          >
            <RefreshCw size={15} />
            استعادة الافتراضي
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F8A54] hover:bg-[#197044] text-white text-sm font-bold shadow-lg shadow-[#1F8A54]/25 transition disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in">
          <CheckCircle2 size={18} />
          تم حفظ إعدادات الشريط العلوي وترتيب الخدمات بنجاح وربطها بقاعدة البيانات!
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-bold">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'main'
              ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/20'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]'
          }`}
        >
          <LinkIcon size={16} />
          الروابط والشريط العام
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/20'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]'
          }`}
        >
          <Layers size={16} />
          ترتيب قائمة &quot;ماذا نقدم لك&quot; ({config.servicesMenu.length})
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/20'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]'
          }`}
        >
          <Phone size={16} />
          ترتيب قائمة &quot;تواصل معنا&quot; ({config.contactMenu.length})
        </button>
      </div>

      {/* ═══ TAB 1: Main Links & General Settings ═══ */}
      {activeTab === 'main' && (
        <div className="space-y-6">
          {/* Logo & CTA Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Settings */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles size={17} className="text-[#1F8A54]" />
                إعدادات الشعار (Logo)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">بادئة الاسم</label>
                  <input
                    type="text"
                    value={config.logoTextPrefix}
                    onChange={e => setConfig({ ...config, logoTextPrefix: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#1F8A54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">اللاحقة الملونة</label>
                  <input
                    type="text"
                    value={config.logoTextSuffix}
                    onChange={e => setConfig({ ...config, logoTextSuffix: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-sm font-bold text-[#1F8A54] focus:outline-none focus:border-[#1F8A54]"
                  />
                </div>
              </div>
              <ImageUploadField
                label="أيقونة / صورة الشعار (رفع من الجهاز)"
                value={config.logoImageUrl}
                onChange={url => setConfig({ ...config, logoImageUrl: url })}
                hint="الشعار الرسمي المعتمد في زاوية الشريط العلوي"
              />
            </div>

            {/* CTA Button Settings */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ExternalLink size={17} className="text-[#1F8A54]" />
                  زر الإجراء البارز (CTA Button)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.ctaButtonEnabled}
                    onChange={e => setConfig({ ...config, ctaButtonEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F8A54]" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">نص الزر</label>
                <input
                  type="text"
                  value={config.ctaButtonText}
                  onChange={e => setConfig({ ...config, ctaButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#1F8A54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">رابط الزر</label>
                <input
                  type="text"
                  value={config.ctaButtonLink}
                  onChange={e => setConfig({ ...config, ctaButtonLink: e.target.value })}
                  placeholder="/order أو #contact"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#1F8A54]"
                />
              </div>
            </div>
          </div>

          {/* Special Items Titles & Toggles (Services, Contact, Blog) */}
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Layers size={17} className="text-[#1F8A54]" />
              عناوين القوائم المنسدلة والمدونة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Services Dropdown Title */}
              <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">قائمة الخدمات المنسدلة</span>
                  <input
                    type="checkbox"
                    checked={config.servicesDropdownEnabled}
                    onChange={e => setConfig({ ...config, servicesDropdownEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#1F8A54]"
                  />
                </div>
                <input
                  type="text"
                  value={config.servicesDropdownTitle}
                  onChange={e => setConfig({ ...config, servicesDropdownTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                />
                <p className="text-[11px] text-[var(--text-muted)]">معروض بدون أيقونة متناسقاً مع باقي الروابط</p>
              </div>

              {/* Blog Link Title */}
              <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">رابط المدونة</span>
                  <input
                    type="checkbox"
                    checked={config.blogLinkEnabled}
                    onChange={e => setConfig({ ...config, blogLinkEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#1F8A54]"
                  />
                </div>
                <input
                  type="text"
                  value={config.blogLinkTitle}
                  onChange={e => setConfig({ ...config, blogLinkTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                />
                <p className="text-[11px] text-[var(--text-muted)]">معروض بنص أنيق موحد مع الهوية البصرية</p>
              </div>

              {/* Contact Dropdown Title */}
              <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">قائمة تواصل والشركة</span>
                  <input
                    type="checkbox"
                    checked={config.contactDropdownEnabled}
                    onChange={e => setConfig({ ...config, contactDropdownEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#1F8A54]"
                  />
                </div>
                <input
                  type="text"
                  value={config.contactDropdownTitle}
                  onChange={e => setConfig({ ...config, contactDropdownTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                />
                <p className="text-[11px] text-[var(--text-muted)]">معروض بنص أنيق موحد مع الهوية البصرية</p>
              </div>
            </div>
          </div>

          {/* Main Navigation Links List & Reordering */}
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <LinkIcon size={17} className="text-[#1F8A54]" />
                  روابط أقسام الصفحة الرئيسية (ترتيب وتعديل)
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  استخدم أزرار الأسهم لتقديم أو تأخير أي رابط في الشريط العلوي
                </p>
              </div>
              <button
                type="button"
                onClick={addNavItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-bold hover:bg-[#1F8A54]/20 transition"
              >
                <Plus size={15} />
                إضافة رابط
              </button>
            </div>

            <div className="space-y-2.5">
              {config.navItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] hover:border-[#1F8A54]/30 transition"
                >
                  {/* Order indicator & movement */}
                  <div className="flex items-center gap-1">
                    <span className="w-6 text-center text-xs font-mono font-bold text-[var(--text-muted)]">
                      {idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveNavItem(idx, 'up')}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.navItems.length - 1}
                      onClick={() => moveNavItem(idx, 'down')}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.label}
                      onChange={e => updateNavItem(idx, { label: e.target.value })}
                      placeholder="عنوان الرابط"
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)]"
                    />
                  </div>

                  {/* Href */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.href}
                      onChange={e => updateNavItem(idx, { href: e.target.value })}
                      placeholder="#services أو /page"
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)]"
                    />
                  </div>

                  {/* Enabled toggle */}
                  <button
                    type="button"
                    onClick={() => updateNavItem(idx, { enabled: !item.enabled })}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                      item.enabled
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                        : 'border-gray-500/30 bg-gray-500/10 text-gray-500'
                    }`}
                    title={item.enabled ? 'مفعل في الشريط' : 'مخفي من الشريط'}
                  >
                    {item.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    {item.enabled ? 'ظاهر' : 'مخفي'}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeNavItem(idx)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50/10 transition"
                    title="حذف الرابط"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Services Menu Reordering & Management ═══ */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers size={17} className="text-[#1F8A54]" />
                  ترتيب وتهيئة خدمات قائمة &quot;ماذا نقدم لك&quot;
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  يمكنك إعادة ترتيب ظهور الخدمات في القائمة المنسدلة باستخدام أزرار الأسهم، وتعديل نصوصها وأيقوناتها وروابطها
                </p>
              </div>

              <button
                type="button"
                onClick={addServiceItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F8A54] text-white text-xs font-bold hover:bg-[#197044] transition self-start"
              >
                <Plus size={15} />
                إضافة خدمة جديدة
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {config.servicesMenu.map((svc, idx) => (
                <div
                  key={svc.id || idx}
                  className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] space-y-3 hover:border-[#1F8A54]/40 transition"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{svc.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveServiceItem(idx, 'up')}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأعلى في الترتيب"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.servicesMenu.length - 1}
                        onClick={() => moveServiceItem(idx, 'down')}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأسفل في الترتيب"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateServiceItem(idx, { enabled: !svc.enabled })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                          svc.enabled
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                            : 'border-gray-500/30 bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {svc.enabled ? 'مفعلة' : 'معطلة'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeServiceItem(idx)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50/10 transition"
                        title="حذف هذه الخدمة"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">اسم الخدمة</label>
                      <input
                        type="text"
                        value={svc.label}
                        onChange={e => updateServiceItem(idx, { label: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">وصف مختصر</label>
                      <input
                        type="text"
                        value={svc.sub}
                        onChange={e => updateServiceItem(idx, { sub: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">الرابط</label>
                      <input
                        type="text"
                        value={svc.href}
                        onChange={e => updateServiceItem(idx, { href: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">الأيقونة</label>
                        <select
                          value={svc.icon}
                          onChange={e => updateServiceItem(idx, { icon: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">لون التمييز</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={svc.color || '#1F8A54'}
                            onChange={e => updateServiceItem(idx, { color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                          />
                          <input
                            type="text"
                            value={svc.color}
                            onChange={e => updateServiceItem(idx, { color: e.target.value })}
                            className="w-full px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Contact Menu Reordering & Management ═══ */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Phone size={17} className="text-[#1F8A54]" />
                  ترتيب وتهيئة عناصر قائمة &quot;تواصل معنا&quot;
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  إعادة ترتيب عناصر تواصل معنا وصفحات الشركة والتنقل السريع داخل القائمة
                </p>
              </div>

              <button
                type="button"
                onClick={addContactItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F8A54] text-white text-xs font-bold hover:bg-[#197044] transition self-start"
              >
                <Plus size={15} />
                إضافة صفحة / عنصر
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {config.contactMenu.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] space-y-3 hover:border-[#1F8A54]/40 transition"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveContactItem(idx, 'up')}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأعلى في الترتيب"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.contactMenu.length - 1}
                        onClick={() => moveContactItem(idx, 'down')}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--surface)] disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأسفل في الترتيب"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateContactItem(idx, { enabled: !item.enabled })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                          item.enabled
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                            : 'border-gray-500/30 bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {item.enabled ? 'مفعل' : 'معطل'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeContactItem(idx)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50/10 transition"
                        title="حذف هذا العنصر"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">عنوان العنصر</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => updateContactItem(idx, { label: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">وصف مختصر</label>
                      <input
                        type="text"
                        value={item.sub}
                        onChange={e => updateContactItem(idx, { sub: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">الرابط</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={e => updateContactItem(idx, { href: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">الأيقونة</label>
                        <select
                          value={item.icon}
                          onChange={e => updateContactItem(idx, { icon: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">لون التمييز</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={item.color || '#1F8A54'}
                            onChange={e => updateContactItem(idx, { color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                          />
                          <input
                            type="text"
                            value={item.color}
                            onChange={e => updateContactItem(idx, { color: e.target.value })}
                            className="w-full px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
