import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddIncomeScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount) {
      Alert.alert('Please enter the amount.');
      return;
    }
    // Handle form submission logic here
    Alert.alert('Income added successfully!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Income</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (Ksh.) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 10000"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Optional notes"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.submitBtnText}>Add Income</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fdfdfd' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#059669' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 16, marginBottom: 6, color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 30,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
});
