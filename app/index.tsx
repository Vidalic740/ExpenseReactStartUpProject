import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
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
          autoCapitalize='none'/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.inputLine}
          secureTextEntry
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
          onPress={() => router.push("/home")}>
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
