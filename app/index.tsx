import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAppTheme } from '../context/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

// --- Use Web OAuth Client ID for Expo Go ---
const GOOGLE_CLIENT_ID_WEB = "904744664698-qt690g4md85rvvgirfn7ue3715u1q449.apps.googleusercontent.com";

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // --- Google OAuth request (Implicit Flow) ---
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID_WEB,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ['profile', 'email'],
      responseType: 'token', // Implicit flow
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      fetchGoogleUser(access_token);
    }
  }, [response]);

  const fetchGoogleUser = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setUserInfo(user);
      await SecureStore.setItemAsync('userToken', token);
      router.push('/home');
    } catch (err) {
      console.error('Google user fetch error:', err);
      Alert.alert('Google Sign-In Error', 'Failed to fetch user info.');
    }
  };

  // --- Email/Password Login ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.2.105:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await SecureStore.setItemAsync('userToken', data.token);
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
      <Text style={[styles.header, { color: '#ffefff' }]}>
        Hello!{'\n'}Sign in
      </Text>

      <View style={[styles.body, { backgroundColor: colors.card }]}>
        {/* Email */}
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

        {/* Password */}
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

        {/* Email Login Button */}
        <TouchableOpacity onPress={handleLogin}>
          <View style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={styles.btnText}>Login</Text>
          </View>
        </TouchableOpacity>

        {/* Sign in with section */}
        <View style={styles.signInWithSection}>
          <Text style={[styles.signInWithText, { color: colors.text }]}>Or sign in with</Text>
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync({ useProxy: true })}
          style={[styles.googleButton, { borderColor: colors.accent }]}
        >
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={styles.googleIcon}
          />
          <Text style={[styles.googleText, { color: colors.accent }]}>Google</Text>
        </TouchableOpacity>

        {/* Signup Option */}
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
  container: { flex: 1 },
  header: { paddingTop: 67, paddingLeft: 20, fontSize: 36, fontWeight: 'bold' },
  body: { flex: 1, marginTop: 80, borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 20 },
  inputWrapper: { marginTop: 30 },
  label: { fontSize: 18, marginBottom: 1 },
  inputLine: { borderBottomWidth: 1, height: 30, fontSize: 18, paddingVertical: 5, marginTop: 4 },
  reset: { fontSize: 16, marginTop: 20, alignSelf: 'flex-end' },
  button: { height: 42, justifyContent: 'center', alignItems: 'center', marginTop: 30, borderRadius: 30 },
  btnText: { fontSize: 20, color: 'white' },
  signInWithSection: { marginTop: 25, marginBottom: 10, alignItems: 'center' },
  signInWithText: { fontSize: 16, fontWeight: '500' },
  googleButton: { flexDirection: 'row', height: 42, borderWidth: 1, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 18 },
  option: { flexDirection: 'row', justifyContent: 'center' },
  sign: { fontSize: 16 },
  signText: { fontSize: 16, marginLeft: 10, textDecorationLine: 'underline' },
});

