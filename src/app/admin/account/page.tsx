'use client'

import { useEffect, useState } from 'react'
import {
  User, Lock, Mail, Shield, KeyRound, CheckCircle2,
  AlertCircle, Eye, EyeOff, Save, RefreshCw, Sparkles,
  Database, Clock, Check, X, ShieldAlert
} from 'lucide-react'

interface AccountData {
  name: string
  username: string
  email: string
  updatedAt?: string
  isSupabaseConnected?: boolean
}

export default function AccountPage() {
  const [account, setAccount] = useState<AccountData>({
    name: '',
    username: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Toggle visibility
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetch('/api/admin/account')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setAccount({
            name: data.name || '',
            username: data.username || '',
            email: data.email || '',
            updatedAt: data.updatedAt,
            isSupabaseConnected: data.isSupabaseConnected ?? true,
          })
        }
      })
      .catch((err) => {
        console.error('Failed to load account:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[A-Z]/.test(pass) || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'ضعيفة', color: 'bg-red-500', text: 'text-red-500' }
    if (score === 2) return { score: 2, label: 'متوسطة', color: 'bg-amber-500', text: 'text-amber-500' }
    if (score === 3) return { score: 3, label: 'جيدة', color: 'bg-[#10b981]', text: 'text-[#10b981]' }
    return { score: 4, label: 'قوية وممتازة', color: 'bg-[#1F8A54]', text: 'text-[#1F8A54]' }
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!currentPassword) {
      setError('يرجى إدخال كلمة المرور الحالية لتأكيد حفظ التعديلات.')
      return
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError('كلمة المرور الجديدة يجب أن تتكون من 6 خانات على الأقل.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('كلمة المرور الجديدة وتأكيدها غير متطابقين.')
        return
      }
    }

    setSaving(true)

    try {
      const res = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: account.name,
          username: account.username,
          email: account.email,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'فشل تحديث بيانات الحساب')
        setSaving(false)
        return
      }

      setSuccess(data.message || 'تم تحديث بيانات الحساب وكلمة المرور بنجاح في قاعدة البيانات!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      if (data.account) {
        setAccount((prev) => ({
          ...prev,
          name: data.account.name,
          username: data.account.username,
          email: data.account.email,
          updatedAt: data.account.updatedAt,
        }))
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.')
    } finally {
      setSaving(false)
    }
  }

  const formatArabicDate = (dateStr?: string) => {
    if (!dateStr) return 'غير محدد'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-sm text-[var(--text-muted)] gap-3">
        <RefreshCw size={26} className="animate-spin text-[#1F8A54]" />
        <span>جاري مزامنة وقراءة بيانات الحساب من Supabase...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1F8A54] to-[#10b981] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#1F8A54]/25">
              {account.name ? account.name.charAt(0) : 'م'}
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-[var(--surface)] flex items-center justify-center shadow-sm" title="متصل ونشط">
              <Check size={10} className="text-white font-bold" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {account.name || 'حسابي وأمان الدخول'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A54]/15 text-[#1F8A54] text-[10px] font-black border border-[#1F8A54]/25">
                المدير العام
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-2">
              <span>اسم المستخدم:</span>
              <code className="text-[#1F8A54] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border)]">
                {account.username || 'admin'}
              </code>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-bold border border-[#1F8A54]/20">
            <Database size={13} />
            <span>متصل بقاعدة البيانات Supabase</span>
          </div>
          {account.updatedAt && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] font-medium border border-[var(--border)]">
              <Clock size={12} />
              <span>آخر تحديث: {formatArabicDate(account.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs sm:text-sm font-bold shadow-sm animate-fadeIn">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-[#1F8A54]/25 bg-[#1F8A54]/10 text-[#1F8A54] text-xs sm:text-sm font-bold shadow-sm animate-fadeIn">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Personal Info */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-muted)]/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User size={18} className="text-[#1F8A54]" />
              <h3 className="font-black text-sm text-[var(--text-primary)]">المعلومات الشخصية وبيانات الحساب</h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">مرتبطة بـ site_settings في Supabase</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                  الاسم الكامل أو اللقب المعروض
                </label>
                <div className="relative">
                  <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    placeholder="مثال: المدير العام"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                  اسم المستخدم لتسجيل الدخول (Username)
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={account.username}
                    onChange={(e) => setAccount({ ...account, username: e.target.value })}
                    placeholder="admin"
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                البريد الإلكتروني للإشعارات والتواصل
              </label>
              <div className="relative">
                <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  placeholder="admin@wepstep.sa"
                  dir="ltr"
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Password */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-muted)]/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock size={18} className="text-[#1F8A54]" />
              <h3 className="font-black text-sm text-[var(--text-primary)]">أمان الحساب وكلمة المرور</h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">
              اترك حقول كلمة المرور الجديدة فارغة إذا كنت تريد فقط تعديل بيانات الاسم والبريد
            </span>
          </div>

          <div className="p-6 space-y-5">
            {/* Current Password - Mandatory */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block flex items-center justify-between">
                <span>
                  كلمة المرور الحالية <span className="text-red-500">* (مطلوبة لتأكيد أي عملية تعديل)</span>
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية لحسابك"
                  dir="ltr"
                  className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password & Confirm */}
            <div className="border-t border-[var(--border)] pt-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-[#1F8A54]" />
                <h4 className="text-xs font-black text-[var(--text-primary)]">تعيين كلمة مرور جديدة (اختياري)</h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6 أحرف أو أرقام على الأقل"
                      dir="ltr"
                      className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)]">قوة كلمة المرور:</span>
                        <span className={`font-bold ${passwordStrength.text}`}>{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full flex-1 rounded-full transition-colors ${
                              step <= passwordStrength.score ? passwordStrength.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-black text-[var(--text-primary)] mb-1.5 block">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      dir="ltr"
                      className={`w-full pr-4 pl-10 py-2.5 rounded-xl border bg-[var(--bg-muted)] text-sm outline-none font-mono transition-all ${
                        passwordsMatch
                          ? 'border-[#1F8A54] ring-1 ring-[#1F8A54]/20'
                          : passwordsMismatch
                          ? 'border-red-500 ring-1 ring-red-500/20'
                          : 'border-[var(--border)] focus:border-[#1F8A54]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {confirmPassword && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold">
                      {passwordsMatch ? (
                        <span className="text-[#1F8A54] flex items-center gap-1">
                          <Check size={13} /> كلمتا المرور متطابقتان
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <X size={13} /> كلمتا المرور غير متطابقتين
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {newPassword && (
              <div className="flex items-center gap-2.5 text-xs text-[#1F8A54] bg-[#1F8A54]/10 p-3.5 rounded-xl border border-[#1F8A54]/20">
                <Sparkles size={16} className="shrink-0" />
                <span>
                  عند حفظ كلمة المرور الجديدة، ستُخزن فوراً في قاعدة بيانات Supabase وستتمكن من استخدامها لتسجيل الدخول في المرة القادمة.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
            <ShieldAlert size={14} className="text-[#1F8A54]" />
            <span>يتم تشفير وتحديث بيانات الدخول وفق أعلى معايير الحماية</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-9 py-3 rounded-xl text-sm font-black text-white shadow-lg hover:shadow-xl transition-all"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>جاري الحفظ والتأكيد...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>حفظ التعديلات وتأكيد الحساب</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
