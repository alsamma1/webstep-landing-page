import { NextResponse } from 'next/server'
import { getCompanyPageContent, DEFAULT_CONTACT_PAGE } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_contact', DEFAULT_CONTACT_PAGE)
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
