import { Ionicons } from '@expo/vector-icons'

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

/**
 * App-wide constants
 */

export const APP_NAME = 'FlowKit'
export const APP_TAGLINE = 'Your personalized fitness journey starts here'

export const FIREBASE_SYNC_DEBOUNCE_MS = 1500

/** Labels for display */
export const AGE_RANGE_LABELS: Record<string, string> = {
  '18-24': '18 – 24',
  '25-34': '25 – 34',
  '35-44': '35 – 44',
  '45-54': '45 – 54',
  '55+': '55+',
}

export const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight',
  gain_muscle: 'Gain Muscle',
  maintain: 'Stay Healthy',
  improve_fitness: 'Improve Fitness',
}

export const GOAL_ICONS: Record<string, IoniconsName> = {
  lose_weight: 'flame-outline',
  gain_muscle: 'barbell-outline',
  maintain: 'leaf-outline',
  improve_fitness: 'walk-outline',
}

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Light Activity',
  moderate: 'Moderate',
  active: 'Active',
  very_active: 'Very Active',
}

export const ACTIVITY_DESCRIPTIONS: Record<string, string> = {
  sedentary: 'Little to no exercise',
  light: '1-3 days per week',
  moderate: '3-5 days per week',
  active: '6-7 days per week',
  very_active: 'Athlete-level training',
}

export const ACTIVITY_ICONS: Record<string, IoniconsName> = {
  sedentary: 'bed-outline',
  light: 'footsteps-outline',
  moderate: 'bicycle-outline',
  active: 'flash-outline',
  very_active: 'trophy-outline',
}

export const DIET_LABELS: Record<string, string> = {
  standard: 'Standard',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  keto: 'Keto',
  paleo: 'Paleo',
}

export const DIET_ICONS: Record<string, IoniconsName> = {
  standard: 'restaurant-outline',
  vegetarian: 'nutrition-outline',
  vegan: 'leaf-outline',
  keto: 'fish-outline',
  paleo: 'accessibility-outline',
}

export const PREFERENCE_LABELS: Record<string, string> = {
  morning_workouts: 'Morning Workouts',
  home_workouts: 'Home Workouts',
  gym: 'Gym',
  outdoor: 'Outdoor Activities',
  low_impact: 'Low Impact',
}

export const PREFERENCE_ICONS: Record<string, IoniconsName> = {
  morning_workouts: 'sunny-outline',
  home_workouts: 'home-outline',
  gym: 'barbell-outline',
  outdoor: 'trail-sign-outline',
  low_impact: 'body-outline',
}
