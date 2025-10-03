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

// JWT payload interface
interface MyJwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// Category interface
interface Category {
  id: string;
  name: string;
}

export default function AddIncomeScreen() {
  const { colors } = useAppTheme();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadUserAndCategories = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');

        if (!token) {
          Alert.alert('Error', 'Missing authentication token.');
          return;
        }

        // ✅ Decode userId from JWT
        const decoded = jwtDecode<MyJwtPayload>(token);
        if (decoded?.id) {
          setUserId(decoded.id);
        } else {
          console.warn('⚠️ Could not extract userId from token');
        }

        // ✅ Fetch only INCOME categories
        const response = await fetch('http://192.168.2.105:5000/api/categories?type=INCOME', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Fetch categories error:', data);
          Alert.alert('Error', data.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Network Error', 'Could not fetch categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadUserAndCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert('Validation Error', 'Please enter both amount and category.');
      return;
    }

    if (!userId) {
      Alert.alert('User Error', 'User not authenticated. Please log in again.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }

      // ✅ Create transaction
      const res = await fetch('http://192.168.2.105:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          categoryId: category,
          type: 'INCOME',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('✅ Success', 'Income added successfully!');
        setAmount('');
        setCategory('');
      } else {
        console.error('API Error:', data);
        Alert.alert('Error', data.message || 'Failed to add income.');
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      Alert.alert('Network Error', 'Please try again later.');
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
        <View
          style={[
            styles.pickerWrapper,
            { borderColor: colors.border, backgroundColor: colors.input },
          ]}
        >
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={{ color: colors.text }}
            enabled={!loadingCategories}
          >
            <Picker.Item
              label={loadingCategories ? 'Loading categories...' : 'Select a category'}
              value=""
            />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: '#059669' }]}
        onPress={handleSubmit}
        disabled={loadingCategories}
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

