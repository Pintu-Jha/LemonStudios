import { Stack } from 'expo-router'
import { colors } from '@/src/theme/colors'

/**
 * Flow shell layout — wraps all flow step screens.
 * Individual screens handle their own ProgressBar and navigation.
 */
export default function FlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.primary },
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="step-1" />
      <Stack.Screen name="step-2" />
      <Stack.Screen name="step-3" />
      <Stack.Screen name="step-4" />
      <Stack.Screen name="step-5" />
      <Stack.Screen name="summary" />
    </Stack>
  )
}
