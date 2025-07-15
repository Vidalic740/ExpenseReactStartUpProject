import { useAppTheme } from '@/context/ThemeContext';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.push("/(setting)/account")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="user" size={18} color={colors.text} style={styles.icon} />
            <View>
              <Text style={[styles.accountTitle, { color: colors.text }]}>Account</Text>
              <Text style={[styles.accountText, { color: colors.subText || colors.text }]}>
                Request account info, two-step verification
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/notifications")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="bell" size={18} color={colors.text} style={styles.icon} />
            <View>
              <Text style={[styles.accountTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.accountText, { color: colors.subText || colors.text }]}>
                Reminders, messages
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/storage")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="database" size={18} color={colors.text} style={styles.icon} />
            <View>
              <Text style={[styles.accountTitle, { color: colors.text }]}>Storage and data</Text>
              <Text style={[styles.accountText, { color: colors.subText || colors.text }]}>
                Data usage, memory size
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/theme")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="moon" size={18} color={colors.text} style={styles.icon} />
            <View>
              <Text style={[styles.accountTitle, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.accountText, { color: colors.subText || colors.text }]}>
                Color
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/help")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="help-circle" size={18} color={colors.text} style={styles.icon} />
            <View>
              <Text style={[styles.accountTitle, { color: colors.text }]}>Help</Text>
              <Text style={[styles.accountText, { color: colors.subText || colors.text }]}>
                Help center, contact us, privacy policy
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/about")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="info" size={18} color={colors.text} style={styles.icon} />
            <Text style={[styles.accountTitle, { color: colors.text }]}>About</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/invite")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <Feather name="user-plus" size={18} color={colors.text} style={styles.icon} />
            <Text style={[styles.accountTitle, { color: colors.text }]}>Invite a friend</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(setting)/updates")}>
        <View style={styles.settingsInfo}>
          <View style={styles.row}>
            <MaterialIcons name="system-update" size={18} color={colors.text} style={styles.icon} />
            <Text style={[styles.accountTitle, { color: colors.text }]}>App updates</Text>
          </View>
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
    fontSize: 17,
    color: '#000'
  },

  accountText:{
    fontSize: 13,
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 12,
  },
}); 
