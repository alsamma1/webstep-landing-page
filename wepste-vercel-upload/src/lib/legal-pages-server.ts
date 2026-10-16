import { getServerClient, isSupabaseConfigured } from './supabase-server'

export interface LegalSection {
  id: string
  title: string
  content: string
}

export interface LegalPageData {
  title: string
  subtitle: string
  lastUpdated: string
  sections: LegalSection[]
}

export const DEFAULT_TERMS_DATA: LegalPageData = {
  title: 'الشروط والأحكام',
  subtitle: 'يُرجى قراءة هذه الشروط بعناية قبل استخدام خدمات ومنتجات WebStep.',
  lastUpdated: 'أكتوبر ٢٠٢٥',
  sections: [
    {
      id: 'term-1',
      title: 'قبول الشروط',
      content: 'باستخدامك لموقع WebStep أو أي من خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع. تحتفظ WebStep بحق تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.',
    },
    {
      id: 'term-2',
      title: 'الخدمات المقدمة',
      content: 'تقدم WebStep خدمات تطوير المواقع الإلكترونية، تطبيقات الجوال، تصميم UI/UX، المتاجر الإلكترونية، الأنظمة الرقمية، التسويق الرقمي، وصيانة المواقع. جميع الخدمات تُقدَّم وفق الاتفاق المكتوب في عقد الخدمة أو ما يتم تحديده في نموذج الطلب المعتمد.',
    },
    {
      id: 'term-3',
      title: 'الأسعار والدفع',
      content: 'تبدأ أسعار خدماتنا من ١,٠٠٠ ريال سعودي وتختلف حسب نطاق العمل والتعقيد. يُشترط دفع دفعة مقدمة لبدء العمل. الأسعار المذكورة على الموقع استرشادية وقد تتغير حسب متطلبات كل مشروع. الدفع يتم بالريال السعودي عبر التحويل البنكي أو وسائل الدفع الإلكتروني المعتمدة.',
    },
    {
      id: 'term-4',
      title: 'حقوق الملكية الفكرية',
      content: 'عند اكتمال الدفع الكامل، تنتقل ملكية التصميمات والكود البرمجي المُطوَّرة خصيصاً لمشروعك إليك بالكامل. تحتفظ WebStep بحق عرض المشروع في محفظة أعمالها ما لم تطلب غير ذلك كتابياً. الأدوات والمكتبات مفتوحة المصدر المستخدمة تخضع لتراخيصها الأصلية.',
    },
    {
      id: 'term-5',
      title: 'مواعيد التسليم',
      content: 'يُحدَّد موعد التسليم في عقد الخدمة. يلتزم فريق WebStep بالمواعيد المتفق عليها، مع فهم أن التأخيرات من جانب العميل (كتأخر توفير المحتوى أو التغذية الراجعة) قد تؤثر على الموعد النهائي.',
    },
    {
      id: 'term-6',
      title: 'التعديلات والمراجعات',
      content: 'تشمل كل باقة عدداً محدداً من جولات المراجعة (عادةً ٢-٣ جولات). التعديلات الجوهرية خارج نطاق المشروع الأصلي تُحتسب وفق أسعار العمل الإضافي المتفق عليها.',
    },
    {
      id: 'term-7',
      title: 'سرية المعلومات',
      content: 'تلتزم WebStep بالحفاظ على سرية جميع المعلومات التجارية والبيانات التي يشاركها العميل. لن يتم الإفصاح عن أي معلومات سرية لأطراف ثالثة دون موافقة كتابية مسبقة.',
    },
    {
      id: 'term-8',
      title: 'إخلاء المسؤولية',
      content: 'لا تتحمل WebStep المسؤولية عن أي خسائر غير مباشرة أو تبعية ناجمة عن استخدام أو عدم القدرة على استخدام خدماتنا. تقتصر مسؤوليتنا القصوى على قيمة الخدمة المدفوعة.',
    },
    {
      id: 'term-9',
      title: 'الاسترداد والإلغاء',
      content: 'يمكن إلغاء الطلب واسترداد المبلغ الكامل خلال ٧٢ ساعة من تقديم الطلب وقبل بدء العمل. بعد بدء العمل، يُسترد ما يعادل نسبة العمل غير المنجز. لا يمكن استرداد الدفعات المدفوعة بعد تسليم المشروع النهائي والقبول من العميل.',
    },
    {
      id: 'term-10',
      title: 'القانون المطبق والنزاعات',
      content: 'تخضع هذه الشروط وتُفسَّر وفقاً لأنظمة المملكة العربية السعودية. أي نزاع يُرفع إلى المحاكم المختصة في مدينة الرياض، المملكة العربية السعودية.',
    },
  ],
}

