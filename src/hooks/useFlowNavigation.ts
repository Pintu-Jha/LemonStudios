import { useRouter } from 'expo-router'
import { useFlowStore } from '@/src/store/flowStore'
import { getActiveSteps, getStepProgress } from '@/src/utils/flowConfig'
import { validateStep } from '@/src/utils/validators'
import { useCallback, useMemo, useState } from 'react'

/**
 * Navigation hook for flow steps.
 * Handles validation, conditional step skipping, and progress tracking.
 */
export const useFlowNavigation = (stepId: number) => {
  const { answers, setStep, markStepComplete } = useFlowStore()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const activeSteps = useMemo(() => getActiveSteps(answers), [answers])
  const currentIndex = useMemo(
    () => activeSteps.findIndex((s) => s.id === stepId),
    [activeSteps, stepId]
  )
  const progress = useMemo(
    () => getStepProgress(stepId, answers),
    [stepId, answers]
  )

  const canGoBack = currentIndex > 0

  const goNext = useCallback(() => {
    const validationError = validateStep(stepId, answers)
    if (validationError) {
      setError(validationError)
      return false
    }

    setError(null)
    markStepComplete(stepId)

    const next = activeSteps[currentIndex + 1]
    if (next) {
      setStep(next.id)
      router.push(next.route as any)
    } else {
      router.push('/flow/summary' as any)
    }
    return true
  }, [stepId, answers, activeSteps, currentIndex, markStepComplete, setStep, router])

  const goBack = useCallback(() => {
    const prev = activeSteps[currentIndex - 1]
    if (prev) {
      setStep(prev.id)
      router.push(prev.route as any)
    } else {
      router.back()
    }
  }, [activeSteps, currentIndex, setStep, router])

  const clearError = useCallback(() => setError(null), [])

  return {
    goNext,
    goBack,
    canGoBack,
    error,
    clearError,
    ...progress,
  }
}
