import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeCards from "../components/WelcomeCards";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const slides = [
    {
      heading: "🔍 Find New Recipes",
      text: "Check out our range of tasty dishes. From filling breakfasts to sweet treats, there's something for everyone's taste buds.",
      backgroundColor: "#336CC6",
    },
    {
      heading: "❤️ Save Your Favorites",
      text: "Keep track of your go-to recipes by adding them to your favorites. Never lose sight of the meals you love the most!",
      backgroundColor: "#8A5FBE",
    },
    {
      heading: "📝 Create Your Shopping List",
      text: "Easily add ingredients from your favorite recipes to your shopping list. Stay organized and never forget an essential item again.",
      backgroundColor: "#FF6347",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Image source={require("../assets/logotype.png")} style={styles.logo} />
      <WelcomeCards
        slides={slides}
        currentIndex={currentIndex}
        onIndexChanged={handleIndexChanged}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: slides[currentIndex].backgroundColor },
        ]}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>
      <View style={styles.login}>
        <Text style={styles.loginText}>Already a member?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.loginText, styles.loginCTA]}>LOG IN</Text>
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
  logo: {
    marginTop: 10,
    marginBottom: 100,
    width: 130,
    height: 80,
    alignSelf: "center",
  },

  button: {
    alignSelf: "center",
    width: 230,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 170,
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  login: {
    flexDirection: "row",
    gap: 5,
    alignSelf: "center",
    marginBottom: 50,
  },
  loginText: {
    color: "#676D75",
    fontSize: 14,
    fontWeight: "500",
  },
  loginCTA: {
    color: "#C54554",
  },
});
