import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '../../theme';

const { Colors, Spacing, Borders, Typography } = Theme;

export default function AnalysisScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [progress, setProgress] = useState(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    loadLanguage();
    startAnalysis();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const startAnalysis = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        router.push('/onboarding/report');
      }, 500);
    });

    // Update progress percentage
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const content = {
    tr: {
      title: 'Analiz Ediliyor',
      subtitle: 'Verilerinizi analiz ediyoruz',
      analyzing: 'Kişiselleştirilmiş önerileriniz hazırlanıyor...',
      steps: [
        'Hedefleriniz değerlendiriliyor',
        'Yaşam tarzınız analiz ediliyor',
        'Semptomlarınız inceleniyor',
        'Sağlık geçmişiniz değerlendiriliyor',
        'Kişisel plan oluşturuluyor',
      ],
    },
    en: {
      title: 'Analyzing',
      subtitle: 'We are analyzing your data',
      analyzing: 'Your personalized recommendations are being prepared...',
      steps: [
        'Evaluating your goals',
        'Analyzing your lifestyle',
        'Reviewing your symptoms',
        'Assessing your medical history',
        'Creating your personal plan',
      ],
    },
  };

  const currentContent = content[language];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.loadingIcon,
              {
                transform: [{
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.iconText}>🧠</Text>
          </Animated.View>
        </View>

        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <Text style={styles.analyzingText}>{currentContent.analyzing}</Text>

        <View style={styles.stepsContainer}>
          {currentContent.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepIndicator,
                  progress > (index + 1) * 20 && styles.stepIndicatorCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    progress > (index + 1) * 20 && styles.stepNumberCompleted,
                  ]}
                >
                  {progress > (index + 1) * 20 ? '✓' : index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepText,
                  progress > (index + 1) * 20 && styles.stepTextCompleted,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  loadingIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  analyzingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  stepsContainer: {
    width: '100%',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepIndicatorCompleted: {
    backgroundColor: Colors.primary[600],
  },
  stepNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.secondary,
  },
  stepNumberCompleted: {
    color: Colors.text.inverse,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  stepTextCompleted: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
});
