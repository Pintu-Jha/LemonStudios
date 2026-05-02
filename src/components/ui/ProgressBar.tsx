import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

interface ProgressBarProps {
  current: number
  total: number
  animated?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  animated = true,
}) => {
  const progress = total > 0 ? current / total : 0

  const animatedStyle = useAnimatedStyle(() => ({
    width: animated
      ? withTiming(`${progress * 100}%`, { duration: 400 })
      : `${progress * 100}%`,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.stepText}>
          Step {current} of {total}
        </Text>
        <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  percentText: {
    ...typography.styles.caption,
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },
  track: {
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
})
