import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

interface RadioCardProps<T extends string> {
  value: T
  label: string
  description?: string
  icon?: IoniconsName
  selected: boolean
  onSelect: (value: T) => void
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export function RadioCard<T extends string>({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
}: RadioCardProps<T>) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: withTiming(
      selected ? colors.accent.primary : colors.border.default,
      { duration: 200 }
    ),
    backgroundColor: withTiming(
      selected ? colors.accent.primaryDim : colors.bg.card,
      { duration: 200 }
    ),
  }))

  const handlePress = () => {
    scale.value = withSpring(0.96, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 })
    })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSelect(value)
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.card, animatedStyle]}
    >
      <View style={styles.content}>
        {icon ? (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={selected ? colors.accent.primary : colors.text.secondary}
            />
          </View>
        ) : null}
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.labelSelected]}>
            {label}
          </Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </AnimatedTouchable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.styles.bodyMedium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.accent.primary,
  },
  description: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  radioSelected: {
    borderColor: colors.accent.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.primary,
  },
})
