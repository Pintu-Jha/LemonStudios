import React, { useEffect } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  visible: boolean
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  visible,
}) => {
  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Ionicons name="alert-circle" size={18} color={colors.semantic.error} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  message: {
    ...typography.styles.caption,
    color: colors.semantic.error,
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  retryText: {
    ...typography.styles.label,
    color: colors.semantic.error,
    fontSize: 12,
  },
})
