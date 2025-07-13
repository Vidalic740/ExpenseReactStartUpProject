import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function HomeScreen() {

  const { theme } = useAppTheme();
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#fdfdfd';
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const handdleLogin = async() => {
    if( !email || !password){
      Alert.alert('Validation Error', 'Please enter bothemail andpassword.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to home screen
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
    colors={['#26669f','#822452']}
    start={{x:1,y:0}}
    end={{x:0,y:0}}
    style={styles.container}>
      <Text style={styles.header}>Hello!{'\n'}Sign in</Text>
      <View style={styles.body}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.inputLine}
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
            onChangeText={setEmail}/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.inputLine}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize='none'/>
        </View>

        <TouchableOpacity accessible={true}
          accessibilityLabel='Tap me!'>
          <View>
            <Text style={styles.reset}>Forgot Password</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity accessible={true}
          accessibilityLabel='Tap me!'
          onPress={()=> router.push("/home")}>
          <View style={styles.button}>
            <Text style={styles.btnText}>Login</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.option}>
          <Text style={styles.sign}>Don't have an account?</Text>
          <TouchableOpacity accessible={true}
            accessibilityLabel='Tap me!'
            onPress={() => router.push("/signup")}>
            <View>
              <Text style={styles.signText}>Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
 container:{
  flex: 1,
 },

 header:{
  paddingTop: 67,
  paddingLeft: 20,
  fontSize: 36,
  fontWeight: 'bold',
  color: '#ffefff',
 },

 body:{
  height: '100%',
  marginTop: 80,
  backgroundColor: 'white',
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingHorizontal: 20,
 },

 reset:{
  fontSize: 18,
  marginTop: 20,
  alignSelf: 'flex-end',
  color: 'blue'
 },

 inputWrapper:{
  marginTop: 30,
 },

 label:{
  fontSize: 18,
  color: '#333',
  marginBottom: 1,
 },

 inputLine:{
  borderBottomWidth: 1,
  borderBottomColor: '#000',
  height: 30,
  fontSize: 18,
  paddingVertical: 5,
  marginTop: 4,
 },

 button:{
  backgroundColor: '#822452',
  height: 42,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 30,
  borderRadius: 30,
 },

 btnText:{
  fontSize: 24,
  color: 'white',
 },

 option:{
  flexDirection: 'row',
  marginTop: 90,
  justifyContent: 'center',
 },

 sign:{
  fontSize: 18,
 },

 signText:{
  fontSize: 18,
  color: 'blue',
  marginLeft: 10,
  textDecorationLine: 'underline',
 },
});
