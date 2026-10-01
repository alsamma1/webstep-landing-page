'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AlertCircle, Loader2, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    if (!auth) {
      setMessage('إعداد Firebase Web غير مكتمل؛ لا يمكن تسجيل الدخول حاليًا.');
      setLoading(false);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ idToken }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'تعذر تفعيل جلسة الإدارة.');
      }

      await signOut(auth);
      router.replace('/admin');
      router.refresh();
    } catch (error) {
      if (auth.currentUser) await signOut(auth).catch(() => {});
      setMessage(
        error.code === 'auth/invalid-credential' ||
          error.code === 'auth/invalid-login-credentials'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
          : error.message || 'تعذر تسجيل الدخول. تحقق من الاتصال وحاول مجددًا.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-bold text-slate-700">
          البريد الإلكتروني
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-left text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-slate-700">
          كلمة المرور
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            جارٍ التحقق...
          </>
        ) : (
          <>
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            دخول لوحة الإدارة
          </>
        )}
      </button>

      {message && (
        <p
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      )}
    </form>
  );
}
