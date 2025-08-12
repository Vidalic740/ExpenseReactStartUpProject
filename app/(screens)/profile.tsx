import { useAppTheme } from '@/context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditProfileScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: '',
    surname: '',
    country: '',
    city: '',
    dob: '',
    phoneNumber: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  // Format Date object to YYYY-MM-DD string
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Date picker change handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep open on iOS
    if (selectedDate) {
      handleChange('dob', formatDate(selectedDate));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('No auth token found');

      const response = await fetch('http://192.168.0.110:3000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent || '#000'} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {[
        { label: 'Firstname', value: userData.firstname, key: 'firstname' },
        { label: 'Surname', value: userData.surname, key: 'surname' },
        { label: 'Country', value: userData.country, key: 'country' },
        { label: 'City', value: userData.city, key: 'city' },
        // Date of Birth replaced with custom input below
        { label: 'Phone Number', value: userData.phoneNumber, key: 'phoneNumber' },
      ].map(({ label, value, key }) => {
        // Skip DOB here since we handle it separately
        if (key === 'dob') return null;
        return (
          <View key={key} style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>{label}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: isDark ? '#64748b' : '#ccc', color: isDark ? '#f1f5f9' : '#000' },
              ]}
              value={value}
              placeholder=""
              onChangeText={(text) => handleChange(key, text)}
              keyboardType={key === 'phoneNumber' ? 'phone-pad' : 'default'}
              autoCapitalize="words"
            />
          </View>
        );
      })}

      {/* Date of Birth field with DatePicker */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Date of Birth</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            { borderColor: isDark ? '#64748b' : '#ccc', justifyContent: 'center' },
          ]}
        >
          <Text style={{ color: userData.dob ? (isDark ? '#f1f5f9' : '#000') : '#888' }}>
            {userData.dob || 'Select date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={userData.dob ? new Date(userData.dob) : new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
