import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 🔔 Notification handler — defines behavior when notification is received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 📱 Ask for permission
export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was not granted!');
  }
}

