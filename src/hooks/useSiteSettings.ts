'use client'

import { useEffect, useState } from 'react'

export interface PublicSiteSettings {
  siteName: string
  siteUrl: string
  email: string
  phone: string
  whatsapp: string
  address: string
  primaryColor: string
  socialLinks: {
    instagram?: string
    twitter?: string
    linkedin?: string
    tiktok?: string
  }
  allowOrders: boolean
  maintenanceMode: boolean
  homeContent?: {
    heroBadge?: string
    heroWords?: string[]
    heroSubtitle?: string
  }
}

const DEFAULT_PUBLIC_SETTINGS: PublicSiteSettings = {
  siteName: 'WebStep',
  siteUrl: 'https://wepste.com',
  email: 'hello@wepstep.sa',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  primaryColor: '#1F8A54',
  socialLinks: {
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
  },
  allowOrders: true,
  maintenanceMode: false,
  homeContent: {
    heroBadge: 'حلول رقمية عصرية',
    heroWords: ['مواقع', 'تطبيقات', 'أنظمة', 'منتجات'],
    heroSubtitle: 'نحوّل فكرتك إلى منتج رقمي احترافي. من التصميم إلى الإطلاق — فريق متكامل في خدمتك.',
  },
}

let cachedSettings: PublicSiteSettings | null = null

export function useSiteSettings() {
  const [settings, setSettings] = useState<PublicSiteSettings>(
    cachedSettings || DEFAULT_PUBLIC_SETTINGS
  )

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const merged: PublicSiteSettings = {
            ...DEFAULT_PUBLIC_SETTINGS,
            ...data,
            socialLinks: {
              ...DEFAULT_PUBLIC_SETTINGS.socialLinks,
              ...(data.socialLinks || {}),
            },
          }
          cachedSettings = merged
          setSettings(merged)
        }
      })
      .catch(() => {
        // Fallback to defaults
      })
  }, [])

  return settings
}
