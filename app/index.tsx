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
      // Check if onboarding is completed
      const onboardingCompleted = await SecureStore.getItemAsync('onboardingCompleted');
      console.log('Onboarding completed:', onboardingCompleted);

      if (onboardingCompleted === 'true') {
        // If onboarding is completed, go to main app
        console.log('Navigating to tabs');
        router.replace('/(tabs)/');
      } else {
        // Otherwise, start onboarding
        console.log('Navigating to onboarding');
        router.replace('/onboarding/welcome');
      }
    } catch (error) {
      // If there's an error, start onboarding
      console.log('Error checking onboarding status:', error);
      router.replace('/onboarding/welcome');
    } finally {
      setIsLoading(false);
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