'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Globe, Zap, Lock, User, Briefcase, FolderOpen,
  Check, Search, Shield, Headphones, Palette, Smartphone,
  Star, ChevronDown, Rocket, MessageCircle,
  Minus, Gift, Send, Clock, Settings,
  ExternalLink, Eye, Laptop, ArrowUpRight, CheckCircle2,
  Sparkles, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  DEFAULT_WEB_SERVICE_CONTENT,
  type WebServiceIcon,
  type WebServicePageContent,
} from '@/data/web-service-page'
import { parseWebServiceContent } from '@/lib/web-service-content'
import { useRegion } from '@/components/providers/RegionProvider'

const PAGE_ICONS: Record<WebServiceIcon, LucideIcon> = {
  Globe, Zap, Palette, Smartphone, Search, MessageCircle,
  Settings, Shield, User, Briefcase, FolderOpen, Send,
  Rocket, Headphones,
}

/* ─────────── Data ─────────── */
const PLANS = [
  {
    id: 'basic',
    name: 'الأساسية',
    price: 300,
    delivery: '٥ أيام',
    color: '#6366f1',
    hot: false,
    features: ['صفحة واحدة كاملة', 'زر واتساب مباشر', 'نموذج تواصل', 'تصميم متجاوب للجوال'],
  },
  {
    id: 'advanced',
    name: 'المتقدمة',
    price: 700,
    delivery: '٤ أيام',
    color: '#1F8A54',
    hot: false,
    features: ['دومين مجاني سنة', 'استضافة السنة الأولى', 'سيو أساسي', 'وضع ليلي ونهاري', 'معرض صور أو آراء عملاء'],
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    price: 1000,
    delivery: '٣ أيام',
    color: '#f59e0b',
    hot: true,
    features: ['حتى ٥ صفحات', 'دومين + إيميل مهني', 'سيو متقدم + AI', 'معرض كامل + آراء موثقة', 'نسخ احتياطي أسبوعي', 'دعم ذو أولوية'],
  },
  {
    id: 'elite',
    name: 'إيليت المخصصة',
    price: 2000,
    delivery: '٧ أيام',
    color: '#ec4899',
    hot: false,
    features: ['صفحات غير محدودة', 'لوحة تحكم عربية', 'مدونة مدمجة', '٥ إيميلات مهنية', 'نسخ احتياطي يومي', 'دعم فوري ٢٤/٧'],
  },
]

const FEATURES = [
  { icon: Globe, title: 'دفعة واحدة للأبد', desc: 'لا اشتراكات ولا رسوم شهرية. تدفع مرة واحدة وصفحتك ملكك للأبد.' },
  { icon: Palette, title: 'تصميم فاخر', desc: 'تصاميم عصرية مخصصة تعكس شخصيتك أو هوية عملك وتميزك.' },
  { icon: Smartphone, title: 'متجاوب كلياً', desc: 'صفحتك تظهر مثالية على الجوال والتابلت والكمبيوتر.' },
  { icon: Search, title: 'ظهور في البحث', desc: 'تحسين لمحركات البحث والذكاء الاصطناعي ليصلك الناس بأنفسهم.' },
  { icon: Globe, title: 'دومين مجاني', desc: 'في الباقات الأعلى: نطاق باسمك مجاناً لمدة سنة كاملة.' },
  { icon: MessageCircle, title: 'واتساب مباشر', desc: 'زائرك يضغط زراً واحداً ويحادثك فوراً — تحويلات أعلى بلا مجهود.' },
  { icon: Settings, title: 'وضع ليلي ونهاري', desc: 'صفحتك تتكيف مع تفضيل الزائر تلقائياً بتجربة أنيقة.' },
  { icon: Shield, title: 'ضمان استرداد', desc: '١٤ يوماً كاملة لتجرب وتقرر — غير راضٍ؟ نعيد لك المبلغ.' },
]

const KINDS = [
  {
    Icon: User, title: 'صفحة شخصية', color: '#6366f1',
    desc: 'بطاقة تعريف رقمية تفتح لك الأبواب — مثالية للمستقلين والباحثين عن حضور مهني.',
    items: ['نبذة وسيرة ذاتية أنيقة', 'مهارات وخبرات وإنجازات', 'روابطك الاجتماعية والتواصل المباشر'],
  },
  {
    Icon: Briefcase, title: 'صفحة تعريفية لعملك', color: '#1F8A54',
    desc: 'واجهة احترافية تعرّف عملاءك بخدماتك وتقودهم مباشرة إلى واتسابك.',
    items: ['عرض الخدمات والمميزات', 'آراء العملاء وبناء الثقة', 'زر واتساب ونموذج طلبات'],
  },
  {
    Icon: FolderOpen, title: 'ملف أعمال (بورتفوليو)', color: '#f59e0b',
    desc: 'معرض رقمي يعرض مشاريعك وصور أعمالك بطريقة تبيع موهبتك عنك.',
    items: ['معرض صور منظم وجذاب', 'صفحة تفصيلية لكل عمل', 'مثالي للمصممين والمصورين والحرفيين'],
  },
]

