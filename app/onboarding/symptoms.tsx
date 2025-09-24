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
import { CommonStyles } from '../../theme/common-styles';

const { Colors, Spacing, Borders, Typography } = Theme;

interface Symptom {
  id: string;
  label: string;
  labelTr: string;
  category: string;
  severity: number;
}

const SYMPTOMS: Symptom[] = [
  // Digestive Symptoms
  { id: 'bloating', label: 'Bloating', labelTr: 'Şişkinlik', category: 'digestive', severity: 0 },
  { id: 'gas', label: 'Gas', labelTr: 'Gaz', category: 'digestive', severity: 0 },
  { id: 'constipation', label: 'Constipation', labelTr: 'Kabızlık', category: 'digestive', severity: 0 },
  { id: 'diarrhea', label: 'Diarrhea', labelTr: 'İshal', category: 'digestive', severity: 0 },
  { id: 'stomach_pain', label: 'Stomach Pain', labelTr: 'Mide Ağrısı', category: 'digestive', severity: 0 },
  { id: 'heartburn', label: 'Heartburn', labelTr: 'Mide Yanması', category: 'digestive', severity: 0 },
  { id: 'nausea', label: 'Nausea', labelTr: 'Bulantı', category: 'digestive', severity: 0 },
  { id: 'indigestion', label: 'Indigestion', labelTr: 'Hazımsızlık', category: 'digestive', severity: 0 },

  // Energy & Mood
  { id: 'fatigue', label: 'Fatigue', labelTr: 'Yorgunluk', category: 'energy', severity: 0 },
  { id: 'brain_fog', label: 'Brain Fog', labelTr: 'Zihin Bulanıklığı', category: 'energy', severity: 0 },
  { id: 'mood_swings', label: 'Mood Swings', labelTr: 'Duygu Dalgalanması', category: 'energy', severity: 0 },
  { id: 'anxiety', label: 'Anxiety', labelTr: 'Kaygı', category: 'energy', severity: 0 },

  // Skin & Hair
  { id: 'acne', label: 'Acne', labelTr: 'Akne', category: 'skin', severity: 0 },
  { id: 'eczema', label: 'Eczema', labelTr: 'Egzama', category: 'skin', severity: 0 },
  { id: 'dry_skin', label: 'Dry Skin', labelTr: 'Kuru Cilt', category: 'skin', severity: 0 },
  { id: 'hair_loss', label: 'Hair Loss', labelTr: 'Saç Dökülmesi', category: 'skin', severity: 0 },

  // Other
  { id: 'headaches', label: 'Headaches', labelTr: 'Baş Ağrısı', category: 'other', severity: 0 },
  { id: 'joint_pain', label: 'Joint Pain', labelTr: 'Eklem Ağrısı', category: 'other', severity: 0 },
  { id: 'weight_changes', label: 'Weight Changes', labelTr: 'Kilo Değişimleri', category: 'other', severity: 0 },
  { id: 'food_cravings', label: 'Food Cravings', labelTr: 'Yemek İsteği', category: 'other', severity: 0 },
];

export default function SymptomsScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [symptoms, setSymptoms] = useState<Symptom[]>(SYMPTOMS);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Semptomlarınız',
      subtitle: 'Yaşadığınız belirtileri ve şiddetini işaretleyin',
      digestive: '🍽️ Sindirim',
      energy: '⚡ Enerji & Ruh Hali',
      skin: '✨ Cilt & Saç',
      other: '🔍 Diğer',
      severityLevels: ['Yok', 'Hafif', 'Orta', 'Şiddetli', 'Çok Şiddetli'],
      continueButton: 'Devam Et',
      backButton: 'Geri',
      skipButton: 'Semptom Yok',
      validation: 'Lütfen en az bir semptom seçin veya "Semptom Yok" butonuna basın',
    },
    en: {
      title: 'Your Symptoms',
      subtitle: 'Mark the symptoms you experience and their severity',
      digestive: '🍽️ Digestive',
      energy: '⚡ Energy & Mood',
      skin: '✨ Skin & Hair',
      other: '🔍 Other',
      severityLevels: ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'],
      continueButton: 'Continue',
      backButton: 'Back',
      skipButton: 'No Symptoms',
      validation: 'Please select at least one symptom or press "No Symptoms"',
    },
  };

  const currentContent = content[language];

  const updateSymptomSeverity = (id: string, severity: number) => {
    setSymptoms(prev =>
      prev.map(symptom =>
        symptom.id === id ? { ...symptom, severity } : symptom
      )
    );
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 0: return Colors.neutral[300];
      case 1: return Colors.symptoms.mild;
      case 2: return Colors.symptoms.moderate;
      case 3: return Colors.symptoms.severe;
      case 4: return Colors.symptoms.verySevere;
      default: return Colors.neutral[300];
    }
  };

  const handleContinue = async () => {
    const activeSymptoms = symptoms.filter(s => s.severity > 0);

    await SecureStore.setItemAsync('userSymptoms', JSON.stringify(activeSymptoms));
    await SecureStore.setItemAsync('onboardingStep', 'medical-history');

    router.push('/onboarding/medical-history');
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync('userSymptoms', JSON.stringify([]));
    await SecureStore.setItemAsync('onboardingStep', 'medical-history');
    router.push('/onboarding/medical-history');
  };

  const handleBack = () => {
    router.back();
  };

  const renderCategory = (category: string, title: string) => {
    const categorySymptoms = symptoms.filter(s => s.category === category);

    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {categorySymptoms.map(symptom => (
          <View key={symptom.id} style={styles.symptomItem}>
            <Text style={styles.symptomLabel}>
              {language === 'tr' ? symptom.labelTr : symptom.label}
            </Text>
            <View style={styles.severityContainer}>
              {[0, 1, 2, 3, 4].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    symptom.severity === level && {
                      backgroundColor: getSeverityColor(level),
                      borderColor: getSeverityColor(level),
                    },
                  ]}
                  onPress={() => updateSymptomSeverity(symptom.id, level)}
                >
                  <Text
                    style={[
                      styles.severityButtonText,
                      symptom.severity === level && styles.severityButtonTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.severityLegend}>
          {currentContent.severityLevels.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: getSeverityColor(index) },
                ]}
              />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        {renderCategory('digestive', currentContent.digestive)}
        {renderCategory('energy', currentContent.energy)}
        {renderCategory('skin', currentContent.skin)}
        {renderCategory('other', currentContent.other)}

        <TouchableOpacity
          style={CommonStyles.ghostButton}
          onPress={handleSkip}
        >
          <Text style={CommonStyles.ghostButtonText}>{currentContent.skipButton}</Text>
        </TouchableOpacity>
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
    marginBottom: Spacing.lg,
  },
  severityLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  symptomLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  severityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    backgroundColor: 'transparent',
  },
  severityButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  severityButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.bold,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});
