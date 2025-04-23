import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import PageLayout from "../components/PageLayout";

const ProfilePage = () => {
  const [filter, setFilter] = useState("date");
  const [stories, setStories] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        if (!user) return;

        const q = query(collection(db, "stories"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchUserStories();
  }, [user]);

  const sortedStories = [...stories].sort((a, b) => {
    if (filter === "az") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
      <PageLayout currentTab="Profile" scrollable={true}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.username}>{user?.email || "Username Placeholder"}</Text>
        <Text style={styles.bio}>Short Bio (optional)</Text>

        <View style={styles.filterRowWrapper}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.pickerContainer}>
            <Picker
                selectedValue={filter}
                onValueChange={(itemValue) => setFilter(itemValue)}
                dropdownIconColor="#000"
            >
              <Picker.Item label="Date Made" value="date" />
              <Picker.Item label="A - Z" value="az" />
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>PAST STORIES</Text>
        <FlatList
            data={sortedStories}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, index }) => (
                <Text style={styles.storyItem}>
                  {index + 1}. {item.title}
                </Text>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No stories found.</Text>
            }
        />
      </PageLayout>
  );
};

const styles = StyleSheet.create({
  avatar: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  bio: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
    marginBottom: 20,
  },
  filterRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 10,
    zIndex: 999,
    elevation: 999,
    position: "relative",
  },
  filterLabel: {
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    position: "relative",
    zIndex: 999,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  storyItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 6,
    marginHorizontal: 10,
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default ProfilePage;
