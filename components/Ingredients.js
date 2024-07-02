import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Ingredients = ({ ingredient }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>•</Text>
      <Text style={styles.text}>{ingredient.original}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },

  text: {
    fontSize: 16,
    color: "#A6A6A6",
    marginBottom: 5,
  },
});

export default Ingredients;
