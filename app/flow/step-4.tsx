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
import { DIET_LABELS, DIET_ICONS } from '@/src/utils/constants'
import type { IoniconsName } from '@/src/utils/constants'
import { spacing } from '@/src/theme/spacing'
import type { DietType } from '@/src/store/types'

const STEP_ID = 4

const dietOptions: { value: DietType; label: string; icon: IoniconsName }[] = [
  { value: 'standard', label: DIET_LABELS.standard, icon: DIET_ICONS.standard },
  { value: 'vegetarian', label: DIET_LABELS.vegetarian, icon: DIET_ICONS.vegetarian },
  { value: 'vegan', label: DIET_LABELS.vegan, icon: DIET_ICONS.vegan },
  { value: 'keto', label: DIET_LABELS.keto, icon: DIET_ICONS.keto },
  { value: 'paleo', label: DIET_LABELS.paleo, icon: DIET_ICONS.paleo },
]

export default function Step4Screen() {
  const { answers, setAnswer } = useFlowStore()
  const nav = useFlowNavigation(STEP_ID)
  const { syncToFirebase } = useProgress()

  useEffect(() => {
    if (answers.dietType) { nav.clearError(); syncToFirebase() }
  }, [answers.dietType])

  return (
    <ScreenWrapper>
      <ProgressBar current={nav.current} total={nav.total} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StepHeader title="Diet preference?" subtitle="We'll factor this into your nutrition plan" />
        <ErrorBanner message={nav.error ?? ''} visible={!!nav.error} />
        <View style={styles.options}>
          {dietOptions.map((o, i) => (
            <Animated.View key={o.value} entering={FadeInDown.duration(400).delay(i * 80)}>
              <RadioCard value={o.value} label={o.label} icon={o.icon} selected={answers.dietType === o.value} onSelect={(v) => setAnswer('dietType', v)} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continue" onPress={nav.goNext} />
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
