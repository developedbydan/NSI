import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import API_KEY from "../key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Popular() {
  const [popular, setPopular] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getPopular();
  }, []);

  const getPopular = async () => {
    try {
      const popularData = await AsyncStorage.getItem("popular");
      if (popularData) {
        setPopular(JSON.parse(popularData));
      } else {
        const api = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9&veryPopular=true`
        );
        const { recipes } = await api.json();
        await AsyncStorage.setItem("popular", JSON.stringify(recipes));
        setPopular(recipes);
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
      {popular.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.card}
          onPress={() => handleRecipePress(recipe.id)}
        >
          <Image style={styles.cardImg} source={{ uri: `${recipe.image}` }} />
          <Text style={styles.cardTitle}>{recipe.title}</Text>
        </TouchableOpacity>
      ))}
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
