import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

type Params = { params: Promise<{ slug: string }> }

// ─── POST: تسجيل مشاهدة ───────────────────────────────────────
export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params

  if (!isSupabaseConfigured()) return NextResponse.json({ views: 0 })

  try {
    const client = getServerClient() as any
    // زيادة المشاهدات مباشرة
    const { data: current } = await client.from('blog_posts').select('views').eq('slug', slug).maybeSingle()
    if (current) {
      const nextViews = (current.views || 0) + 1
      await client.from('blog_posts').update({ views: nextViews }).eq('slug', slug)
      return NextResponse.json({ views: nextViews })
    }
    return NextResponse.json({ views: 0 })
  } catch (e) {
    console.error('View POST error:', e)
    return NextResponse.json({ views: 0 })
  }
}
