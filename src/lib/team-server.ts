import { getServerClient, isSupabaseConfigured } from './supabase-server'
import type { TeamMember } from './db'

export type TeamPermissionKey =
  | 'all'
  | 'orders'
  | 'messages'
  | 'blog'
  | 'content'
  | 'navbar'
  | 'projects'
  | 'services'
  | 'company_pages'
  | 'team'
  | 'settings'

export interface TeamAccount {
  username: string
  password?: string // Not exposed to client except when editing/creating
  role: 'super_admin' | 'admin' | 'editor' | 'sales' | 'support' | 'custom'
  roleTitle?: string
  can_login: boolean
  permissions: TeamPermissionKey[]
  lastLoginAt?: string
  createdAt?: string
}

export interface TeamMemberWithAccount extends TeamMember {
  account?: TeamAccount
}

export const PERMISSION_OPTIONS: { key: TeamPermissionKey; label: string; desc: string; paths: string[] }[] = [
  { key: 'orders', label: 'الطلبات الواردة', desc: 'استعراض وإدارة طلبات العملاء وتحديث حالاتها', paths: ['/admin/orders'] },
  { key: 'messages', label: 'الرسائل الواردة', desc: 'استعراض رسائل التواصل والرد عليها', paths: ['/admin/messages'] },
  { key: 'blog', label: 'المدونة والمقالات', desc: 'إنشاء وتعديل ونشر مقالات المدونة والتعليقات', paths: ['/admin/blog'] },
  { key: 'content', label: 'محتوى الرئيسية', desc: 'تعديل نصوص وأقسام وترتيب الصفحة الرئيسية', paths: ['/admin/content'] },
  { key: 'navbar', label: 'الشريط العلوي (Navbar)', desc: 'تنسيق وترتيب روابط وقوائم الشريط العلوي', paths: ['/admin/navbar'] },
  { key: 'projects', label: 'الأعمال والمشاريع', desc: 'إدارة مشاريع البورتفوليو وإضافة أعمال جديدة', paths: ['/admin/projects'] },
  { key: 'services', label: 'الخدمات والأنظمة', desc: 'إدارة صفحات المواقع والتطبيقات والتصاميم والمتاجر', paths: ['/admin/web-service', '/admin/apps', '/admin/designs', '/admin/landing-service', '/admin/services'] },
  { key: 'company_pages', label: 'صفحات الشركة', desc: 'تعديل صفحات من نحن، تواصل معنا، التوظيف، ونموذج الطلب', paths: ['/admin/contact-page', '/admin/about', '/admin/order-settings', '/admin/careers'] },
  { key: 'team', label: 'إدارة الفريق والحسابات', desc: 'إضافة وتعديل أعضاء الفريق ومنح الصلاحيات', paths: ['/admin/team'] },
  { key: 'settings', label: 'إعدادات الموقع وSEO', desc: 'تعديل الإعدادات العامة للموقع ووسائل التواصل والسيو', paths: ['/admin/settings', '/admin/seo'] },
]

export const ROLE_PRESETS: Record<string, { title: string; permissions: TeamPermissionKey[] }> = {
  super_admin: {
    title: 'مدير عام',
    permissions: ['all'],
  },
  admin: {
    title: 'مشرف نظام',
    permissions: ['orders', 'messages', 'blog', 'content', 'navbar', 'projects', 'services', 'company_pages'],
  },
  editor: {
    title: 'محرر محتوى',
    permissions: ['blog', 'content', 'projects', 'navbar'],
  },
  sales: {
    title: 'مسؤول مبيعات وطلبات',
    permissions: ['orders', 'messages', 'services'],
  },
  support: {
    title: 'دعم فني وخدمة عملاء',
    permissions: ['messages', 'orders'],
  },
  custom: {
    title: 'مخصص',
    permissions: [],
  },
}

const SETTINGS_KEY = 'team_accounts'

/**
 * Get all team accounts map from Supabase site_settings
 */
