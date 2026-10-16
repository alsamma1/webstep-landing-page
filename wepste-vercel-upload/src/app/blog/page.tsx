import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BlogClientView from './BlogClientView'
import { getPublishedBlogPosts } from '@/lib/blog-server'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'مدونة WebStep المعرفية | مقالات وحلول رقمية لتطوير المواقع والأنظمة',
  description: 'أحدث المقالات والاستراتيجيات في بناء المواقع والأنظمة، تحسين محركات البحث، عصر الذكاء الاصطناعي، وتصميم واجهات وتجربة المستخدم UI/UX.',
  keywords: [
    'مدونة ويب ستيب', 'تطوير المواقع', 'تصميم واجهات', 'سيو الذكاء الاصطناعي',
    'بورتفوليو احترافي', 'مواقع تعريفية', 'Next.js', 'برمجة مواقع بالسعودية'
  ],
  alternates: {
    canonical: 'https://webstep.sa/blog',
  },
  openGraph: {
    title: 'مدونة WebStep المعرفية | حلول برمجية وتصميم واجهات متطورة',
    description: 'مقالات حصرية في تصميم وتطوير المواقع والأنظمة السحابية والارتقاء بالأعمال الرقمية.',
    url: 'https://webstep.sa/blog',
    siteName: 'WebStep',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: 'https://webstep.sa/assets/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'WebStep Blog',
      },
    ],
  },
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'مدونة WebStep المعرفية',
    description: 'مركز المعرفة والحلول الرقمية المتطورة للشركات ورواد الأعمال والمستقلين',
    url: 'https://webstep.sa/blog',
    publisher: {
      '@type': 'Organization',
      name: 'WebStep',
      logo: {
        '@type': 'ImageObject',
        url: 'https://webstep.sa/assets/logo/logo.png',
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      url: `https://webstep.sa/blog/${post.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <BlogClientView initialPosts={posts} />
      <Footer />
    </>
  )
}
