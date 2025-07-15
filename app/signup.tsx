import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

export default function SignUpScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to sign up');
        return;
      }

      const data = await response.json();
      Alert.alert('Success', data.message);
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Network Error', err.message);
      } else {
        Alert.alert('Network Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#26669f', '#822452']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Text style={[styles.title, { color: colors.text }]}>Create An {'\n'} Account</Text>
      <View style={[styles.holder, { backgroundColor: colors.card }]}>
        
        {/* Email Input */}
        <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
                style={[styles.inputLine, { borderBottomColor: colors.border, color: colors.text }]}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholder={isEmailFocused ? '' : 'example@email.com'}
                placeholderTextColor={colors.subText}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
            />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
                style={[styles.inputLine, { borderBottomColor: colors.border, color: colors.text }]}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholder={isPasswordFocused ? '' : '••••••••'}
                placeholderTextColor={colors.subText}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
            />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <TextInput
                style={[styles.inputLine, { borderBottomColor: colors.border, color: colors.text }]}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                placeholder={isConfirmFocused ? '' : '••••••••'}
                placeholderTextColor={colors.subText}
                onFocus={() => setIsConfirmFocused(true)}
                onBlur={() => setIsConfirmFocused(false)}
            />
        </View>

        {/* Sign up Button */}
        <TouchableOpacity onPress={handleSignUp}>
          <View style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={styles.btnText}>Sign Up</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.option}>
          <Text style={[styles.sign, { color: colors.text }]}>Have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={[styles.signText, { color: colors.accent }]}>Sign in</Text>
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
  title: {
    paddingTop: 67,
    paddingLeft: 20,
    fontSize: 36,
    fontWeight: 'bold',
  },
  holder: {
    height: '100%',
    marginTop: 80,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 25,
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
    marginBottom: 1,
  },
  button: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 30,
  },
  btnText: {
    color: '#fff',
    fontSize: 24,
  },
  option: {
    flexDirection: 'row',
    marginTop: 90,
    justifyContent: 'center',
  },
  sign: {
    fontSize: 18,
  },
  signText: {
    fontSize: 18,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
});
