import { useAppTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TwoFactorSetupScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Two-Factor Authentication</Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>
        Enter your phone number to receive verification codes.
      </Text>

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}>
        <Text style={styles.buttonText}>Send Verification Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  subtitle: { fontSize: 14, marginBottom: 12 },
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
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
