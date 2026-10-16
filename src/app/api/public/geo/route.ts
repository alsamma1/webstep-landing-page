import { NextRequest, NextResponse } from 'next/server'
import { getGeoSettings } from '@/lib/geo-server'
import type { RegionCode } from '@/lib/geo'

export async function GET(req: NextRequest) {
  try {
    const geoSettings = await getGeoSettings()

    // 1. Detect country from headers (Vercel, Cloudflare, etc.)
    const country = (
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      ''
    ).toUpperCase()

    // 2. Check query param ?region=ye or ?region=sa if requested
    const queryRegion = req.nextUrl.searchParams.get('region') as RegionCode | null

    let detectedRegion: RegionCode = 'sa'
    if (queryRegion === 'ye' || queryRegion === 'sa') {
      detectedRegion = queryRegion
    } else if (country === 'YE') {
      detectedRegion = 'ye'
    } else if (country === 'SA') {
      detectedRegion = 'sa'
    }

    return NextResponse.json({
      detectedRegion,
      detectedCountry: country || null,
      settings: geoSettings,
      activeContact: detectedRegion === 'ye' ? geoSettings.yemen : geoSettings.saudi,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err: any) {
    console.error('Public Geo API error:', err)
    return NextResponse.json({ error: err.message || 'Error loading geo data' }, { status: 500 })
  }
}
