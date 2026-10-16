'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import {
  DEFAULT_GEO_SETTINGS,
  formatRegionalPrice,
  type GeoSettings,
  type RegionCode,
  type RegionalContactInfo,
} from '@/lib/geo'

interface RegionContextType {
  region: RegionCode
  setRegion: (r: RegionCode) => void
  toggleRegion: () => void
  isYemen: boolean
  isSaudi: boolean
  contact: RegionalContactInfo
  geoSettings: GeoSettings
  formatPrice: (amountInSAR: number, customYer?: number, packageKey?: string) => string
  formatPriceRaw: (amountInSAR: number, customYer?: number, packageKey?: string) => { amount: string; currency: string }
  getRegionImage: (img?: { ye?: string; sa?: string; default?: string } | string) => string
}

const RegionContext = createContext<RegionContextType | null>(null)

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionCode>('sa')
  const [geoSettings, setGeoSettings] = useState<GeoSettings>(DEFAULT_GEO_SETTINGS)
  const [mounted, setMounted] = useState(false)

  // 1. Initial automatic detection and settings fetch
  useEffect(() => {
    setMounted(true)

    // Check query param (?region=ye / ?region=sa)
    let forcedRegion: RegionCode | null = null
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const q = urlParams.get('region')
      if (q === 'ye' || q === 'sa') forcedRegion = q
    } catch {}

    // Check timezone heuristic
    let tzRegion: RegionCode = 'sa'
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      if (tz.includes('Aden') || tz.includes('Yemen')) {
        tzRegion = 'ye'
      }
    } catch {}

    const initialBestGuess = forcedRegion || tzRegion
    setRegionState(initialBestGuess)

    // Fetch dynamic geo settings from server (includes IP-based detection)
    fetch('/api/public/geo' + (forcedRegion ? `?region=${forcedRegion}` : ''))
      .then(res => res.json())
      .then(async data => {
        if (data && data.settings) {
          setGeoSettings(data.settings)

          if (forcedRegion) {
            setRegionState(forcedRegion)
            return
          }

          // If server detected a country via headers (Vercel, Cloudflare, AWS)
          if (data.detectedRegion) {
            setRegionState(data.detectedRegion)
            return
          }

          // Client-side IP lookup fallback if running locally or headers missing
          try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 1200)
            const ipRes = await fetch('https://api.country.is', { signal: controller.signal })
            clearTimeout(timeout)
            if (ipRes.ok) {
              const ipData = await ipRes.json()
              if (ipData?.country === 'YE') {
                setRegionState('ye')
              } else if (ipData?.country) {
                setRegionState('sa')
              }
            }
          } catch {}
        }
      })
      .catch(err => {
        console.warn('Notice: Using default regional settings:', err)
      })
  }, [])

  // 2. Set Region & Persist
  const setRegion = useCallback((newRegion: RegionCode) => {
    setRegionState(newRegion)
    try {
      localStorage.setItem('wepstep_region', newRegion)
      document.cookie = `wepstep_region=${newRegion}; path=/; max-age=31536000`
    } catch {}
  }, [])

  const toggleRegion = useCallback(() => {
    setRegion(region === 'ye' ? 'sa' : 'ye')
  }, [region, setRegion])

  // Active contact info
  const contact = useMemo<RegionalContactInfo>(() => {
    return region === 'ye' ? geoSettings.yemen : geoSettings.saudi
  }, [region, geoSettings])

  // Price formatter
  const formatPrice = useCallback(
    (amountInSAR: number, customYer?: number, packageKey?: string) => {
      const res = formatRegionalPrice(amountInSAR, region, {
        customYer,
        packageKey,
        geoSettings,
      })
      return res.full
    },
    [region, geoSettings]
  )

  const formatPriceRaw = useCallback(
    (amountInSAR: number, customYer?: number, packageKey?: string) => {
      const res = formatRegionalPrice(amountInSAR, region, {
        customYer,
        packageKey,
        geoSettings,
      })
      return { amount: res.amountFormatted, currency: res.currency }
    },
    [region, geoSettings]
  )

  // Region-aware image resolver
  const getRegionImage = useCallback(
    (img?: { ye?: string; sa?: string; default?: string } | string): string => {
      if (!img) return ''
      if (typeof img === 'string') return img
      if (region === 'ye' && img.ye) return img.ye
      if (region === 'sa' && img.sa) return img.sa
      return img.default || img.sa || img.ye || ''
    },
    [region]
  )

  const value = useMemo(
    () => ({
      region,
      setRegion,
      toggleRegion,
      isYemen: region === 'ye',
      isSaudi: region === 'sa',
      contact,
      geoSettings,
      formatPrice,
      formatPriceRaw,
      getRegionImage,
    }),
    [region, setRegion, toggleRegion, contact, geoSettings, formatPrice, formatPriceRaw, getRegionImage]
  )

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) {
    // Graceful fallback for components outside provider
    return {
      region: 'sa' as RegionCode,
      setRegion: () => {},
      toggleRegion: () => {},
      isYemen: false,
      isSaudi: true,
      contact: DEFAULT_GEO_SETTINGS.saudi,
      geoSettings: DEFAULT_GEO_SETTINGS,
      formatPrice: (amountInSAR: number) => `${amountInSAR.toLocaleString('ar-SA')} ر.س`,
      formatPriceRaw: (amountInSAR: number) => ({ amount: amountInSAR.toLocaleString('ar-SA'), currency: 'ر.س' }),
      getRegionImage: (img: any) => (typeof img === 'string' ? img : img?.sa || img?.ye || ''),
    }
  }
  return ctx
}
