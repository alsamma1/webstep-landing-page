'use client';

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { submitLeadAction } from '../actions/submitLead';

const initialState = {
  success: false,
  message: '',
  canContactOnWhatsApp: false,
};
const whatsappUrl =
  'https://wa.me/967771111357?text=' +
  encodeURIComponent('السلام عليكم، تعذر إرسال طلبي عبر الموقع وأرغب في الاستفسار عن خدمات ويب ستيب.');

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
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
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
      setState({
        success: false,
        message: 'تعذر الاتصال بخدمة إرسال الطلبات. لم يُسجّل طلبك؛ حاول مجددًا أو تواصل معنا عبر واتساب.',
        canContactOnWhatsApp: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">اطلب مشروعك</p>
        <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">ابدأ مشروعك الرقمي الآن</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        <div>
          <label htmlFor="clientName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">اسم العميل أو الشركة</label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            autoComplete="organization"
            maxLength={120}
            required
            aria-invalid={Boolean(errors.clientName)}
            aria-describedby={errors.clientName ? 'clientName-error' : undefined}
            placeholder="مثال: شركة كراسي للتقنية"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
          {errors.clientName && <p id="clientName-error" className="mt-2 flex items-center gap-2 text-sm text-red-700 dark:text-red-300"><AlertCircle aria-hidden="true" className="h-4 w-4" />{errors.clientName}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">رقم الهاتف</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
              required
              aria-invalid={Boolean(errors.phoneNumber)}
              aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
              placeholder="+966500000000"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
            {errors.phoneNumber && <p id="phoneNumber-error" className="mt-2 flex items-center gap-2 text-sm text-red-700 dark:text-red-300"><AlertCircle aria-hidden="true" className="h-4 w-4" />{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
            {errors.email && <p id="email-error" className="mt-2 flex items-center gap-2 text-sm text-red-700 dark:text-red-300"><AlertCircle aria-hidden="true" className="h-4 w-4" />{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="projectDescription" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">وصف المشروع</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            rows={5}
            maxLength={5000}
            required
            aria-invalid={Boolean(errors.projectDescription)}
            aria-describedby={errors.projectDescription ? 'projectDescription-error' : undefined}
            placeholder="أخبرنا عن مشروعك، المشكلة الحالية، والهدف المطلوب..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
          {errors.projectDescription && <p id="projectDescription-error" className="mt-2 flex items-center gap-2 text-sm text-red-700 dark:text-red-300"><AlertCircle aria-hidden="true" className="h-4 w-4" />{errors.projectDescription}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          {loading ? <><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />جارٍ الإرسال...</> : <><Send aria-hidden="true" className="h-4 w-4" />إرسال الطلب</>}
        </button>

        {state.message && (
          <div
            role={state.success ? 'status' : 'alert'}
            aria-live={state.success ? 'polite' : 'assertive'}
            aria-atomic="true"
            className={`mt-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${state.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200'}`}
          >
            {state.success ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" /> : <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0" />}
            <div className="space-y-2">
              <p>{state.message}</p>
              {state.canContactOnWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-lg font-bold underline underline-offset-4 focus-visible:outline"
                >
                  متابعة الطلب عبر واتساب
                </a>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
