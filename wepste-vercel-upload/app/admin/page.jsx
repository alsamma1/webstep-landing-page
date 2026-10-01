import { redirect } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';
import { getAdminSession } from '../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'لوحة إدارة الطلبات | ويب ستيب',
  alternates: { canonical: '/admin' },
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return <AdminDashboard adminEmail={session.email} />;
}
