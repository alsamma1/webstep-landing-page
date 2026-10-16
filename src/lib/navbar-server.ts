import { getServerClient, isSupabaseConfigured } from './supabase-server'
import { DEFAULT_NAVBAR_CONFIG, type NavbarConfig } from './navbar-types'

const SETTINGS_KEY = 'navbar_config'

export async function getNavbarConfig(): Promise<NavbarConfig> {
  try {
    if (!isSupabaseConfigured()) return DEFAULT_NAVBAR_CONFIG
    const supabase = getServerClient()
    if (!supabase) return DEFAULT_NAVBAR_CONFIG

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle()

    if (error || !data || !data.value) {
      return DEFAULT_NAVBAR_CONFIG
    }

    return {
      ...DEFAULT_NAVBAR_CONFIG,
      ...data.value,
      navItems: data.value.navItems?.length ? data.value.navItems : DEFAULT_NAVBAR_CONFIG.navItems,
      servicesMenu: data.value.servicesMenu?.length ? data.value.servicesMenu : DEFAULT_NAVBAR_CONFIG.servicesMenu,
      contactMenu: data.value.contactMenu?.length ? data.value.contactMenu : DEFAULT_NAVBAR_CONFIG.contactMenu,
    }
  } catch (err) {
    console.error('getNavbarConfig error:', err)
    return DEFAULT_NAVBAR_CONFIG
  }
}

export async function saveNavbarConfig(config: NavbarConfig): Promise<NavbarConfig> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase client is not configured.')
  }
  const supabase = getServerClient()
  if (!supabase) {
    throw new Error('Supabase client is not available.')
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key: SETTINGS_KEY,
        value: config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

  if (error) {
    console.error('saveNavbarConfig error:', error)
    throw new Error(error.message)
  }

  return config
}
