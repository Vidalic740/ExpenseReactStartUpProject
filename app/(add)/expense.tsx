import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function AddExpenseScreen() {
  const { colors } = useAppTheme();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  type Category = {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadUserIdAndCategories = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedUserId = await SecureStore.getItemAsync('userId');

        if (storedUserId) {
          setUserId(storedUserId);
        }

        // ✅ Use the endpoint that returns only EXPENSE categories
        const response = await fetch('http://192.168.0.109:3000/api/categories/expense', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setCategories(data);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Network Error', 'Could not fetch categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadUserIdAndCategories();
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!amount || !category) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be a positive number.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');

      const response = await fetch('http://192.168.0.109:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          amount: numericAmount,
          userId,
          categoryId: category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Expense added successfully!');
        setAmount('');
        setCategory('');
      } else {
        console.error('API error:', data);
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: '#dc2626' }]}>Add Expense</Text>

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
            keyboardType="numeric"
            placeholder="e.g. 5000"
            placeholderTextColor={colors.subText}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#dc2626" style={{ padding: 12 }} />
            ) : (
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={{ color: colors.text }}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((item) => (
                  <Picker.Item key={item.id} label={item.name} value={item.id} />
                ))}
              </Picker>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: '#dc2626' }]}
          onPress={handleSubmit}
          disabled={loadingCategories}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
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
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
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
