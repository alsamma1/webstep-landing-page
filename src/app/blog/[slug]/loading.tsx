export default function ArticleLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      {/* Top Reading Bar Placeholder */}
      <div className="fixed top-0 inset-x-0 h-1 bg-[#1F8A54]/30 z-50 animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8 animate-pulse">
          <div className="h-4 w-14 rounded bg-[var(--border)]" />
          <span className="text-[var(--text-muted)]">/</span>
          <div className="h-4 w-16 rounded bg-[var(--border)]" />
          <span className="text-[var(--text-muted)]">/</span>
          <div className="h-4 w-32 rounded bg-[var(--border)]" />
        </div>

        {/* Header Skeleton */}
        <div className="space-y-4 mb-10 animate-pulse">
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-[var(--border)]" />
            <div className="h-6 w-20 rounded-full bg-[var(--border)]" />
          </div>
          <div className="h-10 sm:h-14 w-full rounded-2xl bg-[var(--border)]" />
          <div className="h-10 sm:h-14 w-3/4 rounded-2xl bg-[var(--border)]" />
          <div className="h-5 w-full rounded-lg bg-[var(--border)] opacity-60" />

          {/* Author Card Skeleton */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--border)]" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-[var(--border)]" />
                <div className="h-3 w-20 rounded bg-[var(--border)] opacity-70" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-16 rounded bg-[var(--border)]" />
              <div className="h-4 w-16 rounded bg-[var(--border)]" />
            </div>
          </div>
        </div>

        {/* Cover Skeleton */}
        <div className="w-full h-72 sm:h-96 rounded-3xl bg-[var(--surface)] border border-[var(--border)] animate-pulse mb-10" />

        {/* Content Paragraph Skeletons */}
        <div className="space-y-6 animate-pulse">
          <div className="h-7 w-48 rounded-lg bg-[var(--border)]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--border)] opacity-70" />
            <div className="h-4 w-11/12 rounded bg-[var(--border)] opacity-70" />
            <div className="h-4 w-4/5 rounded bg-[var(--border)] opacity-70" />
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="h-4 w-full rounded bg-[var(--border)] opacity-80" />
            <div className="h-4 w-3/4 rounded bg-[var(--border)] opacity-80" />
          </div>

          <div className="h-7 w-56 rounded-lg bg-[var(--border)]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--border)] opacity-70" />
            <div className="h-4 w-5/6 rounded bg-[var(--border)] opacity-70" />
            <div className="h-4 w-2/3 rounded bg-[var(--border)] opacity-70" />
          </div>
        </div>
      </div>
    </div>
  )
}
