'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Instagram, Twitter, Linkedin, MessageCircle, Music2,
  Mail, Phone, MapPin, ArrowUp, Send, Globe, Smartphone,
  Palette, LayoutTemplate, ShoppingCart, Server, TrendingUp,
  Wrench, BookOpen, Users, Briefcase, ChevronRight
} from 'lucide-react'
import { SOCIAL_LINKS, NAV_ITEMS, SERVICES } from '@/data'
import { usePathname, useRouter } from 'next/navigation'

const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  Music2,
}

const SERVICE_LINKS = [
  { label: 'المواقع الشخصية والتعريفية', href: '/services/web', icon: Globe },
  { label: 'تطوير التطبيقات', href: '/services/apps', icon: Smartphone },
  { label: 'تصميم UI/UX', href: '/services/design', icon: Palette },
  { label: 'صفحات الهبوط', href: '/services/landing', icon: LayoutTemplate },
  { label: 'المتاجر الإلكترونية', href: '/services/ecommerce', icon: ShoppingCart },
  { label: 'الأنظمة الرقمية وSaaS', href: '/services/systems', icon: Server },
  { label: 'الحلول الرقمية والتسويق', href: '/services/marketing', icon: TrendingUp },
  { label: 'الصيانة والدعم الفني', href: '/services/support', icon: Wrench },
]

const COMPANY_LINKS = [
  { label: 'من نحن ورؤيتنا', href: '/about', icon: Users },
  { label: 'المدونة الرقمية', href: '/blog', icon: BookOpen },
  { label: 'الوظائف والانضمام', href: '/careers', icon: Briefcase },
  { label: 'تواصل معنا', href: '/contact', icon: MessageCircle },
  { label: 'تقديم طلب مشروع', href: '/order', icon: Send },
]

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useRegion } from '@/components/providers/RegionProvider'

