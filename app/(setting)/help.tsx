import { useAppTheme } from '@/context/ThemeContext';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
  const { colors } = useAppTheme();

  const handleContactUs = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleHelpCenter = () => {
    Linking.openURL('https://example.com/help-center');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>We're here to help</Text>

      {/* Help Center */}
      <TouchableOpacity style={styles.option} onPress={handleHelpCenter}>
        <View style={styles.row}>
          <Feather name="book-open" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Help Center</Text>
        </View>
        <Text style={[styles.description, { color: colors.text }]}>
          Browse FAQs, tutorials, and guides for using the app.
        </Text>
      </TouchableOpacity>

      {/* Contact Us */}
      <TouchableOpacity style={styles.option} onPress={handleContactUs}>
        <View style={styles.row}>
          <Feather name="mail" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Contact Us</Text>
        </View>
        <Text style={[styles.description, { color: colors.text }]}>
          Reach out to our support team with questions or issues.
        </Text>
      </TouchableOpacity>

      {/* Privacy Policy */}
      <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
        <View style={styles.row}>
          <MaterialIcons name="privacy-tip" size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>Privacy Policy</Text>
        </View>
        <Text style={[styles.description, { color: colors.text }]}>
          Learn about how we handle your data and privacy.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  option: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    opacity: 0.75,
    marginLeft: 34, // align under the label
  },
});
