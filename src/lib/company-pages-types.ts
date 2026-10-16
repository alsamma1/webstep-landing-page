// Shared types and defaults for Company & Contact Pages
// Can be safely imported in both Client ('use client') and Server components

// ─── 1. About Page Content Types & Defaults ─────────────────────────────────
export interface AboutPageData {
  hero: {
    badge: string
    title: string
    highlight: string
    subtitle: string
  }
  vision: {
    title: string
    desc: string
  }
  mission: {
    title: string
    desc: string
  }
  stats: Array<{
    val: string
    label: string
    sub?: string
  }>
  values: Array<{
    title: string
    desc: string
    color: string
  }>
  milestones: Array<{
    year: string
    title: string
    desc: string
  }>
}

export const DEFAULT_ABOUT_PAGE: AboutPageData = {
  hero: {
    badge: 'قصتنا وهويتنا',
    title: 'نبني تجارب رقمية',
    highlight: 'تصنع فارقاً حقيقياً',
    subtitle: 'WebStep هي وكالة رقمية سعودية متخصصة في تطوير الويب، التطبيقات، والحلول الرقمية المتقدمة التي تساعد الشركات ورواد الأعمال على النمو والريادة.',
  },
  vision: {
    title: 'رؤيتنا',
    desc: 'أن نكون الشريك الرقمي الأول والأكثر موثوقية للشركات الطموحة في المملكة والخليج، محولين الأفكار التقنية إلى واقع ملموس يحقق أعلى عوائد استثمارية.',
  },
  mission: {
    title: 'رسالتنا',
    desc: 'تمكين عملائنا من التفوق التنافسي من خلال تقديم برمجيات عالية الجودة، وتصاميم واجهات ذكية، واستراتيجيات نمو مبنية على البيانات وأحدث تقنيات العصر.',
  },
  stats: [
    { val: '١٢٠+', label: 'مشروع ناجح' },
    { val: '٩٨٪', label: 'رضا العملاء' },
    { val: '٥+ سنوات', label: 'خبرة تراكمية' },
    { val: '٢٠+', label: 'خبير ومطور' },
  ],
  values: [
    { title: 'الجودة فوق كل شيء', desc: 'لا نسلّم مشروعاً إلا بعد اختباره على ٣٠+ معيار جودة وأداء.', color: '#1F8A54' },
    { title: 'شفافية كاملة', desc: 'لا رسوم مخفية، لا مفاجآت. كل شيء موثق ومتفق عليه مسبقاً.', color: '#6366f1' },
    { title: 'سرعة التسليم', desc: 'نلتزم بالمواعيد دائماً — أو نعوّض بخصم فعلي.', color: '#f59e0b' },
    { title: 'شراكة حقيقية', desc: 'نعامل كل عميل كشريك، لا كصفقة. نجاحك هو نجاحنا.', color: '#ec4899' },
  ],
  milestones: [
    { year: '٢٠٢١', title: 'انطلاقة الفكرة', desc: 'تأسيس WebStep بفريق عمل صغير شغوف بصناعة البرمجيات المتقنة.' },
    { year: '٢٠٢٢', title: 'التوسع الأول', desc: 'إنجاز أكثر من ٤٠ مشروعاً والدخول بقوة في سوق المتاجر وتطبيقات الجوال.' },
    { year: '٢٠٢٣', title: 'بناء منظومة متكاملة', desc: 'إضافة خدمات الهوية الرقمية، وأنظمة ERP المخصصة لقطاع الأعمال.' },
    { year: '٢٠٢٤ – اليوم', title: 'الريادة والذكاء الاصطناعي', desc: 'دمج حلول الذكاء الاصطناعي الحديثة وتقديم تجارب رقمية شاملة بأعلى المعايير.' },
  ],
}

// ─── 2. Contact Page Content Types & Defaults ───────────────────────────────
export interface ContactPageData {
  hero: {
    badge: string
    title: string
    highlight: string
    subtitle: string
  }
  channels: {
    whatsapp: string
    email: string
    phone: string
    address: string
    workingHoursWeekday: string
    workingHoursWeekend: string
    responseTimeText: string
  }
  yemenChannels?: {
    whatsapp: string
    email: string
    phone: string
    address: string
    workingHoursWeekday: string
    workingHoursWeekend: string
    responseTimeText: string
  }
  faqs: Array<{
    q: string
    a: string
  }>
}

