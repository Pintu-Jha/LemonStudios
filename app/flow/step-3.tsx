import React, { useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper'
import { ProgressBar } from '@/src/components/ui/ProgressBar'
import { StepHeader } from '@/src/components/ui/StepHeader'
import { RadioCard } from '@/src/components/ui/RadioCard'
import { Button } from '@/src/components/ui/Button'
import { ErrorBanner } from '@/src/components/ui/ErrorBanner'
import { useFlowStore } from '@/src/store/flowStore'
import { useFlowNavigation } from '@/src/hooks/useFlowNavigation'
import { useProgress } from '@/src/hooks/useProgress'
import {
  ACTIVITY_LABELS,
  ACTIVITY_DESCRIPTIONS,
  ACTIVITY_ICONS,
} from '@/src/utils/constants'
import type { IoniconsName } from '@/src/utils/constants'
import { spacing } from '@/src/theme/spacing'
import type { ActivityLevel } from '@/src/store/types'

const STEP_ID = 3

const activityOptions: {
  value: ActivityLevel
  label: string
  description: string
  icon: IoniconsName
}[] = [
  { value: 'sedentary', label: ACTIVITY_LABELS.sedentary, description: ACTIVITY_DESCRIPTIONS.sedentary, icon: ACTIVITY_ICONS.sedentary },
  { value: 'light', label: ACTIVITY_LABELS.light, description: ACTIVITY_DESCRIPTIONS.light, icon: ACTIVITY_ICONS.light },
  { value: 'moderate', label: ACTIVITY_LABELS.moderate, description: ACTIVITY_DESCRIPTIONS.moderate, icon: ACTIVITY_ICONS.moderate },
  { value: 'active', label: ACTIVITY_LABELS.active, description: ACTIVITY_DESCRIPTIONS.active, icon: ACTIVITY_ICONS.active },
  { value: 'very_active', label: ACTIVITY_LABELS.very_active, description: ACTIVITY_DESCRIPTIONS.very_active, icon: ACTIVITY_ICONS.very_active },
]

export default function Step3Screen() {
  const { answers, setAnswer } = useFlowStore()
  const { goNext, goBack, canGoBack, current, total, error, clearError } =
    useFlowNavigation(STEP_ID)
  const { syncToFirebase } = useProgress()

  useEffect(() => {
    if (answers.activityLevel) {
      clearError()
      syncToFirebase()
    }
  }, [answers.activityLevel])

  return (
    <ScreenWrapper>
      <ProgressBar current={current} total={total} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader
          title="Activity level?"
          subtitle="Be honest — it helps us get it right"
        />

        <ErrorBanner message={error ?? ''} visible={!!error} />

        <View style={styles.options}>
          {activityOptions.map((option, index) => (
            <Animated.View
              key={option.value}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <RadioCard
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.activityLevel === option.value}
                onSelect={(val) => setAnswer('activityLevel', val)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue" onPress={goNext} />
        {canGoBack && (
          <Button label="Back" variant="ghost" onPress={goBack} />
        )}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  options: {
    paddingHorizontal: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
})
