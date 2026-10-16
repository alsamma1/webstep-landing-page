/**
 * seed-blog.mjs
 * يرفع المقالات الموجودة في src/data/blog.ts إلى Supabase
 * تشغيل: node scripts/seed-blog.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Load .env.local
const envPath = join(ROOT, '.env.local')
const env = {}
try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  }
} catch {
  console.error('❌ لم يتم العثور على .env.local')
  process.exit(1)
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ مفاتيح Supabase غير موجودة في .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BLOG_POSTS = [
  {
    title: 'دليلك الشامل لامتلاك صفحة شخصية بدفعة واحدة وبدون أي اشتراكات شهرية للأبد',
    slug: 'own-personal-website-one-time-payment',
    excerpt: 'لماذا يستمر الكثيرون في دفع مئات الريالات شهرياً لمنصات الاستضافة بينما يمكنك امتلاك صفحتك الشخصية أو التعريفية ملكية دائمة بدفعة واحدة؟ دليلك لفهم النموذج الجديد.',
    content: `## فخ الاشتراكات الشهرية وتراكم التكاليف\n\nفي السنوات الأخيرة، اعتادت معظم منصات بناء المواقع على إلزام المستخدمين باشتراكات دورية. النموذج الذي نتبناه في ويب ستيب مختلف كلياً: صفحتك مبنية بأحدث كود تقني حديث (Next.js / React).\n\n> امتلاك أصولك الرقمية للأبد يمنحك استقراراً مهنياً.\n\n## ما الذي يجب أن تحتويه صفحتك الشخصية الناجحة؟\n\n- هيدر بصري خاطف للعين يبرز تخصصك\n- استعراض مبسط لأهم المحطات والإنجازات\n- روابط فورية للتواصل المباشر\n- تصميم فائق السرعة ومتجاوب`,
    category: 'ملفات الأعمال والصفحات الشخصية',
    tags: ['صفحة شخصية', 'دفع مرة واحدة', 'هوية رقمية', 'Next.js', 'دومين مجاني'],
    author: 'فريق ويب ستيب الرقمي',
    read_time: 5,
    published: true,
    views: 2400,
    seo_title: 'دليلك لامتلاك صفحة شخصية بدفعة واحدة بدون اشتراكات — ويب ستيب',
    seo_description: 'اكتشف كيف تمتلك صفحة شخصية أو موقعاً تعريفياً لعملك بدفعة واحدة للأبد بدون اشتراكات شهرية.',
    seo_keywords: ['موقع شخصي', 'صفحة تعريفية', 'دفع لمرة واحدة', 'موقع بدون اشتراك شهري', 'ويب ستيب'],
    schema_type: 'BlogPosting',
  },
  {
    title: 'كيف تهيئ موقعك لمحركات البحث في عصر الذكاء الاصطناعي',
    slug: 'seo-and-ai-search-optimization-2026',
    excerpt: 'محركات البحث لم تعد تكتفي بالكلمات المفتاحية التقليدية. كيف تضمن أن يوصي ChatGPT، Perplexity، و Google AI Overviews بشركتك وخدماتك للباحثين؟',
    content: `## التحول من SEO التقليدي إلى GEO\n\nعندما يبحث شخص اليوم، فإن محركات الذكاء الاصطناعي تقرأ وتلخص المحتوى بدلاً من مجرد عرض روابط زرقاء.\n\n> المواقع التي لا تعتمد كوداً دلالياً ستصبح غير مرئية لنماذج الذكاء الاصطناعي.\n\n## المعايير الـ ٤ لتصدر نتائج الذكاء الاصطناعي\n\n- استخدام وسوم Schema.org الدقيقة\n- الإجابة المباشرة عن أسئلة الجمهور\n- سرعة تحميل فائقة LCP تقل عن 1.5 ثانية\n- بناء هيبة رقمية`,
    category: 'السيو والذكاء الاصطناعي',
    tags: ['GEO', 'ذكاء اصطناعي', 'سيو 2026', 'Google AI', 'Schema Markup'],
    author: 'م. أحمد السلمي',
    read_time: 6,
    published: true,
    views: 1920,
    seo_title: 'تهيئة الموقع لمحركات البحث في عصر الذكاء الاصطناعي 2026',
    seo_description: 'تعرف على استراتيجيات تحسين محركات البحث في عصر الذكاء الاصطناعي وكيف تجعل نماذج AI توصي بموقعك.',
    seo_keywords: ['سيو الذكاء الاصطناعي', 'GEO', 'ChatGPT Search', 'ظهور في بحث قوقل'],
    schema_type: 'BlogPosting',
  },
  {
    title: 'أسرار تصميم واجهات المستخدم (UI/UX) التي تضاعف معدل التحويل والمبيعات',
    slug: 'ui-ux-design-principles-high-conversion',
    excerpt: 'الجمال وحده لا يكفي. كيف تبني واجهة مستخدم لا تبهر الزائر فقط، بل تقوده بسلاسة ليصبح عميلاً مقتنعاً ويدفع دون تردد؟',
    content: `## قاعدة الـ ٣ ثوانٍ وتوجيه انتباه الزائر\n\nيمتلك الزائر في العصر الرقمي مدى انتباه لا يتجاوز بضع ثوانٍ. إذا لم يفهم ماذا تقدم، سيغادر ولن يعود.\n\n> التصميم العظيم ليس عندما لا يتبقى شيء لتضيفه، بل عندما لا يتبقى شيء لتزيله.\n\n## كيف تصمم زر الدعوة لاتخاذ إجراء لا يُقاوم؟\n\n- استخدام تباين ألوان مدروس\n- تقليل الحقول في النماذج إلى ٣ حقول أساسية\n- توفير خيار التواصل عبر واتساب`,
    category: 'تصميم واجهات UI/UX',
    tags: ['UI/UX', 'تصميم واجهات', 'تحويل المبيعات', 'تجربة المستخدم'],
    author: 'سارة المهيدب',
    read_time: 4,
    published: true,
    views: 3100,
    seo_title: 'أسرار تصميم UI/UX التي تضاعف معدل التحويل والمبيعات',
    seo_description: 'اكتشف أهم مبادئ تصميم واجهات UI/UX الحديثة التي ترفع معدل التحويل وتحول زوار موقعك إلى عملاء فعليين.',
    seo_keywords: ['تصميم واجهات UI UX', 'معدل التحويل CRO', 'تصميم مواقع السعودية'],
    schema_type: 'BlogPosting',
  },
  {
    title: 'الصفحة التعريفية أم المتجر الإلكتروني الكامل؟ كيف تختار الحل الأمثل لمشروعك؟',
    slug: 'landing-page-vs-ecommerce-store',
    excerpt: 'قبل أن تدفع آلاف الريالات في متجر إلكتروني معقد قد لا تحتاجه: متى تكفيك صفحة هبوط ذات تركيز عالٍ ومتى تحتاج لمتجر متعدد الأقسام؟',
    content: `## متى تكون صفحة الهبوط خياراً متفوقاً؟\n\nإذا كنت تبيع منتجاً واحداً أو خدمة استشارية، فإن صفحة الهبوط تحقق معدل تحويل أعلى.\n\n## متى تحتاج لمتجر إلكتروني كامل؟\n\nيصبح المتجر الإلكتروني ضرورياً إذا كان لديك كتالوج واسع من المنتجات مع متطلبات معقدة لإدارة المخزون.`,
    category: 'استراتيجيات ونمو الأعمال',
    tags: ['صفحات الهبوط', 'المتاجر الإلكترونية', 'إطلاق المشاريع'],
    author: 'عبدالرحمن الشهري',
    read_time: 5,
    published: true,
    views: 1550,
    seo_title: 'صفحة الهبوط مقابل المتجر الإلكتروني: أيهما يناسب مشروعك؟',
    seo_description: 'مقارنة عملية بين صفحة الهبوط والمتجر الإلكتروني المتكامل لمساعدتك في اختيار النموذج الأعلى عائداً لمشروعك.',
    seo_keywords: ['صفحة هبوط مقابل متجر', 'بدء متجر الكتروني', 'تكلفة إنشاء متجر'],
    schema_type: 'BlogPosting',
  },
  {
    title: 'لماذا تتجه أفضل المواقع العالمية والشركات الناشئة نحو Next.js بدلاً من قوالب الووردبريس؟',
    slug: 'why-startups-choose-nextjs-and-react',
    excerpt: 'السرعة، الأمان، والتخصيص غير المحدود: نظرة تقنية على الأسباب التي تجعل منصات الويب الحديثة تتفوق بنسبة 300% في مقاييس الأداء.',
    content: `## ثورة الـ Server-Side Rendering وأثرها على السيو\n\nتقدم تقنية Next.js ميزة العرض من جهة الخادم، مما يعني أن روبوتات قوقل تتلقى HTML جاهزاً وفورياً.\n\n> كل ثانية تأخير في تحميل صفحتك تكلّفك خسارة 7% من مبيعاتك.\n\n## الأمان وحماية بيانات العملاء\n\nعلى عكس المنصات التي تعتمد على إضافات معرضة للثغرات، يتم تجميع كود Next.js كملفات ثابتة ومشفرة.`,
    category: 'تطوير المواقع والأنظمة',
    tags: ['Next.js', 'React', 'أداء المواقع', 'أمان الويب'],
    author: 'فريق ويب ستيب الهندسي',
    read_time: 7,
    published: true,
    views: 2700,
    seo_title: 'لماذا تختار الشركات Next.js بدلاً من الووردبريس؟',
    seo_description: 'اكتشف لماذا تختار الشركات الرائدة تقنية Next.js و React لبناء مواقعها الرقمية.',
    seo_keywords: ['Next.js عربي', 'مميزات Next.js', 'سرعة الموقع وسيو'],
    schema_type: 'BlogPosting',
  },
  {
    title: 'كيف تبني ملف أعمال (بورتفوليو) يجلب لك كبرى العقود والعملاء في السعودية والخليج؟',
    slug: 'how-to-create-winning-portfolio',
    excerpt: 'سواء كنت مهندساً معمارياً، مصمماً، كاتباً، أو مطوراً: كيف تعرض مشاريعك بأسلوب احترافي يرفع قيمتك في السوق؟',
    content: `## عرض النتيجة والأثر قبل عرض الصور\n\nالعميل لا يشتري مجرد صور جميلة، بل يبحث عن حل لمشكلته. عند استعراض كل مشروع، اذكر التحدي وكيف ساعدك عملك.\n\n## الجودة تفوق الكمية دائماً\n\nثلاثة مشاريع مشروحة بعناية أفضل بكثير من عرض عشرين عملاً سريعاً.`,
    category: 'ملفات الأعمال والصفحات الشخصية',
    tags: ['بورتفوليو', 'ملف أعمال', 'استقطاب عملاء', 'مستقلين'],
    author: 'فهد الدوسري',
    read_time: 4,
    published: true,
    views: 1640,
    seo_title: 'بناء بورتفوليو احترافي يجلب العقود الكبرى في السعودية والخليج',
    seo_description: 'خطوات استراتيجية لبناء بورتفوليو رقمي متطور يعرض خبراتك ومشاريعك السابقة.',
    seo_keywords: ['بورتفوليو احترافي', 'ملف اعمال مهندس', 'جلب عملاء للمستقلين'],
    schema_type: 'BlogPosting',
  },
]

async function seed() {
  console.log(`\n🚀 بدء رفع ${BLOG_POSTS.length} مقال إلى Supabase...\n`)

  let inserted = 0, updated = 0, errors = 0

  for (const post of BLOG_POSTS) {
    try {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id, slug')
        .eq('slug', post.slug)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ ...post, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
        if (error) throw error
        console.log(`  ✏️  تحديث: ${post.title.slice(0, 55)}...`)
        updated++
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(post)
        if (error) throw error
        console.log(`  ✅ إضافة: ${post.title.slice(0, 55)}...`)
        inserted++
      }
    } catch (e) {
      console.error(`  ❌ خطأ في: ${post.slug} — ${e.message}`)
      errors++
    }
  }

  // حفظ نسخة محلية
  const dbPath = join(ROOT, 'data', 'db', 'blog.json')
  const localPosts = BLOG_POSTS.map((p, i) => ({
    id: `POST-${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverImage: p.cover_image || '',
    ...p,
  }))
  writeFileSync(dbPath, JSON.stringify(localPosts, null, 2), 'utf-8')
  console.log(`\n💾 حُفظت نسخة محلية في data/db/blog.json`)
  console.log(`\n✅ إضافة: ${inserted} | تحديث: ${updated} | أخطاء: ${errors}\n`)
}

seed().catch(console.error)
