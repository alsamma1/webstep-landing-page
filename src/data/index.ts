import type { Service, Project, Feature, ProcessStep, WhyItem, NavItem, SocialLink } from '@/types'

// ============================================================
// Navigation
// ============================================================
export const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'أعمالنا', href: '#portfolio' },
  { label: 'لماذا WebStep', href: '#about' },
  { label: 'كيف نعمل', href: '#process' },
]

// ============================================================
// Services
// ============================================================
export const SERVICES: Service[] = [
  {
    id: 'web-dev',
    icon: 'Globe',
    title: 'تطوير المواقع',
    titleEn: 'Web Development',
    description: 'نبني مواقع احترافية سريعة وآمنة بأحدث التقنيات، مصممة لتحقق أهدافك وتجذب عملاءك.',
    features: ['Next.js / React', 'SEO متقدم', 'أداء عالٍ', 'Responsive Design'],
  },
  {
    id: 'app-dev',
    icon: 'Smartphone',
    title: 'تطوير التطبيقات',
    titleEn: 'App Development',
    description: 'تطبيقات موبايل وويب متكاملة تعمل على جميع المنصات بتجربة مستخدم استثنائية.',
    features: ['iOS & Android', 'React Native', 'PWA', 'Cross-platform'],
  },
  {
    id: 'uiux',
    icon: 'Palette',
    title: 'تصميم UI/UX',
    titleEn: 'UI/UX Design',
    description: 'تصاميم عصرية وجذابة تجمع بين الجمال والوظيفية، تجعل مستخدمك يعود دائمًا.',
    features: ['Figma', 'تصميم تفاعلي', 'نماذج أولية', 'Brand Identity'],
  },
  {
    id: 'landing',
    icon: 'Layout',
    title: 'صفحات الهبوط',
    titleEn: 'Landing Pages',
    description: 'صفحات هبوط مصممة للتحويل، تحول الزوار إلى عملاء بتصميم مقنع وبنية احترافية.',
    features: ['CRO Optimized', 'A/B Testing Ready', 'سرعة تحميل فائقة', 'تحليلات متكاملة'],
  },
  {
    id: 'ecommerce',
    icon: 'ShoppingCart',
    title: 'المتاجر الإلكترونية',
    titleEn: 'E-Commerce',
    description: 'متاجر إلكترونية متكاملة مع نظام إدارة المنتجات والطلبات والمدفوعات.',
    features: ['بوابات دفع محلية', 'إدارة المخزون', 'لوحة تحكم كاملة', 'تجربة تسوق سلسة'],
  },
  {
    id: 'systems',
    icon: 'Server',
    title: 'الأنظمة الرقمية',
    titleEn: 'Business Systems',
    description: 'أنظمة إدارة مخصصة للمؤسسات والشركات، تدير عمليات أعمالك بكفاءة عالية.',
    features: ['ERP / CRM', 'لوحات تحكم', 'تقارير وتحليلات', 'API Integrations'],
  },
  {
    id: 'digital',
    icon: 'TrendingUp',
    title: 'الحلول الرقمية',
    titleEn: 'Digital Solutions',
    description: 'حلول رقمية شاملة تشمل التحول الرقمي للمؤسسات والشركات من جميع الأحجام.',
    features: ['تحول رقمي', 'Cloud Solutions', 'أتمتة العمليات', 'استشارات تقنية'],
  },
  {
    id: 'support',
    icon: 'HeartHandshake',
    title: 'الصيانة والدعم',
    titleEn: 'Maintenance & Support',
    description: 'دعم فني متواصل وصيانة دورية لضمان عمل منتجك الرقمي بأفضل أداء.',
    features: ['دعم 24/7', 'تحديثات مستمرة', 'مراقبة الأداء', 'نسخ احتياطي'],
  },
]

