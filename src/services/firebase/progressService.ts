import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth, isFirebaseConfigured } from './config'
import type { FlowState } from '@/src/store/types'

/**
 * Save the current flow state to Firestore.
 * No-ops if Firebase is not configured.
 */
export const saveProgress = async (state: FlowState): Promise<void> => {
  if (!isFirebaseConfigured || !db) return

  const uid = await ensureAuth()
  if (!uid) return

  await setDoc(
    doc(db, 'users', uid, 'progress', 'data'),
    {
      currentStep: state.currentStep,
      answers: state.answers,
      completedSteps: state.completedSteps,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

/**
 * Fetch saved progress from Firestore.
 * Returns null if Firebase is not configured or no data exists.
 */
export const fetchProgress = async (): Promise<Partial<FlowState> | null> => {
  if (!isFirebaseConfigured || !db) return null

  const uid = await ensureAuth()
  if (!uid) return null

  const snap = await getDoc(doc(db, 'users', uid, 'progress', 'data'))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    currentStep: data.currentStep,
    answers: data.answers,
    completedSteps: data.completedSteps,
  }
}
