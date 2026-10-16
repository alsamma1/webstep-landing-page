import { z } from 'zod'

export const SERVICE_KEYS = ['ecommerce', 'systems', 'marketing', 'support'] as const
export type ManagedServiceKey = typeof SERVICE_KEYS[number]

export const SERVICE_CONFIG: Record<ManagedServiceKey, { table: string; path: string; name: string; title: string }> = {
  ecommerce: { table: 'ecommerce_service_content', path: '/services/ecommerce', name: 'المتاجر الإلكترونية', title: 'متاجر إلكترونية' },
  systems: { table: 'systems_service_content', path: '/services/systems', name: 'الأنظمة الرقمية وحلول SaaS', title: 'الأنظمة وحلول SaaS' },
  marketing: { table: 'marketing_service_content', path: '/services/marketing', name: 'الحلول الرقمية والتسويق', title: 'الحلول الرقمية والتسويق' },
  support: { table: 'support_service_content', path: '/services/support', name: 'الدعم الفني والصيانة', title: 'الدعم الفني' },
}

const text = z.string().trim().max(8000)
const url = z.union([z.literal(''), z.string().url().max(2048)])
  .refine(value => !value || /^https?:\/\//i.test(value), 'يجب أن يكون الرابط HTTP أو HTTPS')
const imageUrl = z.union([z.literal(''), z.string().max(2048)])
  .refine(value => !value || /^https?:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')), 'رابط الصورة غير صالح')

const projectSchema = z.object({
  id: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: text.min(2).max(180),
  titleEn: text.max(180),
  category: text.min(2).max(120),
  summary: text.min(10).max(1000),
  description: text.min(20).max(6000),
  outcome: text.max(1000),
  coverImage: imageUrl,
  gallery: z.array(imageUrl).max(30),
  videoUrl: url,
  externalUrl: url,
  tags: z.array(text.min(1).max(80)).max(30),
  features: z.array(text.min(1).max(1000)).max(40),
  published: z.boolean(),
  featured: z.boolean(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  sortOrder: z.number().int().min(0).max(10000),
  seoTitle: text.max(180),
  seoDescription: text.max(320),
}).strict()

export const managedServiceContentSchema = z.object({
  hero: z.object({
    eyebrow: text.max(180),
    title: text.max(240),
    highlight: text.max(180),
    description: text.max(2000),
    primaryCta: text.max(120),
    secondaryCta: text.max(120),
  }).strict(),
  intro: z.object({ eyebrow: text.max(180), title: text.max(240), description: text.max(2000) }).strict(),
  capabilities: z.array(z.object({ title: text.max(180), description: text.max(1000), icon: text.max(80) }).strict()).max(30),
  process: z.array(z.object({ title: text.max(180), description: text.max(1000) }).strict()).max(20),
  projects: z.array(projectSchema).max(80),
  packages: z.array(z.object({
    id: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
    name: text.max(180),
    price: text.max(120),
    period: text.max(80),
    description: text.max(1000),
    features: z.array(text.min(1).max(500)).max(40),
    featured: z.boolean(),
  }).strict()).max(20),
  faqs: z.array(z.object({ question: text.max(500), answer: text.max(2000) }).strict()).max(40),
  seo: z.object({ title: text.max(180), description: text.max(320), keywords: z.array(text.max(100)).max(30) }).strict(),
}).strict()

export type ManagedServiceContent = z.infer<typeof managedServiceContentSchema>
export type ManagedServiceProject = z.infer<typeof projectSchema>

function project(id: string, title: string, titleEn: string, category: string, summary: string, image: string, color: string, features: string[]): ManagedServiceProject {
  return {
    id, slug: id, title, titleEn, category, summary,
    description: `${summary} هذا نموذج محتوى أولي قابل للتعديل من لوحة الإدارة. أضف تفاصيل المشروع الحقيقية ومراحله وصوره قبل نشره كدراسة حالة.`,
    outcome: 'نموذج أولي — أضف نتائج موثقة عند توفر بيانات المشروع.',
    coverImage: image, gallery: [image], videoUrl: '', externalUrl: '',
    tags: [category, 'نموذج أولي'], features, published: false, featured: false,
    accentColor: color, sortOrder: 10, seoTitle: `${title} | WebStep`, seoDescription: summary,
  }
}

function baseContent(
  name: string,
  title: string,
  highlight: string,
  summary: string,
  category: string,
  seoKeywords: string[],
  projects: ManagedServiceProject[],
): ManagedServiceContent {
  return {
    hero: { eyebrow: `${name} · WebStep`, title, highlight, description: summary, primaryCta: 'استكشف الحلول', secondaryCta: 'ناقش مشروعك' },
    intro: { eyebrow: 'حلول مصممة لعملك', title: `نبني ${name} حول احتياجك`, description: 'من فهم التحدي إلى التنفيذ والإطلاق، نعمل معك على نطاق واضح وتجربة عملية قابلة للتوسع.' },
    capabilities: [
      { title: 'تصميم يتمحور حول المستخدم', description: 'واجهات واضحة ومتجاوبة تساعد العملاء وفريقك على إنجاز ما يحتاجونه.', icon: 'Sparkles' },
      { title: 'تكاملات ملائمة لعملك', description: 'نربط الأدوات والخدمات المطلوبة ضمن النطاق والاعتمادات التي يحددها المشروع.', icon: 'Workflow' },
      { title: 'بنية قابلة للتوسع', description: 'نختار بنية وتقنيات تدعم مراحل النمو والصيانة المستقبلية.', icon: 'Layers3' },
      { title: 'القياس والتحسين', description: 'تهيئة مؤشرات وأدوات قياس مناسبة، ثم تحسين التجربة وفق بيانات فعلية.', icon: 'ChartNoAxesCombined' },
      { title: 'أمان وموثوقية', description: 'تطبيق ممارسات الحماية والنسخ الاحتياطي وإدارة الصلاحيات حسب احتياج الخدمة.', icon: 'ShieldCheck' },
      { title: 'دعم واضح', description: 'توثيق وتسليم منظم، مع خيارات متابعة تناسب طبيعة الحل.', icon: 'Headset' },
    ],
    process: [
      { title: 'نستكشف الاحتياج', description: 'نحدد المستخدمين والأهداف والأنظمة الحالية والقيود.' },
      { title: 'نصمم الحل', description: 'نضع النطاق والتجربة والتقنيات وخطة التنفيذ.' },
      { title: 'نبني ونختبر', description: 'ننفذ على مراحل ونراجع الجودة والأداء قبل الإطلاق.' },
      { title: 'نطلق وندعم', description: 'نجهز النشر والتوثيق وخيارات الدعم بعد التسليم.' },
    ],
    projects,
    packages: [
      { id: 'discovery', name: 'جلسة تحديد النطاق', price: 'حسب المتطلبات', period: 'مشروع', description: 'مرحلة استكشاف لتحديد الحل والمدة والميزانية.', features: ['تحليل الاحتياج', 'تحديد نطاق واضح', 'خطة مراحل أولية'], featured: false },
      { id: 'tailored', name: 'حل مخصص', price: 'عرض سعر', period: 'حسب الاتفاق', description: 'تنفيذ مضبوط وفق متطلبات المشروع بعد اعتماد النطاق.', features: ['مواصفات متفق عليها', 'مراحل تسليم واضحة', 'اختبارات وتسليم موثق'], featured: true },
      { id: 'care', name: 'تشغيل ومتابعة', price: 'حسب الخدمة', period: 'شهري أو حسب الاتفاق', description: 'خيار متابعة بعد الإطلاق حسب مستوى الخدمة المطلوب.', features: ['قناة تواصل محددة', 'متابعة دورية', 'أعمال حسب اتفاق الدعم'], featured: false },
    ],
    faqs: [
      { question: 'كيف يتم تحديد السعر والمدة؟', answer: 'بعد فهم المتطلبات والتكاملات والأصول المتوفرة، نرسل نطاق عمل وعرض سعر ومدة متفقاً عليها.' },
      { question: 'هل يمكن تعديل نطاق المشروع أثناء التنفيذ؟', answer: 'نراجع التغييرات وأثرها على المدة والتكلفة، ثم نعتمدها معك قبل تنفيذها.' },
      { question: 'هل توفرون الدعم بعد الإطلاق؟', answer: 'تتوفر خيارات دعم وصيانة يمكن تحديدها ضمن العرض بحسب طبيعة الحل.' },
    ],
    seo: { title: `${name} | حلول WebStep الرقمية`, description: summary, keywords: seoKeywords },
  }
}

export const DEFAULT_MANAGED_SERVICES: Record<ManagedServiceKey, ManagedServiceContent> = {
  ecommerce: baseContent(
    'المتاجر الإلكترونية', 'متجرك يبدأ بتجربة', 'تجعل الشراء أسهل.',
    'نصمم ونطور متاجر إلكترونية عربية متجاوبة، من استكشاف المنتجات إلى إتمام الطلب، مع ربط بوابات الدفع والشحن التي يعتمدها نشاطك.',
    'متاجر إلكترونية', ['تطوير متجر إلكتروني', 'تصميم متجر إلكتروني', 'بوابات الدفع السعودية', 'تجربة تسوق', 'متجر متجاوب', 'السعودية'],
    [
      project('fashion-store', 'متجر أزياء وتجربة تسوق متجاوبة', 'Fashion Commerce Experience', 'الأزياء والتجزئة', 'تصميم تجربة متجر أزياء يركز على الصور والبحث وتفاصيل المنتج وخطوات إتمام الطلب.', '/assets/11.png', '#1F8A54', ['كتالوج وتصنيفات منتجات', 'تفاصيل ومقاسات المنتج', 'سلة وطلب واضح']),
      project('specialty-food-store', 'متجر منتجات غذائية متخصصة', 'Specialty Food Store', 'الأغذية والمنتجات', 'تجربة تصفح للمنتجات الغذائية مع معلومات منظمة وتدفق طلب بسيط.', '/assets/14.png', '#f59e0b', ['تصنيفات ومجموعات', 'تفاصيل المنتج', 'تصميم متوافق مع الجوال']),
      project('technology-store', 'متجر إلكترونيات وأجهزة', 'Technology Store', 'التقنية والإلكترونيات', 'نموذج كتالوج للمنتجات التقنية يدعم مقارنة المواصفات وعرض معلومات المنتج.', '/assets/13.png', '#6366f1', ['بحث عن المنتجات', 'مقارنة المواصفات', 'معلومات الضمان']),
    ],
  ),
  systems: baseContent(
    'الأنظمة الرقمية وحلول SaaS', 'حلول برمجية', 'ترتّب عملياتك.',
    'نبني أنظمة أعمال ومنتجات SaaS حسب سير العمل الحقيقي: لوحات تحكم، إدارة عمليات، بوابات، وتكاملات قابلة للتوسع.',
    'الأنظمة الرقمية وSaaS', ['تطوير SaaS', 'أنظمة إدارة الأعمال', 'لوحات تحكم', 'برمجة أنظمة مخصصة', 'تكامل API', 'السعودية'],
    [
      project('business-erp', 'نظام إدارة عمليات الأعمال', 'Business Operations System', 'ERP وإدارة الأعمال', 'تصور لمنظومة تعرض العمليات والمستخدمين والتقارير ضمن واجهة إدارية موحدة.', '/assets/13.png', '#1F8A54', ['أدوار وصلاحيات', 'سير عمل قابل للضبط', 'تقارير تشغيلية']),
      project('booking-platform', 'منصة إدارة الحجوزات', 'Booking Management Platform', 'الحجوزات والخدمات', 'تصميم تدفق للحجز وإدارة التوفر والعملاء من واجهة واحدة.', '/assets/12.png', '#6366f1', ['إدارة التوفر', 'لوحة عمليات', 'إشعارات حالة الحجز']),
      project('saas-dashboard', 'لوحة تحكم منتج SaaS', 'SaaS Product Dashboard', 'منصات SaaS', 'واجهة SaaS لإدارة الحسابات والاشتراكات والبيانات التشغيلية.', '/assets/10.png', '#f59e0b', ['إدارة حسابات', 'مؤشرات قابلة للتخصيص', 'بنية جاهزة للتوسع']),
    ],
  ),
  marketing: baseContent(
    'الحلول الرقمية والتسويق', 'نمو رقمي', 'مبني على فهم.',
    'نساعدك على تطوير حضورك الرقمي عبر الاستراتيجية والمحتوى وتحسين الظهور والإعلانات والتحليلات، ضمن أهداف واقعية ومقاييس متفق عليها.',
    'التسويق والحلول الرقمية', ['التسويق الرقمي', 'تحسين محركات البحث SEO', 'إدارة الحملات الإعلانية', 'استراتيجية المحتوى', 'تحليل بيانات التسويق', 'السعودية'],
    [
      project('search-visibility', 'استراتيجية ظهور في البحث', 'Search Visibility Strategy', 'SEO والمحتوى', 'دراسة تخطيط محتوى وتحسين صفحات موقع لخدمة جمهور يبحث عن حلول متخصصة.', '/assets/12.png', '#1F8A54', ['بحث الكلمات والنية', 'خريطة محتوى', 'تهيئة تقنية على مراحل']),
      project('campaign-analytics', 'لوحة قياس الحملات الرقمية', 'Campaign Analytics Dashboard', 'التحليلات الرقمية', 'نموذج لوحة متابعة تجمع أهم مؤشرات الحملات والمصادر والتحويلات.', '/assets/13.png', '#6366f1', ['مصادر الزيارات', 'مؤشرات الحملة', 'قراءة التحويلات']),
      project('brand-social', 'خطة حضور اجتماعي للعلامة', 'Social Brand Presence', 'المحتوى والتواصل', 'تخطيط هوية محتوى وتقويم نشر يساعد على اتساق الحضور عبر المنصات.', '/assets/11.png', '#ec4899', ['تقويم محتوى', 'أعمدة تحريرية', 'قياس التفاعل']),
    ],
  ),
  support: baseContent(
    'الدعم الفني والصيانة', 'نحافظ على استقرار', 'منتجك الرقمي.',
    'خدمات دعم وصيانة منظمة للمواقع والمتاجر والأنظمة: متابعة الأعطال والتحديثات والنسخ الاحتياطي والتحسين حسب اتفاق مستوى الخدمة.',
    'الدعم الفني والصيانة', ['صيانة مواقع', 'دعم فني للمتاجر', 'مراقبة أداء المواقع', 'نسخ احتياطي', 'تحديثات أمنية', 'دعم أنظمة'],
    [
      project('maintenance-dashboard', 'لوحة متابعة الصيانة', 'Maintenance Operations Dashboard', 'إدارة الصيانة', 'تصور لوحة لعرض الطلبات والحوادث ومواعيد الصيانة ضمن تدفق عمل واضح.', '/assets/13.png', '#1F8A54', ['متابعة طلبات الدعم', 'تحديد الأولوية', 'سجل الإجراءات']),
      project('uptime-monitoring', 'مراقبة التوفر والأداء', 'Uptime and Performance Monitoring', 'مراقبة الأنظمة', 'نموذج متابعة لحالة الخدمات ومؤشرات الأداء مع سجل للأحداث.', '/assets/10.png', '#6366f1', ['ملخص حالة الخدمة', 'سجل التنبيهات', 'مؤشرات الاستجابة']),
      project('backup-recovery', 'خطة النسخ والاستعادة', 'Backup and Recovery Plan', 'الاستمرارية والنسخ', 'خطة وإجراءات لتوثيق النسخ الاحتياطية واختبار خطوات الاستعادة.', '/assets/12.png', '#f59e0b', ['جدولة النسخ', 'توثيق الاستعادة', 'قائمة مراجعة دورية']),
    ],
  ),
}

export function isManagedServiceKey(value: string): value is ManagedServiceKey {
  return (SERVICE_KEYS as readonly string[]).includes(value)
}

export function mergeManagedServiceContent(value: unknown, key: ManagedServiceKey) {
  const parsed = managedServiceContentSchema.partial().safeParse(value)
  const merged = { ...DEFAULT_MANAGED_SERVICES[key], ...(parsed.success ? parsed.data : {}) }
  return managedServiceContentSchema.safeParse(merged)
}

export function parseManagedServiceContent(value: unknown) {
  return managedServiceContentSchema.safeParse(value)
}
