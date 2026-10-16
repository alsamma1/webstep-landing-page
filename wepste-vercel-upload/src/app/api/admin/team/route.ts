import { NextRequest, NextResponse } from 'next/server'
import {
  getAllTeamMembersWithAccounts,
  saveTeamMemberWithAccount
} from '@/lib/team-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getAllTeamMembersWithAccounts()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Supabase team fetch failed:', err.message)
    return NextResponse.json({ error: 'تعذر تحميل الفريق' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.name !== 'string' || !body.name.trim() || typeof body.role !== 'string' || !body.role.trim()) {
    return NextResponse.json({ error: 'الاسم والمسمى الوظيفي مطلوبان' }, { status: 400 })
  }

  try {
    const { account, ...memberData } = body
    const saved = await saveTeamMemberWithAccount(memberData, account)
    return NextResponse.json(saved, { status: 201 })
  } catch (err: any) {
    console.error('Supabase team insert failed:', err.message)
    return NextResponse.json({ error: err.message || 'تعذر حفظ عضو الفريق' }, { status: 500 })
  }
}
