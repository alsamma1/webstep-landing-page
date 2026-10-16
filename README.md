# WebStep — المشروع الكامل

موقع ويب احترافي لشركة **WebStep** مبني بـ Next.js 15 App Router + Firebase.  
يدعم الفهرسة الكاملة في Google، Google Analytics، لوحة تحكم شاملة، وطلبات مرتبطة بـ WhatsApp.

---

## 🚀 الإعداد المحلي

```bash
# 1. تثبيت الحزم
npm install --legacy-peer-deps

# 2. نسخ ملف البيئة
copy .env.local.example .env.local

# 3. تعديل القيم في .env.local

# 4. تشغيل السيرفر المحلي
npm run dev
```

الموقع يعمل على: `http://localhost:3000`

---

## 🔐 لوحة التحكم الإدارية

**الرابط:** `http://localhost:3000/admin`  
**تسجيل الدخول:** `/admin/login`

اضبط بيانات دخول قوية وفريدة في `.env.local`، ولا تستخدم قيماً افتراضية:
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_unique_password
```

### صفحات لوحة التحكم:
| الصفحة | الوصف |
|--------|-------|
| `/admin` | لوحة التحكم الرئيسية |
| `/admin/orders` | إدارة الطلبات |
| `/admin/blog` | إدارة المدونة |
| `/admin/projects` | إدارة أعمالنا (Portfolio) |
| `/admin/designs` | إدارة مشاريع UI/UX ودراسات الحالة |
| `/admin/landing-service` | إدارة محتوى خدمة صفحات الهبوط |
| `/admin/services/ecommerce` | إدارة المتاجر الإلكترونية ومشاريعها |
| `/admin/services/systems` | إدارة الأنظمة الرقمية وحلول SaaS |
| `/admin/services/marketing` | إدارة الحلول الرقمية والتسويق |
| `/admin/services/support` | إدارة الدعم الفني والصيانة |
| `/admin/team` | إدارة الفريق |
| `/admin/careers` | إدارة الوظائف |
| `/admin/messages` | الرسائل والاستفسارات |
| `/admin/settings` | إعدادات الموقع |

### معرض أعمال UI/UX في Supabase

لتجهيز جدول معرض التصميمات، شغّل `supabase/uiux_designs_migration.sql` من Supabase Dashboard → SQL Editor. ينشئ الترحيل جدول `uiux_designs` وسياسات القراءة العامة للسجلات المنشورة فقط، ويضيف مشاريع أولية قابلة للتعديل. بعد ذلك استخدم `/admin/designs` لإدارة المشاريع والصور والفيديو وروابط Figma وSEO. الصور تُرفع إلى bucket `projects` في مجلد `uiux-designs`.

### إدارة محتوى صفحات الهبوط

لتفعيل الحفظ المباشر لخدمة صفحات الهبوط، شغّل `supabase/landing_service_migration.sql` في Supabase SQL Editor، ثم استخدم `/admin/landing-service` لإدارة النصوص والأنواع والمزايا والأعمال والباقات والصور وبيانات SEO. تُرفع الصور المضغوطة إلى bucket `projects` في مجلد `landing-pages`.

### إدارة صفحات الخدمات

لتفعيل بيانات Supabase للمتاجر الإلكترونية والأنظمة وحلول SaaS والتسويق والدعم الفني، شغّل `supabase/managed_services_migration.sql` في Supabase SQL Editor. ينشئ الترحيل جدولاً مستقلاً لكل خدمة مع سياسات RLS، ويتيح إدارة محتوى الصفحة والمشاريع المنشورة وتفاصيلها ومعارض صورها وروابط فيديو YouTube والباقات والأسئلة الشائعة وبيانات SEO من صفحات الإدارة أعلاه. تُضغط الصور قبل رفعها إلى bucket `projects` في مجلد `managed-services`. سجلات النماذج الأولية لا تُنشر تلقائياً؛ راجع محتواها وأضف بيانات المشاريع الحقيقية قبل تفعيل خيار النشر.

---

## 🔥 Firebase Setup

### 1. إنشاء المشروع
- اذهب إلى [Firebase Console](https://console.firebase.google.com)
- المشروع الحالي: `webstep-landing-page`

### 2. متغيرات البيئة المطلوبة:
```env
# Client SDK (آمن للـ frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Admin SDK (server-only - لا تعرضها للمتصفح)
FIREBASE_PROJECT_ID=...
WEBSTEP_FIREBASE_ADMIN_CREDENTIALS=C:/path/to/firebase-admin.json  # محلياً
# FIREBASE_SERVICE_ACCOUNT_JSON={...}  # على Vercel
```

### 3. Service Account (للـ Admin SDK):
1. Firebase Console → Project Settings → Service Accounts
2. Generate New Private Key
3. احفظ الملف في: `C:/Users/USER/.config/wepste/firebase-admin.json`
4. أضف المسار في `.env.local`

---

## 🌐 الرفع على Vercel

### الخطوات:
1. **رفع الكود على GitHub** (تأكد أن `.env.local` في `.gitignore`)
2. **استيراد المشروع في Vercel:** [vercel.com/new](https://vercel.com/new)
3. **إضافة متغيرات البيئة في Vercel:**

```
# Public Variables
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_SITE_URL=https://wepstep.sa
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...

