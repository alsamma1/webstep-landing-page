import { NextRequest, NextResponse } from 'next/server'
import { getGeoSettings, saveGeoSettings } from '@/lib/geo-server'
import type { GeoSettings } from '@/lib/geo'

export async function GET() {
  try {
    const data = await getGeoSettings()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Admin Geo GET error:', err)
    return NextResponse.json({ error: err.message || 'تعذر جلب الإعدادات الجغرافية' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    const settings = ((raw as any).settings && typeof (raw as any).settings === 'object') ? (raw as any).settings : raw
    await saveGeoSettings(settings as GeoSettings)
    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات الجغرافية ومعلومات التواصل والصور بنجاح في Supabase',
    })
  } catch (err: any) {
    console.error('Admin Geo POST error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
