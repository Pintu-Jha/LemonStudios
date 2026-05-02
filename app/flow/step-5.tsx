import React, { useEffect, useCallback } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper'
import { ProgressBar } from '@/src/components/ui/ProgressBar'
import { StepHeader } from '@/src/components/ui/StepHeader'
import { MultiSelectCard } from '@/src/components/ui/MultiSelectCard'
import { Button } from '@/src/components/ui/Button'
import { ErrorBanner } from '@/src/components/ui/ErrorBanner'
import { useFlowStore } from '@/src/store/flowStore'
import { useFlowNavigation } from '@/src/hooks/useFlowNavigation'
import { useProgress } from '@/src/hooks/useProgress'
import { PREFERENCE_LABELS, PREFERENCE_ICONS } from '@/src/utils/constants'
import type { IoniconsName } from '@/src/utils/constants'
import { spacing } from '@/src/theme/spacing'
import type { Preference } from '@/src/store/types'

const STEP_ID = 5

const prefOptions: { value: Preference; label: string; icon: IoniconsName }[] = [
  { value: 'morning_workouts', label: PREFERENCE_LABELS.morning_workouts, icon: PREFERENCE_ICONS.morning_workouts },
  { value: 'home_workouts', label: PREFERENCE_LABELS.home_workouts, icon: PREFERENCE_ICONS.home_workouts },
  { value: 'gym', label: PREFERENCE_LABELS.gym, icon: PREFERENCE_ICONS.gym },
  { value: 'outdoor', label: PREFERENCE_LABELS.outdoor, icon: PREFERENCE_ICONS.outdoor },
  { value: 'low_impact', label: PREFERENCE_LABELS.low_impact, icon: PREFERENCE_ICONS.low_impact },
]

export default function Step5Screen() {
  const { answers, setAnswer } = useFlowStore()
  const nav = useFlowNavigation(STEP_ID)
  const { syncToFirebase } = useProgress()

  const togglePreference = useCallback((value: string) => {
    const current = answers.preferences
    const updated = current.includes(value as Preference)
      ? current.filter((p) => p !== value)
      : [...current, value as Preference]
    setAnswer('preferences', updated)
  }, [answers.preferences, setAnswer])

  useEffect(() => {
    if (answers.preferences.length > 0) { nav.clearError(); syncToFirebase() }
  }, [answers.preferences])

  return (
    <ScreenWrapper>
      <ProgressBar current={nav.current} total={nav.total} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StepHeader title="Your preferences" subtitle="Select all that apply" />
        <ErrorBanner message={nav.error ?? ''} visible={!!nav.error} />
        <View style={styles.options}>
          {prefOptions.map((o, i) => (
            <Animated.View key={o.value} entering={FadeInDown.duration(400).delay(i * 80)}>
              <MultiSelectCard value={o.value} label={o.label} icon={o.icon} selected={answers.preferences.includes(o.value)} onToggle={togglePreference} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="See My Summary" onPress={nav.goNext} />
        {nav.canGoBack && <Button label="Back" variant="ghost" onPress={nav.goBack} />}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing['3xl'] },
  options: { paddingHorizontal: spacing.xl },
  footer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.sm },
})
