import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { colors } from '@/src/theme/colors'
import { typography } from '@/src/theme/typography'
import { spacing } from '@/src/theme/spacing'
import { Button } from '@/src/components/ui/Button'
import { useResumeFlow } from '@/src/hooks/useResumeFlow'
import { APP_NAME, APP_TAGLINE } from '@/src/utils/constants'
import { useFlowStore } from '@/src/store/flowStore'

export default function SplashScreen() {
  const router = useRouter()
  const { checkResume, hasProgress } = useResumeFlow()
  const resetFlow = useFlowStore((s) => s.resetFlow)
  const [isLoading, setIsLoading] = useState(true)
  const [resumeRoute, setResumeRoute] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const route = await checkResume()
        setResumeRoute(route)
      } catch {
        setResumeRoute('/flow/step-1')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleStart = useCallback(() => {
    resetFlow()
    router.push('/flow/step-1' as any)
  }, [resetFlow, router])

  const handleResume = useCallback(() => {
    if (resumeRoute) {
      router.push(resumeRoute as any)
    }
  }, [resumeRoute, router])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.accent.primary} size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative gradient orb */}
      <View style={styles.orbContainer}>
        <LinearGradient
          colors={[...colors.accent.gradient]}
          style={styles.orb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.logoContainer}>
          <Ionicons name="flash" size={52} color={colors.accent.primary} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(400)}>
          <Text style={styles.title}>{APP_NAME}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(600)}>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(800).delay(800)}
        style={styles.actions}
      >
        <Button
          label={hasProgress ? 'Start Fresh' : 'Get Started'}
          onPress={handleStart}
        />
        {hasProgress && (
          <Button
            label="Continue Where You Left Off"
            variant="ghost"
            onPress={handleResume}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbContainer: {
    position: 'absolute',
    top: -100,
    right: -80,
    opacity: 0.15,
  },
  orb: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accent.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    ...typography.styles.heroTitle,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  actions: {
    width: '100%',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['5xl'],
    gap: spacing.sm,
  },
})
