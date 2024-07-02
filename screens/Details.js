import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import API_KEY from "../key";
import Nutrition from "../components/Nutrition";
import Ingredients from "../components/Ingredients";
import Instructions from "../components/Instructions";
import { AntDesign, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { doc, setDoc, deleteDoc, collection, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Details({ route }) {
  const { id } = route.params;
  const [details, setDetails] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [groceries, setGroceries] = useState(false);
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser.uid;
  const storageKey = `${userId}_favorites`;

  const getDetails = async () => {
    try {
      const api = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
      );
      const data = await api.json();
      setDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkFavoriteAndGroceriesStatus = async () => {
    const favoriteRef = doc(
      collection(FIREBASE_DB, "users", userId, "favorites"),
      id.toString()
    );

    const groceriesRef = doc(
      collection(FIREBASE_DB, "users", userId, "groceries"),
      id.toString()
    );

    try {
      const [docSnapFavorite, docSnapGroceries] = await Promise.all([
        getDoc(favoriteRef),
        getDoc(groceriesRef),
      ]);

      if (docSnapFavorite.exists()) {
        setFavorite(true); // Recept je sacuvan u omiljenim
      } else {
        setFavorite(false);
      }

      if (docSnapGroceries.exists()) {
        setGroceries(true);
      } else {
        setGroceries(false);
      }
    } catch (error) {
      console.error("Greška pri dohvatanju dokumenta:", error);
    }
  };

  const handleFavorite = async () => {
    const favoriteRef = doc(
      collection(FIREBASE_DB, "users", userId, "favorites"),
      id.toString()
    );

    if (favorite) {
      await deleteDoc(favoriteRef);
      setFavorite(false);
      // Remove from AsyncStorage
      const favoritesData = await AsyncStorage.getItem(storageKey);
      if (favoritesData) {
        const favoritesList = JSON.parse(favoritesData).filter(
          (item) => item.recipeId !== id
        );
        await AsyncStorage.setItem(storageKey, JSON.stringify(favoritesList));
      }
    } else {
      await setDoc(favoriteRef, {
        title: details.title,
        image: details.image,
        recipeId: id,
      });
      setFavorite(true);
      // Add to AsyncStorage
      const favoritesData = await AsyncStorage.getItem(storageKey);
      let favoritesList = favoritesData ? JSON.parse(favoritesData) : [];
      favoritesList.push({
        title: details.title,
        image: details.image,
        recipeId: id,
      });
      await AsyncStorage.setItem(storageKey, JSON.stringify(favoritesList));
    }
  };

  const handleGroceries = async () => {
    const recipeRef = doc(
      collection(FIREBASE_DB, "users", userId, "groceries"),
      id.toString()
    );

    const ingredientNames = details.extendedIngredients.map(
      (ingredient) => ingredient.originalName
    );

    if (groceries) {
      await deleteDoc(recipeRef);
      setGroceries(false);
      // Remove from AsyncStorage
      const groceriesData = await AsyncStorage.getItem(storageKey);
      if (groceriesData) {
        const groceriesList = JSON.parse(groceriesData).filter(
          (item) => item.recipeId !== id
        );
        await AsyncStorage.setItem(storageKey, JSON.stringify(groceriesList));
      }
    } else {
      await setDoc(recipeRef, {
        title: details.title,
        ingredients: ingredientNames,
        recipeId: id,
      });
      setGroceries(true);
      // Add to AsyncStorage
      const groceriesData = await AsyncStorage.getItem(storageKey);
      let groceriesList = groceriesData ? JSON.parse(groceriesData) : [];
      groceriesList.push({
        title: details.title,
        ingredients: ingredientNames,
        recipeId: id,
      });
      await AsyncStorage.setItem(storageKey, JSON.stringify(groceriesList));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    checkFavoriteAndGroceriesStatus();
    getDetails();
  }, []);

  return (
    <View style={styles.container}>
      {details ? (
        <ScrollView>
          <TouchableOpacity style={styles.back} onPress={handleBack}>
            <Ionicons name="arrow-back-outline" size={28} color="white" />
          </TouchableOpacity>

          <Image style={styles.detailsImg} source={{ uri: details.image }} />
          <View style={styles.detailsContainer}>
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.groceries}
                onPress={handleGroceries}
              >
                {groceries ? (
                  <FontAwesome5
                    name="shopping-basket"
                    size={24}
                    color="#E95353"
                  />
                ) : (
                  <FontAwesome5
                    name="shopping-basket"
                    size={24}
                    color="#676D75"
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.favorite}
                onPress={handleFavorite}
              >
                {favorite ? (
                  <AntDesign name="heart" size={24} color="#E95353" />
                ) : (
                  <AntDesign name="hearto" size={24} color="#676D75" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsHeading}>{details.title}</Text>
            <Nutrition details={details} />
            <Text style={styles.subHeading}>Ingredients</Text>
            <View style={styles.ingredientsContainer}>
              {details.extendedIngredients.map((ingredient, index) => (
                <Ingredients key={index.toString()} ingredient={ingredient} />
              ))}
            </View>
            <Text style={[styles.subHeading, styles.subHeadingTopMargin]}>
              Instructions
            </Text>
            <Instructions id={id} />
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    height: "100%",
  },
  detailsImg: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    backgroundColor: "#000000",
    minHeight: 400,
    top: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 30,
    zIndex: 1,
  },

  ctaContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 30,
    marginBottom: 20,
  },

  detailsHeading: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeading: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },

  subHeadingTopMargin: {
    marginTop: 60,
  },

  ingredientsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },

  back: {
    position: "absolute",
    zIndex: 5,
    top: 70,
    left: 30,
  },
});
