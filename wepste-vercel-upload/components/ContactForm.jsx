'use client';

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { submitLeadAction } from '../actions/submitLead';

const initialState = {
  success: false,
  message: '',
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const nextErrors = {};
    const clientName = String(formData.get('clientName') || '').trim();
    const phoneNumber = String(formData.get('phoneNumber') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const projectDescription = String(formData.get('projectDescription') || '').trim();

    if (!clientName || clientName.length < 2) nextErrors.clientName = 'يرجى إدخال اسم العميل.';
    if (!/^\+?[1-9]\d{7,14}$/.test(phoneNumber.replace(/[\s()-]/g, ''))) {
      nextErrors.phoneNumber = 'اكتب الرقم مع رمز الدولة، مثال: +966500000000.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
    if (!projectDescription || projectDescription.length < 20) {
      nextErrors.projectDescription = 'يرجى وصف المشروع بشكل واضح.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setState({ success: false, message: 'يرجى تصحيح الحقول المطلوبة قبل الإرسال.' });
      return;
    }

    setLoading(true);
    setState(initialState);

    try {
      const result = await submitLeadAction(formData);
      setState(result);
      setErrors(result.errors || {});
      if (result.success) {
        form.reset();
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setState({ success: false, message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقًا.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">اطلب مشروعك</p>
        <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">ابدأ مشروعك الرقمي الآن</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">اسم العميل أو الشركة</label>
          <input
            name="clientName"
            type="text"
            autoComplete="organization"
            maxLength={120}
            required
            placeholder="مثال: شركة كراسي للتقنية"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
          {errors.clientName && <p className="mt-2 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{errors.clientName}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">رقم الهاتف</label>
            <input
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
              required
              placeholder="+966500000000"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
            {errors.phoneNumber && <p className="mt-2 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
            {errors.email && <p className="mt-2 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">وصف المشروع</label>
          <textarea
            name="projectDescription"
            rows={5}
            maxLength={5000}
            required
            placeholder="أخبرنا عن مشروعك، المشكلة الحالية، والهدف المطلوب..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
          {errors.projectDescription && <p className="mt-2 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{errors.projectDescription}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />جارٍ الإرسال...</> : <><Send className="h-4 w-4" />إرسال الطلب</>}
        </button>

        {state.message && (
          <div className={`mt-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${state.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300'}`}>
            {state.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{state.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
