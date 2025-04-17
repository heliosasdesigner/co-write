import React from "react";
import { Text, StyleSheet } from "react-native";
import PageLayout from "../components/PageLayout";
import OpenRouter from "../components/OpenRouter";

import ExampleImageGeneration from "../components/ExampleImageGeneration";
import ExampleResponseStream from "../components/ExampleResponseStream";
const NewStoryPage = () => {
  return (
    <PageLayout currentTab="New Story">
      <ExampleImageGeneration />
      <ExampleResponseStream />
      <Text style={styles.title}>OpenRouter:</Text>
      <OpenRouter />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 40,
  },
});

export default NewStoryPage;
