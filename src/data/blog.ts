// ============================================================
// WebStep — Blog Data & Single Source of Truth
// أي مقال يضاف هنا يظهر تلقائياً في المدونة، الفهرسة، السايت ماب، ومحركات البحث
// ============================================================

export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export interface BlogSection {
  title: string
  content: string[]
  quote?: string
  bulletPoints?: string[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categoryKey: 'web' | 'ai-seo' | 'uiux' | 'business' | 'portfolio'
  author: BlogAuthor
  date: string
  dateDisplay: string
  readTime: string
  views: string
  likes: number
  coverGradient: string
  accentColor: string
  featured?: boolean
  hasVideo?: boolean
  videoUrl?: string
  videoDuration?: string
  audioTime?: string
  tags: string[]
  seoKeywords: string[]
  metaDescription: string
  sections: BlogSection[]
  faqs?: { q: string; a: string }[]
  cover_image?: string
  gallery?: string[]
  content_blocks?: import('@/lib/supabase.types').ContentBlock[]
  content?: string
  author_role?: string
  author_avatar?: string
}

export const BLOG_CATEGORIES = [
  { key: 'all', label: 'جميع المقالات' },
  { key: 'web', label: 'تطوير المواقع والأنظمة' },
  { key: 'ai-seo', label: 'السيو والذكاء الاصطناعي' },
  { key: 'uiux', label: 'تصميم واجهات UI/UX' },
  { key: 'business', label: 'استراتيجيات ونمو الأعمال' },
  { key: 'portfolio', label: 'ملفات الأعمال والصفحات الشخصية' },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'own-personal-website-one-time-payment',
    title: 'دليلك الشامل لامتلاك صفحة شخصية بدفعة واحدة وبدون أي اشتراكات شهرية للأبد',
    excerpt: 'لماذا يستمر الكثيرون في دفع مئات الريالات شهرياً لمنصات الاستضافة بينما يمكنك امتلاك صفحتك الشخصية أو التعريفية ملكية دائمة بدفعة واحدة؟ دليلك لفهم النموذج الجديد.',
    category: 'ملفات الأعمال والصفحات الشخصية',
    categoryKey: 'portfolio',
    author: {
      name: 'فريق ويب ستيب الرقمي',
      role: 'خبراء الحلول الرقمية',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-20',
    dateDisplay: '٢٠ مارس ٢٠٢٦',
    readTime: '٥ دقائق',
    views: '+٢,٤٠٠',
    likes: 184,
    coverGradient: 'linear-gradient(135deg, #0d3822 0%, #175234 50%, #082114 100%)',
    accentColor: '#1F8A54',
    featured: true,
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '٠٤:٣٠ دقيقة',
    audioTime: '٣ دقائق صوتي',
    tags: ['صفحة شخصية', 'دفع مرة واحدة', 'هوية رقمية', 'Next.js', 'دومين مجاني'],
    seoKeywords: ['موقع شخصي', 'صفحة تعريفية', 'دفع لمرة واحدة', 'موقع بدون اشتراك شهري', 'ويب ستيب', 'بورتفوليو رقمي'],
    metaDescription: 'اكتشف كيف تمتلك صفحة شخصية أو موقعاً تعريفياً لعملك بدفعة واحدة للأبد بدون اشتراكات شهرية، مع دومين وهوية احترافية سريعة.',
    sections: [
      {
        title: 'فخ الاشتراكات الشهرية وتراكم التكاليف',
        content: [
          'في السنوات الأخيرة، اعتادت معظم منصات بناء المواقع على إلزام المستخدمين باشتراكات دورية (تتراوح بين ٥٠ إلى ٢٥٠ ريالاً شهرياً). مع مرور الوقت، يجد المستقل أو صاحب العمل نفسه قد دفع آلاف الريالات لمجرد إبقاء بطاقته التعريفية نشطة.',
          'النموذج الذي نتبناه في ويب ستيب مختلف كلياً: صفحتك مبنية بأحدث كود تقني حديث (Next.js / React)، وتُستضاف على شبكات سحابية فائقة السرعة مع دومين خاص باسمك، وتدفع تكلفة التصميم والإطلاق مرة واحدة فقط.'
        ],
        quote: 'امتلاك أصولك الرقمية للأبد يمنحك استقراراً مهنياً ويجعل علامتك التجارية مستقلة عن تقلبات الاشتراكات وأسعار المنصات.',
      },
      {
        title: 'ما الذي يجب أن تحتويه صفحتك الشخصية الناجحة؟',
        content: [
          'الصفحة الشخصية ليست مجرد سيرة ذاتية إلكترونية مملة، بل هي واجهة مبيعات تسوّق لخبرتك وثقتك لدى الشركات والعملاء:',
        ],
        bulletPoints: [
          'هيدر بصري خاطف للعين يبرز تخصصك وقيمتك المضافة في ثانية واحدة.',
          'استعراض مبسط لأهم المحطات والإنجازات مع شهادات موثقة من شركاء العمل.',
          'روابط فورية للتواصل المباشر وحجز الاستشارات عبر واتساب بضغطة زر.',
          'تصميم فائق السرعة ومتجاوب بنسبة ١٠٠٪ على شاشات الهواتف الذكية.',
        ]
      },
      {
        title: 'خطوات استلام موقعك خلال أيام معدودة',
        content: [
          'تبدأ الرحلة بتحديد باقتك المناسبة وتزويدنا بنبذة عن أهدافك، لنتولى نحن التصميم والبرمجة وربط النطاق بالكامل، مع تقديم معاينة أولية وضمان استرداد كامل لمدة ١٤ يوماً.'
        ]
      }
    ],
    faqs: [
      {
        q: 'هل سأدفع أي رسوم شهرية بعد استلام الموقع؟',
        a: 'لا، بتاتاً. الموقع ملكك للأبد بدون أي رسوم شهرية إجبارية. بعد السنة الأولى يتوفر فقط تجديد اختياري للدومين والاستضافة بسعر رمزي، أو يمكنك نقل الملفات لأي مزود تريده.'
      },
      {
        q: 'هل الموقع متوافق مع محركات البحث وسيو قوقل؟',
        a: 'نعم، نبني جميع صفحاتنا وفق أحدث معايير Core Web Vitals ومخططات Schema.org لضمان سرعة فائقة وتصدر نتائج البحث.'
      }
    ]
  },
  {
    id: 'post-2',
    slug: 'seo-and-ai-search-optimization-2026',
    title: 'كيف تهيئ موقعك لمحركات البحث في عصر الذكاء الاصطناعي (AI Search & Generative Engine Optimization)',
    excerpt: 'محركات البحث لم تعد تكتفي بالكلمات المفتاحية التقليدية. كيف تضمن أن يوصي ChatGPT، Perplexity، و Google AI Overviews بشركتك وخدماتك للباحثين؟',
    category: 'السيو والذكاء الاصطناعي',
    categoryKey: 'ai-seo',
    author: {
      name: 'م. أحمد السلمي',
      role: 'مستشار السيو وهندسة البيانات',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-18',
    dateDisplay: '١٨ مارس ٢٠٢٦',
    readTime: '٦ دقائق',
    views: '+١,٩٢٠',
    likes: 142,
    coverGradient: 'linear-gradient(135deg, #083344 0%, #155e75 50%, #0e7490 100%)',
    accentColor: '#06b6d4',
    featured: false,
    hasVideo: false,
    audioTime: '٤ دقائق صوتي',
    tags: ['GEO', 'ذكاء اصطناعي', 'سيو 2026', 'Google AI', 'Schema Markup'],
    seoKeywords: ['سيو الذكاء الاصطناعي', 'GEO', 'ChatGPT Search', 'ظهور في بحث قوقل', 'تهيئة محركات البحث'],
    metaDescription: 'تعرف على استراتيجيات تحسين محركات البحث في عصر الذكاء الاصطناعي وكيف تجعل نماذج AI توصي بموقعك وخدماتك كمرجع أول.',
    sections: [
      {
        title: 'التحول من SEO التقليدي إلى GEO (Generative Engine Optimization)',
        content: [
          'عندما يبحث شخص اليوم عن "أفضل استشاري تسويق في الرياض" أو "شركة تصميم مواقع احترافية"، فإن محركات الذكاء الاصطناعي تقرأ وتلخص المحتوى بدلاً من مجرد عرض روابط زرقاء.',
          'الذكاء الاصطناعي يعتمد على بيانات منظمة (Structured Data)، واقتباسات صريحة، وتراكيب لغوية واضحة تدعم الحقائق والأرقام.'
        ],
        quote: 'المواقع التي لا تعتمد كوداً دلالياً (Semantic HTML) وبيانات JSON-LD ستصبح غير مرئية لنماذج الذكاء الاصطناعي خلال السنوات القادمة.',
      },
      {
        title: 'المعايير الـ ٤ لتصدر نتائج الذكاء الاصطناعي',
        content: [
          'لتجعل صفحتك مصدراً موثوقاً تستشهد به أنظمة البحث الذكية، ركّز على النقاط التالية:',
        ],
        bulletPoints: [
          'استخدام وسوم Schema.org الدقيقة (مثل Organization, Person, Service, BlogPosting).',
          'الإجابة المباشرة عن أسئلة الجمهور دون حشو نصي غير مفيد.',
          'سرعة تحميل فائقة على مقياس قوقل LCP تقل عن 1.5 ثانية.',
          'بناء هيبة رقمية ووجود علامات واضحة لاسمك وهويتك وعنوانك الفعلي.'
        ]
      }
    ]
  },
  {
    id: 'post-3',
    slug: 'ui-ux-design-principles-high-conversion',
    title: 'أسرار تصميم واجهات المستخدم (UI/UX) التي تضاعف معدل التحويل والمبيعات',
    excerpt: 'الجمال وحده لا يكفي. كيف تبني واجهة مستخدم لا تبهر الزائر فقط، بل تقوده بسلاسة ليصبح عميلاً مقتنعاً ويدفع دون تردد؟',
    category: 'تصميم واجهات UI/UX',
    categoryKey: 'uiux',
    author: {
      name: 'سارة المهيدب',
      role: 'رئيسة تصميم التجارب الرقمية',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-15',
    dateDisplay: '١٥ مارس ٢٠٢٦',
    readTime: '٤ دقائق',
    views: '+٣,١٠٠',
    likes: 215,
    coverGradient: 'linear-gradient(135deg, #4c0519 0%, #831843 50%, #9d174d 100%)',
    accentColor: '#ec4899',
    featured: false,
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '٠٦:١٥ دقيقة',
    audioTime: '٣ دقائق صوتي',
    tags: ['UI/UX', 'تصميم واجهات', 'تحويل المبيعات', 'تجربة المستخدم', 'تصميم عصري'],
    seoKeywords: ['تصميم واجهات UI UX', 'معدل التحويل CRO', 'تصميم مواقع السعودية', 'واجهات مستخدم احترافية'],
    metaDescription: 'اكتشف أهم مبادئ تصميم واجهات UI/UX الحديثة التي ترفع معدل التحويل وتحول زوار موقعك إلى عملاء فعليين.',
    sections: [
      {
        title: 'قاعدة الـ ٣ ثوانٍ وتوجيه انتباه الزائر',
        content: [
          'يمتلك الزائر في العصر الرقمي مدى انتباه لا يتجاوز بضع ثوانٍ. إذا لم يفهم ماذا تقدم خلال هذه اللحظة، سيغادر ولن يعود أبداً.',
          'الواجهات المزدحمة بالألوان الصارخة والخيارات المتعددة تصيب العميل بما يعرف بـ "شلل اتخاذ القرار" (Analysis Paralysis).'
        ],
        quote: 'التصميم العظيم ليس عندما لا يتبقى شيء لتضيفه، بل عندما لا يتبقى شيء لتزيله دون أن تفقد الوظيفة.',
      },
      {
        title: 'كيف تصمم زر الدعوة لاتخاذ إجراء (Call To Action) لا يُقاوم؟',
        content: [
          'يجب أن يكون زر الإجراء واضحاً بصرياً ومحدداً لغوياً، مثل "احجز استشارتك المجانية في دقيقة" بدلاً من كلمة "إرسال" الغامضة.'
        ],
        bulletPoints: [
          'استخدام تباين ألوان مدروس بين الخلفية وعناصر النقر.',
          'تقليل الحقول في النماذج إلى ٣ حقول أساسية فقط.',
          'توفير خيار التواصل عبر واتساب كمسار بديل وسريع.'
        ]
      }
    ]
  },
  {
    id: 'post-4',
    slug: 'landing-page-vs-ecommerce-store',
    title: 'الصفحة التعريفية أم المتجر الإلكتروني الكامل؟ كيف تختار الحل الأمثل لمشروعك؟',
    excerpt: 'قبل أن تدفع آلاف الريالات في متجر إلكتروني معقد قد لا تحتاجه: متى تكفيك صفحة هبوط ذات تركيز عالٍ ومتى تحتاج لمتجر متعدد الأقسام؟',
    category: 'استراتيجيات ونمو الأعمال',
    categoryKey: 'business',
    author: {
      name: 'عبدالرحمن الشهري',
      role: 'مستشار تطوير المشاريع',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-12',
    dateDisplay: '١٢ مارس ٢٠٢٦',
    readTime: '٥ دقائق',
    views: '+١,٥٥٠',
    likes: 98,
    coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
    accentColor: '#6366f1',
    featured: false,
    hasVideo: false,
    audioTime: '٣ دقائق صوتي',
    tags: ['صفحات الهبوط', 'المتاجر الإلكترونية', 'إطلاق المشاريع', 'تحويلات واتساب'],
    seoKeywords: ['صفحة هبوط مقابل متجر', 'بدء متجر الكتروني', 'صفحة بيع واحدة', 'تكلفة إنشاء متجر'],
    metaDescription: 'مقارنة عملية بين صفحة الهبوط والمتجر الإلكتروني المتكامل لمساعدتك في اختيار النموذج الأعلى عائداً لمشروعك بأقل تكلفة.',
    sections: [
      {
        title: 'متى تكون صفحة الهبوط خياراً متفوقاً؟',
        content: [
          'إذا كنت تبيع منتجاً واحداً بطلاً (Hero Product)، أو خدمة استشارية، أو دورة تدريبية، فإن صفحة الهبوط الواحدة تحقق معدل تحويل أعلى بكثير من المتجر المشتت للأقسام.',
          'توجّه صفحة الهبوط ذهن العميل نحو هدف واحد فقط: الشراء أو التواصل، وتمنع تشتته بين المنتجات الأخرى.'
        ]
      },
      {
        title: 'متى تحتاج لمتجر إلكتروني كامل؟',
        content: [
          'يصبح المتجر الإلكتروني ضرورياً إذا كان لديك كتالوج واسع من المنتجات مع متطلبات معقدة لإدارة المخزون، وشركات الشحن المتعددة، وتتبع الطلبات الآلي.'
        ]
      }
    ]
  },
  {
    id: 'post-5',
    slug: 'why-startups-choose-nextjs-and-react',
    title: 'لماذا تتجه أفضل المواقع العالمية والشركات الناشئة نحو Next.js بدلاً من قوالب الووردبريس؟',
    excerpt: 'السرعة، الأمان، والتخصيص غير المحدود: نظرة تقنية على الأسباب التي تجعل منصات الويب الحديثة تتفوق بنسبة 300% في مقاييس الأداء وتجربة المستخدم.',
    category: 'تطوير المواقع والأنظمة',
    categoryKey: 'web',
    author: {
      name: 'فريق ويب ستيب الهندسي',
      role: 'بنية الأنظمة وتطوير الواجهات',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-08',
    dateDisplay: '٨ مارس ٢٠٢٦',
    readTime: '٧ دقائق',
    views: '+٢,٧٠٠',
    likes: 195,
    coverGradient: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)',
    accentColor: '#f59e0b',
    featured: false,
    hasVideo: false,
    audioTime: '٥ دقائق صوتي',
    tags: ['Next.js', 'React', 'أداء المواقع', 'أمان الويب', 'تطوير حديث'],
    seoKeywords: ['Next.js عربي', 'مميزات Next.js', 'برمجة مواقع حديثة', 'سرعة الموقع وسيو'],
    metaDescription: 'اكتشف لماذا تختار الشركات الرائدة تقنية Next.js و React لبناء مواقعها الرقمية وما الفارق الحقيقي في الأداء والأمان مقابل القوالب الجاهزة.',
    sections: [
      {
        title: 'ثورة الـ Server-Side Rendering وأثرها على السيو',
        content: [
          'تقدم تقنية Next.js ميزة العرض من جهة الخادم، مما يعني أن روبوتات قوقل ومحركات البحث تتلقى كود HTML جاهزاً وفورياً، في حين يتمتع الزائر بتنقل سلس بدون إعادة تحميل الصفحة.'
        ],
        quote: 'كل ثانية تأخير في تحميل صفحتك تكلّفك خسارة ما لا يقل عن 7% من مبيعاتك وتحويلاتك الرقمية.',
      },
      {
        title: 'الأمان وحماية بيانات العملاء',
        content: [
          'على عكس المنصات التي تعتمد على عشرات الإضافات (Plugins) المعرضة للثغرات، يتم تجميع وتأمين كود Next.js كملفات ثابتة ومشفرة يستحيل اختراقها بالطرق التقليدية.'
        ]
      }
    ]
  },
  {
    id: 'post-6',
    slug: 'how-to-create-winning-portfolio',
    title: 'كيف تبني ملف أعمال (بورتفوليو) يجلب لك كبرى العقود والعملاء في السعودية والخليج؟',
    excerpt: 'سواء كنت مهندساً معمارياً، مصمماً، كاتباً، أو مطوراً: كيف تعرض مشاريعك بأسلوب احترافي يرفع قيمتك في السوق ويثبت أهليتك لأفضل المشاريع؟',
    category: 'ملفات الأعمال والصفحات الشخصية',
    categoryKey: 'portfolio',
    author: {
      name: 'فهد الدوسري',
      role: 'مستشار الهويات المهنية',
      avatar: '/assets/logo/logo.png',
    },
    date: '2026-03-05',
    dateDisplay: '٥ مارس ٢٠٢٦',
    readTime: '٤ دقائق',
    views: '+١,٦٤٠',
    likes: 128,
    coverGradient: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #5b21b6 100%)',
    accentColor: '#8b5cf6',
    featured: false,
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '٠٥:٠٠ دقيقة',
    audioTime: '٣ دقائق صوتي',
    tags: ['بورتفوليو', 'ملف أعمال', 'استقطاب عملاء', 'مستقلين', 'سيرة ذاتية'],
    seoKeywords: ['بورتفوليو احترافي', 'ملف اعمال مهندس', 'تصميم معرض اعمال', 'جلب عملاء للمستقلين'],
    metaDescription: 'خطوات استراتيجية لبناء بورتفوليو رقمي متطور يعرض خبراتك ومشاريعك السابقة بطريقة تضاعف ثقة العملاء بك وترفع أسعار خدماتك.',
    sections: [
      {
        title: 'عرض النتيجة والأثر قبل عرض الصور',
        content: [
          'العميل لا يشتري مجرد صور جميلة، بل يبحث عن حل لمشكلته. عند استعراض كل مشروع في ملفك، اذكر التحدي الذي واجهه عميلك، وكيف ساعده عملك في تحقيق نتائج قياسية.'
        ]
      },
      {
        title: 'الجودة تفوق الكمية دائماً',
        content: [
          'ثلاثة مشاريع مشروحة بعناية وعالية الجودة أفضل بكثير من عرض عشرين عملاً سريعاً وغير مكتمل. اختر أفضل أعمالك واجعلها الواجهة الرئيسية لعلامتك الشخصية.'
        ]
      }
    ]
  }
]

// Helpers
export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS
}

export function getFeaturedBlogPost(): BlogPost {
  return BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0]
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getRelatedBlogPosts(currentSlug: string, categoryKey: string, limit = 3): BlogPost[] {
  return BLOG_POSTS
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => (a.categoryKey === categoryKey ? -1 : 1))
    .slice(0, limit)
}
