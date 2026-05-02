# Multi-Step Flow App — Implementation Plan

> Senior-level React Native (Expo) + Firebase architecture plan  
> Submission Deadline: 4 May 2026

---

## App Concept

**FlowKit** — A health & fitness onboarding flow  
Steps: Age Range → Goal Selection → Activity Level → [Conditional: Diet Preference] → Preferences → Summary

The conditional step (Diet Preference) only appears if user selects a **weight-related goal** in Step 2.

---

## Project Structure

```
flowkit/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx
│   ├── index.tsx               # Splash / resume check
│   └── flow/
│       ├── _layout.tsx         # Flow shell (progress bar, back nav)
│       ├── step-1.tsx
│       ├── step-2.tsx
│       ├── step-3.tsx
│       ├── step-4.tsx          # Conditional (diet)
│       ├── step-5.tsx
│       └── summary.tsx
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── RadioCard.tsx
│   │   │   ├── MultiSelectCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepHeader.tsx
│   │   │   ├── ErrorBanner.tsx
│   │   │   └── Tag.tsx
│   │   └── layout/
│   │       ├── KeyboardAvoidingWrapper.tsx
│   │       └── ScreenWrapper.tsx
│   ├── store/
│   │   ├── flowStore.ts        # Zustand store
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useFlowNavigation.ts
│   │   ├── useProgress.ts      # Firebase sync hook
│   │   └── useResumeFlow.ts
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── progressService.ts   # POST /progress, GET /progress
│   │   │   └── index.ts
│   │   └── storage/
│   │       └── localStore.ts   # AsyncStorage / MMKV wrapper
│   ├── utils/
│   │   ├── flowConfig.ts       # Step definitions, conditional logic
│   │   ├── validators.ts       # Per-step validation functions
│   │   ├── formatters.ts       # Summary display formatters
│   │   └── constants.ts
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── index.ts
├── assets/
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## Part 1 — Expo App Plan

### 1.1 State Management — Zustand

```ts
// src/store/types.ts
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
```

```ts
// src/store/flowStore.ts — Zustand with MMKV persistence
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStorage } from '../services/storage/localStore'

interface FlowStore extends FlowState {
  setAnswer: <K extends keyof FlowAnswers>(key: K, value: FlowAnswers[K]) => void
  setStep: (step: number) => void
  markStepComplete: (step: number) => void
  setSyncing: (val: boolean) => void
  setSyncError: (err: string | null) => void
  setLastSynced: (ts: string) => void
  resetFlow: () => void
}
```

### 1.2 Flow Configuration — Centralized

```ts
// src/utils/flowConfig.ts
export const STEPS = [
  { id: 1, route: '/flow/step-1', title: 'Age Range',      required: ['ageRange'] },
  { id: 2, route: '/flow/step-2', title: 'Your Goal',      required: ['goal'] },
  { id: 3, route: '/flow/step-3', title: 'Activity Level', required: ['activityLevel'] },
  { id: 4, route: '/flow/step-4', title: 'Diet',           required: ['dietType'], conditional: true },
  { id: 5, route: '/flow/step-5', title: 'Preferences',    required: ['preferences'] },
]

// Conditional logic — pure function, easily testable
export const getActiveSteps = (answers: FlowAnswers): typeof STEPS => {
  const weightGoals: Goal[] = ['lose_weight', 'gain_muscle']
  const showDiet = answers.goal !== null && weightGoals.includes(answers.goal)
  return STEPS.filter(s => !s.conditional || showDiet)
}

export const getStepProgress = (stepId: number, answers: FlowAnswers) => {
  const active = getActiveSteps(answers)
  const index = active.findIndex(s => s.id === stepId)
  return { current: index + 1, total: active.length }
}
```

### 1.3 Validators — Per Step

```ts
// src/utils/validators.ts
export const validators: Record<number, (a: FlowAnswers) => string | null> = {
  1: (a) => a.ageRange ? null : 'Please select your age range',
  2: (a) => a.goal ? null : 'Please select a goal',
  3: (a) => a.activityLevel ? null : 'Please select your activity level',
  4: (a) => a.dietType ? null : 'Please select a diet preference',
  5: (a) => a.preferences.length > 0 ? null : 'Select at least one preference',
}
```

### 1.4 Navigation Hook

```ts
// src/hooks/useFlowNavigation.ts
export const useFlowNavigation = (stepId: number) => {
  const { answers, setStep, markStepComplete } = useFlowStore()
  const router = useRouter()
  const activeSteps = getActiveSteps(answers)
  const currentIndex = activeSteps.findIndex(s => s.id === stepId)

  const goNext = () => {
    const error = validators[stepId]?.(answers)
    if (error) return { error }
    markStepComplete(stepId)
    const next = activeSteps[currentIndex + 1]
    if (next) router.push(next.route)
    else router.push('/flow/summary')
    return { error: null }
  }

  const goBack = () => {
    const prev = activeSteps[currentIndex - 1]
    if (prev) router.push(prev.route)
    else router.back()
  }

  return { goNext, goBack, ...getStepProgress(stepId, answers) }
}
```

### 1.5 Local Persistence

```ts
// src/services/storage/localStore.ts
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

