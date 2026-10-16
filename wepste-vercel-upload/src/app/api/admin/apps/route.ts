import { NextRequest, NextResponse } from 'next/server'
import { parseMobileApp } from '@/data/mobile-apps'
import { getMobileAppsCatalog, saveMobileAppsCatalog } from '@/lib/mobile-apps-server'

export async function GET() {
  try {
    return NextResponse.json(await getMobileAppsCatalog())
  } catch (error) {
    console.error('Admin mobile app catalog fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل كتالوج التطبيقات' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }

  const parsed = parseMobileApp(body)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من حقول التطبيق قبل الحفظ',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }

  try {
    const catalog = await getMobileAppsCatalog()
    if (catalog.apps.some(app => app.slug === parsed.data.slug)) {
      return NextResponse.json({ error: 'معرّف التطبيق مستخدم بالفعل' }, { status: 409 })
    }
    const apps = [...catalog.apps, parsed.data].sort((a, b) => a.sortOrder - b.sortOrder)
    await saveMobileAppsCatalog(apps)
    return NextResponse.json({ app: parsed.data }, { status: 201 })
  } catch (error) {
    console.error('Admin mobile app create failed:', error)
    return NextResponse.json({ error: 'تعذر إضافة التطبيق إلى قاعدة البيانات' }, { status: 502 })
  }
}
