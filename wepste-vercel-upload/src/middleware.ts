import { NextRequest, NextResponse } from 'next/server'

// Pages that don't need authentication
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/order',
  '/careers',
  '/blog',
  '/privacy',
  '/terms',
  '/services',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminApi = pathname.startsWith('/api/admin/')

  if (!pathname.startsWith('/admin') && !isAdminApi) return NextResponse.next()

  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout'
  ) return NextResponse.next()

  const session = req.cookies.get('admin_session')?.value
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'wepstep-admin-secret-2025'

  if (!session || session !== sessionSecret) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول للوصول إلى لوحة الإدارة' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
