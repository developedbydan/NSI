import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.clear();
      navigation.replace("Welcome");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Email: {auth.currentUser?.email}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
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
  container: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    color: "#ffffff",
    fontSize: 30,
    marginTop: 150,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: "white",
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
