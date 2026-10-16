import { z } from 'zod'

const httpUrl = z.union([z.literal(''), z.string().url().max(2048)])
  .refine(value => !value || /^https?:\/\//i.test(value), 'يجب أن يكون الرابط HTTP أو HTTPS')

export const uiuxDesignSchema = z.object({
  id: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(180),
  titleEn: z.string().trim().max(180),
  category: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().min(20).max(8000),
  coverImage: httpUrl,
  gallery: z.array(z.string().url().max(2048)).max(30),
  tags: z.array(z.string().trim().min(1).max(60)).max(30),
  features: z.array(z.string().trim().min(1).max(300)).max(40),
  outcome: z.string().trim().max(300),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  videoUrl: httpUrl.refine(value => !value || Boolean(getYouTubeEmbedUrl(value)), 'أدخل رابط فيديو YouTube صحيحاً'),
  figmaUrl: httpUrl,
  published: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
}).strict()

export type UiuxDesign = z.infer<typeof uiuxDesignSchema>

export function parseUiuxDesign(value: unknown) {
  return uiuxDesignSchema.safeParse(value)
}

export function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value)
    let videoId = ''
    if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
      videoId = url.pathname.slice(1)
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      videoId = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1] || ''
    }
    return /^[\w-]{11}$/.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null
  } catch {
    return null
  }
}
