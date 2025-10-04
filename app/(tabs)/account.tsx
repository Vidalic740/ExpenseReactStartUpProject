import { useAppTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserProfile {
  firstname?: string;
  surname?: string;
  country?: string;
  city?: string;
  dob?: string;
  phoneNumber?: string;
  [key: string]: string | undefined;
}

interface UserData {
  id?: string;               // Account number
  email?: string;
  createdAt?: string;        // Registration date
  profile?: UserProfile;
  [key: string]: any;
}

export default function AccountScreen() {
  const router = useRouter();
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#1e293b' : '#fdfdfd';
  const cardColor = isDark ? '#334155' : '#dcdcdc';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('No auth token found');

      const response = await fetch('http://192.168.2.105:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUserData(data || null);
    } catch (error: any) {
      console.error('Fetch user failed:', error.message);
      setUserData(null); // show nothing if fetch fails
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);


  if (loading) {
    return (
      <View style={[styles.main, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color={colors.accent || '#000'} />
      </View>
    );
  }

  const mapLabelToKey = (label: string): string => {
    switch (label) {
      case 'Firstname':
        return 'firstname';
      case 'Surname':
        return 'surname';
      case 'Country':
        return 'country';
      case 'City':
        return 'city';
      case 'Date of Birth':
        return 'dob';
      default:
        return label.toLowerCase().replace(/ /g, '');
    }
  };

  const profile = userData?.profile;

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]}>
      <View style={styles.main}>
        <View style={styles.profile}>
          <View
            style={[
              styles.profileImage,
              { borderColor: isDark ? '#facc15' : '#826529', backgroundColor: backgroundColor },
            ]}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.nameValue, { color: textColor }]}>
              {profile?.firstname && profile?.surname
                ? `${profile.firstname} ${profile.surname}`
                : 'Fullname'}
            </Text>
            <Text style={[styles.nameValue, { color: textColor }]}>
              {userData?.email ?? 'Email Address'}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: textColor }]}>Account Details</Text>
        <View style={[styles.accountCard, { backgroundColor: colors.card }]}>
          {[
            { label: 'Account number', value: userData?.id ?? '' },
            { label: 'Phone number', value: profile?.phoneNumber ?? '', action: 'Edit' },
            { label: 'Email', value: userData?.email ?? '' },
            {
              label: 'Registration date',
              value: userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : '',
            },
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
          {['Firstname', 'Surname', 'Country', 'City', 'Date of Birth'].map((label) => {
            const key = mapLabelToKey(label);
            return (
              <View style={styles.accountInfo} key={label}>
                <Text style={[styles.detail, { color: textColor }]}>{label}</Text>
                <Text style={[styles.value, { color: textColor }]}>
                  {profile?.[key] ?? ''}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.profileEdit, { backgroundColor: cardColor }]}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text style={[styles.editProfile, { color: textColor }]}>Edit Profile</Text>
          </TouchableOpacity>
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
