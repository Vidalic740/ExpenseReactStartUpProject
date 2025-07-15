import { useAppTheme } from '@/context/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function UpdateScreen() {
  const { colors } = useAppTheme();
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const rotate = useSharedValue(0);

  const handleCheckUpdates = async () => {
    setChecking(true);
    setStatus(null);
    rotate.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setStatus('Update available. Downloading...');
        await Updates.fetchUpdateAsync();
        setStatus('Update downloaded. Restarting app...');
        await Updates.reloadAsync();
      } else {
        setStatus('Your app is up to date!');
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Update Error', 'Failed to check for updates.');
      setStatus('Unable to check for updates.');
    } finally {
      rotate.value = 0;
      setChecking(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Animated.View style={animatedStyle}>
          <AntDesign name="upcircle" size={48} color={colors.accent} />
        </Animated.View>

        <Text style={[styles.title, { color: colors.text }]}>App Updates</Text>
        <Text style={[styles.subText, { color: colors.subText }]}>
          Keep your app updated for best performance and features.
        </Text>

        <Text style={[styles.version, { color: colors.subText }]}>
          Current version: {appVersion}
        </Text>

        {checking ? (
          <ActivityIndicator
            size="large"
            color={colors.accent}
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {status && (
              <Text style={[styles.statusText, { color: colors.accent }]}>
                {status}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleCheckUpdates}
              style={[styles.button, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.btnText}>Check for Updates</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  version: {
    fontSize: 14,
    marginTop: 12,
    fontStyle: 'italic',
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
