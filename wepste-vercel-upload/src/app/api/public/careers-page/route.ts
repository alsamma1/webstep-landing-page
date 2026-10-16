import { NextResponse } from 'next/server'
import { getCompanyPageContent, DEFAULT_CAREERS_PAGE } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_careers', DEFAULT_CAREERS_PAGE)
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
