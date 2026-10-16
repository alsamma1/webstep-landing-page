/**
 * apply-blog-migration.mjs
 * يطبق الحقول الجديدة على blog_posts عبر Supabase client
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
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { db: { schema: 'public' } }
)

async function main() {
  console.log('\n🔧 تطبيق migration على blog_posts...\n')

  // الطريقة: نجلب مقالاً ونحاول تحديثه بالحقول الجديدة
  // إذا نجح PATCH بالحقل الجديد = الحقل موجود، وإلا نحتاج ALTER TABLE

  const { data: posts } = await supabase.from('blog_posts').select('id, slug').limit(1)
  if (!posts?.[0]) { console.log('❌ لا توجد مقالات للاختبار'); return }

  const testId = posts[0].id
  const testSlug = posts[0].slug

  // محاولة تحديث الحقول الجديدة
  const testPayload = {
    gallery: [],
    video_url: null,
    likes: 0,
    content_blocks: [],
    author_role: 'فريق التحرير',
    author_avatar: null,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase.from('blog_posts').update(testPayload).eq('id', testId)

  if (error) {
    console.log('❌ فشل التحديث:', error.message)
    console.log('\n📋 الحقول الناقصة — يجب تشغيل هذا SQL في Supabase SQL Editor:')
    console.log('─'.repeat(65))
    console.log(`-- افتح: https://supabase.com/dashboard/project/cqhcuuggpoemapqcdnpa/sql/new`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'فريق التحرير';`)
    console.log(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;`)
    console.log('─'.repeat(65))
  } else {
    console.log('✅ جميع الحقول موجودة ومُحدَّثة!')
    console.log(`   تم اختبار update على مقال: ${testSlug}`)

    // تحديث جميع المقالات لإضافة قيم افتراضية للحقول الجديدة
    const { data: allPosts } = await supabase.from('blog_posts').select('id, gallery, likes, content_blocks')
    let updated = 0
    for (const post of allPosts || []) {
      const patch = {}
      if (!post.gallery) patch.gallery = []
      if (post.likes === null || post.likes === undefined) patch.likes = 0
      if (!post.content_blocks) patch.content_blocks = []
      if (Object.keys(patch).length > 0) {
        await supabase.from('blog_posts').update(patch).eq('id', post.id)
        updated++
      }
    }
    if (updated > 0) console.log(`   ✅ تم تحديث القيم الافتراضية لـ ${updated} مقال`)
  }

  console.log('\n📌 للتحقق: اذهب إلى https://supabase.com/dashboard/project/cqhcuuggpoemapqcdnpa/editor\n')
}

main().catch(console.error)