const STEPS = [
  { num: '٠١', title: 'عبّئ طلبك', desc: 'نموذج بسيط عنك وعن نشاطك — لا يأخذ دقيقتين.', Icon: Send },
  { num: '٠٢', title: 'نصمم لك', desc: 'نبدأ فوراً وترى المعاينة الأولى في منتصف المدة.', Icon: Palette },
  { num: '٠٣', title: 'نعدّل معك', desc: 'تعديلات حتى تقول: هذا بالضبط ما أريد.', Icon: Settings },
  { num: '٠٤', title: 'نطلق صفحتك', desc: 'رفع رسمي على الدومين… وصفحتك ملكك للأبد.', Icon: Rocket },
]

/* ─────────── Portfolio Projects (أعمالنا في المواقع) ─────────── */
const SHOWCASE_PROJECTS = [
  {
    id: 'naif-consultant',
    name: 'موقع المستشار نايف العتيبي',
    category: 'صفحة شخصية',
    categoryKey: 'personal',
    role: 'استشارات إدارية وتطوير قيادات',
    tagline: 'حضور رقمي مهني راقٍ يعكس الخبرة ويسهل حجز الاستشارات وتنزيل السيرة الذاتية',
    url: 'https://naif-consultant.webstep.sa',
    displayUrl: 'naif-consultant.webstep.sa',
    color: '#1F8A54',
    package: 'الاحترافية (١٠٠٠ ر.س)',
    stats: { speed: '99/100', visits: '+١,٤٠٠ شهرياً', rating: '5.0' },
    features: ['حجز استشارات تقويمية', 'سيرة ذاتية تفاعلية', 'تكامل واتساب مباشر', 'دومين سعودي خاص'],
    heroTitle: 'المستشار نايف العتيبي',
    heroSub: 'خبير الحوكمة المؤسسية وتطوير الأعمال للشركات والجهات الحكومية',
    badge: 'نشط ومباشر',
  },
  {
    id: 'abaad-studio',
    name: 'استوديو أبعاد للتصميم والديكور',
    category: 'صفحة تعريفية',
    categoryKey: 'business',
    role: 'تصميم داخلي ومعماري راقٍ',
    tagline: 'واجهة استثنائية لعرض الفلل والمشاريع المنجزة مع نموذج طلب تسعيرة وكتالوج تفاعلي',
    url: 'https://abaad-studio.webstep.sa',
    displayUrl: 'abaad-studio.webstep.sa',
    color: '#6366f1',
    package: 'إيليت المخصصة (٢٠٠٠ ر.س)',
    stats: { speed: '98/100', visits: '+٣,٢٠٠ شهرياً', rating: '4.9' },
    features: ['معرض مشاريع وفلاتر', 'سلايدر مقارنة قبل/بعد', 'نموذج طلب عروض ذكي', 'لوحة تحكم للمحتوى'],
    heroTitle: 'أبعاد | صياغة الفراغات الراقية',
    heroSub: 'أكثر من ٤٥ فيلا وقصراً بتصاميم تجمع الفخامة العصرية والأصالة',
    badge: 'الأعلى طلباً',
  },
  {
    id: 'tariq-arch',
    name: 'بورتفوليو م. طارق الشريف',
    category: 'ملفات أعمال',
    categoryKey: 'portfolio',
    role: 'معماري ومصمم نماذج ثلاثية الأبعاد',
    tagline: 'معرض بصري فائق الدقة يبيع الموهبة للعملاء وأصحاب المشاريع الكبرى بأناقة مطلقة',
    url: 'https://tariq-arch.webstep.sa',
    displayUrl: 'tariq-arch.webstep.sa',
    color: '#f59e0b',
    package: 'المتقدمة (٧٠٠ ر.س)',
    stats: { speed: '100/100', visits: '+٨٥٠ شهرياً', rating: '5.0' },
    features: ['معرض عالي الدقة HD', 'تحميل السيرة الذاتية PDF', 'نبذة عن الجوائز والتكريمات', 'وضع ليلي مميز'],
    heroTitle: 'طارق الشريف — هندسة الفراغ والضوء',
    heroSub: 'ملف أعمال معماري ونماذج 3D Renderings بتقنيات بصرية سينمائية',
    badge: 'معرض فني',
  },
  {
    id: 'dr-sarah',
    name: 'عيادات د. سارة باحمدان',
    category: 'صفحة تعريفية',
    categoryKey: 'business',
    role: 'استشارية طب وجراحة الجلدية والتجميل',
    tagline: 'بوابة طبية أنيقة تبني الثقة وتقدم معلومات العلاجات وجدول المواعيد وتحديد موقع العيادة',
    url: 'https://dr-sarah.webstep.sa',
    displayUrl: 'dr-sarah.webstep.sa',
    color: '#ec4899',
    package: 'الاحترافية (١٠٠٠ ر.س)',
    stats: { speed: '99/100', visits: '+٢,١٠٠ شهرياً', rating: '4.9' },
    features: ['تكامل خرائط قوقل', 'جدول الخدمات والأسعار', 'آراء مراجعين موثقة', 'زر طوارئ واتساب'],
    heroTitle: 'د. سارة باحمدان | الجلدية والتجميل الطبي',
    heroSub: 'عناية طبية قائمة على الأدلة ونتائج طبيعية بأحدث أجهزة الليزر العالمية',
    badge: 'طبي معتمد',
  },
  {
    id: 'zawaya-law',
    name: 'مكتب زوايا للمحاماة والاستشارات',
    category: 'صفحة تعريفية',
    categoryKey: 'business',
    role: 'محاماة وتحكيم تجاري للشركات',
    tagline: 'حضور رقمي رصين يعكس القوة والمصداقية لخدمة قطاع الأعمال والمستثمرين محلياً ودولياً',
    url: 'https://zawaya-law.webstep.sa',
    displayUrl: 'zawaya-law.webstep.sa',
    color: '#06b6d4',
    package: 'الاحترافية (١٠٠٠ ر.س)',
    stats: { speed: '97/100', visits: '+١,١٠٠ شهرياً', rating: '5.0' },
    features: ['نموذج استشارة مشفر', 'مدونة مقالات قانونية', 'سجل الاعتمادات والتراخيص', 'سيو متصدر لقوقل'],
    heroTitle: 'زوايا للمحاماة — حماية مصالحك التجارية',
    heroSub: 'حلول وقائية ودفاع قضائي بخبرة تتجاوز ١٥ عاماً أمام المحاكم السعودية',
    badge: 'قطاع أعمال',
  },
  {
    id: 'chef-layla',
    name: 'شيف ليلى — مذاق السعادة',
    category: 'صفحة شخصية',
    categoryKey: 'personal',
    role: 'شيف حلويات وضيافة خاصة للمناسبات',
    tagline: 'صفحة شخصية مبهجة تبرز التخصص مع منيو رقمي واستقبال حجوزات المناسبات الخاصة',
    url: 'https://chef-layla.webstep.sa',
    displayUrl: 'chef-layla.webstep.sa',
    color: '#8b5cf6',
    package: 'المتقدمة (٧٠٠ ر.س)',
    stats: { speed: '99/100', visits: '+١,٨٠٠ شهرياً', rating: '4.8' },
    features: ['منيو أصناف متحرك', 'زر سلة واتساب سريعة', 'تقييمات المناسبات', 'روابط السوشيال ميديا'],
    heroTitle: 'الشيف ليلى | فن صناعة الحلويات الراقية',
    heroSub: 'قوالب كيك مخصصة وضيافة مميزة تصنع ذكريات لا تُنسى في كل مناسبة',
    badge: 'طهاة ومناسبات',
  },
]

