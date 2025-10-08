// utils/notificationHelper.ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleBillNotification({
  billName,
  dueDate,
}: {
  billName: string;
  dueDate: Date;
}) {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const trigger = { seconds: Math.max((dueDate.getTime() - Date.now()) / 1000, 1) };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Bill Reminder 💰',
        body: `Your bill "${billName}" is due now.`,
        sound: true,
      },
      trigger,
    });

    console.log(`📅 Notification scheduled for ${dueDate.toLocaleString()} (ID: ${id})`);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

