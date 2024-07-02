import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      alert("Sign in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent!"))
      .catch((err) => console.log(err.message));
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Text style={styles.headingText}>Login</Text>

      <View>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={"#94A3B8"}
          value={email}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password"
            placeholderTextColor={"#94A3B8"}
            style={[styles.inputPass, styles.input]}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>

        <Text style={styles.linkText} onPress={handleResetPassword}>
          Forgot password?
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },

  headingText: {
    color: "#ffffff",
    fontSize: 30,
    marginTop: 150,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  inputContainer: {
    borderRadius: 7,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },

  input: {
    borderRadius: 7,
    height: 50,
    color: "#000000",
    paddingLeft: 20,
    backgroundColor: "#ffffff",
  },

  inputPass: {
    width: "95%",
  },
  inputLabel: {
    color: "#D9D9D9",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  linkText: {
    textAlign: "right",
    color: "#3C9AFB",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#E95353",
    height: 44,
    width: 200,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
