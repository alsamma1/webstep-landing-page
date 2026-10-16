'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell, CheckCheck, ExternalLink, ShoppingBag, MessageCircle,
  Briefcase, MessageSquare, Clock, ArrowRight, X, ChevronLeft
} from 'lucide-react'

export interface AdminNotification {
  id: string
  rawId: string
  type: 'order' | 'message' | 'career' | 'comment' | 'system'
  title: string
  subtitle: string
  sender: string
  phone?: string
  email?: string
  service?: string
  status?: string
  read: boolean
  createdAt: string
  href: string
  badgeText: string
  color: string
}

function timeAgo(dateString: string): string {
  try {
    const now = new Date().getTime()
    const past = new Date(dateString).getTime()
    const diffSec = Math.floor((now - past) / 1000)

    if (diffSec < 60) return 'الآن'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'أمس'
    if (diffDays < 30) return `منذ ${diffDays} يوم`
    return new Date(dateString).toLocaleDateString('ar-SA')
  } catch {
    return 'مؤخراً'
  }
}

export default function NotificationBellDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'unread' | 'all'>('unread')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications')
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for live new incoming orders and messages
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleMarkAsRead = async (notif: AdminNotification) => {
    // Optimistic UI update
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

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
      console.error('Error marking read:', err)
    }

    setIsOpen(false)
    router.push(notif.href)
  }

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)

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
      console.error('Error marking all as read:', err)
    }
  }

  const unreadList = notifications.filter(n => !n.read)
  const displayList = tab === 'unread' ? unreadList : notifications

  const getIcon = (type: AdminNotification['type'], color: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={16} style={{ color }} />
      case 'career':
        return <Briefcase size={16} style={{ color }} />
      case 'comment':
        return <MessageSquare size={16} style={{ color }} />
      case 'message':
      default:
        return <MessageCircle size={16} style={{ color }} />
    }
  }

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        title="الإشعارات والتنبيهات"
        aria-label="الإشعارات"
        className={`relative p-2 rounded-xl transition-all ${
          isOpen
            ? 'bg-[#1F8A54]/15 text-[#1F8A54]'
            : 'hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]'
        }`}
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-bounce-subtle' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 99 ? '+99' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto sm:left-0 mt-3 w-[360px] sm:w-[400px] max-w-[92vw] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl z-50 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[var(--text-primary)]">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444]">
                  {unreadCount} جديدة
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#1F8A54] hover:underline flex items-center gap-1"
                  title="تحديد كل الإشعارات كمقروءة"
                >
                  <CheckCheck size={13} />
                  <span>قراءة الكل</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--text-muted)]"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Unread vs All */}
          <div className="flex border-b border-[var(--border)] text-xs font-bold bg-[var(--surface)] px-2 pt-1">
            <button
              onClick={() => setTab('unread')}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                tab === 'unread'
                  ? 'border-[#1F8A54] text-[#1F8A54]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              غير المقروءة ({unreadList.length})
            </button>
            <button
              onClick={() => setTab('all')}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                tab === 'all'
                  ? 'border-[#1F8A54] text-[#1F8A54]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              الكل ({notifications.length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--border)]">
            {displayList.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
                  <Bell size={22} />
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {tab === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد أي إشعارات حالياً'}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  عند ورود طلبات أو رسائل جديدة ستظهر هنا مباشرة
                </p>
              </div>
            ) : (
              displayList.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative hover:bg-[var(--bg-muted)] ${
                    !notif.read ? 'bg-[#1F8A54]/5' : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${notif.color}15` }}
                  >
                    {getIcon(notif.type, notif.color)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded"
                          style={{
                            background: `${notif.color}20`,
                            color: notif.color,
                          }}
                        >
                          {notif.badgeText}
                        </span>
                        <h4 className="text-xs font-black text-[var(--text-primary)] truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-medium">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {notif.subtitle}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#1F8A54] shrink-0 mt-2 self-start" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer: View All Notifications Button */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-between">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-3 rounded-xl bg-[var(--surface)] hover:bg-[#1F8A54] hover:text-white border border-[var(--border)] hover:border-transparent text-xs font-bold text-center text-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>عرض كل الإشعارات</span>
              <ChevronLeft size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
