export default function BlogLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg)] pt-28 pb-20">
      <div className="container-ws">
        {/* Hero Skeleton */}
        <div className="max-w-2xl space-y-4 mb-12 animate-pulse">
          <div className="h-6 w-36 rounded-full bg-[var(--border)]" />
          <div className="h-12 w-3/4 rounded-2xl bg-[var(--border)]" />
          <div className="h-5 w-full rounded-lg bg-[var(--border)] opacity-60" />
          <div className="h-14 w-full rounded-2xl bg-[var(--border)] mt-6" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex gap-2 mb-12 overflow-x-hidden animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 rounded-xl bg-[var(--border)] shrink-0" />
          ))}
        </div>

        {/* Featured Card Skeleton */}
        <div className="w-full h-80 rounded-3xl bg-[var(--surface)] border border-[var(--border)] animate-pulse mb-14 p-8 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="h-6 w-24 rounded-full bg-[var(--border)]" />
            <div className="h-6 w-20 rounded-full bg-[var(--border)]" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-xl bg-[var(--border)]" />
            <div className="h-4 w-1/2 rounded-lg bg-[var(--border)] opacity-60" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-[var(--border)]" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 w-full rounded-xl bg-[var(--border)]" />
              <div className="h-4 w-24 rounded-md bg-[var(--border)]" />
              <div className="h-6 w-full rounded-md bg-[var(--border)]" />
              <div className="h-4 w-4/5 rounded-md bg-[var(--border)] opacity-60" />
              <div className="h-8 w-full rounded-lg bg-[var(--border)] mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
