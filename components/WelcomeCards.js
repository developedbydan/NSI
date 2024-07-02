import { StyleSheet, Text, View, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

export default function WelcomeCards({ slides, currentIndex, onIndexChanged }) {
  const paginationColor = slides[currentIndex].backgroundColor;

  return (
    <Swiper
      horizontal={true}
      loop={false}
      showsPagination={true}
      onIndexChanged={onIndexChanged}
      paginationStyle={styles.paginationStyle}
      dotColor="#D2D4DA"
      activeDotColor={paginationColor}
      snapToAlignment="end"
      snapToInterval={Dimensions.get("window").width}
      snapToOffsets={[0, Dimensions.get("window").width]}
      style={styles.swiper}
      containerStyle={{ height: 230, flex: 0 }}
    >
      {slides.map((slide, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: slide.backgroundColor }]}
        >
          <Text style={styles.heading}>{slide.heading}</Text>
          <Text style={styles.text}>{slide.text}</Text>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  swiper: {
    flexDirection: "row",
    gap: 30,
  },
  card: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    padding: 20,
  },
  heading: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  text: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  paginationStyle: {
    position: "absolute",
    top: 235,
  },
});
