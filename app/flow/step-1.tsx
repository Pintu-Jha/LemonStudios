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
import { spacing } from '@/src/theme/spacing'
import type { AgeRange } from '@/src/store/types'
import type { IoniconsName } from '@/src/utils/constants'

const STEP_ID = 1

const ageOptions: { value: AgeRange; label: string; icon: IoniconsName }[] = [
  { value: '18-24', label: '18 – 24', icon: 'person-outline' },
  { value: '25-34', label: '25 – 34', icon: 'person-outline' },
  { value: '35-44', label: '35 – 44', icon: 'person-outline' },
  { value: '45-54', label: '45 – 54', icon: 'person-outline' },
  { value: '55+', label: '55+', icon: 'person-outline' },
]

export default function Step1Screen() {
  const { answers, setAnswer } = useFlowStore()
  const { goNext, goBack, canGoBack, current, total, error, clearError } =
    useFlowNavigation(STEP_ID)
  const { syncToFirebase } = useProgress()

  useEffect(() => {
    if (answers.ageRange) {
      clearError()
      syncToFirebase()
    }
  }, [answers.ageRange])

  return (
    <ScreenWrapper>
      <ProgressBar current={current} total={total} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader
          title="How old are you?"
          subtitle="This helps us personalize your fitness plan"
        />

        <ErrorBanner message={error ?? ''} visible={!!error} />

        <View style={styles.options}>
          {ageOptions.map((option, index) => (
            <Animated.View
              key={option.value}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <RadioCard
                value={option.value}
                label={option.label}
                icon={option.icon}
                selected={answers.ageRange === option.value}
                onSelect={(val) => setAnswer('ageRange', val)}
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
