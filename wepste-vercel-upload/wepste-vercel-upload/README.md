# ويب ستيب — Next.js + Firebase

Arabic-first, responsive Next.js App Router landing page backed by Cloud Firestore. Lead creation and initial service seeding run on the server with Firebase Admin; Firebase Admin credentials must never be exposed to the browser.

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.local.example` to `.env.local`.
3. Fill in the Firebase web app configuration values using the `NEXT_PUBLIC_FIREBASE_*` variable names and set `FIREBASE_PROJECT_ID`.
4. For local development, set `WEBSTEP_FIREBASE_ADMIN_CREDENTIALS` to the absolute path of the Webstep service-account JSON. This project-specific variable takes precedence over machine-wide Google credentials.
5. Optionally set `NEXT_PUBLIC_GA_ID` to the real Google Analytics measurement ID.
6. After verifying the domain in Google Search Console, optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the HTML verification code.
7. Run `npm install`, then `npm run dev`. Use `npm run build` to verify a production build.

The homepage reads `services` from Firestore. On its first request, if that collection is empty and Admin credentials are configured, it seeds the four starter services atomically. Without Firebase credentials, the homepage displays the same built-in service content and lead submissions return a configuration error rather than pretending they were saved.

Deploy `firestore.rules` and `storage.rules` to Firebase. The web SDK has no direct write access; Firestore writes are performed by server-side Admin SDK code. Keep Admin service-account credentials in the hosting provider's secret manager.

The Analytics page view is queued immediately, while the external Google tag loads after the visitor's first interaction or after 15 seconds. This keeps the tag off the initial rendering path; visitors who leave before either trigger may not be recorded.

The production page uses Firebase Admin and Next.js Server Actions, so it requires a server-capable host. Firebase App Hosting deployment for this project requires the Firebase Blaze billing plan. Do not deploy a static export to Firebase Hosting as a substitute: it would disable the server-rendered Firestore content and lead form actions.

## Deploying to Vercel

Import the GitHub repository into Vercel and add the Firebase web settings as `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`. Set `FIREBASE_PROJECT_ID` to `webstep-landing-page`. In Vercel Project Settings > Environment Variables, add `FIREBASE_SERVICE_ACCOUNT_JSON` containing the complete service-account JSON as an encrypted secret; do not set `WEBSTEP_FIREBASE_ADMIN_CREDENTIALS` or a local Windows credential-file path there. Also set `NEXT_PUBLIC_GA_ID` to the production measurement ID and optionally `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` after verifying the domain in Search Console. Select Production (and Preview if needed), save, then redeploy. The Admin SDK loads credentials lazily at request time, so the Vercel build does not attempt to open a local key file.

If lead submissions fail in production, check **Vercel > Project > Settings > Environment Variables** for `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT_JSON` in the **Production** environment. The latter must be the entire JSON key, not a file path, and its `project_id` must match `FIREBASE_PROJECT_ID`. Confirm that a Firestore database exists in the same Firebase project and that the service account has a Firestore-capable IAM role such as **Cloud Datastore User**. Firebase Admin writes bypass Firestore security rules, so changing `firestore.rules` will not fix server-side permission errors. After changing variables or IAM access, redeploy the latest deployment and inspect **Vercel > Logs** for `submitLeadAction failed` if it still cannot save.

## Search visibility

The site includes Arabic service-specific pages, unique page titles and descriptions, canonical URLs, internal links, structured organization/service/FAQ data, `robots.txt`, and a sitemap. Submit `https://wepste.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools, inspect/index the canonical pages, and monitor Core Web Vitals and search queries. Rankings depend on competition, useful original content, reputation/links, location, and ongoing work; no website can honestly guarantee first place for every broad technology query.

The WhatsApp contact number is configured in `components/WhatsAppButton.jsx` and the contact-form fallback link; update both when the business number changes.
