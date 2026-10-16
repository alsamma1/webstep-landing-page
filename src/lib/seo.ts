import type { Metadata } from 'next'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MASTER_SEO_DATA, PageSeoConfig } from './seo-keywords-data'

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'

/**
 * دمج واستخراج بيانات SEO لصفحة معينة، مع قراءة البيانات من Supabase
 * واستخدام بنك الكلمات المفتاحية الاستراتيجي (+100 كلمة) كقاعدة افتراضية صلبة
 */
export async function resolvePageMetadata(slug: string, fallback?: Metadata): Promise<Metadata> {
  const masterConfig: PageSeoConfig = MASTER_SEO_DATA[slug] || {
    slug,
    title: 'WebStep | حلول برمجية ومواقع وتطبيقات ذكية',
    description: 'تطوير مواقع وتطبيقات ومتاجر إلكترونية احترافية بأحدث التقنيات في اليمن والمملكة العربية السعودية والخليج.',
    og_title: 'WebStep — شريكك التقني لتطوير المواقع والتطبيقات',
    og_description: 'حلول برمجية احترافية تواكب أحدث المعايير الرقمية.',
    og_image: '/assets/logo/logo.png',
    canonical: `${BASE_URL}/${slug === 'home' ? '' : slug}`,
    keywords: MASTER_SEO_DATA.home.keywords,
    faq: [],
  }

  let dbData: Partial<PageSeoConfig> | null = null

  if (isSupabaseConfigured()) {
    try {
      const client = getServerClient()
      const { data, error } = await client
        .from('pages_seo')
        .select('*')
        .eq('page_slug', slug)
        .maybeSingle()

      if (!error && data) {
        dbData = data as any
      }
    } catch (error) {
      console.warn(`Supabase SEO fetch warning for ${slug}:`, error)
    }
  }

  // Final merged fields
  const title = dbData?.title?.trim() || masterConfig.title || (typeof fallback?.title === 'string' ? fallback.title : 'WebStep')
  const description = dbData?.description?.trim() || masterConfig.description || (fallback?.description ?? '')
  const canonical = dbData?.canonical?.trim() || masterConfig.canonical || `${BASE_URL}/${slug === 'home' ? '' : slug}`
  
  // Merge keywords: if DB has keywords use them, else fallback to master 100+ keywords
  const keywords = Array.isArray(dbData?.keywords) && dbData.keywords.length > 0
    ? dbData.keywords
    : masterConfig.keywords

  const ogTitle = dbData?.og_title?.trim() || title
  const ogDescription = dbData?.og_description?.trim() || description
  const ogImage = dbData?.og_image?.trim() || masterConfig.og_image || `${BASE_URL}/assets/logo/logo.png`

  return {
    ...fallback,
    title,
    description,
    keywords,
    authors: [{ name: 'WebStep', url: BASE_URL }],
    creator: 'WebStep',
    publisher: 'WebStep',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages: {
        'ar-SA': `${canonical}?region=sa`,
        'ar-YE': `${canonical}?region=ye`,
        'ar': canonical,
      },
      ...fallback?.alternates,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'ar_YE',
      url: canonical,
      siteName: 'WebStep | ويب ستيب',
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...fallback?.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`],
      ...fallback?.twitter,
    },
  }
}

/**
 * توليد كود البيانات المنظمة (JSON-LD Structured Data Schema)
 * المتوافق مع Google Rich Results ومعايير الذكاء الاصطناعي (ChatGPT, Perplexity)
 * يدعم التخصيص الجغرافي: اليمن (YE) والسعودية/العالم (SA)
 */
export function generatePageStructuredData(slug: string, region: 'sa' | 'ye' = 'sa') {
  const master = MASTER_SEO_DATA[slug] || MASTER_SEO_DATA.home
  const pageUrl = `${BASE_URL}/${slug === 'home' ? '' : slug}`

  const isYe = region === 'ye'

  const schemaList: any[] = [
    // 1. Organization Schema (AI Knowledge Graph)
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: isYe ? 'WebStep Yemen | ويب ستيب اليمن' : 'WebStep | ويب ستيب',
      alternateName: isYe
        ? 'ويب ستيب للحلول البرمجية وتطوير المواقع والتطبيقات في اليمن وصنعاء'
        : 'ويب ستيب لتطوير البرمجيات والحلول الرقمية وتطبيقات الجوال',
      url: BASE_URL,
      logo: `${BASE_URL}/assets/logo/logo.png`,
      email: isYe ? 'alsmh655@gmail.com' : 'hello@wepstep.com',
      telephone: isYe ? '+967771111357' : '+966593672193',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+967771111357',
          contactType: 'customer support - Yemen',
          areaServed: 'YE',
          availableLanguage: ['Arabic'],
          email: 'alsmh655@gmail.com',
        },
        {
          '@type': 'ContactPoint',
          telephone: '+966593672193',
          contactType: 'customer service - Saudi Arabia & Global',
          areaServed: ['SA', 'Worldwide'],
          availableLanguage: ['Arabic', 'English'],
          email: 'hello@wepstep.com',
        },
      ],
      address: [
        {
          '@type': 'PostalAddress',
          addressLocality: 'صنعاء',
          addressRegion: 'أمانة العاصمة',
          addressCountry: 'YE',
        },
        {
          '@type': 'PostalAddress',
          addressLocality: 'الرياض',
          addressRegion: 'منطقة الرياض',
          addressCountry: 'SA',
        },
      ],
      sameAs: [
        'https://instagram.com/wepstep',
        'https://twitter.com/wepstep',
        'https://linkedin.com/company/wepstep',
        'https://tiktok.com/@wepstep',
      ],
    },
    // 2. WebSite Schema with SearchAction
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: isYe ? 'WebStep Yemen | ويب ستيب' : 'WebStep | ويب ستيب',
      description: isYe
        ? 'أفضل حلول برمجية وتطوير مواقع وتطبيقات في اليمن وصنعاء بالريال اليمني'
        : 'حلول برمجية وتطوير مواقع وتطبيقات وأنظمة رقمية متقدمة في السعودية والخليج',
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      inLanguage: isYe ? 'ar-YE' : 'ar-SA',
    },
    // 3. ProfessionalService / Service Schema
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: isYe ? `${master.title} — اليمن` : master.title,
      description: master.description,
      url: pageUrl,
      image: `${BASE_URL}/assets/logo/logo.png`,
      priceRange: isYe ? 'ر.ي' : 'ر.س',
      currenciesAccepted: isYe ? 'YER, SAR, USD' : 'SAR, USD',
      address: {
        '@type': 'PostalAddress',
        addressLocality: isYe ? 'صنعاء' : 'الرياض',
        addressRegion: isYe ? 'صنعاء' : 'منطقة الرياض',
        addressCountry: isYe ? 'YE' : 'SA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: isYe ? 15.3694 : 24.7136,
        longitude: isYe ? 44.1910 : 46.6753,
      },
      telephone: isYe ? '+967771111357' : '+966593672193',
      email: isYe ? 'alsmh655@gmail.com' : 'hello@wepstep.com',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '22:00',
        },
      ],
    },
    // 4. BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: BASE_URL,
        },
        ...(slug !== 'home'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: master.title.split('|')[0].trim(),
                item: pageUrl,
              },
            ]
          : []),
      ],
    },
  ]

  // 5. FAQPage Schema if FAQs exist (Critical for AI Engines like ChatGPT and Perplexity citations!)
  if (master.faq && master.faq.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: master.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  return schemaList
}

/**
 * مزامنة وحفظ كافة الـ 17 صفحة مع الـ 100+ كلمة مفتاحية مباشرة في Supabase
 */
export async function syncAllMasterSeoToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, count: 0, error: 'إعدادات Supabase غير متصلة' }
  }

  try {
    const client = getServerClient()
    const entries = Object.values(MASTER_SEO_DATA)

    const payload = entries.map((item) => ({
      page_slug: item.slug,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
      og_title: item.og_title,
      og_description: item.og_description,
      og_image: item.og_image,
      canonical: item.canonical,
      schema_json: generatePageStructuredData(item.slug),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await client
      .from('pages_seo')
      .upsert(payload, { onConflict: 'page_slug' })

    if (error) {
      console.error('syncAllMasterSeoToSupabase error:', error)
      return { success: false, count: 0, error: error.message }
    }

    return { success: true, count: payload.length }
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'خطأ أثناء المزامنة' }
  }
}
