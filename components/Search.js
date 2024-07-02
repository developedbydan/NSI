import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import API_KEY from "../key";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [textInputRef, setTextInputRef] = useState(null);
  const navigation = useNavigation();

  const searchRecipe = async (query) => {
    try {
      const api = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`
      );
      const data = await api.json();
      setSearchResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      searchRecipe(query);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery !== "") {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
    if (textInputRef) {
      textInputRef.blur(); // Uklanja fokus sa inputa
    }
  };

  const handleRecipePress = (itemId) => {
    navigation.navigate("Details", { id: itemId });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => handleRecipePress(item.id)}
    >
      <Image style={styles.recipeImage} source={{ uri: `${item.image}` }} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={(ref) => setTextInputRef(ref)}
        placeholder="Search Recipes 🍜"
        style={styles.input}
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        blurOnSubmit={true} // Uklanja fokus kada se zavrsi unos
      />

      {searchResults.length > 0 && (
        <AntDesign
          name="closecircle"
          size={26}
          color="red"
          style={styles.closeButton}
          onPress={clearSearch}
        />
      )}
      {searchResults.length > 0 && (
        <View style={styles.overlay}>
          <FlatList
            data={searchResults}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    height: 50,
    width: 350,
    borderRadius: 30,
    paddingHorizontal: 15,
    zIndex: 3,
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,

    zIndex: 4,
  },
  closeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    marginTop: 51,
    width: 370,
    marginHorizontal: "auto",
    paddingBottom: 40,
    flex: 1,
    height: 700,
    zIndex: 2,
  },
  flatList: {
    marginTop: 30,
  },
  recipeItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recipeTitle: {
    fontSize: 16,
    color: "white",
  },
  recipeImage: {
    height: 60,
    width: 80,
  },
});
