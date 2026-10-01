'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAdminLeadsAction, updateLeadStatusAction } from '../actions/adminLeads';
import { getLeadStatusLabel, leadStatuses } from '../lib/lead-status';

function formatDate(value) {
  if (!value) return 'غير متوفر';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'غير متوفر'
    : new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function AdminDashboard({ adminEmail }) {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setMessage('');

    const result = await getAdminLeadsAction();
    if (result.success) {
      setLeads(result.leads);
    } else {
      setMessage(result.message);
      if (result.message.includes('انتهت جلسة')) router.replace('/admin/login');
    }

    setLoading(false);
    setRefreshing(false);
  }, [router]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesQuery =
        !query ||
        [lead.clientName, lead.email, lead.phoneNumber, lead.projectDescription]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [leads, search, statusFilter]);

  async function changeStatus(leadId, status) {
    const previousStatus = leads.find((lead) => lead.id === leadId)?.status;
    if (!previousStatus || status === previousStatus) return;

    setSavingId(leadId);
    setMessage('');
    const result = await updateLeadStatusAction(leadId, status);
    if (result.success) {
      setLeads((current) =>
        current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
      );
      setMessage('تم تحديث حالة الطلب.');
    } else {
      setMessage(result.message);
    }
    setSavingId('');
  }

  async function logout() {
    setMessage('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('تعذر إنهاء جلسة الإدارة.');
      router.replace('/admin/login');
      router.refresh();
    } catch (error) {
      setMessage(error.message || 'تعذر تسجيل الخروج. حاول مجددًا.');
    }
  }

  const statusCounts = leadStatuses.map((status) => ({
    ...status,
    count: leads.filter((lead) => lead.status === status.value).length,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-bold text-emerald-800">ويب ستيب | إدارة الطلبات</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">لوحة الإدارة</h1>
            <p className="mt-2 break-all text-sm text-slate-600" dir="ltr">
              {adminEmail}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadLeads(true)}
              disabled={refreshing || loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw aria-hidden="true" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              خروج
            </button>
          </div>
        </header>

        <section aria-label="ملخص حالات الطلبات" className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statusCounts.map((status) => (
            <div
              key={status.value}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold leading-6 text-slate-700">{status.label}</p>
              <p className="mt-2 text-3xl font-black tabular-nums text-slate-950">{status.count}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_15rem]">
            <label className="relative block">
              <span className="sr-only">البحث في الطلبات</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-700"
              />
            </label>
            <label className="block">
              <span className="sr-only">تصفية حسب الحالة</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <option value="all">كل الحالات</option>
                {leadStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            تعرض اللوحة أحدث {leads.length} طلبًا، بحد أقصى 200 طلب.
          </p>
        </section>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        <section aria-label="طلبات العملاء" className="mt-5 space-y-3">
          {loading ? (
            <p role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-semibold">
              جارٍ تحميل الطلبات...
            </p>
          ) : filteredLeads.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-700">
              {leads.length === 0 ? 'لا توجد طلبات محفوظة حتى الآن.' : 'لا توجد نتائج تطابق البحث.'}
            </p>
          ) : (
            filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-black">{lead.clientName || 'طلب بلا اسم'}</h2>
                    <p className="mt-1 text-xs text-slate-600">{formatDate(lead.createdAt)}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <a
                        href={`tel:${lead.phoneNumber}`}
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-900 underline underline-offset-2"
                        dir="ltr"
                      >
                        <Phone aria-hidden="true" className="h-4 w-4" />
                        {lead.phoneNumber}
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex min-h-11 max-w-full items-center gap-2 break-all font-semibold text-emerald-900 underline underline-offset-2"
                      >
                        <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {lead.email}
                      </a>
                    </div>
                  </div>
                  <label className="block w-full shrink-0 sm:w-60">
                    <span className="mb-1 block text-xs font-bold text-slate-700">حالة الطلب</span>
                    <span className="sr-only">تغيير حالة طلب {lead.clientName}</span>
                    <select
                      value={lead.status}
                      disabled={savingId === lead.id}
                      onChange={(event) => changeStatus(lead.id, event.target.value)}
                      className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:opacity-60"
                    >
                      {leadStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {getLeadStatusLabel(status.value)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h3 className="text-xs font-bold text-slate-700">وصف المشروع</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">
                    {lead.projectDescription || 'لا يوجد وصف.'}
                  </p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
