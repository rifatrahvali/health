import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Theme } from '../../../theme';
import { CommonStyles } from '../../../theme/common-styles';

const { Colors, Spacing, Borders, Typography, Animations } = Theme;
const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onContinue: (language: 'tr' | 'en') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'tr' | 'en'>('tr');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animations.duration.slow,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: Animations.duration.verySlow,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...Animations.spring.gentle,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    onContinue(selectedLanguage);
  };

  const content = {
    tr: {
      appName: 'GutWell',
      tagline: 'Mutlu bir bağırsak için\ndaha iyi bir sen',
      description: 'Bağırsak sağlığınızı anlamanın ve iyileştirmenin kişisel yolu',
      continueButton: 'Yolculuğunuza Başlayın',
      selectLanguage: 'Dil Seçin'
    },
    en: {
      appName: 'GutWell',
      tagline: 'A better you for\na happy gut',
      description: 'Your personal path to understanding and improving gut health',
      continueButton: 'Start Your Journey',
      selectLanguage: 'Select Language'
    }
  };

  const currentContent = content[selectedLanguage];

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </View>
          <Text style={styles.appName}>{currentContent.appName}</Text>
        </View>

        <Text style={styles.tagline}>{currentContent.tagline}</Text>
        <Text style={styles.description}>{currentContent.description}</Text>

        <View style={styles.languageContainer}>
          <Text style={styles.languageLabel}>{currentContent.selectLanguage}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedLanguage === 'tr' && styles.languageButtonActive,
              ]}
              onPress={() => setSelectedLanguage('tr')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selectedLanguage === 'tr' && styles.languageButtonTextActive,
                ]}
              >
                🇹🇷 Türkçe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedLanguage === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => setSelectedLanguage('en')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selectedLanguage === 'en' && styles.languageButtonTextActive,
                ]}
              >
                🇬🇧 English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={CommonStyles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={CommonStyles.primaryButtonText}>{currentContent.continueButton}</Text>
        </TouchableOpacity>

        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Theme.shadows.md,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    letterSpacing: Typography.letterSpacing.wide,
  },
  tagline: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[800],
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: Typography.fontSize.xxl * Typography.lineHeight.normal,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.lg,
  },
  languageContainer: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  languageButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radius.xl,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  languageButtonActive: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  languageButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  languageButtonTextActive: {
    color: Colors.primary[800],
    fontWeight: Typography.fontWeight.semibold,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  circle1: {
    width: 150,
    height: 150,
    backgroundColor: Colors.primary[600],
    top: -50,
    left: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.primary[400],
    bottom: -100,
    right: -100,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: Colors.primary[500],
    top: 100,
    right: -30,
  },
});

export default WelcomeScreen;