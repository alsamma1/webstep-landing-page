import { NextRequest, NextResponse } from 'next/server'
import { getLegalPageContent, saveLegalPageContent, LegalPageData } from '@/lib/legal-pages-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  if (type !== 'terms' && type !== 'privacy') {
    return NextResponse.json({ error: 'النوع غير صالح، يجب أن يكون terms أو privacy' }, { status: 400 })
  }

  try {
    const data = await getLegalPageContent(type)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type !== 'terms' && type !== 'privacy') {
      return NextResponse.json({ error: 'النوع غير صالح، يجب أن يكون terms أو privacy' }, { status: 400 })
    }

    if (!data || !Array.isArray(data.sections)) {
      return NextResponse.json({ error: 'بيانات غير صالحة أو قائمة البنود مفقودة' }, { status: 400 })
    }

    const saved = await saveLegalPageContent(type, data as LegalPageData)
    return NextResponse.json({
      success: true,
      message: type === 'terms' ? 'تم حفظ الشروط والأحكام بنجاح' : 'تم حفظ سياسة الخصوصية بنجاح',
      data: saved,
    })
  } catch (err: any) {
    console.error('Admin legal save error:', err)
    return NextResponse.json({ error: err.message || 'حدث خطأ أثناء الحفظ' }, { status: 500 })
  }
}
