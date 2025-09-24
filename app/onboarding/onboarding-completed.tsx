import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '../../theme';
import { CommonStyles } from '../../theme/common-styles';

const { Colors, Spacing, Borders, Typography } = Theme;
const { width, height } = Dimensions.get('window');

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

export default function OnboardingCompletedScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [userName, setUserName] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const confettiAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    loadUserData();
    startCelebrationAnimation();
  }, []);

  const loadUserData = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');

    const accountData = await SecureStore.getItemAsync('userAccount');
    const commitmentData = await SecureStore.getItemAsync('userCommitment');

    let name = 'Kahraman'; // Default Turkish
    if (language === 'en') name = 'Hero';

    if (commitmentData) {
      const commitment = JSON.parse(commitmentData);
      if (commitment.name) {
        name = commitment.name.split(' ')[0]; // Use first name only
      }
    } else if (accountData) {
      const account = JSON.parse(accountData);
      if (account.email) {
        name = account.email.split('@')[0]; // Use email prefix as name
      }
    }

    setUserName(name);
  };

  const startCelebrationAnimation = () => {
    setShowCelebration(true);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(confettiAnim, {
        toValue: height,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const content = {
    tr: {
      congratulations: 'Tebrikler!',
      personalMessage: `${userName}, bağırsak sağlığı yolculuğunuz başlıyor! 🎉`,
      subtitle: 'Artık size özel hazırlanmış GutWell planınıza erişebilirsiniz.',
      achievementsTitle: 'Kazandığınız Başarılar',
      achievements: [
        {
          icon: '📊',
          title: 'Kişisel Profil Tamamlandı',
          description: 'Detaylı sağlık analiziniz hazırlandı'
        },
        {
          icon: '🎯',
          title: 'Hedefler Belirlendi',
          description: 'Size özel sağlık hedefleri oluşturuldu'
        },
        {
          icon: '🤝',
          title: 'Taahhüt Verildi',
          description: 'Sağlık yolculuğunuza söz verdiniz'
        },
        {
          icon: '📱',
          title: 'Hesap Oluşturuldu',
          description: 'Verileriniz güvende, her yerden erişim sağlandı'
        },
      ] as Achievement[],
      nextStepsTitle: 'Sırada Ne Var?',
      nextSteps: [
        'Kişiselleştirilmiş günlük planınızı keşfedin',
        'İlk yemek kaydınızı yapın ve puan kazanın',
        'Günlük su hedefinizi tamamlayın',
        'Haftalık ilerleme raporlarınızı görün',
      ],
      startJourney: 'Yolculuğa Başla',
      welcomeToApp: 'GutWell\'e Hoş Geldiniz!',
      readyToStart: 'Her şey hazır, başlayalım!',
    },
    en: {
      congratulations: 'Congratulations!',
      personalMessage: `${userName}, your gut health journey begins now! 🎉`,
      subtitle: 'You can now access your personalized GutWell plan.',
      achievementsTitle: 'Your Achievements',
      achievements: [
        {
          icon: '📊',
          title: 'Personal Profile Completed',
          description: 'Your detailed health analysis is ready'
        },
        {
          icon: '🎯',
          title: 'Goals Set',
          description: 'Custom health goals created for you'
        },
        {
          icon: '🤝',
          title: 'Commitment Made',
          description: 'You pledged to your health journey'
        },
        {
          icon: '📱',
          title: 'Account Created',
          description: 'Your data is secure, accessible everywhere'
        },
      ] as Achievement[],
      nextStepsTitle: 'What\'s Next?',
      nextSteps: [
        'Explore your personalized daily plan',
        'Log your first meal and earn points',
        'Complete your daily water goal',
        'View your weekly progress reports',
      ],
      startJourney: 'Start Journey',
      welcomeToApp: 'Welcome to GutWell!',
      readyToStart: 'Everything is ready, let\'s begin!',
    },
  };

  const currentContent = content[language];

  const handleStartJourney = async () => {
    await SecureStore.setItemAsync('onboardingCompleted', 'true');
    await SecureStore.setItemAsync('hasSeenWelcome', 'true');

    // Navigate to main app
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti Animation */}
      {showCelebration && (
        <View style={styles.confettiContainer}>
          {[...Array(10)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                {
                  left: Math.random() * width,
                  transform: [
                    {
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, height],
                        outputRange: [-20, height + 20],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.celebrationSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.celebrationIcon}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
          </View>

          <Text style={styles.congratulationsText}>
            {currentContent.congratulations}
          </Text>

          <Text style={styles.personalMessage}>
            {currentContent.personalMessage}
          </Text>

          <Text style={styles.subtitle}>
            {currentContent.subtitle}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.achievementsSection, { opacity: fadeAnim }]}>
          <Text style={styles.achievementsTitle}>
            {currentContent.achievementsTitle}
          </Text>

          <View style={styles.achievementsList}>
            {currentContent.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementIconText}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>OK</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.nextStepsSection, { opacity: fadeAnim }]}>
          <Text style={styles.nextStepsTitle}>
            {currentContent.nextStepsTitle}
          </Text>

          <View style={styles.nextStepsList}>
            {currentContent.nextSteps.map((step, index) => (
              <View key={index} style={styles.nextStepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.readySection, { opacity: fadeAnim }]}>
          <View style={styles.readyCard}>
            <Text style={styles.welcomeText}>{currentContent.welcomeToApp}</Text>
            <Text style={styles.readyText}>{currentContent.readyToStart}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={CommonStyles.primaryButton}
          onPress={handleStartJourney}
          activeOpacity={0.8}
        >
          <Text style={CommonStyles.primaryButtonText}>
            {currentContent.startJourney}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: Colors.primary[500],
    borderRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  celebrationSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  celebrationIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Theme.Shadows.lg,
  },
  celebrationEmoji: {
    fontSize: 60,
  },
  congratulationsText: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  personalMessage: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  achievementsSection: {
    marginBottom: Spacing.xxl,
  },
  achievementsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  achievementsList: {
    gap: Spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary[200],
    ...Theme.Shadows.sm,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  achievementDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  nextStepsSection: {
    marginBottom: Spacing.xxl,
  },
  nextStepsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  nextStepsList: {
    gap: Spacing.sm,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.primary[800],
  },
  readySection: {
    marginBottom: Spacing.xl,
  },
  readyCard: {
    backgroundColor: Colors.primary[100],
    borderRadius: Borders.radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[300],
  },
  welcomeText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  readyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[700],
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});