import React, { useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper'
import { StepHeader } from '@/src/components/ui/StepHeader'
import { Tag } from '@/src/components/ui/Tag'
import { Button } from '@/src/components/ui/Button'
import { useFlowStore } from '@/src/store/flowStore'
import { useProgress } from '@/src/hooks/useProgress'
import { buildSummary } from '@/src/utils/formatters'
import { STEPS } from '@/src/utils/flowConfig'
import { PREFERENCE_ICONS } from '@/src/utils/constants'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

export default function SummaryScreen() {
  const { answers, resetFlow } = useFlowStore()
  const { syncToFirebase } = useProgress()
  const router = useRouter()
  const summary = buildSummary(answers)

  const handleEdit = useCallback((stepId: number) => {
    const step = STEPS.find((s) => s.id === stepId)
    if (step) router.push(step.route as any)
  }, [router])

  const handleSubmit = useCallback(() => {
    syncToFirebase()
    Alert.alert(
      'All Done!',
      'Your personalized fitness plan is ready. We\'ve saved your preferences.',
      [{ text: 'Start Over', onPress: () => { resetFlow(); router.replace('/' as any) } },
       { text: 'OK' }]
    )
  }, [syncToFirebase, resetFlow, router])

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StepHeader title="Your Summary" subtitle="Review your selections before we finalize" />

        <View style={styles.cards}>
          {summary.map((item, index) => (
            <Animated.View key={item.label} entering={FadeInDown.duration(400).delay(index * 100)}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  <TouchableOpacity onPress={() => handleEdit(item.stepId)} hitSlop={8}>
                    <Ionicons name="pencil" size={16} color={colors.accent.primary} />
                  </TouchableOpacity>
                </View>
                {item.label === 'Preferences' ? (
                  <View style={styles.tagsRow}>
                    {answers.preferences.map((p) => (
                      <Tag key={p} label={p.replace(/_/g, ' ')} icon={PREFERENCE_ICONS[p]} />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.cardValue}>{item.value}</Text>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Decorative gradient card */}
        <Animated.View entering={FadeInDown.duration(500).delay(summary.length * 100 + 100)}>
          <LinearGradient colors={[...colors.accent.gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaCard}>
            <Ionicons name="rocket-outline" size={40} color={colors.text.inverse} style={styles.ctaIcon} />
            <Text style={styles.ctaTitle}>Ready to go!</Text>
            <Text style={styles.ctaBody}>Your personalized plan has been created based on your selections.</Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Confirm & Finish" onPress={handleSubmit} />
        <Button label="Back" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing['3xl'] },
  cards: { paddingHorizontal: spacing.xl, gap: spacing.md },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  cardValue: {
    ...typography.styles.subtitle,
    color: colors.text.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ctaCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing['2xl'],
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  ctaIcon: { marginBottom: spacing.md },
  ctaTitle: {
    ...typography.styles.title,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  ctaBody: {
    ...typography.styles.body,
    color: 'rgba(11, 15, 26, 0.7)',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
})
