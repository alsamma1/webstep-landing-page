import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--bg)]">
      <div className="mb-6">
        <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 mx-auto mb-4">
          <path d="M6 13 L16 35 L24 19 L32 35 L42 13" stroke="#1F8A54" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-6xl font-black text-[var(--text-primary)] mb-2">404</h1>
      <h2 className="text-xl font-700 text-[var(--text-secondary)] mb-4">
        الصفحة غير موجودة
      </h2>
      <p className="text-[var(--text-muted)] mb-8 max-w-sm text-sm">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/" className="btn-primary">
        العودة للرئيسية
      </Link>
    </div>
  )
}
