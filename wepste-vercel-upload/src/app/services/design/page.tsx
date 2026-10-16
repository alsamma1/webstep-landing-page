import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'
import { getUiuxDesigns } from '@/lib/uiux-designs-server'
import UiuxPortfolio from './portfolio-client'

export const dynamic = 'force-dynamic'

const fallbackMetadata: Metadata = {
  title: 'تصميم UI/UX احترافي وتجارب رقمية | WebStep',
  description: 'اكتشف أعمال UI/UX وهوية رقمية من WebStep. دراسات تصميم تشمل واجهات تطبيقات ومتاجر ولوحات تحكم، صوراً متعددة، ميزات، وروابط فيديو ونماذج Figma.',
  keywords: ['تصميم UI UX', 'تصميم واجهات', 'تصميم تجربة المستخدم', 'مصمم Figma', 'تصميم تطبيقات', 'تصميم متاجر إلكترونية', 'السعودية'],
  alternates: { canonical: 'https://wepste.com/services/design' },
  openGraph: {
    title: 'استوديو WebStep لتصميم UI/UX',
    description: 'شاهد مشاريع وتجارب UI/UX بتفاصيلها، من الفكرة إلى النموذج التفاعلي.',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://wepste.com/services/design',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/design', fallbackMetadata)
}

export default async function DesignPage() {
  try {
    const designs = (await getUiuxDesigns()).filter(design => design.published)
    return <UiuxPortfolio designs={designs} />
  } catch (error) {
    console.error('UI/UX portfolio page fetch failed:', error)
    return <UiuxPortfolio designs={[]} errorMessage="تعذر تحميل معرض التصاميم من Supabase. يرجى التحقق من إعداد قاعدة البيانات." />
  }
}
