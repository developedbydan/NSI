import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      alert("Sing up failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Text style={styles.headingText}>Register</Text>

      <View>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={"#94A3B8"}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoCapitalize="none"
            placeholderTextColor={"#94A3B8"}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </>
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
    marginTop: 90,
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
