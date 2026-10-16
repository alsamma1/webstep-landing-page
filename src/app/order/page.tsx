'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Globe, Smartphone, Palette, LayoutTemplate, ShoppingCart,
  Server, TrendingUp, Wrench, Check, ChevronRight, ChevronLeft,
  Send, Eye, User, Phone, Mail, Building, DollarSign,
  Clock, CheckCircle2, Sparkles, ArrowRight, X, Star, Zap
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useRegion } from '@/components/providers/RegionProvider'

function convertTierToYemen(tier: string, rate = 450): string {
  const easternToArabic = (s: string) => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
  return tier.replace(/([٠-٩0-9,،]+)\s*(?:ر\.س|SAR)/g, (_, numStr) => {
    const clean = easternToArabic(numStr).replace(/[,،]/g, '')
    const val = parseInt(clean, 10)
    if (isNaN(val)) return _
    return `${(val * rate).toLocaleString('ar-YE')} ر.ي`
  }).replace(/ر\.س/g, 'ر.ي')
}

/* ─── Service Definitions ─── */
const SERVICES = [
  {
    id: 'web',
    label: 'موقع ويب احترافي',
    icon: Globe,
    color: '#1F8A54',
    desc: 'موقع شخصي، تعريفي، بورتفوليو، أو موقع شركة',
    questions: [
      { id: 'website_type', label: 'نوع الموقع المطلوب', type: 'radio', options: ['موقع شخصي', 'موقع شركة / عمل', 'موقع بورتفوليو', 'موقع تعريفي بمنتج'] },
      { id: 'pages_count', label: 'عدد الصفحات التقريبي', type: 'radio', options: ['١-٣ صفحات (أساسي)', '٤-٨ صفحات (متوسط)', '٩+ صفحات (شامل)'] },
      { id: 'has_design', label: 'هل لديك تصميم جاهز؟', type: 'radio', options: ['نعم، لدي تصميم Figma/XD', 'لا، أريد منكم التصميم', 'لدي أفكار فقط'] },
      { id: 'features', label: 'مميزات إضافية مطلوبة', type: 'checkbox', options: ['نموذج تواصل', 'خريطة Google', 'دعم متعدد اللغات', 'SEO متقدم', 'مدونة', 'تكامل واتساب'] },
    ],
    budgetOptions: ['أقل من ١,٠٠٠ ر.س', '١,٠٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠ – ٦,٠٠٠ ر.س', '٦,٠٠٠+ ر.س'],
  },
  {
    id: 'apps',
    label: 'تطبيق جوال',
    icon: Smartphone,
    color: '#6366f1',
    desc: 'تطبيق iOS وAndroid بأداء عالٍ',
    questions: [
      { id: 'platform', label: 'المنصة المطلوبة', type: 'radio', options: ['iOS فقط', 'Android فقط', 'iOS + Android (Cross-platform)', 'لا أعلم، أحتاج نصيحة'] },
      { id: 'app_type', label: 'نوع التطبيق', type: 'radio', options: ['تطبيق خدمات / طلبات', 'تطبيق تجاري / متجر', 'تطبيق اجتماعي', 'تطبيق داخلي للشركة', 'نوع آخر'] },
      { id: 'features', label: 'مميزات مطلوبة', type: 'checkbox', options: ['تسجيل دخول / مستخدمين', 'دفع إلكتروني', 'إشعارات Push', 'خريطة وتتبع', 'دردشة مباشرة', 'لوحة تحكم Admin'] },
      { id: 'design_need', label: 'هل تريد تصميم UI/UX؟', type: 'radio', options: ['نعم، أريد تصميم كامل من صفر', 'لدي تصميم Figma جاهز', 'فقط أريد النصيحة'] },
    ],
    budgetOptions: ['٥,٠٠٠ – ١٠,٠٠٠ ر.س', '١٠,٠٠٠ – ٢٠,٠٠٠ ر.س', '٢٠,٠٠٠ – ٤٠,٠٠٠ ر.س', '٤٠,٠٠٠+ ر.س'],
  },
  {
    id: 'design',
    label: 'تصميم UI/UX',
    icon: Palette,
    color: '#ec4899',
    desc: 'هوية بصرية، واجهات مستخدم، Figma Prototype',
    questions: [
      { id: 'design_type', label: 'نوع التصميم المطلوب', type: 'radio', options: ['هوية بصرية (لوغو + Brand Guidelines)', 'تصميم UI لموقع أو تطبيق', 'Prototype تفاعلي Figma', 'UX Audit لواجهة قائمة'] },
      { id: 'screens', label: 'عدد الشاشات / الصفحات التقريبي', type: 'radio', options: ['أقل من ١٠ شاشات', '١٠ – ٢٥ شاشة', '٢٥ – ٥٠ شاشة', '٥٠+ شاشة'] },
      { id: 'style', label: 'الأسلوب البصري المفضل', type: 'radio', options: ['نظيف وبسيط (Minimalist)', 'جريء وحديث (Bold/Modern)', 'فاخر وراقٍ (Premium)', 'مرح وإبداعي (Creative)'] },
    ],
    budgetOptions: ['٨٠٠ – ١,٥٠٠ ر.س', '١,٥٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠+ ر.س'],
  },
  {
    id: 'landing',
    label: 'صفحة هبوط',
    icon: LayoutTemplate,
    color: '#f59e0b',
    desc: 'صفحة هبوط عالية التحويل لإعلاناتك',
    questions: [
      { id: 'lp_goal', label: 'هدف صفحة الهبوط', type: 'radio', options: ['جمع بيانات عملاء (Lead Gen)', 'بيع منتج / خدمة مباشرة', 'تسجيل في حدث / ندوة', 'تحميل تطبيق أو ملف'] },
      { id: 'traffic_source', label: 'مصدر الزيارات', type: 'radio', options: ['Google Ads', 'Meta Ads (Facebook/Instagram)', 'TikTok Ads', 'مصادر متعددة'] },
      { id: 'lp_features', label: 'مميزات مطلوبة', type: 'checkbox', options: ['A/B Testing', 'عد تنازلي Countdown', 'تتبع Pixel', 'نموذج واتساب مباشر', 'Analytics GA4'] },
    ],
    budgetOptions: ['٦٠٠ – ١,٢٠٠ ر.س', '١,٢٠٠ – ٢,٠٠٠ ر.س', '٢,٠٠٠+ ر.س (مع إعلانات)'],
  },
  {
    id: 'ecommerce',
    label: 'متجر إلكتروني',
    icon: ShoppingCart,
    color: '#ef4444',
    desc: 'متجر رقمي متكامل بوابات دفع وإدارة مخزون',
    questions: [
      { id: 'products_count', label: 'عدد المنتجات التقريبي', type: 'radio', options: ['أقل من ٥٠ منتج', '٥٠ – ٢٠٠ منتج', '٢٠٠ – ١٠٠٠ منتج', '١٠٠٠+ منتج'] },
      { id: 'platform', label: 'المنصة المفضلة', type: 'radio', options: ['Shopify (سريع وموثوق)', 'WooCommerce (مرن)', 'Custom (مخصص بالكامل)', 'لا أعلم، أحتاج نصيحة'] },
      { id: 'ecom_features', label: 'خصائص المتجر', type: 'checkbox', options: ['بوابات دفع سعودية (Mada, STC Pay)', 'تطبيق جوال للمتجر', 'لوحة تحكم مخزون', 'تكامل Shipping', 'نقاط ولاء وكوبونات'] },
    ],
    budgetOptions: ['١,٥٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠ – ٧,٠٠٠ ر.س', '٧,٠٠٠ – ١٥,٠٠٠ ر.س', '١٥,٠٠٠+ ر.س'],
  },
  {
    id: 'systems',
    label: 'نظام رقمي / ERP',
    icon: Server,
    color: '#f97316',
    desc: 'نظام إدارة مخصص، ERP، SaaS Dashboard',
    questions: [
      { id: 'system_type', label: 'نوع النظام', type: 'radio', options: ['ERP شامل', 'نظام إدارة فندق', 'نظام إدارة صالون / مطعم', 'لوحة تحكم SaaS', 'نظام مخصص'] },
      { id: 'users', label: 'عدد المستخدمين المتوقع', type: 'radio', options: ['١-١٠ مستخدمين', '١١-٥٠ مستخدماً', '٥١-٢٠٠ مستخدم', '٢٠٠+ مستخدم'] },
      { id: 'integrations', label: 'تكاملات مطلوبة', type: 'checkbox', options: ['نظام محاسبي', 'مستودع / مخزون', 'نقاط بيع (POS)', 'تقارير BI', 'API خارجي'] },
    ],
    budgetOptions: ['١٠,٠٠٠ – ٢٠,٠٠٠ ر.س', '٢٠,٠٠٠ – ٤٠,٠٠٠ ر.س', '٤٠,٠٠٠ – ٨٠,٠٠٠ ر.س', '٨٠,٠٠٠+ ر.س'],
  },
  {
    id: 'marketing',
    label: 'تسويق رقمي',
    icon: TrendingUp,
    color: '#06b6d4',
    desc: 'SEO، إعلانات، سوشيال ميديا، تسويق محتوى',
    questions: [
      { id: 'marketing_type', label: 'الخدمة التسويقية المطلوبة', type: 'checkbox', options: ['SEO (تحسين البحث)', 'Google Ads', 'Meta Ads (Facebook/Instagram)', 'إدارة سوشيال ميديا', 'تسويق محتوى', 'Email Marketing'] },
      { id: 'current_status', label: 'الوضع الحالي', type: 'radio', options: ['موقع قائم وأريد تنمية زيارات', 'أبدأ من الصفر', 'أديت تسويق سابقاً وأريد تحسينه'] },
      { id: 'monthly_budget', label: 'ميزانية الإعلانات الشهرية', type: 'radio', options: ['أقل من ٢,٠٠٠ ر.س', '٢,٠٠٠ – ٥,٠٠٠ ر.س', '٥,٠٠٠ – ١٥,٠٠٠ ر.س', '١٥,٠٠٠+ ر.س'] },
    ],
    budgetOptions: ['١,٥٠٠ – ٣,٥٠٠ ر.س/شهر', '٣,٥٠٠ – ٨,٠٠٠ ر.س/شهر', '٨,٠٠٠+ ر.س/شهر'],
  },
  {
    id: 'support',
    label: 'صيانة ودعم فني',
    icon: Wrench,
    color: '#10b981',
    desc: 'صيانة دورية، حماية، نسخ احتياطية',
    questions: [
      { id: 'platform_type', label: 'نوع المنصة الحالية', type: 'radio', options: ['WordPress', 'Next.js / React', 'Shopify', 'منصة أخرى'] },
      { id: 'issues', label: 'المشاكل الحالية (اختياري)', type: 'checkbox', options: ['الموقع بطيء', 'مشاكل أمان', 'أخطاء برمجية', 'لا أعلم ماذا يحدث'] },
      { id: 'support_plan', label: 'خطة الصيانة المفضلة', type: 'radio', options: ['أساسية (٢٠٠ ر.س/شهر)', 'Pro (٥٥٠ ر.س/شهر)', 'Enterprise (١,٢٠٠ ر.س/شهر)', 'لم أقرر بعد'] },
    ],
    budgetOptions: ['٢٠٠ – ٥٥٠ ر.س/شهر', '٥٥٠ – ١,٢٠٠ ر.س/شهر', '١,٢٠٠+ ر.س/شهر'],
  },
]

