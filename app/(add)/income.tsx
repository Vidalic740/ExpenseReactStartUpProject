import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Define interface for JWT
interface MyJwtPayload {
  userId: string;
}

// Define interface for Category
interface Category {
  id: string;
  name: string;
}

export default function AddIncomeScreen() {
  const { colors } = useAppTheme();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('http://192.168.0.110:3000/api/categories/income');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        Alert.alert('Error', 'Could not load categories');
      }
    };

    loadUser();
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert('Validation Error', 'Please enter both amount and category.');
      return;
    }

    if (!userId) {
      Alert.alert('User Error', 'User not authenticated.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const res = await fetch('http://192.168.0.110:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          userId,
          categoryId: category,
          type: 'INCOME',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Income added successfully!');
        setAmount('');
        setCategory('');
      } else {
        Alert.alert('Error', data.message || 'Failed to add income');
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      Alert.alert('Network error', 'Please try again later.');
    }
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
        <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
        <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: colors.input }]}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={{ color: colors.text }}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
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
