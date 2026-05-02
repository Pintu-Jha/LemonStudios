import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing } from '@/src/theme/spacing'

interface StepHeaderProps {
  title: string
  subtitle?: string
}

export const StepHeader: React.FC<StepHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.styles.title,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
})
