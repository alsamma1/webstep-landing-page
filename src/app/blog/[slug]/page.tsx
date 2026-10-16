import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ArticleClientView from './ArticleClientView'
import {
  getCachedBlogPostBySlug,
  getAllBlogSlugs,
  getRelatedPosts
} from '@/lib/blog-server'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

// Generate static routes for all blog posts (Supabase + static fallback)
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate dynamic SEO & AI-search metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getCachedBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'المقال غير موجود | WebStep',
      description: 'عذراً، المقال المطلوب غير موجود في مدونة ويب ستيب.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webstep.sa'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const coverImg = post.cover_image || `${siteUrl}/assets/logo/logo.png`

  return {
    title: `${post.title} | مدونة WebStep`,
    description: post.metaDescription || post.excerpt,
    keywords: post.seoKeywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'WebStep',
      locale: 'ar_SA',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: coverImg,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [coverImg],
    },
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
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getCachedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, 3)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webstep.sa'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const coverImg = post.cover_image || `${siteUrl}/assets/logo/logo.png`

  // Schema.org Structured Data for Google AI, ChatGPT, Perplexity & Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    description: post.excerpt,
    image: coverImg,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WebStep',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/logo/logo.png`,
      },
    },
    keywords: post.seoKeywords.join(', '),
    articleBody: post.sections
      .map((s) => `${s.title}: ${s.content.join(' ')}`)
      .join('\n\n'),
    ...(post.faqs && post.faqs.length > 0
      ? {
          hasPart: {
            '@type': 'FAQPage',
            mainEntity: post.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          },
        }
      : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المدونة',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main dir="rtl" className="pt-24 pb-20 overflow-x-hidden bg-[var(--bg)] min-h-screen">
        <ArticleClientView post={post} relatedPosts={relatedPosts} />
      </main>

      <Footer />
    </>
  )
}
