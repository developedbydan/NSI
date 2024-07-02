import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Feather, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

const Nutrition = ({ details }) => {
  const { readyInMinutes, servings, nutrition } = details;
  const { nutrients } = nutrition;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Feather name="clock" size={16} color="#676D75" />
          <Text style={styles.infoText}>{readyInMinutes} min</Text>
        </View>
        <View style={styles.info}>
          <MaterialCommunityIcons
            name="bowl-mix-outline"
            size={16}
            color="#676D75"
          />
          <Text style={styles.infoText}>{servings} serving</Text>
        </View>
        <View style={styles.info}>
          <Octicons name="flame" size={16} color="#676D75" />
          <Text style={styles.infoText}>
            {nutrients && nutrients[0] && nutrients[0].amount
              ? Math.round(nutrients[0].amount)
              : "N/A"}
            Kcal
          </Text>
        </View>
      </View>
      <View style={styles.detailsNutrition}>
        <View style={styles.nutritiion}>
          <Text style={styles.nutritiionInfo}>
            {nutrients && nutrients[10] && nutrients[10].amount
              ? Math.round(nutrients[10].amount)
              : "N/A"}
            g
          </Text>
          <Text style={styles.nutritiionTitle}>Protein</Text>
        </View>
        <View style={styles.nutritiion}>
          <Text style={styles.nutritiionInfo}>
            {nutrients && nutrients[4] && nutrients[4].amount
              ? Math.round(nutrients[4].amount)
              : "N/A"}
            g
          </Text>
          <Text style={styles.nutritiionTitle}>Carbs</Text>
        </View>
        <View style={styles.nutritiion}>
          <Text style={styles.nutritiionInfo}>
            {Math.round(nutrients[1].amount)} g
          </Text>
          <Text style={styles.nutritiionTitle}>Fat</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  infoContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#676D75",
    fontWeight: "500",
    marginLeft: 5,
  },

  detailsNutrition: {
    marginTop: 30,
    marginVertical: 35,
    flexDirection: "row",
    borderColor: "#383838",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 65,
  },

  nutritiionInfo: {
    color: "#A6A6A6",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 5,
    fontSize: 14,
  },

  nutritiionTitle: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Nutrition;
