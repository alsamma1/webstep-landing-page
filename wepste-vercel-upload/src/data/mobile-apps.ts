import { z } from 'zod'

const optionalUrl = z.union([z.literal(''), z.string().url().max(2048)])
  .refine(value => !value || /^https?:\/\//i.test(value), 'يجب أن يكون الرابط HTTP أو HTTPS')
const featureSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000),
}).strict()

export const mobileAppSchema = z.object({
  id: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(160),
  nameEn: z.string().trim().max(160),
  category: z.string().trim().min(1).max(120),
  tagline: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(5000),
  badge: z.string().trim().max(80),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  iconUrl: optionalUrl,
  coverImage: optionalUrl,
  screenshots: z.array(z.string().url().max(2048)).max(20),
  features: z.array(featureSchema).max(60),
  videoUrl: optionalUrl.refine(value => !value || Boolean(getYouTubeEmbedUrl(value)), 'أدخل رابط فيديو YouTube صحيحاً'),
  iosUrl: optionalUrl,
  androidUrl: optionalUrl,
  downloadUrl: optionalUrl,
  qrImageUrl: optionalUrl,
  size: z.string().trim().max(40),
  downloads: z.string().trim().max(40),
  rating: z.string().trim().max(10),
  purchasePrice: z.string().trim().max(100),
  subscriptionPrice: z.string().trim().max(100),
  published: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
}).strict()

export type MobileApp = z.infer<typeof mobileAppSchema>

const logisticsFeatures = [
  ['تتبع GPS مباشر', 'راقب المندوب والطلبات على الخريطة وحدّث العملاء لحظياً.'],
  ['توزيع الطلبات الذكي', 'وزّع المهام تلقائياً أو يدوياً وفق موقع المندوب وتوفره.'],
  ['إدارة النقدية COD', 'تابع التحصيلات والمبالغ المستحقة والتسويات في مكان واحد.'],
  ['فواتير QR إلكترونية', 'أنشئ فواتير رقمية قابلة للمسح والمشاركة.'],
  ['إثبات التسليم', 'وثّق التسليم بالتوقيع والصورة والوقت والموقع.'],
  ['مدفوعات رقمية', 'اربط طرق الدفع المناسبة لعملائك بأمان.'],
  ['محادثة داخل التطبيق', 'تواصل مع العملاء دون إظهار أرقام الهواتف الشخصية.'],
  ['إشعارات فورية', 'أرسل تحديثات حالة الطلب والتنبيهات في الوقت المناسب.'],
  ['العمل دون اتصال', 'احفظ تحديثات المهمة مؤقتاً وزامنها عند عودة الاتصال.'],
  ['لوحة إدارة الأسطول', 'تابع الطلبات والسائقين والأداء من لوحة واحدة.'],
  ['تقييم متبادل', 'اجمع الملاحظات لتحسين جودة التجربة باستمرار.'],
  ['قارئ باركود وQR', 'امسح الشحنات لتسريع الاستلام والفرز.'],
  ['تكامل الخرائط', 'وجّه السائق إلى تطبيق الخرائط المفضل لديه.'],
  ['عناوين محفوظة', 'احفظ بيانات العملاء وملاحظات الوصول للتوصيلات القادمة.'],
  ['تقارير قابلة للتصدير', 'راجع الأداء المالي والتشغيلي وشارك التقارير.'],
  ['عربي وإنجليزي', 'واجهة تدعم اتجاهي RTL وLTR لتناسب فريقك.'],
  ['استهلاك أقل للطاقة', 'تجربة محسّنة للورديات الطويلة والاتصال المحدود.'],
  ['حوافز الإنجاز', 'حفّز الفريق بأهداف واضحة ومؤشرات تقدم.'],
  ['إدارة الفروع', 'نظّم المستودعات ومناطق الخدمة وصلاحيات الفرق.'],
  ['حماية البيانات', 'إدارة آمنة للصلاحيات والبيانات الحساسة.'],
  ['إدارة الشحنات', 'احتفظ بسجل واضح لحركة كل شحنة وتحديثاتها.'],
  ['مؤشرات أداء مباشرة', 'اعرف أوقات التسليم ومعدلات الإنجاز من لوحة واحدة.'],
].map(([title, description]) => ({ title, description }))

const screenshots = [
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
]

