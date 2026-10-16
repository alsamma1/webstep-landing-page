'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, Trash2, MessageCircle, Mail, Phone, RefreshCw, Check } from 'lucide-react'
import type { Message } from '@/lib/db'

function MessagesAdminContent() {
  const searchParams = useSearchParams()
  const targetId = searchParams.get('id')

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/messages')
      const data = await r.json()
      const list = Array.isArray(data) ? data : []
      setMessages(list)

      if (targetId) {
        const found = list.find((m: Message) => m.id === targetId)
        if (found) {
          setSelected(found)
          if (!found.read) {
            markRead(found.id)
          }
        }
      }
    } catch {
      setMessages([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const del = async (id: string) => {
    if (!confirm('حذف هذه الرسالة نهائياً؟')) return
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setSelected(null)
    await load()
  }

  const openWA = (m: Message) => {
    const text = encodeURIComponent(`مرحباً ${m.name}،\n\nبخصوص رسالتك عبر WebStep: "${m.subject}"\n\n`)
    window.open(`https://wa.me/${m.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-5 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">الرسائل والاستفسارات</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {messages.length} رسالة · {messages.filter(m => !m.read).length} غير مقروءة
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-muted)] transition-colors"
          title="تحديث الرسائل"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-[#1F8A54]' : 'text-[var(--text-secondary)]'} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className={`flex-1 space-y-2 ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="text-center py-12 text-sm text-[var(--text-muted)]">جاري التحميل...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-sm text-[var(--text-muted)]">لا توجد رسائل واردة حالياً</div>
          ) : (
            messages.map(m => (
              <div
                key={m.id}
                onClick={() => {
                  setSelected(m)
                  if (!m.read) markRead(m.id)
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === m.id
                    ? 'border-[#1F8A54]/50 bg-[#1F8A54]/5'
                    : !m.read
                    ? 'border-[#6366f1]/30 bg-[#6366f1]/5'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1F8A54]/15 flex items-center justify-center text-[#1F8A54] font-black text-sm shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[var(--text-primary)]">{m.name}</span>
                      {!m.read && <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">{m.subject}</div>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] shrink-0">
                    {new Date(m.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="w-full lg:w-96 shrink-0">
            <div className="sticky top-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl">
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-between">
                <div className="font-black text-sm text-[var(--text-primary)]">{selected.name}</div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-muted)]"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
                    >
                      <Phone size={12} className="text-[#1F8A54]" />
                      <span dir="ltr">{selected.phone}</span>
                    </a>
                  )}
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors"
                    >
                      <Mail size={12} className="text-[#1F8A54]" />
                      {selected.email}
                    </a>
                  )}
                </div>
                <div>
                  <div className="text-xs font-black text-[var(--text-muted)] mb-1">الموضوع</div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">{selected.subject}</div>
                </div>
                <div>
                  <div className="text-xs font-black text-[var(--text-muted)] mb-2">الرسالة</div>
                  <div className="text-sm text-[var(--text-secondary)] leading-relaxed p-3 rounded-xl bg-[var(--bg-muted)] whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                  {selected.phone && (
                    <button
                      onClick={() => openWA(selected)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-sm transition-opacity hover:opacity-90"
                      style={{ background: '#25d366' }}
                    >
                      <MessageCircle size={13} /> رد بواتساب
                    </button>
                  )}
                  <button
                    onClick={() => del(selected.id)}
                    className="py-2.5 px-3 rounded-xl text-xs border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    title="حذف الرسالة"
                  >
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

export default function MessagesAdmin() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[var(--text-muted)]">جاري تحميل الرسائل...</div>}>
      <MessagesAdminContent />
    </Suspense>
  )
}
