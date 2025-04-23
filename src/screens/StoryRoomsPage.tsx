import React, { useContext, useEffect, useState } from "react";
import { Text, FlatList, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PageLayout from "../components/PageLayout";
import OpenRouter from "../components/OpenRouter";
import ExampleImageGeneration from "../components/ExampleImageGeneration";
import ExampleResponseStream from "../components/ExampleResponseStream";
import { getUserStories, Story } from "../api/stories";
import { getUsersByUsername } from "../../api/users";
import { auth } from "../../firebase/config";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUser";
import { RootStackParamList } from "../types/navigation";
import { storyRoomsStyles } from "../styles";

type StoryRoomsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StoryRooms"
>;

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
      roomId: story.id,
    });
  };

  return (
    <PageLayout currentTab="Story Rooms">
      <View style={storyRoomsStyles.header}>
        <Text style={storyRoomsStyles.headerTitle}>Story Rooms</Text>
      </View>
      {/* <OpenRouter />
      <ExampleImageGeneration />
      <ExampleResponseStream /> */}
      {stories.length === 0 ? (
        <View style={storyRoomsStyles.emptyState}>
          <Text style={storyRoomsStyles.emptyStateText}>
            No story rooms found
          </Text>
        </View>
      ) : (
        <FlatList
          style={storyRoomsStyles.roomList}
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={storyRoomsStyles.roomItem}
              onPress={() => handleStoryPress(item)}
            >
              <View>
                <Text style={storyRoomsStyles.roomTitle}>{item.title}</Text>
                <Text style={storyRoomsStyles.roomDescription}>
                  Topic: {item.topic}
                </Text>
                <View style={storyRoomsStyles.roomMeta}>
                  <Text style={storyRoomsStyles.roomMetaText}>
                    {item.aiAssistant ? "AI Assisted" : "Human Only"} •{" "}
                    {item.joinUser?.length || 1} Participant(s)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </PageLayout>
  );
};

export default StoryRoomsPage;
