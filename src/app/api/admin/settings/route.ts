import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const DEFAULT_SETTINGS = {
  // General & Identity
  siteName: 'WebStep',
  siteUrl: 'https://wepstep.sa',
  logoTextPrefix: 'Web',
  logoTextSuffix: 'Step',
  logoImageUrl: '/assets/logo/logo.png',
  currency: 'ر.س',
  crNumber: '',
  copyrightNotice: 'جميع الحقوق محفوظة لـ WebStep © 2026',

  // Contact
  email: 'hello@wepstep.sa',
  supportEmail: 'support@wepstep.sa',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',

  // Social Links
  socialLinks: {
    twitter: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    github: '',
    telegram: '',
    facebook: '',
  },

  // SEO & Verification
  seoTitle: 'WebStep — حلول رقمية وتطوير مواقع احترافية بدفعة واحدة',
  seoDescription: 'ويب ستيب متخصصة في بناء وتطوير مواقع الويب وتطبيقات الجوال والأنظمة السحابية للشركات ورواد الأعمال والمستقلين.',
  seoKeywords: ['تطوير مواقع', 'تصميم ويب', 'سعودية', 'Next.js', 'بورتفوليو', 'متاجر إلكترونية'],
  googleVerification: '',
  googleAnalyticsId: 'G-30E5FSM42H',

  // System & Branding
  primaryColor: '#1F8A54',
  secondaryColor: '#10b981',
  maintenanceMode: false,
  maintenanceMessage: 'الموقع حالياً يخضع لترقية مجدولة. سنعود للعمل قريباً جداً!',
  allowOrders: true,
  allowMessages: true,
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }

  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['general', 'system', 'social', 'seo', 'site_config'])

    if (error || !data) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    const merged: Record<string, any> = { ...DEFAULT_SETTINGS }

    for (const row of data) {
      const val = row.value && typeof row.value === 'object' ? (row.value as Record<string, any>) : {}
      if (row.key === 'general') {
        Object.assign(merged, val)
      } else if (row.key === 'system') {
        Object.assign(merged, val)
      } else if (row.key === 'social') {
        merged.socialLinks = { ...DEFAULT_SETTINGS.socialLinks, ...val }
      } else if (row.key === 'seo') {
        if (val.title) merged.seoTitle = val.title
        if (val.description) merged.seoDescription = val.description
        if (val.keywords) merged.seoKeywords = val.keywords
        if (val.googleVerification) merged.googleVerification = val.googleVerification
        if (val.googleAnalyticsId) merged.googleAnalyticsId = val.googleAnalyticsId
      } else if (row.key === 'site_config') {
        Object.assign(merged, val)
      }
    }

    return NextResponse.json(merged)
  } catch (err: any) {
    console.error('Settings GET error:', err)
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function PATCH(req: NextRequest) {
  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  const supabase = getServerClient()
  const now = new Date().toISOString()

  try {
    // 1. General Info
    const generalPayload = {
      siteName: body.siteName || DEFAULT_SETTINGS.siteName,
      siteUrl: body.siteUrl || DEFAULT_SETTINGS.siteUrl,
      logoTextPrefix: body.logoTextPrefix || DEFAULT_SETTINGS.logoTextPrefix,
      logoTextSuffix: body.logoTextSuffix || DEFAULT_SETTINGS.logoTextSuffix,
      logoImageUrl: body.logoImageUrl || DEFAULT_SETTINGS.logoImageUrl,
      currency: body.currency || DEFAULT_SETTINGS.currency,
      crNumber: body.crNumber || '',
      copyrightNotice: body.copyrightNotice || DEFAULT_SETTINGS.copyrightNotice,
      email: body.email || DEFAULT_SETTINGS.email,
      supportEmail: body.supportEmail || DEFAULT_SETTINGS.supportEmail,
      phone: body.phone || DEFAULT_SETTINGS.phone,
      whatsapp: body.whatsapp || DEFAULT_SETTINGS.whatsapp,
      address: body.address || DEFAULT_SETTINGS.address,
      workingHours: body.workingHours || DEFAULT_SETTINGS.workingHours,
    }

    // 2. System Settings
    const systemPayload = {
      primaryColor: body.primaryColor || DEFAULT_SETTINGS.primaryColor,
      secondaryColor: body.secondaryColor || DEFAULT_SETTINGS.secondaryColor,
      maintenanceMode: Boolean(body.maintenanceMode),
      maintenanceMessage: body.maintenanceMessage || DEFAULT_SETTINGS.maintenanceMessage,
      allowOrders: body.allowOrders !== false,
      allowMessages: body.allowMessages !== false,
    }

    // 3. Social Media
    const socialPayload = {
      ...DEFAULT_SETTINGS.socialLinks,
      ...(body.socialLinks || {}),
    }

    // 4. SEO
    const seoPayload = {
      title: body.seoTitle || DEFAULT_SETTINGS.seoTitle,
      description: body.seoDescription || DEFAULT_SETTINGS.seoDescription,
      keywords: Array.isArray(body.seoKeywords) ? body.seoKeywords : DEFAULT_SETTINGS.seoKeywords,
      googleVerification: body.googleVerification || '',
      googleAnalyticsId: body.googleAnalyticsId || DEFAULT_SETTINGS.googleAnalyticsId,
    }

    // Execute upserts
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'general', value: generalPayload, updated_at: now }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'system', value: systemPayload, updated_at: now }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'social', value: socialPayload, updated_at: now }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'seo', value: seoPayload, updated_at: now }, { onConflict: 'key' }),
    ])

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات الموقع بنجاح في قاعدة البيانات',
      data: {
        ...generalPayload,
        ...systemPayload,
        socialLinks: socialPayload,
        seoTitle: seoPayload.title,
        seoDescription: seoPayload.description,
        seoKeywords: seoPayload.keywords,
        googleVerification: seoPayload.googleVerification,
        googleAnalyticsId: seoPayload.googleAnalyticsId,
      },
    })
  } catch (err: any) {
    console.error('Settings PATCH error:', err)
    return NextResponse.json({ error: err.message || 'فشل حفظ الإعدادات' }, { status: 500 })
  }
}
