import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

interface MultiSelectCardProps {
  value: string
  label: string
  icon?: IoniconsName
  selected: boolean
  onToggle: (value: string) => void
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export const MultiSelectCard: React.FC<MultiSelectCardProps> = ({
  value,
  label,
  icon,
  selected,
  onToggle,
}) => {
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
    onToggle(value)
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
              size={18}
              color={selected ? colors.accent.primary : colors.text.secondary}
            />
          </View>
        ) : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
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
    width: 34,
    height: 34,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: {
    ...typography.styles.bodyMedium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.accent.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  checkboxSelected: {
    borderColor: colors.accent.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.primary,
  },
})
