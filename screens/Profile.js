import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  View,
  TouchableOpacity,
  Image,
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
        <Text style={styles.headingText}>Profile</Text>
        <Image source={require("../assets/avatar.png")} style={styles.avatar} />
        <Text style={styles.email}>Email:</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    marginTop: 40,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 150,
  },

  avatar: {
    width: 150,
    height: 150,
  },
  email: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 25,
    marginBottom: 5,
  },
  userEmail: {
    color: "#CCCCCC",
    fontWeight: "bold",
    fontSize: 15,
  },
  button: {
    marginTop: 60,
    backgroundColor: "#E95353",
    height: 44,
    width: 150,
    borderRadius: 40,
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
