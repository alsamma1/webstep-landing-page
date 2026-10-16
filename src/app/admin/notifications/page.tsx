'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell, CheckCheck, ShoppingBag, MessageCircle, Briefcase,
  MessageSquare, Search, RefreshCw, Trash2, ArrowRight,
  Filter, CheckCircle2, Clock, ExternalLink, Sparkles
} from 'lucide-react'
import type { AdminNotification } from '@/components/admin/NotificationBellDropdown'

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterRead, setFilterRead] = useState<string>('all') // 'all' | 'unread' | 'read'
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
      }
    } catch (err) {
      console.error('Error loading notifications:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markAsRead = async (notif: AdminNotification, navigate = false) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, read: true } : n))
    )

    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_read',
          id: notif.id,
          rawId: notif.rawId,
          type: notif.type,
        }),
      })
    } catch (err) {
      console.error('Mark read failed:', err)
    }

    if (navigate) {
      router.push(notif.href)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setActionMessage('تم تحديد جميع الإشعارات كمقروءة')
    setTimeout(() => setActionMessage(null), 3000)

    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_all_read',
          allIds: unreadIds,
        }),
      })
    } catch (err) {
      console.error('Mark all read failed:', err)
    }
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id,
        }),
      })
    } catch (err) {
      console.error('Delete notification failed:', err)
    }
  }

  // Filtered notifications
  const filtered = notifications.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      n.sender.toLowerCase().includes(search.toLowerCase()) ||
      (n.phone && n.phone.includes(search))

    const matchesType = filterType === 'all' || n.type === filterType
    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !n.read) ||
      (filterRead === 'read' && n.read)

    return matchesSearch && matchesType && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const ordersCount = notifications.filter(n => n.type === 'order').length
  const messagesCount = notifications.filter(n => n.type === 'message').length
  const careersCount = notifications.filter(n => n.type === 'career').length

  const getIcon = (type: AdminNotification['type'], color: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={20} style={{ color }} />
      case 'career':
        return <Briefcase size={20} style={{ color }} />
      case 'comment':
        return <MessageSquare size={20} style={{ color }} />
      case 'message':
      default:
        return <MessageCircle size={20} style={{ color }} />
    }
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1F8A54]/10 text-[#1F8A54] font-bold">
              مركز الإشعارات الشامل
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              مرتبط مباشرة بـ Supabase
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            جميع الإشعارات والتنبيهات
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            متابعة فورية لطلبات المشاريع الجديدة، رسائل التواصل، وطلبات التوظيف.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadNotifications}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-[#1F8A54]' : ''} />
            <span>تحديث البيانات</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <CheckCheck size={16} />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => { setFilterType('all'); setFilterRead('all') }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'all' && filterRead === 'all'
              ? 'border-[#1F8A54] bg-[#1F8A54]/5 shadow-sm'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div className="text-xs text-[var(--text-muted)] font-bold mb-1">إجمالي الإشعارات</div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{notifications.length}</div>
        </div>

        <div
          onClick={() => { setFilterType('all'); setFilterRead('unread') }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterRead === 'unread'
              ? 'border-[#ef4444] bg-[#ef4444]/5 shadow-sm'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div className="text-xs text-[#ef4444] font-bold mb-1">غير مقروءة</div>
          <div className="text-2xl font-black text-[#ef4444]">{unreadCount}</div>
        </div>

        <div
          onClick={() => { setFilterType('order'); setFilterRead('all') }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'order'
              ? 'border-[#1F8A54] bg-[#1F8A54]/5 shadow-sm'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div className="text-xs text-[#1F8A54] font-bold mb-1">طلبات المشاريع</div>
          <div className="text-2xl font-black text-[#1F8A54]">{ordersCount}</div>
        </div>

        <div
          onClick={() => { setFilterType('message'); setFilterRead('all') }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'message'
              ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-sm'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div className="text-xs text-[#6366f1] font-bold mb-1">رسائل التواصل</div>
          <div className="text-2xl font-black text-[#6366f1]">{messagesCount}</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم، الخدمة، الهاتف، أو نص الإشعار..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] outline-none"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'order', label: 'طلبات المشاريع' },
            { id: 'message', label: 'رسائل تواصل' },
            { id: 'career', label: 'التوظيف' },
            { id: 'comment', label: 'المدونة' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-2 rounded-xl transition-all ${
                filterType === f.id
                  ? 'bg-[#1F8A54] text-white shadow-sm'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Read Status Toggle */}
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-1 text-xs font-bold">
          <button
            onClick={() => setFilterRead('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterRead === 'all'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)]'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterRead('unread')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterRead === 'unread'
                ? 'bg-[#ef4444] text-white shadow-sm'
                : 'text-[var(--text-muted)]'
            }`}
          >
            غير المقروءة ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <RefreshCw size={24} className="animate-spin text-[#1F8A54] mx-auto" />
            <p className="text-sm font-bold text-[var(--text-muted)]">جاري تحميل الإشعارات من Supabase...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
              <Bell size={28} />
            </div>
            <h3 className="text-base font-black text-[var(--text-primary)]">لا توجد إشعارات مطابقة</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              لم نجد أي إشعارات وفق معايير الفلترة المحددة حالياً.
            </p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-wrap sm:flex-nowrap items-start justify-between gap-4 ${
                !notif.read
                  ? 'border-[#1F8A54]/40 bg-[#1F8A54]/5'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: `${notif.color}18` }}
                >
                  {getIcon(notif.type, notif.color)}
                </div>

                {/* Info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{
                        background: `${notif.color}20`,
                        color: notif.color,
                      }}
                    >
                      {notif.badgeText}
                    </span>

                    {!notif.read && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#1F8A54] text-white">
                        جديد غير مقروء
                      </span>
                    )}

                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <Clock size={12} />
                      <span>{formatDate(notif.createdAt)}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[var(--text-primary)] leading-snug">
                    {notif.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {notif.subtitle}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                <button
                  onClick={() => markAsRead(notif, true)}
                  className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  title="الانتقال لصفحة الطلب / الرسالة ومتابعته"
                >
                  <span>عرض ومتابعة</span>
                  <ExternalLink size={13} />
                </button>

                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif, false)}
                    className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:bg-[var(--bg-muted)] transition-colors"
                    title="تحديد كمقروء"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                  title="إخفاء الإشعار"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
