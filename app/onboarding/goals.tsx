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

interface UserGoal {
  id: string;
  label: string;
  labelTr: string;
  icon: string;
  selected: boolean;
}

const DEFAULT_GOALS: UserGoal[] = [
  {
    id: 'less_bloating',
    label: 'Less bloating and discomfort',
    labelTr: 'Daha az şişkinlik ve rahatsızlık',
    icon: '🎯',
    selected: false
  },
  {
    id: 'regular_digestion',
    label: 'More regular digestion',
    labelTr: 'Daha düzenli sindirim',
    icon: '⏰',
    selected: false
  },
  {
    id: 'more_energy',
    label: 'More energy and vitality',
    labelTr: 'Daha fazla enerji ve zindelik',
    icon: '⚡',
    selected: false
  },
  {
    id: 'improve_gut_health',
    label: 'Improve overall gut health',
    labelTr: 'Genel bağırsak sağlığını iyileştirmek',
    icon: '💪',
    selected: false
  },
  {
    id: 'manage_condition',
    label: 'Manage specific condition',
    labelTr: 'Belirli bir durumu yönetmek',
    icon: '🏥',
    selected: false
  },
  {
    id: 'healthy_habits',
    label: 'Develop healthy eating habits',
    labelTr: 'Sağlıklı beslenme alışkanlıkları',
    icon: '🥗',
    selected: false
  }
];

export default function GoalSelectionScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>(DEFAULT_GOALS);
  const [importance, setImportance] = useState(3);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Hedefleriniz',
      subtitle: 'Uygulamamızdan ne elde etmek istiyorsunuz?',
      selectMultiple: 'Birden fazla seçebilirsiniz',
      importanceLabel: 'Bu sizin için ne kadar önemli?',
      continueButton: 'Devam Et',
      backButton: 'Geri',
      importanceLevels: ['Çok Az', 'Az', 'Orta', 'Önemli', 'Çok Önemli'],
      validation: 'Lütfen en az bir hedef seçin',
      selectedCount: 'hedef seçildi',
    },
    en: {
      title: 'Your Goals',
      subtitle: 'What would you like to achieve with our app?',
      selectMultiple: 'You can select multiple',
      importanceLabel: 'How important is this for you?',
      continueButton: 'Continue',
      backButton: 'Back',
      importanceLevels: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
      validation: 'Please select at least one goal',
      selectedCount: 'goals selected',
    },
  };

  const currentContent = content[language];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
      )
    );
  };

  const handleContinue = async () => {
    const activeGoals = selectedGoals.filter(g => g.selected);
    if (activeGoals.length === 0) {
      alert(currentContent.validation);
      return;
    }

    await SecureStore.setItemAsync('userGoals', JSON.stringify(activeGoals));
    await SecureStore.setItemAsync('goalImportance', String(importance));
    await SecureStore.setItemAsync('onboardingStep', 'demographics');

    router.push('/onboarding/demographics');
  };

  const handleBack = () => {
    router.back();
  };

  const getSelectedCount = () => selectedGoals.filter(g => g.selected).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '20%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>
        <Text style={styles.hint}>{currentContent.selectMultiple}</Text>

        <View style={styles.goalsContainer}>
          {selectedGoals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, goal.selected && styles.goalCardSelected]}
              onPress={() => toggleGoal(goal.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <Text style={[styles.goalText, goal.selected && styles.goalTextSelected]}>
                {language === 'tr' ? goal.labelTr : goal.label}
              </Text>
              {goal.selected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>OK</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.importanceSection}>
          <Text style={styles.importanceLabel}>{currentContent.importanceLabel}</Text>
          <View style={styles.importanceScale}>
            {[1, 2, 3, 4, 5].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.importanceItem}
                onPress={() => setImportance(level)}
              >
                <View
                  style={[
                    styles.star,
                    level <= importance && styles.starFilled,
                  ]}
                >
                  <Text
                    style={[
                      styles.starText,
                      level <= importance && styles.starTextFilled,
                    ]}
                  >
                    ★
                  </Text>
                </View>
                <Text style={styles.importanceText}>
                  {currentContent.importanceLevels[level - 1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionCount}>
            {getSelectedCount()} {currentContent.selectedCount}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            CommonStyles.primaryButton,
            getSelectedCount() === 0 && CommonStyles.buttonDisabled,
          ]}
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
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.lg,
  },
  goalsContainer: {
    marginBottom: Spacing.xl,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    ...Theme.Shadows.xs,
  },
  goalCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  goalIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  goalText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  goalTextSelected: {
    color: Colors.primary[800],
    fontWeight: Typography.fontWeight.medium,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  importanceSection: {
    marginBottom: Spacing.xl,
  },
  importanceLabel: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  importanceScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  importanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  star: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  starText: {
    fontSize: 30,
    color: Colors.neutral[300],
  },
  starFilled: {
    transform: [{ scale: 1.1 }],
  },
  starTextFilled: {
    color: '#FFC107',
  },
  importanceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  selectionInfo: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  selectionCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
