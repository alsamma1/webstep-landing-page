'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import {
  Search, BookOpen, Clock, Eye, Heart, Share2, Play, Video,
  Sparkles, Tag, ArrowUpRight, Check, ShieldCheck, X,
  Filter, Calendar, User, ArrowLeft, Bookmark
} from 'lucide-react'
import type { BlogPost } from '@/data/blog'

interface Props {
  initialPosts: BlogPost[]
}

const CATEGORIES = [
  { key: 'all', label: 'جميع المقالات' },
  { key: 'web', label: 'تطوير المواقع والأنظمة' },
  { key: 'ai-seo', label: 'السيو والذكاء الاصطناعي' },
  { key: 'uiux', label: 'تصميم واجهات UI/UX' },
  { key: 'business', label: 'استراتيجيات ونمو الأعمال' },
  { key: 'portfolio', label: 'ملفات الأعمال والصفحات الشخصية' },
]

export default function BlogClientView({ initialPosts }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<BlogPost | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.categoryKey === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)) ||
        post.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [initialPosts, selectedCategory, searchQuery])

  // Featured post
  const featuredPost = useMemo(() => {
    return initialPosts.find((p) => p.featured) || initialPosts[0]
  }, [initialPosts])

  // Video posts
  const videoPosts = useMemo(() => {
    return initialPosts.filter((p) => p.hasVideo || p.videoUrl)
  }, [initialPosts])

  const handleShare = (post: BlogPost, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/blog/${post.slug}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedSlug(post.slug)
      setTimeout(() => setCopiedSlug(null), 2500)
    }
  }

  const handleCategoryChange = (key: string) => {
    startTransition(() => {
      setSelectedCategory(key)
    })
  }

  return (
    <>
      <main dir="rtl" className="min-h-screen overflow-x-hidden pt-24 pb-20 bg-[var(--bg)]">
        {/* ══ HERO SECTION ══ */}
        <section className="relative py-16 sm:py-24 border-b border-[var(--border)] overflow-hidden">
          {/* Subtle Emerald Atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
              style={{ background: 'radial-gradient(circle, #1F8A54, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
            />
          </div>

          <div className="container-ws relative z-10 text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              <span>مركز المعرفة والحلول الرقمية المتطورة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-5 tracking-tight leading-tight">
              مدونة <span className="text-gradient-green">WebStep</span> التقنية
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed font-normal">
              مقالات تحليلية، دروس عملية، واستراتيجيات برمجية وتسويقية حديثة لبناء وتطوير مشاريعك الرقمية ومواقعك الشخصية بأعلى معايير السرعة والتصدر.
            </p>

            {/* ══ LIVE SEARCH BAR ══ */}
            <div className="max-w-2xl relative mb-8">
              <div
                className="flex items-center gap-3 p-2.5 rounded-2xl border shadow-xl transition-all focus-within:ring-2 focus-within:ring-[#1F8A54] focus-within:border-transparent"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="p-2.5 rounded-xl bg-[#1F8A54]/10 text-[#1F8A54] shrink-0">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن موضوع، تقنية، أو كلمة مفتاحية (مثال: بورتفوليو، سيو، Next.js)..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  aria-label="البحث في مقالات المدونة"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors active:scale-95"
                    aria-label="مسح البحث"
                  >
                    <X size={16} />
                  </button>
                )}
                <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  {filteredPosts.length} مقال
                </span>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <BookOpen size={14} className="text-[#1F8A54]" />
                <span className="font-bold text-[var(--text-primary)]">{initialPosts.length}</span> مقالات مفهرسة
              </span>
              {videoPosts.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                  <Video size={14} className="text-amber-500" />
                  <span className="font-bold text-[var(--text-primary)]">{videoPosts.length}</span> شروحات فيديو
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <ShieldCheck size={14} className="text-[#1F8A54]" />
                فهرسة وتصدر فوري للذكاء الاصطناعي
              </span>
            </div>
          </div>
        </section>

        {/* ══ CATEGORY FILTER PILLS ══ */}
        <section className="py-4 border-b border-[var(--border)] bg-[var(--bg-soft)] sticky top-16 md:top-20 z-30 backdrop-blur-xl">
          <div className="container-ws">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-[var(--text-muted)] ml-2 shrink-0 flex items-center gap-1">
                <Filter size={14} /> التصنيفات:
              </span>
              {CATEGORIES.map(({ key, label }) => {
                const isActive = selectedCategory === key
                const count = key === 'all'
                  ? initialPosts.length
                  : initialPosts.filter(p => p.categoryKey === key || p.category === label).length

                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#1F8A54] text-white shadow-lg shadow-[#1F8A54]/25 scale-[1.02]'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ FEATURED ARTICLE HERO CARD ══ */}
        {!searchQuery && selectedCategory === 'all' && featuredPost && (
          <section className="section-padding bg-[var(--bg)]">
            <div className="container-ws">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1F8A54] animate-pulse" />
                  <h2 className="text-2xl font-black text-[var(--text-primary)]">مقال الأسبوع المميز</h2>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-medium">قراءة موصى بها من فريق التحرير</span>
              </div>

              <div
                className="rounded-3xl overflow-hidden border border-[var(--border)] grid lg:grid-cols-12 gap-0 shadow-2xl transition-all duration-300 hover:border-[#1F8A54]/50 group"
                style={{ background: 'var(--surface)' }}
              >
                {/* Visual Cover / Image (5 Cols) */}
                <div
                  className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white min-h-[340px]"
                  style={{
                    background: featuredPost.cover_image
                      ? `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.6) 100%), url(${featuredPost.cover_image}) center/cover no-repeat`
                      : featuredPost.coverGradient,
                  }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#1F8A54] text-white shadow-md">
                      ⭐ المقال المميز
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md flex items-center gap-1.5">
                      <Clock size={12} /> {featuredPost.readTime}
                    </span>
                  </div>

                  <div className="relative z-10 my-6">
                    <span className="text-xs font-bold text-emerald-300 mb-2 block">
                      {featuredPost.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-sm">
                      {featuredPost.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20 text-xs text-white/90">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black">
                        WS
                      </div>
                      <div>
                        <div className="font-bold">{featuredPost.author.name}</div>
                        <div className="text-[10px] text-white/70">{featuredPost.author.role}</div>
                      </div>
                    </div>
                    <span>{featuredPost.dateDisplay}</span>
                  </div>
                </div>

                {/* Excerpt & Details (7 Cols) */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border)]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                      {featuredPost.excerpt}
                    </p>

                    {/* Highlights bullet points from first section if available */}
                    {featuredPost.sections?.[0]?.content?.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-muted)] mb-3 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-[#1F8A54] mt-1.5 shrink-0" />
                        <span className="line-clamp-2">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border)] mt-6">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="btn-primary text-sm px-6 py-3 flex items-center gap-2 active:scale-95 transition-transform"
                    >
                      <span>قراءة المقال كاملاً</span>
                      <ArrowUpRight size={16} />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleShare(featuredPost, e)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all cursor-pointer active:scale-95"
                        title="مشاركة المقال"
                      >
                        {copiedSlug === featuredPost.slug ? (
                          <>
                            <Check size={14} className="text-[#1F8A54]" />
                            <span className="text-[#1F8A54]">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            <span>مشاركة</span>
                          </>
                        )}
                      </button>

                      {featuredPost.hasVideo && (
                        <button
                          onClick={() => setActiveVideo(featuredPost)}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer active:scale-95"
                        >
                          <Play size={14} className="fill-amber-600" />
                          <span>شاهد الفيديو</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ VIDEO ARTICLES (If any) ══ */}
        {!searchQuery && selectedCategory === 'all' && videoPosts.length > 0 && (
          <section className="py-12 border-y border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="container-ws">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-[#1F8A54] mb-1 block">محتوى مرئي تفاعلي</span>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
                    <Video size={22} className="text-amber-500" />
                    <span>شروحات وفيديوهات تطبيقية</span>
                  </h3>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-medium">فيديوهات إرشادية عملية</span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {videoPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex flex-col group hover:-translate-y-1.5 transition-all duration-300 shadow-md"
                  >
                    <div
                      className="h-44 relative flex items-center justify-center cursor-pointer overflow-hidden"
                      style={{
                        background: post.cover_image
                          ? `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${post.cover_image}) center/cover no-repeat`
                          : post.coverGradient,
                      }}
                      onClick={() => setActiveVideo(post)}
                    >
                      <div className="w-14 h-14 rounded-full bg-white text-[#1F8A54] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <Play size={22} className="fill-[#1F8A54] translate-x-0.5" />
                      </div>
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold bg-black/70 text-white backdrop-blur-sm">
                        فيديو شرح
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-base font-black text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors leading-tight mb-2 line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <span>{post.readTime}</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-bold text-[#1F8A54] hover:underline flex items-center gap-1"
                        >
                          مشاهدة المقال &larr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ ALL ARTICLES GRID ══ */}
        <section className="section-padding bg-[var(--bg)]">
          <div className="container-ws">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                  {searchQuery ? `نتائج البحث عن: "${searchQuery}"` : 'جميع المقالات المنشورة'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  عرض {filteredPosts.length} من أصل {initialPosts.length} مقالات منتقاة
                </p>
              </div>

              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="self-start sm:self-auto text-xs font-bold text-[#1F8A54] hover:underline cursor-pointer"
                >
                  إعادة ضبط الفلاتر والبحث &times;
                </button>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 px-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#1F8A54]/10 text-[#1F8A54] flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">
                  لم نجد أي مقال يطابق بحثك
                </h4>
                <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
                  جرب البحث بكلمات عامة أو اختر تصنيفاً آخر من القائمة في الأعلى.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="btn-primary text-xs px-6 py-2.5 active:scale-95"
                >
                  عرض جميع المقالات
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex flex-col group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 hover:border-[#1F8A54]/40"
                  >
                    {/* Card Cover */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="h-48 relative p-5 flex flex-col justify-between overflow-hidden text-white"
                      style={{
                        background: post.cover_image
                          ? `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.5) 100%), url(${post.cover_image}) center/cover no-repeat`
                          : post.coverGradient,
                      }}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm"
                          style={{ background: post.accentColor }}
                        >
                          {post.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/40 backdrop-blur-sm flex items-center gap-1">
                          <Clock size={11} /> {post.readTime}
                        </span>
                      </div>

                      <div className="relative z-10 mt-auto">
                        <div className="text-xs text-white/80 flex items-center gap-2">
                          <User size={12} /> {post.author.name}
                        </div>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-md border border-[var(--border)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors leading-snug mb-3">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>

                      {/* Excerpt */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Card Footer */}
                      <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} className="text-rose-500 fill-rose-500/20" /> {post.likes}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleShare(post, e)}
                            className="p-2 rounded-xl hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-90"
                            title="مشاركة المقال"
                          >
                            {copiedSlug === post.slug ? (
                              <Check size={14} className="text-[#1F8A54]" />
                            ) : (
                              <Share2 size={14} />
                            )}
                          </button>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-bold text-[#1F8A54] hover:underline flex items-center gap-1 text-xs"
                          >
                            <span>قراءة</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section className="py-16 bg-[var(--bg-soft)] border-t border-[var(--border)]">
          <div className="container-ws">
            <div
              className="p-8 sm:p-12 rounded-3xl border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl"
              style={{ background: 'var(--surface)' }}
            >
              <div className="space-y-3 max-w-xl text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1F8A54]/10 text-[#1F8A54]">
                  <Sparkles size={13} />
                  انطلق مع خبراء WebStep
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                  هل ترغب في امتلاك موقع شخصي أو متجر إلكتروني فائق السرعة؟
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  نحن نصمم ونبني حضورك الرقمي بدفعة واحدة بدون أي اشتراكات دورية، مع تهيئة شاملة للسيو وعصر الذكاء الاصطناعي.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/services/web"
                  className="btn-primary text-sm px-6 py-3 whitespace-nowrap active:scale-95"
                >
                  اطلب موقعك الشخصي الآن &larr;
                </Link>
                <Link
                  href="/#contact"
                  className="px-6 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors whitespace-nowrap"
                >
                  تواصل معنا مباشرة
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ VIDEO POPUP MODAL ══ */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="font-bold text-sm text-[var(--text-primary)] truncate max-w-md">
                  {activeVideo.title}
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-video bg-black">
                {activeVideo.videoUrl && (
                  <iframe
                    src={activeVideo.videoUrl.replace('watch?v=', 'embed/')}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
