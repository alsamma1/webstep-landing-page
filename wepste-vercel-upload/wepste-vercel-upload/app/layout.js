import './globals.css';
import '@fontsource-variable/cairo';
import { GoogleAnalytics } from '@next/third-parties/google';

const arabCountries = [
  ['SA', 'المملكة العربية السعودية'],
  ['AE', 'الإمارات العربية المتحدة'],
  ['QA', 'قطر'],
  ['KW', 'الكويت'],
  ['BH', 'البحرين'],
  ['OM', 'عُمان'],
  ['EG', 'مصر'],
  ['YE', 'اليمن'],
  ['JO', 'الأردن'],
  ['IQ', 'العراق'],
  ['MA', 'المغرب'],
  ['DZ', 'الجزائر'],
  ['TN', 'تونس'],
  ['LY', 'ليبيا'],
  ['SD', 'السودان'],
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://wepste.com/#organization',
      name: 'ويب ستيب',
      url: 'https://wepste.com/',
      email: 'hello@wepste.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wepste.com/icon.svg',
      },
      areaServed: arabCountries.map(([code, name]) => ({
        '@type': 'Country',
        name,
        identifier: code,
      })),
      knowsAbout: [
        'تطوير المواقع الإلكترونية',
        'تطوير تطبيقات الجوال',
        'أنظمة تخطيط موارد المؤسسات ERP',
        'تهيئة المواقع لمحركات البحث SEO',
        'أتمتة الأعمال وتكامل واجهات API',
        'تصميم صفحات الهبوط',
        'تصميم وتطوير متاجر إلكترونية',
        'تطوير تطبيقات أندرويد وآيفون',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'hello@wepste.com',
        availableLanguage: ['Arabic', 'English'],
        areaServed: arabCountries.map(([code]) => code),
      },
    },
    {
      '@type': ['ProfessionalService', 'SoftwareApplication'],
      '@id': 'https://wepste.com/#digital-services',
      name: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
      url: 'https://wepste.com/',
      description:
        'حلول تطوير رقمي عربية للشركات ورواد الأعمال في دول الوطن العربي: تصميم وتطوير المواقع والمتاجر، صفحات الهبوط، تطبيقات الجوال والويب، أنظمة ERP السحابية، وأتمتة الأعمال.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'ar',
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'الشركات ورواد الأعمال في الدول العربية',
      },
      provider: {
        '@id': 'https://wepste.com/#organization',
      },
      areaServed: arabCountries.map(([code, name]) => ({
        '@type': 'Country',
        name,
        identifier: code,
      })),
      serviceType: [
        'تصميم وتطوير مواقع الويب',
        'إنشاء صفحات هبوط احترافية',
        'تصميم وتطوير المتاجر الإلكترونية',
        'تطوير تطبيقات الهواتف لأندرويد وآيفون',
        'تطوير تطبيقات الويب',
        'أنظمة ERP سحابية مخصصة',
        'أتمتة الأعمال وتكامل واجهات API',
        'تهيئة تقنية لمحركات البحث',
      ],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: 'https://wepste.com/#order',
        availableLanguage: ['Arabic', 'English'],
      },
      featureList: [
        'تصميم مواقع عربية متجاوبة',
        'إنشاء صفحات هبوط احترافية',
        'تطوير المتاجر الإلكترونية',
        'تطبيقات أندرويد وآيفون وتطبيقات ويب',
        'أنظمة ERP سحابية',
        'تكامل API وأتمتة الأعمال',
        'تهيئة تقنية لمحركات البحث',
      ],
    },
  ],
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
  description:
    'ويب ستيب لخدمات تصميم وتطوير المواقع، المتاجر الإلكترونية، صفحات الهبوط، تطبيقات الجوال، وأنظمة ERP السحابية للشركات في السعودية والإمارات وقطر والكويت والبحرين وعُمان ومصر واليمن والأردن والعراق والمغرب العربي وسائر الدول العربية.',
  keywords: [
    'ويب ستيب',
    'ويب_ستيب',
    'تطوير ويب',
    'تصميم مواقع',
    'إنشاء صفحات هبوط',
    'صفحات هبوط احترافية',
    'برمجة أنظمة ERP',
    'أنظمة ERP سحابية',
    'تطوير تطبيقات الهواتف',
    'تطبيقات أندرويد وآيفون',
    'شركة برمجيات في الوطن العربي',
    'أتمتة الأعمال',
    'تصميم متاجر إلكترونية',
    'برمجة تطبيقات الويب',
    'شركة تقنية معلومات',
    'Landing Pages',
    'Web Development',
    'ERP Systems',
    'Webstep',
    'Web Step',
  ],
  metadataBase: new URL('https://wepste.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
    description:
      'تطوير مواقع ومتاجر إلكترونية وتطبيقات جوال وأنظمة ERP للشركات ورواد الأعمال في السعودية والإمارات والخليج ومصر والمغرب العربي وسائر الدول العربية.',
    url: 'https://wepste.com/',
    siteName: 'ويب ستيب',
    type: 'website',
    locale: 'ar_AR',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ويب ستيب | تطوير ويب وتطبيقات وأنظمة ERP',
    description:
      'حلول برمجية عربية للمواقع والتطبيقات وERP للشركات ورواد الأعمال في مختلف الدول العربية.',
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '96x96' }],
    shortcut: '/icon',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-30E5FSM42H'} />
      </body>
    </html>
  );
}
