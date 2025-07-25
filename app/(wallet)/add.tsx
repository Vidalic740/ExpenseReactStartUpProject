import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddWalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Wallet</Text>

      <TextInput placeholder="Wallet Name" style={styles.input} />
      <TextInput placeholder="Initial Balance" keyboardType="numeric" style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
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
