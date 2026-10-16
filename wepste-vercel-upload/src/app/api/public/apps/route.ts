import { NextResponse } from 'next/server'
import { getMobileAppsCatalog } from '@/lib/mobile-apps-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { apps, saved } = await getMobileAppsCatalog()
    return NextResponse.json(
      { apps: apps.filter(app => app.published), saved },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (error) {
    console.error('Public mobile app catalog fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل التطبيقات المنشورة' }, { status: 502 })
  }
}
