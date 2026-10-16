-- ═══════════════════════════════════════════════════════════════
-- Blog Migration SQL — شغّل هذا في Supabase SQL Editor
-- الرابط: https://supabase.com/dashboard/project/cqhcuuggpoemapqcdnpa/sql/new
-- ═══════════════════════════════════════════════════════════════

-- 1. إضافة الحقول الجديدة إلى جدول blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'فريق التحرير';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- 2. تحديث القيم الافتراضية للمقالات الموجودة
UPDATE blog_posts SET likes = 0 WHERE likes IS NULL;
UPDATE blog_posts SET gallery = '{}' WHERE gallery IS NULL;
UPDATE blog_posts SET content_blocks = '[]'::jsonb WHERE content_blocks IS NULL;

-- 3. إنشاء جدول التعليقات
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

-- 4. إنشاء جدول الإعجابات
CREATE TABLE IF NOT EXISTS blog_likes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  post_slug   TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  UNIQUE(post_slug, fingerprint)
);
CREATE INDEX IF NOT EXISTS blog_likes_post_slug_idx ON blog_likes(post_slug);

-- 5. تفعيل أمان الصفوف RLS مع السماح بالقراءة والإضافة
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view approved comments" ON blog_comments;
CREATE POLICY "Public can view approved comments" ON blog_comments FOR SELECT USING (approved = true);
DROP POLICY IF EXISTS "Public can insert comments" ON blog_comments;
CREATE POLICY "Public can insert comments" ON blog_comments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access comments" ON blog_comments;
CREATE POLICY "Admin full access comments" ON blog_comments FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view likes" ON blog_likes;
CREATE POLICY "Public can view likes" ON blog_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can insert likes" ON blog_likes;
CREATE POLICY "Public can insert likes" ON blog_likes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete own likes" ON blog_likes;
CREATE POLICY "Public can delete own likes" ON blog_likes FOR DELETE USING (true);
DROP POLICY IF EXISTS "Admin full access likes" ON blog_likes;
CREATE POLICY "Admin full access likes" ON blog_likes FOR ALL USING (auth.role() = 'service_role');

-- 6. تحقق من النتيجة
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
  AND column_name IN ('gallery', 'video_url', 'likes', 'content_blocks', 'author_role', 'author_avatar')
ORDER BY column_name;
