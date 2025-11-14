import { useAppTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function ScreensLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background, // match layout bg
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background, // match layout content
        },
      }}
    >
      <Stack.Screen name="password" options={{ title: 'Change Password' }} />
      <Stack.Screen name="profile" options={{ title: 'Update Profile' }} />
      <Stack.Screen name="request" options={{ title: 'Request Account Info' }}/>
      <Stack.Screen name="security" options={{ title: 'Security Questions' }}/>
      <Stack.Screen name="verification" options={{ title: 'Two-Factor Verification' }}/>
      <Stack.Screen name="transactions" options={{ title: 'Transactions' }}/>
    </Stack>
  );
}
