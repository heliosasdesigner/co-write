import React from "react";
import { View, Text, StyleSheet } from "react-native";

const tabs = ["Home", "Search", "New Story", "Story Rooms", "Profile"];

const NavBar = ({ currentTab = "Home" }) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const isFocused = tab === currentTab;
      const isMiddle = tab === "New Story";

      return (
        <View key={tab} style={styles.tab}>
          <View
            style={[
              styles.circle,
              isFocused && styles.activeCircle,
              isMiddle && styles.middleCircle,
            ]}
          />
          <Text style={styles.label}>{tab}</Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#4a5a75",
  },
  tab: {
    alignItems: "center",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d6dce5",
    marginBottom: 4,
  },
  middleCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d6dce5",
    marginBottom: 4,
  },
  activeCircle: {
    backgroundColor: "#ffffff",
  },
  label: {
    color: "white",
    fontSize: 10,
  },
});

export default NavBar;
