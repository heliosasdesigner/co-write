import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { createStory, createInitialChat } from "../../api/stories";
import { auth } from "../../firebase/config";
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
