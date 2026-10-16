// Shared types and defaults for Homepage content and section manager
// Compatible with both Client ('use client') and Server components

export interface DeviceVisibility {
  desktop: boolean // Large screens (lg+)
  tablet: boolean  // Medium screens (md)
  mobile: boolean  // Mobile screens (sm and below)
}

export interface SectionMeta {
  id: string
  label: string
  enabled: boolean
  visibility: DeviceVisibility
}

export interface HeroFloatingBadge {
  title: string
  subtitle: string
  icon?: string
}

export interface HomepageData {
  sectionOrder: string[]
  sectionsMeta: Record<string, SectionMeta>

  // 1. Hero
  hero: {
    badge: string
    titlePrefix: string
    rotatingWords: string[]
    titleSuffix: string
    subtitle: string
    primaryBtnText: string
    primaryBtnLink: string
    secondaryBtnText: string
    secondaryBtnLink: string
    logoImage: string
    stage1Image: string
    stage2Image: string
    stage3Image: string
    floatingBadge1: HeroFloatingBadge
    floatingBadge2: HeroFloatingBadge
    stage0Logo?: string
    stage1BubbleText?: string
    stage1BubbleSubtext?: string
    stage2BubbleText?: string
    stage2BubbleSubtext?: string
    stage3BubbleText?: string
    stage3BubbleSubtext?: string
  }

  // 2. Services Experience (ماذا نقدم لك)
  servicesExperience: {
    badge: string
    title: string
    subtitle: string
    screenImage?: string
    items: Array<{
      id: string
      title: string
      titleEn: string
      desc: string
      icon: string
      image: string
      accent: string
      points: string[]
      link: string
    }>
  }

  // 3. Story Section (قصتنا ومراحل التحول)
  story: {
    badge: string
    title: string
    subtitle: string
    steps: Array<{
      id: string
      num: string
      tag: string
      heading: string
      body: string
      bullets: string[]
      accent: string
      image: string
    }>
  }

  // 4. Process Section (كيف نعمل)
  process: {
    badge: string
    title: string
    subtitle: string
    steps: Array<{
      number: string
      suit: string
      title: string
      description: string
      color: string
    }>
  }

  // 5. Services Navigation (خدماتنا الشاملة)
  servicesNav: {
    badge: string
    title: string
    subtitle: string
    items: Array<{
      title: string
      titleEn: string
      desc: string
      href: string
      accent: string
      num: string
      tags: string[]
      icon?: string
    }>
  }

  // 6. Stats & Features (الأرقام والمميزات)
  statsFeatures: {
    badge: string
    title: string
    subtitle: string
    stats: Array<{
      value: string
      label: string
    }>
    features: Array<{
      title: string
      desc: string
      icon: string
      highlight: string
      accent?: string
    }>
  }

  // 7. Portfolio (أعمالنا ومشاريعنا)
  portfolio: {
    badge: string
    title: string
    subtitle: string
    items: Array<{
      id: string
      num: string
      title: string
      subtitle: string
      description: string
      category: string
      image: string
      accent: string
      tags: string[]
      rating: number
      link: string
    }>
  }

  // 8. Yemen-specific Hero override (optional)
  yemenHero?: {
    badge?: string
    titlePrefix?: string
    rotatingWords?: string[]
    titleSuffix?: string
    subtitle?: string
    primaryBtnText?: string
    primaryBtnLink?: string
    secondaryBtnText?: string
    secondaryBtnLink?: string
    logoImage?: string
    stage1Image?: string
    stage2Image?: string
    stage3Image?: string
  }
}

export type HeroSectionData = HomepageData['hero']
export type ServicesExperienceSectionData = HomepageData['servicesExperience']
export type StorySectionData = HomepageData['story']
export type ProcessSectionData = HomepageData['process']
export type ServicesNavSectionData = HomepageData['servicesNav']
export type StatsFeaturesSectionData = HomepageData['statsFeatures']
export type PortfolioSectionData = HomepageData['portfolio']

export const INITIAL_SECTION_ORDER = [
  'hero',
  'services_experience',
  'story',
  'process',
  'services_nav',
  'stats_features',
  'portfolio',
]

export const INITIAL_SECTIONS_META: Record<string, SectionMeta> = {
  hero: {
    id: 'hero',
    label: 'الواجهة الرئيسية (Hero)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  services_experience: {
    id: 'services_experience',
    label: 'ماذا نقدم لك (عرض الخدمات التفاعلي)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  story: {
    id: 'story',
    label: 'لماذا نحن وقصتنا (Story Section)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  process: {
    id: 'process',
    label: 'كيف نعمل ومراحل التطوير (Process Deck)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  services_nav: {
    id: 'services_nav',
    label: 'استكشف خدماتنا الشاملة (Services Nav)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  stats_features: {
    id: 'stats_features',
    label: 'أرقام وإنجازات ومميزات (Stats & Features)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  portfolio: {
    id: 'portfolio',
    label: 'أعمالنا ومشاريعنا المختارة (Portfolio)',
    enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
  },
}

