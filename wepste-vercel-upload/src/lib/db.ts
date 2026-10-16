/**
 * WebStep Database Layer
 * Simple JSON-file based database for the admin panel.
 * Stores data in /data/db/ directory.
 */

import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data', 'db')

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

function dbPath(name: string) {
  return path.join(DB_DIR, `${name}.json`)
}

function readDB<T>(name: string, defaultValue: T): T {
  const p = dbPath(name)
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(defaultValue, null, 2), 'utf-8')
    return defaultValue
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

function writeDB<T>(name: string, data: T): void {
  fs.writeFileSync(dbPath(name), JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Types ───────────────────────────────────────────────

export interface Order {
  id: string
  createdAt: string
  status: 'new' | 'in_progress' | 'completed' | 'cancelled'
  service: string
  name: string
  phone: string
  email?: string
  company?: string
  budget?: string
  timeline?: string
  notes?: string
  answers?: Record<string, string | string[]>
  region?: 'ye' | 'sa' | 'global'
}

export interface BlogPost {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage?: string
  published: boolean
  author: string
  readTime: number
  views: number
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  image?: string
  url?: string
  featured: boolean
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  skills: string[]
  linkedin?: string
  twitter?: string
  email?: string
  active: boolean
  sort_order?: number
}

export interface Job {
  id: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  description: string
  requirements: string[]
  urgent: boolean
  active: boolean
  createdAt: string
  applications: number
}

export interface SiteSettings {
  siteName: string
  siteUrl: string
  email: string
  phone: string
  whatsapp: string
  address: string
  logo?: string
  primaryColor: string
  socialLinks: {
    instagram?: string
    twitter?: string
    linkedin?: string
    tiktok?: string
  }
  seoTitle: string
  seoDescription: string
  maintenanceMode: boolean
  allowOrders: boolean
}

export interface Message {
  id: string
  createdAt: string
  name: string
  phone: string
  email?: string
  subject: string
  message: string
  read: boolean
  replied: boolean
}

// ─── Default Data ─────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'WebStep',
  siteUrl: 'https://wepste.com',
  email: 'hello@wepstep.sa',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  primaryColor: '#1F8A54',
  socialLinks: {},
  seoTitle: 'WebStep — موقعك الذي تمثّلك | تطوير مواقع وتطبيقات احترافية',
  seoDescription: 'ويب ستيب متخصصة في بناء مواقع ويب وتطبيقات جوال احترافية للسوق السعودي والخليجي. دفعة واحدة بدون رسوم شهرية.',
  maintenanceMode: false,
  allowOrders: true,
}

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'new',
    service: 'موقع ويب احترافي',
    name: 'خالد المنصور',
    phone: '+966501234567',
    email: 'khalid@example.com',
    company: 'شركة المنصور للتجارة',
    budget: '٣,٠٠٠ – ٦,٠٠٠ ر.س',
    timeline: 'عادي (١-٣ أشهر)',
    notes: 'أريد موقع احترافي لشركتي مع صفحة هبوط للمنتجات',
    answers: { website_type: 'موقع شركة / عمل', pages_count: '٤-٨ صفحات (متوسط)' },
  },
  {
    id: 'ORD-002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'in_progress',
    service: 'متجر إلكتروني',
    name: 'نورة العتيبي',
    phone: '+966509876543',
    budget: '٣,٠٠٠ – ٧,٠٠٠ ر.س',
    timeline: 'عاجل (أقل من شهر)',
    notes: 'متجر ملابس نسائية مع دفع Mada و STC Pay',
  },
  {
    id: 'ORD-003',
    createdAt: new Date().toISOString(),
    status: 'new',
    service: 'تسويق رقمي',
    name: 'سعد الغامدي',
    phone: '+966555000111',
    company: 'مطعم البيت',
    budget: '٣,٥٠٠ – ٨,٠٠٠ ر.س/شهر',
    timeline: 'مرن (لا يهم)',
  },
]

// ─── Database API ─────────────────────────────────────────

