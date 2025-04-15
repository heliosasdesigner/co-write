import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const StoryCard = () => (
  <View style={styles.card}>
    <View style={styles.tagRow}>
      <Text style={styles.tag}>Topic</Text>
      <Text style={styles.tag}>1min ago</Text>
    </View>
    <Image
      style={styles.image}
      source={{ uri: "https://via.placeholder.com/100" }}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: "32%",
    aspectRatio: 1,
    backgroundColor: "#c8d7e6",
    borderRadius: 8,
    padding: 2,
    marginBottom: 0,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tag: {
    fontSize: 10,
    backgroundColor: "#607192",
    color: "#fff",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  image: {
    flex: 1,
    marginTop: 8,
    borderRadius: 4,
  },
});

export default StoryCard;