export const DEFAULT_CONTACT_PAGE: ContactPageData = {
  hero: {
    badge: 'نحن هنا لمساعدتك',
    title: 'تواصل مع',
    highlight: 'فريق WebStep',
    subtitle: 'لديك سؤال، فكرة مشروع، أو تريد استشارة تقنية مجانية؟ نحن نرد عادة خلال ساعتين.',
  },
  channels: {
    whatsapp: '966593672193',
    email: 'hello@wepstep.com',
    phone: '+966 59 367 2193',
    address: 'الرياض، المملكة العربية السعودية',
    workingHoursWeekday: 'الأحد – الخميس: ٩ص – ٨م',
    workingHoursWeekend: 'الجمعة: ٢م – ٦م',
    responseTimeText: 'متوسط زمن الاستجابة: ١.٨ ساعة (٩٧٪ من الطلبات تُجاب خلال ساعتين)',
  },
  yemenChannels: {
    whatsapp: '967771111357',
    email: 'alsmh655@gmail.com',
    phone: '+967 771 111 357',
    address: 'صنعاء، الجمهورية اليمنية',
    workingHoursWeekday: 'السبت – الخميس: ٩ص – ٩م',
    workingHoursWeekend: 'الجمعة: مغلق',
    responseTimeText: 'الرد المباشر لعملاء اليمن عبر واتساب والاتصال خلال دقائق',
  },
  faqs: [
    { q: 'ما هو زمن الاستجابة عند التواصل؟', a: 'نضمن الرد خلال ساعتين خلال أوقات العمل الرسمية، وفي حالات الدعم الطارئ خلال ٣٠ دقيقة.' },
    { q: 'هل تقدمون استشارة مجانية قبل البدء؟', a: 'نعم، نوفر جلسة استشارة تقنية وتخطيطية مجانية لمدة ٣٠ دقيقة لكل مشروع جديد.' },
    { q: 'هل يمكن التواصل خارج أوقات العمل الرسمية؟', a: 'يمكنك إرسال رسالتك عبر واتساب في أي وقت، وسيتم الرد فور بدء أوقات العمل التالية. لعملاء باقة Enterprise يتوفر دعم على مدار الساعة.' },
    { q: 'ما هي المدة المتوقعة لتنفيذ المشروع؟', a: 'صفحات الهبوط والمواقع الأساسية تستغرق بين ٥ إلى ١٤ يوماً، وتطبيقات الجوال والمتاجر المعقدة بين ٣٠ إلى ٩٠ يوماً.' },
  ],
}

// ─── 3. Order Page Content Types & Defaults ─────────────────────────────────
export interface OrderPageData {
  hero: {
    badge: string
    title: string
    subtitle: string
  }
  whatsappNumber: string
  discountNotice: string
  budgetTiers: Record<string, string[]>
  yemenWhatsappNumber?: string
  yemenDiscountNotice?: string
  yemenBudgetTiers?: Record<string, string[]>
}

