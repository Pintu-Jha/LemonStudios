import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
}

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Only initialize if credentials are available
const app = getApps().length === 0 && isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : getApps()[0] ?? null

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null

/**
 * Ensure the user is authenticated anonymously.
 * Returns the UID or null if Firebase is not configured.
 */
export const ensureAuth = async (): Promise<string | null> => {
  if (!auth) return null
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
  return auth.currentUser?.uid ?? null
}

export { isFirebaseConfigured }
