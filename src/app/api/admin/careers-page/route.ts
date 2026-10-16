import { NextRequest, NextResponse } from 'next/server'
import { getCompanyPageContent, saveCompanyPageContent, DEFAULT_CAREERS_PAGE, CareersPageData } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_careers', DEFAULT_CAREERS_PAGE)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CareersPageData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    await saveCompanyPageContent('page_careers', body)
    return NextResponse.json({ success: true, message: 'تم حفظ محتوى صفحة التوظيف والمزايا بنجاح' })
  } catch (err: any) {
    console.error('Admin Careers Page save error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
