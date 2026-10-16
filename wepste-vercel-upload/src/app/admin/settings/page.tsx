'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Save, RefreshCw, Globe, Phone, Palette, Shield,
  CheckCircle2, Lock, ChevronLeft, Sliders, Share2,
  Search, AlertTriangle, Building, Image as ImageIcon,
  DollarSign, Clock, ShieldCheck, Check
} from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface SettingsData {
  // General & Identity
  siteName: string
  siteUrl: string
  logoTextPrefix: string
  logoTextSuffix: string
  logoImageUrl: string
  currency: string
  crNumber: string
  copyrightNotice: string

  // Contact
  email: string
  supportEmail: string
  phone: string
  whatsapp: string
  address: string
  workingHours: string

  // Social
  socialLinks: {
    twitter: string
    instagram: string
    linkedin: string
    tiktok: string
    youtube: string
    github: string
    telegram: string
    facebook: string
  }

  // SEO
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  googleVerification: string
  googleAnalyticsId: string

  // System
  primaryColor: string
  secondaryColor: string
  maintenanceMode: boolean
  maintenanceMessage: string
  allowOrders: boolean
  allowMessages: boolean
}

const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'WebStep',
  siteUrl: 'https://wepstep.sa',
  logoTextPrefix: 'Web',
  logoTextSuffix: 'Step',
  logoImageUrl: '/assets/logo/logo.png',
  currency: 'ر.س',
  crNumber: '',
  copyrightNotice: 'جميع الحقوق محفوظة لـ WebStep © 2026',

  email: 'hello@wepstep.sa',
  supportEmail: 'support@wepstep.sa',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',

  socialLinks: {
    twitter: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    github: '',
    telegram: '',
    facebook: '',
  },

  seoTitle: 'WebStep — حلول رقمية وتطوير مواقع احترافية بدفعة واحدة',
  seoDescription: 'ويب ستيب متخصصة في بناء وتطوير مواقع الويب وتطبيقات الجوال والأنظمة السحابية للشركات ورواد الأعمال والمستقلين.',
  seoKeywords: ['تطوير مواقع', 'تصميم ويب', 'سعودية', 'Next.js', 'بورتفوليو', 'متاجر إلكترونية'],
  googleVerification: '',
  googleAnalyticsId: 'G-30E5FSM42H',

  primaryColor: '#1F8A54',
  secondaryColor: '#10b981',
  maintenanceMode: false,
  maintenanceMessage: 'الموقع حالياً يخضع لترقية وتحديث مجدول. سنعود للعمل قريباً جداً!',
  allowOrders: true,
  allowMessages: true,
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo' | 'system'>('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [keywordInput, setKeywordInput] = useState('')

  // Load from API
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
            socialLinks: {
              ...DEFAULT_SETTINGS.socialLinks,
              ...(data.socialLinks || {}),
            },
            seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords : DEFAULT_SETTINGS.seoKeywords,
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Save changes
  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ إعدادات الموقع')
      setSaved(true)
      setTimeout(() => setSaved(false), 3500)
    } catch (err: any) {
      alert(err.message || 'تعذر حفظ إعدادات الموقع')
    } finally {
      setSaving(false)
    }
  }

  // Keywords tag adder
  const handleAddKeyword = () => {
    const val = keywordInput.trim()
    if (val && !settings.seoKeywords.includes(val)) {
      setSettings((prev) => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, val],
      }))
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (kw: string) => {
    setSettings((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((k) => k !== kw),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-sm text-[var(--text-muted)] gap-2">
        <RefreshCw size={18} className="animate-spin text-[#1F8A54]" />
        <span>جاري جلب إعدادات الموقع من قاعدة البيانات...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      {/* ══ HEADER ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
              إعدادات الموقع والهوية
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F8A54]/10 text-[#1F8A54] border border-[#1F8A54]/20">
              Supabase Live
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            التحكم في بيانات WebStep، الشعار، التواصل، محركات البحث SEO، وأمان النظام
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
            saved ? 'bg-[#1F8A54]' : 'btn-primary'
          }`}
        >
          {saved ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : saving ? (
            <RefreshCw size={16} className="animate-spin shrink-0" />
          ) : (
            <Save size={16} className="shrink-0" />
          )}
          <span>{saved ? 'تم الحفظ بنجاح!' : saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      {/* ══ ACCOUNT SECURITY QUICK BANNER ══ */}
      <Link
        href="/admin/account"
        className="flex items-center justify-between p-4 rounded-3xl border border-[#1F8A54]/30 bg-gradient-to-l from-[#1F8A54]/10 via-[var(--surface)] to-[var(--surface)] hover:border-[#1F8A54] transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#1F8A54] text-white flex items-center justify-center shadow-md shrink-0">
            <Lock size={18} />
          </div>
          <div>
            <div className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors flex items-center gap-1.5">
              <span>أمان حساب المدير العام وكلمة المرور</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F8A54]/20 text-[#1F8A54] font-bold">
                حسابي
              </span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              تغيير كلمة المرور الرئيسية، اسم المستخدم، وبيانات تسجيل دخول الإدارة
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#1F8A54]">
          <span>فتح الأمان</span>
          <ChevronLeft size={16} />
        </div>
      </Link>

      {/* ══ NAVIGATION TABS ══ */}
      <div className="flex border-b border-[var(--border)] overflow-x-auto scrollbar-none gap-1">
        {[
          { key: 'general' as const, label: 'الهوية والمعلومات العامة', icon: Globe },
          { key: 'contact' as const, label: 'بيانات التواصل والمقر', icon: Phone },
          { key: 'social' as const, label: 'منصات التواصل', icon: Share2 },
          { key: 'seo' as const, label: 'محركات البحث وSEO', icon: Search },
          { key: 'system' as const, label: 'حالة النظام والصيانة', icon: Sliders },
        ].map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-[#1F8A54] text-[#1F8A54]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* ══ TAB 1: GENERAL & IDENTITY ══ */}
      {activeTab === 'general' && (
        <div className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                اسم الموقع والعلامة التجارية *
              </label>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                رابط الموقع الرسمي (URL) *
              </label>
              <input
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                dir="ltr"
                placeholder="https://wepstep.sa"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>

          {/* Logo configuration */}
          <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] space-y-4">
            <div className="text-xs font-black text-[var(--text-primary)] flex items-center gap-2">
              <ImageIcon size={15} className="text-[#1F8A54]" />
              <span>إعدادات شعار الموقع (Logo)</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                  بادئة نص الشعار (مثل Web)
                </label>
                <input
                  value={settings.logoTextPrefix}
                  onChange={(e) => setSettings({ ...settings, logoTextPrefix: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold focus:border-[#1F8A54] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                  لاحقة نص الشعار (الملونة - مثل Step)
                </label>
                <input
                  value={settings.logoTextSuffix}
                  onChange={(e) => setSettings({ ...settings, logoTextSuffix: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[#1F8A54] focus:border-[#1F8A54] outline-none"
                />
              </div>
            </div>

            <ImageUploadField
              label="أو صورة الشعار (PNG / SVG)"
              value={settings.logoImageUrl}
              onChange={(url) => setSettings({ ...settings, logoImageUrl: url })}
              bucket="site"
              folder="logo"
            />
          </div>

          {/* Business & Legal */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                العملة الرسمية المستخدمة
              </label>
              <input
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                placeholder="ر.س"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                رقم السجل التجاري / وثيقة العمل الحر
              </label>
              <input
                value={settings.crNumber}
                onChange={(e) => setSettings({ ...settings, crNumber: e.target.value })}
                placeholder="مثال: FL-102938475 أو 1010XXXXXX"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>

          {/* Copyright notice */}
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
              نص حقوق الملكية في أسفل الموقع (Footer Copyright)
            </label>
            <input
              value={settings.copyrightNotice}
              onChange={(e) => setSettings({ ...settings, copyrightNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
            />
          </div>
        </div>
      )}

      {/* ══ TAB 2: CONTACT & LOCATION ══ */}
      {activeTab === 'contact' && (
        <div className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                البريد الإلكتروني الرسمي للتواصل *
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                بريد الدعم الفني والمبيعات
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                رقم الهاتف المباشر
              </label>
              <input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                dir="ltr"
                placeholder="+966500000000"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                رقم واتساب المباشر للعملاء (بدون + أو أصفار إضافية) *
              </label>
              <input
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value.replace(/[^\d]/g, '') })}
                dir="ltr"
                placeholder="966500000000"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                العنوان الجغرافي / المقر
              </label>
              <input
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="الرياض، المملكة العربية السعودية"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                أوقات العمل والدعم الفني
              </label>
              <input
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 3: SOCIAL MEDIA ══ */}
      {activeTab === 'social' && (
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="text-xs text-[var(--text-secondary)] mb-2">
            ضع روابط الحسابات الرسمية لـ WebStep، وستظهر تلقائياً في التذييل وصفحات التواصل:
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'twitter' as const, label: 'منصة X (تويتر)', placeholder: 'https://x.com/webstep_sa' },
              { key: 'instagram' as const, label: 'انستغرام (Instagram)', placeholder: 'https://instagram.com/webstep_sa' },
              { key: 'linkedin' as const, label: 'لينكد إن (LinkedIn)', placeholder: 'https://linkedin.com/company/webstep' },
              { key: 'tiktok' as const, label: 'تيك توك (TikTok)', placeholder: 'https://tiktok.com/@webstep_sa' },
              { key: 'youtube' as const, label: 'يوتيوب (YouTube)', placeholder: 'https://youtube.com/@webstep' },
              { key: 'github' as const, label: 'جيت هب (GitHub)', placeholder: 'https://github.com/webstep' },
              { key: 'telegram' as const, label: 'تيليجرام (Telegram)', placeholder: 'https://t.me/webstep_sa' },
              { key: 'facebook' as const, label: 'فيسبوك (Facebook)', placeholder: 'https://facebook.com/webstep' },
            ].map((s) => (
              <div key={s.key}>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                  {s.label}
                </label>
                <input
                  value={settings.socialLinks[s.key] || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, [s.key]: e.target.value },
                    })
                  }
                  dir="ltr"
                  placeholder={s.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB 4: SEO & ANALYTICS ══ */}
      {activeTab === 'seo' && (
        <div className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
              عنوان الموقع ومحركات البحث (SEO Title)
            </label>
            <input
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
            />
            <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              الطول: {settings.seoTitle.length} حرف (الموصى به: 50 - 60 حرف)
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
              الوصف التعريفي للبحث (Meta Description)
            </label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none resize-none"
            />
            <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              الطول: {settings.seoDescription.length} حرف (الموصى به: 140 - 160 حرف)
            </div>
          </div>

          {/* Keywords tags */}
          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
              الكلمات المفتاحية الدلالية (Keywords)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="أدخل كلمة أو عبارة واضغط إضافة..."
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="btn-primary px-4 py-2 text-xs font-bold"
              >
                إضافة
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {settings.seoKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)]"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-[var(--text-muted)] hover:text-rose-500 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                رمز التحقق من Google Search Console
              </label>
              <input
                value={settings.googleVerification}
                onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                dir="ltr"
                placeholder="مثال: google-site-verification=..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-mono focus:border-[#1F8A54] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                معرف Google Analytics (GA4 Measurement ID)
              </label>
              <input
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                dir="ltr"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-mono focus:border-[#1F8A54] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 5: SYSTEM & BRANDING ══ */}
      {activeTab === 'system' && (
        <div className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          {/* Maintenance Mode */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              settings.maintenanceMode
                ? 'border-rose-500/30 bg-rose-500/5'
                : 'border-[var(--border)] bg-[var(--bg-muted)]'
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 font-black text-sm text-[var(--text-primary)]">
                  <AlertTriangle
                    size={16}
                    className={settings.maintenanceMode ? 'text-rose-500' : 'text-[var(--text-muted)]'}
                  />
                  <span>وضع الصيانة للموقع (Maintenance Mode)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  عند تفعيل هذا الخيار، سيظهر للزوار شاشة صيانة مؤقتة بدلاً من صفحات الموقع
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${
                  settings.maintenanceMode ? 'bg-rose-500' : 'bg-[var(--surface)] border border-[var(--border)]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    settings.maintenanceMode ? 'right-1' : 'right-7'
                  }`}
                />
              </button>
            </div>

            {settings.maintenanceMode && (
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1 block">
                  رسالة الصيانة التي تظهر للزوار:
                </label>
                <input
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs focus:border-rose-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Orders & Messages Switches */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[var(--text-primary)]">استقبال الطلبات الجديدة</div>
                <div className="text-[11px] text-[var(--text-muted)]">إتاحة إرسال طلبات المشاريع من صفحة اطلب مشروعك</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowOrders: !settings.allowOrders })}
                className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${
                  settings.allowOrders ? 'bg-[#1F8A54]' : 'bg-[var(--surface)] border border-[var(--border)]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    settings.allowOrders ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[var(--text-primary)]">استقبال رسائل التواصل</div>
                <div className="text-[11px] text-[var(--text-muted)]">إتاحة استقبال الرسائل عبر نموذج تواصل معنا المباشر</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowMessages: !settings.allowMessages })}
                className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${
                  settings.allowMessages ? 'bg-[#1F8A54]' : 'bg-[var(--surface)] border border-[var(--border)]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    settings.allowMessages ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] space-y-4">
            <div className="text-xs font-black text-[var(--text-primary)] flex items-center gap-2">
              <Palette size={16} className="text-[#1F8A54]" />
              <span>ألوان الهوية البصرية الرئيسية (Brand Theme)</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                  اللون الأساسي (Primary Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-xl border border-[var(--border)] cursor-pointer shrink-0"
                  />
                  <input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono focus:border-[#1F8A54] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                  اللون الثانوي (Secondary Accent)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded-xl border border-[var(--border)] cursor-pointer shrink-0"
                  />
                  <input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono focus:border-[#1F8A54] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ BOTTOM SAVE ACTION ══ */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
            saved ? 'bg-[#1F8A54]' : 'btn-primary'
          }`}
        >
          {saved ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : saving ? (
            <RefreshCw size={16} className="animate-spin shrink-0" />
          ) : (
            <Save size={16} className="shrink-0" />
          )}
          <span>{saved ? 'تم حفظ الإعدادات بنجاح!' : saving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}</span>
        </button>
      </div>
    </div>
  )
}
