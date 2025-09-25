import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, Spacing, Borders, Typography, Shadows } from '@/constants/theme';
import { CommonStyles } from '@/constants/common-styles';


export default function ReportScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Kişisel Raporunuz',
      subtitle: 'Sizin için hazırladığımız özel analiz',
      riskLevel: 'Risk Seviyesi',
      low: 'Düşük',
      moderate: 'Orta',
      high: 'Yüksek',
      recommendations: 'Öneriler',
      recs: [
        'Günde 8 bardak su için',
        'Probiyotik gıdalar tüketin',
        'Stresi azaltın',
        'Düzenli egzersiz yapın',
        'Lif açısından zengin yiyecekler tercih edin',
      ],
      priorities: 'Öncelikler',
      prioList: [
        'Sindirimi iyileştirmek',
        'Enerji seviyesini artırmak',
        'Semptomları azaltmak',
      ],
      continueButton: 'Uygulamaya Başla',
      backButton: 'Geri',
    },
    en: {
      title: 'Your Personal Report',
      subtitle: 'Custom analysis prepared for you',
      riskLevel: 'Risk Level',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      recommendations: 'Recommendations',
      recs: [
        'Drink 8 glasses of water daily',
        'Consume probiotic foods',
        'Reduce stress',
        'Exercise regularly',
        'Choose fiber-rich foods',
      ],
      priorities: 'Priorities',
      prioList: [
        'Improve digestion',
        'Increase energy levels',
        'Reduce symptoms',
      ],
      continueButton: 'Start App',
      backButton: 'Back',
    },
  };

  const currentContent = content[language];

  const handleContinue = async () => {
    await SecureStore.setItemAsync('onboardingStep', 'subscription');
    router.push('/onboarding/subscription');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.reportCard}>
          <View style={styles.riskSection}>
            <Text style={styles.sectionTitle}>{currentContent.riskLevel}</Text>
            <View style={styles.riskIndicator}>
              <View style={[styles.riskBar, styles.riskLow]} />
              <View style={[styles.riskBar, styles.riskModerate]} />
              <View style={[styles.riskBar, styles.riskHigh]} />
            </View>
            <View style={styles.riskLabels}>
              <Text style={styles.riskLabel}>{currentContent.low}</Text>
              <Text style={styles.riskLabel}>{currentContent.moderate}</Text>
              <Text style={styles.riskLabel}>{currentContent.high}</Text>
            </View>
            <View style={styles.currentRisk}>
              <View style={styles.riskPointer} />
              <Text style={styles.currentRiskText}>{currentContent.moderate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.recommendations}</Text>
          <View style={styles.recommendationsList}>
            {currentContent.recs.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recIcon}>
                  <Text style={styles.recIconText}>💡</Text>
                </View>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.priorities}</Text>
          <View style={styles.prioritiesList}>
            {currentContent.prioList.map((priority, index) => (
              <View key={index} style={styles.priorityItem}>
                <View style={styles.priorityNumber}>
                  <Text style={styles.priorityNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.priorityText}>{priority}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Özet</Text>
          <Text style={styles.summaryText}>
            {language === 'tr'
              ? 'Analiz sonuçlarınıza göre, sindirim sisteminizi iyileştirmek için odaklanmanız gereken alanlar belirlendi. Kişiselleştirilmiş planınızla sağlıklı yaşama adım atın!'
              : 'Based on your analysis results, we have identified areas you need to focus on to improve your digestive system. Take a step towards healthy living with your personalized plan!'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={CommonStyles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={CommonStyles.primaryButtonText}>{currentContent.continueButton}</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
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
  },
  reportCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
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
  riskSection: {
    alignItems: 'center',
  },
  riskIndicator: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  riskBar: {
    flex: 1,
  },
  riskLow: {
    backgroundColor: Colors.symptoms.mild,
  },
  riskModerate: {
    backgroundColor: Colors.symptoms.moderate,
  },
  riskHigh: {
    backgroundColor: Colors.symptoms.severe,
  },
  riskLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  riskLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  currentRisk: {
    alignItems: 'center',
  },
  riskPointer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.symptoms.moderate,
    marginBottom: Spacing.xs,
  },
  currentRiskText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  recommendationsList: {
    gap: Spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
  },
  recIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recIconText: {
    fontSize: 16,
  },
  recommendationText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  prioritiesList: {
    gap: Spacing.sm,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
  },
  priorityNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  priorityNumberText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  priorityText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.primary[800],
    fontWeight: Typography.fontWeight.medium,
  },
  summaryCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[600],
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[800],
    marginBottom: Spacing.sm,
  },
  summaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[700],
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});
