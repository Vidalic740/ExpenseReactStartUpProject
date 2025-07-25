import { useAppTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function AddLayout() {
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
      <Stack.Screen name="income" options={{ title: 'Add Income' }} />
      <Stack.Screen name="expense" options={{ title: 'Add Expense' }}/>
    </Stack>
  );
}
