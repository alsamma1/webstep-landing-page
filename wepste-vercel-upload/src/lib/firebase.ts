/**
 * Firebase Client SDK — WebStep
 * Safe singleton initialisation with graceful fallback.
 */

import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = Object.freeze({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
})

export const isFirebaseConfigured = Object.entries(firebaseConfig)
  .filter(([k]) => !k.includes('measurementId'))
  .every(([, v]) => typeof v === 'string' && v.length > 0 && !v.startsWith('your_'))

const app = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const firestore = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null
export const auth = app ? getAuth(app) : null

// Analytics — browser only
export const getFirebaseAnalytics = async () => {
  if (!app || typeof window === 'undefined') return null
  const supported = await isSupported()
  if (!supported) return null
  return getAnalytics(app)
}
