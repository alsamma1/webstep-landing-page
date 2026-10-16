'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Plus, Search, Edit3, Trash2, Save, X, Mail, Linkedin,
  Check, Shield, KeyRound, User, Lock, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, UserCheck,
  UserX, ShieldCheck, ShieldAlert, Sliders, ExternalLink
} from 'lucide-react'
import { uploadImage } from '@/lib/supabase'
import {
  PERMISSION_OPTIONS,
  ROLE_PRESETS,
  type TeamMemberWithAccount,
  type TeamAccount,
  type TeamPermissionKey
} from '@/lib/team-server'

interface FormState {
  id?: string
  name: string
  role: string
  bio: string
  avatar: string
  skills: string[]
  linkedin: string
  twitter: string
  email: string
  active: boolean
  sort_order: number
  account: {
    can_login: boolean
    username: string
    password: string
    role: string
    roleTitle: string
    permissions: TeamPermissionKey[]
  }
}

const EMPTY_FORM: FormState = {
  name: '',
  role: '',
  bio: '',
  avatar: '',
  skills: [],
  linkedin: '',
  twitter: '',
  email: '',
  active: true,
  sort_order: 0,
  account: {
    can_login: false,
    username: '',
    password: '',
    role: 'editor',
    roleTitle: 'محرر محتوى',
    permissions: ['blog', 'content', 'projects', 'navbar'],
  },
}

