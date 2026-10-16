import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MASTER_SEO_DATA, MASTER_YEMEN_SEO_DATA } from '@/lib/seo-keywords-data'
import { syncAllMasterSeoToSupabase, generatePageStructuredData } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function GET() {
  const masterList = Object.values(MASTER_SEO_DATA)

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      masterList.map((m) => ({
        page_slug: m.slug,
        title: m.title,
        description: m.description,
        keywords: m.keywords,
        og_title: m.og_title,
        og_description: m.og_description,
        og_image: m.og_image,
        canonical: m.canonical,
      }))
    )
  }

  try {
    const client = getServerClient()
    const { data, error } = await client
      .from('pages_seo')
      .select('*')
      .order('page_slug')

    if (error) {
      console.error('Supabase SEO fetch failed:', error.message)
      return NextResponse.json({ error: 'تعذر تحميل إعدادات SEO' }, { status: 502 })
    }

    const rows = (data || []) as Array<{ page_slug: string; [key: string]: any }>
    const existingMap = new Map(rows.map((r) => [r.page_slug, r]))

    // Merge with master defaults so all 17 pages are guaranteed to have full data & 100+ keywords
    const result = masterList.map((m) => {
      const dbRow = existingMap.get(m.slug)
      return {
        page_slug: m.slug,
        title: dbRow?.title || m.title,
        description: dbRow?.description || m.description,
        keywords: Array.isArray(dbRow?.keywords) && dbRow.keywords.length > 0 ? dbRow.keywords : m.keywords,
        og_title: dbRow?.og_title || m.og_title,
        og_description: dbRow?.og_description || m.og_description,
        og_image: dbRow?.og_image || m.og_image,
        canonical: dbRow?.canonical || m.canonical,
        schema_json: dbRow?.schema_json || generatePageStructuredData(m.slug),
        updated_at: dbRow?.updated_at || null,
      }
    })

    // Include any custom extra pages stored in DB
    const masterSlugs = new Set(masterList.map((m) => m.slug))
    const extraRows = rows.filter((r) => !masterSlugs.has(r.page_slug))

    return NextResponse.json([...result, ...extraRows])
  } catch (err: any) {
    console.error('SEO GET error:', err)
    return NextResponse.json({ error: err.message || 'حدث خطأ' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.page_slug !== 'string' || !body.page_slug.trim()) {
    return NextResponse.json({ error: 'معرّف الصفحة مطلوب' }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  try {
    const client = getServerClient()
    const payload = {
      page_slug: body.page_slug.trim(),
      title: body.title || null,
      description: body.description || null,
      keywords: Array.isArray(body.keywords) ? body.keywords : [],
      og_title: body.og_title || null,
      og_description: body.og_description || null,
      og_image: body.og_image || null,
      canonical: body.canonical || null,
      schema_json: body.schema_json || generatePageStructuredData(body.page_slug),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await client
      .from('pages_seo')
      .upsert(payload, { onConflict: 'page_slug' })
      .select()
      .single()

    if (error) {
      console.error('Supabase SEO save failed:', error.message)
      return NextResponse.json({ error: 'تعذر حفظ إعدادات SEO في Supabase' }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات الـ SEO بنجاح في قاعدة البيانات',
      data,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'خطأ أثناء الحفظ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { action, page_slug } = body

  if (action === 'sync_all') {
    const syncRes = await syncAllMasterSeoToSupabase()
    if (!syncRes.success) {
      return NextResponse.json({ error: syncRes.error }, { status: 500 })
    }
    return NextResponse.json({
      success: true,
      message: `تم مزامنة وحفظ جميع إعدادات الـ SEO لـ ${syncRes.count} صفحة في قاعدة البيانات Supabase مع أكثر من 100 كلمة مفتاحية لكل قسم!`,
    })
  }

  if (action === 'get_master_keywords' && page_slug) {
    const isYe = body.region === 'ye'
    const yemenConfig = MASTER_YEMEN_SEO_DATA[page_slug] || MASTER_YEMEN_SEO_DATA.home
    const saudiConfig = MASTER_SEO_DATA[page_slug] || MASTER_SEO_DATA.home
    const config = isYe && yemenConfig ? yemenConfig : saudiConfig

    const finalKeywords = isYe
      ? Array.from(new Set([...(yemenConfig?.keywords || []), ...(saudiConfig?.keywords || [])]))
      : saudiConfig.keywords

    return NextResponse.json({
      success: true,
      page_slug,
      region: body.region || 'sa',
      keywords: finalKeywords,
      count: finalKeywords.length,
      faq: config.faq || [],
      schema: generatePageStructuredData(page_slug, isYe ? 'ye' : 'sa'),
      suggestedTitle: isYe ? yemenConfig?.title : saudiConfig?.title,
      suggestedDescription: isYe ? yemenConfig?.description : saudiConfig?.description,
    })
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
}
