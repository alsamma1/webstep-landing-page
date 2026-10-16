'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, ShoppingBag, MessageCircle, BookOpen,
  FolderKanban, Globe, Smartphone, Palette, Settings,
  LogOut, Shield, ChevronRight, Menu, X, Bell,
  Sun, Moon, Search, Users, ExternalLink, Headset,
  Boxes, Store, TrendingUp, PanelsTopLeft, Briefcase,
  Phone, Send, KeyRound, Scale, ShieldCheck
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import NotificationBellDropdown from '@/components/admin/NotificationBellDropdown'

interface AdminUser {
  id: string
  name: string
  username: string
  email: string
  role: string
  roleTitle: string
  permissions: string[]
  isSuperAdmin: boolean
}

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge: string | null
  permission?: string | null
}

const SIDEBAR_ITEMS: { group: string; items: SidebarItem[] }[] = [
  {
    group: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard, badge: null, permission: null },
      { label: 'مركز الإشعارات', href: '/admin/notifications', icon: Bell, badge: 'new', permission: null },
    ],
  },
  {
    group: 'صفحات تواصل والشركة',
    items: [
      { label: 'صفحة تواصل معنا', href: '/admin/contact-page', icon: Phone, badge: null, permission: 'company_pages' },
      { label: 'صفحة من نحن ورؤيتنا', href: '/admin/about', icon: Users, badge: null, permission: 'company_pages' },
      { label: 'صفحة تقديم الطلب', href: '/admin/order-settings', icon: Send, badge: null, permission: 'company_pages' },
      { label: 'الوظائف والتوظيف', href: '/admin/careers', icon: Briefcase, badge: null, permission: 'company_pages' },
      { label: 'الشروط والأحكام', href: '/admin/terms', icon: Scale, badge: null, permission: 'company_pages' },
      { label: 'سياسة الخصوصية', href: '/admin/privacy', icon: ShieldCheck, badge: null, permission: 'company_pages' },
    ],
  },
  {
    group: 'إدارة الأعمال',
    items: [
      { label: 'الطلبات الواردة', href: '/admin/orders', icon: ShoppingBag, badge: 'new', permission: 'orders' },
      { label: 'الرسائل الواردة', href: '/admin/messages', icon: MessageCircle, badge: null, permission: 'messages' },
    ],
  },
  {
    group: 'المحتوى والخدمات',
    items: [
      { label: 'الشريط العلوي (Navbar)', href: '/admin/navbar', icon: PanelsTopLeft, badge: 'جديد', permission: 'navbar' },
      { label: 'محتوى الصفحة الرئيسية', href: '/admin/content', icon: BookOpen, badge: null, permission: 'content' },
      { label: 'المدونة', href: '/admin/blog', icon: BookOpen, badge: null, permission: 'blog' },
      { label: 'الأعمال (Portfolio)', href: '/admin/projects', icon: FolderKanban, badge: null, permission: 'projects' },
      { label: 'صفحة المواقع الإلكترونية', href: '/admin/web-service', icon: Globe, badge: null, permission: 'services' },
      { label: 'التطبيقات', href: '/admin/apps', icon: Smartphone, badge: null, permission: 'services' },
      { label: 'تصاميم UI/UX', href: '/admin/designs', icon: Palette, badge: null, permission: 'services' },
      { label: 'صفحات الهبوط', href: '/admin/landing-service', icon: PanelsTopLeft, badge: null, permission: 'services' },
      { label: 'المتاجر الإلكترونية', href: '/admin/services/ecommerce', icon: Store, badge: null, permission: 'services' },
      { label: 'الأنظمة وSaaS', href: '/admin/services/systems', icon: Boxes, badge: null, permission: 'services' },
      { label: 'الحلول والتسويق', href: '/admin/services/marketing', icon: TrendingUp, badge: null, permission: 'services' },
      { label: 'الدعم الفني', href: '/admin/services/support', icon: Headset, badge: null, permission: 'services' },
    ],
  },
  {
    group: 'الفريق',
    items: [
      { label: 'أعضاء الفريق والصلاحيات', href: '/admin/team', icon: Users, badge: 'RBAC', permission: 'team' },
    ],
  },
  {
    group: 'الموقع',
    items: [
      { label: 'التخصيص الجغرافي والأسعار', href: '/admin/geo', icon: Globe, badge: 'جديد', permission: 'settings' },
      { label: 'إعدادات الموقع', href: '/admin/settings', icon: Settings, badge: null, permission: 'settings' },
      { label: 'إدارة SEO', href: '/admin/seo', icon: Globe, badge: null, permission: 'settings' },
      { label: 'حسابي وكلمة المرور', href: '/admin/account', icon: Shield, badge: null, permission: null },
    ],
  },
]

