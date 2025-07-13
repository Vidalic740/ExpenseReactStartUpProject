import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount || !category || !date) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    // Handle form submission logic here
    Alert.alert('Expense added successfully!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Expense</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (Ksh.) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 5000"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food, Transport"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
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
        <Text style={styles.submitBtnText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fdfdfd' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#dc2626' },
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
    backgroundColor: '#dc2626',
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
