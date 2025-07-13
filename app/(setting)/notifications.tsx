import { useAppTheme } from '@/context/ThemeContext'; // 👈 Import theme context
import { StyleSheet, Text, View } from 'react-native';

export default function NotificationScreen() {
  const { colors } = useAppTheme(); // 👈 Use theme hook

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
