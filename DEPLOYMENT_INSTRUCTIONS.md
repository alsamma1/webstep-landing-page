# تعليمات رفع ويب ستيب إلى GitHub وربطه بـ Vercel

هذا المجلد يحتوي على كود المشروع الكامل بعد اختباره وتأكيد نجاح بناء الإنتاج (Build Verified: Code 0).

## 1. الخطوة الأولى: رفع الكود إلى مستودع GitHub
يمكنك رفع محتويات هذا المجلد مباشرة إلى مستودع GitHub الخاص بمشروعك (wepstep):
- سواء عبر سحب وإفلات الملفات في موقع GitHub داخل المتصفح.
- أو عبر أداة GitHub Desktop أو سطر الأوامر (Git).

## 2. الخطوة الثانية: متغيرات البيئة في Vercel
في لوحة تحكم **Vercel** > مشروعك > **Settings** > **Environment Variables**، تأكد من إضافة المتغيرات التالية:

```env
NEXT_PUBLIC_SITE_URL=https://wepste.com
NEXT_PUBLIC_GA_ID=G-30E5FSM42H

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SECRET_KEY

# Admin Dashboard Credentials
ADMIN_USERNAME=YOUR_ADMIN_USERNAME
ADMIN_PASSWORD=YOUR_STRONG_UNIQUE_PASSWORD
ADMIN_SESSION_SECRET=GENERATE_A_SECURE_RANDOM_SECRET

# Firebase Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_PROJECT_ID=webstep-landing-page
```

## 3. الخطوة الثالثة: النشر التلقائي
بمجرد رفع الملفات إلى فرع main في GitHub، ستقوم منصة Vercel تلقائياً باكتشاف التحديث وبناء الموقع ونشره مباشرة على نطاقك الرسمي:
https://wepste.com
