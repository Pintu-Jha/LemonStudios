export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+'

export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_fitness'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type DietType = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo'

export type Preference = 'morning_workouts' | 'home_workouts' | 'gym' | 'outdoor' | 'low_impact'

export interface FlowAnswers {
  ageRange: AgeRange | null
  goal: Goal | null
  activityLevel: ActivityLevel | null
  dietType: DietType | null        // only if weight goal selected
  preferences: Preference[]
}

export interface FlowState {
  currentStep: number
  answers: FlowAnswers
  completedSteps: number[]
  isSyncing: boolean
  syncError: string | null
  lastSyncedAt: string | null
}

export const INITIAL_ANSWERS: FlowAnswers = {
  ageRange: null,
  goal: null,
  activityLevel: null,
  dietType: null,
  preferences: [],
}

export const INITIAL_STATE: FlowState = {
  currentStep: 1,
  answers: { ...INITIAL_ANSWERS },
  completedSteps: [],
  isSyncing: false,
  syncError: null,
  lastSyncedAt: null,
}
