import { useAppTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RequestAccountInfoScreen() {
  const { colors } = useAppTheme();

  const handleRequest = () => {
    // You can trigger an API call here
    alert("Account information request sent!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Request Account Info</Text>

      <Text style={[styles.description, { color: colors.text }]}>
        You can request a copy of your account data. It will be sent to your registered email address.
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleRequest}>
        <Text style={styles.buttonText}>Request Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 14, marginBottom: 24 },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
