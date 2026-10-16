import { NextRequest, NextResponse } from 'next/server'
import { getCompanyPageContent, saveCompanyPageContent, DEFAULT_ORDER_PAGE, OrderPageData } from '@/lib/company-pages-server'

export async function GET() {
  const data = await getCompanyPageContent('page_order', DEFAULT_ORDER_PAGE)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderPageData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    await saveCompanyPageContent('page_order', body)
    return NextResponse.json({ success: true, message: 'تم حفظ إعدادات ونموذج الطلب بنجاح' })
  } catch (err: any) {
    console.error('Admin Order Settings save error:', err)
    return NextResponse.json({ error: err.message || 'تعذر الحفظ في قاعدة البيانات' }, { status: 500 })
  }
}
