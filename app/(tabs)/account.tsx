import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#1e293b' : '#fdfdfd';
  const cardColor = isDark ? '#334155' : '#dcdcdc';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background  }]}>
      <View style={styles.main}>
        <View style={styles.profile}>
          <View style={[styles.profileImage, { borderColor: isDark ? '#facc15' : '#826529', backgroundColor: backgroundColor }]} />
          <View style={styles.profileInfo}>
            <Text style={[styles.nameValue, { color: textColor }]}>Fullname</Text>
            <Text style={[styles.nameValue, { color: textColor }]}>Email Address</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: textColor }]}>Account</Text>
        <View style={[styles.accountCard, { backgroundColor: colors.card }]}>
          {[
            { label: 'Account number', value: '' },
            { label: 'Password', action: 'Change' },
            { label: 'Phone number', action: 'Edit' },
            { label: 'Email', action: 'Link' },
            { label: 'Registration date', value: '' },
          ].map(({ label, value, action }) => (
            <View style={styles.accountInfo} key={label}>
              <Text style={[styles.detail, { color: textColor }]}>{label}</Text>
              {action ? (
                <TouchableOpacity accessible accessibilityLabel="Tap me!">
                  <Text style={[styles.edit, { color: isDark ? '#38bdf8' : 'blue' }]}>{action}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.value, { color: textColor }]}>{value}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.title, { color: textColor }]}>Personal information</Text>
        <View style={[styles.accountCard, { backgroundColor: colors.card }]}>
          {['Name', 'Surname', 'Country', 'City', 'Date of Birth'].map((label) => (
            <View style={styles.accountInfo} key={label}>
              <Text style={[styles.detail, { color: textColor }]}>{label}</Text>
              <Text style={[styles.value, { color: textColor }]}></Text>
            </View>
          ))}
        </View>

        <View style={[styles.profileEdit, { backgroundColor: cardColor }]}>
          <Text style={[styles.editProfile, { color: textColor }]}>Edit Profile</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 10,
  },
  scroll: {
    flexGrow: 1,
  },
  profile: {
    marginTop: 25,
    height: 'auto',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: 2,
  },
  profileInfo: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  nameValue: {
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    marginTop: 20,
  },
  accountCard: {
    height: 'auto',
    borderRadius: 15,
    marginTop: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  detail: {
    fontSize: 16,
  },
  edit: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  value: {
    fontSize: 17,
  },
  profileEdit: {
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  editProfile: {
    fontSize: 18,
  },
});
