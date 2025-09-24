import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '../../theme';
import { CommonStyles } from '../../theme/common-styles';

const { Colors, Spacing, Borders, Typography } = Theme;

interface DemographicsData {
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  height: string;
  weight: string;
  location: string;
}

export default function DemographicsScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [demographics, setDemographics] = useState<DemographicsData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    location: '',
  });

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Sizi Tanıyalım',
      subtitle: 'Kişiselleştirilmiş öneriler için',
      age: 'Yaşınız',
      agePlaceholder: 'Örn: 25',
      gender: 'Cinsiyet',
      genderOptions: {
        male: 'Erkek',
        female: 'Kadın',
        other: 'Diğer',
      },
      height: 'Boy (cm)',
      heightPlaceholder: 'Örn: 170',
      weight: 'Kilo (kg)',
      weightPlaceholder: 'Örn: 70',
      location: 'Şehir',
      locationPlaceholder: 'Örn: İstanbul',
      continueButton: 'Devam Et',
      backButton: 'Geri',
      validation: 'Lütfen tüm alanları doldurun',
    },
    en: {
      title: "Let's Get to Know You",
      subtitle: 'For personalized recommendations',
      age: 'Your Age',
      agePlaceholder: 'e.g., 25',
      gender: 'Gender',
      genderOptions: {
        male: 'Male',
        female: 'Female',
        other: 'Other',
      },
      height: 'Height (cm)',
      heightPlaceholder: 'e.g., 170',
      weight: 'Weight (kg)',
      weightPlaceholder: 'e.g., 70',
      location: 'City',
      locationPlaceholder: 'e.g., Istanbul',
      continueButton: 'Continue',
      backButton: 'Back',
      validation: 'Please fill in all fields',
    },
  };

  const currentContent = content[language];

  const handleContinue = async () => {
    if (!demographics.age || !demographics.gender || !demographics.height ||
        !demographics.weight || !demographics.location) {
      alert(currentContent.validation);
      return;
    }

    await SecureStore.setItemAsync('userDemographics', JSON.stringify(demographics));
    await SecureStore.setItemAsync('onboardingStep', 'lifestyle');

    router.push('/onboarding/lifestyle');
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
          <View style={[styles.progressFill, { width: '30%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.age}</Text>
            <TextInput
              style={styles.input}
              placeholder={currentContent.agePlaceholder}
              placeholderTextColor={Colors.text.tertiary}
              value={demographics.age}
              onChangeText={(text) => setDemographics({ ...demographics, age: text })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.gender}</Text>
            <View style={styles.genderButtons}>
              {(['male', 'female', 'other'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    demographics.gender === option && styles.genderButtonSelected,
                  ]}
                  onPress={() => setDemographics({ ...demographics, gender: option })}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      demographics.gender === option && styles.genderButtonTextSelected,
                    ]}
                  >
                    {currentContent.genderOptions[option]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{currentContent.height}</Text>
              <TextInput
                style={styles.input}
                placeholder={currentContent.heightPlaceholder}
                placeholderTextColor={Colors.text.tertiary}
                value={demographics.height}
                onChangeText={(text) => setDemographics({ ...demographics, height: text })}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{currentContent.weight}</Text>
              <TextInput
                style={styles.input}
                placeholder={currentContent.weightPlaceholder}
                placeholderTextColor={Colors.text.tertiary}
                value={demographics.weight}
                onChangeText={(text) => setDemographics({ ...demographics, weight: text })}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.location}</Text>
            <TextInput
              style={styles.input}
              placeholder={currentContent.locationPlaceholder}
              placeholderTextColor={Colors.text.tertiary}
              value={demographics.location}
              onChangeText={(text) => setDemographics({ ...demographics, location: text })}
            />
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
  formContainer: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderButton: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  genderButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  genderButtonTextSelected: {
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
