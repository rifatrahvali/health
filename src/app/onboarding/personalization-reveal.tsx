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
import { Colors, Spacing, Borders, Typography, Shadows } from '@/constants/theme';
import { CommonStyles } from '@/constants/common-styles';

const { width } = Dimensions.get('window');

interface InsightData {
  gutScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  topConcerns: string[];
  quickWins: string[];
  personalizedMessage: string;
}

export default function PersonalizationRevealScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [revealStage, setRevealStage] = useState(0); // 0: loading, 1: analysis, 2: insights, 3: recommendations
  const [insights, setInsights] = useState<InsightData | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLanguageAndGenerateInsights();
  }, []);

  useEffect(() => {
    if (revealStage > 0) {
      animateReveal();
    }
  }, [revealStage]);

  const loadLanguageAndGenerateInsights = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');

    // Simulate analysis time
    setTimeout(() => {
      generatePersonalizedInsights();
      setRevealStage(1);
    }, 2000);
  };

  const animateReveal = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    if (revealStage === 2 && insights) {
      // Animate gut score
      Animated.timing(scoreAnim, {
        toValue: insights.gutScore,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  };

  const generatePersonalizedInsights = async () => {
    // Get user data from previous screens
    const goalsData = await SecureStore.getItemAsync('userGoals');
    const symptomsData = await SecureStore.getItemAsync('userSymptoms');

    // Mock personalized insights based on collected data
    const mockInsights: InsightData = {
      gutScore: 67,
      riskLevel: 'moderate',
      topConcerns: [
        language === 'tr' ? 'Şişkinlik ve gaz problemi' : 'Bloating and gas issues',
        language === 'tr' ? 'Düzensiz bağırsak alışkanlıkları' : 'Irregular bowel habits',
        language === 'tr' ? 'Yemek sonrası rahatsızlık' : 'Post-meal discomfort'
      ],
      quickWins: [
        language === 'tr' ? 'Günlük 30 dakika yürüyüş' : '30-minute daily walks',
        language === 'tr' ? 'Fermente gıdalar ekleyin' : 'Add fermented foods',
        language === 'tr' ? 'Yemek öncesi nefes egzersizi' : 'Breathing exercises before meals'
      ],
      personalizedMessage: language === 'tr'
        ? 'Size özel hazırlanan plan ile bağırsak sağlığınızı 30 günde %40 oranında iyileştirebilirsiniz!'
        : 'With your personalized plan, you can improve your gut health by 40% in 30 days!'
    };

    setInsights(mockInsights);
  };

  const content = {
    tr: {
      title: 'Sizin İçin Özel Analiz',
      loadingTitle: 'Verileriniz Analiz Ediliyor...',
      loadingMessages: [
        'Binlerce veri noktası karşılaştırılıyor',
        'Bağırsak sağlığı profili oluşturuluyor',
        'Kişiselleştirilmiş öneriler hazırlanıyor'
      ],
      analysisComplete: 'Analiz Tamamlandı!',
      gutScoreTitle: 'Bağırsak Sağlığı Puanınız',
      scoringNote: '100 üzerinden değerlendirme',
      insightsTitle: 'Kişisel İçgörüleriniz',
      concernsTitle: 'Ana Odak Noktalarınız',
      quickWinsTitle: 'Hemen Uygulayabileceğiniz',
      revealInsights: 'İçgörüleri Göster',
      showRecommendations: 'Önerilerim Neler?',
      continueButton: 'Taahhüdüme Geç',
      backButton: 'Geri',
      commitmentPrompt: 'Şimdi bu yolculuğa olan bağlılığınızı gösterme zamanı!',
    },
    en: {
      title: 'Your Personal Analysis',
      loadingTitle: 'Analyzing Your Data...',
      loadingMessages: [
        'Comparing thousands of data points',
        'Creating your gut health profile',
        'Preparing personalized recommendations'
      ],
      analysisComplete: 'Analysis Complete!',
      gutScoreTitle: 'Your Gut Health Score',
      scoringNote: 'Scored out of 100',
      insightsTitle: 'Your Personal Insights',
      concernsTitle: 'Your Main Focus Areas',
      quickWinsTitle: 'Quick Wins for You',
      revealInsights: 'Reveal Insights',
      showRecommendations: 'Show My Recommendations',
      continueButton: 'Proceed to Commitment',
      backButton: 'Back',
      commitmentPrompt: 'Now it\'s time to show your commitment to this journey!',
    },
  };

  const currentContent = content[language];

  const handleContinue = async () => {
    await SecureStore.setItemAsync('userInsights', JSON.stringify(insights));
    await SecureStore.setItemAsync('onboardingStep', 'commitment');
    router.push('/onboarding/commitment');
  };

  const handleBack = () => {
    router.back();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return Colors.success;
      case 'moderate': return Colors.warning;
      case 'high': return Colors.error;
      default: return Colors.warning;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  if (revealStage === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>{currentContent.loadingTitle}</Text>
            <View style={styles.loadingIndicator}>
              <Animated.View style={[styles.loadingBar, {
                width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['20%', '95%']
                })
              }]} />
            </View>
            <Text style={styles.loadingMessage}>
              {currentContent.loadingMessages[Math.floor(Date.now() / 2000) % 3]}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <Text style={styles.title}>{currentContent.title}</Text>

          {revealStage >= 1 && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>✨ {currentContent.analysisComplete}</Text>
            </View>
          )}

          {revealStage >= 2 && insights && (
            <>
              {/* Gut Score Section */}
              <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>{currentContent.gutScoreTitle}</Text>
                <View style={styles.scoreContainer}>
                  <Animated.Text style={[styles.scoreValue, {
                    color: getScoreColor(insights.gutScore)
                  }]}>
                    {scoreAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0', insights.gutScore.toString()],
                      extrapolate: 'clamp'
                    })}
                  </Animated.Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
                <Text style={styles.scoreNote}>{currentContent.scoringNote}</Text>

                {/* Score Bar */}
                <View style={styles.scoreBar}>
                  <Animated.View style={[
                    styles.scoreProgress,
                    {
                      width: scoreAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', `${insights.gutScore}%`],
                      }),
                      backgroundColor: getScoreColor(insights.gutScore)
                    }
                  ]} />
                </View>
              </View>

              {/* Personalized Message */}
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>{insights.personalizedMessage}</Text>
              </View>
            </>
          )}

          {revealStage >= 3 && insights && (
            <>
              {/* Main Concerns */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{currentContent.concernsTitle}</Text>
                <View style={styles.concernsList}>
                  {insights.topConcerns.map((concern, index) => (
                    <View key={index} style={styles.concernItem}>
                      <View style={styles.concernIcon}>
                        <Text style={styles.concernIconText}>⚠️</Text>
                      </View>
                      <Text style={styles.concernText}>{concern}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Quick Wins */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{currentContent.quickWinsTitle}</Text>
                <View style={styles.quickWinsList}>
                  {insights.quickWins.map((win, index) => (
                    <View key={index} style={styles.quickWinItem}>
                      <View style={styles.quickWinIcon}>
                        <Text style={styles.quickWinIconText}>+</Text>
                      </View>
                      <Text style={styles.quickWinText}>{win}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Commitment Prompt */}
              <View style={styles.commitmentCard}>
                <Text style={styles.commitmentPrompt}>{currentContent.commitmentPrompt}</Text>
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {revealStage === 1 && (
          <TouchableOpacity
            style={CommonStyles.primaryButton}
            onPress={() => setRevealStage(2)}
            activeOpacity={0.8}
          >
            <Text style={CommonStyles.primaryButtonText}>{currentContent.revealInsights}</Text>
          </TouchableOpacity>
        )}

        {revealStage === 2 && (
          <TouchableOpacity
            style={CommonStyles.primaryButton}
            onPress={() => setRevealStage(3)}
            activeOpacity={0.8}
          >
            <Text style={CommonStyles.primaryButtonText}>{currentContent.showRecommendations}</Text>
          </TouchableOpacity>
        )}

        {revealStage === 3 && (
          <TouchableOpacity
            style={CommonStyles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={CommonStyles.primaryButtonText}>{currentContent.continueButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.medium,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  loadingContent: {
    alignItems: 'center',
    width: '100%',
  },
  loadingTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  loadingIndicator: {
    width: '80%',
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 4,
  },
  loadingMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  completeBadge: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Borders.radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  completeBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  scoreCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  scoreTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 72,
  },
  scoreMax: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  scoreNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  scoreBar: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.neutral[200],
    borderRadius: 6,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 6,
  },
  messageCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[600],
  },
  messageText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary[800],
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.relaxed,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  concernsList: {
    gap: Spacing.sm,
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  concernIcon: {
    marginRight: Spacing.md,
  },
  concernIconText: {
    fontSize: 20,
  },
  concernText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  quickWinsList: {
    gap: Spacing.sm,
  },
  quickWinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  quickWinIcon: {
    marginRight: Spacing.md,
  },
  quickWinIconText: {
    fontSize: 20,
  },
  quickWinText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  commitmentCard: {
    backgroundColor: Colors.primary[100],
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.primary[300],
  },
  commitmentPrompt: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary[800],
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.relaxed,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});