# ويب ستيب — Next.js + Firebase

Arabic-first, responsive Next.js App Router landing page backed by Cloud Firestore. Lead creation and initial service seeding run on the server with Firebase Admin; Firebase Admin credentials must never be exposed to the browser.

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.local.example` to `.env.local`.
3. Fill in the Firebase web app configuration values using the `NEXT_PUBLIC_FIREBASE_*` variable names and set `FIREBASE_PROJECT_ID`.
4. For local development, set `WEBSTEP_FIREBASE_ADMIN_CREDENTIALS` to the absolute path of the Webstep service-account JSON. This project-specific variable takes precedence over machine-wide Google credentials.
5. Optionally set `NEXT_PUBLIC_GA_ID` to the real Google Analytics measurement ID.
6. Run `npm install`, then `npm run dev`. Use `npm run build` to verify a production build.

The homepage reads `services` from Firestore. On its first request, if that collection is empty and Admin credentials are configured, it seeds the four starter services atomically. Without Firebase credentials, the homepage displays the same built-in service content and lead submissions return a configuration error rather than pretending they were saved.

Deploy `firestore.rules` and `storage.rules` to Firebase. The web SDK has no direct write access; Firestore writes are performed by server-side Admin SDK code. Keep Admin service-account credentials in the hosting provider's secret manager.

The production page uses Firebase Admin and Next.js Server Actions, so it requires a server-capable host. Firebase App Hosting deployment for this project requires the Firebase Blaze billing plan. Do not deploy a static export to Firebase Hosting as a substitute: it would disable the server-rendered Firestore content and lead form actions.

## Deploying to Vercel

Import the GitHub repository into Vercel and add the Firebase web settings as `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`. Set `FIREBASE_PROJECT_ID` to `webstep-landing-page`. In Vercel Project Settings > Environment Variables, add `FIREBASE_SERVICE_ACCOUNT_JSON` containing the complete service-account JSON as a secret; do not set the local Windows credential-file path there. Also set `NEXT_PUBLIC_GA_ID` to the production measurement ID. Redeploy after adding or changing environment variables.

Replace the example WhatsApp number in `app/page.js` with the company's real number before launch.
