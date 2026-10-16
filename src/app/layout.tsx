import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { RegionProvider } from '@/components/providers/RegionProvider'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { resolvePageMetadata } from '@/lib/seo'
import '@fontsource/cairo/latin-300.css'
import '@fontsource/cairo/latin-400.css'
import '@fontsource/cairo/latin-500.css'
import '@fontsource/cairo/latin-600.css'
import '@fontsource/cairo/latin-700.css'
import '@fontsource/cairo/latin-800.css'
import '@fontsource/cairo/latin-900.css'
import '@fontsource/cairo/arabic-300.css'
import '@fontsource/cairo/arabic-400.css'
import '@fontsource/cairo/arabic-500.css'
import '@fontsource/cairo/arabic-600.css'
import '@fontsource/cairo/arabic-700.css'
import '@fontsource/cairo/arabic-800.css'
import '@fontsource/cairo/arabic-900.css'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

const fallbackMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'WebStep — موقعك الذي يمثّلك | تطوير مواقع وتطبيقات احترافية',
    template: '%s | WebStep',
  },
  description:
    'ويب ستيب متخصصة في بناء مواقع ويب وتطبيقات جوال وأنظمة رقمية احترافية للسوق اليمني والسعودي والخليجي. دفعة واحدة بدون رسوم شهرية. ابدأ مشروعك اليوم.',
  keywords: [
    'WebStep', 'ويب ستيب',
    'تطوير مواقع اليمن', 'برمجة مواقع صنعاء', 'شركة برمجة اليمن',
    'تطوير مواقع السعودية', 'برمجة مواقع', 'شركة تطوير مواقع',
    'تطبيقات جوال اليمن', 'تطبيقات جوال السعودية', 'تطبيقات iOS', 'تطبيقات Android',
    'متجر إلكتروني', 'تصميم UI UX', 'صفحات هبوط',
    'أنظمة رقمية', 'ERP', 'تسويق رقمي',
    'web development Yemen', 'web development Saudi Arabia', 'app development Riyadh',
    'digital solutions', 'Next.js', 'React',
    'تصميم مواقع الرياض', 'شركة برمجة الرياض',
  ],
  authors: [{ name: 'WebStep', url: BASE_URL }],
  creator: 'WebStep',
  publisher: 'WebStep',
  category: 'technology',

  // ─── Google Search Console Verification ──────────────────
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },

  // ─── Robots ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ─── Open Graph (WhatsApp, Facebook, LinkedIn) ───────────
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'ar_YE',
    url: BASE_URL,
    siteName: 'WebStep',
    title: 'WebStep — موقعك الذي يمثّلك | تطوير مواقع وتطبيقات',
    description:
      'نحوّل فكرتك إلى منتج رقمي احترافي. مواقع، تطبيقات، متاجر، أنظمة في اليمن والسعودية والعالم.',
    images: [
      {
        url: '/assets/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'WebStep — حلول رقمية احترافية',
        type: 'image/png',
      },
    ],
  },

  // ─── Twitter / X Card ────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@wepstep',
    creator: '@wepstep',
    title: 'WebStep — موقعك الذي يمثّلك',
    description: 'نحوّل فكرتك إلى منتج رقمي احترافي. ابدأ مشروعك اليوم.',
    images: ['/assets/logo/logo.png'],
  },

  // ─── Icons / PWA (WebStep Logo Favicon) ───────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/assets/logo/logo.png', type: 'image/png' },
      { url: '/assets/logo/webstep-icon.svg', type: 'image/svg+xml' },
      { url: '/assets/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/logo/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // ─── Manifest ────────────────────────────────────────────
  manifest: '/manifest.json',

  // ─── Alternates ──────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ar-SA': `${BASE_URL}?region=sa`,
      'ar-YE': `${BASE_URL}?region=ye`,
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('home', fallbackMetadata)
}

// ─── JSON-LD Organization Schema ──────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'WebStep',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/assets/logo/logo.png`,
    width: 200,
    height: 200,
  },
  description: 'شركة تقنية متخصصة في تطوير المواقع والتطبيقات والأنظمة الرقمية في اليمن والسعودية والخليج.',
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'صنعاء',
      addressCountry: 'YE',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'الرياض',
      addressRegion: 'الرياض',
      addressCountry: 'SA',
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support - Yemen',
      telephone: '+967-771-111-357',
      email: 'alsmh655@gmail.com',
      areaServed: 'YE',
      availableLanguage: ['Arabic'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer service - Saudi Arabia & Global',
      telephone: '+966-59-367-2193',
      email: 'hello@wepstep.com',
      areaServed: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      availableLanguage: ['Arabic', 'English'],
    },
  ],
  sameAs: [
    'https://instagram.com/wepstep',
    'https://twitter.com/wepstep',
    'https://linkedin.com/company/wepstep',
  ],
  foundingDate: '2023',
  areaServed: ['YE', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
  knowsAbout: [
    'Web Development', 'Mobile App Development', 'UI/UX Design',
    'E-commerce', 'Digital Marketing', 'ERP Systems',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'WebStep',
  description: 'شركة تقنية متخصصة في تطوير المواقع والتطبيقات الرقمية في اليمن والسعودية والعالم',
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: ['ar-SA', 'ar-YE'],
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Favicon & Logo */}
        <link rel="icon" href="/assets/logo/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/logo/logo.png" />

        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <RegionProvider>
            {children}
          </RegionProvider>
        </ThemeProvider>

        {GA_ID && process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics measurementId={GA_ID} />
        )}
        <SpeedInsights />
      </body>
    </html>
  )
}

