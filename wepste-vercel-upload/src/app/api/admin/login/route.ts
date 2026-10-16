import { NextRequest, NextResponse } from 'next/server'
import { authenticateAnyUser } from '@/lib/team-server'

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
  }

  const { username, password } = body || {}
  if (!username || !password) {
    return NextResponse.json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' }, { status: 400 })
  }

  const authResult = await authenticateAnyUser(username, password)

  if (!authResult.success || !authResult.user) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة، أو الحساب غير مفعّل' }, { status: 401 })
  }

  const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'wepstep-admin-secret-2025'

  const res = NextResponse.json({
    success: true,
    user: {
      name: authResult.user.name,
      username: authResult.user.username,
      role: authResult.user.role,
      roleTitle: authResult.user.roleTitle,
      permissions: authResult.user.permissions,
      isSuperAdmin: authResult.user.isSuperAdmin,
    },
  })

  // Set the admin_session cookie that middleware checks
  res.cookies.set('admin_session', SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  // Set admin_user_profile for frontend layout & permissions display
  res.cookies.set('admin_user_profile', encodeURIComponent(JSON.stringify(authResult.user)), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return res
}
