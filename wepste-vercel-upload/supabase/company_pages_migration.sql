-- =====================================================================
-- Migration: Company & Contact Pages Setup (WebStep)
-- Covers:
--  1) /about (من نحن) -> key: 'page_about'
--  2) /contact (اتصل بنا) -> key: 'page_contact'
--  3) /order (اطلب مشروعك) -> key: 'page_order'
--  4) /careers (انضم لفريقنا) -> key: 'page_careers'
-- =====================================================================

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_settings' AND policyname = 'Public site settings read'
    ) THEN
        CREATE POLICY "Public site settings read"
        ON public.site_settings FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;

-- Allow service role and authenticated users full write access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_settings' AND policyname = 'Service role write site settings'
    ) THEN
        CREATE POLICY "Service role write site settings"
        ON public.site_settings FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- 2. Seed Initial Content for the 4 Pages

-- ── A) About Page (من نحن) ──
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'page_about',
  '{
    "hero": {
      "badge": "قصتنا وهويتنا",
      "title": "نبني تجارب رقمية",
      "highlight": "تصنع فارقاً حقيقياً",
      "subtitle": "WebStep هي وكالة رقمية سعودية متخصصة في تطوير الويب، التطبيقات، والحلول الرقمية المتقدمة التي تساعد الشركات ورواد الأعمال على النمو والريادة."
    },
    "stats": [
      { "val": "١٢٠+", "label": "مشروع ناجح" },
      { "val": "٩٨٪", "label": "رضا العملاء" },
      { "val": "٥+ سنوات", "label": "خبرة تراكمية" },
      { "val": "٢٠+", "label": "خبير ومطور" }
    ],
    "vision": {
      "title": "رؤيتنا",
      "text": "أن نكون الشريك الرقمي الأول والأكثر موثوقية للشركات الطموحة في المملكة العربية السعودية والخليج، محولين الأفكار التقنية إلى واقع ملموس يحقق أعلى عوائد استثمارية."
    },
    "mission": {
      "title": "رسالتنا",
      "text": "تمكين عملائنا من التفوق التنافسي من خلال تقديم برمجيات عالية الجودة، وتصاميم واجهات ذكية، واستراتيجيات نمو مبنية على البيانات وأحدث تقنيات العصر."
    },
    "values": [
      { "title": "الجودة فوق كل شيء", "desc": "لا نسلّم مشروعاً إلا بعد اختباره على معايير الجودة والأداء الصارمة.", "color": "#1F8A54" },
      { "title": "شفافية كاملة", "desc": "لا رسوم مخفية ولا مفاجآت. كل بند موثق ومتفق عليه بوضوح تام.", "color": "#6366f1" },
      { "title": "الالتزام بالمواعيد", "desc": "نحترم الوقت كأثمن مورد، ونسلّم مخرجاتنا بدقة متناهية.", "color": "#f59e0b" },
      { "title": "شراكة ممتدة", "desc": "علاقتنا لا تنتهي عند التسليم، بل نستمر في الدعم والتطوير.", "color": "#ec4899" }
    ],
    "milestones": [
      { "year": "٢٠٢١", "title": "انطلاقة الفكرة", "desc": "تأسيس WebStep بفريق عمل صغير شغوف بصناعة البرمجيات المتقنة." },
      { "year": "٢٠٢٢", "title": "التوسع الأول", "desc": "إنجاز أكثر من ٤٠ مشروعاً والدخول بقوة في سوق المتاجر وتطبيقات الجوال." },
      { "year": "٢٠٢٣", "title": "بناء منظومة متكاملة", "desc": "إضافة خدمات الهوية الرقمية، وأنظمة ERP المخصصة لقطاع الأعمال." },
      { "year": "٢٠٢٤ – اليوم", "title": "الريادة والذكاء الاصطناعي", "desc": "دمج حلول الذكاء الاصطناعي الحديثة وتقديم تجارب رقمية شاملة بأعلى المعايير." }
    ]
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

-- ── B) Contact Page (اتصل بنا) ──
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'page_contact',
  '{
    "hero": {
      "badge": "نحن هنا لمساعدتك",
      "title": "تواصل مع",
      "highlight": "فريق WebStep",
      "subtitle": "لديك سؤال، فكرة مشروع، أو تريد استشارة تقنية مجانية؟ نحن نرد عادة خلال ساعتين."
    },
    "channels": {
      "whatsapp": "966500000000",
      "email": "hello@wepstep.sa",
      "phone": "+966 50 000 0000",
      "address": "الرياض، المملكة العربية السعودية",
      "workingHoursWeekday": "الأحد – الخميس: ٩ص – ٨م",
      "workingHoursWeekend": "الجمعة: ٢م – ٦م",
      "responseTimeText": "متوسط زمن الاستجابة: ١.٨ ساعة (٩٧٪ من الطلبات تُجاب خلال ساعتين)"
    },
    "faqs": [
      { "q": "ما هو زمن الاستجابة عند التواصل؟", "a": "نضمن الرد خلال ساعتين خلال أوقات العمل الرسمية، وفي حالات الدعم الطارئ خلال ٣٠ دقيقة." },
      { "q": "هل تقدمون استشارة مجانية قبل البدء؟", "a": "نعم، نوفر جلسة استشارة تقنية وتخطيطية مجانية لمدة ٣٠ دقيقة لكل مشروع جديد." },
      { "q": "هل يمكن التواصل خارج أوقات العمل الرسمية؟", "a": "يمكنك إرسال رسالتك عبر واتساب في أي وقت، وسيتم الرد فور بدء أوقات العمل التالية." },
      { "q": "ما هي المدة المتوقعة لتنفيذ المشروع؟", "a": "صفحات الهبوط والمواقع الأساسية تستغرق بين ٥ إلى ١٤ يوماً، وتطبيقات الجوال والمتاجر بين ٣٠ إلى ٩٠ يوماً." }
    ]
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

