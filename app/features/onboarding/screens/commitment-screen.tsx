import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import { Theme } from '../../../theme';
import { CommonStyles } from '../../../theme/common-styles';

const { Colors, Spacing, Borders, Typography, Animations } = Theme;
const { width } = Dimensions.get('window');

interface CommitmentScreenProps {
  language: 'tr' | 'en';
  userName?: string;
  onContinue: (commitmentType: string, commitmentData: any) => void;
  onBack: () => void;
}

const CommitmentScreen: React.FC<CommitmentScreenProps> = ({
  language,
  userName = '',
  onContinue,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'signature' | 'name' | 'longpress' | null>(null);
  const [nameInput, setNameInput] = useState(userName);
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [isCommitted, setIsCommitted] = useState(false);

  // Long press animation
  const longPressAnimation = useRef(new Animated.Value(0)).current;
  const confettiAnimation = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const content = {
    tr: {
      title: 'Sağlığınıza Söz Verin',
      subtitle: 'Bu yolculukta kararlılığınızı gösterin',
      pledgeText: 'Bağırsak sağlığımı iyileştirmek için her gün küçük adımlar atacağıma söz veriyorum.',
      methods: {
        signature: {
          label: 'İmza ile',
          description: 'Parmağınızla imzalayın',
          instruction: 'Aşağıya imzanızı çizin',
          clear: 'Temizle',
        },
        name: {
          label: 'İsim yazarak',
          description: 'Tam adınızı yazın',
          placeholder: 'Adınız ve Soyadınız',
          instruction: 'Söz vermek için adınızı yazın',
        },
        longpress: {
          label: 'Uzun basarak',
          description: '3 saniye basılı tutun',
          instruction: 'Söz vermek için basılı tutun',
          buttonText: 'Basılı Tutarak Söz Ver',
        },
      },
      committed: 'Tebrikler! Sözünüz alındı.',
      notAlone: 'Bu yolculukta yalnız değilsiniz',
      continueButton: 'Devam Et',
      backButton: 'Geri',
      selectMethod: 'Lütfen bir yöntem seçin',
    },
    en: {
      title: 'Make a Commitment',
      subtitle: 'Show your dedication to this journey',
      pledgeText: 'I commit to taking small steps every day to improve my gut health.',
      methods: {
        signature: {
          label: 'With signature',
          description: 'Sign with your finger',
          instruction: 'Draw your signature below',
          clear: 'Clear',
        },
        name: {
          label: 'By typing name',
          description: 'Type your full name',
          placeholder: 'Your Full Name',
          instruction: 'Type your name to commit',
        },
        longpress: {
          label: 'By long press',
          description: 'Hold for 3 seconds',
          instruction: 'Hold to make commitment',
          buttonText: 'Hold to Commit',
        },
      },
      committed: 'Congratulations! Your commitment is recorded.',
      notAlone: "You're not alone in this journey",
      continueButton: 'Continue',
      backButton: 'Back',
      selectMethod: 'Please select a method',
    },
  };

  const currentContent = content[language];

  // Signature handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => selectedMethod === 'signature',
      onMoveShouldSetPanResponder: () => selectedMethod === 'signature',
      onPanResponderMove: (evt) => {
        if (selectedMethod === 'signature') {
          const { locationX, locationY } = evt.nativeEvent;
          setSignaturePaths(prev => [...prev, `${locationX},${locationY}`]);
        }
      },
    })
  ).current;

  const clearSignature = () => {
    setSignaturePaths([]);
    setIsCommitted(false);
  };

  // Long press handling
  const startLongPress = () => {
    if (selectedMethod !== 'longpress') return;

    Animated.timing(longPressAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    longPressTimer.current = setTimeout(() => {
      handleCommitment();
    }, 3000);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    Animated.timing(longPressAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleCommitment = () => {
    if (selectedMethod === 'name' && !nameInput.trim()) {
      Alert.alert(
        language === 'tr' ? 'Uyarı' : 'Warning',
        language === 'tr' ? 'Lütfen adınızı girin' : 'Please enter your name'
      );
      return;
    }

    if (selectedMethod === 'signature' && signaturePaths.length < 10) {
      Alert.alert(
        language === 'tr' ? 'Uyarı' : 'Warning',
        language === 'tr' ? 'Lütfen imzanızı atın' : 'Please add your signature'
      );
      return;
    }

    setIsCommitted(true);

    // Trigger animations
    Animated.parallel([
      Animated.spring(confettiAnimation, {
        toValue: 1,
        ...Animations.spring.wobbly,
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        ...Animations.spring.gentle,
        useNativeDriver: true,
      }),
    ]).start();

    // Prepare commitment data
    const commitmentData = {
      method: selectedMethod,
      timestamp: new Date().toISOString(),
      data: selectedMethod === 'name' ? nameInput :
            selectedMethod === 'signature' ? signaturePaths :
            'longpress',
    };

    setTimeout(() => {
      onContinue(selectedMethod, commitmentData);
    }, 2000);
  };

  const renderMethodButton = (method: 'signature' | 'name' | 'longpress') => {
    const methodContent = currentContent.methods[method];
    const isSelected = selectedMethod === method;

    return (
      <TouchableOpacity
        style={[styles.methodCard, isSelected && styles.methodCardSelected]}
        onPress={() => {
          setSelectedMethod(method);
          setIsCommitted(false);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.methodHeader}>
          <Text style={styles.methodLabel}>{methodContent.label}</Text>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.methodDescription}>{methodContent.description}</Text>
      </TouchableOpacity>
    );
  };

  const renderCommitmentArea = () => {
    if (!selectedMethod) return null;

    if (isCommitted) {
      return (
        <Animated.View
          style={[
            styles.committedContainer,
            {
              opacity: confettiAnimation,
              transform: [{ scale: checkmarkScale }],
            },
          ]}
        >
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.committedText}>{currentContent.committed}</Text>
          <Text style={styles.notAloneText}>{currentContent.notAlone}</Text>
        </Animated.View>
      );
    }

    switch (selectedMethod) {
      case 'signature':
        return (
          <View style={styles.signatureContainer}>
            <Text style={styles.instruction}>
              {currentContent.methods.signature.instruction}
            </Text>
            <View style={styles.signaturePad} {...panResponder.panHandlers}>
              {signaturePaths.length > 0 && (
                <View style={styles.signaturePreview}>
                  <Text style={styles.signatureText}>
                    {signaturePaths.length > 0 ? '~Signature~' : ''}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={clearSignature}>
              <Text style={styles.clearButtonText}>
                {currentContent.methods.signature.clear}
              </Text>
            </TouchableOpacity>
            {signaturePaths.length > 10 && (
              <TouchableOpacity style={CommonStyles.primaryButton} onPress={handleCommitment}>
                <Text style={CommonStyles.primaryButtonText}>
                  {currentContent.continueButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'name':
        return (
          <View style={styles.nameContainer}>
            <Text style={styles.instruction}>
              {currentContent.methods.name.instruction}
            </Text>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder={currentContent.methods.name.placeholder}
              placeholderTextColor={Colors.text.tertiary}
              autoCapitalize="words"
            />
            {nameInput.trim().length > 0 && (
              <TouchableOpacity style={CommonStyles.primaryButton} onPress={handleCommitment}>
                <Text style={CommonStyles.primaryButtonText}>
                  {currentContent.continueButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'longpress':
        const progressWidth = longPressAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });

        return (
          <View style={styles.longPressContainer}>
            <Text style={styles.instruction}>
              {currentContent.methods.longpress.instruction}
            </Text>
            <TouchableOpacity
              style={styles.longPressButton}
              onPressIn={startLongPress}
              onPressOut={cancelLongPress}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.longPressProgress,
                  { width: progressWidth },
                ]}
              />
              <Text style={styles.longPressText}>
                {currentContent.methods.longpress.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <View style={CommonStyles.header}>
        <TouchableOpacity onPress={onBack} style={CommonStyles.backButton}>
          <Text style={CommonStyles.backButtonText}>← {currentContent.backButton}</Text>
        </TouchableOpacity>
        <View style={CommonStyles.progressBar}>
          <View style={[CommonStyles.progressFill, { width: '85%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={CommonStyles.screenTitle}>{currentContent.title}</Text>
        <Text style={CommonStyles.screenSubtitle}>{currentContent.subtitle}</Text>

        {/* Pledge Text */}
        <View style={styles.pledgeContainer}>
          <Text style={styles.pledgeText}>"{currentContent.pledgeText}"</Text>
        </View>

        {/* Method Selection */}
        <View style={styles.methodsContainer}>
          {renderMethodButton('signature')}
          {renderMethodButton('name')}
          {renderMethodButton('longpress')}
        </View>

        {/* Commitment Area */}
        {renderCommitmentArea()}
      </ScrollView>

      {isCommitted && (
        <View style={CommonStyles.footer}>
          <TouchableOpacity
            style={CommonStyles.primaryButton}
            onPress={() => onContinue(selectedMethod!, { method: selectedMethod })}
            activeOpacity={0.8}
          >
            <Text style={CommonStyles.primaryButtonText}>{currentContent.continueButton}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  pledgeContainer: {
    backgroundColor: Colors.primary[50],
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[600],
  },
  pledgeText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary[900],
    fontStyle: 'italic',
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.relaxed,
    textAlign: 'center',
  },
  methodsContainer: {
    marginBottom: Spacing.xl,
  },
  methodCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    ...Theme.shadows.xs,
  },
  methodCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  methodLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  methodDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.bold,
  },
  instruction: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  signatureContainer: {
    marginBottom: Spacing.xl,
  },
  signaturePad: {
    height: 200,
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
    marginBottom: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signaturePreview: {
    alignItems: 'center',
  },
  signatureText: {
    fontSize: Typography.fontSize.xxl,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  clearButton: {
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  clearButtonText: {
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  nameContainer: {
    marginBottom: Spacing.xl,
  },
  nameInput: {
    backgroundColor: Colors.background.card,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    borderRadius: Borders.radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  longPressContainer: {
    marginBottom: Spacing.xl,
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
    backgroundColor: Colors.primary[700],
  },
  longPressText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    zIndex: 1,
  },
  committedContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  checkmark: {
    fontSize: 60,
    color: Colors.semantic.success,
    marginBottom: Spacing.md,
  },
  committedText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  notAloneText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

export default CommitmentScreen;