// ─── Top-Level Sidebar Component to prevent re-creation and hydration mismatch ───
function SidebarContent({
  sidebarOpen,
  setSidebarOpen,
  pathname,
  onNavigate,
  user,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  pathname: string
  onNavigate?: () => void
  user: AdminUser | null
}) {
  const isSuperAdmin = Boolean(user?.isSuperAdmin || user?.permissions?.includes('all'))

  // Filter items by permission
  const visibleGroups = SIDEBAR_ITEMS.map((group) => {
    const items = group.items.filter((item) => {
      if (!item.permission || isSuperAdmin) return true
      return user?.permissions?.includes(item.permission)
    })
    return { group: group.group, items }
  }).filter((g) => g.items.length > 0)

  return (
    <div className="flex flex-col h-full overflow-hidden" suppressHydrationWarning>
      {/* Logo & Brand Header (Fixed at top of sidebar) */}
      <div className="p-5 border-b border-[var(--border)] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1F8A54] flex items-center justify-center shadow-lg shadow-[#1F8A54]/30 shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-black text-sm text-[var(--text-primary)]">WebStep</div>
              <div className="text-[10px] text-[#1F8A54] font-bold">لوحة التحكم الإدارية</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav List (Scrolls independently) */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin overscroll-contain">
        {visibleGroups.map((group) => (
          <div key={group.group}>
            {sidebarOpen && (
              <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-2 px-2">
                {group.group}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/25'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#1F8A54]/20 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: View site + Collapse (Fixed at bottom of sidebar) */}
      <div className="p-3 border-t border-[var(--border)] space-y-2 shrink-0 bg-[var(--surface)]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          <ExternalLink size={15} className="shrink-0 text-[#1F8A54]" />
          {sidebarOpen && <span>عرض الموقع</span>}
        </a>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden lg:flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors w-full cursor-pointer ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          <ChevronRight size={15} className={`shrink-0 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          {sidebarOpen && <span>{sidebarOpen ? 'طي القائمة' : 'توسيع'}</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const { resolvedTheme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.name) setUser(data)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex" dir="rtl" suppressHydrationWarning>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen border-l border-[var(--border)] bg-[var(--surface)] transition-all duration-300 shrink-0 z-30 overflow-hidden ${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        }`}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pathname={pathname}
          user={user}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute top-0 right-0 h-full w-72 bg-[var(--surface)] border-l border-[var(--border)] z-50 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <span className="font-black text-sm text-[var(--text-primary)]">القائمة الرئيسية</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent
              sidebarOpen={true}
              setSidebarOpen={setSidebarOpen}
              pathname={pathname}
              onNavigate={() => setMobileSidebarOpen(false)}
              user={user}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-muted)] transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                placeholder="بحث في لوحة التحكم..."
                className="pr-9 pl-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs focus:border-[#1F8A54] focus:ring-1 focus:ring-[#1F8A54]/30 outline-none w-56 text-right"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell Dropdown */}
            <NotificationBellDropdown />

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[var(--bg-muted)] border border-[var(--border)] transition-colors cursor-pointer"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} />
              )}
            </button>

            {/* Admin Avatar + Logout */}
            <div className="flex items-center gap-2 pr-2 border-r border-[var(--border)] mr-1">
              <Link
                href="/admin/account"
                title="إدارة حسابي وكلمة المرور"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1F8A54] flex items-center justify-center text-white text-xs font-black shadow-md">
                  {user?.name ? user.name.charAt(0) : 'م'}
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-black text-[var(--text-primary)] hover:text-[#1F8A54] transition-colors">
                    {user?.name || 'المدير العام'}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium">
                    {user?.roleTitle || 'المدير العام'}
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="p-2 rounded-xl hover:bg-[#ef4444]/10 text-[var(--text-muted)] hover:text-[#ef4444] border border-[var(--border)] hover:border-[#ef4444]/30 transition-all mr-1 cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
