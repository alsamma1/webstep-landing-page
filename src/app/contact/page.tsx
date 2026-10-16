'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send,
  ChevronRight, CheckCircle2, Instagram, Twitter,
  Linkedin, Globe, ArrowRight, Headphones, Zap
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useRegion } from '@/components/providers/RegionProvider'

import { DEFAULT_CONTACT_PAGE, type ContactPageData } from '@/lib/company-pages-types'

export default function ContactPage() {
  const settings = useSiteSettings()
  const { contact, isYemen } = useRegion()
  const [pageData, setPageData] = useState<ContactPageData>(DEFAULT_CONTACT_PAGE)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/public/contact-page')
      .then(res => res.json())
      .then(json => {
        if (json && typeof json === 'object') {
          setPageData(prev => ({
            ...prev,
            ...json,
            hero: { ...prev.hero, ...(json.hero || {}) },
            channels: { ...prev.channels, ...(json.channels || {}) },
            faqs: Array.isArray(json.faqs) && json.faqs.length > 0 ? json.faqs : prev.faqs,
          }))
        }
      })
      .catch(() => {})
  }, [])

  const activeChan = (isYemen && pageData.yemenChannels) ? pageData.yemenChannels : pageData.channels
  const cleanWhatsapp = (contact.whatsapp || activeChan.whatsapp || settings?.whatsapp || '966593672193').replace(/[^0-9]/g, '')
  const waUrl = `https://wa.me/${cleanWhatsapp}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'message',
          name,
          email,
          phone,
          subject: subject || 'رسالة تواصل جديدة',
          message,
          source: 'صفحة تواصل معنا',
        }),
      })
      if (!response.ok) throw new Error('تعذر حفظ الرسالة')
    } catch (err) {
      console.error('Failed to save message to admin inbox:', err)
      setSubmitting(false)
      return
    }

    const text = encodeURIComponent(`📩 رسالة جديدة من موقع WebStep\n\nالاسم: ${name}\nالبريد: ${email}\nالهاتف: ${phone}\nالموضوع: ${subject}\n\nالرسالة:\n${message}`)
    window.open(`${waUrl}?text=${text}`, '_blank')
    setSent(true)
    setSubmitting(false)
  }

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-24 pb-20 overflow-x-hidden text-right">

        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--border)] py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, #1F8A54, transparent 60%)' }} />
          </div>
          <div className="container-ws relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#1F8A54]/30 bg-[#1F8A54]/10 text-[#1F8A54] mb-6">
              <Headphones size={14} /> {pageData.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
              {pageData.hero.title} <span className="text-gradient-green">{pageData.hero.highlight}</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
              {pageData.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                <MessageCircle size={16} /> واتساب مباشر
              </a>
              <Link href="/order" className="px-6 py-3 rounded-xl border border-[var(--border)] text-sm font-bold hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-2">
                <Send size={14} /> قدّم طلبك
              </Link>
            </div>
          </div>
        </section>

        {/* ══ CONTACT GRID ══ */}
        <section className="section-padding bg-[var(--bg-soft)] border-b border-[var(--border)]">
          <div className="container-ws">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* Left: Info Cards */}
              <div className="lg:col-span-2 space-y-4">

                {/* Quick Contact */}
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <h3 className="font-black text-lg text-[var(--text-primary)]">طرق التواصل المباشر</h3>
                  </div>

                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[#1F8A54]/20 bg-[#1F8A54]/5 hover:bg-[#1F8A54]/10 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-[#1F8A54] flex items-center justify-center shadow-lg shadow-[#1F8A54]/30">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors">واتساب</div>
                      <div className="text-xs text-[var(--text-muted)]" dir="ltr">{contact.phoneFormatted || activeChan.whatsapp || settings?.whatsapp} — رد فوري</div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[#1F8A54] transition-colors" />
                  </a>

                  <a href={`mailto:${contact.email || activeChan.email || settings?.email || 'hello@wepstep.com'}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] hover:border-[#6366f1]/40 bg-[var(--bg-muted)] hover:bg-[#6366f1]/5 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-[#6366f1]/15 flex items-center justify-center">
                      <Mail size={20} className="text-[#6366f1]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#6366f1] transition-colors">البريد الإلكتروني</div>
                      <div className="text-xs text-[var(--text-muted)]">{contact.email || activeChan.email || settings?.email || 'hello@wepstep.com'}</div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)]" />
                  </a>

                  <a href={`tel:${(contact.phone || activeChan.phone || settings?.phone || '').replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[#1F8A54]/5 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-[#1F8A54]/15 flex items-center justify-center">
                      <Phone size={20} className="text-[#1F8A54]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors">الهاتف المباشر</div>
                      <div className="text-xs text-[var(--text-muted)]" dir="ltr">{contact.phoneFormatted || activeChan.phone || settings?.phone}</div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)]" />
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]">
                    <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center">
                      <Clock size={20} className="text-[#f59e0b]" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-[var(--text-primary)]">أوقات العمل</div>
                      <div className="text-xs text-[var(--text-muted)]">{activeChan.workingHoursWeekday}</div>
                      <div className="text-xs text-[var(--text-muted)]">{activeChan.workingHoursWeekend}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]">
                    <div className="w-11 h-11 rounded-xl bg-[#ec4899]/15 flex items-center justify-center">
                      <MapPin size={20} className="text-[#ec4899]" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-[var(--text-primary)]">الموقع الجغرافي</div>
                      <div className="text-xs text-[var(--text-muted)]">{contact.address || pageData.channels.address || settings?.address || (isYemen ? 'صنعاء، اليمن' : 'الرياض، المملكة العربية السعودية')}</div>
                    </div>
                  </div>
                </div>

                {/* Response time badge */}
                <div className="p-5 rounded-2xl border border-[#1F8A54]/25 bg-[#1F8A54]/8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1F8A54] animate-pulse" />
                    <span className="text-sm font-black text-[#1F8A54]">استجابة سريعة</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{pageData.channels.responseTimeText}</p>
                </div>

                {/* Social */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <h4 className="font-black text-sm text-[var(--text-primary)] mb-3">تابعنا على</h4>
                  <div className="flex gap-2">
                    {[
                      { icon: Instagram, label: 'Instagram', color: '#ec4899', href: settings?.socialLinks?.instagram || '#' },
                      { icon: Twitter, label: 'X (Twitter)', color: '#1d9bf0', href: settings?.socialLinks?.twitter || '#' },
                      { icon: Linkedin, label: 'LinkedIn', color: '#0077b5', href: settings?.socialLinks?.linkedin || '#' },
                    ].map(s => {
                      const Icon = s.icon
                      return (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[var(--border)] hover:border-transparent transition-all text-xs font-bold"
                          style={{ '--hover-bg': s.color } as React.CSSProperties}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.color + '15'; (e.currentTarget as HTMLElement).style.color = s.color }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = '' }}>
                          <Icon size={14} />
                          <span className="hidden sm:inline">{s.label}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="lg:col-span-3">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
                  {!sent ? (
                    <>
                      <h3 className="font-black text-xl text-[var(--text-primary)] mb-1">أرسل لنا رسالة</h3>
                      <p className="text-xs text-[var(--text-muted)] mb-7">سنرد عليك بأسرع وقت — ستصلنا رسالتك مباشرة على واتساب.</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">الاسم الكامل *</label>
                            <input value={name} onChange={e => setName(e.target.value)} required
                              placeholder="محمد أحمد"
                              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">رقم الجوال *</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} required type="tel"
                              placeholder="+٩٦٦ ٥٠٠ ٠٠٠ ٠٠٠"
                              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">البريد الإلكتروني</label>
                          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                            placeholder="example@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">موضوع الرسالة *</label>
                          <select value={subject} onChange={e => setSubject(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all">
                            <option value="">اختر موضوع الرسالة</option>
                            <option>استفسار عن خدمة</option>
                            <option>طلب عرض سعر</option>
                            <option>دعم فني ومتابعة</option>
                            <option>شراكة أو تعاون</option>
                            <option>أخرى</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)] mb-1.5 block">تفاصيل رسالتك *</label>
                          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                            placeholder="اكتب رسالتك هنا بالتفصيل — كلما كانت أوضح، كان ردنا أدق وأسرع..."
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#1F8A54] focus:ring-2 focus:ring-[#1F8A54]/20 outline-none transition-all resize-none" />
                        </div>
                        <button type="submit" disabled={submitting}
                          className="w-full btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-[#1F8A54]/25 disabled:opacity-60">
                          <Send size={16} /> {submitting ? 'جارٍ الحفظ والتحويل...' : 'إرسال الرسالة عبر واتساب'}
                        </button>
                        <p className="text-center text-xs text-[var(--text-muted)]">
                          أو{' '}
                          <Link href="/order" className="text-[#1F8A54] font-bold hover:underline">
                            قدّم طلبك المفصّل مباشرة ←
                          </Link>
                        </p>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-[#1F8A54]/15 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-[#1F8A54]" />
                      </div>
                      <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">تم فتح واتساب!</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">أرسل الرسالة الجاهزة وسيرد عليك فريقنا خلال ساعتين.</p>
                      <button onClick={() => setSent(false)} className="btn-primary px-6 py-2.5 text-sm">إرسال رسالة أخرى</button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="section-padding bg-[var(--bg)]">
          <div className="container-ws max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">أسئلة شائعة</h2>
            </div>
            <div className="space-y-3">
              {pageData.faqs.map((f, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-right hover:bg-[var(--bg-muted)] transition-colors">
                    <span className="font-black text-sm text-[var(--text-primary)]">{f.q}</span>
                    <ChevronRight size={16} className={`text-[var(--text-muted)] transition-transform shrink-0 ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
