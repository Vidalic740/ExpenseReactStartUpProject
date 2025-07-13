import { useAppTheme } from '@/context/ThemeContext'; // 👈 Importing custom theme hook
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ThemeScreen() {
  const { theme, toggleTheme } = useAppTheme(); // 🔄 Use global theme context
  const isDarkMode = theme === 'dark';

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [themeColor, setThemeColor] = useState('#059669'); // Local state for accent

  const fontSizes = {
    small: 14,
    medium: 18,
    large: 22,
  };

  const themeColors = [
    { name: 'Green', color: '#059669' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Purple', color: '#7c3aed' },
  ];

  return (
    <View style={[styles.main, { backgroundColor: isDarkMode ? '#1e293b' : '#fdfdfd' }]}>
      <Text style={[styles.heading, { color: isDarkMode ? '#f1f5f9' : '#1e293b' }]}>Appearance Settings</Text>

      {/* Theme Toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: isDarkMode ? '#f1f5f9' : '#1e293b' }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? '#facc15' : '#94a3b8'}
          trackColor={{ false: '#cbd5e1', true: '#334155' }}
        />
      </View>

      {/* Font Size */}
      <Text style={[styles.label, { color: isDarkMode ? '#f1f5f9' : '#1e293b', marginBottom: 6 }]}>Font Size</Text>
      <View style={styles.optionsRow}>
        {['small', 'medium', 'large'].map(size => (
          <TouchableOpacity
            key={size}
            onPress={() => setFontSize(size as any)}
            style={[
              styles.optionBtn,
              fontSize === size && { backgroundColor: themeColor },
            ]}
          >
            <Text style={{ color: fontSize === size ? '#fff' : '#1e293b' }}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Theme Color */}
      <Text style={[styles.label, { color: isDarkMode ? '#f1f5f9' : '#1e293b', marginTop: 16 }]}>Theme Color</Text>
      <View style={styles.optionsRow}>
        {themeColors.map(({ name, color }) => (
          <TouchableOpacity
            key={name}
            onPress={() => setThemeColor(color)}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              themeColor === color && styles.selectedColorBorder,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  selectedColorBorder: {
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  previewCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
});
