import 'server-only';

import { cookies } from 'next/headers';
import { getFirebaseAdminAuth } from './firebase-admin';

export const adminSessionCookieName = 'webstep-admin-session';
export const adminSessionMaxAge = 5 * 24 * 60 * 60 * 1000;

export function isAdminEmail(email) {
  const allowedEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && allowedEmails.includes(email.toLowerCase()));
}

export async function getAdminSession() {
  const sessionCookie = (await cookies()).get(adminSessionCookieName)?.value;
  if (!sessionCookie) return null;

  const firebaseAuth = getFirebaseAdminAuth();
  if (!firebaseAuth) {
    throw new Error('Firebase Admin Auth is not configured for the admin area.');
  }

  try {
    const claims = await firebaseAuth.verifySessionCookie(sessionCookie, true);
    if (!isAdminEmail(claims.email)) return null;
    return { uid: claims.uid, email: claims.email };
  } catch (error) {
    if (
      error?.code === 'auth/session-cookie-expired' ||
      error?.code === 'auth/session-cookie-revoked' ||
      error?.code === 'auth/invalid-session-cookie'
    ) {
      return null;
    }
    throw error;
  }
}
