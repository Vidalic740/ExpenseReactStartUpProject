import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddWalletScreen() {
  const [walletType, setWalletType] = useState<'business' | 'personal'>('personal');
  const [walletName, setWalletName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = () => {
    // Handle wallet creation here
    console.log({ walletType, walletName, balance });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Wallet</Text>

      {/* Wallet Type Selector */}
      <View style={styles.walletTypeContainer}>
        <Pressable
          style={[
            styles.typeButton,
            walletType === 'personal' && styles.activeTypeButton,
          ]}
          onPress={() => setWalletType('personal')}
        >
          <Text
            style={[
              styles.typeButtonText,
              walletType === 'personal' && styles.activeTypeButtonText,
            ]}
          >
            Personal Wallet
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            walletType === 'business' && styles.activeTypeButton,
          ]}
          onPress={() => setWalletType('business')}
        >
          <Text
            style={[
              styles.typeButtonText,
              walletType === 'business' && styles.activeTypeButtonText,
            ]}
          >
            Business Wallet
          </Text>
        </Pressable>
      </View>

      {/* Wallet Details */}
      <TextInput
        placeholder="Wallet Name"
        style={styles.input}
        value={walletName}
        onChangeText={setWalletName}
      />
      <TextInput
        placeholder="Initial Balance"
        keyboardType="numeric"
        style={styles.input}
        value={balance}
        onChangeText={setBalance}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },

  walletTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  activeTypeButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#fff',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
