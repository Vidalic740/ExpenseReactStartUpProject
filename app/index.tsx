import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme, colors } = useAppTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.2.105:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await SecureStore.setItemAsync('userToken', data.token);
        console.log('Saved token:', await SecureStore.getItemAsync('userToken'));

        // Redirect on successful login
        router.push('/home');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network request failed.');
    }
  };

  return (
    <LinearGradient
      colors={['#26669f', '#822452']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Text style={[styles.header, { color: '#ffefff' }]}>Hello!{'\n'}Sign in</Text>
      <View style={[styles.body, { backgroundColor: colors.card }]}>
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.inputLine, { borderBottomColor: colors.border, color: colors.text }]}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder={emailFocused ? '' : 'example@email.com'}
            placeholderTextColor={colors.subText}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[styles.inputLine, { borderBottomColor: colors.border, color: colors.text }]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholder={passwordFocused ? '' : '••••••••'}
            placeholderTextColor={colors.subText}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>

        <TouchableOpacity>
          <Text style={[styles.reset, { color: colors.accent }]}>Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin}>
          <View style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={styles.btnText}>Login</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.option}>
          <Text style={[styles.sign, { color: colors.text }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={[styles.signText, { color: colors.accent }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 67,
    paddingLeft: 20,
    fontSize: 36,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 1,
  },
  inputLine: {
    borderBottomWidth: 1,
    height: 30,
    fontSize: 18,
    paddingVertical: 5,
    marginTop: 4,
  },
  reset: {
    fontSize: 16,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  button: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 20,
    color: 'white',
  },
  option: {
    flexDirection: 'row',
    marginTop: 90,
    justifyContent: 'center',
  },
  sign: {
    fontSize: 16,
  },
  signText: {
    fontSize: 16,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
});
