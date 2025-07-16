import { useAppTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChangePasswordScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
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
