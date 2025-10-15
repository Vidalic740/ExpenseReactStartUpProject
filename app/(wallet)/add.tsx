import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../context/ThemeContext";

export default function WalletScreen() {
  const { colors } = useAppTheme();

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletType, setNewWalletType] = useState("personal");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://192.168.2.105:5000/api/wallets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && Array.isArray(data.wallets)) {
        setWallets(data.wallets);
      } else {
        Alert.alert("Error", data?.message || "Failed to fetch wallets");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Could not fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    if (!newWalletName) {
      Alert.alert("Validation Error", "Wallet name is required");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return Alert.alert("Session Expired", "Please login again.");

      const response = await fetch("http://192.168.2.105:5000/api/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newWalletName,
          type: newWalletType,
          currency: "USD",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setWallets((prev) => [data.wallet, ...prev]);
        setNewWalletName("");
        setModalVisible(false);
        Alert.alert("Success", "Wallet created successfully!");
      } else {
        Alert.alert("Error", data?.message || "Failed to create wallet");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Could not create wallet");
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.subText }]}>
          Loading your wallets...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Wallets</Text>

      {/* Create Wallet Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent, marginBottom: 20 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: colors.surface }]}>+ Create Wallet</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.modalView, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Wallet</Text>

            <TextInput
              placeholder="Wallet Name"
              placeholderTextColor={colors.subText}
              style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
              value={newWalletName}
              onChangeText={setNewWalletName}
            />

            <Text style={[styles.modalLabel, { color: colors.text }]}>Select Wallet Type:</Text>
            <View style={styles.typeButtons}>
              {["personal", "business"].map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeButton,
                    { borderColor: colors.accent },
                    newWalletType === type && { backgroundColor: colors.accent },
                  ]}
                  onPress={() => setNewWalletType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newWalletType === type
                        ? { color: colors.surface }
                        : { color: colors.accent },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.accent }]}
                onPress={handleCreateWallet}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wallet Cards */}
      {wallets.length === 0 ? (
        <Text style={[styles.noWalletsText, { color: colors.subText }]}>
          No wallets found.
        </Text>
      ) : (
        <FlatList
          data={wallets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#141E30", "#243B55"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >

              {/* Wallet Details */}
              <View style={styles.cardContent}>
                <Text style={styles.walletName}>{item.name}</Text>
                <Text style={styles.walletType}>{item.type.toUpperCase()}</Text>
                <Text style={styles.walletBalance}>
                  {item.currency} {item.balance?.toLocaleString() ?? "0.00"}
                </Text>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12 },

  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: { fontWeight: "700", fontSize: 16 },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalView: { borderRadius: 12, padding: 20, borderWidth: 1 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15 },
  modalLabel: { fontSize: 16, marginBottom: 8 },
  typeButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  typeButton: { flex: 1, padding: 12, borderWidth: 1, borderRadius: 10, marginHorizontal: 5, alignItems: "center" },
  typeButtonText: { fontWeight: "600", fontSize: 16 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  noWalletsText: { fontSize: 16 },

  // 💳 Card Design
  cardGradient: {
    height: 200,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
  },
  walletName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  walletType: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 20,
    marginTop: 5,
  },
  walletBalance: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 12,
  },
});

