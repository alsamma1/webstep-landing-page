import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminLoginForm from '../../../components/AdminLoginForm';
import { getAdminSession } from '../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'دخول الإدارة | ويب ستيب',
  alternates: { canonical: '/admin/login' },
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect('/admin');

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <Link href="/" className="text-sm font-bold text-emerald-900 underline underline-offset-4">
          العودة إلى موقع ويب ستيب
        </Link>
        <p className="mt-8 text-sm font-bold text-emerald-800">منطقة خاصة بالمصرّح لهم فقط</p>
        <h1 className="mt-2 text-3xl font-black">تسجيل دخول الإدارة</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          استخدم حساب الإدارة المعتمد لمراجعة طلبات العملاء وتحديث حالاتها.
        </p>
        <div className="mt-7">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
