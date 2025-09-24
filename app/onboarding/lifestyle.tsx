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
import { Theme } from '../../theme';
import { CommonStyles } from '../../theme/common-styles';

const { Colors, Spacing, Borders, Typography } = Theme;

interface LifestyleItem {
  id: string;
  label: string;
  labelTr: string;
  icon: string;
}

const DIET_TYPES: LifestyleItem[] = [
  { id: 'regular', label: 'Regular', labelTr: 'Normal', icon: '🍽️' },
  { id: 'vegetarian', label: 'Vegetarian', labelTr: 'Vejetaryen', icon: '🥗' },
  { id: 'vegan', label: 'Vegan', labelTr: 'Vegan', icon: '🌱' },
  { id: 'gluten_free', label: 'Gluten-Free', labelTr: 'Glutensiz', icon: '🌾' },
  { id: 'dairy_free', label: 'Dairy-Free', labelTr: 'Süt Ürünsüz', icon: '🥛' },
  { id: 'keto', label: 'Keto', labelTr: 'Keto', icon: '🥑' },
  { id: 'mediterranean', label: 'Mediterranean', labelTr: 'Akdeniz', icon: '🫒' },
  { id: 'other', label: 'Other', labelTr: 'Diğer', icon: '📝' },
];

const ACTIVITY_LEVELS: LifestyleItem[] = [
  { id: 'sedentary', label: 'Sedentary', labelTr: 'Hareketsiz', icon: '🪑' },
  { id: 'light', label: 'Lightly Active', labelTr: 'Az Hareketli', icon: '🚶' },
  { id: 'moderate', label: 'Moderately Active', labelTr: 'Orta Hareketli', icon: '🏃' },
  { id: 'very', label: 'Very Active', labelTr: 'Çok Hareketli', icon: '💪' },
  { id: 'extra', label: 'Extra Active', labelTr: 'Aşırı Hareketli', icon: '🏋️' },
];

const SLEEP_HOURS: LifestyleItem[] = [
  { id: 'less_5', label: 'Less than 5 hours', labelTr: '5 saatten az', icon: '😴' },
  { id: '5_6', label: '5-6 hours', labelTr: '5-6 saat', icon: '😪' },
  { id: '7_8', label: '7-8 hours', labelTr: '7-8 saat', icon: '😊' },
  { id: '9_10', label: '9-10 hours', labelTr: '9-10 saat', icon: '🛌' },
  { id: 'more_10', label: 'More than 10 hours', labelTr: '10 saatten fazla', icon: '💤' },
];

const STRESS_LEVELS: LifestyleItem[] = [
  { id: 'very_low', label: 'Very Low', labelTr: 'Çok Düşük', icon: '😌' },
  { id: 'low', label: 'Low', labelTr: 'Düşük', icon: '🙂' },
  { id: 'moderate', label: 'Moderate', labelTr: 'Orta', icon: '😐' },
  { id: 'high', label: 'High', labelTr: 'Yüksek', icon: '😰' },
  { id: 'very_high', label: 'Very High', labelTr: 'Çok Yüksek', icon: '😵' },
];