export async function getTeamAccountsMap(): Promise<Record<string, TeamAccount>> {
  if (!isSupabaseConfigured()) return {}
  try {
    const supabase = getServerClient()
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle()

    if (data?.value && typeof data.value === 'object') {
      return data.value as Record<string, TeamAccount>
    }
  } catch (e) {
    console.error('getTeamAccountsMap error:', e)
  }
  return {}
}

/**
 * Save team accounts map to Supabase site_settings
 */
export async function saveTeamAccountsMap(accounts: Record<string, TeamAccount>) {
  if (!isSupabaseConfigured()) return
  try {
    const supabase = getServerClient()
    await supabase.from('site_settings').upsert(
      {
        key: SETTINGS_KEY,
        value: accounts,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
  } catch (e) {
    console.error('saveTeamAccountsMap error:', e)
  }
}

/**
 * Get all team members merged with their accounts
 */
export async function getAllTeamMembersWithAccounts(): Promise<TeamMemberWithAccount[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = getServerClient()
    const { data: members, error } = await supabase
      .from('team')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !members) return []

    const accountsMap = await getTeamAccountsMap()

    return members.map((m: any) => {
      const acc = accountsMap[m.id]
      return {
        id: m.id,
        name: m.name || '',
        role: m.role || '',
        bio: m.bio || '',
        avatar: m.avatar || '',
        skills: Array.isArray(m.skills) ? m.skills : [],
        linkedin: m.linkedin || '',
        twitter: m.twitter || '',
        email: m.email || '',
        active: Boolean(m.active),
        sort_order: m.sort_order ?? 0,
        account: acc
          ? {
              username: acc.username || '',
              role: acc.role || 'custom',
              roleTitle: acc.roleTitle || ROLE_PRESETS[acc.role]?.title || 'مخصص',
              can_login: Boolean(acc.can_login),
              permissions: Array.isArray(acc.permissions) ? acc.permissions : [],
              lastLoginAt: acc.lastLoginAt,
              createdAt: acc.createdAt,
            }
          : undefined,
      }
    })
  } catch (err) {
    console.error('getAllTeamMembersWithAccounts error:', err)
    return []
  }
}

/**
 * Save or update team member + account
 */
export async function saveTeamMemberWithAccount(
  memberData: Partial<TeamMember>,
  accountData?: Partial<TeamAccount>
): Promise<TeamMemberWithAccount> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase client is not configured.')
  }

  const supabase = getServerClient()

  // 1. Prepare member data for 'team' table
  const memberPayload: Record<string, any> = {
    name: memberData.name?.trim(),
    role: memberData.role?.trim(),
    bio: memberData.bio || '',
    avatar: memberData.avatar || '',
    skills: Array.isArray(memberData.skills) ? memberData.skills : [],
    linkedin: memberData.linkedin || '',
    twitter: memberData.twitter || '',
    email: memberData.email?.trim() || '',
    active: memberData.active !== undefined ? Boolean(memberData.active) : true,
    sort_order: memberData.sort_order || 0,
  }

  let savedMemberId = memberData.id

  if (savedMemberId) {
    const { data, error } = await supabase
      .from('team')
      .update(memberPayload)
      .eq('id', savedMemberId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    savedMemberId = data.id
  } else {
    const { data, error } = await supabase
      .from('team')
      .insert(memberPayload)
      .select()
      .single()

    if (error) throw new Error(error.message)
    savedMemberId = data.id
  }

  if (!savedMemberId) {
    throw new Error('فشل حفظ بيانات العضو')
  }

  // 2. Update account in site_settings if provided
  const accountsMap = await getTeamAccountsMap()

  if (accountData && accountData.can_login) {
    const existing = accountsMap[savedMemberId] || {}
    const username = (accountData.username || memberData.email?.split('@')[0] || `user_${savedMemberId.slice(0, 5)}`).toLowerCase().trim()
    const password = accountData.password?.trim() || existing.password || 'WebStep@123'
    const role = accountData.role || 'custom'
    const permissions: TeamPermissionKey[] =
      role === 'super_admin'
        ? ['all']
        : Array.isArray(accountData.permissions) && accountData.permissions.length > 0
        ? (accountData.permissions as TeamPermissionKey[])
        : (ROLE_PRESETS[role]?.permissions || [])

    accountsMap[savedMemberId] = {
      username,
      password,
      role,
      roleTitle: ROLE_PRESETS[role]?.title || 'مخصص',
      can_login: true,
      permissions,
      createdAt: existing.createdAt || new Date().toISOString(),
      lastLoginAt: existing.lastLoginAt,
    }
  } else if (accountData && accountData.can_login === false && accountsMap[savedMemberId]) {
    accountsMap[savedMemberId].can_login = false
  }

  await saveTeamAccountsMap(accountsMap)

  return {
    ...(memberPayload as any),
    id: savedMemberId,
    account: accountsMap[savedMemberId],
  }
}

