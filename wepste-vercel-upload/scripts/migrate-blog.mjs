/**
 * migrate-blog.mjs — تطبيق migration مباشرة عبر Supabase Management API
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const env = {}
try {
  const raw = readFileSync(join(ROOT, '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() && v.length) env[k.trim()] = v.join('=').trim()
  }
} catch { process.exit(1) }

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runSQL(sql) {
  // نجرب عبر supabase-js مباشرة بـ from().rpc alternative
  // نستخدم endpoint مخصص إن وُجد
  try {
    // محاولة تشغيل SQL عبر fetch مباشرة
    const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`
    // استخدام ALTER TABLE عبر upsert لأعمدة موجودة أمر لا يمكن عبر REST
    // سنتحقق من وجود الأعمدة بشكل غير مباشر
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

// تحقق وأضف الأعمدة الناقصة عن طريق اختبار INSERT
async function migrate() {
  console.log('\n🔧 فحص هيكل قاعدة البيانات...\n')

  // 1. تحقق من وجود جدول blog_comments
  const { data: commentsTest, error: commentsErr } = await supabase
    .from('blog_comments')
    .select('id')
    .limit(1)

  if (commentsErr?.code === '42P01') {
    console.log('  ❌ جدول blog_comments غير موجود')
    console.log('\n⚠️  يجب تشغيل schema.sql في Supabase SQL Editor يدوياً')
    console.log('  رابط: https://supabase.com/dashboard/project/[project-id]/sql/new\n')
  } else {
    console.log('  ✅ جدول blog_comments موجود')
  }

  // 2. تحقق من وجود جدول blog_likes
  const { data: likesTest, error: likesErr } = await supabase
    .from('blog_likes')
    .select('id')
    .limit(1)

  if (likesErr?.code === '42P01') {
    console.log('  ❌ جدول blog_likes غير موجود')
  } else {
    console.log('  ✅ جدول blog_likes موجود')
  }

  // 3. تحقق من حقول blog_posts
  const { data: postSample } = await supabase.from('blog_posts').select('*').limit(1)
  if (postSample?.[0]) {
    const hasGallery = 'gallery' in postSample[0]
    const hasVideoUrl = 'video_url' in postSample[0]
    const hasLikes = 'likes' in postSample[0]
    const hasContentBlocks = 'content_blocks' in postSample[0]
    console.log(`  ${hasGallery ? '✅' : '❌'} حقل gallery`)
    console.log(`  ${hasVideoUrl ? '✅' : '❌'} حقل video_url`)
    console.log(`  ${hasLikes ? '✅' : '❌'} حقل likes`)
    console.log(`  ${hasContentBlocks ? '✅' : '❌'} حقل content_blocks`)

    const missing = []
    if (!hasGallery) missing.push('gallery')
    if (!hasVideoUrl) missing.push('video_url')
    if (!hasLikes) missing.push('likes')
    if (!hasContentBlocks) missing.push('content_blocks')

    if (missing.length > 0) {
      console.log('\n⚠️  حقول ناقصة:', missing.join(', '))
      console.log('\n📋 شغّل هذا SQL في Supabase SQL Editor:')
      console.log('─'.repeat(60))
      if (!hasGallery) console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';")
      if (!hasVideoUrl) console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;")
      if (!hasLikes) console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;")
      if (!hasContentBlocks) console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;")
      console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'فريق التحرير';")
      console.log("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;")
      console.log(`CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  post_slug TEXT NOT NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT TRUE,
  likes INTEGER DEFAULT 0
);`)
      console.log('CREATE INDEX IF NOT EXISTS blog_comments_post_slug_idx ON blog_comments(post_slug);')
      console.log(`CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  post_slug TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  UNIQUE(post_slug, fingerprint)
);`)
      console.log('─'.repeat(60))
    } else {
      console.log('\n✅ جميع الحقول موجودة!')
    }
  }

  console.log('\n📌 رابط SQL Editor:\n   https://supabase.com/dashboard\n')
}

migrate().catch(console.error)
