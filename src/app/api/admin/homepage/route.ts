import { NextRequest, NextResponse } from 'next/server'
import { getHomepageData, saveHomepageData, type HomepageData } from '@/lib/homepage-server'

export async function GET() {
  const data = await getHomepageData()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HomepageData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    await saveHomepageData(body)
    return NextResponse.json({ success: true, message: 'تم حفظ محتوى وترتيب أقسام الصفحة الرئيسية بنجاح في Supabase' })
  } catch (err: any) {
    console.error('Admin homepage save error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