// ============================================================
// Why WebStep
// ============================================================
export const WHY_ITEMS: WhyItem[] = [
  {
    id: 'design',
    icon: 'Sparkles',
    title: 'تصميم استثنائي',
    description: 'كل تفصيل مدروس بعناية. نؤمن أن التصميم ليس فقط كيف يبدو المنتج، بل كيف يعمل.',
  },
  {
    id: 'performance',
    icon: 'Zap',
    title: 'أداء لا يُضاهى',
    description: 'مواقع تحمل في ثوانٍ وتعطي تجربة سلسة. السرعة ليست خياراً، هي ضرورة.',
  },
  {
    id: 'scalable',
    icon: 'ArrowUpRight',
    title: 'قابل للنمو',
    description: 'نبني بنية تقنية قابلة للتوسع معك. من الخطوة الأولى إلى المليون مستخدم.',
  },
  {
    id: 'ux',
    icon: 'Users',
    title: 'تجربة مستخدم أولاً',
    description: 'نضع المستخدم في مركز كل قرار تصميمي. منتج يُحب يُستخدم.',
  },
  {
    id: 'responsive',
    icon: 'Monitor',
    title: 'يعمل في كل مكان',
    description: 'من الهاتف إلى الشاشة الكبيرة، تجربة مثالية على كل جهاز وكل دقة.',
  },
  {
    id: 'support',
    icon: 'Shield',
    title: 'دعم حقيقي',
    description: 'لسنا مجرد مطورين — نحن شركاء في نجاحك. دعم مستمر بعد الإطلاق.',
  },
  {
    id: 'custom',
    icon: 'Fingerprint',
    title: 'مخصص لك تمامًا',
    description: 'لا قوالب جاهزة. كل مشروع مبني من الصفر حسب احتياجاتك وهويتك.',
  },
  {
    id: 'detail',
    icon: 'Eye',
    title: 'اهتمام بالتفاصيل',
    description: 'الفرق بين المتوسط والاستثنائي يكمن في التفاصيل. نحن نهتم بكل pixel.',
  },
]

// ============================================================
// Process Steps
// ============================================================
export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    icon: 'Lightbulb',
    title: 'فهم الفكرة',
    description: 'نجلس معك لفهم رؤيتك، أهدافك، وجمهورك المستهدف. هذه الخطوة تحدد كل شيء.',
  },
  {
    number: '02',
    icon: 'Map',
    title: 'التخطيط الاستراتيجي',
    description: 'نضع خارطة طريق واضحة مع جدول زمني وميزانية محددة. لا مفاجآت.',
  },
  {
    number: '03',
    icon: 'PenTool',
    title: 'التصميم الإبداعي',
    description: 'نصمم تجربة بصرية مذهلة تعكس هويتك وتجذب جمهورك. نماذج أولية تفاعلية.',
  },
  {
    number: '04',
    icon: 'Code2',
    title: 'التطوير والبناء',
    description: 'نكتب كوداً نظيفاً وفعالاً. نبني بأحدث التقنيات مع ضمان الأداء والأمان.',
  },
  {
    number: '05',
    icon: 'TestTube',
    title: 'الاختبار والجودة',
    description: 'اختبار شامل على جميع الأجهزة والمتصفحات. صفر أخطاء في الإطلاق.',
  },
  {
    number: '06',
    icon: 'Rocket',
    title: 'الإطلاق والمتابعة',
    description: 'إطلاق احترافي مع مراقبة مستمرة. نبقى معك بعد الإطلاق لضمان نجاحك.',
  },
]

// ============================================================
// Features
// ============================================================
export const FEATURES: Feature[] = [
  { id: 'responsive', icon: 'Monitor', title: 'Responsive بالكامل', description: 'يعمل بشكل مثالي على الهاتف والتابلت والكمبيوتر.' },
  { id: 'fast', icon: 'Zap', title: 'سرعة استثنائية', description: 'تحميل خاطف وأداء لا يُضاهى في كل صفحة.' },
  { id: 'secure', icon: 'Lock', title: 'حماية وأمان', description: 'بروتوكولات أمان حديثة لحماية بياناتك وعملاءك.' },
  { id: 'scalable', icon: 'TrendingUp', title: 'قابل للتوسع', description: 'بنية تقنية تنمو معك من البداية إلى الملايين.' },
  { id: 'modern-ui', icon: 'Sparkles', title: 'UI حديث', description: 'تصاميم عصرية تترك انطباعاً لا يُنسى.' },
  { id: 'seo', icon: 'Search', title: 'SEO متقدم', description: 'تهيئة كاملة لمحركات البحث لتظهر في صدارة النتائج.' },
  { id: 'analytics', icon: 'BarChart3', title: 'تحليلات مدمجة', description: 'تتبع كل تفاعل وقرار مستخدم لتحسين أدائك.' },
  { id: 'integration', icon: 'Plug', title: 'تكامل سلس', description: 'ربط سهل مع أدواتك وأنظمتك الحالية.' },
]

