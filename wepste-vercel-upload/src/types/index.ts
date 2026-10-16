// ============================================================
// WebStep — Type Definitions
// ============================================================

export interface Service {
  id: string
  icon: string
  title: string
  titleEn: string
  description: string
  features: string[]
  href?: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  technologies: string[]
  image: string
  href?: string
  featured?: boolean
  year?: number
}

export type ProjectCategory =
  | 'website'
  | 'app'
  | 'ecommerce'
  | 'landing'
  | 'system'
  | 'uiux'

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: string
}

export interface WhyItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface SocialLink {
  platform: string
  href: string
  icon: string
}

export interface ContactFormData {
  name: string
  phone: string
  email: string
  projectType: string
  budget: string
  description: string
  deadline?: string
  attachment?: File
}

export interface OrderRecord {
  id?: string
  name: string
  phone: string
  email: string
  project_type: string
  budget: string
  description: string
  deadline?: string
  attachment_url?: string
  status: OrderStatus
  created_at?: string
}

export type OrderStatus =
  | 'pending'
  | 'reviewing'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SiteSettings {
  siteName: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  socialLinks: SocialLink[]
  heroTitle: string
  heroSubtitle: string
}

export type CharacterState =
  | 'idle'
  | 'welcome'
  | 'wave'
  | 'look'
  | 'point'
  | 'walk'
  | 'thinking'
  | 'success'
  | 'excited'

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export type Theme = 'light' | 'dark' | 'system'
