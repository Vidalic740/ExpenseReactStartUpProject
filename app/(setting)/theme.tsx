import { useAppTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ThemeScreen() {
  const {
    theme,
    toggleTheme,
    colors,
    accentColor,
    updateAccentColor,
  } = useAppTheme();

  const isDarkMode = theme === 'dark';
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const fontSizes = {
    small: 11,
    medium: 18,
    large: 22,
  };

  const themeColors = [
    { name: 'Green', color: '#059669' },       // Emerald
    { name: 'Blue', color: '#2563eb' },        // Royal Blue
    { name: 'Purple', color: '#7c3aed' },      // Violet
    { name: 'Red', color: '#dc2626' },         // Crimson Red
    { name: 'Orange', color: '#f97316' },      // Vivid Orange
    { name: 'Teal', color: '#14b8a6' },        // Cool Teal
    { name: 'Pink', color: '#ec4899' },        // Hot Pink
    { name: 'Yellow', color: '#eab308' },      // Golden Yellow
    { name: 'Indigo', color: '#4f46e5' },      // Indigo Blue
    { name: 'Cyan', color: '#06b6d4' },        // Bright Cyan
  ];

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Appearance Settings</Text>

      {/* Theme Toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? '#facc15' : '#94a3b8'}
          trackColor={{ false: '#cbd5e1', true: '#334155' }}
        />
      </View>

      {/* Font Size Selector */}
      <Text style={[styles.label, { color: colors.text, marginBottom: 6 }]}>Font Size</Text>
      <View style={styles.optionsRow}>
        {(['small', 'medium', 'large'] as const).map(size => (
          <TouchableOpacity
            key={size}
            onPress={() => setFontSize(size)}
            style={[
              styles.optionBtn,
              fontSize === size && { backgroundColor: accentColor },
            ]}
          >
            <Text style={{ color: fontSize === size ? '#fff' : '#1e293b' }}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Theme Color Picker */}
      <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Theme Color</Text>
      <View style={styles.optionsRow}>
        {themeColors.map(({ name, color }) => (
          <TouchableOpacity
            key={name}
            onPress={() => updateAccentColor(color)}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              accentColor === color && styles.selectedColorBorder,
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
    padding: 18,
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
    flexWrap: 'wrap',
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
    marginRight: 10,
    marginBottom: 12,
  },
  selectedColorBorder: {
    borderWidth: 2,
    borderColor: '#1e293b',
  },
});