# Secret Variables (لا تضف NEXT_PUBLIC_ لها)
FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}  ← كامل JSON
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

4. **Deploy!**

> ⚠️ **مهم:** `FIREBASE_SERVICE_ACCOUNT_JSON` يجب أن يحتوي على **كامل JSON** وليس مسار الملف

---

## 📊 Google Search Console

### الإعداد:
1. اذهب إلى [Search Console](https://search.google.com/search-console)
2. أضف الموقع: `https://wepstep.sa`
3. التحقق عبر HTML tag: انسخ الكود وضعه في:
   ```env
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxx
   ```
4. أعد النشر على Vercel
5. أرسل الـ Sitemap: `https://wepstep.sa/sitemap.xml`

### الـ Sitemap يشمل:
- الصفحة الرئيسية (priority: 1.0)
- 8 صفحات خدمات (priority: 0.9)
- صفحات الشركة: about, contact, order, careers, blog (priority: 0.85–0.95)
- مقالات المدونة المنشورة (ديناميكي)
- صفحات: privacy, terms (priority: 0.4)

---

## 📁 هيكل المشروع

```
wepstep/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root Layout + SEO + GA
│   │   ├── sitemap.ts          # Sitemap ديناميكي
│   │   ├── robots.ts           # robots.txt
│   │   ├── admin/              # لوحة التحكم (محمية)
│   │   │   ├── login/          # صفحة تسجيل الدخول
│   │   │   ├── orders/
│   │   │   ├── blog/
│   │   │   ├── projects/
│   │   │   ├── team/
│   │   │   ├── careers/
│   │   │   ├── messages/
│   │   │   └── settings/
│   │   ├── api/admin/          # API Routes
│   │   ├── services/           # 8 صفحات خدمات
│   │   ├── blog/               # المدونة
│   │   ├── about/
│   │   ├── contact/
│   │   ├── order/
│   │   ├── careers/
│   │   ├── privacy/
│   │   └── terms/
│   ├── components/             # مكونات React
│   ├── lib/
│   │   ├── db.ts               # قاعدة بيانات JSON
│   │   ├── firebase.ts         # Firebase Client
│   │   └── firebase-admin.ts   # Firebase Admin (server-only)
│   └── middleware.ts           # حماية مسارات /admin
├── data/db/                    # ملفات قاعدة البيانات
├── public/
│   ├── manifest.json           # PWA Manifest
│   └── assets/
├── .env.local                  # متغيرات البيئة (لا ترفعها)
├── .env.local.example          # نموذج البيئة
├── vercel.json                 # إعدادات Vercel
├── next.config.js              # إعدادات Next.js
└── .gitignore
```

---

## 🎯 تحسينات الأداء المطبقة

- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Google Analytics (deferred — لا يؤثر على LCP)
- ✅ Image optimization (AVIF + WebP)
- ✅ Font preloading (Cairo + Tajawal)
- ✅ Static asset caching (1 year)
- ✅ JSON-LD schemas (Organization + WebSite)
- ✅ Open Graph + Twitter Cards
- ✅ Sitemap ديناميكي
- ✅ Robots.txt مُحسَّن
- ✅ PWA Manifest
- ✅ Canonical URLs لكل صفحة
