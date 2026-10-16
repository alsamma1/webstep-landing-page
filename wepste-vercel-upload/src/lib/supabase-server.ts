/**
 * WebStep — Supabase Server Client (Admin)
 * Uses service_role key — server-side only, full DB access, bypasses RLS
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(
    url &&
    !url.includes('YOUR_PROJECT') &&
    key &&
    key !== 'PASTE_SERVICE_ROLE_KEY_HERE' &&
    key.length > 20
  )
}

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  return createClient<Database>(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ) as any
}

// Singleton for API routes
let _serverClient: ReturnType<typeof createServerClient> | null = null
export function getServerClient() {
  if (!_serverClient) _serverClient = createServerClient()
  return _serverClient
}

