import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'سياسة الخصوصية | WebStep',
  description: 'كيف تجمع WebStep بياناتك وتستخدمها وتحميها. سياسة خصوصية شاملة وشفافة.',
  alternates: { canonical: 'https://wepstep.sa/privacy' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('privacy', fallbackMetadata)
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
