'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Menu, X, Sun, Moon, ChevronDown, Globe, Smartphone,
  Palette, LayoutTemplate, ShoppingCart, Server, TrendingUp,
  HeartHandshake, Sparkles, ExternalLink, BookOpen,
  MessageCircle, Users, Send, Briefcase, Phone, Info, Shield
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { NAV_ITEMS } from '@/data'
import { usePathname, useRouter } from 'next/navigation'
import { DEFAULT_NAVBAR_CONFIG, type NavbarConfig } from '@/lib/navbar-types'

const NAVBAR_ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Palette, LayoutTemplate, ShoppingCart, Server, TrendingUp,
  HeartHandshake, Phone, Users, Send, Briefcase, Info, MessageCircle, BookOpen, Shield, Sparkles
}

function resolveIcon(iconName: any, fallback: React.ElementType = Globe) {
  if (!iconName) return fallback
  if (typeof iconName !== 'string') return iconName
  return NAVBAR_ICON_MAP[iconName] || fallback
}

export const SERVICES_MENU = [
  {
    label: 'المواقع الشخصية والتعريفية',
    sub: 'صفحات شخصية، تعريفية، وبورتفوليو للأفراد والشركات',
    href: '/services/web',
    icon: Globe,
    color: '#1F8A54'
  },
  {
    label: 'تطوير التطبيقات',
    sub: 'تطبيقات iOS وأندرويد بأداء عالٍ وتجربة سلسة',
    href: '/services/apps',
    icon: Smartphone,
    color: '#6366f1'
  },
  {
    label: 'تصميم UI/UX',
    sub: 'واجهات مستخدم عصرية وهويات بصرية متكاملة',
    href: '/services/design',
    icon: Palette,
    color: '#ec4899'
  },
  {
    label: 'صفحات الهبوط',
    sub: 'صفحات بيع وحملات إعلانية بمعدل تحويل مرتفع',
    href: '/services/landing',
    icon: LayoutTemplate,
    color: '#f59e0b'
  },
  {
    label: 'المتاجر الإلكترونية',
    sub: 'متاجر رقمية متكاملة بوابات دفع وإدارة مخزون',
    href: '/services/ecommerce',
    icon: ShoppingCart,
    color: '#ef4444'
  },
  {
    label: 'الأنظمة الرقمية وSaaS',
    sub: 'لوحات تحكم وأنظمة إدارة سحابية مخصصة',
    href: '/services/systems',
    icon: Server,
    color: '#8b5cf6'
  },
  {
    label: 'الحلول الرقمية والتسويق',
    sub: 'تحسين محركات البحث والنمو الرقمي الذكي',
    href: '/services/marketing',
    icon: TrendingUp,
    color: '#06b6d4'
  },
  {
    label: 'الصيانة والدعم الفني',
    sub: 'تحديثات أمنية، نسخ احتياطي، ودعم متواصل',
    href: '/services/support',
    icon: HeartHandshake,
    color: '#10b981'
  },
]