const REVIEWS = [
  { initial: 'ر', name: 'ريم القحطاني', role: 'مصممة جرافيك — صفحة شخصية', text: 'أخذت صفحة شخصية بالباقة المتقدمة. أرسل سيرتي الذاتية الآن كرابط وأصحاب العمل يتواصلون معي مباشرة. أفضل قرار اتخذته.' },
  { initial: 'س', name: 'سامي البيضاني', role: 'معلم ديكور — صفحة تعريفية', text: 'دفعت مرة واحدة وما عاد أفكر برسوم شهرية. الصفحة التعريفية لورشة الديكور تجيب لي عملاء من قوقل كل أسبوع تقريباً.' },
  { initial: 'ع', name: 'عبدالله الحربي', role: 'مصور محترف — ملف أعمال', text: 'باقة إيليت تستحق كل ريال. معرض أعمالي كمصور صار يظهر كأنه موقع شركة عالمية، وأعدّل بنفسي من لوحة التحكم.' },
]

const FAQS: [string, string][] = [
  ['هل توجد رسوم شهرية أو سنوية إجبارية؟', 'لا أبداً. تدفع قيمة الباقة مرة واحدة وتصبح الصفحة ملكك للأبد. بعد السنة الأولى يوجد فقط تجديد اختياري للدومين والاستضافة بسعر رمزي (١٤٩ ر.س/سنة)، أو تنقل ملفاتك لأي استضافة تريدها — فهي ملكك بالكامل.'],
  ['ما أنواع الصفحات التي تنفذونها؟', 'متخصصون في ثلاثة أنواع نتقنها: الصفحات الشخصية، الصفحات التعريفية للأعمال (مثل صفحات خدمات الديكور والتصميم)، وملفات الأعمال (البورتفوليو) بمعارض الصور.'],
  ['كيف أختار الباقة المناسبة؟', 'الأساسية (٣٠٠) لحضور سريع واقتصادي. المتقدمة (٧٠٠) إذا أردت هوية ودومين مجاني. الاحترافية (١٠٠٠) لعملك الجاد بموقع متكامل. وإيليت (٢٠٠٠) لتخصيص كامل بلا حدود — وإن احترت، استشرنا مجاناً.'],
  ['لمن تعود ملكية الصفحة والدومين؟', 'لك بالكامل ١٠٠٪. الدومين يُسجل باسمك، وكل ملفات الصفحة نسلمها لك متى طلبت. لا نحتجز عملك أبداً.'],
  ['متى أستلم صفحتي؟', 'الأساسية خلال ٥ أيام، المتقدمة ٤ أيام، الاحترافية ٣ أيام، وإيليت المخصصة ٧ أيام (لأنها تُصمم من الصفر). ونرسل لك معاينة أولى في منتصف المدة.'],
  ['هل أستطيع الترقية لباقة أعلى لاحقاً؟', 'نعم، في أي وقت — تدفع فقط فرق السعر بين الباقتين ونطوّر صفحتك الحالية دون أن تبدأ من الصفر.'],
  ['ماذا لو لم تعجبني النتيجة؟', 'لديك ضمان استرداد كامل خلال ١٤ يوماً من التسليم، وتعديلات مجانية حتى الرضا الكامل قبل الإطلاق.'],
  ['هل يمكنني تعديل صفحتي بنفسي مستقبلاً؟', 'في باقة إيليت تحصل على لوحة تحكم عربية سهلة تعدل منها النصوص والصور بنفسك. وفي الباقات الأخرى نوفر لك التعديلات بأسعار رمزية أو نعلمك كيف.'],
]

