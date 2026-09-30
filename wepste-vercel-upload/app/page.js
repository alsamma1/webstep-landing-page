import {
  ArrowLeft,
  ArrowUpLeft,
  Building2,
  CheckCircle2,
  CloudCog,
  Code2,
  DatabaseZap,
  Gauge,
  Rocket,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Workflow,
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import ThemeToggle from '../components/ThemeToggle';
import WhatsAppButton from '../components/WhatsAppButton';
import { seedCMS } from '../actions/seedCMS';
import { adminDb, isFirebaseAdminConfigured } from '../lib/firebase-admin';

export const dynamic = 'force-dynamic';

const defaultServices = [
  { id: 'service-1', title: 'بناء صفحات الهبوط (Landing Pages)', description: 'صفحات هبوط قوية وعالية الأداء مصممة لزيادة التحويلات وتحسين تصنيف Google عبر مسارات بيع سريعة.', icon: 'rocket' },
  { id: 'service-2', title: 'تطوير المواقع الإلكترونية ومتاجر الويب', description: 'مواقع احترافية وعصرية تعكس هوية المؤسسة وتدعم نمو الأعمال الرقمية.', icon: 'building' },
  { id: 'service-3', title: 'الأنظمة البرمجية السحابية وأنظمة ERP', description: 'أنظمة متكاملة تدعم المحاسبة والمخزون والموارد البشرية في منصة موحدة.', icon: 'cloud' },
  { id: 'service-4', title: 'تطوير تطبيقات الهواتف والويب الذكية', description: 'تطبيقات وواجهات ذكية تساعد الشركات على تقديم خدمات متقدمة عبر iOS وAndroid.', icon: 'workflow' },
];

const serviceIcons = {
  rocket: Rocket,
  building: Building2,
  cloud: CloudCog,
  workflow: Workflow,
};

async function getServices() {
  if (!isFirebaseAdminConfigured) return defaultServices;

  try {
    let snapshot = await adminDb.collection('services').get();
    if (snapshot.empty) {
      const result = await seedCMS();
      if (result.seeded) snapshot = await adminDb.collection('services').get();
    }
    if (snapshot.empty) return defaultServices;

    return snapshot.docs.map((service) => ({ id: service.id, ...service.data() }));
  } catch (error) {
    console.warn(
      `Unable to read Firestore services (${error.code || 'unknown'}): ${error.message}`,
    );
    return defaultServices;
  }
}

const trustBadges = [
  { text: 'تطوير يناسب الجوال من البداية', icon: Smartphone },
  { text: 'سرعة وتجربة استخدام محسّنة', icon: Gauge },
  { text: 'إدارة الطلبات عبر نظام داخلي', icon: DatabaseZap },
  { text: 'حماية البيانات أثناء النقل', icon: ShieldCheck },
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <main className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.15),_transparent_28%)]" />

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-black text-white shadow-lg shadow-emerald-500/30">و</div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">ويب ستيب</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Digital systems</div>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex dark:text-slate-200">
            <a href="#hero" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الرئيسية</a>
            <a href="#services" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الخدمات</a>
            <a href="#order" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الطلب</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#order" className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:text-sm dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">اطلب الآن</a>
            <ThemeToggle />
          </div>
        </nav>
        <div className="flex justify-center gap-8 border-t border-slate-200/70 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200 md:hidden">
          <a href="#hero" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الرئيسية</a>
          <a href="#services" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الخدمات</a>
          <a href="#order" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">الطلب</a>
        </div>
      </header>

      <section id="hero" className="mx-auto max-w-7xl px-4 pb-10 pt-9 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" /> حلول رقمية متكاملة للشركات
            </div>

            <h1 className="max-w-2xl text-[2.1rem] font-black leading-[1.35] tracking-tight text-slate-900 sm:text-5xl sm:leading-tight lg:text-6xl dark:text-slate-100">
              <span className="gradient-text">ويب ستيب</span>
              <span className="mt-1 block text-[0.78em] sm:mt-2">نطوّر مواقع وتطبيقات وأنظمة ERP تصنع فرقًا في أعمالك.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
              حلول رقمية عملية وسريعة الاستجابة تساعد شركتك على الوصول لعملائها، تنظيم عملياتها، والنمو بثقة.
            </p>

            <div className="mt-6 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8 sm:gap-4">
              <a href="#order" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-600 sm:rounded-full sm:px-6">
                ناقشنا مشروعك <ArrowLeft className="h-4 w-4" />
              </a>
              <a href="#services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 sm:rounded-full sm:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600">
                اكتشف خدماتنا
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-9 sm:max-w-xl sm:gap-3">
              {[
                { icon: Code2, label: 'مواقع سريعة ومتوافقة' },
                { icon: Workflow, label: 'أنظمة أعمال مترابطة' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/75 px-3 py-2.5 text-[11px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="leading-5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="card-glow rounded-[1.5rem] border border-slate-200 bg-white/80 p-2.5 shadow-soft backdrop-blur-xl sm:rounded-[2rem] sm:p-5 dark:border-slate-700 dark:bg-slate-900/80">
              <div className="rounded-[1.2rem] bg-slate-950 p-3.5 text-white sm:rounded-[1.6rem] sm:p-5 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="block h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="block h-3 w-3 rounded-full bg-amber-400" />
                    <span className="block h-3 w-3 rounded-full bg-rose-400" />
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300">تصميم توضيحي</span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-3.5 sm:mt-8 sm:rounded-3xl sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">معاينة لوحة ERP</div>
                      <div className="mt-1 text-lg font-black text-white sm:mt-2 sm:text-2xl">مؤشرات تشغيلية</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/15 p-2 text-emerald-300"><DatabaseZap className="h-5 w-5" /></div>
                  </div>

                  <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                    {[['المبيعات', '92%'], ['العمليات', '78%'], ['التكامل', '96%']].map(([label, value], index) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-800">
                          <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${[92, 78, 96][index]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-11 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mb-7 text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">خدماتنا</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900 sm:mt-4 sm:text-4xl dark:text-slate-100">حلول احترافية لتطوير الأعمال الرقمية</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {services.map(({ id, title, description, icon }) => {
            const Icon = serviceIcons[icon] || Sparkles;
            return (
            <article key={id} className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-soft sm:rounded-[1.75rem] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl sm:ring-8 sm:ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:sm:ring-emerald-500/10">
                <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-xs font-black leading-5 text-slate-900 sm:text-lg sm:leading-7 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6 dark:text-slate-300">{description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 sm:mt-5 sm:gap-2 sm:text-xs dark:text-emerald-400">
                نطوّرها لك <ArrowUpLeft className="h-3 w-3 transition group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
              </div>
            </article>
          );})}
        </div>
      </section>

      <section id="order" className="mx-auto max-w-7xl px-4 py-11 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid items-start gap-8 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">لماذا العملاء يختاروننا؟</p>
              <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-slate-100">نظام داخلي موثوق يدير الطلبات مباشرة</h2>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4">
                {trustBadges.map(({ text, icon: Icon }) => (
                  <div key={text} className="flex min-w-0 items-start gap-2 rounded-2xl border border-slate-200/80 bg-white/70 p-2.5 sm:gap-3 sm:p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><Icon className="h-3.5 w-3.5" /></div>
                    <p className="text-[10px] font-semibold leading-5 text-slate-700 sm:text-xs dark:text-slate-200">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-500/10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">البيانات تُرسل مباشرة إلى نظام CRM الداخلي بشكل آمن.</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <WhatsAppButton phoneNumber="+966500000000" />
      <footer className="border-t border-slate-200 bg-white/75 px-4 py-7 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-right">
          <a href="#hero" className="text-sm font-black text-slate-900 dark:text-slate-100">ويب ستيب <span className="font-medium text-slate-500">| حلول رقمية للأعمال</span></a>
          <p className="text-xs text-slate-500 dark:text-slate-400">نطوّر تجارب رقمية تساعد أعمالك على التقدّم.</p>
          <a href="mailto:hello@wepste.com" className="text-xs font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">hello@wepste.com</a>
        </div>
      </footer>
    </main>
  );
}
