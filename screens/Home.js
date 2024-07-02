import { StyleSheet, Text, SafeAreaView, Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Popular from "../components/Popular.js";
import Cheap from "../components/Cheap.js";
import Search from "../components/Search.js";

export default function Home() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Search />
      <Text style={styles.headingText}>Popular meals</Text>
      <Popular />
      <Text style={styles.headingText}>On the budget</Text>
      <Cheap />
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
    color: "#ffffff",
    fontSize: 24,
    marginVertical: 10,
    fontWeight: "bold",
  },
});
