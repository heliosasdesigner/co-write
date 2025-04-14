import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import NavBar from "../navigation/NavBar";
import StoryCard from "../components/StoryCard";

const LandingPage = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.grid}>
        {[...Array(12)].map((_, idx) => (
          <StoryCard key={idx} />
        ))}
      </ScrollView>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0fa",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: 3,
    rowGap: 3,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 80,
  },
});

export default LandingPage;
