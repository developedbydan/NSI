import { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Favorite() {
  const [favorite, setFavorite] = useState([]);
  const userId = FIREBASE_AUTH.currentUser.uid;
  const storageKey = `${userId}_favorites`;
  const navigation = useNavigation();

  const getFavoritesFromFirestore = async () => {
    try {
      const favoritesRef = collection(
        FIREBASE_DB,
        "users",
        userId,
        "favorites"
      );
      const querySnapshot = await getDocs(favoritesRef);
      const favoritesList = querySnapshot.docs.map((doc) => doc.data());

      setFavorite(favoritesList);
      await AsyncStorage.setItem(storageKey, JSON.stringify(favoritesList));
    } catch (error) {
      console.error("Error getting data from Firestore:", error);
    }
  };

  const getFavoritesFromAsyncStorage = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(storageKey);
      if (favoritesData) {
        setFavorite(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error("Error reading data from AsyncStorage:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFavoritesFromAsyncStorage();
      getFavoritesFromFirestore();
    }, [])
  );

  const handleRecipePress = (recipeId) => {
    navigation.navigate("Details", { id: recipeId });
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Text style={styles.headingText}>Favorites</Text>
      <ScrollView style={styles.container}>
        {favorite.map((recipe, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              style={styles.favoriteContainer}
              onPress={() => handleRecipePress(recipe.recipeId)}
            >
              <Image
                style={styles.recipeImg}
                source={{
                  uri: `${recipe.image}`,
                }}
              />
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginTop: 10,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  container: {
    paddingTop: 50,
  },

  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
    gap: 20,
  },

  recipeImg: {
    width: 100,
    height: 70,
    borderRadius: 10,
    resizeMode: "cover",
  },

  recipeTitle: {
    textAlign: "left",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
  },
});
