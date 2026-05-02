import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing, borderRadius } from '@/src/theme/spacing'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

interface TagProps {
  label: string
  icon?: IoniconsName
}

export const Tag: React.FC<TagProps> = ({ label, icon }) => {
  return (
    <View style={styles.tag}>
      {icon ? (
        <Ionicons
          name={icon}
          size={12}
          color={colors.accent.primary}
          style={styles.icon}
        />
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.primaryDim,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.styles.caption,
    color: colors.accent.primary,
    fontWeight: typography.weight.medium,
  },
})