-- ── C) Order Page (اطلب مشروعك) ──
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'page_order',
  '{
    "hero": {
      "badge": "ابدأ مشروعك الرقمي",
      "title": "طلب مشروع جديد مع WebStep",
      "subtitle": "أكمل الخطوات التالية وسنقوم بدراسة متطلباتك وتقديم عرض فني وسعري مخصص بدقة."
    },
    "whatsappNumber": "966500000000",
    "discountNotice": "احصل على استشارة تقنية مجانية + خصم خاص ١٠٪ على مشاريع التطوير الشاملة هذا الشهر.",
    "budgetTiers": {
      "web": ["أقل من ١,٠٠٠ ر.س", "١,٠٠٠ – ٣,٠٠٠ ر.س", "٣,٠٠٠ – ٦,٠٠٠ ر.س", "٦,٠٠٠+ ر.س"],
      "apps": ["٥,٠٠٠ – ١٠,٠٠٠ ر.س", "١٠,٠٠٠ – ٢٠,٠٠٠ ر.س", "٢٠,٠٠٠ – ٤٠,٠٠٠ ر.س", "٤٠,٠٠٠+ ر.س"],
      "design": ["٨٠٠ – ١,٥٠٠ ر.س", "١,٥٠٠ – ٣,٠٠٠ ر.س", "٣,٠٠٠+ ر.س"],
      "landing": ["٦٠٠ – ١,٢٠٠ ر.س", "١,٢٠٠ – ٢,٠٠٠ ر.س", "٢,٠٠٠+ ر.س"],
      "ecommerce": ["٢,٥٠٠ – ٥,٠٠٠ ر.س", "٥,٠٠٠ – ١٠,٠٠٠ ر.س", "١٠,٠٠٠+ ر.س"],
      "systems": ["٨,٠٠٠ – ١٥,٠٠٠ ر.س", "١٥,٠٠٠ – ٣٠,٠٠٠ ر.س", "٣٠,٠٠٠+ ر.س"]
    }
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

-- ── D) Careers Page (انضم لفريقنا) ──
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'page_careers',
  '{
    "hero": {
      "badge": "انضم إلى فريق النخبة",
      "title": "اصنع مستقبلك المهني مع",
      "highlight": "عائلة WebStep",
      "subtitle": "نبحث دائماً عن المبدعين والشغوفين بالتقنية والتصميم للانضمام إلى رحلتنا في بناء وتطوير المنتجات الرقمية الحديثة."
    },
    "perks": [
      { "title": "رواتب مجزية وحوافز", "desc": "رواتب تنافسية ترتبط بالأداء المتميز ومكافآت على إنجاز المشاريع.", "color": "#1F8A54" },
      { "title": "مرونة بيئة العمل", "desc": "إمكانية العمل الهجين أو عن بُعد بمرونة تدعم التوازن بين العمل والحياة.", "color": "#6366f1" },
      { "title": "تطوير وتدريب مستمر", "desc": "ميزانية سنوية مخصصة للدورات والمؤتمرات واشتراكات في أحدث الأدوات التقنية.", "color": "#f59e0b" },
      { "title": "مشاريع نوعية وتقنيات حديثة", "desc": "فرصة العمل على تقنيات الذكاء الاصطناعي، Next.js، والتطبيقات الواسعة الانتشار.", "color": "#ec4899" }
    ],
    "steps": [
      { "num": "٠١", "title": "التقديم", "desc": "أرسل بياناتك وبورتفوليو أعمالك عبر النموذج السريع." },
      { "num": "٠٢", "title": "مراجعة الطلب", "desc": "يقوم الفريق بمراجعة أعمالك خلال ٣ إلى ٥ أيام عمل." },
      { "num": "٠٣", "title": "المقابلة الفنية", "desc": "جلسة حوارية ممتعة للتعرف على مهاراتك وثقافة العمل." },
      { "num": "٠٤", "title": "عرض الانضمام", "desc": "نرحب بك عضواً أساسياً في فريق WebStep!" }
    ]
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;
