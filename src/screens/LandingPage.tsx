import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import PageLayout from "../components/PageLayout";

const LandingPage = () => {
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
