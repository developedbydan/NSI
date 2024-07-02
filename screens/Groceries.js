import { useState, useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function Groceries() {
  const [groceries, setGroceries] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser.uid;
  const storageKey = `${userId}_groceries`;
  const checkboxStorageKey = `${userId}_checkboxState`;

  const getGroceriesFromFirestore = async () => {
    try {
      const recipeRef = collection(FIREBASE_DB, "users", userId, "groceries");
      const querySnapshot = await getDocs(recipeRef);
      const groceriesList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Cuvanje ID dokumenta iz Firestora
      }));

      setGroceries(groceriesList);
      await AsyncStorage.setItem(storageKey, JSON.stringify(groceriesList));
    } catch (error) {
      console.error("Error getting data from Firestore:", error);
    }
  };

  const getGroceriesFromAsyncStorage = async () => {
    try {
      const groceriesData = await AsyncStorage.getItem(storageKey);
      if (groceriesData) {
        setGroceries(JSON.parse(groceriesData));
      }
    } catch (error) {
      console.error("Error reading data from AsyncStorage:", error);
    }
  };

  const getCheckboxStateFromAsyncStorage = async () => {
    try {
      const storedCheckboxState = await AsyncStorage.getItem(
        checkboxStorageKey
      );
      if (storedCheckboxState) {
        setCheckboxState(JSON.parse(storedCheckboxState));
      }
    } catch (error) {
      console.error("Error reading checkbox state from AsyncStorage:", error);
    }
  };

  const handlePress = (recipeId, ingredientIndex) => {
    const newState = { ...checkboxState };
    const currentRecipeState = newState[recipeId] || [];
    currentRecipeState[ingredientIndex] = !currentRecipeState[ingredientIndex];
    newState[recipeId] = currentRecipeState;
    setCheckboxState(newState);

    // Sacuvaj novo stanje u Async
    AsyncStorage.setItem(checkboxStorageKey, JSON.stringify(newState));
  };

  const handleNavigation = (recipeId) => {
    navigation.navigate("Details", { id: recipeId });
  };

  const handleDelete = async (recipeId) => {
    try {
      // Delete from Firestore
      const recipeDocRef = doc(
        FIREBASE_DB,
        "users",
        userId,
        "groceries",
        recipeId
      );
      await deleteDoc(recipeDocRef);

      // Update AsyncStorage
      const updatedGroceries = groceries.filter(
        (recipe) => recipe.id !== recipeId
      );
      setGroceries(updatedGroceries);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedGroceries));
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getGroceriesFromAsyncStorage();
      getCheckboxStateFromAsyncStorage();
      getGroceriesFromFirestore();
      getCheckboxStateFromAsyncStorage();
    }, [])
  );

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Text style={styles.headingText}>All groceries</Text>
      <ScrollView style={styles.container}>
        {groceries.map((recipe, recipeIndex) => {
          return (
            <View
              key={recipeIndex.toString()}
              style={styles.groceriesContainer}
            >
              <View style={styles.recipeContainer}>
                <TouchableOpacity
                  onPress={() => handleNavigation(recipe.recipeId)}
                >
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(recipe.id)}>
                  <Ionicons name="close-outline" size={24} color="grey" />
                </TouchableOpacity>
              </View>
              {recipe.ingredients.map((ingredient, ingredientIndex) => (
                <BouncyCheckbox
                  key={ingredientIndex.toString()}
                  size={22}
                  fillColor="#e95353"
                  unFillColor="#000000"
                  text={ingredient}
                  textStyle={{ color: "#ffffff" }}
                  iconStyle={{ borderColor: "red", marginLeft: 15 }}
                  innerIconStyle={{ borderWidth: 2 }}
                  isChecked={
                    checkboxState[recipe.recipeId]?.[ingredientIndex] || false
                  }
                  onPress={() => handlePress(recipe.recipeId, ingredientIndex)}
                />
              ))}
            </View>
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

  groceriesContainer: {
    marginVertical: 20,
    gap: 10,
  },

  recipeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },

  recipeTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  recipeIngredient: {
    color: "#ffffff",
    fontSize: 13,
  },
});
