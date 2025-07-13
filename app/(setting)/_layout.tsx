import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack>
      {/*Account Screeen */}
      <Stack.Screen
        name="account"
        options={{ title: 'Account' }}
      />
      {/*Notification Screeen */}
      <Stack.Screen
        name="notifications"
        options={{ title: 'Notifications' }} 
      />
      {/*Storage&Data Screeen */}
      <Stack.Screen
        name="storage"
        options={{ title: 'Storage and Data' }} 
      />
      {/*App Language Screeen */}
      <Stack.Screen
        name="languages"
        options={{ title: 'App Language' }} 
      />
      {/*Themes Screeen */}
      <Stack.Screen
        name="theme"
        options={{ title: 'Themes' }} 
      />
      {/*Help Center Screeen */}
      <Stack.Screen
        name="help"
        options={{ title: 'Help Center' }} 
      />
      {/*About Screeen */}
      <Stack.Screen
        name="about"
        options={{ title: 'About' }} 
      />
      {/*Invitation Screeen */}
      <Stack.Screen
        name="invite"
        options={{ title: 'Invite a Friend' }} 
      />
      {/*App Updates Screeen */}
      <Stack.Screen
        name="updates"
        options={{ title: 'App Updates' }} 
      />
    </Stack>
  );
}
