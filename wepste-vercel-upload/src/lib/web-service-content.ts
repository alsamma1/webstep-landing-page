import { z } from 'zod'
import { DEFAULT_WEB_SERVICE_CONTENT } from '@/data/web-service-page'
import type { Json } from '@/lib/supabase.types'

const text = z.string().max(10000)
const icon = z.enum([
  'Globe', 'Zap', 'Palette', 'Smartphone', 'Search', 'MessageCircle',
  'Settings', 'Shield', 'User', 'Briefcase', 'FolderOpen', 'Send',
  'Rocket', 'Headphones',
])

const projectSchema = z.object({
  id: z.string().min(1).max(100),
  name: text,
  category: text,
  categoryKey: z.enum(['personal', 'business', 'portfolio']),
  role: text,
  tagline: text,
  url: z.string().url().refine(value => ['https:', 'http:'].includes(new URL(value).protocol)),
  displayUrl: text,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  package: text,
  stats: z.object({ speed: text, visits: text, rating: text }).strict(),
  features: z.array(text).max(30),
  heroTitle: text,
  heroSub: text,
  badge: text,
}).strict()

export const webServiceContentSchema = z.object({
  hero: z.object({
    badge: text,
    titleStart: text,
    titleHighlight: text,
    titleEnd: text,
    description: text,
    browserAddress: text,
    proofBadges: z.array(text).max(20),
  }).strict(),
  sectionCopy: z.record(text),
  stats: z.array(z.object({ value: text, label: text }).strict()).max(20),
  plans: z.array(z.object({
    id: z.string().min(1).max(100),
    name: text,
    price: z.number().min(0).max(10000000),
    delivery: text,
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    hot: z.boolean(),
    features: z.array(text).max(50),
  }).strict()).max(30),
  features: z.array(z.object({ icon, title: text, desc: text }).strict()).max(50),
  kinds: z.array(z.object({
    icon,
    title: text,
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    desc: text,
    items: z.array(text).max(30),
  }).strict()).max(30),
  steps: z.array(z.object({
    num: text,
    title: text,
    desc: text,
    icon,
  }).strict()).max(30),
  projects: z.array(projectSchema).max(50),
  reviews: z.array(z.object({ initial: text, name: text, role: text, text }).strict()).max(50),
  faqs: z.array(z.object({ question: text, answer: text }).strict()).max(100),
  comparison: z.array(z.object({
    label: text,
    values: z.array(z.union([z.boolean(), text])).max(30),
  }).strict()).max(100),
  marquee: z.array(z.object({ icon, text }).strict()).max(50),
}).strict()

export type ValidatedWebServiceContent = z.infer<typeof webServiceContentSchema>

export function getDefaultWebServiceContent(): ValidatedWebServiceContent {
  return structuredClone(DEFAULT_WEB_SERVICE_CONTENT)
}

export function parseWebServiceContent(value: unknown) {
  const defaults = getDefaultWebServiceContent()
  const stored = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const storedCopy = stored.sectionCopy && typeof stored.sectionCopy === 'object' && !Array.isArray(stored.sectionCopy)
    ? stored.sectionCopy as Record<string, unknown>
    : {}

  return webServiceContentSchema.safeParse({
    ...defaults,
    ...stored,
    sectionCopy: { ...defaults.sectionCopy, ...storedCopy },
  })
}

export function isJsonValue(value: unknown): value is Json {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true
  }
  if (Array.isArray(value)) return value.every(isJsonValue)
  if (typeof value !== 'object') return false
  return Object.values(value).every(isJsonValue)
}
