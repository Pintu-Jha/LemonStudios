import { getApps, initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
}

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = getApps().length === 0 && isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : getApps()[0] ?? null

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null

export const ensureAuth = async (): Promise<string | null> => {
  if (!auth) return null
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
  return auth.currentUser?.uid ?? null
}

export { isFirebaseConfigured }
