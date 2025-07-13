import { useAppTheme } from '@/context/ThemeContext'; // 👈 Import your theme context
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddExpenseScreen() {
  const { colors } = useAppTheme(); // 👈 Use theme colors
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount || !category || !date) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    Alert.alert('Expense added successfully!');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, { color: '#dc2626' }]}>Add Expense</Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Amount (Ksh.) *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          keyboardType="numeric"
          placeholder="e.g. 5000"
          placeholderTextColor={colors.subText}
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          placeholder="e.g. Food, Transport"
          placeholderTextColor={colors.subText}
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Date *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.subText}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.input,
            {
              height: 80,
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
              textAlignVertical: 'top',
            },
          ]}
          placeholder="Optional notes"
          placeholderTextColor={colors.subText}
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: '#dc2626'}]}
        onPress={handleSubmit}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.submitBtnText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitBtn: {
    flexDirection: 'row',
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
