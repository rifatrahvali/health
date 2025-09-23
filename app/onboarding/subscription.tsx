import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '../../theme';

const { Colors, Spacing, Borders, Typography } = Theme;

interface Plan {
  id: string;
  name: string;
  nameTr: string;
  price: string;
  priceTr: string;
  period: string;
  periodTr: string;
  features: string[];
  featuresTr: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    nameTr: 'Ücretsiz',
    price: '$0',
    priceTr: '₺0',
    period: '/month',
    periodTr: '/ay',
    features: [
      'Basic tracking',
      'Limited recommendations',
      'Community access',
    ],
    featuresTr: [
      'Temel takip',
      'Sınırlı öneriler',
      'Topluluk erişimi',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    nameTr: 'Premium',
    price: '$9.99',
    priceTr: '₺299',
    period: '/month',
    periodTr: '/ay',
    features: [
      'Advanced analytics',
      'Personalized meal plans',
      'Expert consultations',
      'Priority support',
      'Unlimited tracking',
    ],
    featuresTr: [
      'Gelişmiş analitik',
      'Kişisel yemek planları',
      'Uzman danışmanlığı',
      'Öncelikli destek',
      'Sınırsız takip',
    ],
    popular: true,
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    nameTr: 'Premium Yıllık',
    price: '$99.99',
    priceTr: '₺2999',
    period: '/year',
    periodTr: '/yıl',
    features: [
      'All Premium features',
      '2 months free',
      'Family sharing',
      'Advanced reports',
      'Custom integrations',
    ],
    featuresTr: [
      'Tüm Premium özellikler',
      '2 ay ücretsiz',
      'Aile paylaşımı',
      'Gelişmiş raporlar',
      'Özel entegrasyonlar',
    ],
  },
];

export default function SubscriptionScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Planınızı Seçin',
      subtitle: 'Sağlık yolculuğunuz için en uygun planı seçin',
      features: 'Özellikler',
      startTrial: 'Ücretsiz Deneme Başlat',
      subscribe: 'Abone Ol',
      continueFree: 'Ücretsiz Devam Et',
      popular: 'Popüler',
      backButton: 'Geri',
      terms: 'Şartlar ve Koşullar',
      privacy: 'Gizlilik Politikası',
    },
    en: {
      title: 'Choose Your Plan',
      subtitle: 'Select the best plan for your health journey',
      features: 'Features',
      startTrial: 'Start Free Trial',
      subscribe: 'Subscribe',
      continueFree: 'Continue Free',
      popular: 'Popular',
      backButton: 'Back',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
    },
  };

  const currentContent = content[language];

  const handleContinue = async () => {
    await SecureStore.setItemAsync('selectedPlan', selectedPlan);
    await SecureStore.setItemAsync('onboardingStep', 'account');
    router.push('/onboarding/account');
  };

  const handleBack = () => {
    router.back();
  };

  const renderPlan = (plan: Plan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.planCardSelected,
        plan.popular && styles.planCardPopular,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>{currentContent.popular}</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={[
          styles.planName,
          selectedPlan === plan.id && styles.planNameSelected,
        ]}>
          {language === 'tr' ? plan.nameTr : plan.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[
            styles.planPrice,
            selectedPlan === plan.id && styles.planPriceSelected,
          ]}>
            {language === 'tr' ? plan.priceTr : plan.price}
          </Text>
          <Text style={[
            styles.planPeriod,
            selectedPlan === plan.id && styles.planPeriodSelected,
          ]}>
            {language === 'tr' ? plan.periodTr : plan.period}
          </Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[
          styles.featuresTitle,
          selectedPlan === plan.id && styles.featuresTitleSelected,
        ]}>
          {currentContent.features}:
        </Text>
        {(language === 'tr' ? plan.featuresTr : plan.features).map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={[
              styles.featureText,
              selectedPlan === plan.id && styles.featureTextSelected,
            ]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '90%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.plansContainer}>
          {PLANS.map(renderPlan)}
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{currentContent.terms}</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}>•</Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{currentContent.privacy}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {selectedPlan === 'free'
              ? currentContent.continueFree
              : selectedPlan === 'premium'
              ? currentContent.startTrial
              : currentContent.subscribe}
          </Text>
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
  plansContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  planCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border.light,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  planCardPopular: {
    borderColor: Colors.primary[400],
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Borders.radius.full,
  },
  popularText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  planNameSelected: {
    color: Colors.primary[800],
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  planPriceSelected: {
    color: Colors.primary[700],
  },
  planPeriod: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  planPeriodSelected: {
    color: Colors.primary[600],
  },
  featuresContainer: {
    marginTop: Spacing.sm,
  },
  featuresTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  featuresTitleSelected: {
    color: Colors.primary[800],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  featureIcon: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    marginRight: Spacing.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  featureText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  featureTextSelected: {
    color: Colors.primary[700],
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  linkButton: {
    paddingHorizontal: Spacing.sm,
  },
  linkText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginHorizontal: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  continueButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    borderRadius: Borders.radius.full,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
});
