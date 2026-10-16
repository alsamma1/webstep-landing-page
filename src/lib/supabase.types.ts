// WebStep — Supabase TypeScript Types
// Auto-generated from schema — update when schema changes

// ─── Content Block Types (للمحتوى الغني في المقالات) ───────────
export type ContentBlockType = 'heading' | 'paragraph' | 'image' | 'gallery' | 'quote' | 'list' | 'video' | 'divider' | 'link'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ContentBlock {
  id: string
  type: ContentBlockType
  // heading
  level?: 2 | 3 | 4
  text?: string
  // paragraph / quote
  content?: string
  // image / gallery
  url?: string
  urls?: string[]
  caption?: string
  alt?: string
  position?: 'full' | 'left' | 'right' | 'center'
  // list
  items?: string[]
  ordered?: boolean
  // link
  href?: string
  label?: string
  internal?: boolean
  // video
  videoUrl?: string
}

type ManagedServiceContentTable<Key extends string> = {
  Row: { service_key: Key; content: Json; updated_at: string }
  Insert: { service_key: Key; content: Json; updated_at?: string }
  Update: { service_key?: Key; content?: Json; updated_at?: string }
}

export interface Database {
  public: {
    Tables: {
      ecommerce_service_content: ManagedServiceContentTable<'ecommerce'>
      systems_service_content: ManagedServiceContentTable<'systems'>
      marketing_service_content: ManagedServiceContentTable<'marketing'>
      support_service_content: ManagedServiceContentTable<'support'>
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          status: 'new' | 'in_progress' | 'completed' | 'cancelled'
          service: string
          name: string
          phone: string
          email: string | null
          company: string | null
          budget: string | null
          timeline: string | null
          notes: string | null
          answers: Record<string, any> | null
          admin_notes: string | null
          assigned_to: string | null
        }
        Insert: Partial<Database['public']['Tables']['orders']['Row']>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          content_blocks: ContentBlock[] | null
          cover_image: string | null
          gallery: string[]
          video_url: string | null
          category: string
          tags: string[]
          author: string
          author_role: string | null
          author_avatar: string | null
          read_time: number
          published: boolean
          views: number
          likes: number
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          canonical_url: string | null
          og_image: string | null
          schema_type: string | null
        }
        Insert: Partial<Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>> & {
          title: string
          slug: string
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>
      }
      blog_comments: {
        Row: {
          id: string
          created_at: string
          post_id: string | null
          post_slug: string
          parent_id: string | null
          name: string
          email: string | null
          content: string
          approved: boolean
          likes: number
          replies?: Database['public']['Tables']['blog_comments']['Row'][]
        }
        Insert: {
          id?: string
          created_at?: string
          post_id?: string | null
          post_slug: string
          parent_id?: string | null
          name: string
          email?: string | null
          content: string
          approved?: boolean
          likes?: number
        }
        Update: Partial<Database['public']['Tables']['blog_comments']['Insert']>
      }
      blog_likes: {
        Row: {
          id: string
          created_at: string
          post_slug: string
          fingerprint: string
        }
        Insert: {
          id?: string
          created_at?: string
          post_slug: string
          fingerprint: string
        }
        Update: Partial<Database['public']['Tables']['blog_likes']['Insert']>
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          category: string
          tags: string[]
          image: string | null
          gallery: string[]
          url: string | null
          featured: boolean
          sort_order: number
          seo_title: string | null
          seo_description: string | null
        }
        Insert: Partial<Database['public']['Tables']['projects']['Row']>
        Update: Partial<Database['public']['Tables']['projects']['Row']>
      }
      team: {
        Row: {
          id: string
          created_at: string
          name: string
          role: string
          bio: string | null
          avatar: string | null
          skills: string[]
          linkedin: string | null
          email: string | null
          twitter: string | null
          active: boolean
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['team']['Row']>
        Update: Partial<Database['public']['Tables']['team']['Row']>
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          department: string
          type: string
          location: string
          salary: string | null
          description: string | null
          requirements: string[]
          benefits: string[]
          urgent: boolean
          active: boolean
          applications: number
        }
        Insert: Partial<Database['public']['Tables']['jobs']['Row']>
        Update: Partial<Database['public']['Tables']['jobs']['Row']>
      }
      messages: {
        Row: {
          id: string
          created_at: string
          name: string
          phone: string | null
          email: string | null
          subject: string
          message: string
          read: boolean
          replied: boolean
          source: string
        }
        Insert: Partial<Database['public']['Tables']['messages']['Row']>
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      site_settings: {
        Row: { key: string; value: any; updated_at?: string }
        Insert: { key: string; value: any; updated_at?: string }
        Update: { key?: string; value?: any; updated_at?: string }
      }
      web_service_page_content: {
        Row: { page_slug: string; content: Json; updated_at: string }
        Insert: { page_slug?: string; content: Json; updated_at?: string }
        Update: { page_slug?: string; content?: Json; updated_at?: string }
      }
      uiux_designs: {
        Row: {
          id: string
          slug: string
          title: string
          title_en: string
          category: string
          summary: string
          description: string
          cover_image: string
          gallery: string[]
          tags: string[]
          features: string[]
          outcome: string
          accent_color: string
          video_url: string
          figma_url: string
          published: boolean
          featured: boolean
          sort_order: number
          seo_title: string
          seo_description: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['uiux_designs']['Row']> & {
          id: string
          slug: string
          title: string
          category: string
          summary: string
          description: string
        }
        Update: Partial<Database['public']['Tables']['uiux_designs']['Row']>
      }
      landing_service_content: {
        Row: { page_slug: string; content: Json; updated_at: string }
        Insert: { page_slug?: string; content: Json; updated_at?: string }
        Update: { page_slug?: string; content?: Json; updated_at?: string }
      }
      pages_seo: {
        Row: {
          page_slug: string
          title: string | null
          description: string | null
          keywords: string[] | null
          og_title: string | null
          og_description: string | null
          og_image: string | null
          canonical: string | null
          schema_json: Record<string, unknown> | null
          updated_at: string
        }

        Insert: Partial<Database['public']['Tables']['pages_seo']['Row']>
        Update: Partial<Database['public']['Tables']['pages_seo']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_blog_likes: {
        Args: { p_slug: string }
        Returns: void
      }
      decrement_blog_likes: {
        Args: { p_slug: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Order = Database['public']['Tables']['orders']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogComment = Database['public']['Tables']['blog_comments']['Row']
export type BlogLike = Database['public']['Tables']['blog_likes']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type TeamMember = Database['public']['Tables']['team']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type PageSEO = Database['public']['Tables']['pages_seo']['Row']
