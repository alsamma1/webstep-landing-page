'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const lastTrackedPath = useRef('')

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || ((...args: unknown[]) => {
      window.dataLayer?.push(args)
    })

    window.gtag('js', new Date())
    window.gtag('config', measurementId, { send_page_view: false })

    let idleCallbackId: number | undefined
    let timeoutId: number | undefined

    const loadScript = () => {
      if (document.getElementById('google-analytics-src')) return

      const script = document.createElement('script')
      script.id = 'google-analytics-src'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
      document.head.appendChild(script)
    }

    const scheduleScript = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleCallbackId = window.requestIdleCallback(loadScript, { timeout: 3000 })
      } else {
        timeoutId = window.setTimeout(loadScript, 1000)
      }
    }

    if (document.readyState === 'complete') {
      scheduleScript()
    } else {
      window.addEventListener('load', scheduleScript, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleScript)
      if (idleCallbackId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [measurementId])

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return
    lastTrackedPath.current = pathname
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
    })
  }, [pathname])

  return null
}
