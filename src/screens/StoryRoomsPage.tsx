import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import PageLayout from "../components/PageLayout";
import OpenRouter from "../components/OpenRouter";

import ExampleImageGeneration from "../components/ExampleImageGeneration";
import ExampleResponseStream from "../components/ExampleResponseStream";
import { getUserStories, Story } from "../api/stories";
import { getUsersByUsername } from "../../api/users";
import { auth } from "../../firebase/config";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUser";
import { ChatsFlowParamList } from "../navigation/ChatsFlowStack";

type StoryRoomsNavigationProp = StackNavigationProp<ChatsFlowParamList>;

const StoryRoomsPage = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [stories, setStories] = useState<Story[]>([]);
  const navigation = useNavigation<StoryRoomsNavigationProp>();

  useEffect(() => {
    const fetchStories = async () => {
      if (auth.currentUser?.email) {
        const fetchedStories = await getUserStories(auth.currentUser.email);
        setStories(fetchedStories);
      }
    };
    fetchStories();
  }, []);

  const handleStoryPress = (story: Story) => {
    navigation.navigate("Chat", {
      storyId: story.id,
      title: story.title,
      topic: story.topic,
      aiAssistant: story.aiAssistant || false,
      wordLimit: story.wordLimit || "100",
      numberOfPages: story.pageLimit || "10",
    });
  };

  return (
    <PageLayout currentTab="Story Rooms">
      <Text style={styles.title}>Story Rooms</Text>
      {/* <OpenRouter />
      <ExampleImageGeneration />
      <ExampleResponseStream /> */}
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.room}
            onPress={() => handleStoryPress(item)}
          >
            <View>
              <Text style={styles.roomTitle}>{item.title}</Text>
              <Text style={styles.roomTopic}>Topic: {item.topic}</Text>
              <Text style={styles.roomDetails}>
                {item.aiAssistant ? "AI Assisted" : "Human Only"} •{" "}
                {item.joinUser?.length || 1} Participant(s)
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  room: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roomTopic: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 12,
    color: "#888",
  },
});

export default StoryRoomsPage;
