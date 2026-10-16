import { NextResponse } from 'next/server'
import { getCompanyPageContent, DEFAULT_ORDER_PAGE } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_order', DEFAULT_ORDER_PAGE)
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
