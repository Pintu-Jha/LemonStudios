import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: ViewStyle
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}) => {
  const isDisabled = disabled || loading

  const handlePress = () => {
    if (isDisabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#2A3352', '#2A3352'] : [...colors.accent.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.primary, isDisabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.inverse} size="small" />
          ) : (
            <Text style={[styles.primaryText, isDisabled && styles.disabledText]}>
              {label}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.ghost, fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.secondary} size="small" />
      ) : (
        <Text style={[styles.ghostText, isDisabled && styles.disabledText]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primary: {
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  primaryText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
  ghost: {
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    backgroundColor: 'transparent',
  },
  ghostText: {
    ...typography.styles.button,
    color: colors.text.secondary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.6,
  },
})
