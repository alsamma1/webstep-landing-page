-- ═══════════════════════════════════════════════════════════════════
-- WebStep — Supabase Database Schema (Idempotent / قابل للتحديث دائماً)
-- تشغيل هذا الملف آمن 100% في أي وقت: يُنشئ الجديد ويُحدّث الحقول دون أخطاء
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- 1. ORDERS — طلبات العملاء
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'new',
  service       TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  company       TEXT,
  budget        TEXT,
  timeline      TEXT,
  notes         TEXT,
  answers       JSONB DEFAULT '{}'::jsonb,
  admin_notes   TEXT,
  assigned_to   TEXT
);

-- فحص وإضافة أي حقول ناقصة في جدول الطلبات إذا كان الجدول منشأ سابقاً
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS service TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- ─────────────────────────────────────────────────────────────────
-- 2. BLOG_POSTS — مقالات المدونة
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT,
  content_blocks  JSONB DEFAULT '[]'::jsonb,
  cover_image     TEXT,
  gallery         TEXT[] DEFAULT '{}',
  video_url       TEXT,
  category        TEXT NOT NULL DEFAULT 'عام',
  tags            TEXT[] DEFAULT '{}',
  author          TEXT NOT NULL DEFAULT 'فريق WebStep',
  author_role     TEXT DEFAULT 'فريق التحرير',
  author_avatar   TEXT,
  read_time       INTEGER DEFAULT 5,
  published       BOOLEAN DEFAULT FALSE,
  views           INTEGER DEFAULT 0,
  likes           INTEGER DEFAULT 0,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[] DEFAULT '{}',
  canonical_url   TEXT,
  og_image        TEXT,
  schema_type     TEXT DEFAULT 'BlogPosting'
);

-- فحص وإضافة أي حقول ناقصة في جدول المقالات
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'عام';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'فريق WebStep';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'فريق التحرير';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time INTEGER DEFAULT 5;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_keywords TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'BlogPosting';

-- ─────────────────────────────────────────────────────────────────
-- 2b. BLOG_COMMENTS — تعليقات المدونة
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  post_id     UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  post_slug   TEXT NOT NULL,
  parent_id   UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  content     TEXT NOT NULL,
  approved    BOOLEAN DEFAULT TRUE,
  likes       INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS blog_comments_post_slug_idx ON blog_comments(post_slug);
CREATE INDEX IF NOT EXISTS blog_comments_parent_id_idx ON blog_comments(parent_id);

-- ─────────────────────────────────────────────────────────────────
-- 2c. BLOG_LIKES — تتبع الإعجابات (لمنع التكرار)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_likes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  post_slug   TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  UNIQUE(post_slug, fingerprint)
);
CREATE INDEX IF NOT EXISTS blog_likes_post_slug_idx ON blog_likes(post_slug);

-- ─────────────────────────────────────────────────────────────────
-- 3. PROJECTS — أعمالنا (Portfolio)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  image         TEXT,
  gallery       TEXT[] DEFAULT '{}',
  url           TEXT,
  featured      BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  seo_title     TEXT,
  seo_description TEXT
);

-- فحص وإضافة أي حقول ناقصة في جدول المشاريع
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'مواقع ويب';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- ─────────────────────────────────────────────────────────────────
-- 4. TEAM — أعضاء الفريق
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  bio           TEXT,
  avatar        TEXT,
  skills        TEXT[] DEFAULT '{}',
  linkedin      TEXT,
  email         TEXT,
  twitter       TEXT,
  active        BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0
);

-- فحص وإضافة أي حقول ناقصة في جدول الفريق
ALTER TABLE team ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE team ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE team ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- ─────────────────────────────────────────────────────────────────
-- 5. JOBS — الوظائف
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  title         TEXT NOT NULL,
  department    TEXT NOT NULL,
  type          TEXT NOT NULL,
  location      TEXT DEFAULT 'الرياض',
  salary        TEXT,
  description   TEXT,
  requirements  TEXT[] DEFAULT '{}',
  benefits      TEXT[] DEFAULT '{}',
  urgent        BOOLEAN DEFAULT FALSE,
  active        BOOLEAN DEFAULT TRUE,
  applications  INTEGER DEFAULT 0
);

