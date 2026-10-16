'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, BookOpen, FolderKanban, Users, Briefcase,
  MessageCircle, TrendingUp, ArrowUp, ArrowDown, Clock,
  CheckCircle2, AlertCircle, Eye, ChevronRight, Zap, Activity
} from 'lucide-react'
import type { Order } from '@/lib/db'

interface DashboardStats {
  totalOrders: number
  newOrders: number
  inProgress: number
  completed: number
  totalBlog: number
  totalProjects: number
  totalTeam: number
  totalJobs: number
  unreadMessages: number
}

const STATUS_MAP = {
  new: { label: 'جديد', color: '#6366f1', bg: '#6366f115' },
  in_progress: { label: 'قيد التنفيذ', color: '#f59e0b', bg: '#f59e0b15' },
  completed: { label: 'مكتمل', color: '#1F8A54', bg: '#1F8A5415' },
  cancelled: { label: 'ملغي', color: '#ef4444', bg: '#ef444415' },
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0, newOrders: 0, inProgress: 0, completed: 0,
    totalBlog: 0, totalProjects: 0, totalTeam: 0, totalJobs: 0, unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, blogRes, projectsRes, teamRes, jobsRes, messagesRes] = await Promise.all([
          fetch('/api/admin/orders'), fetch('/api/admin/blog'),
          fetch('/api/admin/projects'), fetch('/api/admin/team'),
          fetch('/api/admin/jobs'), fetch('/api/admin/messages'),
        ])
        const [ordersData, blogData, projectsData, teamData, jobsData, messagesData] = await Promise.all([
          ordersRes.json(), blogRes.json(), projectsRes.json(),
          teamRes.json(), jobsRes.json(), messagesRes.json(),
        ])
        setOrders(ordersData.slice(0, 5))
        setStats({
          totalOrders: ordersData.length,
          newOrders: ordersData.filter((o: Order) => o.status === 'new').length,
          inProgress: ordersData.filter((o: Order) => o.status === 'in_progress').length,
          completed: ordersData.filter((o: Order) => o.status === 'completed').length,
          totalBlog: blogData.length,
          totalProjects: projectsData.length,
          totalTeam: teamData.length,
          totalJobs: jobsData.length,
          unreadMessages: messagesData.filter((m: { read: boolean }) => !m.read).length,
        })
      } catch { } finally { setLoading(false) }
    }
    load()
  }, [])

  const STAT_CARDS = [
    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: ShoppingBag, color: '#1F8A54', change: '+١٢٪', href: '/admin/orders' },
    { label: 'طلبات جديدة', value: stats.newOrders, icon: AlertCircle, color: '#6366f1', badge: 'تحتاج مراجعة', href: '/admin/orders' },
    { label: 'قيد التنفيذ', value: stats.inProgress, icon: Activity, color: '#f59e0b', href: '/admin/orders' },
    { label: 'رسائل غير مقروءة', value: stats.unreadMessages, icon: MessageCircle, color: '#ef4444', href: '/admin/messages' },
  ]

  const QUICK_LINKS = [
    { label: 'المدونة', value: stats.totalBlog + ' مقال', icon: BookOpen, color: '#6366f1', href: '/admin/blog' },
    { label: 'الأعمال', value: stats.totalProjects + ' مشروع', icon: FolderKanban, color: '#f59e0b', href: '/admin/projects' },
    { label: 'الفريق', value: stats.totalTeam + ' عضو', icon: Users, color: '#ec4899', href: '/admin/team' },
    { label: 'الوظائف', value: stats.totalJobs + ' وظيفة', icon: Briefcase, color: '#06b6d4', href: '/admin/careers' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#1F8A54]/15 flex items-center justify-center mx-auto">
            <Zap size={24} className="text-[#1F8A54] animate-pulse" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7 text-right">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">لوحة التحكم 👋</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">مرحباً — هذا ملخص شامل لنشاط الموقع.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Clock size={13} />
          <span>آخر تحديث: الآن</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: `${card.color}15` }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                {card.change && (
                  <span className="text-[10px] font-black text-[#1F8A54] flex items-center gap-0.5">
                    <ArrowUp size={10} />{card.change}
                  </span>
                )}
                {card.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black" style={{ background: `${card.color}15`, color: card.color }}>{card.badge}</span>
                )}
              </div>
              <div className="text-2xl font-black text-[var(--text-primary)] mb-0.5">{card.value}</div>
              <div className="text-xs text-[var(--text-muted)]">{card.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map(q => {
          const Icon = q.icon
          return (
            <Link key={q.label} href={q.href}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[var(--surface)] hover:shadow-md transition-all flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${q.color}15` }}>
                <Icon size={16} style={{ color: q.color }} />
              </div>
              <div>
                <div className="text-xs font-black text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors">{q.label}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{q.value}</div>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)] mr-auto shrink-0 group-hover:text-[#1F8A54] transition-colors" />
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-black text-sm text-[var(--text-primary)]">آخر الطلبات</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-[#1F8A54] hover:underline flex items-center gap-1">
            عرض الكل <ChevronRight size={12} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--text-muted)]">لا توجد طلبات بعد</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {orders.map(order => {
              const st = STATUS_MAP[order.status]
              return (
                <div key={order.id} className="p-4 hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#1F8A54]/10 flex items-center justify-center shrink-0 text-[#1F8A54] text-xs font-black">
                    {order.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[var(--text-primary)] truncate">{order.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black shrink-0"
                        style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">{order.service} · {order.phone}</div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-xs font-black text-[var(--text-primary)]">{order.id}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <Link href={`/admin/orders`} className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[#1F8A54] transition-colors">
                    <Eye size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Status Distribution */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-black text-sm text-[var(--text-primary)] mb-4">توزيع حالات الطلبات</h3>
          <div className="space-y-3">
            {Object.entries(STATUS_MAP).map(([key, val]) => {
              const count = key === 'new' ? stats.newOrders : key === 'in_progress' ? stats.inProgress : key === 'completed' ? stats.completed : 0
              const pct = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold" style={{ color: val.color }}>{val.label}</span>
                    <span className="font-black text-[var(--text-primary)]">{count} ({pct}٪)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: val.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-black text-sm text-[var(--text-primary)] mb-4">روابط سريعة</h3>
          <div className="space-y-2">
            {[
              { label: 'إضافة مقال جديد', href: '/admin/blog', color: '#6366f1' },
              { label: 'إضافة مشروع', href: '/admin/projects', color: '#f59e0b' },
              { label: 'إضافة وظيفة', href: '/admin/careers', color: '#ec4899' },
              { label: 'تعديل الإعدادات', href: '/admin/settings', color: '#1F8A54' },
              { label: 'عرض الموقع', href: '/', color: '#06b6d4' },
            ].map(l => (
              <Link key={l.label} href={l.href} target={l.href === '/' ? '_blank' : undefined}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[var(--bg-muted)] transition-colors group"
                style={{ color: l.color }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.color }} />
                {l.label}
                <ChevronRight size={12} className="mr-auto text-[var(--text-muted)] group-hover:text-current" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
