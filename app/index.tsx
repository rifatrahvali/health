import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      console.log('Checking onboarding status...');

      // Small delay to ensure SecureStore is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Debug: Reset onboarding for testing (remove this in production)
      // await SecureStore.deleteItemAsync('onboardingCompleted');

      // Check if onboarding is completed
      const onboardingCompleted = await SecureStore.getItemAsync('onboardingCompleted');
      console.log('Onboarding completed:', onboardingCompleted);
      console.log('Type of onboardingCompleted:', typeof onboardingCompleted);
      console.log('Is exactly true?:', onboardingCompleted === 'true');

      // More explicit null/undefined checking
      if (onboardingCompleted === 'true') {
        // If onboarding is completed, go to main app
        console.log('Navigating to tabs');
        setTimeout(() => {
          router.replace('/(tabs)/');
        }, 100);
      } else {
        // Otherwise, start onboarding
        console.log('Navigating to onboarding, value was:', onboardingCompleted);
        setTimeout(() => {
          router.replace('/onboarding/welcome');
        }, 100);
      }
    } catch (error) {
      // If there's an error, start onboarding
      console.log('Error checking onboarding status:', error);
      setTimeout(() => {
        router.replace('/onboarding/welcome');
      }, 100);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>GutWell</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});