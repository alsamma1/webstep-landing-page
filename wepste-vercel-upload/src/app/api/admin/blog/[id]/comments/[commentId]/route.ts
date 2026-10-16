import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

type Params = { params: Promise<{ id: string; commentId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { commentId } = await params
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase غير مُفعّل' }, { status: 503 })

  const client = getServerClient()
  const { data, error } = await client.from('blog_comments').update(body).eq('id', commentId).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { commentId } = await params

  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase غير مُفعّل' }, { status: 503 })

  const client = getServerClient()
  await client.from('blog_comments').delete().eq('id', commentId)
  return NextResponse.json({ success: true })
}