/* ─── Timeline helper ─── */
const STEPS = ['اختيار الخدمة', 'تفاصيل المشروع', 'بياناتك', 'مراجعة وإرسال']

interface OrderPageData {
  hero: {
    badge: string
    title: string
    subtitle: string
  }
  whatsappNumber: string
  discountNotice: string
  budgetTiers: Record<string, string[]>
}

const DEFAULT_ORDER_DATA: OrderPageData = {
  hero: {
    badge: 'ابدأ مشروعك الرقمي',
    title: 'طلب مشروع جديد مع WebStep',
    subtitle: 'أكمل الخطوات التالية وسنقوم بدراسة متطلباتك وتقديم عرض فني وسعري مخصص بدقة.',
  },
  whatsappNumber: '966500000000',
  discountNotice: 'احصل على استشارة تقنية مجانية + خصم خاص ١٠٪ على مشاريع التطوير الشاملة هذا الشهر.',
  budgetTiers: {
    web: ['أقل من ١,٠٠٠ ر.س', '١,٠٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠ – ٦,٠٠٠ ر.س', '٦,٠٠٠+ ر.س'],
    apps: ['٥,٠٠٠ – ١٠,٠٠٠ ر.س', '١٠,٠٠٠ – ٢٠,٠٠٠ ر.س', '٢٠,٠٠٠ – ٤٠,٠٠٠ ر.س', '٤٠,٠٠٠+ ر.س'],
    design: ['٨٠٠ – ١,٥٠٠ ر.س', '١,٥٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠+ ر.س'],
    landing: ['٦٠٠ – ١,٢٠٠ ر.س', '١,٢٠٠ – ٢,٠٠٠ ر.س', '٢,٠٠٠+ ر.س'],
    ecommerce: ['٢,٥٠٠ – ٥,٠٠٠ ر.س', '٥,٠٠٠ – ١٠,٠٠٠ ر.س', '١٠,٠٠٠+ ر.س'],
    systems: ['٨,٠٠٠ – ١٥,٠٠٠ ر.س', '١٥,٠٠٠ – ٣٠,٠٠٠ ر.س', '٣٠,٠٠٠+ ر.س'],
  },
}

