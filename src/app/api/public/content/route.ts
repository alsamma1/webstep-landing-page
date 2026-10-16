import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

const contentTables = {
  blog: { table: 'blog_posts', order: 'created_at', published: 'published' },
  jobs: { table: 'jobs', order: 'created_at', published: 'active' },
  projects: { table: 'projects', order: 'sort_order' },
  team: { table: 'team', order: 'sort_order', published: 'active' },
} as const

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') as keyof typeof contentTables | null
  if (!type || !(type in contentTables)) {
    return NextResponse.json({ error: 'نوع المحتوى غير صالح' }, { status: 400 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  const definition = contentTables[type]
  const client = getServerClient()
  let query = client.from(definition.table as never).select('*')
  if ('published' in definition) query = query.eq(definition.published, true) as typeof query
  const { data, error } = await query.order(definition.order, { ascending: type !== 'blog' })
  if (error) {
    console.error(`Public ${type} content query failed:`, error.message)
    return NextResponse.json({ error: 'تعذر تحميل المحتوى المنشور' }, { status: 502 })
  }

  const contentRows = (data || []) as Array<Record<string, unknown>>
  const rows = type === 'team'
    ? contentRows.map(({ email: _email, ...member }) => member)
    : contentRows
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
