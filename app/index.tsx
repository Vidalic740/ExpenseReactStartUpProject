import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Image,
  Modal,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useAppTheme } from "../context/ThemeContext";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID_WEB =
  "904744664698-qt690g4md85rvvgirfn7ue3715u1q449.apps.googleusercontent.com";

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Wallet Modal State + Slide Animation
  const [showWalletModal, setShowWalletModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get("screen").height)).current;

  const openWalletModal = () => {
    setShowWalletModal(true);
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("screen").height * 0.4, // 60% visible
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const closeWalletModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("screen").height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowWalletModal(false));
  };

  // Load stored push token
  useEffect(() => {
    const loadPushToken = async () => {
      const token = await SecureStore.getItemAsync("expoPushToken");
      if (token) setExpoPushToken(token);
    };
    loadPushToken();
  }, []);

  // Google OAuth stays unchanged
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID_WEB,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ["profile", "email"],
      responseType: "token",
    },
    { authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth" }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      fetchGoogleUser(access_token);
    }
  }, [response]);

  const fetchGoogleUser = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      await SecureStore.setItemAsync("userToken", token);
      router.push("/home"); // unchanged
    } catch {
      Alert.alert("Google Sign-In Error", "Failed to fetch user info.");
    }
  };

  // Email/Password Login → Open Modal
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("http://10.72.146.245:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          pushToken: expoPushToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        await SecureStore.setItemAsync("userToken", data.token);
        openWalletModal(); // show wallet selection modal
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (err) {
      Alert.alert("Network Error", "Could not connect to server.");
    }
  };

  return (
    <LinearGradient
      colors={["#26669f", "#822452"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Text style={[styles.header, { color: "#ffefff" }]}>
        Hello!{"\n"}Sign in
      </Text>

      <View style={[styles.body, { backgroundColor: colors.card }]}>
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[
              styles.inputLine,
              { borderBottomColor: colors.border, color: colors.text },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder={!emailFocused ? "example@email.com" : ""}
            placeholderTextColor={colors.subText}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[
              styles.inputLine,
              { borderBottomColor: colors.border, color: colors.text },
            ]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder={!passwordFocused ? "••••••••" : ""}
            placeholderTextColor={colors.subText}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>

        <TouchableOpacity>
          <Text style={[styles.reset, { color: colors.accent }]}>
            Forgot Password
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin}>
          <View style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={styles.btnText}>Login</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.signInWithSection}>
          <Text style={[styles.signInWithText, { color: colors.text }]}>
            Or sign in with
          </Text>
        </View>

        {/* Google Login */}
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync({ useProxy: true })}
          style={[styles.googleButton, { borderColor: colors.accent }]}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
            }}
            style={styles.googleIcon}
          />
          <Text style={[styles.googleText, { color: colors.accent }]}>
            Google
          </Text>
        </TouchableOpacity>

        {/* Signup */}
        <View style={styles.option}>
          <Text style={[styles.sign, { color: colors.text }]}>
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={[styles.signText, { color: colors.accent }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WALLET SELECTION MODAL */}
      <Modal visible={showWalletModal} transparent animationType="none">
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: colors.card,
                top: slideAnim,
              },
            ]}
          >
            <Text style={styles.modalTitle}>Choose Wallet Type</Text>

            <TouchableOpacity
              style={styles.walletBtn}
              onPress={() => {
                closeWalletModal();
                router.push("/tabs/home");
              }}
            >
              <Text style={styles.walletText}>Personal Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.walletBtn}
              onPress={() => {
                closeWalletModal();
                router.push("/wallets/business-wallet");
              }}
            >
              <Text style={styles.walletText}>Business Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeWalletModal}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 67,
    paddingLeft: 20,
    fontSize: 36,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  inputWrapper: { marginTop: 30 },
  label: { fontSize: 18, marginBottom: 1 },
  inputLine: {
    borderBottomWidth: 1,
    height: 30,
    fontSize: 18,
    paddingVertical: 5,
    marginTop: 4,
  },
  reset: { fontSize: 16, marginTop: 20, alignSelf: "flex-end" },
  button: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 30,
  },
  btnText: { fontSize: 20, color: "white" },
  signInWithSection: { marginTop: 25, marginBottom: 10, alignItems: "center" },
  signInWithText: { fontSize: 16, fontWeight: "500" },
  googleButton: {
    flexDirection: "row",
    height: 42,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 18 },
  option: { flexDirection: "row", justifyContent: "center" },
  sign: { fontSize: 16 },
  signText: { fontSize: 16, marginLeft: 10, textDecorationLine: "underline" },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalContainer: {
    position: "absolute",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
  walletBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: "#26669f",
    marginBottom: 20,
    alignItems: "center",
  },
  walletText: {
    fontSize: 18,
    color: "white",
  },
  closeText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});

