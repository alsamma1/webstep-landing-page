import { NextResponse } from 'next/server'
import { getHomepageData } from '@/lib/homepage-server'

export async function GET() {
  const data = await getHomepageData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
