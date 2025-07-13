import { useAppTheme } from '@/context/ThemeContext'; // 👈 Theme hook
import { StyleSheet, Text, View } from 'react-native';

export default function LanguageScreen() {
  const { colors } = useAppTheme(); // 🎨 Access theme colors

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Languages</Text>
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
