import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  View,
} from "react-native";
import PageLayout from "../components/PageLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const SearchPage = () => {
  const [allStories, setAllStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "stories"));
        const stories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllStories(stories);
        setFilteredStories(stories); // Default view
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchStories();
  }, []);

  // Filter when searchQuery changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allStories.filter((story) =>
        (story.title || story.topic || "Untitled")
            .toLowerCase()
            .includes(query)
    );
    setFilteredStories(filtered);
  }, [searchQuery, allStories]);

  return (
      <PageLayout currentTab="Search" scrollable>
        <Text style={styles.title}>Search Stories</Text>

        <TextInput
            style={styles.input}
            placeholder="Type a keyword..."
            value={searchQuery}
            onChangeText={setSearchQuery}
        />

        <FlatList
            data={filteredStories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.storyCard}>
                  <Text style={styles.storyTitle}>
                    {item.title || item.topic || "Untitled"}
                  </Text>
                  {item.createdAt?.toDate && (
                      <Text style={styles.storyDate}>
                        {item.createdAt.toDate().toLocaleString()}
                      </Text>
                  )}
                </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No stories match your search.</Text>
            }
        />
      </PageLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 30,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  storyCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storyDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
});

export default SearchPage;
