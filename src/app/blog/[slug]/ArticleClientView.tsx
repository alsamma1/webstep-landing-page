'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import {
  Clock, Eye, Heart, Share2, BookOpen, User, Calendar,
  ArrowRight, Check, Play, Bookmark, MessageSquare, Send,
  ChevronDown, CheckCircle2, Sparkles, Volume2,
  Reply, ExternalLink, Link2, ArrowUp, Type,
  Share, CornerDownLeft, ShieldCheck, CheckCheck
} from 'lucide-react'
import type { BlogPost } from '@/data/blog'
import type { BlogComment, ContentBlock } from '@/lib/supabase.types'

interface Props {
  post: BlogPost
  relatedPosts: BlogPost[]
}

// ─── User Fingerprint for Likes ─────────────────────────────
function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  const key = 'wepstep_fp'
  let fp = localStorage.getItem(key)
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, fp)
  }
  return fp
}

// ─── Convert YouTube to embed URL ────────────────────────────
function toYouTubeEmbed(url: string): string {
  if (!url) return ''
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

// ─── Render Content Block ───────────────────────────────────
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading': {
      const level = block.level || 2
      const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
      const sizes = { 2: 'text-2xl sm:text-3xl', 3: 'text-xl sm:text-2xl', 4: 'text-lg sm:text-xl' }
      return (
        <Tag className={`${sizes[level]} font-black text-[var(--text-primary)] border-r-4 border-[#1F8A54] pr-4 leading-tight my-8`}>
          {block.text}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed my-5 font-normal" dir="rtl">
          {block.content}
        </p>
      )

    case 'quote':
      return (
        <blockquote
          className="my-8 p-6 rounded-2xl border-r-4 text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed italic shadow-sm"
          style={{
            background: 'rgba(31,138,84,0.06)',
            border: '1px solid rgba(31,138,84,0.15)',
            borderRightWidth: '5px',
            borderRightColor: '#1F8A54',
          }}
        >
          &ldquo;{block.content}&rdquo;
        </blockquote>
      )

    case 'image': {
      const posClass =
        block.position === 'center'
          ? 'mx-auto max-w-2xl'
          : block.position === 'right'
          ? 'mr-0 ml-auto max-w-md float-left ml-6 mb-6'
          : block.position === 'left'
          ? 'ml-0 mr-auto max-w-md float-right mr-6 mb-6'
          : 'w-full'
      return (
        <figure className={`my-8 ${posClass}`}>
          {block.url && (
            <img
              src={block.url}
              alt={block.alt || block.caption || ''}
              className="w-full rounded-2xl shadow-lg border border-[var(--border)] object-cover"
              loading="lazy"
            />
          )}
          {block.caption && (
            <figcaption className="text-center text-xs text-[var(--text-muted)] mt-2.5 font-medium">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'gallery':
      return (
        <div className="my-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(block.urls || []).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-video overflow-hidden rounded-2xl border border-[var(--border)] hover:opacity-90 hover:scale-[1.02] transition-all shadow-sm"
              >
                <img
                  src={url}
                  alt={`${block.caption || 'صورة'} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          {block.caption && (
            <p className="text-center text-xs text-[var(--text-muted)] mt-2.5 font-medium">
              {block.caption}
            </p>
          )}
        </div>
      )

    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className={`my-6 space-y-3 ${block.ordered ? 'list-decimal list-inside pr-2' : 'list-none'}`}>
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-[var(--text-secondary)] leading-relaxed">
              {!block.ordered && <CheckCircle2 size={18} className="text-[#1F8A54] mt-1 shrink-0" />}
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      )
    }

    case 'video': {
      const embedUrl = toYouTubeEmbed(block.videoUrl || '')
      if (!embedUrl) return null
      return (
        <div className="my-8 rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl">
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title="فيديو يوتيوب"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      )
    }

    case 'link':
      return (
        <div className="my-6">
          <a
            href={block.href || '#'}
            target={block.internal ? '_self' : '_blank'}
            rel={block.internal ? '' : 'noopener noreferrer'}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1F8A54]/10 text-[#1F8A54] font-bold text-sm hover:bg-[#1F8A54]/20 transition-all border border-[#1F8A54]/25 shadow-sm active:scale-95"
          >
            {block.internal ? <Link2 size={16} /> : <ExternalLink size={16} />}
            <span>{block.label || block.href}</span>
          </a>
        </div>
      )

    case 'divider':
      return <hr className="my-10 border-t border-dashed border-[var(--border)]" />

    default:
      return null
  }
}

// ─── Comment Component ──────────────────────────────────────
function CommentCard({
  comment,
  postSlug,
  onReplyAdded,
}: {
  comment: BlogComment & { replies?: BlogComment[] }
  postSlug: string
  onReplyAdded: () => void
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyName, setReplyName] = useState('')
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyName.trim() || !replyText.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: replyName.trim(),
          content: replyText.trim(),
          parent_id: comment.id,
          post_id: comment.post_id,
        }),
      })
      if (res.ok) {
        setSent(true)
        setReplyName('')
        setReplyText('')
        setShowReply(false)
        onReplyAdded()
      }
    } catch {}
    setSending(false)
  }

  return (
    <div className="space-y-3">
      <div
        className="p-5 rounded-2xl border border-[var(--border)] flex gap-4 shadow-sm"
        style={{ background: 'var(--surface)' }}
      >
        <div className="w-10 h-10 rounded-2xl bg-[#1F8A54]/15 text-[#1F8A54] font-black flex items-center justify-center shrink-0 text-sm shadow-inner">
          {comment.name.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="font-bold text-sm text-[var(--text-primary)]">{comment.name}</span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {new Date(comment.created_at).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed" dir="rtl">
            {comment.content}
          </p>
          <button
            onClick={() => setShowReply(!showReply)}
            className="mt-2 text-xs font-bold text-[#1F8A54] hover:underline flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Reply size={12} />
            <span>رد على التعليق</span>
          </button>

          {showReply && (
            <form onSubmit={submitReply} className="mt-3 space-y-2.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
              <input
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                placeholder="اسمك الكريم *"
                required
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:border-[#1F8A54] outline-none"
              />
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك..."
                rows={2}
                required
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] resize-none focus:border-[#1F8A54] outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  {sending ? 'جاري الإرسال...' : <><Send size={11} /> إرسال الرد</>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReply(false)}
                  className="text-xs px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {sent && (
            <div className="mt-2 text-xs text-[#1F8A54] font-bold flex items-center gap-1">
              <Check size={12} /> تم إرسال ردك بنجاح!
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {(comment.replies || []).length > 0 && (
        <div className="mr-6 space-y-2.5 border-r-2 border-[#1F8A54]/30 pr-4">
          {(comment.replies || []).map((reply) => (
            <div
              key={reply.id}
              className="p-4 rounded-xl border border-[var(--border)] flex gap-3 shadow-sm"
              style={{ background: 'var(--bg-muted)' }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 text-[#6366f1] font-black flex items-center justify-center shrink-0 text-xs">
                {reply.name.slice(0, 1)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-[var(--text-primary)]">{reply.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {new Date(reply.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed" dir="rtl">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────
export default function ArticleClientView({ post, relatedPosts }: Props) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const [comments, setComments] = useState<(BlogComment & { replies?: BlogComment[] })[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newText, setNewText] = useState('')
  const [sending, setSending] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [views, setViews] = useState(Number(post.views.replace(/[^\d]/g, '')) || 0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const viewedRef = useRef(false)
  const likeLoadedRef = useRef(false)

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load comments
  const loadComments = useCallback(async () => {
    try {
      const r = await fetch(`/api/blog/${post.slug}/comments`)
      if (r.ok) setComments(await r.json())
    } catch {}
    setCommentsLoaded(true)
  }, [post.slug])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Register view count once
  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    fetch(`/api/blog/${post.slug}/view`, { method: 'POST' })
      .then((r) => r.json())
      .then((d) => {
        if (d.views) setViews(d.views)
      })
      .catch(() => {})
  }, [post.slug])

  // Load initial like status
  useEffect(() => {
    if (likeLoadedRef.current) return
    likeLoadedRef.current = true
    const fp = getFingerprint()
    if (!fp) return
    fetch(`/api/blog/${post.slug}/like?fingerprint=${fp}`)
      .then((r) => r.json())
      .then((d) => {
        setLikes(d.likes)
        setHasLiked(d.liked)
      })
      .catch(() => {})
  }, [post.slug])

  // Like / Unlike action with instant optimistic feedback
  const handleLike = async () => {
    const fp = getFingerprint()
    const nextState = !hasLiked
    setHasLiked(nextState)
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)))

    try {
      const r = await fetch(`/api/blog/${post.slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint: fp, action: nextState ? 'like' : 'unlike' }),
      })
      const d = await r.json()
      if (d.likes !== undefined) setLikes(d.likes)
      if (d.liked !== undefined) setHasLiked(d.liked)
    } catch {}
  }

  const handleShare = (platform: 'wa' | 'x' | 'copy') => {
    const url = window.location.href
    const text = `${post.title} — عبر مدونة WebStep`
    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank')
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else {
      navigator.clipboard?.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newText.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/blog/${post.slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim() || undefined,
          content: newText.trim(),
        }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments((prev) => [{ ...newComment, replies: [] }, ...prev])
        setNewName('')
        setNewEmail('')
        setNewText('')
        setCommentSuccess(true)
        setTimeout(() => setCommentSuccess(false), 4000)
      }
    } catch {}
    setSending(false)
  }

  // Extract content blocks & videos
  const contentBlocks: ContentBlock[] = Array.isArray(post.content_blocks) ? post.content_blocks : []
  const videoUrl = post.videoUrl || ''
  const gallery = post.gallery || []

  // Extract table of contents from sections or blocks
  const tableOfContents = useMemo(() => {
    const items: string[] = []
    if (post.sections && post.sections.length > 0) {
      post.sections.forEach((s) => {
        if (s.title && s.title !== 'محتوى المقال') items.push(s.title)
      })
    }
    if (contentBlocks.length > 0) {
      contentBlocks.forEach((b) => {
        if (b.type === 'heading' && b.text) items.push(b.text)
      })
    }
    return items
  }, [post.sections, contentBlocks])

  // Typography font size mapping
  const contentFontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl sm:text-2xl leading-loose'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-relaxed'
      : 'text-base sm:text-lg leading-relaxed'

  return (
    <>
      {/* ══ TOP READING PROGRESS BAR ══ */}
      <div className="fixed top-0 inset-x-0 h-1.5 z-50 bg-[var(--border)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-[#1F8A54] via-[#10b981] to-[#34d399] transition-all duration-150 ease-out shadow-sm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article dir="rtl" className="max-w-4xl mx-auto px-4 sm:px-6 text-right">
        {/* ══ BREADCRUMBS ══ */}
        <nav aria-label="مسار التصفح" className="mb-8">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)] flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#1F8A54] transition-colors">الرئيسية</Link>
            </li>
            <li className="opacity-40">/</li>
            <li>
              <Link href="/blog" className="hover:text-[#1F8A54] transition-colors">المدونة</Link>
            </li>
            <li className="opacity-40">/</li>
            <li className="text-[var(--text-primary)] font-bold truncate max-w-xs sm:max-w-md">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* ══ ARTICLE HEADER ══ */}
        <header className="mb-10 text-right">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span
              className="px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-sm"
              style={{ background: post.accentColor }}
            >
              {post.category}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] flex items-center gap-1.5 shadow-sm">
              <Clock size={13} className="text-[#1F8A54]" />
              <span>قراءة في {post.readTime}</span>
            </span>
            {videoUrl && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
                <Play size={12} className="fill-amber-600" />
                <span>يتضمن فيديو شرح</span>
              </span>
            )}
          </div>

          {/* Grand Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] leading-tight mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-normal mb-8 border-r-2 border-[#1F8A54]/30 pr-4">
            {post.excerpt}
          </p>

          {/* Author Card & Meta Box */}
          <div
            className="p-5 sm:p-6 rounded-3xl border border-[var(--border)] flex flex-wrap items-center justify-between gap-5 shadow-lg"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-md shrink-0"
                style={{ background: post.accentColor }}
              >
                {post.author.name.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-[var(--text-primary)]">
                  <span>{post.author.name}</span>
                  <ShieldCheck size={16} className="text-[#1F8A54]" />
                </div>
                <div className="text-xs text-[var(--text-muted)] font-medium">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs font-semibold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--text-secondary)]" />
                <span>{post.dateDisplay}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-[#1F8A54]" />
                <span>{views.toLocaleString('ar')} مشاهدة</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                <Heart size={14} className="fill-rose-500/20" />
                <span>{likes} إعجاب</span>
              </span>
            </div>
          </div>
        </header>

        {/* ══ STICKY / FLOATING READING TOOLBAR ══ */}
        <div
          className="sticky top-20 z-20 my-8 p-3 rounded-2xl border border-[var(--border)] backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg"
          style={{ background: 'var(--surface)' }}
        >
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-90 ${
                hasLiked
                  ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30 shadow-sm'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-rose-500'
              }`}
            >
              <Heart size={15} className={hasLiked ? 'fill-rose-600 text-rose-600 animate-bounce' : ''} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-90 ${
                isBookmarked
                  ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-amber-500'
              }`}
              title="حفظ المقال"
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-amber-600' : ''} />
            </button>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 border-r border-[var(--border)] pr-2 mr-1">
              <span className="text-[11px] text-[var(--text-muted)] font-medium ml-1">حجم الخط:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  fontSize === 'normal'
                    ? 'bg-[#1F8A54] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                عادي
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  fontSize === 'large'
                    ? 'bg-[#1F8A54] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                كبير
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  fontSize === 'xlarge'
                    ? 'bg-[#1F8A54] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                كبير جداً
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-[var(--text-muted)] font-medium ml-1">مشاركة:</span>
            <button
              onClick={() => handleShare('wa')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              واتساب
            </button>
            <button
              onClick={() => handleShare('x')}
              className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              منصة X
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all cursor-pointer active:scale-95"
            >
              {copiedLink ? <Check size={13} className="text-[#1F8A54]" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* ══ COVER IMAGE ══ */}
        {post.cover_image && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl relative">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* ══ TABLE OF CONTENTS (فهرس المقال) ══ */}
        {tableOfContents.length > 1 && (
          <div
            className="mb-12 p-6 rounded-3xl border border-[var(--border)] shadow-sm"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center gap-2 mb-4 font-black text-sm text-[var(--text-primary)]">
              <BookOpen size={16} className="text-[#1F8A54]" />
              <span>فهرس ومحاور المقال</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
              {tableOfContents.map((title, idx) => (
                <li key={idx} className="flex items-center gap-2 hover:text-[#1F8A54] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A54]" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ══ YOUTUBE VIDEO (IF ANY) ══ */}
        {videoUrl && (
          <section className="mb-12">
            <div className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={toYouTubeEmbed(videoUrl)}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>
        )}

        {/* ══ CONTENT BLOCKS (Rich content) ══ */}
        {contentBlocks.length > 0 && (
          <div className={`mb-12 ${contentFontSizeClass}`}>
            {contentBlocks.map((block) => (
              <RenderBlock key={block.id} block={block} />
            ))}
          </div>
        )}

        {/* ══ ARTICLE SECTIONS (Standard Content) ══ */}
        {post.sections && post.sections.length > 0 && (
          <div className={`space-y-12 mb-14 ${contentFontSizeClass}`}>
            {post.sections.map((sec, idx) => (
              <section key={idx} className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] border-r-4 border-[#1F8A54] pr-4 leading-tight">
                  {sec.title}
                </h2>
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-[var(--text-secondary)] leading-relaxed font-normal" dir="rtl">
                    {p}
                  </p>
                ))}
                {sec.quote && (
                  <blockquote
                    className="my-8 p-6 rounded-2xl border-r-4 text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed italic"
                    style={{
                      background: 'rgba(31,138,84,0.06)',
                      border: '1px solid rgba(31,138,84,0.15)',
                      borderRightWidth: '5px',
                      borderRightColor: '#1F8A54',
                    }}
                  >
                    &ldquo;{sec.quote}&rdquo;
                  </blockquote>
                )}
                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-3 my-6 pr-0 list-none">
                    {sec.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-base text-[var(--text-secondary)] leading-relaxed">
                        <CheckCircle2 size={18} className="text-[#1F8A54] mt-1 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        {/* ══ GALLERY ══ */}
        {gallery.length > 0 && (
          <section className="mt-12 mb-12">
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <BookOpen size={18} className="text-[#1F8A54]" />
              <span>معرض صور المقال</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video overflow-hidden rounded-2xl border border-[var(--border)] hover:opacity-90 transition-all shadow-sm"
                >
                  <img
                    src={url}
                    alt={`صورة ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ══ FAQS (IF ANY) ══ */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-14 mb-14 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-[#1F8A54]" />
              <h3 className="text-2xl font-black text-[var(--text-primary)]">أسئلة شائعة حول المقال</h3>
            </div>
            <div className="space-y-3">
              {post.faqs.map((faq, fIdx) => {
                const isOpen = openFaq === fIdx
                return (
                  <div
                    key={fIdx}
                    className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm"
                    style={{ background: 'var(--surface)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                      className="w-full flex items-center justify-between p-5 text-right font-bold text-sm sm:text-base text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#1F8A54] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]" dir="rtl">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ══ TAGS ══ */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-muted)] ml-2">الوسوم والكلمات الدلالية:</span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href="/blog"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[#1F8A54] hover:text-[#1F8A54] transition-all shadow-sm"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* ══ AUTHOR PROFILE BOX ══ */}
        <section
          className="mt-12 p-6 sm:p-8 rounded-3xl border border-[var(--border)] flex flex-col sm:flex-row items-center gap-5 shadow-xl"
          style={{ background: 'var(--surface)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-md shrink-0"
            style={{ background: post.accentColor }}
          >
            {post.author.name.slice(0, 1)}
          </div>
          <div className="text-center sm:text-right flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-base text-[var(--text-primary)] mb-1">
              <span>{post.author.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1F8A54]/15 text-[#1F8A54]">
                محرر معتمد
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              فريق التحرير الهندسي والتقني في WebStep، متخصصون في هندسة الواجهات وتطوير الأنظمة السحابية والارتقاء بالمشاريع الرقمية في الشرق الأوسط.
            </p>
          </div>
        </section>

        {/* ══ CTA BANNER (WEBSTEP SERVICES) ══ */}
        <section
          className="mt-12 p-8 sm:p-12 rounded-3xl border border-[var(--border)] text-center relative overflow-hidden text-white shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #092617 0%, #134e2f 50%, #092617 100%)',
          }}
        >
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/15">
              امتلك موقعك الآن بدفعة واحدة
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              هل أنت جاهز لنقل حضورك الرقمي إلى المستوى التالي؟
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              نطور موقعك أو منصتك الخاصة بهوية فائقة وسرعة قصوى مع دومين ودعم كامل وبدون اشتراكات شهرية.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href="/services/web"
                className="btn-primary text-sm px-6 py-3 active:scale-95 shadow-lg shadow-black/30"
              >
                تصفح باقات المواقع (تبدأ من ٣٠٠ ر.س)
              </Link>
              <Link
                href="/#contact"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 active:scale-95"
              >
                طلب استشارة مجانية
              </Link>
            </div>
          </div>
        </section>

        {/* ══ COMMENTS SECTION ══ */}
        <section className="mt-16 pt-10 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <MessageSquare size={22} className="text-[#1F8A54]" />
              <h3 className="text-2xl font-black text-[var(--text-primary)]">
                المناقشات والتعليقات ({comments.length})
              </h3>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleAddComment}
            className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] mb-10 space-y-4 shadow-sm"
            style={{ background: 'var(--surface)' }}
          >
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              شاركنا رأيك أو استفسارك حول موضوع المقال
            </h4>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="اسمك الكريم *"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="بريدك الإلكتروني (اختياري - لن يُنشر)"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54]"
              />
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[#1F8A54] resize-none"
              dir="rtl"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={sending}
                className="btn-primary text-xs px-6 py-2.5 flex items-center gap-1.5 active:scale-95"
              >
                {sending ? 'جاري النشر...' : <><Send size={13} /> نشر التعليق</>}
              </button>
              {commentSuccess && (
                <span className="text-xs text-[#1F8A54] font-bold flex items-center gap-1">
                  <Check size={14} /> تم نشر تعليقك بنجاح! شكراً لمشاركتك.
                </span>
              )}
            </div>
          </form>

          {/* List */}
          <div className="space-y-4">
            {!commentsLoaded ? (
              <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                جاري تحميل التعليقات...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10 text-sm text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-3xl">
                كن أول من يشارك بتعليق على هذا المقال! 💬
              </div>
            ) : (
              comments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  postSlug={post.slug}
                  onReplyAdded={loadComments}
                />
              ))
            )}
          </div>
        </section>

        {/* ══ RELATED ARTICLES ══ */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[var(--text-primary)]">
                مقالات قد تهمك أيضاً
              </h3>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#1F8A54] hover:underline flex items-center gap-1"
              >
                <span>تصفح جميع المقالات</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex flex-col group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:border-[#1F8A54]/40"
                >
                  <div
                    className="h-32 p-4 flex flex-col justify-between text-white relative overflow-hidden"
                    style={{
                      background: rel.cover_image
                        ? `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${rel.cover_image}) center/cover no-repeat`
                        : rel.coverGradient,
                    }}
                  >
                    <span
                      className="self-start px-2 py-0.5 rounded-md text-[10px] font-bold"
                      style={{ background: rel.accentColor }}
                    >
                      {rel.category}
                    </span>
                    <span className="text-[11px] text-white/90 flex items-center gap-1">
                      <Clock size={11} /> {rel.readTime}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors leading-snug line-clamp-2 mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-auto">
                      {rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog Button */}
        <div className="text-center mt-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--text-primary)] hover:border-[#1F8A54] hover:text-[#1F8A54] transition-all shadow-sm active:scale-95"
          >
            <ArrowRight size={16} />
            <span>العودة لمركز المدونة</span>
          </Link>
        </div>
      </article>
    </>
  )
}