export const DEFAULT_PRIVACY_DATA: LegalPageData = {
  title: 'سياسة الخصوصية',
  subtitle: 'نحن نأخذ خصوصيتك بجدية بالغة. تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها في WebStep.',
  lastUpdated: 'أكتوبر ٢٠٢٥',
  sections: [
    {
      id: 'priv-1',
      title: 'البيانات التي نجمعها',
      content: 'نجمع المعلومات التي تقدمها مباشرة كالاسم ورقم الهاتف والبريد الإلكتروني عند تقديم طلب أو التواصل معنا. كما نجمع بيانات الاستخدام التلقائية مثل عنوان IP ونوع المتصفح وصفحات الزيارة وتاريخها عبر ملفات تعريف الارتباط (Cookies) وأدوات التحليل المعتمدة.',
    },
    {
      id: 'priv-2',
      title: 'كيف نستخدم بياناتك',
      content: 'نستخدم بياناتك لتقديم الخدمات المطلوبة والتواصل بشأن طلبك، وإرسال تحديثات مشروعك، وتحسين خدماتنا وموقعنا، والامتثال للمتطلبات القانونية والضريبية. لن نستخدم بياناتك لأغراض أخرى دون موافقتك الصريحة.',
    },
    {
      id: 'priv-3',
      title: 'مشاركة البيانات',
      content: 'لا نبيع أو نؤجر أو نتاجر ببياناتك الشخصية إطلاقاً. قد نشارك بياناتك مع مزودي خدمة موثوقين (كمزودي الاستضافة وبوابات الدفع) الذين يساعدوننا في تشغيل الموقع وتقديم الخدمات، وذلك بموجب اتفاقيات سرية صارمة.',
    },
    {
      id: 'priv-4',
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم Cookies أساسية لتشغيل الموقع، وCookies تحليلية (مثل Google Analytics) لفهم سلوك الزوار وتحسين التجربة. يمكنك التحكم في إعدادات Cookies عبر متصفحك في أي وقت.',
    },
    {
      id: 'priv-5',
      title: 'أمان وحماية البيانات',
      content: 'نطبق إجراءات أمنية صارمة تشمل التشفير SSL/TLS لجميع البيانات المنقولة، والتشفير للبيانات المخزنة الحساسة، وضوابط وصول صارمة، ومراجعات أمنية دورية.',
    },
    {
      id: 'priv-6',
      title: 'حقوقك وصلاحياتك',
      content: 'لك الحق في طلب الوصول إلى بياناتك الشخصية التي نحتفظ بها، وتصحيح أي معلومات غير دقيقة، وطلب حذف بياناتك في الحالات المناسبة، والاعتراض على معالجة بياناتك لأغراض تسويقية.',
    },
    {
      id: 'priv-7',
      title: 'الاحتفاظ بالبيانات',
      content: 'نحتفظ ببيانات العملاء الفعليين لمدة ٥ سنوات بعد انتهاء العلاقة التعاقدية لأغراض قانونية ومحاسبية. بيانات الاستفسارات غير المحولة تُحذف بعد سنة واحدة.',
    },
    {
      id: 'priv-8',
      title: 'روابط الأطراف الثالثة',
      content: 'قد يحتوي موقعنا على روابط لمواقع خارجية. لا نتحكم في محتوى أو سياسات الخصوصية لهذه المواقع ولسنا مسؤولين عنها.',
    },
    {
      id: 'priv-9',
      title: 'التغييرات على هذه السياسة',
      content: 'نحتفظ بحق تحديث هذه السياسة في أي وقت. سنخطرك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع.',
    },
    {
      id: 'priv-10',
      title: 'قنوات التواصل ومسؤول الخصوصية',
      content: 'إذا كانت لديك أسئلة أو استفسارات بشأن خصوصيتك، يُرجى التواصل معنا عبر: البريد الإلكتروني: privacy@wepstep.sa — واتساب: +966 500 000 000 — المقر: الرياض، المملكة العربية السعودية.',
    },
  ],
}

export async function getLegalPageContent(type: 'terms' | 'privacy'): Promise<LegalPageData> {
  const defaultData = type === 'terms' ? DEFAULT_TERMS_DATA : DEFAULT_PRIVACY_DATA
  const key = `page_${type}`

  if (!isSupabaseConfigured()) {
    return defaultData
  }

  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultData
    }

    const val = data.value as Partial<LegalPageData>
    return {
      title: val.title || defaultData.title,
      subtitle: val.subtitle || defaultData.subtitle,
      lastUpdated: val.lastUpdated || defaultData.lastUpdated,
      sections: Array.isArray(val.sections) && val.sections.length > 0 ? val.sections : defaultData.sections,
    }
  } catch (err) {
    console.error(`getLegalPageContent (${type}) error:`, err)
    return defaultData
  }
}

export async function saveLegalPageContent(type: 'terms' | 'privacy', data: LegalPageData): Promise<LegalPageData> {
  const key = `page_${type}`

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase client is not configured.')
  }

  const supabase = getServerClient()
  const payload = {
    title: data.title?.trim() || (type === 'terms' ? 'الشروط والأحكام' : 'سياسة الخصوصية'),
    subtitle: data.subtitle?.trim() || '',
    lastUpdated: data.lastUpdated?.trim() || new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }),
    sections: Array.isArray(data.sections) ? data.sections : [],
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key,
        value: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

  if (error) {
    console.error(`saveLegalPageContent (${type}) error:`, error)
    throw new Error(error.message)
  }

  return payload
}
