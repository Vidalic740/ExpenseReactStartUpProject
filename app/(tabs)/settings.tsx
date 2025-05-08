import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingScreen() {
  return (
    <View style={styles.main}>
      <TouchableOpacity
      accessible={true}
      accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>Account</Text>
          <Text style={styles.accountText}>Request account info, two-step verification</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>Notifications</Text>
          <Text style={styles.accountText}>Reminders, messages</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>Storage and data</Text>
          <Text style={styles.accountText}>Data usage, memory size</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>App language</Text>
          <Text style={styles.accountText}>English(device's language)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>Help</Text>
          <Text style={styles.accountText}>Help center, contact us, privacy policy</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>About</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>Invite a friend</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!">
        <View style={styles.settingsInfo}>
          <Text style={styles.accountTitle}>App updates</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main:{
    flex: 1,
    padding: 16,
    paddingTop: 25,
  },

  settingsInfo:{
    height: 52,
    marginTop: 4,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  accountTitle:{
    fontSize: 18,
    color: '#000'
  },

  accountText:{
    fontSize: 14,
    marginTop: 5,
  },
});
