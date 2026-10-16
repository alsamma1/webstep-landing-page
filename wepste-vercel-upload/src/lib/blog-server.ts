import { cache } from 'react'
import { getServerClient, isSupabaseConfigured } from './supabase-server'
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost, type BlogSection } from '@/data/blog'
import type { ContentBlock } from './supabase.types'

const CATEGORY_MAP: Record<string, BlogPost['categoryKey']> = {
  'تطوير المواقع والأنظمة': 'web',
  'تطوير الويب': 'web',
  'أنظمة وSaaS': 'web',
  'نصائح تقنية': 'web',
  'السيو والذكاء الاصطناعي': 'ai-seo',
  'تسويق رقمي': 'ai-seo',
  'تصميم واجهات UI/UX': 'uiux',
  'تصميم UI/UX': 'uiux',
  'استراتيجيات ونمو الأعمال': 'business',
  'أعمال': 'business',
  'ملفات الأعمال والصفحات الشخصية': 'portfolio',
  'بورتفوليو': 'portfolio',
  'عام': 'web',
}

const GRADIENT_MAP: Record<string, { gradient: string; accent: string }> = {
  'web': { gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)', accent: '#10b981' },
  'ai-seo': { gradient: 'linear-gradient(135deg, #083344 0%, #155e75 50%, #0e7490 100%)', accent: '#06b6d4' },
  'uiux': { gradient: 'linear-gradient(135deg, #4c0519 0%, #831843 50%, #9d174d 100%)', accent: '#ec4899' },
  'business': { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)', accent: '#6366f1' },
  'portfolio': { gradient: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #5b21b6 100%)', accent: '#8b5cf6' },
}

export function formatDbPostToBlogPost(p: Record<string, any>): BlogPost {
  const catKey = CATEGORY_MAP[String(p.category || '')] || 'web'
  const colors = GRADIENT_MAP[catKey] || GRADIENT_MAP['web']

  const rawSections: BlogSection[] = []
  if (p.content) {
    const rawParagraphs = String(p.content).split('\n\n').filter(Boolean)
    let currentTitle = 'محتوى المقال'
    let currentContent: string[] = []

    for (const chunk of rawParagraphs) {
      if (chunk.startsWith('## ') || chunk.startsWith('# ')) {
        if (currentContent.length > 0) {
          rawSections.push({ title: currentTitle, content: currentContent })
          currentContent = []
        }
        currentTitle = chunk.replace(/^#+\s*/, '')
      } else {
        currentContent.push(chunk)
      }
    }
    if (currentContent.length > 0) {
      rawSections.push({ title: currentTitle, content: currentContent })
    }
  }

  const dateObj = p.created_at ? new Date(p.created_at) : new Date()
  const dateDisplay = dateObj.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    id: String(p.id || ''),
    slug: String(p.slug || ''),
    title: String(p.title || ''),
    excerpt: String(p.excerpt || ''),
    category: String(p.category || 'تطوير المواقع والأنظمة'),
    categoryKey: catKey,
    author: {
      name: String(p.author || 'فريق WebStep'),
      role: String(p.author_role || 'فريق التحرير التقني'),
      avatar: String(p.author_avatar || '/assets/logo/logo.png'),
    },
    date: String(p.created_at || new Date().toISOString()),
    dateDisplay: dateDisplay,
    readTime: `${p.read_time || 5} دقائق`,
    views: `${(Number(p.views) || 0).toLocaleString('ar')}`,
    likes: Number(p.likes) || 0,
    coverGradient: colors.gradient,
    accentColor: colors.accent,
    featured: Boolean(p.featured),
    hasVideo: Boolean(p.video_url),
    videoUrl: p.video_url || undefined,
    videoDuration: p.video_url ? 'فيديو شرح' : undefined,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['تقنية', 'WebStep'],
    seoKeywords: Array.isArray(p.seo_keywords) ? p.seo_keywords : [],
    metaDescription: String(p.seo_description || p.excerpt || ''),
    cover_image: p.cover_image || undefined,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    content: p.content || '',
    content_blocks: Array.isArray(p.content_blocks) ? (p.content_blocks as ContentBlock[]) : [],
    sections: rawSections.length > 0 ? rawSections : [
      {
        title: 'تفاصيل المقال',
        content: [p.excerpt || p.title || '']
      }
    ],
  }
}

/**
 * Fetch all published blog posts from Supabase (ordered newest first)
 * Falls back to BLOG_POSTS if Supabase is unavailable.
 */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return BLOG_POSTS
  }

  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return BLOG_POSTS
    }

    return data.map(formatDbPostToBlogPost)
  } catch (err) {
    console.error('getPublishedBlogPosts error:', err)
    return BLOG_POSTS
  }
}

/**
 * Fetch single blog post by slug with React cache to prevent duplicate queries
 * between generateMetadata and Page component
 */
export const getCachedBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | undefined> => {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()

      if (!error && data) {
        return formatDbPostToBlogPost(data)
      }
    } catch (err) {
      console.error('getCachedBlogPostBySlug DB error:', err)
    }
  }

  // Fallback to static data
  return BLOG_POSTS.find(p => p.slug === slug)
})

/**
 * Fetch all slugs for generateStaticParams
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const set = new Set<string>()

  // From static list
  BLOG_POSTS.forEach(p => set.add(p.slug))

  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerClient()
      const { data } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('published', true)

      if (data) {
        data.forEach((item: any) => {
          if (item.slug) set.add(item.slug)
        })
      }
    } catch (e) {
      console.error('getAllBlogSlugs error:', e)
    }
  }

  return Array.from(set)
}

/**
 * Get related posts from Supabase or fallback
 */
export async function getRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPost[]> {
  const allPosts = await getPublishedBlogPosts()
  return allPosts
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => (a.category === category || a.categoryKey === category ? -1 : 1))
    .slice(0, limit)
}
