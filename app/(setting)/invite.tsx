import { useAppTheme } from '@/context/ThemeContext'; // 👈 Theme hook
import { StyleSheet, Text, View } from 'react-native';

export default function InviteScreen() {
  const { colors } = useAppTheme(); // 🎨 Access theme colors

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
