import { useAppTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingScreen() {

  const { colors, theme } = useAppTheme();
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#fdfdfd';
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';

  return (
    <View style={[styles.main, { backgroundColor: colors.background  }]}>
      <TouchableOpacity
      accessible={true}
      accessibilityLabel="Tap me!"
      onPress={()=> router.push("/(setting)/account")}>
        <View style={styles.settingsInfo}>
          <Text style={[styles.accountTitle, { color: textColor }]}>Account</Text>
          <Text style={[styles.accountText, { color: textColor }]}>Request account info, two-step verification</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/notifications")}>
        <View style={styles.settingsInfo}>
          <Text style={[styles.accountTitle, { color: textColor }]}>Notifications</Text>
          <Text style={[styles.accountText, { color: textColor }]}>Reminders, messages</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/storage")}>
        <View style={styles.settingsInfo}>
          <Text style={[styles.accountTitle, { color: textColor }]}>Storage and data</Text>
          <Text style={[styles.accountText, { color: textColor }]}>Data usage, memory size</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/theme")}>
        <View style={styles.settingsInfo}>
          <Text style={[styles.accountTitle, { color: textColor }]}>Theme</Text>
          <Text style={[styles.accountText, { color: textColor }]}>Color</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/help")}>
        <View style={styles.settingsInfo}>
          <Text style={[styles.accountTitle, { color: textColor }]}>Help</Text>
          <Text style={[styles.accountText, { color: textColor }]}>Help center, contact us, privacy policy</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/about")}>
        <View style={styles.settingsInfo}>
        <Text style={[styles.accountTitle, { color: textColor }]}>About</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/invite")}>
        <View style={styles.settingsInfo}>
        <Text style={[styles.accountTitle, { color: textColor }]}>Invite a friend</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Tap me!"
        onPress={()=> router.push("/(setting)/updates")}>
        <View style={styles.settingsInfo}>
        <Text style={[styles.accountTitle, { color: textColor }]}>App updates</Text>
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
    backgroundColor: '#fdfdfd',
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
