import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  return (
    <ScrollView style={styles.scroll}>
    <View style={styles.main}>
      <View style={styles.profile}>
        <View style={styles.profileImage}>
         
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.nameValue}>Fullname</Text>
          <Text style={styles.nameValue}>Email Address</Text>
        </View>
      </View>

      <Text style={styles.title}>Account</Text>
      <View style={styles.accountCard}>
        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Account number</Text>
          <Text style={styles.value}></Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Password</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel='Tap me!'>
            <Text style={styles.edit}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Phone number</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel='Tap me!'>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Email</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel='Tap me!'>
            <Text style={styles.edit}>Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Registration date</Text>
          <Text style={styles.value}></Text>
        </View>
      </View>

      <Text style={styles.title}>Personal information</Text>
      <View style={styles.accountCard}>
        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Name</Text>
          <Text style={styles.value}></Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Surname</Text>
          <Text style={styles.value}></Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Country</Text>
          <Text style={styles.value}></Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>City</Text>
          <Text style={styles.value}></Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.detail}>Date of Birth</Text>
          <Text style={styles.value}></Text>
        </View>
      </View>

      <View style={styles.profileEdit}>
        <Text style={styles.editProfile}>Edit Profile</Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main:{
    flex: 1,
    padding: 10,
  },

  scroll:{
    flexGrow: 1,
  },

  profile:{
    marginTop: 25,
    height: 'auto',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },

  profileImage:{
    height: 100,
  },

  image:{
    height: 100,
    width: 100,
    borderRadius: 100,
  },

  profileInfo:{
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  nameValue:{
    fontSize: 16,
  },

  title:{
    fontSize: 16,
    marginTop: 20,
  },

  accountCard:{
    height: 'auto',
    backgroundColor: '#dcdcdc',
    borderRadius: 25,
    marginTop: 8,
  },

  accountInfo:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  detail:{
    fontSize: 16,
  },

  edit:{
    fontSize: 15,
    color: 'blue',
    textDecorationLine: 'underline',
  },

  value:{
    fontSize: 17,
  },

  profileEdit:{
    height: 42,
    backgroundColor: '#dcdcdc',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  
  editProfile:{
    fontSize: 18,
  },
});