// ============================================================
// Portfolio Projects
// ============================================================
export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'منصة تجارة إلكترونية',
    description: 'متجر إلكتروني متكامل مع لوحة تحكم وإدارة مخزون وبوابة دفع.',
    category: 'ecommerce',
    technologies: ['Next.js', 'Supabase', 'Stripe', 'Tailwind'],
    image: '/assets/projects/project-1.jpg',
    featured: true,
    year: 2024,
  },
  {
    id: 'project-2',
    title: 'نظام إدارة العيادات',
    description: 'نظام متكامل لإدارة المواعيد والمرضى والتقارير الطبية.',
    category: 'system',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    image: '/assets/projects/project-2.jpg',
    featured: true,
    year: 2024,
  },
  {
    id: 'project-3',
    title: 'تطبيق توصيل الطلبات',
    description: 'تطبيق موبايل متكامل لتتبع الطلبات في الوقت الفعلي.',
    category: 'app',
    technologies: ['React Native', 'Firebase', 'Maps API'],
    image: '/assets/projects/project-3.jpg',
    featured: false,
    year: 2024,
  },
  {
    id: 'project-4',
    title: 'Landing Page للعقارات',
    description: 'صفحة هبوط احترافية لشركة عقارية مع نماذج طلب وعروض تفاعلية.',
    category: 'landing',
    technologies: ['Next.js', 'GSAP', 'Tailwind'],
    image: '/assets/projects/project-4.jpg',
    featured: false,
    year: 2024,
  },
  {
    id: 'project-5',
    title: 'هوية بصرية وموقع شركة',
    description: 'هوية بصرية كاملة وموقع تعريفي لشركة استشارات.',
    category: 'uiux',
    technologies: ['Figma', 'Next.js', 'Framer Motion'],
    image: '/assets/projects/project-5.jpg',
    featured: true,
    year: 2024,
  },
  {
    id: 'project-6',
    title: 'منصة التعلم الإلكتروني',
    description: 'منصة تعليمية متكاملة مع دروس فيديو واختبارات وشهادات.',
    category: 'system',
    technologies: ['Next.js', 'Supabase', 'Video.js', 'Stripe'],
    image: '/assets/projects/project-6.jpg',
    featured: false,
    year: 2024,
  },
]

export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'website', label: 'مواقع' },
  { id: 'app', label: 'تطبيقات' },
  { id: 'ecommerce', label: 'متاجر' },
  { id: 'landing', label: 'لاندينج' },
  { id: 'system', label: 'أنظمة' },
  { id: 'uiux', label: 'UI/UX' },
]

// ============================================================
// Social Links
// ============================================================
export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'Instagram', href: '#', icon: 'Instagram' },
  { platform: 'Twitter/X', href: '#', icon: 'Twitter' },
  { platform: 'LinkedIn', href: '#', icon: 'Linkedin' },
  { platform: 'WhatsApp', href: 'https://wa.me/966500000000', icon: 'MessageCircle' },
  { platform: 'TikTok', href: '#', icon: 'Music2' },
]

// ============================================================
// Stats
// ============================================================
export const STATS = [
  { value: '50+', label: 'مشروع منجز' },
  { value: '30+', label: 'عميل راضٍ' },
  { value: '3+', label: 'سنوات خبرة' },
  { value: '100%', label: 'رضا العملاء' },
]

// ============================================================
// Form Options
// ============================================================
export const PROJECT_TYPES = [
  { value: '', label: 'اختر نوع المشروع' },
  { value: 'website', label: 'موقع ويب' },
  { value: 'app', label: 'تطبيق موبايل' },
  { value: 'ecommerce', label: 'متجر إلكتروني' },
  { value: 'landing', label: 'صفحة هبوط' },
  { value: 'system', label: 'نظام إدارة' },
  { value: 'uiux', label: 'تصميم UI/UX' },
  { value: 'other', label: 'أخرى' },
]

export const BUDGET_RANGES = [
  { value: '', label: 'حدد الميزانية التقريبية' },
  { value: 'under-5k', label: 'أقل من 5,000 ريال' },
  { value: '5k-15k', label: '5,000 - 15,000 ريال' },
  { value: '15k-30k', label: '15,000 - 30,000 ريال' },
  { value: '30k-50k', label: '30,000 - 50,000 ريال' },
  { value: 'above-50k', label: 'أكثر من 50,000 ريال' },
  { value: 'flexible', label: 'مرن / قابل للنقاش' },
]
