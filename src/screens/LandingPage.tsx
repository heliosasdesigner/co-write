import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import PageLayout from "../components/PageLayout";
import { landingStyles } from "../styles";

interface Story {
  id: string;
  topic: string;
  createdAt: Date;
  video?: string;
  [key: string]: any;
}
import { getAuth } from "firebase/auth";

const LandingPage = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stories"));

        const data = querySnapshot.docs.map((doc) => {
          const storyData = doc.data();

          return {
            id: doc.id,
            userId: storyData.userId || "",
            topic: storyData.topic,
            video: storyData.video,
            votes: storyData.votes,
            createdAt: storyData.createdAt?.toDate
              ? storyData.createdAt.toDate()
              : storyData.createdAt,
          };
        });

        setStories(data);
      } catch (error: unknown) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  return (
    <PageLayout currentTab="Home" scrollable>
      <Header />

      <ScrollView contentContainerStyle={landingStyles.grid}>
        {stories.length === 0 ? (
          <View style={landingStyles.emptyState}>
            <Text style={landingStyles.emptyStateText}>No stories found</Text>
          </View>
        ) : (
          stories.map((story) => (
            <View key={story.id} style={landingStyles.cardWrapper}>
              <StoryCard
                topic={story.topic}
                createdAt={story.createdAt}
                video={story.video}
              />
            </View>
          ))
        )}

      </ScrollView>
    </PageLayout>
  );
};

export default LandingPage;