-- فحص وإضافة أي حقول ناقصة في جدول الوظائف
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'الرياض';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applications INTEGER DEFAULT 0;

-- ─────────────────────────────────────────────────────────────────
-- 6. MESSAGES — رسائل التواصل
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  subject       TEXT NOT NULL,
  message       TEXT NOT NULL,
  read          BOOLEAN DEFAULT FALSE,
  replied       BOOLEAN DEFAULT FALSE,
  source        TEXT DEFAULT 'contact_form'
);

-- فحص وإضافة أي حقول ناقصة في جدول الرسائل
ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'contact_form';

-- ─────────────────────────────────────────────────────────────────
-- 7. SITE_SETTINGS — إعدادات الموقع
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key           TEXT PRIMARY KEY,
  value         JSONB,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- إدخال الإعدادات الافتراضية إذا لم تكن موجودة
INSERT INTO site_settings (key, value) VALUES
('general', '{"siteName":"WebStep","siteUrl":"https://wepstep.sa","email":"hello@wepstep.sa","phone":"+966500000000","whatsapp":"966500000000","address":"الرياض، المملكة العربية السعودية"}'),
('seo', '{"title":"WebStep — موقعك الذي يمثّلك | تطوير مواقع وتطبيقات احترافية","description":"ويب ستيب متخصصة في بناء مواقع ويب وتطبيقات جوال احترافية للسوق السعودي والخليجي.","keywords":["WebStep","تطوير مواقع","تطبيقات جوال","متجر إلكتروني"]}'),
('social', '{"instagram":"","twitter":"","linkedin":"","tiktok":""}'),
('system', '{"maintenanceMode":false,"allowOrders":true,"primaryColor":"#1F8A54"}')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- 8. PAGES_SEO — SEO لكل صفحة
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages_seo (
  page_slug     TEXT PRIMARY KEY,
  title         TEXT,
  description   TEXT,
  keywords      TEXT[],
  og_title      TEXT,
  og_description TEXT,
  og_image      TEXT,
  canonical     TEXT,
  schema_json   JSONB,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 9. WEB_SERVICE_PAGE_CONTENT — محتوى صفحة تطوير المواقع
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS web_service_page_content (
  page_slug     TEXT PRIMARY KEY DEFAULT 'services/web'
                CHECK (page_slug = 'services/web'),
  content       JSONB NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 10. UIUX_DESIGNS — معرض أعمال تصميم واجهات وتجارب المستخدم
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS uiux_designs (
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
  ON uiux_designs (published, sort_order, created_at DESC);

-- ─────────────────────────────────────────────────────────────────
-- 11. LANDING_SERVICE_CONTENT — محتوى خدمة صفحات الهبوط
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing_service_content (
  page_slug TEXT PRIMARY KEY DEFAULT 'services/landing'
    CHECK (page_slug = 'services/landing'),
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 12. MANAGED_SERVICE_CONTENT — محتوى صفحات الخدمات القابل للإدارة
-- ─────────────────────────────────────────────────────────────────
DO $$
DECLARE service_name TEXT;
BEGIN
  FOREACH service_name IN ARRAY ARRAY['ecommerce', 'systems', 'marketing', 'support']
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.%I (
        service_key TEXT PRIMARY KEY CHECK (service_key = %L),
        content JSONB NOT NULL DEFAULT ''{}''::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )',
      service_name || '_service_content',
      service_name
    );
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', service_name || '_service_content');
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', service_name || '_service_public_read', service_name || '_service_content');
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true)', service_name || '_service_public_read', service_name || '_service_content');
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', service_name || '_service_service_role_write', service_name || '_service_content');
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'')',
      service_name || '_service_service_role_write',
      service_name || '_service_content'
    );
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', service_name || '_service_content');
    EXECUTE format('GRANT ALL ON public.%I TO service_role', service_name || '_service_content');
    EXECUTE format(
      'INSERT INTO public.%I (service_key, content) VALUES (%L, ''{}''::jsonb) ON CONFLICT (service_key) DO NOTHING',
      service_name || '_service_content',
      service_name
    );
  END LOOP;
END $$;

