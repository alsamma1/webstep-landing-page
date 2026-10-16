import { NextResponse } from 'next/server'
import { getLandingServiceContent } from '@/lib/landing-service-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await getLandingServiceContent()
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Public landing service content fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل محتوى صفحات الهبوط' }, { status: 502 })
  }
}
