import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React, { useState, useEffect } from "react";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LandingPage from "./src/screens/LandingPage";
import ProfilePage from "./src/screens/ProfilePage";

import Search from "./src/screens/SearchPage";
import NewStory from "./src/screens/NewStoryPage";
import StoryRooms from "./src/screens/StoryRoomsPage";
import Profile from "./src/screens/ProfilePage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Hello! this is co-write</Text>
          <Text style={styles.subtitle}>This is a subtitle</Text>
        </View>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="New Story" component={NewStory} />
          <Stack.Screen name="Story Rooms" component={StoryRooms} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "black",
  },
});