export const db = {
  // Orders
  orders: {
    getAll: (): Order[] => readDB<Order[]>('orders', SEED_ORDERS),
    getById: (id: string): Order | undefined => readDB<Order[]>('orders', SEED_ORDERS).find(o => o.id === id),
    create: (order: Omit<Order, 'id' | 'createdAt'>): Order => {
      const orders = readDB<Order[]>('orders', SEED_ORDERS)
      const newOrder: Order = {
        ...order,
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      }
      writeDB('orders', [newOrder, ...orders])
      return newOrder
    },
    update: (id: string, data: Partial<Order>): Order | null => {
      const orders = readDB<Order[]>('orders', SEED_ORDERS)
      const idx = orders.findIndex(o => o.id === id)
      if (idx === -1) return null
      orders[idx] = { ...orders[idx], ...data }
      writeDB('orders', orders)
      return orders[idx]
    },
    delete: (id: string): boolean => {
      const orders = readDB<Order[]>('orders', SEED_ORDERS)
      const filtered = orders.filter(o => o.id !== id)
      writeDB('orders', filtered)
      return filtered.length < orders.length
    },
  },

  // Blog
  blog: {
    getAll: (): BlogPost[] => readDB<BlogPost[]>('blog', []),
    getBySlug: (slug: string): BlogPost | undefined => readDB<BlogPost[]>('blog', []).find(p => p.slug === slug),
    create: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>): BlogPost => {
      const posts = readDB<BlogPost[]>('blog', [])
      const newPost: BlogPost = {
        ...post,
        id: `POST-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
      }
      writeDB('blog', [newPost, ...posts])
      return newPost
    },
    update: (id: string, data: Partial<BlogPost>): BlogPost | null => {
      const posts = readDB<BlogPost[]>('blog', [])
      const idx = posts.findIndex(p => p.id === id)
      if (idx === -1) return null
      posts[idx] = { ...posts[idx], ...data, updatedAt: new Date().toISOString() }
      writeDB('blog', posts)
      return posts[idx]
    },
    delete: (id: string): boolean => {
      const posts = readDB<BlogPost[]>('blog', [])
      const filtered = posts.filter(p => p.id !== id)
      writeDB('blog', filtered)
      return filtered.length < posts.length
    },
  },

  // Projects
  projects: {
    getAll: (): Project[] => readDB<Project[]>('projects', []),
    create: (project: Omit<Project, 'id' | 'createdAt'>): Project => {
      const projects = readDB<Project[]>('projects', [])
      const newProject: Project = { ...project, id: `PROJ-${Date.now()}`, createdAt: new Date().toISOString() }
      writeDB('projects', [newProject, ...projects])
      return newProject
    },
    update: (id: string, data: Partial<Project>): Project | null => {
      const projects = readDB<Project[]>('projects', [])
      const idx = projects.findIndex(p => p.id === id)
      if (idx === -1) return null
      projects[idx] = { ...projects[idx], ...data }
      writeDB('projects', projects)
      return projects[idx]
    },
    delete: (id: string): boolean => {
      const projects = readDB<Project[]>('projects', [])
      const filtered = projects.filter(p => p.id !== id)
      writeDB('projects', filtered)
      return filtered.length < projects.length
    },
  },

  // Team
  team: {
    getAll: (): TeamMember[] => readDB<TeamMember[]>('team', []),
    create: (member: Omit<TeamMember, 'id'>): TeamMember => {
      const team = readDB<TeamMember[]>('team', [])
      const newMember: TeamMember = { ...member, id: `TEAM-${Date.now()}` }
      writeDB('team', [...team, newMember])
      return newMember
    },
    update: (id: string, data: Partial<TeamMember>): TeamMember | null => {
      const team = readDB<TeamMember[]>('team', [])
      const idx = team.findIndex(m => m.id === id)
      if (idx === -1) return null
      team[idx] = { ...team[idx], ...data }
      writeDB('team', team)
      return team[idx]
    },
    delete: (id: string): boolean => {
      const team = readDB<TeamMember[]>('team', [])
      const filtered = team.filter(m => m.id !== id)
      writeDB('team', filtered)
      return filtered.length < team.length
    },
  },

  // Jobs
  jobs: {
    getAll: (): Job[] => readDB<Job[]>('jobs', []),
    create: (job: Omit<Job, 'id' | 'createdAt' | 'applications'>): Job => {
      const jobs = readDB<Job[]>('jobs', [])
      const newJob: Job = { ...job, id: `JOB-${Date.now()}`, createdAt: new Date().toISOString(), applications: 0 }
      writeDB('jobs', [newJob, ...jobs])
      return newJob
    },
    update: (id: string, data: Partial<Job>): Job | null => {
      const jobs = readDB<Job[]>('jobs', [])
      const idx = jobs.findIndex(j => j.id === id)
      if (idx === -1) return null
      jobs[idx] = { ...jobs[idx], ...data }
      writeDB('jobs', jobs)
      return jobs[idx]
    },
    delete: (id: string): boolean => {
      const jobs = readDB<Job[]>('jobs', [])
      const filtered = jobs.filter(j => j.id !== id)
      writeDB('jobs', filtered)
      return filtered.length < jobs.length
    },
  },

  // Messages
  messages: {
    getAll: (): Message[] => readDB<Message[]>('messages', []),
    create: (msg: Omit<Message, 'id' | 'createdAt' | 'read' | 'replied'>): Message => {
      const messages = readDB<Message[]>('messages', [])
      const newMsg: Message = { ...msg, id: `MSG-${Date.now()}`, createdAt: new Date().toISOString(), read: false, replied: false }
      writeDB('messages', [newMsg, ...messages])
      return newMsg
    },
    markRead: (id: string) => {
      const messages = readDB<Message[]>('messages', [])
      const idx = messages.findIndex(m => m.id === id)
      if (idx !== -1) { messages[idx].read = true; writeDB('messages', messages) }
    },
    update: (id: string, data: Partial<Message>): Message | null => {
      const messages = readDB<Message[]>('messages', [])
      const idx = messages.findIndex(m => m.id === id)
      if (idx === -1) return null
      messages[idx] = { ...messages[idx], ...data }
      writeDB('messages', messages)
      return messages[idx]
    },
    delete: (id: string): boolean => {
      const messages = readDB<Message[]>('messages', [])
      const filtered = messages.filter(m => m.id !== id)
      writeDB('messages', filtered)
      return filtered.length < messages.length
    },
  },

  // Settings
  settings: {
    get: (): SiteSettings => readDB<SiteSettings>('settings', DEFAULT_SETTINGS),
    update: (data: Partial<SiteSettings>): SiteSettings => {
      const current = readDB<SiteSettings>('settings', DEFAULT_SETTINGS)
      const updated = { ...current, ...data }
      writeDB('settings', updated)
      return updated
    },
  },

  // Analytics (simple counters)
  analytics: {
    get: () => readDB('analytics', {
      totalOrders: 0,
      totalViews: 0,
      thisMonthOrders: 0,
      conversionRate: 0,
      topServices: [] as { service: string; count: number }[],
    }),
    increment: (key: string) => {
      const data = readDB<Record<string, number>>('analytics', {})
      data[key] = (data[key] || 0) + 1
      writeDB('analytics', data)
    },
  },
}
