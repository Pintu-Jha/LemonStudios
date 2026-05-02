import type { FlowAnswers, Goal } from '../store/types'

export interface StepConfig {
  id: number
  route: string
  title: string
  required: (keyof FlowAnswers)[]
  conditional?: boolean
}

export const STEPS: StepConfig[] = [
  { id: 1, route: '/flow/step-1', title: 'Age Range',      required: ['ageRange'] },
  { id: 2, route: '/flow/step-2', title: 'Your Goal',      required: ['goal'] },
  { id: 3, route: '/flow/step-3', title: 'Activity Level', required: ['activityLevel'] },
  { id: 4, route: '/flow/step-4', title: 'Diet',           required: ['dietType'], conditional: true },
  { id: 5, route: '/flow/step-5', title: 'Preferences',    required: ['preferences'] },
]

/** Weight-related goals that trigger the conditional diet step */
const WEIGHT_GOALS: Goal[] = ['lose_weight', 'gain_muscle']

/**
 * Returns the list of active steps based on the user's current answers.
 * The diet step (step 4) only appears if a weight-related goal is selected.
 */
export const getActiveSteps = (answers: FlowAnswers): StepConfig[] => {
  const showDiet = answers.goal !== null && WEIGHT_GOALS.includes(answers.goal)
  return STEPS.filter((s) => !s.conditional || showDiet)
}

/**
 * Returns progress info for a given step within the active steps.
 */
export const getStepProgress = (stepId: number, answers: FlowAnswers) => {
  const active = getActiveSteps(answers)
  const index = active.findIndex((s) => s.id === stepId)
  return { current: index + 1, total: active.length }
}
