import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import API_KEY from "../key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Popular() {
  const [cheap, setCheap] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getCheap();
  }, []);

  const getCheap = async () => {
    try {
      const cheapData = await AsyncStorage.getItem("cheap");
      if (cheapData) {
        await AsyncStorage.getItem("cheap");
        setCheap(JSON.parse(cheapData));
      } else {
        const api = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9&cheap=true`
        );
        const { recipes } = await api.json();

        await AsyncStorage.setItem("cheap", JSON.stringify(recipes));

        setCheap(recipes);
      }
    } catch (error) {
      console.error("Error reading or setting data from AsyncStorage:", error);
    }
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate("Details", { id: recipeId });
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      horizontal={true}
    >
      {cheap.map((recipe) => {
        return (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            onPress={() => handleRecipePress(recipe.id)}
          >
            <Image
              style={styles.cardImg}
              source={{
                uri: `${recipe.image}`,
              }}
            />

            <Text style={styles.cardTitle}>{recipe.title}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    maxHeight: 200,
  },
  card: {
    borderRadius: 10,
    marginRight: 25,
    width: 250,
  },
  cardImg: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardTitle: {
    textAlign: "center",
    color: "#ffffff",
  },
});
