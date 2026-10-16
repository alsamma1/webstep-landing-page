export type WebServiceIcon =
  | 'Globe' | 'Zap' | 'Palette' | 'Smartphone' | 'Search' | 'MessageCircle'
  | 'Settings' | 'Shield' | 'User' | 'Briefcase' | 'FolderOpen' | 'Send'
  | 'Rocket' | 'Headphones'

export interface WebServicePageContent {
  hero: {
    badge: string
    titleStart: string
    titleHighlight: string
    titleEnd: string
    description: string
    browserAddress: string
    proofBadges: string[]
  }
  sectionCopy: Record<string, string>
  stats: Array<{ value: string; label: string }>
  plans: Array<{
    id: string
    name: string
    price: number
    delivery: string
    color: string
    hot: boolean
    features: string[]
  }>
  features: Array<{ icon: WebServiceIcon; title: string; desc: string }>
  kinds: Array<{
    icon: WebServiceIcon
    title: string
    color: string
    desc: string
    items: string[]
  }>
  steps: Array<{ num: string; title: string; desc: string; icon: WebServiceIcon }>
  projects: Array<{
    id: string
    name: string
    category: string
    categoryKey: 'personal' | 'business' | 'portfolio'
    role: string
    tagline: string
    url: string
    displayUrl: string
    color: string
    package: string
    stats: { speed: string; visits: string; rating: string }
    features: string[]
    heroTitle: string
    heroSub: string
    badge: string
  }>
  reviews: Array<{ initial: string; name: string; role: string; text: string }>
  faqs: Array<{ question: string; answer: string }>
  comparison: Array<{ label: string; values: Array<boolean | string> }>
  marquee: Array<{ icon: WebServiceIcon; text: string }>
}

export const WEB_SERVICE_SECTION_LABELS: Record<keyof WebServicePageContent, string> = {
  hero: 'المقدمة الرئيسية',
  sectionCopy: 'عناوين ونصوص الأقسام',
  stats: 'الإحصائيات',
  plans: 'الباقات والأسعار',
  features: 'المميزات',
  kinds: 'أنواع المواقع',
  steps: 'خطوات العمل',
  projects: 'نماذج الأعمال',
  reviews: 'آراء العملاء',
  faqs: 'الأسئلة الشائعة',
  comparison: 'جدول مقارنة الباقات',
  marquee: 'الشريط المتحرك',
}

