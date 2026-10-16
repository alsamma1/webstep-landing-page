import { NextRequest, NextResponse } from 'next/server'
import { getCompanyPageContent, saveCompanyPageContent, DEFAULT_CONTACT_PAGE, ContactPageData } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_contact', DEFAULT_CONTACT_PAGE)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPageData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    await saveCompanyPageContent('page_contact', body)
    return NextResponse.json({ success: true, message: 'تم حفظ محتوى صفحة تواصل معنا والأسئلة الشائعة بنجاح' })
  } catch (err: any) {
    console.error('Admin Contact Page save error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
