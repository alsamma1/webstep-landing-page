import { NextResponse } from 'next/server'
import { getNavbarConfig } from '@/lib/navbar-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const config = await getNavbarConfig()
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
