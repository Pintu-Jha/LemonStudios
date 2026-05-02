import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

interface ScreenWrapperProps {
  children: React.ReactNode
  withKeyboardAvoid?: boolean
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withKeyboardAvoid = false,
}) => {
  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {children}
    </SafeAreaView>
  )

  if (withKeyboardAvoid) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    )
  }

  return content
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
})