export const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
}
```

### 1.6 Resume Flow Hook

```ts
// src/hooks/useResumeFlow.ts
export const useResumeFlow = () => {
  const { answers, currentStep } = useFlowStore()
  const { fetchProgress } = useProgress()

  const checkResume = async () => {
    await fetchProgress()          // pull from Firebase
    const active = getActiveSteps(answers)
    const step = active.find(s => s.id === currentStep)
    return step?.route ?? '/flow/step-1'
  }

  return { checkResume }
}
```

---

## Part 2 — Firebase Backend Plan

### 2.1 Firebase Setup

**Services needed:**
- **Firestore** — store user progress documents
- **Anonymous Auth** — identify device without login

```ts
// src/services/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export const ensureAuth = async () => {
  if (!auth.currentUser) await signInAnonymously(auth)
  return auth.currentUser!.uid
}
```

### 2.2 Firestore Schema

```
users/{uid}/
  └── progress/
        ├── currentStep: number
        ├── answers: FlowAnswers
        ├── completedSteps: number[]
        └── updatedAt: Timestamp
```

### 2.3 Progress Service

```ts
// src/services/firebase/progressService.ts
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth } from './config'

export const saveProgress = async (state: FlowState): Promise<void> => {
  const uid = await ensureAuth()
  await setDoc(doc(db, 'users', uid, 'progress', 'data'), {
    currentStep: state.currentStep,
    answers: state.answers,
    completedSteps: state.completedSteps,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export const fetchProgress = async (): Promise<Partial<FlowState> | null> => {
  const uid = await ensureAuth()
  const snap = await getDoc(doc(db, 'users', uid, 'progress', 'data'))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    currentStep: data.currentStep,
    answers: data.answers,
    completedSteps: data.completedSteps,
  }
}
```

### 2.4 Sync Hook — Debounced Auto-Save

```ts
// src/hooks/useProgress.ts
export const useProgress = () => {
  const store = useFlowStore()

  const syncToFirebase = useDebouncedCallback(async () => {
    store.setSyncing(true)
    store.setSyncError(null)
    try {
      await saveProgress(store)
      store.setLastSynced(new Date().toISOString())
    } catch (e) {
      store.setSyncError('Failed to save progress. Tap to retry.')
    } finally {
      store.setSyncing(false)
    }
  }, 1500)

  const fetchProgress = async () => {
    try {
      const remote = await fetchProgressService()
      if (remote) {
        // merge remote into local only if remote is newer
        if (remote.currentStep && remote.currentStep > store.currentStep) {
          // hydrate store from remote
        }
      }
    } catch {}
  }

  return { syncToFirebase, fetchProgress }
}
```

### 2.5 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/progress/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## UI Component Contracts

### Button
```ts
interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}
```

### RadioCard
```ts
interface RadioCardProps<T extends string> {
  value: T
  label: string
  description?: string
  icon?: string
  selected: boolean
  onSelect: (value: T) => void
}
```

### ProgressBar
```ts
interface ProgressBarProps {
  current: number
  total: number
  animated?: boolean
}
```

### ErrorBanner
```ts
interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  visible: boolean
}
```

---

## Libraries

| Library | Purpose |
|---|---|
| `expo-router` | File-based navigation |
| `zustand` | State management |
| `react-native-mmkv` | Local persistence (fast, sync) |
| `firebase` | Firestore + Anonymous Auth |
| `react-native-reanimated` | Smooth step transitions |
| `use-debounce` | Debounce Firebase writes |
| `expo-linear-gradient` | UI gradients |

---

## Step Definitions (Final)

| Step | Screen | Input Type | Conditional |
|---|---|---|---|
| 1 | Age Range | Radio Cards | No |
| 2 | Goal Selection | Radio Cards | No |
| 3 | Activity Level | Radio Cards | No |
| 4 | Diet Preference | Radio Cards | Yes — shown if goal is `lose_weight` or `gain_muscle` |
| 5 | Preferences | Multi-select Cards | No |
| — | Summary | Read-only + Edit links | — |

---

## Error Handling Strategy

| Scenario | Behavior |
|---|---|
| Firebase save fails | Show `ErrorBanner` with retry, keep local state |
| Firebase fetch fails | Silent fallback to local MMKV state |
| No network on open | Resume from local state, sync when back online |
| Validation fails | Inline error below field, block Next |
| Step skipped manually | `getActiveSteps()` recalculates on every render |

---

## Implementation Order

1. `theme/` — colors, typography, spacing
2. `store/flowStore.ts` + `types.ts`
3. `utils/flowConfig.ts` + `validators.ts`
4. UI components (`Button`, `RadioCard`, `MultiSelectCard`, `ProgressBar`, `ErrorBanner`)
5. `services/storage/localStore.ts`
6. Screens: step-1 → step-5 → summary
7. `services/firebase/` (add after you set up Firebase)
8. `hooks/useProgress.ts` + `useResumeFlow.ts`
9. Resume logic in `app/index.tsx`

---

## Assumptions

- Anonymous auth is used — no login screen required
- Firebase credentials provided via `.env` (not committed)
- MMKV is the primary offline store; Firebase is best-effort sync
- Diet step skips cleanly — `dietType` remains `null` and is excluded from summary
- User identified by Firebase anonymous UID, persists per device install