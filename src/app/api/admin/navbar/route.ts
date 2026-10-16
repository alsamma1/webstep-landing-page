import { NextRequest, NextResponse } from 'next/server'
import { getNavbarConfig, saveNavbarConfig } from '@/lib/navbar-server'
import type { NavbarConfig } from '@/lib/navbar-types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getNavbarConfig()
    return NextResponse.json(config)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NavbarConfig
    if (!body || !Array.isArray(body.navItems)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }

    const saved = await saveNavbarConfig(body)
    return NextResponse.json({ success: true, config: saved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
