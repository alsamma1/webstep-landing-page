'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Eye, EyeOff, Zap, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('يُرجى إدخال اسم المستخدم وكلمة المرور')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'بيانات الدخول غير صحيحة')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push(redirect), 800)
    } catch {
      setError('حدث خطأ في الاتصال — يُرجى المحاولة مجدداً')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4 relative overflow-hidden" dir="rtl">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #1F8A54, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #1F8A54 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-[#1F8A54]/30"
            style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)' }}>
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">لوحة تحكم WebStep</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">منطقة محمية — للمدراء المعتمدين فقط</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden">

          {/* Top bar */}
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-soft)] flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1F8A54]" />
            <span className="text-xs text-[var(--text-muted)] mr-2 font-mono">admin.wepstep.sa</span>
            <div className="mr-auto flex items-center gap-1 text-[10px] text-[#1F8A54] font-bold">
              <Lock size={10} /> محمي بـ SSL
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-7 space-y-5">

            {/* Error / Success */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/25">
                <AlertCircle size={16} className="text-[#ef4444] shrink-0" />
                <p className="text-xs font-bold text-[#ef4444]">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#1F8A54]/10 border border-[#1F8A54]/25">
                <CheckCircle2 size={16} className="text-[#1F8A54] shrink-0" />
                <p className="text-xs font-bold text-[#1F8A54]">تم التحقق بنجاح — جاري التوجيه...</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="text-xs font-black text-[var(--text-primary)] mb-2 block">اسم المستخدم</label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#1F8A54]/10 flex items-center justify-center pointer-events-none">
                  <User size={15} className="text-[#1F8A54]" />
                </div>
                <input
                  id="admin-username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  type="text"
                  autoComplete="username"
                  autoFocus
                  placeholder="admin"
                  className="w-full pr-14 pl-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all text-right font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black text-[var(--text-primary)] mb-2 block">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#1F8A54]/10 flex items-center justify-center pointer-events-none">
                  <Lock size={15} className="text-[#1F8A54]" />
                </div>
                <input
                  id="admin-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  className="w-full pr-14 pl-12 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all text-right font-mono tracking-widest"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-4 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${
                loading || success ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-[#1F8A54]/40'
              }`}
              style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={17} />
                  تم الدخول بنجاح!
                </>
              ) : (
                <>
                  <Shield size={17} />
                  دخول لوحة التحكم
                </>
              )}
            </button>

            {/* Security note */}
            <div className="text-center">
              <p className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                <Lock size={9} />
                جلسة آمنة مشفرة · تنتهي تلقائياً بعد ٧ أيام
              </p>
            </div>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-5">
          <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[#1F8A54] transition-colors flex items-center justify-center gap-1">
            ← العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-sm text-gray-400">جاري التحميل...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
