import { useAppTheme } from '@/context/ThemeContext';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const { colors } = useAppTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Feather name="info" size={24} color={colors.text} style={styles.icon} />
        <Text style={[styles.title, { color: colors.text }]}>About This App</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          This application helps you manage your finances effortlessly. Track your daily expenses, set reminders,
          and gain insights with weekly and monthly summaries.
        </Text>
      </View>

      <View style={styles.section}>
        <Feather name="star" size={22} color={colors.text} style={styles.icon} />
        <Text style={[styles.subtitle, { color: colors.text }]}>Features</Text>
        <Text style={[styles.listItem, { color: colors.text }]}>• Daily and monthly budget tracking</Text>
        <Text style={[styles.listItem, { color: colors.text }]}>• Personalized financial tips</Text>
        <Text style={[styles.listItem, { color: colors.text }]}>• Push notifications and reminders</Text>
        <Text style={[styles.listItem, { color: colors.text }]}>• Secure account and settings</Text>
      </View>

      <View style={styles.section}>
        <Feather name="tool" size={22} color={colors.text} style={styles.icon} />
        <Text style={[styles.subtitle, { color: colors.text }]}>Version</Text>
        <Text style={[styles.versionText, { color: colors.text }]}>
          {Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>

      <View style={styles.section}>
        <MaterialIcons name="developer-mode" size={22} color={colors.text} style={styles.icon} />
        <Text style={[styles.subtitle, { color: colors.text }]}>Developer</Text>
        <Text style={[styles.description, { color: colors.text }]}>Developed by Charles Alfred</Text>
        <Text
          style={[styles.link, { color: colors.text }]}
          onPress={() => Linking.openURL('mailto:support@example.com')}
        >
          support@example.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    marginTop: 4,
    marginLeft: 10,
  },
  versionText: {
    fontSize: 15,
    marginTop: 4,
  },
  link: {
    marginTop: 6,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
