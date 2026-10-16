import { NextRequest, NextResponse } from 'next/server'
import { getManagedServiceContent, isValidServiceKey } from '@/lib/managed-services-server'

type RouteContext = { params: Promise<{ service: string }> }

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { service } = await params
  if (!isValidServiceKey(service)) return NextResponse.json({ error: 'الخدمة المطلوبة غير معروفة' }, { status: 404 })
  try {
    const result = await getManagedServiceContent(service)
    return NextResponse.json({
      content: { ...result.content, projects: result.content.projects.filter(project => project.published) },
      saved: result.saved,
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  } catch (error) {
    console.error(`Public managed service fetch failed (${service}):`, error)
    return NextResponse.json({ error: 'تعذر تحميل بيانات الخدمة من قاعدة البيانات' }, { status: 502 })
  }
}
