import React, { useEffect, useState } from "react";
import { Text, TextInput, FlatList, View } from "react-native";
import PageLayout from "../components/PageLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { storyRoomsStyles } from "../styles";

interface Story {
  id: string;
  title?: string;
  topic?: string;
  createdAt?: { toDate: () => Date };
  [key: string]: any;
}

const SearchPage = () => {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "stories"));
        const stories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Story[];
        setAllStories(stories);
        setFilteredStories(stories); // Default view
      } catch (error: unknown) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  // Filter when searchQuery changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allStories.filter((story) =>
      (story.title || story.topic || "Untitled").toLowerCase().includes(query)
    );
    setFilteredStories(filtered);
  }, [searchQuery, allStories]);

  return (
    <PageLayout currentTab="Search" scrollable>
      <View style={storyRoomsStyles.header}>
        <Text style={storyRoomsStyles.headerTitle}>Search Stories</Text>
      </View>

      <TextInput
        style={storyRoomsStyles.roomItem}
        placeholder="Type a keyword..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredStories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={storyRoomsStyles.roomItem}>
            <Text style={storyRoomsStyles.roomTitle}>
              {item.title || item.topic || "Untitled"}
            </Text>
            {item.createdAt?.toDate && (
              <Text style={storyRoomsStyles.roomMetaText}>
                {item.createdAt.toDate().toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={storyRoomsStyles.emptyState}>
            <Text style={storyRoomsStyles.emptyStateText}>
              No stories match your search.
            </Text>
          </View>
        }
      />
    </PageLayout>
  );
};

export default SearchPage;
