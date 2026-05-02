import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStorage } from '../services/storage/localStore'
import type { FlowAnswers, FlowState } from './types'
import { INITIAL_ANSWERS, INITIAL_STATE } from './types'

interface FlowActions {
  setAnswer: <K extends keyof FlowAnswers>(key: K, value: FlowAnswers[K]) => void
  setStep: (step: number) => void
  markStepComplete: (step: number) => void
  setSyncing: (val: boolean) => void
  setSyncError: (err: string | null) => void
  setLastSynced: (ts: string) => void
  resetFlow: () => void
  hydrateFromRemote: (remote: Partial<FlowState>) => void
}

export type FlowStore = FlowState & FlowActions

export const useFlowStore = create<FlowStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      setStep: (step) =>
        set({ currentStep: step }),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      setSyncing: (val) =>
        set({ isSyncing: val }),

      setSyncError: (err) =>
        set({ syncError: err }),

      setLastSynced: (ts) =>
        set({ lastSyncedAt: ts }),

      resetFlow: () =>
        set({
          ...INITIAL_STATE,
          answers: { ...INITIAL_ANSWERS },
          completedSteps: [],
        }),

      hydrateFromRemote: (remote) =>
        set((state) => ({
          currentStep: remote.currentStep ?? state.currentStep,
          answers: remote.answers ? { ...state.answers, ...remote.answers } : state.answers,
          completedSteps: remote.completedSteps ?? state.completedSteps,
        })),
    }),
    {
      name: 'flowkit-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        completedSteps: state.completedSteps,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
)
