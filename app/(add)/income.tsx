import { useAppTheme } from '@/context/ThemeContext'; // 👈 Import ThemeContext
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddIncomeScreen() {
  const { colors } = useAppTheme(); // 👈 Use theme context

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount) {
      Alert.alert('Please enter the amount.');
      return;
    }
    Alert.alert('Income added successfully!');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title]}>Add Income</Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Amount (Ksh.) *</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="e.g. 10000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor={colors.subText}
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
          multiline
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={colors.subText}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: "#059669" }]}
        onPress={handleSubmit}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.submitBtnText}>Add Income</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#059669' },
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
