'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, Filter, Eye, Trash2, CheckCircle2, Clock,
  AlertCircle, Activity, Phone, Mail, MessageCircle,
  ChevronDown, X, Send, Download, RefreshCw
} from 'lucide-react'
import type { Order } from '@/lib/db'

const STATUS_MAP = {
  new: { label: 'جديد', color: '#6366f1', bg: '#6366f115' },
  in_progress: { label: 'قيد التنفيذ', color: '#f59e0b', bg: '#f59e0b15' },
  completed: { label: 'مكتمل', color: '#1F8A54', bg: '#1F8A5415' },
  cancelled: { label: 'ملغي', color: '#ef4444', bg: '#ef444415' },
}

function OrdersAdminContent() {
  const searchParams = useSearchParams()
  const targetId = searchParams.get('id')

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<'all' | 'ye' | 'other'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      const list = Array.isArray(data) ? data : []
      setOrders(list)
      if (targetId) {
        const found = list.find((o: Order) => o.id === targetId)
        if (found) setSelectedOrder(found)
      }
    } catch {
      setOrders([])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = orders.filter(o => {
    const matchSearch = o.name.includes(search) || o.phone.includes(search) || o.service.includes(search) || o.id.includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchRegion = regionFilter === 'all' || (regionFilter === 'ye' ? o.region === 'ye' : o.region !== 'ye')
    return matchSearch && matchStatus && matchRegion
  })

  const yemenCount = orders.filter(o => o.region === 'ye').length

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await load()
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null)
    }
    setUpdating(null)
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    if (selectedOrder?.id === id) setSelectedOrder(null)
    await load()
  }

  const openWhatsApp = (order: Order) => {
    const text = encodeURIComponent(`مرحباً ${order.name}،\n\nشكراً لتواصلك مع WebStep بخصوص طلب ${order.service}.\n\nسنتواصل معك قريباً لمناقشة التفاصيل.\n\nفريق WebStep`)
    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank')
  }

  const stats = [
    { label: 'الكل', count: orders.length, status: 'all', color: '#6b7280' },
    { label: 'جديدة', count: orders.filter(o => o.status === 'new').length, status: 'new', color: '#6366f1' },
    { label: 'قيد التنفيذ', count: orders.filter(o => o.status === 'in_progress').length, status: 'in_progress', color: '#f59e0b' },
    { label: 'مكتملة', count: orders.filter(o => o.status === 'completed').length, status: 'completed', color: '#1F8A54' },
    { label: 'ملغاة', count: orders.filter(o => o.status === 'cancelled').length, status: 'cancelled', color: '#ef4444' },
  ]

  return (
    <div className="space-y-5 text-right">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">إدارة الطلبات</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">إجمالي {orders.length} طلب</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin text-[#1F8A54]' : 'text-[var(--text-secondary)]'} />
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {stats.map(s => (
          <button key={s.status} onClick={() => setStatusFilter(s.status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              statusFilter === s.status ? 'text-white border-transparent shadow-md' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
            }`}
            style={{ background: statusFilter === s.status ? s.color : undefined }}>
            {s.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${statusFilter === s.status ? 'bg-white/25 text-white' : 'bg-[var(--bg-muted)]'}`}>
              {s.count}
            </span>
          </button>
        ))}
        {/* Region filter */}
        <div className="flex gap-1.5 mr-auto border border-[var(--border)] rounded-xl p-1 bg-[var(--bg-muted)]">
          {([['all', 'الكل', '🌐'], ['ye', '🇾🇪 اليمن', ''], ['other', '🌍 بقية العالم', '']] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setRegionFilter(val)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                regionFilter === val ? (val === 'ye' ? 'bg-emerald-600 text-white shadow' : 'bg-[var(--surface)] shadow text-[#1F8A54]') : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}>
              {lbl}{val === 'ye' && yemenCount > 0 && <span className="mr-1 bg-emerald-100 text-emerald-700 px-1 rounded-full text-[9px]">{yemenCount}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Orders List */}
        <div className={`flex-1 min-w-0 space-y-3 ${selectedOrder ? 'hidden lg:block' : ''}`}>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، رقم الهاتف، الخدمة..."
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all text-right" />
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-[var(--text-muted)]">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-[var(--text-muted)]">لا توجد نتائج</div>
          ) : (
            <div className="space-y-2">
              {filtered.map(order => {
                const st = STATUS_MAP[order.status]
                const isSelected = selectedOrder?.id === order.id
                return (
                  <div key={order.id}
                    onClick={() => setSelectedOrder(isSelected ? null : order)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'border-[#1F8A54]/50 bg-[#1F8A54]/5' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[#1F8A54]/30'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                        style={{ background: st.color }}>
                        {order.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-sm text-[var(--text-primary)]">{order.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black"
                            style={{ background: st.bg, color: st.color }}>{st.label}</span>
                          {order.region === 'ye' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-700">🇾🇪 اليمن</span>
                          )}
                          {updating === order.id && <RefreshCw size={11} className="animate-spin text-[var(--text-muted)]" />}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-3">
                          <span>{order.service}</span>
                          <span>·</span>
                          <span dir="ltr">{order.phone}</span>
                          {order.budget && <><span>·</span><span>{order.budget}</span></>}
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="text-[10px] font-black text-[var(--text-muted)]">{order.id}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="w-full lg:w-96 shrink-0">
            <div className="sticky top-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl">
              {/* Header */}
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-[var(--text-primary)]">{selectedOrder.id}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {new Date(selectedOrder.createdAt).toLocaleString('ar-SA')}
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)]">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Client Info */}
                <div>
                  <div className="text-xs font-black text-[var(--text-muted)] mb-2">معلومات العميل</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-black text-[var(--text-primary)]">{selectedOrder.name}</span>
                    </div>
                    <a href={`tel:${selectedOrder.phone}`} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#1F8A54]">
                      <Phone size={12} className="text-[#1F8A54]" />
                      <span dir="ltr">{selectedOrder.phone}</span>
                    </a>
                    {selectedOrder.email && (
                      <a href={`mailto:${selectedOrder.email}`} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#1F8A54]">
                        <Mail size={12} className="text-[#1F8A54]" />
                        {selectedOrder.email}
                      </a>
                    )}
                    {selectedOrder.company && (
                      <div className="text-xs text-[var(--text-secondary)]">🏢 {selectedOrder.company}</div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <div className="text-xs font-black text-[var(--text-muted)] mb-2">تفاصيل الطلب</div>
                  <div className="space-y-2">
                    {selectedOrder.region && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">المنطقة الجغرافية:</span>
                        <span className={`font-black px-2 py-0.5 rounded-full ${
                          selectedOrder.region === 'ye' ? 'bg-emerald-100 text-emerald-700' : 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
                        }`}>
                          {selectedOrder.region === 'ye' ? '🇾🇪 اليمن' : selectedOrder.region === 'sa' ? '🇸🇦 السعودية' : '🌍 دولية'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">الخدمة:</span>
                      <span className="font-bold text-[var(--text-primary)]">{selectedOrder.service}</span>
                    </div>
                    {selectedOrder.budget && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">الميزانية:</span>
                        <span className="font-black text-[#1F8A54]">{selectedOrder.budget}</span>
                      </div>
                    )}
                    {selectedOrder.timeline && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">المدة:</span>
                        <span className="font-bold text-[var(--text-primary)]">{selectedOrder.timeline}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answers */}
                {selectedOrder.answers && Object.keys(selectedOrder.answers).length > 0 && (
                  <div>
                    <div className="text-xs font-black text-[var(--text-muted)] mb-2">إجابات النموذج</div>
                    <div className="space-y-1.5">
                      {Object.entries(selectedOrder.answers).map(([k, v]) => (
                        <div key={k} className="text-xs p-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] block mb-0.5">{k}:</span>
                          <span className="font-bold text-[var(--text-primary)]">{Array.isArray(v) ? v.join('، ') : v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <div className="text-xs font-black text-[var(--text-muted)] mb-2">ملاحظات</div>
                    <div className="text-xs text-[var(--text-secondary)] p-3 rounded-xl bg-[var(--bg-muted)] leading-relaxed">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <div className="text-xs font-black text-[var(--text-muted)] mb-2">تغيير الحالة</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <button key={key}
                        onClick={() => updateStatus(selectedOrder.id, key)}
                        disabled={selectedOrder.status === key}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                          selectedOrder.status === key ? 'opacity-100 border-transparent text-white' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-transparent hover:text-white'
                        }`}
                        style={{
                          background: selectedOrder.status === key ? val.color : undefined,
                          '--hover-bg': val.color,
                        } as React.CSSProperties}
                        onMouseEnter={e => { if (selectedOrder.status !== key) { (e.currentTarget as HTMLElement).style.background = val.color } }}
                        onMouseLeave={e => { if (selectedOrder.status !== key) { (e.currentTarget as HTMLElement).style.background = '' } }}
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                  <button onClick={() => openWhatsApp(selectedOrder)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5"
                    style={{ background: '#25d366' }}>
                    <MessageCircle size={13} /> واتساب
                  </button>
                  <button onClick={() => deleteOrder(selectedOrder.id)}
                    className="py-2.5 px-3 rounded-xl text-xs font-black text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrdersAdmin() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[var(--text-muted)]">جاري تحميل الطلبات...</div>}>
      <OrdersAdminContent />
    </Suspense>
  )
}
