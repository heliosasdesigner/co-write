import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import PageLayout from "../components/PageLayout";
import { useNavigation } from "@react-navigation/native";

const LandingPage = () => {
  const navigation = useNavigation();

  // const handleNewStory = () => {
  //   navigation.navigate("New Story");
  // };

  return (
    <PageLayout currentTab="Home" scrollable>
      <Header />
      <ScrollView contentContainerStyle={styles.grid}>
        {[...Array(12)].map((_, idx) => (
          <StoryCard key={idx} />
        ))}
      </ScrollView>
    </PageLayout>
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
  newStoryButton: {
    margin: 12,
    padding: 12,
    backgroundColor: "#4287f5",
    borderRadius: 8,
    alignItems: "center",
  },
  newStoryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
});

export default LandingPage;
