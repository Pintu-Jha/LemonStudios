import type { FlowAnswers } from '../store/types'

/**
 * Per-step validation functions.
 * Returns an error message string if invalid, or null if valid.
 */
export const validators: Record<number, (a: FlowAnswers) => string | null> = {
  1: (a) => (a.ageRange ? null : 'Please select your age range'),
  2: (a) => (a.goal ? null : 'Please select a goal'),
  3: (a) => (a.activityLevel ? null : 'Please select your activity level'),
  4: (a) => (a.dietType ? null : 'Please select a diet preference'),
  5: (a) => (a.preferences.length > 0 ? null : 'Select at least one preference'),
}

/**
 * Validate a specific step's answers.
 */
export const validateStep = (stepId: number, answers: FlowAnswers): string | null => {
  const validator = validators[stepId]
  return validator ? validator(answers) : null
}
