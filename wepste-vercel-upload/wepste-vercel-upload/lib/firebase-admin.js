import 'server-only';

import { readFileSync } from 'node:fs';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

let cachedDb;
let credentialsLoaded = false;
let serviceAccount;

function loadServiceAccount() {
  if (credentialsLoaded) return serviceAccount;
  credentialsLoaded = true;

  const inlineCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineCredentials) {
    try {
      serviceAccount = JSON.parse(inlineCredentials);
      return serviceAccount;
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.', {
        cause: error,
      });
    }
  }

  if (process.env.VERCEL) {
    return null;
  }

  const credentialsPath =
    process.env.WEBSTEP_FIREBASE_ADMIN_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) return null;

  try {
    serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    return serviceAccount;
  } catch (error) {
    throw new Error(
      'Cannot read Firebase Admin credentials. On Vercel, set FIREBASE_SERVICE_ACCOUNT_JSON to the full service-account JSON; local file paths are not available there.',
      { cause: error },
    );
  }
}

export function getFirebaseAdminDb() {
  if (cachedDb) return cachedDb;

  const credentials = loadServiceAccount();
  if (!process.env.FIREBASE_PROJECT_ID || !credentials) return null;

  if (credentials.project_id !== process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase service-account project_id does not match FIREBASE_PROJECT_ID.');
  }

  const app =
    getApps().find((candidate) => candidate.name === 'wepste-admin') ||
    initializeApp(
      {
        credential: cert(credentials),
        projectId: process.env.FIREBASE_PROJECT_ID,
        ...(process.env.FIREBASE_STORAGE_BUCKET
          ? { storageBucket: process.env.FIREBASE_STORAGE_BUCKET }
          : {}),
      },
      'wepste-admin',
    );

  cachedDb = getFirestore(app);
  return cachedDb;
}

export function adminServerTimestamp() {
  return FieldValue.serverTimestamp();
}
