import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, Borders, Typography, Shadows } from '@/constants/theme';
import { CommonStyles } from '@/constants/common-styles';

const { width } = Dimensions.get('window');

export default function CommitmentScreen() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [commitmentType, setCommitmentType] = useState<'signature' | 'name' | 'longpress' | ''>('');
  const [signaturePath, setSignaturePath] = useState('');
  const [userName, setUserName] = useState('');
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [commitmentMade, setCommitmentMade] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [questionAnswers, setQuestionAnswers] = useState<string[]>(['', '', '']);
  const [isDrawing, setIsDrawing] = useState(false);

  const longPressAnimValue = useRef(new Animated.Value(0)).current;
  const signatureRef = useRef<any>(null);
  const currentPath = useRef('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    if (savedLanguage) setLanguage(savedLanguage as 'tr' | 'en');
  };

  const content = {
    tr: {
      title: 'Bağırsak Sağlığı Taahhüdüm',
      subtitle: 'Sağlıklı yaşama giden yolculuğunuza başlıyor',
      pledge: 'Bağırsak sağlığımı iyileştirmek ve GutWell planımı takip etmek için kendime söz veriyorum. Günlük alışkanlıklarımı değiştirerek, sağlıklı beslenmeye odaklanacağım ve bu yolculukta sabırlı olacağım.',
      personalQuestions: [
        {
          question: 'En çok hangi semptomdan kurtulmak istiyorsunuz?',
          placeholder: 'Örn: Şişkinlik, gaz problemi, karın ağrısı...'
        },
        {
          question: 'Bu değişimi gerçekleştirmek için ne kadar kararlısınız? (1-10)',
          placeholder: 'Kararlılık seviyenizi 1-10 arası değerlendirin'
        },
        {
          question: 'Size en çok motivasyon veren şey nedir?',
          placeholder: 'Örn: Daha enerjik hissetmek, daha iyi görünmek...'
        }
      ],
      signatureMethod: 'İmza ile',
      nameMethod: 'İsim ile',
      longPressMethod: 'Uzun basma ile',
      signatureHint: 'Taahhüdünüzü imzalayın',
      nameHint: 'Adınızı yazarak taahhüt edin',
      longPressHint: 'Butona 3 saniye basılı tutarak taahhüt edin',
      clearSignature: 'Temizle',
      commitment: 'Taahhüdümü Ver',
      commitmentMade: 'Taahhüdünüz alındı! Artık bu yolculukta birlikte ilerliyoruz 🎯',
      continueButton: 'Hesap Oluştur',
      backButton: 'Geri',
      questionnaireTitle: 'Size Özel Birkaç Soru',
      fillQuestions: 'Lütfen aşağıdaki soruları cevaplayın',
      skipQuestions: 'Soruları Atla',
    },
    en: {
      title: 'My Gut Health Commitment',
      subtitle: 'Your journey to healthy living begins now',
      pledge: 'I pledge to improve my gut health and follow my GutWell plan. I will change my daily habits, focus on healthy nutrition, and be patient on this journey.',
      personalQuestions: [
        {
          question: 'Which symptom do you most want to get rid of?',
          placeholder: 'E.g.: Bloating, gas issues, stomach pain...'
        },
        {
          question: 'How determined are you to make this change? (1-10)',
          placeholder: 'Rate your determination level between 1-10'
        },
        {
          question: 'What motivates you the most?',
          placeholder: 'E.g.: Feeling more energetic, looking better...'
        }
      ],
      signatureMethod: 'With Signature',
      nameMethod: 'With Name',
      longPressMethod: 'With Long Press',
      signatureHint: 'Sign your commitment',
      nameHint: 'Commit by writing your name',
      longPressHint: 'Commit by holding the button for 3 seconds',
      clearSignature: 'Clear',
      commitment: 'Make My Commitment',
      commitmentMade: 'Commitment received! Now we move forward together on this journey 🎯',
      continueButton: 'Create Account',
      backButton: 'Back',
      questionnaireTitle: 'A Few Personal Questions',
      fillQuestions: 'Please answer the questions below',
      skipQuestions: 'Skip Questions',
    },
  };

  const currentContent = content[language];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentPath.current = `M${locationX},${locationY}`;
      setIsDrawing(true);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentPath.current += `L${locationX},${locationY}`;
      setSignaturePath(currentPath.current);
    },
    onPanResponderRelease: () => {
      setIsDrawing(false);
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
      personalAnswers: questionAnswers,
      timestamp: new Date().toISOString(),
    };

    await SecureStore.setItemAsync('userCommitment', JSON.stringify(commitmentData));
    await SecureStore.setItemAsync('onboardingStep', 'account');

    router.push('/onboarding/account');
  };

  const updateAnswer = (index: number, answer: string) => {
    const newAnswers = [...questionAnswers];
    newAnswers[index] = answer;
    setQuestionAnswers(newAnswers);
  };

  const skipQuestions = () => {
    setShowQuestions(false);
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDrawing}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <Text style={styles.subtitle}>{currentContent.subtitle}</Text>

        <View style={styles.pledgeCard}>
          <Text style={styles.pledgeText}>{currentContent.pledge}</Text>
        </View>

        {showQuestions && (
          <View style={styles.questionsSection}>
            <Text style={styles.questionsTitle}>{currentContent.questionnaireTitle}</Text>
            <Text style={styles.questionsSubtitle}>{currentContent.fillQuestions}</Text>

            {currentContent.personalQuestions.map((q, index) => (
              <View key={index} style={styles.questionGroup}>
                <Text style={styles.questionText}>{q.question}</Text>
                <TextInput
                  style={styles.questionInput}
                  value={questionAnswers[index]}
                  onChangeText={(text) => updateAnswer(index, text)}
                  placeholder={q.placeholder}
                  placeholderTextColor={Colors.text.tertiary}
                  multiline={index === 0 || index === 2}
                  numberOfLines={index === 0 || index === 2 ? 3 : 1}
                />
              </View>
            ))}

            <View style={styles.questionActions}>
              <TouchableOpacity
                style={styles.skipQuestionsButton}
                onPress={skipQuestions}
              >
                <Text style={styles.skipQuestionsText}>{currentContent.skipQuestions}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.proceedButton}
                onPress={() => setShowQuestions(false)}
              >
                <Text style={styles.proceedButtonText}>
                  {language === 'tr' ? 'Devam Et' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showQuestions && !commitmentMade ? (
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
          !showQuestions && (
            <View style={styles.successSection}>
              <Text style={styles.successText}>{currentContent.commitmentMade}</Text>
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>🎯</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {(commitmentMade || !showQuestions && commitmentMade) && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={CommonStyles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={CommonStyles.primaryButtonText}>{currentContent.continueButton}</Text>
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
  questionsSection: {
    marginBottom: Spacing.xl,
  },
  questionsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  questionsSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  questionGroup: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  questionInput: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    textAlignVertical: 'top',
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  skipQuestionsButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipQuestionsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  proceedButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Borders.radius.full,
  },
  proceedButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
