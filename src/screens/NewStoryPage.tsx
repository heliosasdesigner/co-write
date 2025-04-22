import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createStory, createInitialChat } from "../../api/stories";
import { auth } from "../../firebase/config";
import PageLayout from "../components/PageLayout";
import { RootStackParamList } from "../types/navigation";
import { storyRoomsStyles, authStyles, loginButtonStyles } from "../styles";

type NewStoryNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewStory"
>;

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

      const storyData = {
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

      await createInitialChat(
        storyDocRef.id,
        topic,
        aiAssistant,
        wordLimit,
        pageLimit
      );

      navigation.navigate("Chat", {
        roomId: storyDocRef.id,
      });
    } catch (error: unknown) {
      console.error("Error creating story:", error);
      Alert.alert("Error", "Failed to create story. Please try again.");
    }
  };

  return (
    <PageLayout currentTab="New Story">
      <View style={storyRoomsStyles.container}>
        <View style={storyRoomsStyles.header}>
          <Text style={storyRoomsStyles.headerTitle}>Create a New Story</Text>
        </View>

        <View style={storyRoomsStyles.roomItem}>
          <Text style={storyRoomsStyles.roomTitle}>Topic:</Text>
          <TextInput
            style={authStyles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Type a topic..."
          />

          <Text style={storyRoomsStyles.roomTitle}>AI Assistant?</Text>
          <Switch value={aiAssistant} onValueChange={setAiAssistant} />

          <Text style={storyRoomsStyles.roomTitle}>Word Limit:</Text>
          <TextInput
            style={authStyles.input}
            value={wordLimit}
            onChangeText={setWordLimit}
            keyboardType="numeric"
          />

          <Text style={storyRoomsStyles.roomTitle}>Page Limit:</Text>
          <TextInput
            style={authStyles.input}
            value={pageLimit}
            onChangeText={setPageLimit}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={loginButtonStyles.button}
            onPress={handleStart}
          >
            <Text style={loginButtonStyles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
};

export default NewStoryPage;
