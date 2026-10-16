import { NextResponse } from 'next/server'
import { getUiuxDesigns } from '@/lib/uiux-designs-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const designs = (await getUiuxDesigns()).filter(design => design.published)
    return NextResponse.json({ designs }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Public UI/UX portfolio fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل أعمال التصميم' }, { status: 502 })
  }
}
