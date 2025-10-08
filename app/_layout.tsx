// app/_layout.tsx
import React, { useEffect } from 'react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

// 🔔 Configure how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppLayout() {
  const { theme } = useAppTheme();

  return (
    <NavigationThemeProvider
      value={theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(add)" options={{ headerShown: false }} />
        <Stack.Screen name="(setting)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="(wallet)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 🔔 Ask for Notification Permissions once on mount
  useEffect(() => {
    const registerForNotifications = async () => {
      try {
        let finalStatus;

        if (Platform.OS === 'ios') {
          // iOS requires explicit permissions
          const { status } = await Notifications.requestPermissionsAsync({
            alert: true,
            badge: true,
            sound: true,
          });
          finalStatus = status;
        } else {
          // Android (API 33+) requires runtime permission
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          if (existingStatus === 'granted') {
            finalStatus = existingStatus;
          } else {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
        }

        if (finalStatus !== 'granted') {
          console.log('Notification permission not granted');
          return;
        }

        // ✅ Get Expo push token (optional, for sending push notifications)
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };

    registerForNotifications();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

