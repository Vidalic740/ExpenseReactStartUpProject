import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddWalletScreen() {
  const { colors } = useAppTheme();

  const [walletType, setWalletType] = useState<'business' | 'personal'>('personal');
  const [walletName, setWalletName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: 'Travel Expenses',
      type: 'business',
    },
  ]);

  const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const handleSubmit = () => {
    if (walletName.trim() === '') return;

    const newWallet = {
      id: Date.now(),
      name: walletName.trim(),
      type: walletType,
    };

    setWallets((prev) => [newWallet, ...prev]);
    setWalletName('');
    setWalletType('personal');
    setModalVisible(false);
  };

  const handleWalletOptions = (walletId: number) => {
    setSelectedWallet(walletId);
    setOptionsModalVisible(true);
  };

  const handleDelete = () => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== selectedWallet));
    setOptionsModalVisible(false);
    setSelectedWallet(null);
  };

  const renderWallet = ({ item }: any) => (
    <View
      style={[
        styles.walletItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.walletRow}>
        <View>
          <Text style={[styles.walletName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.walletType, { color: colors.subText }]}>
            {item.type === 'business' ? 'Business Wallet' : 'Personal Wallet'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleWalletOptions(item.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.walletHeader}>
        <Text style={[styles.subHeading, { color: colors.text }]}>Your Wallets</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addIcon}>
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Wallet List */}
      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWallet}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add Wallet Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.heading, { color: colors.text }]}>Add New Wallet</Text>

          {/* Wallet Type Buttons */}
          <View style={styles.walletTypeContainer}>
            {['personal', 'business'].map((type) => {
              const isActive = walletType === type;
              return (
                <Pressable
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      borderColor: isActive ? colors.accent : '#ccc',
                      backgroundColor: isActive ? colors.accent : '#f2f2f2',
                    },
                  ]}
                  onPress={() => setWalletType(type as 'personal' | 'business')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      { color: isActive ? '#fff' : '#333' },
                    ]}
                  >
                    {type === 'personal' ? 'Personal Wallet' : 'Business Wallet'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Wallet Name Input */}
          <TextInput
            placeholder="Wallet Name"
            placeholderTextColor={colors.subText}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={walletName}
            onChangeText={setWalletName}
          />

          {/* Create Wallet Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Create Wallet</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: colors.subText, textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Wallet Options Bottom Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.drawerBackdrop}>
          <View style={[styles.drawer, { backgroundColor: colors.card }]}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>Wallet Options</Text>
            <TouchableOpacity onPress={handleDelete} style={styles.drawerButton}>
              <Text style={[styles.drawerButtonText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOptionsModalVisible(false)}
              style={styles.drawerButton}
            >
              <Text style={[styles.drawerButtonText, { color: colors.subText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  addIcon: {
    paddingHorizontal: 4,
  },
  walletItem: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
  },
  walletType: {
    fontSize: 13,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 30,
  },
  walletTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  drawerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  drawerButton: {
    paddingVertical: 12,
  },
  drawerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
