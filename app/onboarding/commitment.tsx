import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '../../theme';

const { Colors, Spacing, Borders, Typography } = Theme;
const { width } = Dimensions.get('window');

export default function CommitmentScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [commitmentType, setCommitmentType] = useState<'signature' | 'name' | 'longpress' | ''>('');
  const [signaturePath, setSignaturePath] = useState('');
  const [userName, setUserName] = useState('');
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [commitmentMade, setCommitmentMade] = useState(false);

  const longPressAnimValue = useRef(new Animated.Value(0)).current;
  const signatureRef = useRef<any>(null);
  const currentPath = useRef('');
  const longPressTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Taahhüdünüz',
      subtitle: 'Sağlık yolculuğunuza olan bağlılığınızı gösterin',
      pledge: 'Sağlığımı iyileştirmek ve bu uygulamanın önerilerini takip etmek için kendime söz veriyorum. Bu yolculuğa sabır ve kararlılıkla başlayacağım.',
      signatureMethod: 'İmza ile',
      nameMethod: 'İsim ile',
      longPressMethod: 'Uzun basma ile',
      signatureHint: 'Aşağıdaki alana imzanızı atın',
      nameHint: 'Adınızı yazın',
      longPressHint: 'Butona 3 saniye basılı tutun',
      clearSignature: 'Temizle',
      commitment: 'Taahhüt Et',
      commitmentMade: 'Taahhüdünüz alındı! 🎉',
      continueButton: 'Devam Et',
      backButton: 'Geri',
    },
    en: {
      title: 'Your Commitment',
      subtitle: 'Show your dedication to your health journey',
      pledge: 'I pledge to improve my health and follow the recommendations of this app. I will begin this journey with patience and determination.',
      signatureMethod: 'With Signature',
      nameMethod: 'With Name',
      longPressMethod: 'With Long Press',
      signatureHint: 'Draw your signature in the area below',
      nameHint: 'Type your name',
      longPressHint: 'Hold the button for 3 seconds',
      clearSignature: 'Clear',
      commitment: 'Make Commitment',
      commitmentMade: 'Commitment received! 🎉',
      continueButton: 'Continue',
      backButton: 'Back',
    },
  };

  const currentContent = content[language];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentPath.current = `M${locationX},${locationY}`;
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentPath.current += `L${locationX},${locationY}`;
      setSignaturePath(currentPath.current);
    },
    onPanResponderRelease: () => {
      // Signature complete
    },
  });

  const clearSignature = () => {
    setSignaturePath('');
    currentPath.current = '';
  };

  const handleLongPressStart = () => {
    setIsLongPressing(true);

    Animated.timing(longPressAnimValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start((finished) => {
      if (finished) {
        setCommitmentType('longpress');
        setCommitmentMade(true);
        setIsLongPressing(false);
      }
    });
  };

  const handleLongPressEnd = () => {
    setIsLongPressing(false);
    longPressAnimValue.setValue(0);
  };

  const makeCommitment = () => {
    if (commitmentType === 'signature' && signaturePath) {
      setCommitmentMade(true);
    } else if (commitmentType === 'name' && userName.trim()) {
      setCommitmentMade(true);
    }
  };

  const handleContinue = async () => {
    const commitmentData = {
      type: commitmentType,
      signature: commitmentType === 'signature' ? signaturePath : '',
      name: commitmentType === 'name' ? userName : '',
      timestamp: new Date().toISOString(),
    };

    await SecureStore.setItemAsync('userCommitment', JSON.stringify(commitmentData));
    await SecureStore.setItemAsync('onboardingStep', 'analysis');

    router.push('/onboarding/analysis');
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
          <View style={[styles.progressFill, { width: '70%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.pledgeCard}>
          <Text style={styles.pledgeText}>{currentContent.pledge}</Text>
        </View>

        {!commitmentMade ? (
          <>
            <Text style={styles.methodTitle}>Choose your commitment method:</Text>

            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  commitmentType === 'signature' && styles.methodButtonSelected,
                ]}
                onPress={() => setCommitmentType('signature')}
              >
                <Text style={styles.methodIcon}>✍️</Text>
                <Text style={[
                  styles.methodText,
                  commitmentType === 'signature' && styles.methodTextSelected,
                ]}>
                  {currentContent.signatureMethod}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  commitmentType === 'name' && styles.methodButtonSelected,
                ]}
                onPress={() => setCommitmentType('name')}
              >
                <Text style={styles.methodIcon}>📝</Text>
                <Text style={[
                  styles.methodText,
                  commitmentType === 'name' && styles.methodTextSelected,
                ]}>
                  {currentContent.nameMethod}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  commitmentType === 'longpress' && styles.methodButtonSelected,
                ]}
                onPress={() => setCommitmentType('longpress')}
              >
                <Text style={styles.methodIcon}>👆</Text>
                <Text style={[
                  styles.methodText,
                  commitmentType === 'longpress' && styles.methodTextSelected,
                ]}>
                  {currentContent.longPressMethod}
                </Text>
              </TouchableOpacity>
            </View>

            {commitmentType === 'signature' && (
              <View style={styles.signatureSection}>
                <Text style={styles.hintText}>{currentContent.signatureHint}</Text>
                <View style={styles.signatureContainer}>
                  <View
                    style={styles.signatureArea}
                    {...panResponder.panHandlers}
                  >
                    <Svg height={150} width={width - 40}>
                      {signaturePath && (
                        <Path
                          d={signaturePath}
                          stroke={Colors.primary[600]}
                          strokeWidth={3}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </Svg>
                  </View>
                  <TouchableOpacity style={styles.clearButton} onPress={clearSignature}>
                    <Text style={styles.clearButtonText}>{currentContent.clearSignature}</Text>
                  </TouchableOpacity>
                </View>
                {signaturePath && (
                  <TouchableOpacity style={styles.commitButton} onPress={makeCommitment}>
                    <Text style={styles.commitButtonText}>{currentContent.commitment}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {commitmentType === 'name' && (
              <View style={styles.nameSection}>
                <Text style={styles.hintText}>{currentContent.nameHint}</Text>
                <TextInput
                  style={styles.nameInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Your full name"
                  placeholderTextColor={Colors.text.tertiary}
                />
                {userName.trim() && (
                  <TouchableOpacity style={styles.commitButton} onPress={makeCommitment}>
                    <Text style={styles.commitButtonText}>{currentContent.commitment}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {commitmentType === 'longpress' && (
              <View style={styles.longPressSection}>
                <Text style={styles.hintText}>{currentContent.longPressHint}</Text>
                <TouchableOpacity
                  style={styles.longPressButton}
                  onPressIn={handleLongPressStart}
                  onPressOut={handleLongPressEnd}
                  activeOpacity={1}
                >
                  <Animated.View
                    style={[
                      styles.longPressProgress,
                      {
                        width: longPressAnimValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                  <Text style={styles.longPressText}>
                    {isLongPressing ? 'Hold...' : currentContent.commitment}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.successSection}>
            <Text style={styles.successText}>{currentContent.commitmentMade}</Text>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>🎯</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {commitmentMade && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>{currentContent.continueButton}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  pledgeCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[600],
  },
  pledgeText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[800],
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    fontStyle: 'italic',
  },
  methodTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  methodButtons: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
  },
  methodButtonSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  methodIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  methodText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  methodTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  signatureSection: {
    marginBottom: Spacing.xl,
  },
  nameSection: {
    marginBottom: Spacing.xl,
  },
  longPressSection: {
    marginBottom: Spacing.xl,
  },
  hintText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  signatureContainer: {
    marginBottom: Spacing.md,
  },
  signatureArea: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
    height: 150,
    marginBottom: Spacing.sm,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  nameInput: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  longPressButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: Borders.radius.full,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  longPressProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary[800],
  },
  longPressText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    zIndex: 1,
  },
  commitButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: Borders.radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  commitButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  successText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 40,
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
