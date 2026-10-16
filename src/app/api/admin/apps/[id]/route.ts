import { NextRequest, NextResponse } from 'next/server'
import { parseMobileApp } from '@/data/mobile-apps'
import { getMobileAppsCatalog, saveMobileAppsCatalog } from '@/lib/mobile-apps-server'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }

  const parsed = parseMobileApp(body)
  if (!parsed.success || parsed.data.id !== id) {
    return NextResponse.json({ error: 'بيانات التطبيق غير صالحة' }, { status: 400 })
  }

  try {
    const catalog = await getMobileAppsCatalog()
    const index = catalog.apps.findIndex(app => app.id === id)
    if (index < 0) return NextResponse.json({ error: 'التطبيق غير موجود' }, { status: 404 })
    if (catalog.apps.some(app => app.id !== id && app.slug === parsed.data.slug)) {
      return NextResponse.json({ error: 'معرّف التطبيق مستخدم بالفعل' }, { status: 409 })
    }
    const apps = [...catalog.apps]
    apps[index] = parsed.data
    await saveMobileAppsCatalog(apps.sort((a, b) => a.sortOrder - b.sortOrder))
    return NextResponse.json({ app: parsed.data })
  } catch (error) {
    console.error('Admin mobile app update failed:', error)
    return NextResponse.json({ error: 'تعذر تحديث التطبيق في قاعدة البيانات' }, { status: 502 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  try {
    const catalog = await getMobileAppsCatalog()
    const apps = catalog.apps.filter(app => app.id !== id)
    if (apps.length === catalog.apps.length) {
      return NextResponse.json({ error: 'التطبيق غير موجود' }, { status: 404 })
    }
    await saveMobileAppsCatalog(apps)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin mobile app delete failed:', error)
    return NextResponse.json({ error: 'تعذر حذف التطبيق من قاعدة البيانات' }, { status: 502 })
  }
}
