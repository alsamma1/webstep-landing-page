/**
 * WebStep Geo-Targeting & Regional Localization
 * Supports Yemen (YE) and Saudi Arabia / Global (SA)
 */

export type RegionCode = 'ye' | 'sa'

export interface RegionalContactInfo {
  phone: string
  phoneFormatted: string
  whatsapp: string
  email: string
  currency: string
  currencyName: string
  address: string
  city: string
  countryName: string
  flag: string
}

export interface RegionalPricingConfig {
  yerExchangeRate: number // 1 SAR = X YER (default 450)
  customPackagePrices?: Record<string, { sar: number; yer: number }>
}

export interface RegionalImageSlot {
  ye?: string
  sa?: string
  enabled?: boolean
}

export interface RegionalImagesConfig {
  heroBadge?: { ye?: string; sa?: string }
  heroLogo?: RegionalImageSlot
  heroStage1?: RegionalImageSlot
  heroStage2?: RegionalImageSlot
  heroStage3?: RegionalImageSlot
  heroImage?: RegionalImageSlot
  featuresImage?: RegionalImageSlot
  aboutImage?: RegionalImageSlot
  servicesImage?: RegionalImageSlot
  promoBanner?: RegionalImageSlot
  contactImage?: RegionalImageSlot
}

export interface GeoSettings {
  defaultRegion: RegionCode
  yemen: RegionalContactInfo
  saudi: RegionalContactInfo
  pricing: RegionalPricingConfig
  images: RegionalImagesConfig
  social: {
    instagram: string
    twitter?: string
    linkedin?: string
    tiktok?: string
  }
  siteUrl: string
}

export const DEFAULT_GEO_SETTINGS: GeoSettings = {
  defaultRegion: 'sa',
  yemen: {
    phone: '771111357',
    phoneFormatted: '+967 771 111 357',
    whatsapp: '967771111357',
    email: 'alsmh655@gmail.com',
    currency: 'ر.ي',
    currencyName: 'ريال يمني',
    address: 'صنعاء، الجمهورية اليمنية',
    city: 'صنعاء',
    countryName: 'اليمن',
    flag: '🇾🇪',
  },
  saudi: {
    phone: '+966593672193',
    phoneFormatted: '+966 59 367 2193',
    whatsapp: '966593672193',
    email: 'hello@wepstep.com',
    currency: 'ر.س',
    currencyName: 'ريال سعودي',
    address: 'الرياض، المملكة العربية السعودية',
    city: 'الرياض',
    countryName: 'السعودية والعالم',
    flag: '🇸🇦',
  },
  pricing: {
    yerExchangeRate: 450,
    customPackagePrices: {
      'landing_starter': { sar: 1200, yer: 540000 },
      'landing_pro': { sar: 2200, yer: 990000 },
      'web_starter': { sar: 2500, yer: 1125000 },
      'web_business': { sar: 4500, yer: 2025000 },
      'web_enterprise': { sar: 8500, yer: 3825000 },
      'apps_mvp': { sar: 6500, yer: 2925000 },
      'apps_pro': { sar: 12500, yer: 5625000 },
      'ecommerce_starter': { sar: 3500, yer: 1575000 },
      'ecommerce_growth': { sar: 6500, yer: 2925000 },
      'design_identity': { sar: 1800, yer: 810000 },
      'design_uiux': { sar: 3200, yer: 1440000 },
    },
  },
  images: {
    heroBadge: {
      ye: 'حلول رقمية متقدمة في اليمن وبأفضل الأسعار',
      sa: 'حلول رقمية عصرية وذكية للسوق السعودي والخليجي',
    },
    heroLogo: {
      ye: '/assets/logo/logo.png',
      sa: '/assets/logo/logo.png',
    },
    heroStage1: {
      ye: '/assets/1.png',
      sa: '/assets/1.png',
    },
    heroStage2: {
      ye: '/assets/2.png',
      sa: '/assets/2.png',
    },
    heroStage3: {
      ye: '/assets/3.png',
      sa: '/assets/3.png',
    },
    aboutImage: {
      ye: '/assets/logo/logo.png',
      sa: '/assets/logo/logo.png',
    },
    featuresImage: {
      ye: '/assets/logo/logo.png',
      sa: '/assets/logo/logo.png',
    },
    contactImage: {
      ye: '/assets/logo/logo.png',
      sa: '/assets/logo/logo.png',
    },
  },
  social: {
    instagram: 'https://instagram.com/wepstep',
    twitter: 'https://twitter.com/wepstep',
    linkedin: 'https://linkedin.com/company/wepstep',
    tiktok: 'https://tiktok.com/@wepstep',
  },
  siteUrl: 'https://wepste.com',
}

/**
 * Format price according to region
 */
export function formatRegionalPrice(
  amountInSAR: number,
  region: RegionCode,
  options?: {
    customYer?: number
    rate?: number
    packageKey?: string
    geoSettings?: GeoSettings
  }
): { amountFormatted: string; currency: string; full: string; numeric: number } {
  const settings = options?.geoSettings || DEFAULT_GEO_SETTINGS
  const rate = options?.rate || settings.pricing.yerExchangeRate || 450

  if (region === 'ye') {
    let yerAmount: number
    if (options?.packageKey && settings.pricing.customPackagePrices?.[options.packageKey]?.yer) {
      yerAmount = settings.pricing.customPackagePrices[options.packageKey].yer
    } else if (typeof options?.customYer === 'number' && options.customYer > 0) {
      yerAmount = options.customYer
    } else {
      yerAmount = Math.round((amountInSAR * rate) / 1000) * 1000
    }
    const amountFormatted = yerAmount.toLocaleString('ar-YE')
    const currency = settings.yemen.currency
    return {
      amountFormatted,
      currency,
      full: `${amountFormatted} ${currency}`,
      numeric: yerAmount,
    }
  }

  // Saudi / Global
  let sarAmount = amountInSAR
  if (options?.packageKey && settings.pricing.customPackagePrices?.[options.packageKey]?.sar) {
    sarAmount = settings.pricing.customPackagePrices[options.packageKey].sar
  }
  const amountFormatted = sarAmount.toLocaleString('ar-SA')
  const currency = settings.saudi.currency
  return {
    amountFormatted,
    currency,
    full: `${amountFormatted} ${currency}`,
    numeric: sarAmount,
  }
}
