import React from "react";
import { Text, StyleSheet } from "react-native";
import PageLayout from "../components/PageLayout";

const SearchPage = () => {
  return (
    <PageLayout currentTab="Search" scrollable>
      <Text style={styles.text}>Search Screen</Text>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 40,
  },
});

export default SearchPage;