const CMP_ROWS: { label: string; vals: (boolean | string)[] }[] = [
  { label: 'عدد الصفحات', vals: ['١', '١ (٦ أقسام)', 'حتى ٥', 'غير محدود'] },
  { label: 'التصميم', vals: ['قالب مخصص', 'مخصص لهويتك', 'احترافي كامل', 'من الصفر ١٠٠٪'] },
  { label: 'دومين مجاني', vals: [false, 'سنة', 'سنة + إيميل', 'سنة + ٥ إيميلات'] },
  { label: 'استضافة', vals: [false, 'السنة الأولى', 'السنة الأولى', 'مميزة لسنة'] },
  { label: 'تحسين محركات البحث', vals: [false, 'أساسي', 'متقدم + AI', 'كامل + فهرسة قوقل'] },
  { label: 'معرض أعمال', vals: [false, 'معرض أو آراء', 'معرض كامل + آراء', 'معرض + صفحات تفصيلية'] },
  { label: 'وضع ليلي / نهاري', vals: [false, true, true, true] },
  { label: 'زر واتساب + نموذج', vals: [true, true, 'مربوط بالطلبات', 'مربوط بالطلبات'] },
  { label: 'لوحة تحكم', vals: [false, false, false, true] },
  { label: 'مدونة', vals: [false, false, false, true] },
  { label: 'نسخ احتياطي', vals: [false, 'يدوي', 'أسبوعي', 'يومي'] },
  { label: 'الدعم', vals: ['إيميل', 'واتساب', 'أولوية', 'فوري ٢٤/٧'] },
  { label: 'مدة التسليم', vals: ['٥ أيام', '٤ أيام', '٣ أيام', '٧ أيام'] },
]

const MARQUEE_ITEMS = [
  { Icon: User, text: 'صفحات شخصية' },
  { Icon: Briefcase, text: 'صفحات تعريفية' },
  { Icon: FolderOpen, text: 'ملفات أعمال' },
  { Icon: Globe, text: 'دفعة واحدة للأبد' },
  { Icon: Globe, text: 'دومين مجاني' },
  { Icon: Search, text: 'سيو متقدم' },
  { Icon: Shield, text: 'ضمان استرداد' },
  { Icon: Headphones, text: 'دعم متواصل' },
]

/* ─────────── Sub-components ─────────── */

function SectionBadge({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
      style={{ background: 'rgba(31,138,84,0.1)', color: '#1F8A54', border: '1px solid rgba(31,138,84,0.2)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A54] animate-pulse" />
      {text}
    </span>
  )
}

function PlanCard({ plan, copy }: {
  plan: WebServicePageContent['plans'][number]
  copy: Record<string, string>
}) {
  const { contact, isYemen, geoSettings } = useRegion()
  const yerRate = geoSettings.pricing.yerExchangeRate || 450
  const customYer = geoSettings.pricing.customPackagePrices?.[plan.id]?.yer ||
                    (plan.id === 'basic' ? geoSettings.pricing.customPackagePrices?.['web_starter']?.yer : undefined) ||
                    (plan.id === 'advanced' ? geoSettings.pricing.customPackagePrices?.['web_advanced']?.yer : undefined) ||
                    (plan.id === 'pro' ? geoSettings.pricing.customPackagePrices?.['web_business']?.yer : undefined) ||
                    (plan.id === 'elite' ? geoSettings.pricing.customPackagePrices?.['web_elite']?.yer : undefined)
  const displayPrice = isYemen ? (customYer && customYer > 0 ? customYer : Math.round(plan.price * yerRate)) : plan.price
  const displayPriceFormatted = isYemen ? displayPrice.toLocaleString('ar-YE') : plan.price.toLocaleString('ar-SA')
  const currencyOneTime = isYemen ? 'ر.ي · دفعة واحدة' : (copy.currencyOneTime || 'ر.س · دفعة واحدة')
  const currencySuffix = isYemen ? 'ر.ي' : (copy.currencySuffix || 'ر.س')
  const wa = contact.whatsapp || copy.whatsappNumber || '966593672193'

  return (
    <div
      className="relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: plan.hot ? `linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))` : 'var(--surface)',
        border: plan.hot ? `2px solid rgba(245,158,11,0.4)` : '1px solid var(--border)',
        boxShadow: plan.hot ? '0 10px 40px rgba(245,158,11,0.12)' : 'var(--shadow-md)',
      }}
    >
      {plan.hot && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          {copy.badgePopular}
        </div>
      )}
      <div className="mb-4">
        <div className="font-black text-[var(--text-primary)] text-lg leading-tight">{plan.name}</div>
        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
          <Clock size={10} /> {copy.planDelivery} {plan.delivery}
        </div>
      </div>
      <div className="mb-5 flex items-end gap-1.5">
        <span className="text-4xl font-black" style={{ color: plan.color }}>
          {displayPriceFormatted}
        </span>
        <span className="text-[var(--text-muted)] text-sm mb-1.5">{currencyOneTime}</span>
      </div>
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/${wa}?text=${encodeURIComponent(copy.planWhatsappTemplate
          .replace('{plan}', plan.name)
          .replace('{price}', displayPriceFormatted)
          .replace('{currency}', currencySuffix))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{
          background: plan.hot ? `linear-gradient(135deg, ${plan.color}, #d97706)` : `${plan.color}18`,
          color: plan.hot ? 'white' : plan.color,
          border: plan.hot ? 'none' : `1px solid ${plan.color}30`,
        }}
      >
        <Rocket size={15} />
        {copy.orderNow}
      </a>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-right font-bold text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-colors cursor-pointer"
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className="shrink-0 text-[#1F8A54] transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border)]">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  )
}