export const DEFAULT_MOBILE_APPS: MobileApp[] = [
  {
    id: 'mandoub-step',
    slug: 'mandoub-step',
    name: 'تطبيق مندوب ستيب للخدمات اللوجستية',
    nameEn: 'Mandoub Step Logistics',
    category: 'الخدمات اللوجستية وإدارة المناديب',
    tagline: 'منظومة متكاملة لإدارة المناديب والطلبات ومتابعة التوصيل.',
    description: 'حل رقمي لشركات التوصيل والمتاجر لإدارة الطلبات والمندوبين والتحصيلات من تطبيقات مترابطة ولوحة تحكم واضحة.',
    badge: 'حل لوجستي متكامل',
    accentColor: '#1F8A54',
    iconUrl: '',
    coverImage: screenshots[0],
    screenshots,
    features: logisticsFeatures,
    videoUrl: '',
    iosUrl: '',
    androidUrl: '',
    downloadUrl: '',
    qrImageUrl: '',
    size: '٢٨ ميغابايت',
    downloads: '',
    rating: '',
    purchasePrice: 'يبدأ من ٥٬٠٠٠ ر.س — ملكية كاملة',
    subscriptionPrice: 'تتوفر باقة سحابية حسب احتياج المشروع',
    published: true,
    featured: true,
    sortOrder: 0,
    seoTitle: 'تطبيق مندوب ستيب لإدارة التوصيل والمناديب',
    seoDescription: 'اكتشف منظومة مندوب ستيب لإدارة طلبات التوصيل وتتبع المناديب والتحصيلات في منصة واحدة.',
  },
  {
    id: 'swift-store',
    slug: 'swift-store',
    name: 'تطبيق متجر سويفت للتجارة الإلكترونية',
    nameEn: 'SwiftStore Mobile App',
    category: 'المتاجر والمبيعات الإلكترونية',
    tagline: 'تجربة تسوق سهلة تربط المتجر بعملائه على الجوال.',
    description: 'تطبيق متجر إلكتروني يساعد عملاءك على استكشاف المنتجات والشراء ومتابعة الطلبات عبر الهاتف.',
    badge: 'تجارة إلكترونية',
    accentColor: '#6366f1',
    iconUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1000&q=80',
    screenshots: [screenshots[1], screenshots[2]],
    features: logisticsFeatures.slice(0, 8),
    videoUrl: '',
    iosUrl: '',
    androidUrl: '',
    downloadUrl: '',
    qrImageUrl: '',
    size: '٢٤ ميغابايت',
    downloads: '',
    rating: '',
    purchasePrice: 'يبدأ من ٢٬٥٠٠ ر.س — ملكية كاملة',
    subscriptionPrice: 'تتوفر باقة سحابية حسب احتياج المشروع',
    published: true,
    featured: false,
    sortOrder: 1,
    seoTitle: 'تطبيق متجر سويفت للتجارة الإلكترونية',
    seoDescription: 'تطبيق تسوق للمتاجر الإلكترونية مع تجربة شراء ومتابعة طلبات مصممة للجوال.',
  },
  {
    id: 'hojozaty-pro',
    slug: 'hojozaty-pro',
    name: 'تطبيق حجوزاتي بلس للمواعيد والعيادات',
    nameEn: 'Hojozaty Booking App',
    category: 'الحجوزات والخدمات الطبية',
    tagline: 'إدارة المواعيد والحجوزات من تجربة جوال بسيطة.',
    description: 'منصة للحجوزات تناسب العيادات ومراكز الخدمات، وتجمع المواعيد والتذكيرات وبيانات العملاء.',
    badge: 'حجوزات ومواعيد',
    accentColor: '#ec4899',
    iconUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    screenshots: [screenshots[0], screenshots[2]],
    features: logisticsFeatures.slice(0, 8),
    videoUrl: '',
    iosUrl: '',
    androidUrl: '',
    downloadUrl: '',
    qrImageUrl: '',
    size: '٢١ ميغابايت',
    downloads: '',
    rating: '',
    purchasePrice: 'يبدأ من ٢٬٥٠٠ ر.س — ملكية كاملة',
    subscriptionPrice: 'تتوفر باقة سحابية حسب احتياج المشروع',
    published: true,
    featured: false,
    sortOrder: 2,
    seoTitle: 'تطبيق حجوزاتي بلس لإدارة المواعيد والعيادات',
    seoDescription: 'نظام حجوزات ومواعيد للعيادات ومراكز الخدمات، مصمم لتسهيل الحجز وإدارة العملاء.',
  },
  {
    id: 'aqar-vision',
    slug: 'aqar-vision',
    name: 'تطبيق عقار فيجن للعقارات والجولات',
    nameEn: 'AqarVision Real Estate',
    category: 'العقارات والإنشاءات',
    tagline: 'اعرض العقارات والمشاريع العقارية عبر تجربة جوال تفاعلية.',
    description: 'تطبيق عقاري لتنظيم قوائم العقارات ومشاركة تفاصيلها وتسهيل تواصل العملاء مع فريق المبيعات.',
    badge: 'تقنيات عقارية',
    accentColor: '#f59e0b',
    iconUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    screenshots: [screenshots[1], screenshots[0]],
    features: logisticsFeatures.slice(0, 8),
    videoUrl: '',
    iosUrl: '',
    androidUrl: '',
    downloadUrl: '',
    qrImageUrl: '',
    size: '٣٤ ميغابايت',
    downloads: '',
    rating: '',
    purchasePrice: 'يبدأ من ٣٬٥٠٠ ر.س — ملكية كاملة',
    subscriptionPrice: 'تتوفر باقة سحابية حسب احتياج المشروع',
    published: true,
    featured: false,
    sortOrder: 3,
    seoTitle: 'تطبيق عقار فيجن للعقارات',
    seoDescription: 'تطبيق عقاري لعرض العقارات ومشاركة تفاصيلها وتمكين العملاء من التواصل بسهولة.',
  },
]

export function parseMobileApp(value: unknown) {
  return mobileAppSchema.safeParse(value)
}

export function parseMobileAppsCatalog(value: unknown): MobileApp[] {
  if (!value || typeof value !== 'object' || !('apps' in value) || !Array.isArray(value.apps)) {
    return DEFAULT_MOBILE_APPS
  }
  const apps = value.apps.map(parseMobileApp)
  if (apps.some(app => !app.success)) {
    throw new Error('بيانات كتالوج التطبيقات المخزنة غير صالحة')
  }
  const parsed = apps.map(app => app.success ? app.data : null).filter((app): app is MobileApp => app !== null)
  if (new Set(parsed.map(app => app.slug)).size !== parsed.length) {
    throw new Error('يوجد أكثر من تطبيق بالمعرّف نفسه')
  }
  return parsed.sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    let id = ''
    if (parsed.hostname === 'youtu.be') id = parsed.pathname.slice(1)
    if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
      if (parsed.pathname === '/watch') id = parsed.searchParams.get('v') || ''
      if (parsed.pathname.startsWith('/embed/')) id = parsed.pathname.split('/')[2] || ''
      if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/')[2] || ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  } catch {
    return null
  }
}