-- فحص وإضافة أي حقول ناقصة في جدول SEO
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS canonical TEXT;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS schema_json JSONB;
ALTER TABLE pages_seo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- إدخال البيانات الافتراضية لصفحات الموقع
INSERT INTO pages_seo (page_slug, title, description) VALUES
('home', 'WebStep — موقعك الذي يمثّلك | تطوير مواقع وتطبيقات', 'ويب ستيب متخصصة في بناء مواقع ويب وتطبيقات جوال احترافية للسوق السعودي'),
('about', 'من نحن | WebStep', 'تعرّف على فريق WebStep ورؤيتنا وقيمنا في عالم التقنية'),
('contact', 'تواصل معنا | WebStep', 'تواصل مع فريق WebStep لبدء مشروعك الرقمي'),
('order', 'قدّم طلبك | WebStep', 'قدّم طلب مشروعك الرقمي وابدأ رحلتك مع WebStep اليوم'),
('careers', 'الوظائف والانضمام | WebStep', 'انضم إلى فريق WebStep وابن مستقبلك في عالم التقنية'),
('blog', 'المدونة الرقمية | WebStep', 'مقالات ونصائح تقنية متخصصة في تطوير الويب والتطبيقات والتسويق الرقمي'),
('services/web', 'تطوير المواقع الاحترافية | WebStep', 'نبني مواقع احترافية سريعة وآمنة بأحدث التقنيات'),
('services/apps', 'تطوير تطبيقات الجوال | WebStep', 'تطبيقات موبايل متكاملة لـ iOS وAndroid'),
('services/ecommerce', 'المتاجر الإلكترونية | WebStep', 'نبني متجرك الإلكتروني المتكامل مع بوابات الدفع السعودية'),
('services/design', 'تصميم UI/UX | WebStep', 'تصاميم عصرية وجذابة بمعايير عالمية'),
('services/systems', 'الأنظمة الرقمية والـ SaaS | WebStep', 'أنظمة ERP وSaaS مخصصة لأعمالك'),
('services/landing', 'صفحات الهبوط | WebStep', 'صفحات هبوط محسّنة للتحويل'),
('services/marketing', 'التسويق الرقمي | WebStep', 'استراتيجيات تسويق رقمي فعّالة'),
('services/support', 'الصيانة والدعم الفني | WebStep', 'دعم فني متواصل وصيانة شاملة لموقعك')
ON CONFLICT (page_slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- INDEXES — للأداء
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read, created_at DESC);

-- ─────────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER — تحديث تلقائي آمن
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- حذف المشغلات القديمة إن وُجدت قبل إعادة إنشائها لتفادي خطأ 42710
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS blog_updated_at ON blog_posts;
CREATE TRIGGER blog_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS jobs_updated_at ON jobs;
CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS pages_seo_updated_at ON pages_seo;
CREATE TRIGGER pages_seo_updated_at BEFORE UPDATE ON pages_seo FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — سياسات الحماية القابلة للتحديث
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_service_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE uiux_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_service_content ENABLE ROW LEVEL SECURITY;

-- 1. Orders
DROP POLICY IF EXISTS "orders_insert_public" ON orders;
CREATE POLICY "orders_insert_public" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_admin_all" ON orders;
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (auth.role() = 'service_role');

-- 2. Messages
DROP POLICY IF EXISTS "messages_insert_public" ON messages;
CREATE POLICY "messages_insert_public" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "messages_admin_all" ON messages;
CREATE POLICY "messages_admin_all" ON messages FOR ALL USING (auth.role() = 'service_role');

