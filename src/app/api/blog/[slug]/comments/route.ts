import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

type Params = { params: Promise<{ slug: string }> }

// ─── GET: جلب تعليقات المقال ───────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params

  if (!isSupabaseConfigured()) {
    return NextResponse.json([])
  }

  try {
    const client = getServerClient() as any
    const { data, error } = await client
      .from('blog_comments')
      .select('*')
      .eq('post_slug', slug)
      .eq('approved', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('Comments fetch error:', error.message)
      return NextResponse.json([])
    }

    // بناء شجرة التعليقات (parent/replies)
    const list = Array.isArray(data) ? data : []
    const roots: any[] = []
    const map: Record<string, any> = {}

    for (const c of list) {
      map[c.id] = { ...c, replies: [] }
    }
    for (const c of list) {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(map[c.id])
      } else {
        roots.push(map[c.id])
      }
    }

    return NextResponse.json(roots)
  } catch (e) {
    console.error('Comments GET error:', e)
    return NextResponse.json([])
  }
}

// ─── POST: إضافة تعليق جديد ───────────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, content, parent_id, post_id } = body as {
    name: string
    email?: string
    content: string
    parent_id?: string
    post_id?: string
  }

  if (!name?.trim()) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 })
  if (!content?.trim()) return NextResponse.json({ error: 'التعليق مطلوب' }, { status: 400 })
  if (content.trim().length < 5) return NextResponse.json({ error: 'التعليق قصير جداً' }, { status: 400 })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase غير مُفعّل' }, { status: 503 })
  }

  try {
    const client = getServerClient() as any

    // إذا لم يُرسل post_id، نبحث عنه
    let resolvedPostId = post_id
    if (!resolvedPostId) {
      const { data: post } = await client.from('blog_posts').select('id').eq('slug', slug).maybeSingle()
      resolvedPostId = post?.id
    }

    const insertData: Record<string, unknown> = {
      post_slug: slug,
      name: name.trim(),
      content: content.trim(),
      approved: true,
    }
    if (resolvedPostId) insertData.post_id = resolvedPostId
    if (email?.trim()) insertData.email = email.trim()
    if (parent_id) insertData.parent_id = parent_id

    const { data, error } = await client
      .from('blog_comments')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Comment insert error:', error.message)
      return NextResponse.json({ error: 'فشل في حفظ التعليق — تأكد من تشغيل SQL migration للجداول' }, { status: 500 })
    }

    return NextResponse.json({ ...data, replies: [] }, { status: 201 })
  } catch (e) {
    console.error('Comment POST error:', e)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
