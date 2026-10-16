import { NextRequest, NextResponse } from 'next/server'
import { getCompanyPageContent, saveCompanyPageContent, DEFAULT_ABOUT_PAGE, AboutPageData } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_about', DEFAULT_ABOUT_PAGE)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AboutPageData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    await saveCompanyPageContent('page_about', body)
    return NextResponse.json({ success: true, message: 'تم حفظ محتوى صفحة من نحن بنجاح' })
  } catch (err: any) {
    console.error('Admin About save error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
