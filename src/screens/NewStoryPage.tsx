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
import { createStory, createInitialChat } from "../api/stories";
import { auth } from "../../firebase/config";
import PageLayout from "../components/PageLayout";

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  NewStory: undefined;
  "Story Rooms": undefined;
  Profile: undefined;
  Chat: {
    storyId: string;
    topic?: string;
    aiAssistant?: boolean;
    wordLimit?: string;
    numberOfPages?: string;
  };
};

type NewStoryNavProp = StackNavigationProp<RootStackParamList, "NewStory">;

const NewStoryPage: React.FC = () => {
  const navigation = useNavigation<NewStoryNavProp>();

  const [topic, setTopic] = useState("");
  const [aiAssistant, setAiAssistant] = useState(false);
  const [wordLimit, setWordLimit] = useState("100");
  const [pageLimit, setPageLimit] = useState("10");

  const handleStart = async () => {
    try {
      if (!topic.trim()) {
        Alert.alert("Error", "Please enter a topic for your story");
        return;
      }

      if (!auth.currentUser?.email) {
        Alert.alert("Error", "You must be logged in to create a story");
        return;
      }

      // Create the story document
      const storyData = {
        title: title.trim(),
        topic: topic.trim(),
        username: auth.currentUser.email,
        video: "",
        sectionImages: [],
        votes: 0,
        joinUser: [auth.currentUser.email],
        aiAssistant,
        wordLimit,
        pageLimit,
      };

      const storyDocRef = await createStory(storyData);

      // Create the initial chat
      await createInitialChat(
        storyDocRef.id,
        topic,
        aiAssistant,
        wordLimit,
        pageLimit
      );

      // Navigate to chat screen
      navigation.navigate("Chat", {
        storyId: storyDocRef.id,
        topic,
        aiAssistant,
        wordLimit,
        numberOfPages: pageLimit,
      });
    } catch (error) {
      console.error("Error creating story:", error);
      Alert.alert("Error", "Failed to create story. Please try again.");
    }
  };

  return (
    <PageLayout currentTab="New Story">
      <View style={styles.container}>
        <Text style={styles.title}>Create a New Story</Text>

        <Text>Topic:</Text>
        <TextInput
          style={styles.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="Type a topic..."
        />

        <Text>AI Assistant?</Text>
        <Switch value={aiAssistant} onValueChange={setAiAssistant} />

        <Text>Word Limit:</Text>
        <TextInput
          style={styles.input}
          value={wordLimit}
          onChangeText={setWordLimit}
          keyboardType="numeric"
        />

        <Text>Page Limit:</Text>
        <TextInput
          style={styles.input}
          value={pageLimit}
          onChangeText={setPageLimit}
          keyboardType="numeric"
        />

        <Button title="Start" onPress={handleStart} />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
  },
});

export default NewStoryPage;
