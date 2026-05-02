import { useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useFlowStore } from '@/src/store/flowStore'
import { saveProgress, fetchProgress as fetchProgressService } from '@/src/services/firebase'
import { FIREBASE_SYNC_DEBOUNCE_MS } from '@/src/utils/constants'

/**
 * Firebase sync hook with debounced auto-save.
 * Gracefully no-ops if Firebase is not configured.
 */
export const useProgress = () => {
  const store = useFlowStore()

  const syncToFirebase = useDebouncedCallback(async () => {
    store.setSyncing(true)
    store.setSyncError(null)
    try {
      await saveProgress({
        currentStep: store.currentStep,
        answers: store.answers,
        completedSteps: store.completedSteps,
        isSyncing: false,
        syncError: null,
        lastSyncedAt: store.lastSyncedAt,
      })
      store.setLastSynced(new Date().toISOString())
    } catch (e) {
      store.setSyncError('Failed to save progress. Tap to retry.')
    } finally {
      store.setSyncing(false)
    }
  }, FIREBASE_SYNC_DEBOUNCE_MS)

  const fetchRemoteProgress = useCallback(async () => {
    try {
      const remote = await fetchProgressService()
      if (remote) {
        // Merge remote into local only if remote has higher step
        if (remote.currentStep && remote.currentStep > store.currentStep) {
          store.hydrateFromRemote(remote)
        }
      }
    } catch {
      // Silent fallback to local state
    }
  }, [store])

  const retrySave = useCallback(() => {
    syncToFirebase()
  }, [syncToFirebase])

  return { syncToFirebase, fetchRemoteProgress, retrySave }
}
