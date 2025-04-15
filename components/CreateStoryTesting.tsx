import React from "react";
import { Button, View } from "react-native";
import { createStory, NewStory } from "../api/stories";

const CreateStoryButton = () => {
  const handleCreateStory = async () => {
    // Define your new story (notice id and createdAt are omitted)
    const newStory: NewStory = {
      title: "A New Adventure",
      topic: "Travel",
      username: "username3",
      video: "https://example.com/video.mp4",
      votes: 0,
      joinUser: ["username1", "username2"],
    };

    try {
      const storyId = await createStory(newStory);
      console.log("Story added with ID:", storyId);
    } catch (error) {
      console.error("Failed to post story:", error);
    }
  };

  return (
    <View>
      <Button title="Create Story" onPress={handleCreateStory} />
    </View>
  );
};

export default CreateStoryButton;
