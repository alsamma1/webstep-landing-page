import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'تقديم طلب مشروع | WebStep — ويب ستيب',
  description: 'قدّم طلبك الآن لبدء مشروعك الرقمي مع WebStep. نموذج ذكي يتكيف مع خدمتك المختارة ويُظهر ملخص طلبك قبل الإرسال.',
  alternates: { canonical: 'https://wepstep.sa/order' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('order', fallbackMetadata)
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
