import type { FlowAnswers } from '../store/types'
import {
  AGE_RANGE_LABELS,
  GOAL_LABELS,
  ACTIVITY_LABELS,
  DIET_LABELS,
  PREFERENCE_LABELS,
} from './constants'

/**
 * Format a flow answer value into a human-readable label.
 */
export const formatAnswer = (key: keyof FlowAnswers, value: unknown): string => {
  if (value === null || value === undefined) return '—'

  switch (key) {
    case 'ageRange':
      return AGE_RANGE_LABELS[value as string] ?? String(value)
    case 'goal':
      return GOAL_LABELS[value as string] ?? String(value)
    case 'activityLevel':
      return ACTIVITY_LABELS[value as string] ?? String(value)
    case 'dietType':
      return DIET_LABELS[value as string] ?? String(value)
    case 'preferences':
      return (value as string[])
        .map((p) => PREFERENCE_LABELS[p] ?? p)
        .join(', ')
    default:
      return String(value)
  }
}

/**
 * Build a summary array from the user's answers, skipping null values.
 */
export const buildSummary = (answers: FlowAnswers) => {
  const items: { label: string; value: string; stepId: number }[] = []

  if (answers.ageRange) {
    items.push({ label: 'Age Range', value: formatAnswer('ageRange', answers.ageRange), stepId: 1 })
  }
  if (answers.goal) {
    items.push({ label: 'Goal', value: formatAnswer('goal', answers.goal), stepId: 2 })
  }
  if (answers.activityLevel) {
    items.push({ label: 'Activity Level', value: formatAnswer('activityLevel', answers.activityLevel), stepId: 3 })
  }
  if (answers.dietType) {
    items.push({ label: 'Diet Preference', value: formatAnswer('dietType', answers.dietType), stepId: 4 })
  }
  if (answers.preferences.length > 0) {
    items.push({ label: 'Preferences', value: formatAnswer('preferences', answers.preferences), stepId: 5 })
  }

  return items
}
