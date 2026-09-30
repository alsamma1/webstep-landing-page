import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

function loadServiceAccount() {
  const credentialsPath =
    process.env.WEBSTEP_FIREBASE_ADMIN_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credentialsPath) {
    try {
      return JSON.parse(readFileSync(credentialsPath, 'utf8'));
    } catch (error) {
      throw new Error(
        'Unable to read the Firebase service-account JSON configured for the Webstep project.',
        { cause: error },
      );
    }
  }

  const inlineCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!inlineCredentials) return null;

  try {
    return JSON.parse(inlineCredentials);
  } catch (error) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.', { cause: error });
  }
}

const serviceAccount = loadServiceAccount();
if (serviceAccount && serviceAccount.project_id !== process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Firebase service-account project_id does not match FIREBASE_PROJECT_ID.');
}

const adminApp =
  getApps().find((app) => app.name === 'wepste-admin') ||
  initializeApp(
    {
      ...(serviceAccount ? { credential: cert(serviceAccount) } : {}),
      projectId: process.env.FIREBASE_PROJECT_ID,
      ...(process.env.FIREBASE_STORAGE_BUCKET
        ? { storageBucket: process.env.FIREBASE_STORAGE_BUCKET }
        : {}),
    },
    'wepste-admin',
  );

export const adminDb = getFirestore(adminApp);
export const adminServerTimestamp = () => FieldValue.serverTimestamp();
export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID && serviceAccount,
);
