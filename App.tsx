import React, { useEffect, useState } from "react";
import Video from "react-native-video";
import { StyleSheet, Text, View } from "react-native";
import { getStories, Story } from "./api/stories";
import CreateStoryButton from "./components/CreateStoryTesting";
export default function App() {
  const sampleVideo = require("./assets/sampleVideo.mp4");

  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const results: Story[] = await getStories();
        setStories(results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStories();
  }, []);

  return (
    <View style={styles.container}>
      {stories.map((story) => (
        <React.Fragment key={story.id}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.subtitle}>Topic: {story.topic}</Text>
          <Text>Posted by: {story.username}</Text>

          <Video
            source={sampleVideo}
            style={styles.video}
            controls={false}
            paused={false}
            repeat={true}
            resizeMode="contain"
            onError={(error) => console.error("Video error:", error)}
          />

          <Text>Votes: {story.votes}</Text>
        </React.Fragment>
      ))}
      <CreateStoryButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
