import { useCallback } from 'react'
import { useFlowStore } from '@/src/store/flowStore'
import { useProgress } from './useProgress'
import { getActiveSteps } from '@/src/utils/flowConfig'

/**
 * Resume flow hook — checks for remote progress on app launch
 * and returns the route to resume from.
 */
export const useResumeFlow = () => {
  const { answers, currentStep, completedSteps } = useFlowStore()
  const { fetchRemoteProgress } = useProgress()

  const checkResume = useCallback(async (): Promise<string> => {
    // Try to pull from Firebase first
    await fetchRemoteProgress()

    // Get the latest state after potential hydration
    const state = useFlowStore.getState()
    const active = getActiveSteps(state.answers)

    // If user has completed steps, resume from their current position
    if (state.completedSteps.length > 0) {
      const step = active.find((s) => s.id === state.currentStep)
      return step?.route ?? '/flow/step-1'
    }

    // Fresh start
    return '/flow/step-1'
  }, [fetchRemoteProgress])

  const hasProgress = completedSteps.length > 0

  return { checkResume, hasProgress }
}
