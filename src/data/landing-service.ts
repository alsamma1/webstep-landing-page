import { z } from 'zod'

const text = z.string().trim().max(3000)
const featureList = z.array(text).max(30)

export const landingServiceSchema = z.object({
  hero: z.object({
    badge: text,
    title: text,
    highlight: text,
    description: text,
    primaryCta: text,
    secondaryCta: text,
    metrics: z.array(z.object({ value: text, label: text, color: z.string().regex(/^#[0-9a-fA-F]{6}$/) }).strict()).max(6),
  }).strict(),
  types: z.array(z.object({
    id: z.string().min(1).max(80),
    title: text,
    description: text,
    badge: text,
    outcome: text,
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }).strict()).max(20),
  features: z.array(z.object({ title: text, description: text, color: z.string().regex(/^#[0-9a-fA-F]{6}$/) }).strict()).max(30),
  projects: z.array(z.object({
    id: z.string().min(1).max(80),
    slug: z.string().max(100).regex(/^[a-z0-9-]*$/),
    title: text,
    category: text,
    summary: text,
    outcome: text,
    coverImage: text,
    gallery: z.array(text).max(20),
    videoUrl: text,
    tags: featureList,
    published: z.boolean(),
    featured: z.boolean(),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    seoTitle: text,
    seoDescription: text,
  }).strict()).max(60),
  packages: z.array(z.object({
    id: z.string().min(1).max(80),
    name: text,
    price: text,
    description: text,
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    featured: z.boolean(),
    features: featureList,
    cta: text,
  }).strict()).max(20),
  process: z.array(z.object({ title: text, description: text }).strict()).max(12),
  seo: z.object({
    title: text,
    description: text,
    keywords: featureList,
  }).strict(),
}).strict()

export type LandingServiceContent = z.infer<typeof landingServiceSchema>

export const DEFAULT_LANDING_SERVICE_CONTENT: LandingServiceContent = {
  hero: {
    badge: 'صفحات هبوط مصممة للتحويل',
    title: 'كل نقرة تستحق',
    highlight: 'صفحة تقنع.',
    description: 'نصمم ونطور صفحات هبوط سريعة وواضحة تقود الزائر إلى الخطوة التالية، سواء كانت طلباً أو تسجيلاً أو عملية شراء.',
    primaryCta: 'اكتشف الحل المناسب',
    secondaryCta: 'ناقش مشروعك',
    metrics: [
      { value: 'Mobile-first', label: 'تجربة متقنة على كل شاشة', color: '#1F8A54' },
      { value: 'Core Web Vitals', label: 'أداء وسرعة من البداية', color: '#6366f1' },
      { value: 'من الفكرة للإطلاق', label: 'مسار واضح وقياس مستمر', color: '#f59e0b' },
    ],
  },
  types: [
    { id: 'lead', title: 'جمع العملاء المحتملين', description: 'صفحة مركزة لنماذج التسجيل، طلب الاستشارة، أو تنزيل المحتوى.', badge: 'Lead Generation', outcome: 'نموذج واضح وخطوة تالية مباشرة', color: '#6366f1' },
    { id: 'product', title: 'إطلاق منتج أو خدمة', description: 'اعرض القيمة، أجب عن الأسئلة المهمة، وساعد الزائر على اتخاذ القرار.', badge: 'Product Launch', outcome: 'قصة منتج متسلسلة وواضحة', color: '#1F8A54' },
    { id: 'ads', title: 'حملات Google وMeta', description: 'تجربة متوافقة مع رسالة الإعلان واحتياجات الجمهور المستهدف.', badge: 'Paid Campaigns', outcome: 'اتساق أفضل بين الإعلان والصفحة', color: '#f59e0b' },
    { id: 'event', title: 'الفعاليات والندوات', description: 'صفحة تسجيل تجمع تفاصيل الفعالية والبرنامج والمتحدثين.', badge: 'Events', outcome: 'تسجيل سهل ومعلومات منظمة', color: '#ec4899' },
    { id: 'offer', title: 'العروض والمنتجات', description: 'صفحة تبرز العرض والتفاصيل والشروط ووسائل التواصل.', badge: 'Offers', outcome: 'عرض مفهوم دون تشتيت', color: '#ef4444' },
    { id: 'saas', title: 'المنتجات الرقمية وSaaS', description: 'اشرح المنتج وباقاته وابدأ تجربة أو احجز عرضاً توضيحياً.', badge: 'SaaS', outcome: 'مسار واضح من التعرف إلى التجربة', color: '#06b6d4' },
  ],
  features: [
    { title: 'سرعة وأداء', description: 'صور محسنة، تحميل ذكي، وتجربة سريعة على الجوال.', color: '#1F8A54' },
    { title: 'رسالة واضحة', description: 'ترتيب محتوى يقود العين من القيمة إلى الإجراء.', color: '#6366f1' },
    { title: 'قياس التحويلات', description: 'تهيئة نقاط القياس وربط أدوات التحليل عند تزويدنا بها.', color: '#f59e0b' },
    { title: 'ثقة وطمأنينة', description: 'إبراز المعلومات والسياسات والشهادات التي يقدمها العميل.', color: '#ec4899' },
    { title: 'قابلية الوصول', description: 'تباين جيد ونصوص وأزرار قابلة للاستخدام عبر الأجهزة.', color: '#06b6d4' },
    { title: 'تحسين مستمر', description: 'بنية تسهّل تجربة نسخ ومحتوى مختلف وقياس النتائج.', color: '#ef4444' },
  ],
  projects: [
    {
      id: 'mandoub-step-launch', slug: 'mandoub-step-launch', title: 'صفحة إطلاق تطبيق مندوب ستيب',
      category: 'App Launch', summary: 'صفحة تعريفية تشرح قيمة التطبيق ومزاياه وتوجه الزائر إلى الإجراء المناسب.',
      outcome: 'دراسة إطلاق رقمية — أضف نتائج موثقة من المشروع عند توفرها.',
      coverImage: '/assets/10.png', gallery: ['/assets/10.png'], videoUrl: '',
      tags: ['App Launch', 'Mobile', 'Product'], published: true, featured: true, accentColor: '#1F8A54',
      seoTitle: 'صفحة إطلاق تطبيق مندوب ستيب | WebStep',
      seoDescription: 'استكشف تصور صفحة هبوط لإطلاق تطبيق خدمات التوصيل مندوب ستيب.',
    },
    {
      id: 'ramadan-store-offer', slug: 'ramadan-store-offer', title: 'صفحة عروض متجر إلكتروني',
      category: 'Sales Offer', summary: 'تجربة ترويجية تضع العرض والمنتجات وخيارات الطلب في متناول الزائر.',
      outcome: 'تصميم حملة موسمية مع مساحة واضحة للشروط والمنتجات.',
      coverImage: '/assets/13.png', gallery: ['/assets/13.png'], videoUrl: '',
      tags: ['Campaign', 'E-Commerce', 'Offer'], published: true, featured: false, accentColor: '#f59e0b',
      seoTitle: 'تصميم صفحة عروض لمتجر إلكتروني | WebStep',
      seoDescription: 'تصميم صفحة حملة وعروض موسمية للتجارة الإلكترونية مع تجربة مهيأة للجوال.',
    },
    {
      id: 'saas-webinar', slug: 'saas-webinar', title: 'صفحة ندوة لشركة SaaS',
      category: 'Lead Generation', summary: 'صفحة تسجيل فعالية رقمية بمعلومات مركزة ونموذج سهل الاستخدام.',
      outcome: 'تجربة تسجيل واضحة لمتابعة الحضور والمهتمين.',
      coverImage: '/assets/12.png', gallery: ['/assets/12.png'], videoUrl: '',
      tags: ['Webinar', 'Lead Gen', 'SaaS'], published: true, featured: false, accentColor: '#6366f1',
      seoTitle: 'تصميم صفحة تسجيل ندوة رقمية | WebStep',
      seoDescription: 'شاهد تصميم صفحة هبوط لندوة رقمية وجمع تسجيلات المهتمين.',
    },
    {
      id: 'erp-ads', slug: 'erp-ads', title: 'صفحة هبوط لحملة نظام ERP',
      category: 'Paid Traffic Landing', summary: 'صفحة تشرح حلول إدارة الأعمال وتسهّل طلب العرض التوضيحي.',
      outcome: 'رحلة إعلانية إلى استشارة مهيأة للزوار من الشركات.',
      coverImage: '/assets/11.png', gallery: ['/assets/11.png'], videoUrl: '',
      tags: ['Google Ads', 'B2B', 'ERP'], published: true, featured: false, accentColor: '#ec4899',
      seoTitle: 'تصميم صفحة هبوط لنظام ERP | WebStep',
      seoDescription: 'تصميم صفحة هبوط B2B للتعريف بنظام ERP وتحويل الزيارات إلى طلبات استشارة.',
    },
  ],
  packages: [
    { id: 'starter', name: 'صفحة هبوط أساسية', price: '٦٠٠', description: 'صفحة مركزة لحملتك أو خدمتك.', color: '#6366f1', featured: false, features: ['تصميم صفحة واحدة متجاوبة', 'هيكلة المحتوى والرسالة', 'نموذج تواصل أو رابط واتساب', 'تهيئة أساسيات الأداء وSEO'], cta: 'استفسر عن الباقة' },
    { id: 'pro', name: 'صفحة هبوط Pro', price: '١٬٢٠٠', description: 'تجربة محسنة وتهيئة متقدمة للقياس.', color: '#1F8A54', featured: true, features: ['كل مميزات الباقة الأساسية', 'إعداد أحداث التحويل المتفق عليها', 'تحضير نسختين لاختبار الرسالة', 'مراجعة تجربة الجوال والوصول', 'إرشادات ما بعد الإطلاق'], cta: 'ناقش باقة Pro' },
    { id: 'launch', name: 'حزمة إطلاق متكاملة', price: '٢٬٠٠٠', description: 'صفحة مع تهيئة أصول الحملة الرقمية.', color: '#f59e0b', featured: false, features: ['كل مميزات باقة Pro', 'تهيئة صفحة الحملة وأصولها', 'ربط أدوات القياس التي يوفرها العميل', 'مراجعة المحتوى والإعلانات', 'متابعة إطلاق متفق عليها'], cta: 'ناقش الإطلاق' },
  ],
  process: [
    { title: 'نحدد الهدف', description: 'نفهم الجمهور والعرض والإجراء الذي تريد من الزائر اتخاذه.' },
    { title: 'نصمم التجربة', description: 'نرتب المحتوى والواجهة ونراجعها على الجوال والحاسوب.' },
    { title: 'نطلق ونقيس', description: 'نهيئ الصفحة للنشر ونربط أدوات القياس المتفق عليها.' },
  ],
  seo: {
    title: 'تصميم صفحات هبوط عالية التحويل | WebStep',
    description: 'تصميم وتطوير صفحات هبوط عربية سريعة للحملات والمنتجات والخدمات، بتجربة مهيأة للجوال وربط أدوات القياس.',
    keywords: ['صفحة هبوط', 'تصميم Landing Page', 'تحسين تجربة المستخدم', 'صفحات إعلانية', 'Google Ads', 'Meta Ads', 'السعودية'],
  },
}

export function parseLandingServiceContent(value: unknown) {
  return landingServiceSchema.safeParse(value)
}
