import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config.ts";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import PageLayout from "../components/PageLayout";

const LandingPage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stories"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchStories();
  }, []);

  return (
    <PageLayout currentTab="Home" scrollable>
      <Header />
      <ScrollView contentContainerStyle={styles.grid}>
        {stories.map((story, idx) => (
          <StoryCard
            key={story.id}
            topic={story.topic}
            createdAt={story.createdAt}
            video={story.video}
          />
        ))}
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: 3,
    rowGap: 3,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 80,
  },
});

export default LandingPage;
