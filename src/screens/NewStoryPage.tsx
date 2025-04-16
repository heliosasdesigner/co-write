import React from "react";
import { Text, StyleSheet } from "react-native";
import PageLayout from "../components/PageLayout";

const NewStoryPage = () => {
  return (
    <PageLayout currentTab="New Story">
      <Text style={styles.title}>Create a New Story</Text>
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
