import { Stack } from 'expo-router';
import React from 'react';
import { Theme } from '../../theme';

const { Colors } = Theme;

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background.primary,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="demographics" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="symptoms" />
      <Stack.Screen name="medical-history" />
      <Stack.Screen name="personalization-reveal" />
      <Stack.Screen name="commitment" />
      <Stack.Screen name="analysis" />
      <Stack.Screen name="report" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="account" />
      <Stack.Screen name="onboarding-completed" />
    </Stack>
  );
}
