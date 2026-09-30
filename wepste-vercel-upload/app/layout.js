import './globals.css';
import '@fontsource-variable/cairo';
import { GoogleAnalytics } from '@next/third-parties/google';

const schema = {
  '@context': 'https://schema.org',
  '@type': ['SoftwareApplication', 'ProfessionalService'],
  name: 'ويب ستيب',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'خدمات تطوير مواقع إلكترونية، تطبيقات ذكية، وأنظمة ERP للشركات والمؤسسات.',
  url: 'https://wepste.com/',
  areaServed: 'SA',
  sameAs: ['https://wepste.com/'],
  provider: {
    '@type': 'Organization',
    name: 'ويب ستيب',
    url: 'https://wepste.com/',
    logo: 'https://wepste.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      areaServed: 'Worldwide',
      availableLanguage: ['Arabic', 'English'],
    },
  },
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', stored ? stored === 'dark' : prefersDark);
  } catch {}
})();`;

export const metadata = {
  title: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
  description: 'ويب ستيب يوفر خدمات تطوير مواقع، تطبيقات ذكية، وأنظمة ERP للشركات والمؤسسات.',
  metadataBase: new URL('https://wepste.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
    description: 'حلول رقمية احترافية للشركات والمؤسسات.',
    url: 'https://wepste.com/',
    siteName: 'ويب ستيب',
    type: 'website',
    locale: 'ar_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
    description: 'حلول رقمية احترافية للشركات والمؤسسات.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
        {children}
        <GoogleAnalytics
          gaId={
            process.env.NEXT_PUBLIC_GA_ID ||
            process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
            'G-XXXXXXXXXX'
          }
        />
      </body>
    </html>
  );
}
