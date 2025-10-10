// app/_layout.tsx
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

// ✅ Configure notification behavior
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

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        // ✅ Ask for permission
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('Push notification permission not granted');
          return;
        }

        // ✅ Get the push token
        const { data: token } = await Notifications.getExpoPushTokenAsync();
        if (!token) {
          console.warn('No Expo push token received');
          return;
        }

        console.log('✅ Expo Push Token:', token);

        // ✅ Store it securely
        await SecureStore.setItemAsync('expoPushToken', token);

        // Optional: check what was stored
        const savedToken = await SecureStore.getItemAsync('expoPushToken');
        console.log('Token saved in SecureStore:', savedToken);

        // ✅ Configure Android-specific behavior
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      } catch (error) {
        console.error('Error registering for notifications:', error);
      }
    };

    registerForPushNotifications();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

