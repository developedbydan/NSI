import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import API_KEY from "../key";

export default function Instructions({ id }) {
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    getInstructions();
  }, []);

  const getInstructions = async () => {
    try {
      const api = await fetch(
        `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`
      );
      const data = await api.json();
      setInstructions(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {instructions && instructions.length > 0 ? (
        instructions[0].steps.map((step, index) => (
          <View style={styles.container} key={index}>
            <Text style={styles.text}>{step.number}.</Text>
            <Text style={styles.text}>{step.step}</Text>
          </View>
        ))
      ) : (
        <Text>No instructions available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 10,
  },

  text: {
    fontSize: 16,
    color: "#A6A6A6",
    marginBottom: 5,
  },
});
