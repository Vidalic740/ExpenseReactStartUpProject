import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Linking, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InviteScreen() {
  const { colors } = useAppTheme();

  const message = "Hey! 👋 Check out this amazing app I'm using. Download it now: https://yourapp.link";

  const inviteViaWhatsApp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    canOpen ? Linking.openURL(url) : Alert.alert('WhatsApp not installed');
  };


  const inviteViaSMS = async () => {
    try {
      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the message');
    }
  };

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Invite your friends to try the app!
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#25D366' }]}
        onPress={inviteViaWhatsApp}
      >
        <Ionicons name="logo-whatsapp" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Invite via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007AFF' }]}
        onPress={inviteViaSMS}
      >
        <Ionicons name="share-social-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Share Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  icon: {
    marginRight: 4,
  },
});
