import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, Spacing, Borders, Typography, Shadows } from '@/constants/theme';
import { CommonStyles } from '@/constants/common-styles';


interface MedicalCondition {
  id: string;
  label: string;
  labelTr: string;
  icon: string;
  selected: boolean;
}

const CONDITIONS: MedicalCondition[] = [
  { id: 'ibs', label: 'IBS', labelTr: 'IBS', icon: '🔄', selected: false },
  { id: 'crohns', label: "Crohn's Disease", labelTr: 'Crohn Hastalığı', icon: '🔴', selected: false },
  { id: 'celiac', label: 'Celiac Disease', labelTr: 'Çölyak Hastalığı', icon: '🌾', selected: false },
  { id: 'gerd', label: 'GERD/Acid Reflux', labelTr: 'Reflü', icon: '🔥', selected: false },
  { id: 'lactose', label: 'Lactose Intolerance', labelTr: 'Laktoz İntoleransı', icon: '🥛', selected: false },
  { id: 'sibo', label: 'SIBO', labelTr: 'SIBO', icon: '🦠', selected: false },
  { id: 'diabetes', label: 'Diabetes', labelTr: 'Diyabet', icon: '💉', selected: false },
  { id: 'thyroid', label: 'Thyroid Issues', labelTr: 'Tiroid Sorunları', icon: '🦋', selected: false },
  { id: 'anxiety_depression', label: 'Anxiety/Depression', labelTr: 'Kaygı/Depresyon', icon: '🧠', selected: false },
  { id: 'autoimmune', label: 'Autoimmune Disease', labelTr: 'Otoimmün Hastalık', icon: '🛡️', selected: false },
  { id: 'food_allergies', label: 'Food Allergies', labelTr: 'Gıda Alerjileri', icon: '🥜', selected: false },
  { id: 'none', label: 'None of the above', labelTr: 'Hiçbiri', icon: 'OK', selected: false },
];

export default function MedicalHistoryScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [conditions, setConditions] = useState<MedicalCondition[]>(CONDITIONS);
  const [medications, setMedications] = useState('');
  const [supplements, setSupplements] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Sağlık Geçmişi',
      subtitle: 'Mevcut durumlarınız ve tıbbi geçmişiniz',
      conditions: 'Tanısı konmuş durumlar',
      medications: 'Kullandığınız ilaçlar',
      medicationsPlaceholder: 'Örn: Probiyotik, Omeprazol',
      supplements: 'Kullandığınız takviyeler',
      supplementsPlaceholder: 'Örn: D Vitamini, B12',
      familyHistory: 'Ailede sindirim sorunları',
      familyHistoryPlaceholder: 'Varsa kısaca belirtin',
      continueButton: 'Devam Et',
      backButton: 'Geri',
    },
    en: {
      title: 'Medical History',
      subtitle: 'Your existing conditions and medical background',
      conditions: 'Diagnosed conditions',
      medications: 'Current medications',
      medicationsPlaceholder: 'e.g., Probiotic, Omeprazole',
      supplements: 'Current supplements',
      supplementsPlaceholder: 'e.g., Vitamin D, B12',
      familyHistory: 'Family digestive issues',
      familyHistoryPlaceholder: 'Briefly describe if any',
      continueButton: 'Continue',
      backButton: 'Back',
    },
  };

  const currentContent = content[language];

  const toggleCondition = (id: string) => {
    if (id === 'none') {
      // If "None" is selected, deselect all others
      setConditions(prev =>
        prev.map(cond => ({ ...cond, selected: cond.id === 'none' }))
      );
    } else {
      // If any other is selected, deselect "None"
      setConditions(prev =>
        prev.map(cond => {
          if (cond.id === 'none') return { ...cond, selected: false };
          if (cond.id === id) return { ...cond, selected: !cond.selected };
          return cond;
        })
      );
    }
  };

  const handleContinue = async () => {
    const selectedConditions = conditions.filter(c => c.selected);

    const medicalData = {
      conditions: selectedConditions,
      medications,
      supplements,
      familyHistory,
    };

    await SecureStore.setItemAsync('userMedicalHistory', JSON.stringify(medicalData));
    await SecureStore.setItemAsync('onboardingStep', 'commitment');

    router.push('/onboarding/commitment');
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
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.conditions}</Text>
          <View style={styles.conditionsGrid}>
            {conditions.map(condition => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionCard,
                  condition.selected && styles.conditionCardSelected,
                ]}
                onPress={() => toggleCondition(condition.id)}
              >
                <Text style={styles.conditionIcon}>{condition.icon}</Text>
                <Text
                  style={[
                    styles.conditionText,
                    condition.selected && styles.conditionTextSelected,
                  ]}
                >
                  {language === 'tr' ? condition.labelTr : condition.label}
                </Text>
                {condition.selected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>OK</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.medications}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={currentContent.medicationsPlaceholder}
            placeholderTextColor={Colors.text.tertiary}
            value={medications}
            onChangeText={setMedications}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.supplements}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={currentContent.supplementsPlaceholder}
            placeholderTextColor={Colors.text.tertiary}
            value={supplements}
            onChangeText={setSupplements}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={[styles.section, { marginBottom: Spacing.xxl }]}>
          <Text style={styles.sectionTitle}>{currentContent.familyHistory}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={currentContent.familyHistoryPlaceholder}
            placeholderTextColor={Colors.text.tertiary}
            value={familyHistory}
            onChangeText={setFamilyHistory}
            multiline
            numberOfLines={3}
          />
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  conditionCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  conditionCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  conditionIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  conditionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  conditionTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  textInput: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});