function CmpCell({ val }: { val: boolean | string }) {
  if (val === true) return <Check size={16} className="mx-auto text-[#1F8A54]" />
  if (val === false) return <Minus size={14} className="mx-auto text-[var(--text-muted)]" />
  return <span className="text-xs text-[var(--text-secondary)]">{val}</span>
}

/* ─────────── Main Page ─────────── */
export default function WebDevPage() {
  const { contact } = useRegion()
  const [content, setContent] = useState<WebServicePageContent>(DEFAULT_WEB_SERVICE_CONTENT)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'personal' | 'business' | 'portfolio'>('all')
  const [previewProject, setPreviewProject] = useState<WebServicePageContent['projects'][number] | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const copy = (key: string) => content.sectionCopy[key] ?? DEFAULT_WEB_SERVICE_CONTENT.sectionCopy[key] ?? ''
  const finalWa = contact.whatsapp || copy('whatsappNumber') || '966593672193'

  useEffect(() => {
    let active = true
    fetch('/api/public/web-service')
      .then(async response => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'تعذر تحميل محتوى الصفحة')
        return parseWebServiceContent(result.content)
      })
      .then(result => {
        if (!result.success) throw new Error('محتوى صفحة المواقع الإلكترونية غير صالح')
        if (active) setContent(result.data)
      })
      .catch(error => {
        if (active) console.error('Website service content could not be loaded; showing local defaults:', error)
      })
    return () => { active = false }
  }, [])

  // Close preview on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewProject(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filteredProjects = selectedCategory === 'all'
    ? content.projects
    : content.projects.filter(project => project.categoryKey === selectedCategory)

  return (
    <>
      <Navbar />
      <main dir="rtl" className="overflow-x-hidden">

        {/* ══ HERO ══ */}
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #1F8A54, transparent 70%)', transform: 'translate(30%,-30%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', transform: 'translate(-30%,30%)' }}
            />
          </div>
          <div className="container-ws relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionBadge text={content.hero.badge} />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-[var(--text-primary)] mb-6">
                  {content.hero.titleStart} <span className="text-gradient-green">{content.hero.titleHighlight}</span>
                  <br />
                  {content.hero.titleEnd}
                </h1>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xl">
                  {content.hero.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <a
                    href="#pricing"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)', boxShadow: '0 4px 20px rgba(31,138,84,0.35)' }}
                  >
                    <Rocket size={18} /> {copy('heroPrimaryCta')}
                  </a>
                  <a
                    href="#portfolio"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <Eye size={18} className="text-[#1F8A54]" /> {copy('heroSecondaryCta')}
                  </a>
                </div>
                {/* Proof badges */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--border)] text-sm text-[var(--text-muted)]">
                  {content.hero.proofBadges.map((item) => (
                    <span key={item} className="flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#1F8A54]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {/* Browser mockup */}
              <div className="relative hidden lg:flex justify-center">
                <div
                  className="absolute -top-4 -right-4 z-20 px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                  style={{ background: '#1F8A54' }}
                >
                  <Globe size={12} /> {copy('heroDomainBadge')}
                </div>
                <div
                  className="absolute top-1/3 -left-6 z-20 px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                  style={{ background: '#6366f1' }}
                >
                  <Globe size={12} /> {copy('heroOwnershipBadge')}
                </div>
                <div
                  className="absolute -bottom-2 right-1/4 z-20 px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                  style={{ background: '#f59e0b' }}
                >
                  <Zap size={12} /> {copy('heroDeliveryBadge')}
                </div>
                <div
                  className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div
                      className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--text-muted)]"
                      style={{ background: 'var(--bg-muted)' }}
                    >
                      <Lock size={10} className="text-[#1F8A54]" /> {content.hero.browserAddress}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-8 rounded-lg" style={{ background: 'var(--bg-muted)' }} />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-24 rounded-xl"
                          style={{ background: i === 2 ? 'rgba(31,138,84,0.1)' : 'var(--bg-soft)', border: '1px solid var(--border)' }}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 rounded-full w-3/4" style={{ background: 'var(--bg-muted)' }} />
                      <div className="h-3 rounded-full w-1/2" style={{ background: 'var(--bg-muted)' }} />
                    </div>
                    <div className="h-10 rounded-xl" style={{ background: 'rgba(31,138,84,0.12)', border: '1px solid rgba(31,138,84,0.2)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <div
          className="py-4 overflow-hidden"
          style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex gap-6 w-max" style={{ animation: 'marqueeRtl 25s linear infinite' }}>
            {[...content.marquee, ...content.marquee, ...content.marquee].map(({ icon, text }, i) => {
              const Icon = PAGE_ICONS[icon]
              return (
              <span key={i} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap px-4">
                <Icon size={14} className="text-[#1F8A54]" />
                {text}
                <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border)' }} />
              </span>
              )
            })}
          </div>
        </div>

        {/* ══ KINDS ══ */}
        <section id="kinds" className="section-padding" style={{ background: 'var(--bg)' }}>
          <div className="container-ws">
            <div className="text-center mb-14">
              <SectionBadge text={copy('kindsBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">{copy('kindsTitle')}</h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto">{copy('kindsDescription')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.kinds.map(({ icon, title, color, desc, items }) => {
                const Icon = PAGE_ICONS[icon]
                return (
                <div
                  key={title}
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-3">{title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{desc}</p>
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Check size={13} style={{ color }} className="shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" className="section-padding" style={{ background: 'var(--bg-soft)' }}>
          <div className="container-ws">
            <div className="text-center mb-14">
              <SectionBadge text={copy('featuresBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">{copy('featuresTitle')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.features.map(({ icon, title, desc }) => {
                const Icon = PAGE_ICONS[icon]
                return (
                <div
                  key={title}
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 group"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[rgba(31,138,84,0.15)] transition-colors"
                    style={{ background: 'rgba(31,138,84,0.08)', color: '#1F8A54' }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="font-black text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
                </div>
                )
              })}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {content.stats.map(({ value, label }) => (
                <div
                  key={`${label}-${value}`}
                  className="text-center py-6 px-4 rounded-2xl"
                  style={{ background: 'rgba(31,138,84,0.06)', border: '1px solid rgba(31,138,84,0.12)' }}
                >
                  <div className="text-3xl font-black text-[#1F8A54] mb-1">{value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW ══ */}
        <section id="how" className="section-padding" style={{ background: 'var(--bg)' }}>
          <div className="container-ws">
            <div className="text-center mb-14">
              <SectionBadge text={copy('stepsBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">{copy('stepsTitle')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.steps.map(({ num, title, desc, icon }) => {
                const Icon = PAGE_ICONS[icon]
                return (
                <div key={num} className="flex flex-col items-start">
                  <div className="text-5xl font-black mb-4 leading-none" style={{ color: 'rgba(31,138,84,0.15)' }}>{num}</div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(31,138,84,0.1)', color: '#1F8A54', border: '1px solid rgba(31,138,84,0.2)' }}
                  >
                    <Icon size={18} />
                  </div>
                  <h4 className="font-black text-[var(--text-primary)] text-lg mb-2">{title}</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
                </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            ══ PORTFOLIO / أعمالنا في المواقع ══
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="portfolio" className="section-padding relative overflow-hidden" style={{ background: 'var(--bg-soft)' }}>
          <div className="container-ws">
            <div className="text-center mb-12">
              <SectionBadge text={copy('projectsBadge')} />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4">
                {copy('projectsTitle')}
              </h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-base">
                {copy('projectsDescription')}
              </p>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {[
                  { key: 'all', label: `${copy('filtersAll')} (${content.projects.length.toLocaleString('ar-SA')})` },
                  { key: 'personal', label: `${copy('filtersPersonal')} (${content.projects.filter(project => project.categoryKey === 'personal').length.toLocaleString('ar-SA')})` },
                  { key: 'business', label: `${copy('filtersBusiness')} (${content.projects.filter(project => project.categoryKey === 'business').length.toLocaleString('ar-SA')})` },
                  { key: 'portfolio', label: `${copy('filtersPortfolio')} (${content.projects.filter(project => project.categoryKey === 'portfolio').length.toLocaleString('ar-SA')})` },
                ].map(({ key, label }) => {
                  const isActive = selectedCategory === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as 'all' | 'personal' | 'business' | 'portfolio')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/25 scale-105'
                          : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-muted)]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group border border-[var(--border)]"
                  style={{ background: 'var(--surface)' }}
                >
                  {/* Browser Bar Mockup */}
                  <div
                    className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between"
                    style={{ background: 'var(--bg-muted)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                    </div>
                    {/* Simulated URL Pill */}
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-mono text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)]/60 max-w-[200px] truncate">
                      <Lock size={10} className="text-[#1F8A54] shrink-0" />
                      <span className="truncate">{project.displayUrl}</span>
                    </div>
                    <span className="w-2.5 h-2.5" />
                  </div>

                  {/* Visual Preview Card Banner */}
                  <div
                    className="relative p-6 h-48 flex flex-col justify-between overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${project.color}15 0%, ${project.color}05 100%)`,
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    {/* Decorative geometric blur */}
                    <div
                      className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
                      style={{ background: project.color }}
                    />

                    {/* Top tags in banner */}
                    <div className="flex items-center justify-between relative z-10">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1"
                        style={{ background: project.color }}
                      >
                        <Globe size={11} />
                        {project.category}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm"
                        style={{
                          background: 'var(--surface)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {project.package}
                      </span>
                    </div>

                    {/* Banner Middle Preview Snippet */}
                    <div className="relative z-10 mt-auto">
                      <div className="text-xs font-medium text-[var(--text-muted)] mb-1">
                        {project.role}
                      </div>
                      <div className="text-base font-black text-[var(--text-primary)] leading-tight">
                        {project.heroTitle}
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Website Name */}
                    <div className="mb-2">
                      <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors flex items-center justify-between">
                        <span>{project.name}</span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: project.color }}
                        />
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="my-3 py-3 border-y border-[var(--border)]/70 space-y-1.5">
                      {project.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <CheckCircle2 size={13} className="shrink-0" style={{ color: project.color }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)]">
                        <div className="text-[10px] text-[var(--text-muted)]">{copy('projectSpeed')}</div>
                        <div className="text-xs font-bold text-[#1F8A54]">⚡ {project.stats.speed}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)]">
                        <div className="text-[10px] text-[var(--text-muted)]">{copy('projectVisits')}</div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">{project.stats.visits}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)]">
                        <div className="text-[10px] text-[var(--text-muted)]">{copy('projectRating')}</div>
                        <div className="text-xs font-bold text-amber-500">⭐ {project.stats.rating}</div>
                      </div>
                    </div>

                    {/* Action Buttons: رابط الزيارة & معاينة حية */}
                    <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                      {/* Visit Link Button */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${project.color}, #1F8A54)`,
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>{copy('visitSite')}</span>
                      </a>

                      {/* Interactive Preview Modal Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewProject(project)
                          setPreviewDevice('desktop')
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-[var(--bg-muted)] active:scale-95 border border-[var(--border)] text-[var(--text-primary)] cursor-pointer"
                      >
                        <Eye size={13} className="text-[#1F8A54]" />
                        <span>{copy('livePreview')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Callout in Portfolio */}
            <div
              className="mt-12 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[var(--border)]"
              style={{ background: 'var(--surface)' }}
            >
              <div className="flex items-center gap-4 text-right">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(31,138,84,0.12)', color: '#1F8A54' }}
                >
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[var(--text-primary)]">
                    {copy('portfolioCalloutTitle')}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {copy('portfolioCalloutDescription')}
                  </p>
                </div>
              </div>
              <a
                href="#pricing"
                className="btn-primary text-sm px-6 py-3 whitespace-nowrap shadow-md hover:shadow-lg transition-all"
              >
                {copy('quoteCta')}
              </a>
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" className="section-padding" style={{ background: 'var(--bg)' }}>
          <div className="container-ws">
            <div className="text-center mb-4">
              <SectionBadge text={copy('pricingBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">{copy('pricingTitle')}</h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
                {copy('pricingDescription')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(31,138,84,0.1)', color: '#1F8A54', border: '1px solid rgba(31,138,84,0.2)' }}>
                  <Globe size={12} /> {copy('oneTimeOwnership')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(31,138,84,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  <Gift size={12} /> {copy('freeDomain')}
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
              {content.plans.map((plan) => <PlanCard key={plan.id} plan={plan} copy={content.sectionCopy} />)}
            </div>
            <p className="text-center mt-6 text-xs text-[var(--text-muted)]">
              {copy('annualRenewal')}
            </p>
          </div>
        </section>

        {/* ══ COMPARISON ══ */}
        <section className="section-padding" style={{ background: 'var(--bg-soft)' }}>
          <div className="container-ws">
            <div className="text-center mb-10">
              <SectionBadge text={copy('comparisonBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">{copy('comparisonTitle')}</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm text-right">
                <thead>
                  <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
                    <th className="py-4 px-5 font-bold text-[var(--text-primary)] w-1/4">{copy('featureColumn')}</th>
                    {content.plans.map((p) => (
                      <th key={p.id} className="py-4 px-4 text-center font-black" style={{ color: p.hot ? '#f59e0b' : 'var(--text-primary)' }}>
                        <div className="flex flex-col items-center gap-1">
                          {p.hot && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{copy('badgeBest')}</span>}
                          {p.name}
                          <span className="text-xs font-bold" style={{ color: p.color }}>{`${p.price.toLocaleString('ar-SA')} ${copy('currencySuffix')}`}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.comparison.map((row, ri) => (
                    <tr key={row.label} style={{ borderBottom: '1px solid var(--border)', background: ri % 2 === 0 ? 'var(--surface)' : 'var(--bg-muted)' }}>
                      <td className="py-3.5 px-5 font-medium text-[var(--text-secondary)]">{row.label}</td>
                      {row.values.map((v, vi) => (
                        <td key={vi} className="py-3.5 px-4 text-center">
                          <CmpCell val={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--bg-muted)', borderTop: '2px solid var(--border)' }}>
                    <td className="py-4 px-5 font-black text-[var(--text-primary)]">{copy('priceRow')}</td>
                    {content.plans.map((p) => (
                      <td key={p.id} className="py-4 px-4 text-center font-black text-lg" style={{ color: p.color }}>
                        {`${p.price.toLocaleString('ar-SA')} ${copy('currencySuffix')}`}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section id="reviews" className="section-padding" style={{ background: 'var(--bg)' }}>
          <div className="container-ws">
            <div className="text-center mb-12">
              <SectionBadge text={copy('reviewsBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">{copy('reviewsTitle')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.reviews.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} size={15} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">{r.text}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                      style={{ background: 'linear-gradient(135deg,#1F8A54,#26a667)' }}
                    >
                      {r.initial}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-sm">{r.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" className="section-padding" style={{ background: 'var(--bg-soft)' }}>
          <div className="container-ws">
            <div className="text-center mb-12">
              <SectionBadge text={copy('faqsBadge')} />
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">{copy('faqsTitle')}</h2>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              {content.faqs.map(({ question, answer }) => <FAQItem key={question} q={question} a={answer} />)}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="section-padding" style={{ background: 'var(--bg)' }}>
          <div className="container-ws">
            <div
              className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#0f2419 0%,#1a3d2b 50%,#0f2419 100%)', border: '1px solid rgba(31,138,84,0.3)' }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(31,138,84,0.35), transparent 70%)' }} />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  {copy('ctaTitle')}
                </h2>
                <p className="text-green-200/70 text-lg mb-8 max-w-xl mx-auto">
                  {copy('ctaDescription')}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="#pricing"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg,#1F8A54,#26a667)', boxShadow: '0 4px 24px rgba(31,138,84,0.5)' }}
                  >
                    <Rocket size={18} /> {copy('finalOrderCta')}
                  </a>
                  <a
                    href={`https://wa.me/${finalWa}?text=${encodeURIComponent(copy('ctaWhatsappMessage'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
                  >
                    <MessageCircle size={18} /> {copy('finalWhatsappCta')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          ══ LIVE INTERACTIVE PREVIEW MODAL ══
      ══════════════════════════════════════════════════════════════════════ */}
      {previewProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-[var(--border)] animate-in zoom-in-95 duration-200"
            style={{ background: 'var(--surface)' }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Top Browser Header */}
            <div
              className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between gap-4"
              style={{ background: 'var(--bg-muted)' }}
            >
              {/* Traffic dots */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewProject(null)}
                  className="w-3.5 h-3.5 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
                  aria-label={copy('closePreview')}
                />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-500" />
              </div>

              {/* URL address bar */}
              <div
                className="flex-1 max-w-md mx-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl text-xs font-mono border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <Lock size={12} className="text-[#1F8A54]" />
                <span className="text-[var(--text-primary)] font-bold">{previewProject.url}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-sans font-bold">
                  {copy('secureSsl')}
                </span>
              </div>

              {/* Controls: Device switch & Close */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                      previewDevice === 'desktop' ? 'bg-[#1F8A54] text-white' : 'text-[var(--text-muted)]'
                    }`}
                    title={copy('desktopPreview')}
                  >
                    <Laptop size={14} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                      previewDevice === 'mobile' ? 'bg-[#1F8A54] text-white' : 'text-[var(--text-muted)]'
                    }`}
                    title={copy('mobilePreview')}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setPreviewProject(null)}
                  className="p-1.5 rounded-xl hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body / Simulated Website View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ background: 'var(--bg-soft)' }}>
              <div
                className={`mx-auto transition-all duration-300 rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] ${
                  previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-3xl'
                }`}
                style={{ background: 'var(--surface)' }}
              >
                {/* Mock site internal header */}
                <div
                  className="px-6 py-4 flex items-center justify-between border-b border-[var(--border)]"
                  style={{ background: 'var(--surface)' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
                      style={{ background: previewProject.color }}
                    >
                      {previewProject.name.slice(0, 1)}
                    </span>
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      {previewProject.name}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: previewProject.color }}
                  >
                    {previewProject.badge}
                  </span>
                </div>

                {/* Mock site Hero preview */}
                <div
                  className="p-8 sm:p-12 text-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${previewProject.color}18 0%, ${previewProject.color}05 100%)`,
                  }}
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: `${previewProject.color}20`, color: previewProject.color }}
                  >
                    {previewProject.role}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3 leading-tight">
                    {previewProject.heroTitle}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6 leading-relaxed">
                    {previewProject.heroSub}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={previewProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                      style={{ background: previewProject.color }}
                    >
                      {copy('contactWhatsapp')}
                    </a>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      ⚡ {copy('customDomain')}: {previewProject.displayUrl}
                    </span>
                  </div>
                </div>

                {/* Mock site features section */}
                <div className="p-6 grid sm:grid-cols-2 gap-3 border-t border-[var(--border)]">
                  {previewProject.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]/60 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      <CheckCircle2 size={15} style={{ color: previewProject.color }} className="shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Specs Card below mockup */}
              <div className="max-w-3xl mx-auto mt-6 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[var(--text-muted)]">{copy('projectPackageLabel')}</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{previewProject.package}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">{copy('projectLoadSpeedLabel')}</div>
                  <div className="text-sm font-bold text-[#1F8A54]">{previewProject.stats.speed}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">{copy('projectUrlLabel')}</div>
                  <div className="text-sm font-mono text-[var(--text-secondary)] dir-ltr">{previewProject.url}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: previewProject.color }}
                  >
                    <ExternalLink size={13} />
                    {copy('openProjectLink')}
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setPreviewProject(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1F8A54] text-white hover:opacity-90 transition-opacity"
                  >
                    <Rocket size={13} />
                    {copy('orderSimilarProject')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes marqueeRtl {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </>
  )
}