export const CONTACT_MENU = [
  {
    label: 'تواصل معنا',
    sub: 'واتساب، بريد إلكتروني، ونموذج مباشر',
    href: '/contact',
    icon: Phone,
    color: '#1F8A54',
  },
  {
    label: 'من نحن ورؤيتنا',
    sub: 'فريقنا، مهمتنا، وأهدافنا المستقبلية',
    href: '/about',
    icon: Users,
    color: '#6366f1',
  },
  {
    label: 'تقديم طلب مشروع',
    sub: 'نموذج ذكي متعدد الخطوات مع ملخص قبل الإرسال',
    href: '/order',
    icon: Send,
    color: '#f59e0b',
  },
  {
    label: 'الوظائف والانضمام',
    sub: 'فرص عمل مفتوحة في فريق WebStep',
    href: '/careers',
    icon: Briefcase,
    color: '#ec4899',
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [servicesOpen, setServicesOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileContactOpen, setMobileContactOpen] = useState(false)
  const contactDropdownRef = useRef<HTMLLIElement>(null)
  const { resolvedTheme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLLIElement>(null)
  const isHomePage = pathname === '/'

  const [config, setConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG)

  useEffect(() => {
    fetch('/api/public/navbar')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && data.navItems) {
          setConfig(data)
        }
      })
      .catch(() => {})
  }, [])

  const navItems = config.navItems?.length ? config.navItems.filter(i => i.enabled !== false) : NAV_ITEMS
  const servicesMenu = config.servicesMenu?.length ? config.servicesMenu.filter(i => i.enabled !== false) : SERVICES_MENU
  const contactMenu = config.contactMenu?.length ? config.contactMenu.filter(i => i.enabled !== false) : CONTACT_MENU

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
    if (!isHomePage) return
    const sections = ['home', 'services', 'portfolio', 'about', 'process', 'contact']
    for (const section of [...sections].reverse()) {
      const el = document.getElementById(section)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120) {
          setActiveSection(section)
          break
        }
      }
    }
  }, [isHomePage])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(e.target as Node)) {
        setContactOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdowns and drawer on route change
  useEffect(() => {
    setServicesOpen(false)
    setContactOpen(false)
    setIsOpen(false)
  }, [pathname])

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    setServicesOpen(false)
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
    <>
      <nav
        role="navigation"
        aria-label="التنقل الرئيسي"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || !isHomePage
            ? 'navbar-blur border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md shadow-[var(--shadow-sm)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-ws">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none group"
              aria-label="WebStep — الصفحة الرئيسية"
            >
              <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={config.logoImageUrl || "/assets/logo/logo.png"}
                  alt="WebStep Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--text-primary)] transition-colors">
                {config.logoTextPrefix || 'Web'}<span className="text-[#1F8A54]">{config.logoTextSuffix || 'Step'}</span>
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <ul className="hidden lg:flex items-center gap-1" role="list">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '')
                const isActive = isHomePage && activeSection === sectionId
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-[#1F8A54] bg-[rgba(31,138,84,0.08)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1F8A54]" />
                      )}
                    </button>
                  </li>
                )
              })}

              {/* ماذا نقدم لك — Dropdown */}
              {config.servicesDropdownEnabled !== false && (
                <li ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesOpen(prev => !prev)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      pathname.startsWith('/services') || servicesOpen
                        ? 'text-[#1F8A54] bg-[rgba(31,138,84,0.1)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    <span>{config.servicesDropdownTitle || 'ماذا نقدم لك'}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                    />
                    {pathname.startsWith('/services') && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1F8A54]" />
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  {servicesOpen && (
                    <div
                      className="absolute top-full mt-2 -right-16 w-[560px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{
                        background: 'var(--surface)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 100,
                      }}
                    >
                      {/* Header inside dropdown */}
                      <div
                        className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between"
                        style={{ background: 'var(--bg-soft)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
                          <span className="text-xs font-bold text-[var(--text-primary)]">خدماتنا وحلولنا الرقمية المتكاملة</span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          {servicesMenu.length} تخصصات احترافية
                        </span>
                      </div>

                      {/* Grid of Services */}
                      <div className="p-3 grid grid-cols-2 gap-2">
                        {servicesMenu.map((item) => {
                          const isCurrentPage = pathname === item.href
                          const Icon = resolveIcon(item.icon, Globe)
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setServicesOpen(false)}
                              className={`flex items-start gap-3 p-2.5 rounded-xl text-right transition-all duration-150 group border ${
                                isCurrentPage
                                  ? 'border-[#1F8A54]/40 bg-[rgba(31,138,84,0.08)]'
                                  : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-soft)]'
                              }`}
                            >
                              <span
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-sm"
                                style={{ background: `${item.color || '#1F8A54'}18`, color: item.color || '#1F8A54' }}
                              >
                                <Icon size={18} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors leading-tight mb-1 flex items-center gap-1">
                                  <span>{item.label}</span>
                                  {isCurrentPage && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A54]" />
                                  )}
                                </div>
                                <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-1">
                                  {item.sub}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Bottom hint */}
                      <div
                        className="px-5 py-2.5 border-t border-[var(--border)] text-center text-xs flex items-center justify-between"
                        style={{ background: 'var(--bg-soft)' }}
                      >
                        <span className="text-[var(--text-secondary)]">دفعة واحدة وبدون اشتراكات شهرية</span>
                        <button
                          onClick={() => scrollToSection('#contact')}
                          className="text-[#1F8A54] font-bold hover:underline flex items-center gap-1"
                        >
                          طلب استشارة خاصة &larr;
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )}

              {/* المدونة */}
              {config.blogLinkEnabled !== false && (
                <li>
                  <Link
                    href="/blog"
                    className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      pathname.startsWith('/blog')
                        ? 'text-[#1F8A54] bg-[rgba(31,138,84,0.08)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    <span>{config.blogLinkTitle || 'المدونة'}</span>
                    {pathname.startsWith('/blog') && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1F8A54]" />
                    )}
                  </Link>
                </li>
              )}

              {/* تواصل معنا — Dropdown */}
              {config.contactDropdownEnabled !== false && (
                <li ref={contactDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setContactOpen(prev => !prev)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      ['/contact', '/about', '/order', '/careers'].some(p => pathname.startsWith(p)) || contactOpen
                        ? 'text-[#1F8A54] bg-[rgba(31,138,84,0.1)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                    aria-expanded={contactOpen}
                    aria-haspopup="true"
                  >
                    <span>{config.contactDropdownTitle || 'تواصل معنا'}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${contactOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {contactOpen && (
                    <div
                      className="absolute top-full mt-2 -right-4 w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ background: 'var(--surface)', backdropFilter: 'blur(20px)', zIndex: 100 }}
                    >
                      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2" style={{ background: 'var(--bg-soft)' }}>
                        <span className="w-2 h-2 rounded-full bg-[#1F8A54] animate-pulse" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">تواصل وتعاون مع WebStep</span>
                      </div>
                      <div className="p-2">
                        {contactMenu.map((item) => {
                          const Icon = resolveIcon(item.icon, Phone)
                          return (
                            <Link key={item.href} href={item.href} onClick={() => setContactOpen(false)}
                              className={`flex items-start gap-3 p-3 rounded-xl text-right transition-all duration-150 group border ${
                                pathname === item.href
                                  ? 'border-[#1F8A54]/40 bg-[rgba(31,138,84,0.08)]'
                                  : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-soft)]'
                              }`}>
                              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${item.color || '#1F8A54'}18`, color: item.color || '#1F8A54' }}>
                                <Icon size={18} />
                              </span>
                              <div>
                                <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#1F8A54] transition-colors mb-0.5">{item.label}</div>
                                <p className="text-[11px] text-[var(--text-muted)] leading-snug">{item.sub}</p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                      <div className="px-4 py-2.5 border-t border-[var(--border)] text-center" style={{ background: 'var(--bg-soft)' }}>
                        <Link href="/order" onClick={() => setContactOpen(false)}
                          className="text-xs font-black text-[#1F8A54] hover:underline flex items-center justify-center gap-1">
                          <Send size={12} /> قدّم طلبك الآن →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              )}
            </ul>

            {/* Right side actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">

              {/* CTA Button → Compact on mobile, swapped before theme toggle */}
              {config.ctaButtonEnabled !== false && (
                <Link
                  href={config.ctaButtonLink || '/order'}
                  className="btn-primary text-[10px] sm:text-sm px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1 shrink-0 font-bold"
                  id="navbar-cta-btn"
                >
                  <Send size={11} className="sm:w-3.5 sm:h-3.5" />
                  <span>{config.ctaButtonText || 'ابدأ مشروعك'}</span>
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={resolvedTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] border border-[var(--border)] transition-all duration-200 cursor-pointer shrink-0"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun size={15} className="sm:w-[18px] sm:h-[18px] text-amber-400" />
                ) : (
                  <Moon size={15} className="sm:w-[18px] sm:h-[18px] text-slate-600" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-[var(--border)] transition-colors cursor-pointer shrink-0"
              >
                {isOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="قائمة التنقل"
        aria-modal="true"
        className={`fixed top-0 inset-x-0 z-50 lg:hidden transition-all duration-300 ease-out max-h-[92vh] overflow-y-auto ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="px-5 pt-4 pb-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border)]">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <img
                  src={config.logoImageUrl || "/assets/logo/logo.png"}
                  alt="WebStep Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-black text-[var(--text-primary)]">
                {config.logoTextPrefix || 'Web'}<span className="text-[#1F8A54]">{config.logoTextSuffix || 'Step'}</span>
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق القائمة"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <ul className="space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-right px-4 py-2.5 rounded-xl text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-muted)] hover:text-[#1F8A54] transition-all duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* ماذا نقدم لك (Mobile Accordion) */}
            {config.servicesDropdownEnabled !== false && (
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-sm font-bold text-[#1F8A54]"
                >
                  <span>{config.servicesDropdownTitle || 'ماذا نقدم لك'} ({servicesMenu.length})</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    {servicesMenu.map((item) => {
                      const Icon = resolveIcon(item.icon, Globe)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            pathname === item.href
                              ? 'bg-[rgba(31,138,84,0.12)] text-[#1F8A54]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${item.color || '#1F8A54'}18`, color: item.color || '#1F8A54' }}
                          >
                            <Icon size={14} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </li>
            )}

            {/* المدونة (Mobile) */}
            {config.blogLinkEnabled !== false && (
              <li className="pt-2">
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    pathname.startsWith('/blog')
                      ? 'bg-[rgba(31,138,84,0.12)] border-[#1F8A54]/40 text-[#1F8A54]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[#1F8A54]/50'
                  }`}
                >
                  <span>{config.blogLinkTitle || 'المدونة'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F8A54]/15 text-[#1F8A54] font-bold">جديد</span>
                </Link>
              </li>
            )}

            {/* تواصل معنا (Mobile Accordion) */}
            {config.contactDropdownEnabled !== false && (
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setMobileContactOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1F8A54]/10 border border-[#1F8A54]/30 text-sm font-bold text-[#1F8A54]"
                >
                  <span>{config.contactDropdownTitle || 'تواصل معنا'}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${mobileContactOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileContactOpen && (
                  <div className="mt-2 space-y-1 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    {contactMenu.map((item) => {
                      const Icon = resolveIcon(item.icon, Phone)
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                            pathname === item.href
                              ? 'bg-[rgba(31,138,84,0.12)] text-[#1F8A54]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]'
                          }`}>
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color || '#1F8A54'}18`, color: item.color || '#1F8A54' }}>
                            <Icon size={14} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile CTA & Theme */}
          <div className="mt-4 flex items-center gap-3">
            {config.ctaButtonEnabled !== false && (
              <Link
                href={config.ctaButtonLink || '/order'}
                onClick={() => setIsOpen(false)}
                className="flex-1 btn-primary justify-center text-sm py-3 flex items-center gap-1.5"
              >
                <Send size={14} /> {config.ctaButtonText || 'قدّم طلبك الآن'}
              </Link>
            )}
            <button
              onClick={toggleTheme}
              aria-label="تبديل الوضع"
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
