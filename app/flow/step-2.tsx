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
import { GOAL_LABELS, GOAL_ICONS } from '@/src/utils/constants'
import type { IoniconsName } from '@/src/utils/constants'
import { spacing } from '@/src/theme/spacing'
import type { Goal } from '@/src/store/types'

const STEP_ID = 2

const goalOptions: { value: Goal; label: string; icon: IoniconsName; description: string }[] = [
  { value: 'lose_weight', label: GOAL_LABELS.lose_weight, icon: GOAL_ICONS.lose_weight, description: 'Burn fat and slim down' },
  { value: 'gain_muscle', label: GOAL_LABELS.gain_muscle, icon: GOAL_ICONS.gain_muscle, description: 'Build strength and mass' },
  { value: 'maintain', label: GOAL_LABELS.maintain, icon: GOAL_ICONS.maintain, description: 'Keep your current fitness' },
  { value: 'improve_fitness', label: GOAL_LABELS.improve_fitness, icon: GOAL_ICONS.improve_fitness, description: 'Boost endurance and health' },
]

export default function Step2Screen() {
  const { answers, setAnswer } = useFlowStore()
  const { goNext, goBack, canGoBack, current, total, error, clearError } =
    useFlowNavigation(STEP_ID)
  const { syncToFirebase } = useProgress()

  useEffect(() => {
    if (answers.goal) {
      clearError()
      syncToFirebase()
    }
  }, [answers.goal])

  return (
    <ScreenWrapper>
      <ProgressBar current={current} total={total} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader
          title="What's your goal?"
          subtitle="We'll tailor your journey accordingly"
        />

        <ErrorBanner message={error ?? ''} visible={!!error} />

        <View style={styles.options}>
          {goalOptions.map((option, index) => (
            <Animated.View
              key={option.value}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <RadioCard
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.goal === option.value}
                onSelect={(val) => setAnswer('goal', val)}
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
