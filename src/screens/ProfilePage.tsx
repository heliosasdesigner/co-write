import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import PageLayout from "../components/PageLayout";
import { storyRoomsStyles, authStyles } from "../styles";

interface Story {
  id: string;
  title: string;
  createdAt: Date;
  [key: string]: any;
}

const ProfilePage = () => {
  const [filter, setFilter] = useState("date");
  const [stories, setStories] = useState<Story[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(db, "stories"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Story[];
        setStories(data);
      } catch (error: unknown) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchUserStories();
  }, [user]);

  const sortedStories = [...stories].sort((a, b) => {
    if (filter === "az") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <PageLayout currentTab="Profile">
      <View style={storyRoomsStyles.header}>
        <Text style={storyRoomsStyles.headerTitle}>Profile</Text>
      </View>

      <View style={storyRoomsStyles.roomItem}>
        <Text style={authStyles.title}>👤</Text>
        <Text style={storyRoomsStyles.roomTitle}>
          {user?.email || "Username Placeholder"}
        </Text>
        <Text style={storyRoomsStyles.roomDescription}>
          Short Bio (optional)
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={storyRoomsStyles.roomTitle}>Filter:</Text>
          <Picker
            selectedValue={filter}
            style={{ flex: 1, height: 40 }}
            onValueChange={(itemValue) => setFilter(itemValue)}
          >
            <Picker.Item label="Date Made" value="date" />
            <Picker.Item label="A - Z" value="az" />
          </Picker>
        </View>

        <Text style={storyRoomsStyles.roomTitle}>PAST STORIES</Text>
        <FlatList
          data={sortedStories}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={storyRoomsStyles.roomItem}>
              <Text style={storyRoomsStyles.roomTitle}>
                {index + 1}. {item.title}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={storyRoomsStyles.emptyState}>
              <Text style={storyRoomsStyles.emptyStateText}>
                No stories found.
              </Text>
            </View>
          }
        />
      </View>
    </PageLayout>
  );
};

export default ProfilePage;
