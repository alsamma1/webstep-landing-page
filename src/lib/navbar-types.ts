export interface NavbarItem {
  id: string
  label: string
  href: string
  enabled: boolean
}

export interface DropdownMenuItem {
  id: string
  label: string
  sub: string
  href: string
  icon: string
  color: string
  enabled: boolean
}

export interface NavbarConfig {
  logoTextPrefix: string
  logoTextSuffix: string
  logoImageUrl: string
  ctaButtonText: string
  ctaButtonLink: string
  ctaButtonEnabled: boolean
  servicesDropdownTitle: string
  servicesDropdownEnabled: boolean
  contactDropdownTitle: string
  contactDropdownEnabled: boolean
  blogLinkTitle: string
  blogLinkEnabled: boolean
  navItems: NavbarItem[]
  servicesMenu: DropdownMenuItem[]
  contactMenu: DropdownMenuItem[]
}

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  logoTextPrefix: 'Web',
  logoTextSuffix: 'Step',
  logoImageUrl: '/assets/logo/logo.png',
  ctaButtonText: 'ابدأ مشروعك',
  ctaButtonLink: '/order',
  ctaButtonEnabled: true,
  servicesDropdownTitle: 'ماذا نقدم لك',
  servicesDropdownEnabled: true,
  contactDropdownTitle: 'تواصل معنا',
  contactDropdownEnabled: true,
  blogLinkTitle: 'المدونة',
  blogLinkEnabled: true,
  navItems: [
    { id: 'home', label: 'الرئيسية', href: '#home', enabled: true },
    { id: 'services', label: 'خدماتنا', href: '#services', enabled: true },
    { id: 'about', label: 'قصتنا', href: '#about', enabled: true },
    { id: 'process', label: 'طريقة عملنا', href: '#process', enabled: true },
    { id: 'portfolio', label: 'أعمالنا', href: '#portfolio', enabled: true },
  ],
  servicesMenu: [
    {
      id: 'web',
      label: 'المواقع الشخصية والتعريفية',
      sub: 'صفحات شخصية، تعريفية، وبورتفوليو للأفراد والشركات',
      href: '/services/web',
      icon: 'Globe',
      color: '#1F8A54',
      enabled: true,
    },
    {
      id: 'apps',
      label: 'تطوير التطبيقات',
      sub: 'تطبيقات iOS وأندرويد بأداء عالٍ وتجربة سلسة',
      href: '/services/apps',
      icon: 'Smartphone',
      color: '#6366f1',
      enabled: true,
    },
    {
      id: 'design',
      label: 'تصميم UI/UX',
      sub: 'واجهات مستخدم عصرية وهويات بصرية متكاملة',
      href: '/services/design',
      icon: 'Palette',
      color: '#ec4899',
      enabled: true,
    },
    {
      id: 'landing',
      label: 'صفحات الهبوط',
      sub: 'صفحات بيع وحملات إعلانية بمعدل تحويل مرتفع',
      href: '/services/landing',
      icon: 'LayoutTemplate',
      color: '#f59e0b',
      enabled: true,
    },
    {
      id: 'ecommerce',
      label: 'المتاجر الإلكترونية',
      sub: 'متاجر رقمية متكاملة بوابات دفع وإدارة مخزون',
      href: '/services/ecommerce',
      icon: 'ShoppingCart',
      color: '#ef4444',
      enabled: true,
    },
    {
      id: 'systems',
      label: 'الأنظمة الرقمية وSaaS',
      sub: 'لوحات تحكم وأنظمة إدارة سحابية مخصصة',
      href: '/services/systems',
      icon: 'Server',
      color: '#8b5cf6',
      enabled: true,
    },
    {
      id: 'marketing',
      label: 'الحلول الرقمية والتسويق',
      sub: 'تحسين محركات البحث والنمو الرقمي الذكي',
      href: '/services/marketing',
      icon: 'TrendingUp',
      color: '#06b6d4',
      enabled: true,
    },
    {
      id: 'support',
      label: 'الصيانة والدعم الفني',
      sub: 'تحديثات أمنية، نسخ احتياطي، ودعم متواصل',
      href: '/services/support',
      icon: 'HeartHandshake',
      color: '#10b981',
      enabled: true,
    },
  ],
  contactMenu: [
    {
      id: 'contact',
      label: 'تواصل معنا',
      sub: 'واتساب، بريد إلكتروني، ونموذج مباشر',
      href: '/contact',
      icon: 'Phone',
      color: '#1F8A54',
      enabled: true,
    },
    {
      id: 'about',
      label: 'من نحن ورؤيتنا',
      sub: 'فريقنا، مهمتنا، وأهدافنا المستقبلية',
      href: '/about',
      icon: 'Users',
      color: '#6366f1',
      enabled: true,
    },
    {
      id: 'order',
      label: 'تقديم طلب مشروع',
      sub: 'نموذج ذكي متعدد الخطوات مع ملخص قبل الإرسال',
      href: '/order',
      icon: 'Send',
      color: '#f59e0b',
      enabled: true,
    },
    {
      id: 'careers',
      label: 'الوظائف والانضمام',
      sub: 'فرص عمل مفتوحة في فريق WebStep',
      href: '/careers',
      icon: 'Briefcase',
      color: '#06b6d4',
      enabled: true,
    },
  ],
}
