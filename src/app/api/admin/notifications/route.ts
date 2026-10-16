import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      unreadNotifications: [],
      error: 'إعدادات Supabase غير متوفرة',
    })
  }

  const supabase = getServerClient()

  try {
    // 1. Fetch read and dismissed ID sets from site_settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['admin_read_notifications', 'admin_dismissed_notifications'])

    const readIdsList: string[] = (settingsData?.find((s: any) => s.key === 'admin_read_notifications')?.value as string[]) || []
    const dismissedIdsList: string[] = (settingsData?.find((s: any) => s.key === 'admin_dismissed_notifications')?.value as string[]) || []

    const readSet = new Set(readIdsList)
    const dismissedSet = new Set(dismissedIdsList)

    // 2. Fetch orders (last 40)
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40)

    // 3. Fetch messages (last 40)
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40)

    // 4. Fetch blog comments (last 20)
    const { data: comments } = await supabase
      .from('blog_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    const allNotifications: AdminNotification[] = []

    // Process Orders
    if (Array.isArray(orders)) {
      for (const o of orders) {
        const notifId = `order_${o.id}`
        if (dismissedSet.has(notifId)) continue

        const isUnread = o.status === 'new' && !readSet.has(notifId)
        allNotifications.push({
          id: notifId,
          rawId: o.id,
          type: 'order',
          title: `طلب مشروع جديد: ${o.service || 'مشروع رقمي'}`,
          subtitle: `من ${o.name || 'عميل'}${o.budget ? ' • الميزانية: ' + o.budget : ''}${o.phone ? ' • هاتف: ' + o.phone : ''}`,
          sender: o.name || 'عميل',
          phone: o.phone,
          email: o.email || undefined,
          service: o.service,
          status: o.status,
          read: !isUnread,
          createdAt: o.created_at || new Date().toISOString(),
          href: `/admin/orders?id=${o.id}`,
          badgeText: 'طلب مشروع',
          color: '#1F8A54',
        })
      }
    }

    // Process Messages & Career applications
    if (Array.isArray(messages)) {
      for (const m of messages) {
        const isCareer = m.source === 'career' || (m.subject && m.subject.includes('وظيفة'))
        const notifId = isCareer ? `career_${m.id}` : `msg_${m.id}`
        if (dismissedSet.has(notifId)) continue

        const isUnread = !Boolean(m.read) && !readSet.has(notifId)
        if (isCareer) {
          allNotifications.push({
            id: notifId,
            rawId: m.id,
            type: 'career',
            title: `طلب توظيف جديد: ${m.name || 'متقدم'}`,
            subtitle: m.subject || (m.message ? m.message.slice(0, 80) : 'طلب انضمام لفريق العمل'),
            sender: m.name || 'متقدم',
            phone: m.phone || undefined,
            email: m.email || undefined,
            read: !isUnread,
            createdAt: m.created_at || new Date().toISOString(),
            href: `/admin/messages?id=${m.id}`,
            badgeText: 'طلب توظيف',
            color: '#f59e0b',
          })
        } else {
          allNotifications.push({
            id: notifId,
            rawId: m.id,
            type: 'message',
            title: `رسالة استفسار: ${m.subject || 'تواصل معنا'}`,
            subtitle: `من ${m.name || 'زائر'} — ${m.message ? m.message.slice(0, 70) : ''}`,
            sender: m.name || 'زائر',
            phone: m.phone || undefined,
            email: m.email || undefined,
            read: !isUnread,
            createdAt: m.created_at || new Date().toISOString(),
            href: `/admin/messages?id=${m.id}`,
            badgeText: 'رسالة تواصل',
            color: '#6366f1',
          })
        }
      }
    }

    // Process Blog Comments
    if (Array.isArray(comments)) {
      for (const c of comments) {
        const notifId = `comment_${c.id}`
        if (dismissedSet.has(notifId)) continue

        const isUnread = !Boolean(c.approved) && !readSet.has(notifId)
        allNotifications.push({
          id: notifId,
          rawId: c.id,
          type: 'comment',
          title: `تعليق جديد على المدونة`,
          subtitle: `${c.name || 'قارئ'}: ${c.content ? c.content.slice(0, 60) : ''}`,
          sender: c.name || 'قارئ',
          read: !isUnread,
          createdAt: c.created_at || new Date().toISOString(),
          href: `/admin/blog`,
          badgeText: 'تعليق مدونة',
          color: '#ec4899',
        })
      }
    }

    // Sort newest first
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const unreadNotifications = allNotifications.filter(n => !n.read)

    return NextResponse.json({
      notifications: allNotifications,
      unreadCount: unreadNotifications.length,
      unreadNotifications,
    })
  } catch (err: any) {
    console.error('Error fetching admin notifications:', err)
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      unreadNotifications: [],
      error: err.message,
    }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير متوفرة' }, { status: 503 })
  }

  const supabase = getServerClient()
  const body = await req.json().catch(() => ({}))
  const { action, id, rawId, type } = body

  try {
    // 1. Get current read list
    const { data: currentSettings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['admin_read_notifications', 'admin_dismissed_notifications'])

    let readList: string[] = (currentSettings?.find((s: any) => s.key === 'admin_read_notifications')?.value as string[]) || []
    let dismissedList: string[] = (currentSettings?.find((s: any) => s.key === 'admin_dismissed_notifications')?.value as string[]) || []

    if (action === 'mark_read') {
      if (id && !readList.includes(id)) {
        readList.push(id)
      }
      // If message type, also mark in messages table
      if (rawId && (type === 'message' || type === 'career')) {
        await supabase.from('messages').update({ read: true }).eq('id', rawId)
      }
      // Upsert site_settings
      await supabase.from('site_settings').upsert({
        key: 'admin_read_notifications',
        value: readList,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

      return NextResponse.json({ success: true, readList })
    }

    if (action === 'mark_all_read') {
      const { allIds } = body
      if (Array.isArray(allIds)) {
        readList = Array.from(new Set([...readList, ...allIds]))
      }
      // Mark all messages as read
      await supabase.from('messages').update({ read: true }).eq('read', false)

      await supabase.from('site_settings').upsert({
        key: 'admin_read_notifications',
        value: readList,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

      return NextResponse.json({ success: true, message: 'تم تحديد جميع الإشعارات كمقروءة' })
    }

    if (action === 'delete') {
      if (id && !dismissedList.includes(id)) {
        dismissedList.push(id)
      }
      await supabase.from('site_settings').upsert({
        key: 'admin_dismissed_notifications',
        value: dismissedList,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

      return NextResponse.json({ success: true, dismissedList })
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch (err: any) {
    console.error('Error updating admin notification state:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
