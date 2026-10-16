-- UI/UX design portfolio and administration
CREATE TABLE IF NOT EXISTS public.uiux_designs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL DEFAULT '',
  gallery TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  outcome TEXT NOT NULL DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT '#1F8A54',
  video_url TEXT NOT NULL DEFAULT '',
  figma_url TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uiux_designs_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT uiux_designs_accent_color_format CHECK (accent_color ~ '^#[0-9a-fA-F]{6}$')
);

CREATE INDEX IF NOT EXISTS uiux_designs_published_order_idx
  ON public.uiux_designs (published, sort_order, created_at DESC);

ALTER TABLE public.uiux_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "uiux_designs_public_read" ON public.uiux_designs;
CREATE POLICY "uiux_designs_public_read" ON public.uiux_designs
  FOR SELECT USING (published = TRUE);
DROP POLICY IF EXISTS "uiux_designs_service_role_all" ON public.uiux_designs;
CREATE POLICY "uiux_designs_service_role_all" ON public.uiux_designs
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
GRANT SELECT ON public.uiux_designs TO anon, authenticated;
GRANT ALL ON public.uiux_designs TO service_role;

-- Seed the four existing portfolio concepts. Replace these example visuals/content
-- with approved project materials from the administration page when available.
INSERT INTO public.uiux_designs (
  id, slug, title, title_en, category, summary, description, cover_image,
  gallery, tags, features, outcome, accent_color, published, featured, sort_order,
  seo_title, seo_description
) VALUES
(
  'brand-hospital', 'brand-hospital', 'هوية بصرية لمركز طبي متخصص', 'Healthcare Brand Identity',
  'هوية بصرية وتجربة رقمية', 'نظام بصري متكامل يسهّل على المراجعين الوصول إلى الخدمات الطبية بثقة ووضوح.',
  'تصور تصميمي يربط الهوية البصرية بتجربة رقمية هادئة، ويعرض الخدمات والمعلومات المهمة بترتيب واضح على مختلف الشاشات.',
  '/assets/10.png', ARRAY['/assets/10.png'], ARRAY['هوية بصرية','لوغو','Design System','App UI'],
  ARRAY['نظام ألوان قابل للتوسع','مكونات واجهة متسقة','تجربة واضحة للخدمات والمواعيد'],
  'تصور واجهة وهوية متكامل للمركز الطبي', '#1F8A54', TRUE, TRUE, 1,
  'تصميم UI/UX وهوية بصرية لمركز طبي | WebStep',
  'استكشف دراسة تصميم واجهة وتجربة المستخدم وهوية بصرية رقمية لمركز طبي متخصص.'
),
(
  'saas-dashboard', 'saas-dashboard', 'لوحة تحكم SaaS لإدارة الطلبات', 'SaaS Orders Dashboard',
  'تصميم لوحة تحكم SaaS', 'لوحة تشغيل تجمع المؤشرات والطلبات والإجراءات اليومية ضمن مساحة عمل واحدة.',
  'تصميم لوحة تحكم لإدارة الطلبات يركز على وضوح البيانات وتقليل خطوات إنجاز المهام، مع مراعاة حالات الاستخدام على الشاشات المختلفة.',
  '/assets/13.png', ARRAY['/assets/13.png'], ARRAY['Dashboard','Data Visualization','Dark Mode','Components'],
  ARRAY['ملخص مؤشرات الأداء','جداول قابلة للمسح البصري','حالات لونية واضحة','مكونات متوافقة مع الوضع الداكن'],
  'تصميم يركز على سرعة قراءة البيانات وإتمام المهام', '#6366f1', TRUE, FALSE, 2,
  'تصميم لوحة تحكم SaaS لإدارة الطلبات | WebStep',
  'شاهد تصميم تجربة مستخدم ولوحة تحكم SaaS لإدارة الطلبات ومؤشرات الأداء.'
),
(
  'ecommerce-ux', 'ecommerce-ux', 'تجربة تسوق لمتجر أزياء', 'Fashion E-commerce Experience',
  'تجربة تجارة إلكترونية', 'رحلة شراء تضع المنتجات والمقاسات وخيارات الدفع في مقدمة تجربة التسوق.',
  'واجهة متجر أزياء تعتمد على صور المنتجات الواضحة والتنقل السهل بين الفئات وصفحة منتج تساعد العميل على اتخاذ قرار الشراء.',
  '/assets/11.png', ARRAY['/assets/11.png'], ARRAY['E-commerce','Mobile UX','Product Design','Checkout'],
  ARRAY['تصفح مهيأ للجوال','تفاصيل منتج مرتبة','خطوات دفع واضحة','مكونات متجر قابلة لإعادة الاستخدام'],
  'تصور تصميمي لرحلة تسوق متكاملة', '#ec4899', TRUE, FALSE, 3,
  'تصميم تجربة متجر أزياء إلكتروني UI/UX | WebStep',
  'استكشف تصميم تجربة تسوق للمتاجر الإلكترونية تركز على الجوال وعرض المنتجات وإتمام الطلب.'
),
(
  'app-onboarding', 'app-onboarding', 'تجربة تهيئة لتطبيق خدمات ميداني', 'Field Services App Onboarding',
  'تصميم تجربة تطبيق جوال', 'تدفق تهيئة مبسط يعرّف المستخدم بالتطبيق ويساعده على بدء الاستخدام بسرعة.',
  'تجربة تسجيل وتهيئة لمستخدمي تطبيق خدمات ميداني، تقدم المعلومات على خطوات قصيرة وتوضح المتطلبات قبل بدء الاستخدام.',
  '/assets/12.png', ARRAY['/assets/12.png'], ARRAY['Mobile App','Onboarding','UX Research','Interaction'],
  ARRAY['تدفق تسجيل مبسط','شاشات تعريفية موجزة','حالات واجهة واضحة','تجربة مناسبة لشاشات الجوال'],
  'تصور تجربة تهيئة يختصر خطوات البداية', '#f97316', TRUE, FALSE, 4,
  'تصميم تجربة تهيئة تطبيق خدمات ميداني | WebStep',
  'تعرف على تصميم تجربة بدء استخدام تطبيق جوال للخدمات الميدانية.'
)
ON CONFLICT (id) DO NOTHING;