/* ─── Main Order Form Component ─── */
function OrderForm() {
  const params = useSearchParams()
  const initialService = params.get('service') || ''
  const initialPackage = params.get('package') || ''

  const settings = useSiteSettings()
  const { contact, isYemen, geoSettings } = useRegion()
  const [pageData, setPageData] = useState<OrderPageData>(DEFAULT_ORDER_DATA)
  const [step, setStep] = useState(initialService ? 1 : 0)
  const [selectedServiceId, setSelectedServiceId] = useState(initialService)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [budget, setBudget] = useState(initialPackage)
  const [timeline, setTimeline] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/public/order-settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setPageData(data)
        }
      })
      .catch(err => console.error('Order settings load error:', err))
  }, [])

  const service = SERVICES.find(s => s.id === selectedServiceId)

  /* Compute active budget options based on region */
  const getActiveBudgetOptions = (svcId: string): string[] => {
    if (isYemen) {
      const yemenTiers = (pageData as any).yemenBudgetTiers?.[svcId]
      if (yemenTiers && yemenTiers.length > 0) return yemenTiers
      // Fall back to converting SA tiers
      const saTiers = pageData.budgetTiers?.[svcId]
      if (saTiers && saTiers.length > 0) return saTiers.map(t => convertTierToYemen(t))
    }
    const dbTiers = pageData.budgetTiers?.[svcId]
    if (dbTiers && dbTiers.length > 0) return dbTiers
    return SERVICES.find(s => s.id === svcId)?.budgetOptions || []
  }

  /* Update answer helper */
  const setAnswer = (qid: string, val: string, multi?: boolean) => {
    if (multi) {
      setAnswers(prev => {
        const curr = (prev[qid] as string[]) || []
        return { ...prev, [qid]: curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val] }
      })
    } else {
      setAnswers(prev => ({ ...prev, [qid]: val }))
    }
  }

  /* Build WhatsApp summary */
  const buildSummary = () => {
    const lines = [
      `🚀 طلب مشروع جديد — WebStep`,
      ``,
      `📋 الخدمة: ${service?.label}`,
      ``,
      `📝 تفاصيل المشروع:`,
      ...(service?.questions || []).map(q => {
        const ans = answers[q.id]
        if (!ans || (Array.isArray(ans) && ans.length === 0)) return null
        return `• ${q.label}: ${Array.isArray(ans) ? ans.join('، ') : ans}`
      }).filter(Boolean),
      `• الميزانية التقديرية: ${budget}`,
      `• المدة الزمنية المطلوبة: ${timeline || 'مرن'}`,
      ``,
      `👤 بيانات العميل:`,
      `• الاسم: ${name}`,
      `• الجوال: ${phone}`,
      `• البريد: ${email || 'لم يُدخل'}`,
      `• الشركة/المشروع: ${company || 'لم يُدخل'}`,
      notes ? `\n💬 ملاحظات إضافية:\n${notes}` : '',
    ]
    return lines.filter(Boolean).join('\n')
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          formType: 'order',
          service: service?.label || selectedServiceId,
          name,
          phone,
          email,
          company,
          budget,
          timeline,
          notes,
          answers,
          status: 'new',
          region: isYemen ? 'ye' : 'sa',
        }),
      })
      if (!response.ok) throw new Error('تعذر تسجيل الطلب')
    } catch (err) {
      console.error('Order API save error:', err)
      return
    }

    const targetPhone = contact.whatsapp || pageData.whatsappNumber || settings.whatsapp || '966593672193'
    const waNumber = targetPhone.replace(/[^0-9]/g, '')
    const text = encodeURIComponent(buildSummary())
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank')
    setSubmitted(true)
  }

  const canGoNext = () => {
    if (step === 0) return !!selectedServiceId
    if (step === 1) return !!budget
    if (step === 2) return name.trim().length > 1 && phone.trim().length > 7
    return true
  }

  /* ── SUBMITTED screen ── */
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 rounded-3xl bg-[#1F8A54]/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[#1F8A54]" />
          </div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-3">تم إرسال طلبك! 🎉</h2>
          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
            تم فتح واتساب بملخص طلبك الكامل. أرسل الرسالة وسيتواصل معك فريقنا خلال ساعتين.
          </p>
          <div className="p-5 rounded-2xl bg-[#1F8A54]/10 border border-[#1F8A54]/25 mb-6 text-sm text-[#1F8A54] font-bold">
            ✅ الخطوة التالية: ابحث عن واتساب وأرسل الرسالة الجاهزة لفريق WebStep
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setStep(0); setSelectedServiceId(''); setAnswers({}); setBudget(''); setName(''); setPhone(''); setEmail(''); setNotes('') }}
              className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
              <Sparkles size={14} /> تقديم طلب جديد
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Progress Bar ── */}
      <div className="bg-[var(--bg-soft)] border-b border-[var(--border)] py-4">
        <div className="container-ws max-w-4xl">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-[#1F8A54] text-white' : i === step ? 'bg-[#1F8A54] text-white shadow-lg shadow-[#1F8A54]/30' : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${i === step ? 'text-[#1F8A54]' : i < step ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-[var(--text-muted)] mx-1 hidden sm:block" />}
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-l from-[#1F8A54] to-[#26a667] transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="container-ws max-w-4xl py-10">

        {/* ═══ STEP 0: Choose Service ═══ */}
        {step === 0 && (
          <div>
            {pageData.discountNotice && (
              <div className="mb-6 p-4 rounded-2xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 flex items-center gap-3 text-xs sm:text-sm font-bold text-[#1F8A54] shadow-sm animate-in fade-in">
                <Sparkles size={18} className="shrink-0 text-[#1F8A54]" />
                <span>{pageData.discountNotice}</span>
              </div>
            )}
            <div className="mb-8">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">{pageData.hero?.badge || 'الخطوة ١ من ٤'}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">{pageData.hero?.title || 'ما الخدمة التي تحتاجها؟'}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{pageData.hero?.subtitle || 'اختر الخدمة المناسبة وسيتكيف النموذج تلقائياً مع مشروعك.'}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map(s => {
                const Icon = s.icon
                const isSelected = selectedServiceId === s.id
                return (
                  <button key={s.id} onClick={() => setSelectedServiceId(s.id)}
                    className={`p-5 rounded-2xl border text-right transition-all duration-200 hover:-translate-y-0.5 ${isSelected ? 'border-2 shadow-xl scale-[1.02]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'}`}
                    style={{ borderColor: isSelected ? s.color : undefined, background: isSelected ? `${s.color}10` : undefined }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform" style={{ background: `${s.color}20` }}>
                      <Icon size={20} style={{ color: s.color }} />
                    </div>
                    <div className="font-black text-sm text-[var(--text-primary)] mb-1">{s.label}</div>
                    <div className="text-[10px] text-[var(--text-muted)] leading-snug">{s.desc}</div>
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-bold" style={{ color: s.color }}>
                        <CheckCircle2 size={13} /> تم الاختيار
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: Service Questions ═══ */}
        {step === 1 && service && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-bold mb-2 block" style={{ color: service.color }}>الخطوة ٢ من ٤ — {service.label}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">أخبرنا عن مشروعك</h2>
              <p className="text-sm text-[var(--text-secondary)]">كلما كانت الإجابات أوضح، كان عرضنا أدق وأسرع.</p>
            </div>

            <div className="space-y-7">
              {service.questions.map(q => (
                <div key={q.id} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <h4 className="font-black text-sm text-[var(--text-primary)] mb-4">{q.label}</h4>
                  <div className={q.type === 'checkbox' ? 'grid sm:grid-cols-2 gap-2' : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-2'}>
                    {q.options.map(opt => {
                      const ansVal = answers[q.id]
                      const isChecked = q.type === 'checkbox'
                        ? Array.isArray(ansVal) && ansVal.includes(opt)
                        : ansVal === opt
                      return (
                        <button key={opt} onClick={() => setAnswer(q.id, opt, q.type === 'checkbox')}
                          className={`p-3 rounded-xl text-xs font-bold text-right border transition-all ${isChecked ? 'text-white border-transparent shadow-md' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'}`}
                          style={{ background: isChecked ? service.color : undefined }}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isChecked ? 'border-white bg-white/30' : 'border-[var(--border)]'}`}>
                              {isChecked && <Check size={10} className="text-white" />}
                            </div>
                            {opt}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Budget */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-sm text-[var(--text-primary)]">الميزانية التقديرية *</h4>
                  <span className="text-[11px] font-bold text-[#1F8A54] bg-[#1F8A54]/10 px-2 py-0.5 rounded-md">
                    {isYemen ? 'الأسعار بالريال اليمني (ر.ي)' : 'الأسعار بالريال السعودي (ر.س)'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {getActiveBudgetOptions(service.id).map(opt => {
                    const isSelected = budget === opt
                    return (
                      <button key={opt} onClick={() => setBudget(opt)}
                        className={`p-3 rounded-xl text-xs font-bold text-right border transition-all ${isSelected ? 'text-white border-transparent shadow-md' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}
                        style={{ background: isSelected ? service.color : undefined }}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <h4 className="font-black text-sm text-[var(--text-primary)] mb-4">المدة الزمنية المطلوبة</h4>
                <div className="grid sm:grid-cols-3 gap-2">
                  {['عاجل (أقل من شهر)', 'عادي (١-٣ أشهر)', 'مرن (لا يهم)'].map(opt => (
                    <button key={opt} onClick={() => setTimeline(opt)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${timeline === opt ? 'text-white border-transparent' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}
                      style={{ background: timeline === opt ? service.color : undefined }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Contact Info ═══ */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">الخطوة ٣ من ٤</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">بياناتك للتواصل</h2>
              <p className="text-sm text-[var(--text-secondary)]">ستصلنا رسالتك مباشرة على واتساب مع ملخص طلبك الكامل.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">الاسم الكامل *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="محمد أحمد"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">رقم الجوال (واتساب) *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+٩٦٦ ٥٠٠ ٠٠٠ ٠٠٠"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">البريد الإلكتروني</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">اسم الشركة / المشروع</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="شركة أو اسم المشروع"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">ملاحظات إضافية (اختياري)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                  placeholder="أي تفاصيل إضافية تريد إضافتها، مثل أمثلة مواقع تعجبك، أو تقنيات محددة..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm resize-none focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Review & Submit ═══ */}
        {step === 3 && service && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-bold text-[#1F8A54] mb-2 block">الخطوة ٤ من ٤ — مراجعة الطلب</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">راجع طلبك قبل الإرسال</h2>
              <p className="text-sm text-[var(--text-secondary)]">تأكد من صحة البيانات ثم أرسل — سيتواصل معك فريقنا خلال ساعتين.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="space-y-4">
                {/* Service */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border)]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${service.color}15` }}>
                      <service.icon size={20} style={{ color: service.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)]">الخدمة المختارة</div>
                      <div className="font-black text-[var(--text-primary)]">{service.label}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {service.questions.map(q => {
                      const ans = answers[q.id]
                      if (!ans || (Array.isArray(ans) && ans.length === 0)) return null
                      return (
                        <div key={q.id} className="flex items-start gap-2 text-xs">
                          <Check size={12} className="shrink-0 mt-0.5" style={{ color: service.color }} />
                          <span className="text-[var(--text-muted)]">{q.label}:</span>
                          <span className="font-bold text-[var(--text-primary)]">{Array.isArray(ans) ? ans.join('، ') : ans}</span>
                        </div>
                      )
                    })}
                    {budget && (
                      <div className="flex items-center gap-2 text-xs">
                        <Check size={12} style={{ color: service.color }} />
                        <span className="text-[var(--text-muted)]">الميزانية:</span>
                        <span className="font-black" style={{ color: service.color }}>{budget}</span>
                      </div>
                    )}
                    {timeline && (
                      <div className="flex items-center gap-2 text-xs">
                        <Check size={12} style={{ color: service.color }} />
                        <span className="text-[var(--text-muted)]">المدة:</span>
                        <span className="font-bold text-[var(--text-primary)]">{timeline}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <h4 className="font-black text-sm text-[var(--text-primary)] mb-3">بيانات التواصل</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'الاسم', val: name },
                      { label: 'الجوال', val: phone },
                      { label: 'البريد', val: email || '—' },
                      { label: 'الشركة', val: company || '—' },
                    ].map(f => (
                      <div key={f.label} className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">{f.label}:</span>
                        <span className="font-bold text-[var(--text-primary)]">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {notes && (
                  <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs text-[var(--text-secondary)]">
                    <strong className="block mb-1">ملاحظات:</strong>{notes}
                  </div>
                )}
              </div>

              {/* What happens next */}
              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-[#1F8A54]/25 bg-[#1F8A54]/5">
                  <h4 className="font-black text-sm text-[var(--text-primary)] mb-4">ماذا يحدث بعد الإرسال؟</h4>
                  <div className="space-y-3">
                    {[
                      { n: '١', text: 'يُفتح واتساب بملخص طلبك — أرسله بضغطة واحدة', time: 'فوري' },
                      { n: '٢', text: 'يستقبل فريقنا طلبك ويراجعه بدقة', time: 'خلال ساعتين' },
                      { n: '٣', text: 'نتواصل معك لمناقشة التفاصيل وتقديم عرض السعر', time: 'خلال ٤ ساعات' },
                      { n: '٤', text: 'نبدأ العمل بعد موافقتك على العرض', time: 'خلال ٢٤ ساعة' },
                    ].map(step => (
                      <div key={step.n} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#1F8A54] flex items-center justify-center shrink-0 text-white text-xs font-black">{step.n}</div>
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">{step.text}</div>
                          <div className="text-[10px] text-[#1F8A54] font-bold mt-0.5">{step.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#1F8A54] animate-pulse" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">متوسط وقت الاستجابة: ١.٨ ساعة فقط</span>
                </div>

                <button onClick={handleSubmit}
                  className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-3 shadow-xl shadow-[#1F8A54]/30 hover:opacity-95 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)' }}>
                  <Send size={18} />
                  إرسال الطلب عبر واتساب الآن
                </button>
                <p className="text-center text-xs text-[var(--text-muted)]">سيتم إرسال ملخص طلبك الكامل إلى فريق WebStep مباشرة</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-bold hover:bg-[var(--bg-muted)] transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ChevronLeft size={16} /> السابق
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-black text-white transition-all ${canGoNext() ? 'shadow-md hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
              style={{ background: canGoNext() ? 'linear-gradient(135deg, #1F8A54, #26a667)' : undefined, backgroundColor: !canGoNext() ? 'var(--bg-muted)' : undefined, color: !canGoNext() ? 'var(--text-muted)' : undefined }}>
              التالي <ChevronRight size={16} />
            </button>
          ) : null}
        </div>

      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-20 text-right">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1F8A54]/15 flex items-center justify-center mx-auto">
                <Zap size={24} className="text-[#1F8A54] animate-pulse" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">جاري تحميل نموذج الطلب...</p>
            </div>
          </div>
        }>
          <OrderForm />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
