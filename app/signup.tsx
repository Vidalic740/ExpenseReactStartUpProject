import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen(){
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch('https://a47b-41-90-69-96.ngrok-free.app/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                // Handle HTTP errors (non-2xx responses)
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
    

    return(
        <LinearGradient
            colors={['#26669f', '#822452']}
            start={{x:1,y:0}}
            end={{x:0,y:0}}
            style={styles.container}>
            <Text style={styles.title}>Create An {'\n'} Account</Text>
            <View style={styles.holder}>

                {/*Email Input*/}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.inputLine}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'/>
                </View>

                {/*Password Input*/}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.inputLine}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'/>
                </View>

                {/*Confirm Password Input*/}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput style={styles.inputLine}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    autoCapitalize='none'/>
                </View>

                <TouchableOpacity accessible={true}
                    accessibilityLabel='Tap me!'
                    onPress={handleSignUp}>
                    <View style={styles.button}>
                        <Text style={styles.btnText}>Sign Up</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.option}>
                    <Text style={styles.sign}>Have an account?</Text>
                    <TouchableOpacity accessible={true}
                        accessibilityLabel='Tap me!'
                        onPress={() =>router.push("/")}>
                        <View>
                            <Text style={styles.signText}>Sign in</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles =StyleSheet.create({
    container:{
        flex: 1,
    },

    title:{
        paddingTop: 67,
        paddingLeft: 20,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffefff',
    },

    holder:{
        height: '100%',
        marginTop: 80,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
    },

    inputWrapper:{
        marginTop: 25,
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
        marginBottom: 1,
    },

    button:{
        backgroundColor: '#822452',
        height: 42,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 30,
        marginTop: 30,
    },

    btnText:{
        color: '#ffefff',
        fontSize: 24,
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