/**
 * Delete a team member and their account
 */
export async function deleteTeamMember(id: string) {
  if (!isSupabaseConfigured()) return
  const supabase = getServerClient()
  await supabase.from('team').delete().eq('id', id)

  const accountsMap = await getTeamAccountsMap()
  if (accountsMap[id]) {
    delete accountsMap[id]
    await saveTeamAccountsMap(accountsMap)
  }
}

/**
 * Authenticate login for either Super Admin or Team Member
 */
export async function authenticateAnyUser(identifier: string, pass: string): Promise<{
  success: boolean
  user?: {
    id: string
    name: string
    username: string
    email: string
    role: string
    roleTitle: string
    permissions: TeamPermissionKey[]
    isSuperAdmin: boolean
  }
}> {
  const cleanId = (identifier || '').trim().toLowerCase()
  const cleanPass = (pass || '').trim()

  // 1. Check Super Admin
  const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase()
  const envPass = process.env.ADMIN_PASSWORD || ''

  let superUser = envUser
  let superPass = envPass
  let superName = 'المدير العام'

  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerClient()
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'admin_account').maybeSingle()
      if (data?.value) {
        const val = data.value as any
        if (val.username) superUser = val.username.toLowerCase()
        if (val.password) superPass = val.password
        if (val.name) superName = val.name
      }
    } catch (e) {}
  }

  if ((cleanId === superUser || cleanId === 'admin@wepstep.sa') && cleanPass === superPass) {
    return {
      success: true,
      user: {
        id: 'super_admin',
        name: superName,
        username: superUser,
        email: 'admin@wepstep.sa',
        role: 'super_admin',
        roleTitle: 'المدير العام',
        permissions: ['all'],
        isSuperAdmin: true,
      },
    }
  }

  // 2. Check Team Members
  const membersWithAccounts = await getAllTeamMembersWithAccounts()
  const accountsMap = await getTeamAccountsMap()

  for (const member of membersWithAccounts) {
    const acc = accountsMap[member.id]
    if (!acc || !acc.can_login || !member.active) continue

    const matchesUsername = acc.username && acc.username.toLowerCase() === cleanId
    const matchesEmail = member.email && member.email.toLowerCase() === cleanId

    if ((matchesUsername || matchesEmail) && acc.password === cleanPass) {
      // Update last login
      acc.lastLoginAt = new Date().toISOString()
      accountsMap[member.id] = acc
      saveTeamAccountsMap(accountsMap).catch(() => {})

      return {
        success: true,
        user: {
          id: member.id,
          name: member.name,
          username: acc.username,
          email: member.email || '',
          role: acc.role,
          roleTitle: acc.roleTitle || ROLE_PRESETS[acc.role]?.title || 'عضو فريق',
          permissions: acc.permissions || [],
          isSuperAdmin: acc.role === 'super_admin' || acc.permissions?.includes('all'),
        },
      }
    }
  }

  return { success: false }
}