export const DEFAULT_ORDER_PAGE: OrderPageData = {
  hero: {
    badge: 'ابدأ مشروعك الرقمي',
    title: 'طلب مشروع جديد مع WebStep',
    subtitle: 'أكمل الخطوات التالية وسنقوم بدراسة متطلباتك وتقديم عرض فني وسعري مخصص بدقة.',
  },
  whatsappNumber: '966593672193',
  discountNotice: 'احصل على استشارة تقنية مجانية + خصم خاص ١٠٪ على مشاريع التطوير الشاملة هذا الشهر.',
  budgetTiers: {
    web: ['أقل من ١,٠٠٠ ر.س', '١,٠٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠ – ٦,٠٠٠ ر.س', '٦,٠٠٠+ ر.س'],
    apps: ['٥,٠٠٠ – ١٠,٠٠٠ ر.س', '١٠,٠٠٠ – ٢٠,٠٠٠ ر.س', '٢٠,٠٠٠ – ٤٠,٠٠٠ ر.س', '٤٠,٠٠٠+ ر.س'],
    design: ['٨٠٠ – ١,٥٠٠ ر.س', '١,٥٠٠ – ٣,٠٠٠ ر.س', '٣,٠٠٠+ ر.س'],
    landing: ['٦٠٠ – ١,٢٠٠ ر.س', '١,٢٠٠ – ٢,٠٠٠ ر.س', '٢,٠٠٠+ ر.س'],
    ecommerce: ['٢,٥٠٠ – ٥,٠٠٠ ر.س', '٥,٠٠٠ – ١٠,٠٠٠ ر.س', '١٠,٠٠٠+ ر.س'],
    systems: ['٨,٠٠٠ – ١٥,٠٠٠ ر.س', '١٥,٠٠٠ – ٣٠,٠٠٠ ر.س', '٣٠,٠٠٠+ ر.س'],
  },
  yemenWhatsappNumber: '967771111357',
  yemenDiscountNotice: 'استشارة فنية مجانية لعملاء اليمن + باقات تنافسية بالريال اليمني وخطط سداد مرنة.',
  yemenBudgetTiers: {
    web: ['أقل من ١٥٠,٠٠٠ ر.ي', '١٥٠,٠٠٠ – ٤٥٠,٠٠٠ ر.ي', '٤٥٠,٠٠٠ – ٩٠٠,٠٠٠ ر.ي', '٩٠٠,٠٠٠+ ر.ي'],
    apps: ['٧٥٠,٠٠٠ – ١,٥٠٠,٠٠٠ ر.ي', '١,٥٠٠,٠٠٠ – ٣,٠٠٠,٠٠٠ ر.ي', '٣,٠٠٠,٠٠٠ – ٦,٠٠٠,٠٠٠ ر.ي', '٦,٠٠٠,٠٠٠+ ر.ي'],
    design: ['١٠٠,٠٠٠ – ٢٥٠,٠٠٠ ر.ي', '٢٥٠,٠٠٠ – ٥٠٠,٠٠٠ ر.ي', '٥٠٠,٠٠٠+ ر.ي'],
    landing: ['١٠٠,٠٠٠ – ٢٠٠,٠٠٠ ر.ي', '٢٠٠,٠٠٠ – ٤٠٠,٠٠٠ ر.ي', '٤٠٠,٠٠٠+ ر.ي'],
    ecommerce: ['٤٥٠,٠٠٠ – ٩٠٠,٠٠٠ ر.ي', '٩٠٠,٠٠٠ – ١,٨٠٠,٠٠٠ ر.ي', '١,٨٠٠,٠٠٠+ ر.ي'],
    systems: ['١,٥٠٠,٠٠٠ – ٣,٠٠٠,٠٠٠ ر.ي', '٣,٠٠٠,٠٠٠ – ٦,٠٠٠,٠٠٠ ر.ي', '٦,٠٠٠,٠٠٠+ ر.ي'],
  },
}

// ─── 4. Careers Page Content Types & Defaults ───────────────────────────────
export interface CareersPageData {
  hero: {
    badge: string
    title: string
    highlight: string
    subtitle: string
  }
  perks: Array<{
    title: string
    desc: string
    color: string
  }>
  steps: Array<{
    num: string
    title: string
    desc: string
  }>
}

export const DEFAULT_CAREERS_PAGE: CareersPageData = {
  hero: {
    badge: 'انضم إلى فريق النخبة',
    title: 'اصنع مستقبلك المهني مع',
    highlight: 'عائلة WebStep',
    subtitle: 'نبحث دائماً عن المبدعين والشغوفين بالتقنية والتصميم للانضمام إلى رحلتنا في بناء وتطوير المنتجات الرقمية الحديثة.',
  },
  perks: [
    { title: 'رواتب مجزية وحوافز', desc: 'رواتب تنافسية ترتبط بالأداء المتميز ومكافآت على إنجاز المشاريع.', color: '#1F8A54' },
    { title: 'مرونة بيئة العمل', desc: 'إمكانية العمل الهجين أو عن بُعد بمرونة تدعم التوازن بين العمل والحياة.', color: '#6366f1' },
    { title: 'تطوير وتدريب مستمر', desc: 'ميزانية سنوية مخصصة للدورات والمؤتمرات واشتراكات في أحدث الأدوات التقنية.', color: '#f59e0b' },
    { title: 'مشاريع نوعية وتقنيات حديثة', desc: 'فرصة العمل على تقنيات الذكاء الاصطناعي، Next.js، والتطبيقات الواسعة الانتشار.', color: '#ec4899' },
  ],
  steps: [
    { num: '٠١', title: 'التقديم', desc: 'أرسل بياناتك وبورتفوليو أعمالك عبر النموذج السريع.' },
    { num: '٠٢', title: 'مراجعة الطلب', desc: 'يقوم الفريق بمراجعة أعمالك خلال ٣ إلى ٥ أيام عمل.' },
    { num: '٠٣', title: 'المقابلة الفنية', desc: 'جلسة حوارية ممتعة للتعرف على مهاراتك وثقافة العمل.' },
    { num: '٠٤', title: 'عرض الانضمام', desc: 'نرحب بك عضواً أساسياً في فريق WebStep!' },
  ],
}
