import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import type { UiuxDesign } from '@/data/uiux-designs'

type UiuxDesignRow = {
  id: string
  slug: string
  title: string
  title_en: string | null
  category: string
  summary: string
  description: string
  cover_image: string | null
  gallery: string[] | null
  tags: string[] | null
  features: string[] | null
  outcome: string | null
  accent_color: string | null
  video_url: string | null
  figma_url: string | null
  published: boolean
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_description: string | null
}

export async function getUiuxDesigns(): Promise<UiuxDesign[]> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const { data, error } = await getServerClient()
    .from('uiux_designs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`تعذر تحميل أعمال UI/UX: ${error.message}`)
  return ((data || []) as UiuxDesignRow[]).map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleEn: row.title_en || '',
    category: row.category,
    summary: row.summary,
    description: row.description,
    coverImage: row.cover_image || '',
    gallery: row.gallery || [],
    tags: row.tags || [],
    features: row.features || [],
    outcome: row.outcome || '',
    accentColor: row.accent_color || '#1F8A54',
    videoUrl: row.video_url || '',
    figmaUrl: row.figma_url || '',
    published: row.published,
    featured: row.featured,
    sortOrder: row.sort_order,
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
  }))
}

export async function saveUiuxDesign(design: UiuxDesign): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const { error } = await getServerClient()
    .from('uiux_designs')
    .upsert({
      id: design.id,
      slug: design.slug,
      title: design.title,
      title_en: design.titleEn,
      category: design.category,
      summary: design.summary,
      description: design.description,
      cover_image: design.coverImage,
      gallery: design.gallery,
      tags: design.tags,
      features: design.features,
      outcome: design.outcome,
      accent_color: design.accentColor,
      video_url: design.videoUrl,
      figma_url: design.figmaUrl,
      published: design.published,
      featured: design.featured,
      sort_order: design.sortOrder,
      seo_title: design.seoTitle,
      seo_description: design.seoDescription,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  if (error) throw new Error(`تعذر حفظ التصميم في Supabase: ${error.message}`)
}
