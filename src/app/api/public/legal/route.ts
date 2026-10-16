import { NextRequest, NextResponse } from 'next/server'
import { getLegalPageContent } from '@/lib/legal-pages-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  if (type !== 'terms' && type !== 'privacy') {
    return NextResponse.json({ error: 'النوع غير صالح، يجب أن يكون terms أو privacy' }, { status: 400 })
  }

  try {
    const data = await getLegalPageContent(type)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