export const DEFAULT_HOMEPAGE_DATA: HomepageData = {
  sectionOrder: INITIAL_SECTION_ORDER,
  sectionsMeta: INITIAL_SECTIONS_META,

  // 1. Hero
  hero: {
    badge: 'حلول رقمية عصرية',
    titlePrefix: 'نبني',
    rotatingWords: ['مواقع', 'تطبيقات', 'أنظمة', 'منتجات'],
    titleSuffix: 'تبني مستقبلك',
    subtitle: 'نحوّل فكرتك إلى منتج رقمي احترافي. من التصميم إلى الإطلاق — فريق متكامل في خدمتك بأعلى معايير الجودة والأداء.',
    primaryBtnText: 'اطلب مشروعك الآن',
    primaryBtnLink: '/order',
    secondaryBtnText: 'استكشف أعمالنا',
    secondaryBtnLink: '#portfolio',
    logoImage: '/assets/logo/logo.png',
    stage1Image: '/assets/1.png',
    stage2Image: '/assets/2.png',
    stage3Image: '/assets/3.png',
    floatingBadge1: { title: 'سرعة قياسية', subtitle: 'أداء 95+ على Google', icon: 'Zap' },
    floatingBadge2: { title: 'حماية وضمان', subtitle: 'كود نظيف وآمن 100%', icon: 'Shield' },
  },

  // 2. Services Experience
  servicesExperience: {
    badge: 'ماذا نقدم لك',
    title: 'حلول متكاملة تُصنع لتقود السوق',
    subtitle: 'نجمع بين الهندسة البرمجية المتقدمة والتصميم الإبداعي لنقدم خدمات رقمية تتجاوز التوقعات.',
    items: [
      {
        id: 'web-dev',
        title: 'تطوير المواقع',
        titleEn: 'Web Development',
        desc: 'نبني مواقع احترافية سريعة وآمنة بأحدث التقنيات، مصممة لتحقق أهدافك وتجذب عملاءك مع تجربة فائقة السلاسة.',
        icon: 'Globe',
        image: '/assets/1.png',
        accent: '#1F8A54',
        points: ['Next.js / React أداء فائق', 'SEO متقدم لظهور أول', 'لوحات تحكم سهلة', 'تصميم متوافق مع كل الشاشات'],
        link: '/services/web',
      },
      {
        id: 'app-dev',
        title: 'تطوير التطبيقات',
        titleEn: 'Mobile Apps',
        desc: 'تطبيقات موبايل وويب متكاملة تعمل على iOS وAndroid بكفاءة وسرعة، بتجربة مستخدم ممتعة وسلسة.',
        icon: 'Smartphone',
        image: '/assets/2.png',
        accent: '#6366f1',
        points: ['تطبيقات iOS & Android', 'أداء محلي Native فائق', 'ربط فوري بالإشعارات والدفع', 'تصميم UI/UX مخصص'],
        link: '/services/apps',
      },
      {
        id: 'design',
        title: 'تصميم UI/UX',
        titleEn: 'UI/UX Design',
        desc: 'تصاميم عصرية وجذابة تجمع بين الجمال والوظيفية، مبنية على دراسة متأنية لسلوك المستخدم وسهولة الوصول.',
        icon: 'Palette',
        image: '/assets/3.png',
        accent: '#ec4899',
        points: ['نماذج تفاعلية Figma Prototype', 'هوية بصرية ونظام تصميم', 'أبحاث تجربة المستخدم UX', 'رفع معدلات التحويل'],
        link: '/services/design',
      },
      {
        id: 'landing',
        title: 'صفحات الهبوط',
        titleEn: 'Landing Pages',
        desc: 'صفحات هبوط عالية التحويل لإعلاناتك وحملاتك التسويقية، مصممة بدقة لتحويل الزوار إلى عملاء حقيقيين.',
        icon: 'Layout',
        image: '/assets/1.png',
        accent: '#f59e0b',
        points: ['معدلات تحويل CRO استثنائية', 'سرعة تحميل أقل من ثانية', 'جاهزة للتتبع وإعلانات Meta/Google', 'تكامل مباشر مع واتساب'],
        link: '/services/landing',
      },
      {
        id: 'ecommerce',
        title: 'المتاجر الإلكترونية',
        titleEn: 'E-Commerce',
        desc: 'متاجر رقمية متكاملة تدعم بوابات الدفع الخليجية والمحلية، مع إدارة مخزون وفواتير وتقارير مبيعات شاملة.',
        icon: 'ShoppingCart',
        image: '/assets/2.png',
        accent: '#ef4444',
        points: ['ربط مدى وApple Pay وVisa', 'إدارة المخزون والتوصيل', 'تطبيقات جوال مرافقة', 'تقارير أداء ومبيعات'],
        link: '/services/ecommerce',
      },
      {
        id: 'systems',
        title: 'الأنظمة والـ ERP',
        titleEn: 'Systems & SaaS',
        desc: 'أنظمة إدارة مخصصة للمؤسسات والشركات، لوحات تحكم SaaS، وأتمتة العمليات اليومية لرفع الكفاءة التشغيلية.',
        icon: 'Server',
        image: '/assets/3.png',
        accent: '#8b5cf6',
        points: ['أتمتة العمليات والمهام', 'صلاحيات متعددة للمستخدمين', 'تقارير مالية وتحليلية', 'أمان عالي ونسخ احتياطي'],
        link: '/services/systems',
      },
    ],
  },

  // 3. Story Section
  story: {
    badge: 'لماذا WebStep',
    title: 'الفرق الذي يصنع النجاح الرقمي',
    subtitle: 'نحن لا نكتب كوداً فحسب؛ نحن شركاؤك في بناء أصول رقمية تنمو مع طموحاتك.',
    steps: [
      {
        id: 'problem',
        num: '01',
        tag: 'المشكلة الشائعة',
        heading: 'هل تعاني من هذا؟',
        body: 'مواقع بطيئة لا تُحوّل الزوار، مطورون يختفون بعد التسليم، تصاميم لا تعكس هوية الشركة — تكلفة مرتفعة ومخرجات ضعيفة.',
        bullets: ['موقع بطيء يُنفّر الزوار', 'تصميم لا يعكس قيمتك الحقيقية', 'دعم فني يختفي بعد استلام المستحقات'],
        accent: '#ef4444',
        image: '/assets/7.png',
      },
      {
        id: 'solution',
        num: '02',
        tag: 'منهجيتنا وحلنا',
        heading: 'نبني تجارب رقمية تصنع الفارق',
        body: 'كل مشروع يُعامَل كمنتج متكامل. تصميم محكم بمعايير عالمية، كود نظيف يدوم، وأداء يجعلك في صدارة محركات البحث.',
        bullets: ['تصميم UI/UX احترافي مخصص', 'أداء 90+ على مؤشرات Google', 'بنية برمجية قابلة للتوسع اللانهائي'],
        accent: '#1F8A54',
        image: '/assets/8.png',
      },
      {
        id: 'speed',
        num: '03',
        tag: 'السرعة والالتزام',
        heading: 'من الفكرة إلى الإطلاق بأعلى كفاءة',
        body: 'لا داعي لانتظار أشهر طويلة. نعمل بمنهجية Agile مرنة تضمن رؤية التقدم أسبوعياً والوصول للسوق في الوقت المستهدف.',
        bullets: ['تسليم MVP ونماذج سريعة', 'متابعة مستمرة ومباشرة', 'شفافية كاملة بدون أي رسوم خفية'],
        accent: '#f59e0b',
        image: '/assets/9.png',
      },
      {
        id: 'support',
        num: '04',
        tag: 'الاستدامة والدعم',
        heading: 'شريكك التقني المستمر',
        body: 'الإطلاق ليس نهاية الرحلة، بل بدايتها. نرافقك بالدعم الفني والصيانة والتحسينات المستمرة لضمان بقائك في المقدمة دائماً.',
        bullets: ['دعم فني واستجابة خلال ساعتين', 'تحديثات أمان وصيانة دورية', 'تقارير أداء وتحسين مستمر'],
        accent: '#1F8A54',
        image: '/assets/10.png',
      },
    ],
  },

  // 4. Process Section
  process: {
    badge: 'كيف نعمل',
    title: 'خارطة طريق واضحة لكل مشروع',
    subtitle: '٦ خطوات مدروسة ومجربة تحول فكرتك من مجرد مسودة إلى منتج رقمي ناجح يدر أرباحاً.',
    steps: [
      { number: '01', suit: '♠', title: 'فهم الفكرة والأهداف', description: 'نجلس معك لدراسة رؤيتك وجمهورك المستهدف ومنافستك بالسوق لتحديد نطاق المشروع بدقة.', color: '#1F8A54' },
      { number: '02', suit: '♥', title: 'التخطيط الاستراتيجي', description: 'نضع خارطة طريق واضحة وجدولاً زمنياً مفصلاً مع تحديد كل المتطلبات الفنية بوضوح.', color: '#ef4444' },
      { number: '03', suit: '♦', title: 'التصميم الإبداعي UI/UX', description: 'نصمم تجربة بصرية مذهلة ونماذج تفاعلية حية تُمكّنك من تجربة المنتج قبل كتابة الكود.', color: '#f59e0b' },
      { number: '04', suit: '♣', title: 'التطوير البرمجي والبناء', description: 'نكتب كوداً نظيفاً وقوياً بأحدث التقنيات مع التركيز على الأداء والأمان التام.', color: '#1F8A54' },
      { number: '05', suit: '♠', title: 'الاختبار وضمان الجودة', description: 'اختبارات شاملة على أكثر من ٣٠ جهازاً وشاشة ومحاكاة الضغط العالي للتأكد من صفر أخطاء.', color: '#3b82f6' },
      { number: '06', suit: '♦', title: 'الإطلاق والنمو المستمر', description: 'إطلاق رسمي سلس ومراقبة مباشرة، مع تدريب فريقك ومتابعة الأداء بعد التدشين.', color: '#1F8A54' },
    ],
  },

  // 5. Services Navigation
  servicesNav: {
    badge: 'خدماتنا الشاملة',
    title: 'استكشف مسارات التحول الرقمي',
    subtitle: 'انقر على أي خدمة للتعرف على باقاتها وتفاصيلها وكيف تساعدك في تحقيق طموحاتك.',
    items: [
      {
        href: '/services/web',
        icon: 'Globe',
        title: 'تطوير المواقع',
        titleEn: 'Web Development',
        desc: 'مواقع تعريفية ومؤسسية وبورتفوليو بأعلى سرعة وتصميم متقن.',
        accent: '#1F8A54',
        num: '01',
        tags: ['Next.js', 'React', 'SEO'],
      },
      {
        href: '/services/apps',
        icon: 'Smartphone',
        title: 'تطبيقات الموبايل',
        titleEn: 'Mobile Apps',
        desc: 'تطبيقات iOS وAndroid سلسة وسريعة تلائم السوق الخليجي.',
        accent: '#3b82f6',
        num: '02',
        tags: ['Flutter', 'React Native', 'Swift'],
      },
      {
        href: '/services/ecommerce',
        icon: 'ShoppingCart',
        title: 'المتاجر الإلكترونية',
        titleEn: 'E-Commerce',
        desc: 'متجر احترافي بوابات دفع محلية وتجربة شراء تزيد مبيعاتك.',
        accent: '#f97316',
        num: '03',
        tags: ['Shopify', 'WooCommerce', 'Stripe'],
      },
      {
        href: '/services/systems',
        icon: 'Server',
        title: 'الأنظمة والـ ERP',
        titleEn: 'Systems & ERP',
        desc: 'لوحات تحكم وأنظمة إدارية تُبسّط العمليات وتمنحك سيطرة كاملة.',
        accent: '#8b5cf6',
        num: '04',
        tags: ['Node.js', 'PostgreSQL', 'Docker'],
      },
      {
        href: '/services/design',
        icon: 'Palette',
        title: 'تصميم UI/UX',
        titleEn: 'UI/UX Design',
        desc: 'هويات بصرية وتصاميم واجهات تسحر الزائر وتلهمه للتفاعل.',
        accent: '#ec4899',
        num: '05',
        tags: ['Figma', 'UI Kits', 'Branding'],
      },
      {
        href: '/services/landing',
        icon: 'LayoutTemplate',
        title: 'صفحات الهبوط',
        titleEn: 'Landing Pages',
        desc: 'صفحات هبوط إعلانية عالية التحويل تحقق أعلى عائد من ميزانيتك.',
        accent: '#f59e0b',
        num: '06',
        tags: ['CRO', 'A/B Testing', 'Pixel'],
      },
      {
        href: '/services/marketing',
        icon: 'TrendingUp',
        title: 'الحلول الرقمية والتسويق',
        titleEn: 'Digital Marketing & Growth',
        desc: 'تحسين محركات البحث SEO، حملات إعلانية ذكية، واستراتيجيات نمو تصنع فارقاً.',
        accent: '#06b6d4',
        num: '07',
        tags: ['SEO', 'SEM', 'Analytics'],
      },
      {
        href: '/services/support',
        icon: 'HeartHandshake',
        title: 'الصيانة والدعم الفني',
        titleEn: 'Support & Maintenance',
        desc: 'معك دائماً بعد الإطلاق، حماية أمنية، تحديثات دورية، ودعم فني متواصل 24/7.',
        accent: '#10b981',
        num: '08',
        tags: ['24/7 Support', 'Security', 'Backups'],
      },
    ],
  },

  // 6. Stats & Features
  statsFeatures: {
    badge: 'أرقام تتحدث عنا',
    title: 'إنجازات بنيناها بالعمل الجاد والشغف',
    subtitle: 'أرقام حقيقية تعكس ثقة شركائنا ونوعية المشاريع التي نفخر بتقديمها في السوق السعودي والخليجي.',
    stats: [
      { value: '١٢٠+', label: 'مشروع رقمي منجز' },
      { value: '٩٨٪', label: 'نسبة رضا العملاء' },
      { value: '٥+ سنوات', label: 'خبرة تقنية متخصصة' },
      { value: '٢٠+', label: 'خبير ومطور ومصمم' },
    ],
    features: [
      {
        title: 'سرعة استجابة وأداء قياسي',
        desc: 'مواقع وتطبيقات تفتح في أجزاء من الثانية وتتصدر تقييمات Core Web Vitals.',
        icon: 'Zap',
        highlight: 'أداء 95+',
        accent: '#1F8A54',
      },
      {
        title: 'أمان وحماية متقدمة',
        desc: 'تطبيق أعلى معايير التشفير وحماية البيانات لضمان سلامة معلوماتك وعملائك.',
        icon: 'Lock',
        highlight: 'حماية 100%',
        accent: '#6366f1',
      },
      {
        title: 'تصميم يرفع المبيعات والتحويل',
        desc: 'واجهات مدروسة تزيد تفاعل الزوار وتضاعف فرص إتمام الطلبات.',
        icon: 'TrendingUp',
        highlight: 'نمو +30%',
        accent: '#f59e0b',
      },
      {
        title: 'تكامل مع كل المنصات والبوابات',
        desc: 'ربط مباشر وسلس مع بوابات الدفع، شركات الشحن، وأدوات التسويق والتحليلات.',
        icon: 'Plug',
        highlight: 'ربط فوري',
        accent: '#ec4899',
      },
    ],
  },

  // 7. Portfolio
  portfolio: {
    badge: 'أعمال نفخر بها',
    title: 'نماذج من رحلتنا في تحويل الأفكار إلى واقع',
    subtitle: 'استكشف بعض المشاريع التي صممناها وطورناها لشركات ورواد أعمال حققوا بها قفزات نوعية.',
    items: [
      {
        id: 'step-light',
        num: '01',
        title: 'Step Light',
        subtitle: 'منصة إدارة المتاجر الرقمية',
        description: 'منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية والمحلية — من المخزون والمبيعات إلى تجربة العميل.',
        category: 'منصة تجارية',
        image: '/assets/11.png',
        accent: '#1F8A54',
        tags: ['Next.js', 'PostgreSQL', 'Stripe'],
        rating: 5,
        link: '',
      },
      {
        id: 'step-delivery',
        num: '02',
        title: 'تطبيق مندوب التوصيل',
        subtitle: 'إدارة التوصيل وتتبع الشحنات',
        description: 'تطبيق موبايل متكامل لإدارة رحلات التوصيل، تتبع الطلبات في الوقت الفعلي، وتنسيق المناديب.',
        category: 'تطبيق موبايل',
        image: '/assets/12.png',
        accent: '#3b82f6',
        tags: ['React Native', 'Firebase', 'Maps API'],
        rating: 5,
        link: '',
      },
      {
        id: 'step-erp',
        num: '03',
        title: 'Step ERP Enterprise',
        subtitle: 'نظام إدارة موارد الشركات',
        description: 'نظام ERP شامل مصمم للشركات — يدمج المحاسبة والمخزون والموارد البشرية في منصة واحدة ذكية وسريعة.',
        category: 'نظام مؤسسي',
        image: '/assets/13.png',
        accent: '#f97316',
        tags: ['Node.js', 'React', 'PostgreSQL'],
        rating: 5,
        link: '',
      },
      {
        id: 'step-salon',
        num: '04',
        title: 'Step Salon',
        subtitle: 'إدارة الصالونات والمواعيد',
        description: 'تطبيق متخصص لإدارة مراكز التجميل — حجوزات العملاء الفورية، إدارة الموظفين، والتقارير المالية.',
        category: 'تطبيق موبايل',
        image: '/assets/14.png',
        accent: '#8b5cf6',
        tags: ['Flutter', 'Supabase', 'Dart'],
        rating: 5,
        link: '',
      },
    ],
  },
}
