import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getStoredAccount, saveStoredAccount } from '@/lib/account'

export const dynamic = 'force-dynamic'

// ─── GET: جلب معلومات الحساب الحالية (بدون كلمة المرور) ───
export async function GET() {
  let account = getStoredAccount()

  if (isSupabaseConfigured()) {
    try {
      const client = getServerClient() as any
      const { data } = await client
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_account')
        .maybeSingle()
      if (data?.value && typeof data.value === 'object') {
        account = { ...account, ...(data.value as Record<string, unknown>) }
      }
    } catch (e) {
      console.warn('Supabase get account fallback:', e)
    }
  }

  return NextResponse.json({
    name: account.name || 'المدير العام',
    username: account.username || 'admin',
    email: account.email || 'admin@wepstep.sa',
    updatedAt: account.updatedAt || new Date().toISOString(),
    isSupabaseConnected: isSupabaseConfigured(),
  })
}

// ─── PATCH: تحديث بيانات الحساب وكلمة المرور ───
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { currentPassword, newPassword, name, username, email } = body

    let currentAccount = getStoredAccount()

    // 1. Check in Supabase if exists
    if (isSupabaseConfigured()) {
      try {
        const client = getServerClient() as any
        const { data } = await client
          .from('site_settings')
          .select('value')
          .eq('key', 'admin_account')
          .maybeSingle()
        if (data?.value && typeof data.value === 'object') {
          currentAccount = { ...currentAccount, ...(data.value as Record<string, unknown>) }
        }
      } catch (e) {
        console.warn('Supabase fetch account check fallback:', e)
      }
    }

    // 2. التحقق من كلمة المرور الحالية
    if (!currentPassword) {
      return NextResponse.json({ error: 'يرجى إدخال كلمة المرور الحالية لتأكيد التعديل' }, { status: 400 })
    }

    if (currentPassword !== currentAccount.password) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة، يرجى التأكد وإعادة المحاولة' }, { status: 401 })
    }

    // 3. التحقق من كلمة المرور الجديدة إن تم إدخالها
    let updatedPassword = currentAccount.password
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.trim().length < 6) {
        return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أرقام على الأقل' }, { status: 400 })
      }
      updatedPassword = newPassword.trim()
    }

    const updatedAccount = {
      name: (name && name.trim()) || currentAccount.name,
      username: (username && username.trim()) || currentAccount.username,
      email: (email && email.trim()) || currentAccount.email,
      password: updatedPassword,
      updatedAt: new Date().toISOString(),
    }

    // 4. حفظ في Supabase
    if (isSupabaseConfigured()) {
      try {
        const client = getServerClient() as any
        const { error: sbError } = await client
          .from('site_settings')
          .upsert(
            {
              key: 'admin_account',
              value: updatedAccount,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          )
        if (sbError) {
          console.warn('Supabase upsert admin_account error:', sbError)
        }
      } catch (sbErr) {
        console.warn('Supabase save account error:', sbErr)
      }
    }

    // 5. حفظ محلياً في JSON DB
    saveStoredAccount(updatedAccount)

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الحساب وكلمة المرور بنجاح في قاعدة البيانات!',
      account: {
        name: updatedAccount.name,
        username: updatedAccount.username,
        email: updatedAccount.email,
        updatedAt: updatedAccount.updatedAt,
      },
    })
  } catch (err: any) {
    console.error('Account update error:', err)
    return NextResponse.json({ error: err?.message || 'حدث خطأ أثناء تحديث بيانات الحساب' }, { status: 500 })
  }
}
