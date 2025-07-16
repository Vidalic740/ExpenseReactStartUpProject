
import { useAppTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      {/* Request Account Info */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(screens)/request')}>
        <View style={styles.row}>
          <Feather name="info" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Request Account Info</Text>
        </View>
      </TouchableOpacity>

      {/* Two-Factor Verification */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(screens)/verification')}>
        <View style={styles.row}>
          <Feather name="shield" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Two-Factor Verification Setup</Text>
        </View>
      </TouchableOpacity>

      {/* Security Questions */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(screens)/security')}>
        <View style={styles.row}>
          <Feather name="lock" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Security Questions</Text>
        </View>
      </TouchableOpacity>

      {/* Change Password */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(screens)/password')}>
        <View style={styles.row}>
          <Feather name="key" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Change Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 13,
  },
  label: {
    fontSize: 18,
  },
});
