import { useAppTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecurityQuestionsScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Security Questions</Text>

      <Text style={[styles.label, { color: colors.text }]}>What is your mother’s maiden name?</Text>
      <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} />

      <Text style={[styles.label, { color: colors.text }]}>What was your first pet's name?</Text>
      <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}>
        <Text style={styles.buttonText}>Save Answers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