export default function Footer() {
  const pathname = usePathname()
  const router = useRouter()
  const settings = useSiteSettings()
  const { contact, isYemen } = useRegion()
  const isHomePage = pathname === '/'

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const scrollToSection = (href: string) => {
    if (!isHomePage) {
      router.push('/' + href)
      return
    }
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <footer
      className="bg-[var(--bg-soft)] border-t border-[var(--border)]"
      role="contentinfo"
      dir="rtl"
    >
      {/* ══ Main Footer Grid ══ */}
      <div className="container-ws py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 relative flex-shrink-0">
                <img src="/assets/logo/logo.png" alt="WebStep Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-[var(--text-primary)]">
                Web<span className="text-[#1F8A54]">Step</span>
              </span>
            </div>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs mb-5">
              {isYemen
                ? 'شركة تقنية متخصصة في بناء المنتجات الرقمية — مواقع وتطبيقات وأنظمة متكاملة لرواد الأعمال والشركات في اليمن والعالم.'
                : 'شركة تقنية متخصصة في بناء المنتجات الرقمية — مواقع، تطبيقات، أنظمة، وتسويق رقمي بمستوى عالمي للسوق السعودي والخليجي.'}
            </p>

            {/* CTA */}
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white shadow-lg shadow-[#1F8A54]/25 hover:opacity-90 transition-opacity mb-6"
              style={{ background: 'linear-gradient(135deg, #1F8A54, #26a667)' }}
            >
              <Send size={14} />
              قدّم طلبك الآن
            </Link>

            {/* Contact Quick */}
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <Mail size={14} className="text-[#1F8A54] flex-shrink-0" />
                <a href={`mailto:${contact.email || settings.email || 'hello@wepstep.com'}`} className="hover:text-[#1F8A54] transition-colors">
                  {contact.email || settings.email || 'hello@wepstep.com'}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <Phone size={14} className="text-[#1F8A54] flex-shrink-0" />
                <a
                  href={`https://wa.me/${(contact.whatsapp || settings.whatsapp || '966593672193').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1F8A54] transition-colors"
                  dir="ltr"
                >
                  {contact.phoneFormatted || settings.phone || '+966 59 367 2193'}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                <MapPin size={14} className="text-[#1F8A54] flex-shrink-0 mt-0.5" />
                <span>{contact.address || settings.address || (isYemen ? 'صنعاء، اليمن' : 'الرياض، المملكة العربية السعودية')}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[
                { platform: 'Instagram', icon: 'Instagram', href: 'https://instagram.com/wepstep' },
                { platform: 'Twitter', icon: 'Twitter', href: settings.socialLinks?.twitter || 'https://twitter.com/wepstep' },
                { platform: 'LinkedIn', icon: 'Linkedin', href: settings.socialLinks?.linkedin || 'https://linkedin.com/company/wepstep' },
                { platform: 'TikTok', icon: 'Music2', href: settings.socialLinks?.tiktok || 'https://tiktok.com/@wepstep' },
                { platform: 'WhatsApp', icon: 'MessageCircle', href: `https://wa.me/${(contact.whatsapp || settings.whatsapp || '966593672193').replace(/[^0-9]/g, '')}` },
              ].map((social) => {
                const Icon = socialIconMap[social.icon]
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    aria-label={`WebStep على ${social.platform}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:border-[rgba(31,138,84,0.4)] hover:bg-[rgba(31,138,84,0.06)] transition-all duration-200"
                  >
                    {Icon && <Icon size={16} />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* ── Services Column ── */}
          <div className="lg:col-span-4">
            <h3 className="font-black text-[var(--text-primary)] mb-5 text-sm flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#1F8A54]" />
              خدماتنا الرقمية
            </h3>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((s) => {
                const Icon = s.icon
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className={`flex items-center gap-2.5 text-sm transition-all duration-200 group ${
                        pathname === s.href
                          ? 'text-[#1F8A54] font-bold'
                          : 'text-[var(--text-secondary)] hover:text-[#1F8A54]'
                      }`}
                    >
                      <Icon
                        size={13}
                        className={`flex-shrink-0 transition-transform group-hover:translate-x-[-2px] ${
                          pathname === s.href ? 'text-[#1F8A54]' : 'text-[var(--text-muted)]'
                        }`}
                      />
                      {s.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── Company + Nav ── */}
          <div className="lg:col-span-4">
            <div className="space-y-8">

              {/* Company Links */}
              <div>
                <h3 className="font-black text-[var(--text-primary)] mb-5 text-sm flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-[#6366f1]" />
                  الشركة
                </h3>
                <ul className="space-y-2.5">
                  {COMPANY_LINKS.map((l) => {
                    const Icon = l.icon
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className={`flex items-center gap-2.5 text-sm transition-all duration-200 group ${
                            pathname === l.href
                              ? 'text-[#1F8A54] font-bold'
                              : 'text-[var(--text-secondary)] hover:text-[#1F8A54]'
                          }`}
                        >
                          <Icon
                            size={13}
                            className={`flex-shrink-0 transition-transform group-hover:translate-x-[-2px] ${
                              pathname === l.href ? 'text-[#1F8A54]' : 'text-[var(--text-muted)]'
                            }`}
                          />
                          {l.label}
                          {l.href === '/order' && (
                            <span className="mr-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#1F8A54]/15 text-[#1F8A54] font-black">جديد</span>
                          )}
                          {l.href === '/careers' && (
                            <span className="mr-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#ec4899]/15 text-[#ec4899] font-black">وظائف</span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Homepage Sections */}
              <div>
                <h3 className="font-black text-[var(--text-primary)] mb-4 text-sm flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-[#f59e0b]" />
                  أقسام الصفحة الرئيسية
                </h3>
                <ul className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className="text-sm text-[var(--text-secondary)] hover:text-[#1F8A54] transition-colors text-right"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ══ Bottom Bar ══ */}
      <div className="border-t border-[var(--border)]">
        <div className="container-ws py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <p>© {new Date().getFullYear()} WebStep. جميع الحقوق محفوظة.</p>
            <span className="hidden sm:block text-[var(--border)]">|</span>
            <Link href="/privacy" className="hover:text-[#1F8A54] transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-[#1F8A54] transition-colors">شروط الاستخدام</Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              {isYemen ? 'صُنع بـ ❤️ في صنعاء، اليمن' : 'صُنع بـ ❤️ في الرياض، المملكة العربية السعودية'}
            </span>
            <button
              onClick={scrollToTop}
              aria-label="العودة للأعلى"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[#1F8A54] hover:border-[rgba(31,138,84,0.4)] hover:bg-[rgba(31,138,84,0.06)] transition-all"
            >
              <ArrowUp size={14} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
