import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

type Params = { params: Promise<{ slug: string }> }

// ─── POST: تسجيل إعجاب أو إلغاؤه ───────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params

  let body: { fingerprint: string; action: 'like' | 'unlike' }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { fingerprint, action } = body
  if (!fingerprint) return NextResponse.json({ error: 'fingerprint مطلوب' }, { status: 400 })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ likes: 0, liked: false })
  }

  try {
    const client = getServerClient() as any

    if (action === 'like') {
      try {
        await client.from('blog_likes').upsert(
          { post_slug: slug, fingerprint },
          { onConflict: 'post_slug,fingerprint', ignoreDuplicates: true }
        )
      } catch (err) {
        console.warn('Upsert like warning:', err)
      }

      // زيادة عداد الإعجابات
      try {
        const { data: post } = await client.from('blog_posts').select('likes').eq('slug', slug).single()
        if (post) {
          const newLikes = (post.likes || 0) + 1
          await client.from('blog_posts').update({ likes: newLikes }).eq('slug', slug)
        }
      } catch (err) {
        console.warn('Increment likes warning:', err)
      }
    } else {
      try {
        await client.from('blog_likes').delete().eq('post_slug', slug).eq('fingerprint', fingerprint)
      } catch (err) {
        console.warn('Delete like warning:', err)
      }

      // تقليل العداد
      try {
        const { data: post } = await client.from('blog_posts').select('likes').eq('slug', slug).single()
        if (post) {
          const newLikes = Math.max(0, (post.likes || 1) - 1)
          await client.from('blog_posts').update({ likes: newLikes }).eq('slug', slug)
        }
      } catch (err) {
        console.warn('Decrement likes warning:', err)
      }
    }

    // اجلب العدد الحالي
    const { data: post } = await client.from('blog_posts').select('likes').eq('slug', slug).single()

    // تحقق إذا كان هذا المستخدم أعجب
    const { data: likeRow } = await client
      .from('blog_likes')
      .select('id')
      .eq('post_slug', slug)
      .eq('fingerprint', fingerprint)
      .maybeSingle()

    return NextResponse.json({ likes: post?.likes ?? 0, liked: !!likeRow })
  } catch (e) {
    console.error('Like POST error:', e)
    return NextResponse.json({ likes: 0, liked: false })
  }
}

// ─── GET: جلب حالة الإعجاب ───────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const url = new URL(req.url)
  const fingerprint = url.searchParams.get('fingerprint') || ''

  if (!isSupabaseConfigured()) return NextResponse.json({ likes: 0, liked: false })

  try {
    const client = getServerClient() as any
    const postRes = await client.from('blog_posts').select('likes').eq('slug', slug).maybeSingle()
    
    let isLiked = false
    if (fingerprint) {
      const likeRes = await client.from('blog_likes').select('id').eq('post_slug', slug).eq('fingerprint', fingerprint).maybeSingle()
      isLiked = !!likeRes.data
    }

    return NextResponse.json({
      likes: postRes.data?.likes ?? 0,
      liked: isLiked,
    })
  } catch {
    return NextResponse.json({ likes: 0, liked: false })
  }
}
