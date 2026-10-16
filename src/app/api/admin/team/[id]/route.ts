import { NextRequest, NextResponse } from 'next/server'
import {
  saveTeamMemberWithAccount,
  deleteTeamMember
} from '@/lib/team-server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
  }

  try {
    const { account, ...memberData } = body
    const saved = await saveTeamMemberWithAccount({ id, ...memberData }, account)
    return NextResponse.json(saved)
  } catch (err: any) {
    console.error('Supabase team update failed:', err.message)
    return NextResponse.json({ error: err.message || 'تعذر تحديث عضو الفريق' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await deleteTeamMember(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Supabase team delete failed:', err.message)
    return NextResponse.json({ error: 'تعذر حذف عضو الفريق' }, { status: 500 })
  }
}
