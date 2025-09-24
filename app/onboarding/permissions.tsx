import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '../../theme';
import { CommonStyles } from '../../theme/common-styles';

const { Colors, Spacing, Borders, Typography } = Theme;

export default function PermissionsScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [healthAppEnabled, setHealthAppEnabled] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'İzinler',
      subtitle: 'Daha iyi bir deneyim için',
      notifications: {
        title: '📱 Bildirimler',
        description: 'Size kişiselleştirilmiş hatırlatıcılar ve ipuçları göndermek için',
        benefit: 'Günlük sağlık ipuçları\nİlaç hatırlatıcıları\nYemek takip hatırlatmaları',
      },
      healthApp: {
        title: '❤️ Sağlık Uygulaması',
        description: 'Adım, uyku ve diğer sağlık verilerinizi senkronize etmek için',
        benefit: 'Otomatik aktivite takibi\nUyku kalitesi analizi\nDaha doğru öneriler',
      },
      enable: 'İzin Ver',
      enabled: 'İzin Verildi',
      skip: 'Şimdilik Atla',
      continue: 'Devam Et',
      back: 'Geri',
    },
    en: {
      title: 'Permissions',
      subtitle: 'For a better experience',
      notifications: {
        title: '📱 Notifications',
        description: 'To send you personalized reminders and tips',
        benefit: 'Daily health tips\nMedication reminders\nMeal tracking reminders',
      },
      healthApp: {
        title: '❤️ Health App',
        description: 'To sync your steps, sleep and other health data',
        benefit: 'Automatic activity tracking\nSleep quality analysis\nMore accurate recommendations',
      },
      enable: 'Enable',
      enabled: 'Enabled',
      skip: 'Skip for Now',
      continue: 'Continue',
      back: 'Back',
    },
  };

  const currentContent = content[language];

  const requestNotificationPermission = async () => {
    Alert.alert(
      language === 'tr' ? 'Bildirim İzni' : 'Notification Permission',
      language === 'tr'
        ? 'Bildirim iznini ayarlardan etkinleştirebilirsiniz.'
        : 'You can enable notifications from settings.',
      [{ text: 'OK', onPress: () => setNotificationsEnabled(true) }]
    );
  };

  const requestHealthAppPermission = async () => {
    Alert.alert(
      language === 'tr' ? 'Sağlık Uygulaması' : 'Health App',
      language === 'tr'
        ? 'Sağlık uygulaması entegrasyonu yakında eklenecek.'
        : 'Health app integration will be added soon.',
      [{ text: 'OK', onPress: () => setHealthAppEnabled(true) }]
    );
  };

  const handleContinue = async () => {
    await SecureStore.setItemAsync('onboardingStep', 'goals');
    await SecureStore.setItemAsync('notificationsEnabled', String(notificationsEnabled));
    await SecureStore.setItemAsync('healthAppEnabled', String(healthAppEnabled));
    router.push('/onboarding/goals');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.back}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '10%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        {/* Notifications Permission */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <Text style={styles.permissionTitle}>
              {currentContent.notifications.title}
            </Text>
            {notificationsEnabled && (
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledBadgeText}>OK</Text>
              </View>
            )}
          </View>
          <Text style={styles.permissionDescription}>
            {currentContent.notifications.description}
          </Text>
          <Text style={styles.permissionBenefit}>
            {currentContent.notifications.benefit}
          </Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              notificationsEnabled && styles.permissionButtonEnabled,
            ]}
            onPress={requestNotificationPermission}
            disabled={notificationsEnabled}
          >
            <Text
              style={[
                styles.permissionButtonText,
                notificationsEnabled && styles.permissionButtonTextEnabled,
              ]}
            >
              {notificationsEnabled ? currentContent.enabled : currentContent.enable}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Health App Permission */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <Text style={styles.permissionTitle}>
              {currentContent.healthApp.title}
            </Text>
            {healthAppEnabled && (
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledBadgeText}>OK</Text>
              </View>
            )}
          </View>
          <Text style={styles.permissionDescription}>
            {currentContent.healthApp.description}
          </Text>
          <Text style={styles.permissionBenefit}>
            {currentContent.healthApp.benefit}
          </Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              healthAppEnabled && styles.permissionButtonEnabled,
            ]}
            onPress={requestHealthAppPermission}
            disabled={healthAppEnabled}
          >
            <Text
              style={[
                styles.permissionButtonText,
                healthAppEnabled && styles.permissionButtonTextEnabled,
              ]}
            >
              {healthAppEnabled ? currentContent.enabled : currentContent.enable}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={CommonStyles.ghostButton} onPress={handleContinue}>
          <Text style={CommonStyles.ghostButtonText}>{currentContent.skip}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={CommonStyles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={CommonStyles.primaryButtonText}>{currentContent.continue}</Text>
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
  permissionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Theme.Shadows.xs,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  permissionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  enabledBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabledBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  permissionDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  permissionBenefit: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
  },
  permissionButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radius.md,
    alignItems: 'center',
  },
  permissionButtonEnabled: {
    backgroundColor: Colors.primary[100],
  },
  permissionButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  permissionButtonTextEnabled: {
    color: Colors.primary[700],
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});
