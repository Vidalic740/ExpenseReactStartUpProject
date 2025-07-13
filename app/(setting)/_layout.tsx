import { useAppTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
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
      <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="storage" options={{ title: 'Storage and Data' }} />
      <Stack.Screen name="languages" options={{ title: 'App Language' }} />
      <Stack.Screen name="theme" options={{ title: 'Themes' }} />
      <Stack.Screen name="help" options={{ title: 'Help Center' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="invite" options={{ title: 'Invite a Friend' }} />
      <Stack.Screen name="updates" options={{ title: 'App Updates' }} />
    </Stack>
  );
}