-- 3. Blog
DROP POLICY IF EXISTS "blog_read_published" ON blog_posts;
CREATE POLICY "blog_read_published" ON blog_posts FOR SELECT USING (published = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "blog_admin_write" ON blog_posts;
CREATE POLICY "blog_admin_write" ON blog_posts FOR ALL USING (auth.role() = 'service_role');

-- 3b. Blog Comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_read_approved" ON blog_comments;
CREATE POLICY "comments_read_approved" ON blog_comments FOR SELECT USING (approved = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "comments_insert_public" ON blog_comments;
CREATE POLICY "comments_insert_public" ON blog_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "comments_admin_all" ON blog_comments;
CREATE POLICY "comments_admin_all" ON blog_comments FOR ALL USING (auth.role() = 'service_role');

-- 3c. Blog Likes
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "likes_read_all" ON blog_likes;
CREATE POLICY "likes_read_all" ON blog_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "likes_insert_public" ON blog_likes;
CREATE POLICY "likes_insert_public" ON blog_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "likes_delete_public" ON blog_likes;
CREATE POLICY "likes_delete_public" ON blog_likes FOR DELETE USING (true);

DROP POLICY IF EXISTS "likes_admin_all" ON blog_likes;
CREATE POLICY "likes_admin_all" ON blog_likes FOR ALL USING (auth.role() = 'service_role');

-- 4. Projects
DROP POLICY IF EXISTS "projects_read_all" ON projects;
CREATE POLICY "projects_read_all" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "projects_admin_write" ON projects;
CREATE POLICY "projects_admin_write" ON projects FOR ALL USING (auth.role() = 'service_role');

-- 5. Team
DROP POLICY IF EXISTS "team_read_active" ON team;
CREATE POLICY "team_read_active" ON team FOR SELECT USING (active = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "team_admin_write" ON team;
CREATE POLICY "team_admin_write" ON team FOR ALL USING (auth.role() = 'service_role');

-- 6. Jobs
DROP POLICY IF EXISTS "jobs_read_active" ON jobs;
CREATE POLICY "jobs_read_active" ON jobs FOR SELECT USING (active = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "jobs_admin_write" ON jobs;
CREATE POLICY "jobs_admin_write" ON jobs FOR ALL USING (auth.role() = 'service_role');

-- 7. Settings
DROP POLICY IF EXISTS "settings_admin_only" ON site_settings;
CREATE POLICY "settings_admin_only" ON site_settings FOR ALL USING (auth.role() = 'service_role');

-- 8. Pages SEO
DROP POLICY IF EXISTS "pages_seo_read_all" ON pages_seo;
CREATE POLICY "pages_seo_read_all" ON pages_seo FOR SELECT USING (true);

DROP POLICY IF EXISTS "pages_seo_admin_write" ON pages_seo;
CREATE POLICY "pages_seo_admin_write" ON pages_seo FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "web_service_content_public_read" ON web_service_page_content;
CREATE POLICY "web_service_content_public_read"
  ON web_service_page_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "web_service_content_admin_write" ON web_service_page_content;
CREATE POLICY "web_service_content_admin_write"
  ON web_service_page_content FOR ALL USING (auth.role() = 'service_role');
GRANT SELECT ON web_service_page_content TO anon, authenticated;
GRANT ALL ON web_service_page_content TO service_role;
DROP POLICY IF EXISTS "uiux_designs_public_read" ON uiux_designs;
CREATE POLICY "uiux_designs_public_read" ON uiux_designs FOR SELECT USING (published = TRUE);
DROP POLICY IF EXISTS "uiux_designs_service_role_all" ON uiux_designs;
CREATE POLICY "uiux_designs_service_role_all" ON uiux_designs
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
GRANT SELECT ON uiux_designs TO anon, authenticated;
GRANT ALL ON uiux_designs TO service_role;
DROP POLICY IF EXISTS "landing_service_public_read" ON landing_service_content;
CREATE POLICY "landing_service_public_read" ON landing_service_content
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "landing_service_service_role_write" ON landing_service_content;
CREATE POLICY "landing_service_service_role_write" ON landing_service_content
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
GRANT SELECT ON landing_service_content TO anon, authenticated;
GRANT ALL ON landing_service_content TO service_role;

-- ─────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS — لرفع الصور من لوحة التحكم
-- ─────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('blog', 'blog', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('projects', 'projects', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('team', 'team', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('site', 'site', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- سياسات التخزين (Storage Policies)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public View Objects" ON storage.objects;
  DROP POLICY IF EXISTS "Allow All Uploads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow All Updates" ON storage.objects;
  DROP POLICY IF EXISTS "Allow All Deletes" ON storage.objects;
END $$;

CREATE POLICY "Public View Objects" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('blog', 'projects', 'team', 'site'));

CREATE POLICY "Allow All Uploads" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id IN ('blog', 'projects', 'team', 'site'));

CREATE POLICY "Allow All Updates" ON storage.objects 
  FOR UPDATE USING (bucket_id IN ('blog', 'projects', 'team', 'site'));

CREATE POLICY "Allow All Deletes" ON storage.objects 
  FOR DELETE USING (bucket_id IN ('blog', 'projects', 'team', 'site'));
