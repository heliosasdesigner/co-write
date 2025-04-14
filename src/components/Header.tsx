import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Header = () => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <Text style={styles.title}>HOME</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#e6f0fa",
    padding: 16,
  },
  container: {
    backgroundColor: "#dbe8f4",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#1f2b38",
  },
});

export default Header;
