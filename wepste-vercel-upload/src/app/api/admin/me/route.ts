import { NextRequest, NextResponse } from 'next/server'
import { getStoredAccount } from '@/lib/account'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getTeamAccountsMap, getAllTeamMembersWithAccounts } from '@/lib/team-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const sessionUserCookie = req.cookies.get('admin_user_profile')?.value

  if (sessionUserCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionUserCookie))
      if (parsed && parsed.name) {
        return NextResponse.json(parsed)
      }
    } catch (e) {}
  }

  // Default fallback is Super Admin
  const stored = getStoredAccount()
  return NextResponse.json({
    id: 'super_admin',
    name: stored.name || 'المدير العام',
    username: stored.username || 'admin',
    email: stored.email || 'admin@wepstep.sa',
    role: 'super_admin',
    roleTitle: 'المدير العام',
    permissions: ['all'],
    isSuperAdmin: true,
  })
}
