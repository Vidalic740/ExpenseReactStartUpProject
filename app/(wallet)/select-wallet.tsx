import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// 🧩 Define a type for Wallet
interface Wallet {
  id: string;
  name: string;
  type: 'personal' | 'business';
  balance?: number; // optional — add other fields if needed
}

export default function WalletSelection() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const loadWallets = async () => {
      const stored = await SecureStore.getItemAsync('userWallets');
      if (stored) setWallets(JSON.parse(stored));
    };
    loadWallets();
  }, []);

  // ✅ Add wallet type to the parameter
  const openWallet = async (wallet: Wallet) => {
    if (wallet.type === 'personal') {
      router.push('/(tabs)/home');
    } else if (wallet.type === 'business') {
      router.push('/business-wallet');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        Select a Wallet
      </Text>

      {wallets.map((wallet, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: '#eee',
            padding: 16,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onPress={() => openWallet(wallet)}
        >
          <Text style={{ fontSize: 18 }}>{wallet.name}</Text>
          <Text style={{ color: 'gray' }}>{wallet.type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
