import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, Spacing, Borders, Typography, Shadows } from '@/constants/theme';


export default function AccountScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Hesap Oluşturun',
      subtitle: 'Son adım! Hesabınızı oluşturun ve başlayın',
      email: 'E-posta',
      emailPlaceholder: 'ornek@email.com',
      password: 'Şifre',
      passwordPlaceholder: 'En az 8 karakter',
      confirmPassword: 'Şifreyi Onayla',
      confirmPasswordPlaceholder: 'Şifrenizi tekrar girin',
      createAccount: 'Hesap Oluştur',
      backButton: 'Geri',
      skipForNow: 'Şimdilik Atla',
      validation: {
        emailRequired: 'E-posta adresi gerekli',
        emailInvalid: 'Geçerli bir e-posta adresi girin',
        passwordRequired: 'Şifre gerekli',
        passwordTooShort: 'Şifre en az 8 karakter olmalı',
        passwordsNotMatch: 'Şifreler eşleşmiyor',
      },
      success: 'Hesabınız başarıyla oluşturuldu!',
    },
    en: {
      title: 'Create Account',
      subtitle: 'Final step! Create your account and get started',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      password: 'Password',
      passwordPlaceholder: 'At least 8 characters',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      createAccount: 'Create Account',
      backButton: 'Back',
      skipForNow: 'Skip for Now',
      validation: {
        emailRequired: 'Email address is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsNotMatch: 'Passwords do not match',
      },
      success: 'Your account has been created successfully!',
    },
  };

  const currentContent = content[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', currentContent.validation.emailRequired);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', currentContent.validation.emailInvalid);
      return;
    }

    if (!password) {
      Alert.alert('Error', currentContent.validation.passwordRequired);
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', currentContent.validation.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', currentContent.validation.passwordsNotMatch);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save account info
      const accountData = {
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };

      await SecureStore.setItemAsync('userAccount', JSON.stringify(accountData));
      await SecureStore.setItemAsync('onboardingCompleted', 'true');

      Alert.alert(
        'Success',
        currentContent.success,
        [
          {
            text: 'OK',
            onPress: () => router.push('/onboarding/onboarding-completed'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync('onboardingCompleted', 'true');
    router.push('/onboarding/onboarding-completed');
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
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.email}</Text>
            <TextInput
              style={styles.input}
              placeholder={currentContent.emailPlaceholder}
              placeholderTextColor={Colors.text.tertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.password}</Text>
            <TextInput
              style={styles.input}
              placeholder={currentContent.passwordPlaceholder}
              placeholderTextColor={Colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{currentContent.confirmPassword}</Text>
            <TextInput
              style={styles.input}
              placeholder={currentContent.confirmPasswordPlaceholder}
              placeholderTextColor={Colors.text.tertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>{currentContent.skipForNow}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreateAccount}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? '...' : currentContent.createAccount}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  createButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    borderRadius: Borders.radius.full,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
});