export default function LifestyleScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<string>('');
  const [waterIntake, setWaterIntake] = useState(4);
  const [smoker, setSmoker] = useState<boolean | null>(null);
  const [alcohol, setAlcohol] = useState<string>('');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Yaşam Tarzınız',
      subtitle: 'Günlük alışkanlıklarınızı anlamamıza yardımcı olun',
      diet: 'Beslenme Tercihiniz',
      activity: 'Aktivite Seviyeniz',
      sleep: 'Günlük Uyku Süreniz',
      stress: 'Stres Seviyeniz',
      water: 'Günlük Su Tüketimi',
      waterUnit: 'bardak',
      smoking: 'Sigara Kullanıyor musunuz?',
      yes: 'Evet',
      no: 'Hayır',
      alcohol: 'Alkol Tüketimi',
      alcoholOptions: {
        never: 'Hiç',
        rarely: 'Nadiren',
        occasional: 'Ara sıra',
        regular: 'Düzenli',
      },
      continueButton: 'Devam Et',
      backButton: 'Geri',
      validation: 'Lütfen tüm alanları doldurun',
    },
    en: {
      title: 'Your Lifestyle',
      subtitle: 'Help us understand your daily habits',
      diet: 'Your Diet Preference',
      activity: 'Activity Level',
      sleep: 'Daily Sleep Duration',
      stress: 'Stress Level',
      water: 'Daily Water Intake',
      waterUnit: 'glasses',
      smoking: 'Do you smoke?',
      yes: 'Yes',
      no: 'No',
      alcohol: 'Alcohol Consumption',
      alcoholOptions: {
        never: 'Never',
        rarely: 'Rarely',
        occasional: 'Occasional',
        regular: 'Regular',
      },
      continueButton: 'Continue',
      backButton: 'Back',
      validation: 'Please fill in all fields',
    },
  };

  const currentContent = content[language];

  const toggleDiet = (dietId: string) => {
    setSelectedDiet(prev =>
      prev.includes(dietId)
        ? prev.filter(id => id !== dietId)
        : [...prev, dietId]
    );
  };

  const handleContinue = async () => {
    if (!selectedDiet.length || !activityLevel || !sleepHours ||
        !stressLevel || smoker === null || !alcohol) {
      alert(currentContent.validation);
      return;
    }

    const lifestyleData = {
      diet: selectedDiet,
      activityLevel,
      sleepHours,
      stressLevel,
      waterIntake,
      smoker,
      alcohol,
    };

    await SecureStore.setItemAsync('userLifestyle', JSON.stringify(lifestyleData));
    await SecureStore.setItemAsync('onboardingStep', 'symptoms');

    router.push('/onboarding/symptoms');
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
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.diet}</Text>
          <View style={styles.optionGrid}>
            {DIET_TYPES.map(diet => (
              <TouchableOpacity
                key={diet.id}
                style={[
                  styles.optionCard,
                  selectedDiet.includes(diet.id) && styles.optionCardSelected,
                ]}
                onPress={() => toggleDiet(diet.id)}
              >
                <Text style={styles.optionIcon}>{diet.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedDiet.includes(diet.id) && styles.optionTextSelected,
                ]}>
                  {language === 'tr' ? diet.labelTr : diet.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.activity}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalOptions}>
              {ACTIVITY_LEVELS.map(level => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.horizontalCard,
                    activityLevel === level.id && styles.horizontalCardSelected,
                  ]}
                  onPress={() => setActivityLevel(level.id)}
                >
                  <Text style={styles.optionIcon}>{level.icon}</Text>
                  <Text style={[
                    styles.optionText,
                    activityLevel === level.id && styles.optionTextSelected,
                  ]}>
                    {language === 'tr' ? level.labelTr : level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.sleep}</Text>
          <View style={styles.horizontalOptions}>
            {SLEEP_HOURS.map(hours => (
              <TouchableOpacity
                key={hours.id}
                style={[
                  styles.smallCard,
                  sleepHours === hours.id && styles.smallCardSelected,
                ]}
                onPress={() => setSleepHours(hours.id)}
              >
                <Text style={styles.smallIcon}>{hours.icon}</Text>
                <Text style={[
                  styles.smallText,
                  sleepHours === hours.id && styles.smallTextSelected,
                ]}>
                  {language === 'tr' ? hours.labelTr : hours.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.stress}</Text>
          <View style={styles.stressOptions}>
            {STRESS_LEVELS.map(level => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.stressCard,
                  stressLevel === level.id && styles.stressCardSelected,
                ]}
                onPress={() => setStressLevel(level.id)}
              >
                <Text style={styles.stressIcon}>{level.icon}</Text>
                <Text style={[
                  styles.stressText,
                  stressLevel === level.id && styles.stressTextSelected,
                ]}>
                  {language === 'tr' ? level.labelTr : level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.water}</Text>
          <View style={styles.waterContainer}>
            <TouchableOpacity
              style={styles.waterButton}
              onPress={() => setWaterIntake(Math.max(0, waterIntake - 1))}
            >
              <Text style={styles.waterButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.waterDisplay}>
              <Text style={styles.waterValue}>{waterIntake}</Text>
              <Text style={styles.waterUnit}>{currentContent.waterUnit}</Text>
            </View>
            <TouchableOpacity
              style={styles.waterButton}
              onPress={() => setWaterIntake(Math.min(20, waterIntake + 1))}
            >
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentContent.smoking}</Text>
          <View style={styles.binaryOptions}>
            <TouchableOpacity
              style={[
                styles.binaryButton,
                smoker === false && styles.binaryButtonSelected,
              ]}
              onPress={() => setSmoker(false)}
            >
              <Text style={[
                styles.binaryText,
                smoker === false && styles.binaryTextSelected,
              ]}>
                {currentContent.no}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.binaryButton,
                smoker === true && styles.binaryButtonSelected,
              ]}
              onPress={() => setSmoker(true)}
            >
              <Text style={[
                styles.binaryText,
                smoker === true && styles.binaryTextSelected,
              ]}>
                {currentContent.yes}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: Spacing.xxl }]}>
          <Text style={styles.sectionTitle}>{currentContent.alcohol}</Text>
          <View style={styles.alcoholOptions}>
            {Object.entries(currentContent.alcoholOptions).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.alcoholCard,
                  alcohol === key && styles.alcoholCardSelected,
                ]}
                onPress={() => setAlcohol(key)}
              >
                <Text style={[
                  styles.alcoholText,
                  alcohol === key && styles.alcoholTextSelected,
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionCard: {
    width: '30%',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  optionCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  optionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  horizontalOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  horizontalCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    minWidth: 100,
  },
  horizontalCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  smallCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  smallCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  smallIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  smallText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  smallTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  stressOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stressCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    marginHorizontal: Spacing.xs / 2,
  },
  stressCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  stressIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  stressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  stressTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  waterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  waterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterButtonText: {
    fontSize: 24,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.bold,
  },
  waterDisplay: {
    alignItems: 'center',
  },
  waterValue: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  waterUnit: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  binaryOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  binaryButton: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  binaryButtonSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  binaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  binaryTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semibold,
  },
  alcoholOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  alcoholCard: {
    width: '48%',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  alcoholCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  alcoholText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  alcoholTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});