export const DEFAULT_WEB_SERVICE_CONTENT: WebServicePageContent = {
  hero: {
    badge: 'دفعة واحدة — بدون رسوم شهرية للأبد',
    titleStart: 'صفحتُك التي',
    titleHighlight: 'تمثّلك',
    titleEnd: 'تُدفع مرة واحدة… وتبقى لك للأبد',
    description: 'ويب ستيب متخصصة في الصفحات الشخصية، الصفحات التعريفية للأعمال، وملفات الأعمال — بنفس مستوى أفضل المواقع التي تراها… لكن بدون اشتراكات شهرية، وبدون تعقيد، وبملكية كاملة لك.',
    browserAddress: 'yourname.sa',
    proofBadges: ['دومين مجاني لسنة', 'تسليم خلال ٣ - ٧ أيام', 'ضمان استرداد ١٤ يوماً'],
  },
  sectionCopy: {
    kindsBadge: 'تخصصنا الدقيق',
    kindsTitle: 'ثلاثة أنواع نتقنها حتى الكمال',
    kindsDescription: 'لا نبني كل شيء — نتخصص فيما نبرع فيه: صفحات تُعرّف بك وبعملك وبأعمالك.',
    featuresBadge: 'لماذا ويب ستيب؟',
    featuresTitle: 'مميزات تجعل صفحتك تبيع عنك',
    stepsBadge: 'آلية العمل',
    stepsTitle: '٤ خطوات تفصلك عن صفحتك',
    projectsBadge: 'معرض أعمالنا الحية',
    projectsTitle: 'أعمالنا في المواقع والصفحات الشخصية',
    projectsDescription: 'استعرض نماذج حقيقية لمواقع أطلقناها لعملائنا في السعودية والخليج. يمكنك الاطلاع على اسم الموقع، تفاصيل الباقة، وزيارة الرابط المباشر.',
    pricingBadge: 'الباقات والأسعار',
    pricingTitle: 'أربع باقات… دفعة واحدة وانتهى',
    pricingDescription: 'أسعار واضحة بلا مفاجآت. ادفع مرة واحدة وصفحتك ملكك للأبد — لا تجديد ولا رسوم مخفية.',
    comparisonBadge: 'قارن بنفسك',
    comparisonTitle: 'مقارنة تفصيلية بين الباقات',
    reviewsBadge: 'آراء عملائنا',
    reviewsTitle: 'قالوا عن صفحاتهم',
    faqsBadge: 'الأسئلة الشائعة',
    faqsTitle: 'كل ما تريد معرفته',
    ctaTitle: 'جاهز تخطو خطوتك الرقمية؟',
    ctaDescription: 'انضم لأكثر من ١٢٠ عميل امتلكوا صفحاتهم بدفعة واحدة. صفحتك القادمة على بُعد نموذج واحد.',
    ctaWhatsappMessage: 'مرحباً، عندي استفسار',
    portfolioCalloutTitle: 'تريد موقعاً يحمل اسمك وتخصصك مثل هذه النماذج؟',
    portfolioCalloutDescription: 'اختر الباقة المناسبة وسنبدأ تصميم صفحتك الخاصة فوراً مع دومين واستضافة مجانية.',
    filtersAll: 'جميع المواقع',
    filtersPersonal: 'صفحات شخصية',
    filtersBusiness: 'صفحات تعريفية',
    filtersPortfolio: 'ملفات أعمال',
    badgePopular: 'الأكثر طلباً',
    badgeBest: 'الأفضل',
    oneTimeOwnership: 'دفع لمرة واحدة — ملكية دائمة',
    freeDomain: 'الدومين المجاني سنة كاملة في الباقات الأعلى',
    annualRenewal: 'بعد السنة الأولى: تجديد اختياري للدومين والاستضافة فقط بـ ١٤٩ ر.س/سنة — أو انقل موقعك لأي استضافة تريدها، الملفات كلها لك.',
    featureColumn: 'الميزة',
    priceRow: 'السعر (دفعة واحدة)',
    projectSpeed: 'سرعة الأداء',
    projectVisits: 'الزيارات',
    projectRating: 'التقييم',
    visitSite: 'زيارة الموقع',
    livePreview: 'معاينة حية',
    secureSsl: 'آمن SSL',
    contactWhatsapp: 'تواصل مباشرة عبر واتساب',
    customDomain: 'دومين خاص',
    closePreview: 'إغلاق المعاينة',
    desktopPreview: 'معاينة شاشة كمبيوتر',
    mobilePreview: 'معاينة شاشة جوال',
    quoteCta: 'اختر باقتك الآن ←',
    heroPrimaryCta: 'تصفح الباقات والأسعار',
    heroSecondaryCta: 'أعمالنا الحية',
    heroDomainBadge: 'دومين مجاني سنة',
    heroOwnershipBadge: 'ملكك للأبد',
    heroDeliveryBadge: 'تسليم خلال أيام',
    planDelivery: 'تسليم',
    currencyOneTime: 'ر.س — دفعة واحدة',
    currencySuffix: 'ر.س',
    planWhatsappTemplate: 'مرحباً، أريد الاشتراك بباقة {plan} بسعر {price} {currency}',
    orderNow: 'اطلب الآن',
    projectCategoryAllSuffix: 'المواقع',
    projectCategoryPersonalSuffix: 'صفحات شخصية',
    projectCategoryBusinessSuffix: 'صفحات تعريفية',
    projectCategoryPortfolioSuffix: 'ملفات أعمال',
    pricingBannerOneTime: 'دفع لمرة واحدة — ملكية دائمة',
    pricingBannerDomain: 'الدومين المجاني سنة كاملة في الباقات الأعلى',
    finalOrderCta: 'عبّئ طلبك الآن',
    finalWhatsappCta: 'اسألنا واتساب',
    offerDomain: 'دومين مجاني لسنة',
    offerDelivery: 'تسليم خلال ٣ - ٧ أيام',
    offerRefund: 'ضمان استرداد ١٤ يوماً',
    whatsappNumber: '966500000000',
    projectPackageLabel: 'الباقة المنفذة',
    projectLoadSpeedLabel: 'سرعة التحميل',
    projectUrlLabel: 'رابط الموقع',
    openProjectLink: 'فتح الرابط',
    orderSimilarProject: 'اطلب مثل هذا الموقع',
  },
  stats: [
    { value: '١٢٠+', label: 'صفحة منجزة' },
    { value: '٩٨٪', label: 'رضا العملاء' },
    { value: '٤.٩', label: 'تقييم من ٥' },
    { value: '٠ ر.س', label: 'رسوم شهرية للأبد' },
  ],
  plans: [
    { id: 'basic', name: 'الأساسية', price: 300, delivery: '٥ أيام', color: '#6366f1', hot: false, features: ['صفحة واحدة كاملة', 'زر واتساب مباشر', 'نموذج تواصل', 'تصميم متجاوب للجوال'] },
    { id: 'advanced', name: 'المتقدمة', price: 700, delivery: '٤ أيام', color: '#1F8A54', hot: false, features: ['دومين مجاني سنة', 'استضافة السنة الأولى', 'سيو أساسي', 'وضع ليلي ونهاري', 'معرض صور أو آراء عملاء'] },
    { id: 'pro', name: 'الاحترافية', price: 1000, delivery: '٣ أيام', color: '#f59e0b', hot: true, features: ['حتى ٥ صفحات', 'دومين + إيميل مهني', 'سيو متقدم + AI', 'معرض كامل + آراء موثقة', 'نسخ احتياطي أسبوعي', 'دعم ذو أولوية'] },
    { id: 'elite', name: 'إيليت المخصصة', price: 2000, delivery: '٧ أيام', color: '#ec4899', hot: false, features: ['صفحات غير محدودة', 'لوحة تحكم عربية', 'مدونة مدمجة', '٥ إيميلات مهنية', 'نسخ احتياطي يومي', 'دعم فوري ٢٤/٧'] },
  ],
  features: [
    { icon: 'Globe', title: 'دفعة واحدة للأبد', desc: 'لا اشتراكات ولا رسوم شهرية. تدفع مرة واحدة وصفحتك ملكك للأبد.' },
    { icon: 'Palette', title: 'تصميم فاخر', desc: 'تصاميم عصرية مخصصة تعكس شخصيتك أو هوية عملك وتميزك.' },
    { icon: 'Smartphone', title: 'متجاوب كلياً', desc: 'صفحتك تظهر مثالية على الجوال والتابلت والكمبيوتر.' },
    { icon: 'Search', title: 'ظهور في البحث', desc: 'تحسين لمحركات البحث والذكاء الاصطناعي ليصلك الناس بأنفسهم.' },
    { icon: 'Globe', title: 'دومين مجاني', desc: 'في الباقات الأعلى: نطاق باسمك مجاناً لمدة سنة كاملة.' },
    { icon: 'MessageCircle', title: 'واتساب مباشر', desc: 'زائرك يضغط زراً واحداً ويحادثك فوراً — تحويلات أعلى بلا مجهود.' },
    { icon: 'Settings', title: 'وضع ليلي ونهاري', desc: 'صفحتك تتكيف مع تفضيل الزائر تلقائياً بتجربة أنيقة.' },
    { icon: 'Shield', title: 'ضمان استرداد', desc: '١٤ يوماً كاملة لتجرب وتقرر — غير راضٍ؟ نعيد لك المبلغ.' },
  ],
  kinds: [
    { icon: 'User', title: 'صفحة شخصية', color: '#6366f1', desc: 'بطاقة تعريف رقمية تفتح لك الأبواب — مثالية للمستقلين والباحثين عن حضور مهني.', items: ['نبذة وسيرة ذاتية أنيقة', 'مهارات وخبرات وإنجازات', 'روابطك الاجتماعية والتواصل المباشر'] },
    { icon: 'Briefcase', title: 'صفحة تعريفية لعملك', color: '#1F8A54', desc: 'واجهة احترافية تعرّف عملاءك بخدماتك وتقودهم مباشرة إلى واتسابك.', items: ['عرض الخدمات والمميزات', 'آراء العملاء وبناء الثقة', 'زر واتساب ونموذج طلبات'] },
    { icon: 'FolderOpen', title: 'ملف أعمال (بورتفوليو)', color: '#f59e0b', desc: 'معرض رقمي يعرض مشاريعك وصور أعمالك بطريقة تبيع موهبتك عنك.', items: ['معرض صور منظم وجذاب', 'صفحة تفصيلية لكل عمل', 'مثالي للمصممين والمصورين والحرفيين'] },
  ],
  steps: [
    { num: '٠١', title: 'عبّئ طلبك', desc: 'نموذج بسيط عنك وعن نشاطك — لا يأخذ دقيقتين.', icon: 'Send' },
    { num: '٠٢', title: 'نصمم لك', desc: 'نبدأ فوراً وترى المعاينة الأولى في منتصف المدة.', icon: 'Palette' },
    { num: '٠٣', title: 'نعدّل معك', desc: 'تعديلات حتى تقول: هذا بالضبط ما أريد.', icon: 'Settings' },
    { num: '٠٤', title: 'نطلق صفحتك', desc: 'رفع رسمي على الدومين… وصفحتك ملكك للأبد.', icon: 'Rocket' },
  ],
  projects: [
    { id: 'naif-consultant', name: 'موقع المستشار نايف العتيبي', category: 'صفحة شخصية', categoryKey: 'personal', role: 'استشارات إدارية وتطوير قيادات', tagline: 'حضور رقمي مهني راقٍ يعكس الخبرة ويسهل حجز الاستشارات وتنزيل السيرة الذاتية', url: 'https://naif-consultant.webstep.sa', displayUrl: 'naif-consultant.webstep.sa', color: '#1F8A54', package: 'الاحترافية (١٠٠٠ ر.س)', stats: { speed: '99/100', visits: '+١,٤٠٠ شهرياً', rating: '5.0' }, features: ['حجز استشارات تقويمية', 'سيرة ذاتية تفاعلية', 'تكامل واتساب مباشر', 'دومين سعودي خاص'], heroTitle: 'المستشار نايف العتيبي', heroSub: 'خبير الحوكمة المؤسسية وتطوير الأعمال للشركات والجهات الحكومية', badge: 'نشط ومباشر' },
    { id: 'abaad-studio', name: 'استوديو أبعاد للتصميم والديكور', category: 'صفحة تعريفية', categoryKey: 'business', role: 'تصميم داخلي ومعماري راقٍ', tagline: 'واجهة استثنائية لعرض الفلل والمشاريع المنجزة مع نموذج طلب تسعيرة وكتالوج تفاعلي', url: 'https://abaad-studio.webstep.sa', displayUrl: 'abaad-studio.webstep.sa', color: '#6366f1', package: 'إيليت المخصصة (٢٠٠٠ ر.س)', stats: { speed: '98/100', visits: '+٣,٢٠٠ شهرياً', rating: '4.9' }, features: ['معرض مشاريع وفلاتر', 'سلايدر مقارنة قبل/بعد', 'نموذج طلب عروض ذكي', 'لوحة تحكم للمحتوى'], heroTitle: 'أبعاد | صياغة الفراغات الراقية', heroSub: 'أكثر من ٤٥ فيلا وقصراً بتصاميم تجمع الفخامة العصرية والأصالة', badge: 'الأعلى طلباً' },
    { id: 'tariq-arch', name: 'بورتفوليو م. طارق الشريف', category: 'ملفات أعمال', categoryKey: 'portfolio', role: 'معماري ومصمم نماذج ثلاثية الأبعاد', tagline: 'معرض بصري فائق الدقة يبيع الموهبة للعملاء وأصحاب المشاريع الكبرى بأناقة مطلقة', url: 'https://tariq-arch.webstep.sa', displayUrl: 'tariq-arch.webstep.sa', color: '#f59e0b', package: 'المتقدمة (٧٠٠ ر.س)', stats: { speed: '100/100', visits: '+٨٥٠ شهرياً', rating: '5.0' }, features: ['معرض عالي الدقة HD', 'تحميل السيرة الذاتية PDF', 'نبذة عن الجوائز والتكريمات', 'وضع ليلي مميز'], heroTitle: 'طارق الشريف — هندسة الفراغ والضوء', heroSub: 'ملف أعمال معماري ونماذج 3D Renderings بتقنيات بصرية سينمائية', badge: 'معرض فني' },
    { id: 'dr-sarah', name: 'عيادات د. سارة باحمدان', category: 'صفحة تعريفية', categoryKey: 'business', role: 'استشارية طب وجراحة الجلدية والتجميل', tagline: 'بوابة طبية أنيقة تبني الثقة وتقدم معلومات العلاجات وجدول المواعيد وتحديد موقع العيادة', url: 'https://dr-sarah.webstep.sa', displayUrl: 'dr-sarah.webstep.sa', color: '#ec4899', package: 'الاحترافية (١٠٠٠ ر.س)', stats: { speed: '99/100', visits: '+٢,١٠٠ شهرياً', rating: '4.9' }, features: ['تكامل خرائط قوقل', 'جدول الخدمات والأسعار', 'آراء مراجعين موثقة', 'زر طوارئ واتساب'], heroTitle: 'د. سارة باحمدان | الجلدية والتجميل الطبي', heroSub: 'عناية طبية قائمة على الأدلة ونتائج طبيعية بأحدث أجهزة الليزر العالمية', badge: 'طبي معتمد' },
    { id: 'zawaya-law', name: 'مكتب زوايا للمحاماة والاستشارات', category: 'صفحة تعريفية', categoryKey: 'business', role: 'محاماة وتحكيم تجاري للشركات', tagline: 'حضور رقمي رصين يعكس القوة والمصداقية لخدمة قطاع الأعمال والمستثمرين محلياً ودولياً', url: 'https://zawaya-law.webstep.sa', displayUrl: 'zawaya-law.webstep.sa', color: '#06b6d4', package: 'الاحترافية (١٠٠٠ ر.س)', stats: { speed: '97/100', visits: '+١,١٠٠ شهرياً', rating: '5.0' }, features: ['نموذج استشارة مشفر', 'مدونة مقالات قانونية', 'سجل الاعتمادات والتراخيص', 'سيو متصدر لقوقل'], heroTitle: 'زوايا للمحاماة — حماية مصالحك التجارية', heroSub: 'حلول وقائية ودفاع قضائي بخبرة تتجاوز ١٥ عاماً أمام المحاكم السعودية', badge: 'قطاع أعمال' },
    { id: 'chef-layla', name: 'شيف ليلى — مذاق السعادة', category: 'صفحة شخصية', categoryKey: 'personal', role: 'شيف حلويات وضيافة خاصة للمناسبات', tagline: 'صفحة شخصية مبهجة تبرز التخصص مع منيو رقمي واستقبال حجوزات المناسبات الخاصة', url: 'https://chef-layla.webstep.sa', displayUrl: 'chef-layla.webstep.sa', color: '#8b5cf6', package: 'المتقدمة (٧٠٠ ر.س)', stats: { speed: '99/100', visits: '+١,٨٠٠ شهرياً', rating: '4.8' }, features: ['منيو أصناف متحرك', 'زر سلة واتساب سريعة', 'تقييمات المناسبات', 'روابط السوشيال ميديا'], heroTitle: 'الشيف ليلى | فن صناعة الحلويات الراقية', heroSub: 'قوالب كيك مخصصة وضيافة مميزة تصنع ذكريات لا تُنسى في كل مناسبة', badge: 'طهاة ومناسبات' },
  ],
  reviews: [
    { initial: 'ر', name: 'ريم القحطاني', role: 'مصممة جرافيك — صفحة شخصية', text: 'أخذت صفحة شخصية بالباقة المتقدمة. أرسل سيرتي الذاتية الآن كرابط وأصحاب العمل يتواصلون معي مباشرة. أفضل قرار اتخذته.' },
    { initial: 'س', name: 'سامي البيضاني', role: 'معلم ديكور — صفحة تعريفية', text: 'دفعت مرة واحدة وما عاد أفكر برسوم شهرية. الصفحة التعريفية لورشة الديكور تجيب لي عملاء من قوقل كل أسبوع تقريباً.' },
    { initial: 'ع', name: 'عبدالله الحربي', role: 'مصور محترف — ملف أعمال', text: 'باقة إيليت تستحق كل ريال. معرض أعمالي كمصور صار يظهر كأنه موقع شركة عالمية، وأعدّل بنفسي من لوحة التحكم.' },
  ],
  faqs: [
    { question: 'هل توجد رسوم شهرية أو سنوية إجبارية؟', answer: 'لا أبداً. تدفع قيمة الباقة مرة واحدة وتصبح الصفحة ملكك للأبد. بعد السنة الأولى يوجد فقط تجديد اختياري للدومين والاستضافة بسعر رمزي (١٤٩ ر.س/سنة)، أو تنقل ملفاتك لأي استضافة تريدها — فهي ملكك بالكامل.' },
    { question: 'ما أنواع الصفحات التي تنفذونها؟', answer: 'متخصصون في ثلاثة أنواع نتقنها: الصفحات الشخصية، الصفحات التعريفية للأعمال (مثل صفحات خدمات الديكور والتصميم)، وملفات الأعمال (البورتفوليو) بمعارض الصور.' },
    { question: 'كيف أختار الباقة المناسبة؟', answer: 'الأساسية (٣٠٠) لحضور سريع واقتصادي. المتقدمة (٧٠٠) إذا أردت هوية ودومين مجاني. الاحترافية (١٠٠٠) لعملك الجاد بموقع متكامل. وإيليت (٢٠٠٠) لتخصيص كامل بلا حدود — وإن احترت، استشرنا مجاناً.' },
    { question: 'لمن تعود ملكية الصفحة والدومين؟', answer: 'لك بالكامل ١٠٠٪. الدومين يُسجل باسمك، وكل ملفات الصفحة نسلمها لك متى طلبت. لا نحتجز عملك أبداً.' },
    { question: 'متى أستلم صفحتي؟', answer: 'الأساسية خلال ٥ أيام، المتقدمة ٤ أيام، الاحترافية ٣ أيام، وإيليت المخصصة ٧ أيام (لأنها تُصمم من الصفر). ونرسل لك معاينة أولى في منتصف المدة.' },
    { question: 'هل أستطيع الترقية لباقة أعلى لاحقاً؟', answer: 'نعم، في أي وقت — تدفع فقط فرق السعر بين الباقتين ونطوّر صفحتك الحالية دون أن تبدأ من الصفر.' },
    { question: 'ماذا لو لم تعجبني النتيجة؟', answer: 'لديك ضمان استرداد كامل خلال ١٤ يوماً من التسليم، وتعديلات مجانية حتى الرضا الكامل قبل الإطلاق.' },
    { question: 'هل يمكنني تعديل صفحتي بنفسي مستقبلاً؟', answer: 'في باقة إيليت تحصل على لوحة تحكم عربية سهلة تعدل منها النصوص والصور بنفسك. وفي الباقات الأخرى نوفر لك التعديلات بأسعار رمزية أو نعلمك كيف.' },
  ],
  comparison: [
    { label: 'عدد الصفحات', values: ['١', '١ (٦ أقسام)', 'حتى ٥', 'غير محدود'] },
    { label: 'التصميم', values: ['قالب مخصص', 'مخصص لهويتك', 'احترافي كامل', 'من الصفر ١٠٠٪'] },
    { label: 'دومين مجاني', values: [false, 'سنة', 'سنة + إيميل', 'سنة + ٥ إيميلات'] },
    { label: 'استضافة', values: [false, 'السنة الأولى', 'السنة الأولى', 'مميزة لسنة'] },
    { label: 'تحسين محركات البحث', values: [false, 'أساسي', 'متقدم + AI', 'كامل + فهرسة قوقل'] },
    { label: 'معرض أعمال', values: [false, 'معرض أو آراء', 'معرض كامل + آراء', 'معرض + صفحات تفصيلية'] },
    { label: 'وضع ليلي / نهاري', values: [false, true, true, true] },
    { label: 'زر واتساب + نموذج', values: [true, true, 'مربوط بالطلبات', 'مربوط بالطلبات'] },
    { label: 'لوحة تحكم', values: [false, false, false, true] },
    { label: 'مدونة', values: [false, false, false, true] },
    { label: 'نسخ احتياطي', values: [false, 'يدوي', 'أسبوعي', 'يومي'] },
    { label: 'الدعم', values: ['إيميل', 'واتساب', 'أولوية', 'فوري ٢٤/٧'] },
    { label: 'مدة التسليم', values: ['٥ أيام', '٤ أيام', '٣ أيام', '٧ أيام'] },
  ],
  marquee: [
    { icon: 'User', text: 'صفحات شخصية' },
    { icon: 'Briefcase', text: 'صفحات تعريفية' },
    { icon: 'FolderOpen', text: 'ملفات أعمال' },
    { icon: 'Globe', text: 'دفعة واحدة للأبد' },
    { icon: 'Globe', text: 'دومين مجاني' },
    { icon: 'Search', text: 'سيو متقدم' },
    { icon: 'Shield', text: 'ضمان استرداد' },
    { icon: 'Headphones', text: 'دعم متواصل' },
  ],
}