export default function TeamAdmin() {
  const [team, setTeam] = useState<TeamMemberWithAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [filterRole, setFilterRole] = useState<'all' | 'login_enabled' | 'display_only'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load team members
  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/team')
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'تعذر تحميل الفريق')
      setTeam(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Team load failed:', error)
      setTeam([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // Handle avatar upload
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const avatar = await uploadImage('team', file, 'members')
      if (avatar) setForm((current) => ({ ...current, avatar }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر رفع الصورة')
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Skills tag adder
  const handleAddSkill = () => {
    const val = skillInput.trim()
    if (val && !form.skills.includes(val)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, val] }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  // Generate strong random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*'
    let pass = ''
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm((prev) => ({
      ...prev,
      account: { ...prev.account, password: pass },
    }))
  }

  // Handle Role preset selection
  const handleRolePresetChange = (roleKey: string) => {
    const preset = ROLE_PRESETS[roleKey]
    if (preset) {
      setForm((prev) => ({
        ...prev,
        account: {
          ...prev.account,
          role: roleKey,
          roleTitle: preset.title,
          permissions: preset.permissions,
        },
      }))
    }
  }

  // Toggle individual permission checkbox
  const togglePermission = (permKey: TeamPermissionKey) => {
    setForm((prev) => {
      const current = prev.account.permissions
      let updated: TeamPermissionKey[]
      if (permKey === 'all') {
        updated = current.includes('all') ? [] : ['all']
      } else {
        const withoutAll = current.filter((k) => k !== 'all')
        if (withoutAll.includes(permKey)) {
          updated = withoutAll.filter((k) => k !== permKey)
        } else {
          updated = [...withoutAll, permKey]
        }
      }
      return {
        ...prev,
        account: {
          ...prev.account,
          role: 'custom',
          roleTitle: 'مخصص',
          permissions: updated,
        },
      }
    })
  }

  // Save member
  const handleSave = async () => {
    if (!form.name.trim()) return alert('الاسم مطلوب')
    if (!form.role.trim()) return alert('المسمى الوظيفي مطلوب')

    if (form.account.can_login) {
      if (!form.account.username.trim()) {
        return alert('اسم المستخدم مطلوب لتفعيل حساب الدخول')
      }
      if (!form.account.password && !form.id) {
        return alert('يرجى تحديد كلمة مرور للحساب الجديد')
      }
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio,
        avatar: form.avatar,
        skills: form.skills,
        linkedin: form.linkedin,
        twitter: form.twitter,
        email: form.email.trim(),
        active: form.active,
        sort_order: form.sort_order,
        account: form.account,
      }

      const url = form.id ? `/api/admin/team/${form.id}` : '/api/admin/team'
      const method = form.id ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ عضو الفريق')

      await load()
      setModal(false)
      setForm(EMPTY_FORM)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر حفظ عضو الفريق')
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف عضو الفريق "${name}" وجميع صلاحياته؟`)) return
    try {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      alert('تعذر حذف العضو')
    }
  }

  // Toggle active status
  const handleToggleActive = async (m: TeamMemberWithAccount) => {
    try {
      await fetch(`/api/admin/team/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !m.active }),
      })
      await load()
    } catch (e) {}
  }

  // Open edit modal
  const handleOpenEdit = (m: TeamMemberWithAccount, startTab: 'profile' | 'account' = 'profile') => {
    setForm({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio || '',
      avatar: m.avatar || '',
      skills: m.skills || [],
      linkedin: m.linkedin || '',
      twitter: m.twitter || '',
      email: m.email || '',
      active: m.active !== false,
      sort_order: m.sort_order || 0,
      account: {
        can_login: Boolean(m.account?.can_login),
        username: m.account?.username || m.email?.split('@')[0] || '',
        password: '', // Left blank unless updated
        role: m.account?.role || 'editor',
        roleTitle: m.account?.roleTitle || ROLE_PRESETS[m.account?.role || 'editor']?.title || 'محرر محتوى',
        permissions: m.account?.permissions || ROLE_PRESETS.editor.permissions,
      },
    })
    setActiveTab(startTab)
    setModal(true)
  }

  // Filtered team list
  const filteredTeam = team.filter((m) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.account?.username?.toLowerCase().includes(q)

    if (!matchesSearch) return false

    if (filterRole === 'login_enabled') return Boolean(m.account?.can_login)
    if (filterRole === 'display_only') return !m.account?.can_login
    return true
  })

  return (
    <div className="space-y-6 text-right">
      {/* ══ HEADER ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
              أعضاء الفريق وصلاحيات الدخول
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F8A54]/10 text-[#1F8A54] border border-[#1F8A54]/20">
              إدارة RBAC
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            إضافة أعضاء الفريق، إنشاء حسابات وكلمات مرور للموظفين، وتحديد صلاحيات الوصول بدقة
          </p>
        </div>

        <button
          onClick={() => {
            setForm(EMPTY_FORM)
            setActiveTab('profile')
            setModal(true)
          }}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 self-start sm:self-auto shadow-md active:scale-95 transition-transform"
        >
          <Plus size={16} />
          <span>إضافة عضو جديد</span>
        </button>
      </div>

      {/* ══ STATS & FILTER BAR ══ */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، المسمى، أو اسم المستخدم..."
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-medium text-[var(--text-primary)] focus:border-[#1F8A54] outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterRole === 'all'
                ? 'bg-[#1F8A54] text-white shadow-sm'
                : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            الكل ({team.length})
          </button>
          <button
            onClick={() => setFilterRole('login_enabled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterRole === 'login_enabled'
                ? 'bg-[#1F8A54] text-white shadow-sm'
                : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck size={13} />
            <span>لديهم حسابات دخول ({team.filter((m) => m.account?.can_login).length})</span>
          </button>
          <button
            onClick={() => setFilterRole('display_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterRole === 'display_only'
                ? 'bg-[#1F8A54] text-white shadow-sm'
                : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            عرض بالموقع فقط ({team.filter((m) => !m.account?.can_login).length})
          </button>
        </div>
      </div>

      {/* ══ TEAM CARDS GRID ══ */}
      {loading ? (
        <div className="text-center py-16 text-sm text-[var(--text-muted)] flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin text-[#1F8A54]" />
          <span>جاري تحميل بيانات الفريق...</span>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)]">
          <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
          <h3 className="font-bold text-base text-[var(--text-primary)] mb-1">لا يوجد أعضاء يطابقون البحث</h3>
          <p className="text-xs text-[var(--text-muted)] mb-5">يمكنك إضافة عضو جديد ومنحه حساباً وصلاحيات دخول بضغطة زر</p>
          <button
            onClick={() => {
              setForm(EMPTY_FORM)
              setModal(true)
            }}
            className="btn-primary px-5 py-2 text-xs"
          >
            إضافة أول عضو
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTeam.map((m) => {
            const hasLogin = Boolean(m.account?.can_login)
            const roleTitle = m.account?.roleTitle || ROLE_PRESETS[m.account?.role || '']?.title || 'عضو'
            const permissionsCount = m.account?.permissions?.includes('all')
              ? 'كاملة'
              : `${m.account?.permissions?.length || 0} أقسام`

            return (
              <div
                key={m.id}
                className={`rounded-3xl border bg-[var(--surface)] p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group ${
                  m.active
                    ? 'border-[var(--border)] hover:border-[#1F8A54]/50'
                    : 'border-[var(--border)] opacity-60 bg-[var(--bg-muted)]'
                }`}
              >
                <div>
                  {/* Top Status & Account Tag */}
                  <div className="flex items-center justify-between mb-4">
                    {hasLogin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F8A54]/15 text-[#1F8A54] border border-[#1F8A54]/30">
                        <ShieldCheck size={12} />
                        <span>{roleTitle}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                        <span>عرض بالموقع</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleToggleActive(m)}
                      title={m.active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        m.active
                          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                      }`}
                    >
                      {m.active ? 'نشط' : 'معطل'}
                    </button>
                  </div>

                  {/* Avatar & Info */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 rounded-3xl mx-auto mb-3 bg-[#1F8A54]/15 flex items-center justify-center text-3xl font-black text-[#1F8A54] overflow-hidden border-2 border-[var(--border)] shadow-md">
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        m.name.charAt(0)
                      )}
                    </div>
                    <h3 className="font-black text-base text-[var(--text-primary)] mb-0.5">
                      {m.name}
                    </h3>
                    <div className="text-xs font-bold text-[#1F8A54] mb-2">{m.role}</div>
                    {m.bio && (
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                        {m.bio}
                      </p>
                    )}
                  </div>

                  {/* Account credentials info box if hasLogin */}
                  {hasLogin && (
                    <div className="p-3 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)] mb-3 text-xs space-y-1 text-right">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)]">اسم الدخول:</span>
                        <span className="font-mono font-bold text-[var(--text-primary)] dir-ltr">
                          {m.account?.username}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)]">الصلاحيات:</span>
                        <span className="font-bold text-[#1F8A54]">{permissionsCount}</span>
                      </div>
                      {m.email && (
                        <div className="flex items-center justify-between text-[11px] truncate">
                          <span className="text-[var(--text-muted)]">البريد:</span>
                          <span className="text-[var(--text-secondary)] truncate max-w-[140px] dir-ltr text-[10px]">
                            {m.email}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills tags */}
                  {m.skills && m.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {m.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(m, 'account')}
                    className="p-2 rounded-xl bg-[#1F8A54]/10 text-[#1F8A54] hover:bg-[#1F8A54]/20 transition-colors text-xs font-bold flex items-center gap-1"
                    title="تعديل حساب الدخول والصلاحيات"
                  >
                    <KeyRound size={14} />
                    <span className="hidden sm:inline">الصلاحيات</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(m, 'profile')}
                      className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="تعديل الملف"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      className="p-2 rounded-xl border border-[var(--border)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-600 transition-colors"
                      title="حذف العضو"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══ ADD / EDIT MODAL ══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-muted)]">
              <div>
                <h3 className="font-black text-base text-[var(--text-primary)]">
                  {form.id ? 'تعديل بيانات وصلاحيات العضو' : 'إضافة عضو جديد للفريق'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  تحديد الملف الشخصي وحساب الدخول للوحة التحكم
                </p>
              </div>
              <button
                onClick={() => setModal(false)}
                className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[var(--border)] px-5 bg-[var(--surface)]">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-[#1F8A54] text-[#1F8A54]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <User size={15} />
                <span>الملف الشخصي بالموقع</span>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'account'
                    ? 'border-[#1F8A54] text-[#1F8A54]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <KeyRound size={15} />
                <span>حساب الدخول والصلاحيات</span>
                {form.account.can_login && (
                  <span className="w-2 h-2 rounded-full bg-[#1F8A54]" />
                )}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {activeTab === 'profile' ? (
                <>
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)]">
                    <div className="w-16 h-16 rounded-2xl bg-[#1F8A54]/15 flex items-center justify-center text-2xl font-black text-[#1F8A54] overflow-hidden border border-[var(--border)] shrink-0">
                      {form.avatar ? (
                        <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        form.name ? form.name.charAt(0) : '؟'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] mb-1">صورة العضو الشخصية</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageUploading}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:border-[#1F8A54] transition-colors"
                        >
                          {imageUploading ? 'جاري الرفع...' : 'رفع صورة من الجهاز'}
                        </button>
                        {form.avatar && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, avatar: '' }))}
                            className="text-xs text-rose-500 hover:underline"
                          >
                            حذف الصورة
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarSelect}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                        الاسم الكامل *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="مثال: م. فهد الشمري"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                        المسمى الوظيفي *
                      </label>
                      <input
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="مثال: كبير مهندسي Full-Stack"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                      النبذة التعريفية (تظهر في الموقع)
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="نبذة مختصرة عن خبراته، تخصصاته، وإنجازاته في الفريق..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm focus:border-[#1F8A54] outline-none resize-none"
                    />
                  </div>

                  {/* Skills tags */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                      المهارات والتقنيات
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        placeholder="مثال: Next.js، TypeScript، Docker..."
                        className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="btn-primary px-4 py-2 text-xs font-bold"
                      >
                        إضافة
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)]"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="text-[var(--text-muted)] hover:text-rose-500"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Social Links */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="user@wepstep.sa"
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                        رابط LinkedIn
                      </label>
                      <input
                        value={form.linkedin}
                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                        رابط منصة X
                      </label>
                      <input
                        value={form.twitter}
                        onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                        placeholder="https://x.com/..."
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
                      />
                    </div>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)]">
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary)]">الظهور في الموقع</div>
                      <div className="text-[11px] text-[var(--text-muted)]">إظهار العضو في صفحة من نحن وفريق العمل</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
                      className={`w-11 h-6 rounded-full transition-all relative ${
                        form.active ? 'bg-[#1F8A54]' : 'bg-[var(--surface)] border border-[var(--border)]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.active ? 'right-1' : 'right-6'
                        }`}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Account Login Toggle */}
                  <div className="p-4 rounded-2xl border border-[var(--border)] bg-gradient-to-l from-[#1F8A54]/10 via-[var(--surface)] to-transparent flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-black text-sm text-[var(--text-primary)]">
                        <KeyRound size={16} className="text-[#1F8A54]" />
                        <span>تفعيل حساب دخول للوحة التحكم</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        تمكين هذا الموظف من تسجيل الدخول للوحة الإدارة عبر اسم مستخدم وكلمة مرور
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          account: { ...prev.account, can_login: !prev.account.can_login },
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${
                        form.account.can_login ? 'bg-[#1F8A54]' : 'bg-[var(--bg-muted)] border border-[var(--border)]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.account.can_login ? 'right-1' : 'right-7'
                        }`}
                      />
                    </button>
                  </div>

                  {form.account.can_login ? (
                    <div className="space-y-4 pt-2">
                      {/* Username & Password */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">
                            اسم المستخدم للدخول (Username) *
                          </label>
                          <input
                            value={form.account.username}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                account: { ...prev.account, username: e.target.value.toLowerCase().replace(/\s+/g, '_') },
                              }))
                            }
                            placeholder="مثال: fahad_dev"
                            dir="ltr"
                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-[var(--text-primary)]">
                              كلمة المرور *
                            </label>
                            <button
                              type="button"
                              onClick={generatePassword}
                              className="text-[11px] font-bold text-[#1F8A54] hover:underline"
                            >
                              توليد كلمة سر قوية
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={form.account.password}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  account: { ...prev.account, password: e.target.value },
                                }))
                              }
                              placeholder={form.id ? 'اتركه فارغاً للإبقاء على كلمة السر الحالية' : 'أدخل كلمة مرور الحساب'}
                              dir="ltr"
                              className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm font-mono focus:border-[#1F8A54] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Role Preset Selector */}
                      <div>
                        <label className="text-xs font-bold text-[var(--text-primary)] mb-2 block">
                          الرتبة والدور الإداري
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(ROLE_PRESETS).map(([key, item]) => {
                            const isSelected = form.account.role === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleRolePresetChange(key)}
                                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#1F8A54] bg-[#1F8A54]/10 text-[#1F8A54]'
                                    : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                <div className="font-bold text-xs">{item.title}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Permissions Checkbox Grid */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                            <Shield size={14} className="text-[#1F8A54]" />
                            <span>صلاحيات الوصول للأقسام:</span>
                          </label>
                          <div className="flex gap-2 text-[11px] font-bold text-[#1F8A54]">
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  account: { ...prev.account, permissions: ['all'], role: 'super_admin', roleTitle: 'مدير عام' },
                                }))
                              }
                              className="hover:underline"
                            >
                              تحديد الكل
                            </button>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  account: { ...prev.account, permissions: [], role: 'custom', roleTitle: 'مخصص' },
                                }))
                              }
                              className="hover:underline text-[var(--text-muted)]"
                            >
                              إلغاء التحديد
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2.5">
                          {PERMISSION_OPTIONS.map((opt) => {
                            const isChecked =
                              form.account.permissions.includes('all') ||
                              form.account.permissions.includes(opt.key)

                            return (
                              <label
                                key={opt.key}
                                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                                  isChecked
                                    ? 'border-[#1F8A54]/40 bg-[#1F8A54]/5'
                                    : 'border-[var(--border)] bg-[var(--bg-muted)] opacity-70 hover:opacity-100'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(opt.key)}
                                  className="w-4 h-4 rounded text-[#1F8A54] focus:ring-[#1F8A54] mt-0.5"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs text-[var(--text-primary)]">
                                    {opt.label}
                                  </div>
                                  <div className="text-[10px] text-[var(--text-muted)] leading-snug">
                                    {opt.desc}
                                  </div>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)] text-xs">
                      تم تعطيل حساب الدخول لهذا العضو، ولن يتمكن من الدخول للوحة التحكم. فعّل المفتاح أعلاه لإنشاء حساب وكلمة سر.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface)]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-7 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md active:scale-95"
              >
                {saving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                <span>{saving ? 'جاري الحفظ...' : 'حفظ البيانات والصلاحيات'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
